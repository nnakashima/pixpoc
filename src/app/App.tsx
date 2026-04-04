import { useState, useEffect } from 'react';
import { Balloon } from './components/Balloon';
import { SettingsPanel } from './components/SettingsPanel';
import { SplashScreen } from './components/SplashScreen';
import { Banner } from './components/Banner';
import { BannerConfigModal } from './components/BannerConfigModal';
import { AlertTriangle } from 'lucide-react';
import { X, CheckCircle, Trash2, User, HelpCircle } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
// Use banner from public folder for production
const bannerImage = '/banner-pixpoc.png';
const faviconImage = '/favicon.svg';
import {
  trackBalloonPop,
  trackRaffleCreated,
  trackBannerView,
  trackBannerConfigAccess,
  trackPasswordAttempt,
  trackHelpAccess,
  trackSoundToggle,
  trackColorModeToggle,
} from './utils/analytics';

const BALLOON_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Orange
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B500', // Gold
  '#FF69B4', // Pink
];

// Embaralha array usando Web Crypto API com Fisher-Yates
function secureArrayShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Rejection sampling para evitar viés
    const maxValue = Math.pow(2, 32);
    const range = i + 1;
    let randomIndex: number;
    
    do {
      const randomValues = new Uint32Array(1);
      crypto.getRandomValues(randomValues);
      randomIndex = randomValues[0];
    } while (randomIndex >= maxValue - (maxValue % range));
    
    randomIndex = randomIndex % range;
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  
  return shuffled;
}

interface BannerConfig {
  imageUrl: string;
  isActive: boolean;
  maxViews: number;
  currentViews: number;
  linkUrl: string;
  altText: string;
}

export default function App() {
  const [balloonCount, setBalloonCount] = useState(12);
  const [singleColor, setSingleColor] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSingleColor, setCurrentSingleColor] = useState(BALLOON_COLORS[0]);
  
  // Banner Configuration State
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() => {
    const saved = localStorage.getItem('pixpoc_banner_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Garantir que imageUrl seja atualizado para o novo banner
        return {
          ...parsed,
          imageUrl: bannerImage, // Sempre usar o novo banner
          isActive: parsed.isActive !== undefined ? parsed.isActive : true
        };
      } catch (e) {
        console.error('Erro ao ler banner config do localStorage:', e);
      }
    }
    return {
      imageUrl: bannerImage,
      isActive: true,
      maxViews: 0, // 0 = ilimitado
      currentViews: 0,
      linkUrl: '',
      altText: 'Banner PixPoc - Estourando a Boca do Balão'
    };
  });
  const [showBannerConfig, setShowBannerConfig] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  // Prêmios personalizáveis - valores monetários por padrão
  const [prizeSelections, setPrizeSelections] = useState<{ [key: string]: number }>({
    'R$ 0,00': 1, 'R$ 0,05': 1, 'R$ 0,10': 1, 'R$ 0,25': 1, 'R$ 0,50': 1, 
    'R$ 1,00': 1, 'R$ 2,00': 1, 'R$ 5,00': 1, 'R$ 10,00': 1, 'R$ 20,00': 1, 
    'R$ 50,00': 1, 'R$ 100,00': 1, 'R$ 200,00': 0
  });
  const [poppedBalloons, setPoppedBalloons] = useState<{ [key: number]: string }>({});
  const [balloons, setBalloons] = useState<Array<{ id: number; color: string }>>([]);
  const [balloonCurrencyMap, setBalloonCurrencyMap] = useState<{ [key: number]: string }>({});
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateSelections, setDuplicateSelections] = useState<string[]>([]);
  const [pendingBalloonCount, setPendingBalloonCount] = useState<number | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [ipAddress, setIpAddress] = useState<string>('Carregando...');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({
    name: '',
    reference: '',
    pixKey: ''
  });
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleProgress, setShuffleProgress] = useState(0);
  const [shufflingColors, setShufflingColors] = useState<string[]>([]);
  const [highlightedBalloons, setHighlightedBalloons] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch IP address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('Indisponível'));
  }, []);

  // Update favicon
  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = faviconImage;
    }
  }, []);

  // Initialize balloons on mount
  useEffect(() => {
    const initialBalloons = Array.from({ length: balloonCount }, (_, i) => ({
      id: i + 1,
      color: singleColor ? BALLOON_COLORS[0] : BALLOON_COLORS[i % BALLOON_COLORS.length],
    }));
    setBalloons(initialBalloons);
  }, []);

  useEffect(() => {
    resetBalloons();
  }, [balloonCount, singleColor, prizeSelections]);

  const resetBalloons = () => {
    let shuffledColors: string[];
    
    if (singleColor) {
      // Escolher uma cor aleatória diferente da atual
      const availableColors = BALLOON_COLORS.filter(color => color !== currentSingleColor);
      const randomValues = new Uint32Array(1);
      crypto.getRandomValues(randomValues);
      const randomIndex = randomValues[0] % availableColors.length;
      const newColor = availableColors[randomIndex];
      setCurrentSingleColor(newColor);
      shuffledColors = Array.from({ length: balloonCount }, () => newColor);
    } else {
      // Embaralhar as cores dos balões para criar efeito de "reembaralhamento"
      shuffledColors = secureArrayShuffle(
        Array.from({ length: balloonCount }, (_, i) => BALLOON_COLORS[i % BALLOON_COLORS.length])
      );
    }
    
    const newBalloons = Array.from({ length: balloonCount }, (_, i) => ({
      id: i + 1,
      color: shuffledColors[i],
    }));
    setBalloons(newBalloons);
    setPoppedBalloons({});
    
    // Criar mapeamento fixo 1:1 entre balões e valores
    // Só cria o mapeamento se as quantidades forem iguais
    const totalSelectedValues = Object.values(prizeSelections).reduce((acc, count) => acc + count, 0);
    if (balloonCount === totalSelectedValues) {
      const shuffledCurrencies: string[] = [];
      Object.keys(prizeSelections).forEach(key => {
        for (let i = 0; i < prizeSelections[key]; i++) {
          shuffledCurrencies.push(key);
        }
      });
      const shuffled = secureArrayShuffle(shuffledCurrencies);
      const newMap: { [key: number]: string } = {};
      
      for (let i = 0; i < balloonCount; i++) {
        newMap[i + 1] = shuffled[i];
      }
      
      setBalloonCurrencyMap(newMap);
    } else {
      setBalloonCurrencyMap({});
    }
  };

  const handlePopBalloon = (number: number) => {
    // Verificar se o jogo está válido (mesma quantidade de balões e valores)
    if (balloonCount !== Object.keys(prizeSelections).reduce((acc, key) => acc + prizeSelections[key], 0)) {
      return; // Não faz nada se as quantidades não forem iguais
    }

    // Revelar o valor pré-atribuído a este balão
    const currency = balloonCurrencyMap[number];
    if (currency) {
      setPoppedBalloons(prev => {
        const newPopped = {
          ...prev,
          [number]: currency,
        };
        trackBalloonPop(number, currency, Object.keys(newPopped).length);
        return newPopped;
      });
    }
  };

  const handleReset = () => {
    if (isShuffling) return; // Evita múltiplos cliques
    
    // IMEDIATAMENTE resetar os balões e limpar destaques
    setPoppedBalloons({});
    setHighlightedBalloons(null);
    
    // Track raffle creation
    const totalPrizes = Object.values(prizeSelections).reduce((acc, count) => acc + count, 0);
    trackRaffleCreated(balloonCount, singleColor, totalPrizes);
    
    setIsShuffling(true);
    setShuffleProgress(0);
    
    // Tocar som de processamento eletrônico
    if (soundEnabled) {
      playProcessingSound();
    }
    
    // Animar o progresso de 0 a 100 em 1.5 segundos
    const duration = 1500; // 1.5 segundos
    const steps = 60; // 60 frames
    const increment = 100 / steps;
    const stepDuration = duration / steps;
    
    // Iniciar animação rápida de mudança de cores
    const colorChangeInterval = setInterval(() => {
      if (singleColor) {
        // Todos os balões mudam para a mesma cor aleatória
        const randomColorIndex = Math.floor(Math.random() * BALLOON_COLORS.length);
        const randomColor = BALLOON_COLORS[randomColorIndex];
        setShufflingColors(Array(balloonCount).fill(randomColor));
      } else {
        // Cada balão muda para uma cor aleatória independente
        const randomColors = Array.from({ length: balloonCount }, () => {
          const randomIndex = Math.floor(Math.random() * BALLOON_COLORS.length);
          return BALLOON_COLORS[randomIndex];
        });
        setShufflingColors(randomColors);
      }
    }, 50); // Muda as cores a cada 50ms (super rápido!)
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setShuffleProgress(Math.min(currentStep * increment, 100));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        clearInterval(colorChangeInterval);
        // Após completar a animação, finalizar o shuffle com cores definitivas
        setTimeout(() => {
          setShufflingColors([]);
          resetBalloons();
          setIsShuffling(false);
          setShuffleProgress(0);
        }, 100);
      }
    }, stepDuration);
  };

  // Função para criar som eletrônico de processamento
  const playProcessingSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 1.5; // 1.5 segundos
    
    // Tic-tac de relógio mecânico (alternando entre duas frequências)
    const tickTocks = [
      { freq: 800, time: 0.0, duration: 0.05, volume: 0.3 },    // Tic
      { freq: 600, time: 0.15, duration: 0.05, volume: 0.25 },  // Tac
      { freq: 800, time: 0.30, duration: 0.05, volume: 0.3 },   // Tic
      { freq: 600, time: 0.45, duration: 0.05, volume: 0.25 },  // Tac
      { freq: 800, time: 0.60, duration: 0.05, volume: 0.3 },   // Tic
      { freq: 600, time: 0.75, duration: 0.05, volume: 0.25 },  // Tac
      { freq: 800, time: 0.90, duration: 0.05, volume: 0.3 },   // Tic
      { freq: 600, time: 1.05, duration: 0.05, volume: 0.25 },  // Tac
      { freq: 800, time: 0.120, duration: 0.05, volume: 0.3 },   // Tic
      { freq: 600, time: 0.135, duration: 0.05, volume: 0.25 },  // Tac final
    ];
    
    // Criar tic-tac mecânico
    tickTocks.forEach(tick => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Som percussivo tipo clique de relógio
      oscillator.type = 'sine';
      oscillator.frequency.value = tick.freq;
      
      const startTime = audioContext.currentTime + tick.time;
      const endTime = startTime + tick.duration;
      
      // Envelope muito curto para som de "clique"
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(tick.volume, startTime + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
      
      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
    
    // Adicionar componente de "madeira/mecânico" (ruído branco filtrado)
    tickTocks.forEach(tick => {
      // Criar buffer de ruído branco
      const bufferSize = audioContext.sampleRate * tick.duration;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Preencher com ruído branco
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = audioContext.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = tick.freq;
      noiseFilter.Q.value = 10;
      
      const noiseGain = audioContext.createGain();
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      
      const startTime = audioContext.currentTime + tick.time;
      
      noiseGain.gain.setValueAtTime(0, startTime);
      noiseGain.gain.linearRampToValueAtTime(0.08, startTime + 0.001);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + tick.duration);
      
      noise.start(startTime);
      noise.stop(startTime + tick.duration);
    });
    
    // Tom grave de tensão crescente (opcional - pode comentar se preferir apenas tic-tac)
    const tension = audioContext.createOscillator();
    const tensionGain = audioContext.createGain();
    
    tension.connect(tensionGain);
    tensionGain.connect(audioContext.destination);
    
    tension.type = 'triangle';
    tension.frequency.value = 55; // A1 (grave profundo)
    
    const tensionStart = audioContext.currentTime;
    tensionGain.gain.setValueAtTime(0, tensionStart);
    tensionGain.gain.linearRampToValueAtTime(0.05, tensionStart + 0.3);
    tensionGain.gain.setValueAtTime(0.05, tensionStart + 1.2);
    tensionGain.gain.linearRampToValueAtTime(0, tensionStart + 1.5);
    
    tension.start(tensionStart);
    tension.stop(tensionStart + 1.5);
  };

  const handleDuplicateModalClose = () => {
    setShowDuplicateModal(false);
    setDuplicateSelections([]);
    setPendingBalloonCount(null);
  };

  const handleDuplicateModalConfirm = () => {
    if (pendingBalloonCount !== null && duplicateSelections.length === pendingBalloonCount - Object.keys(prizeSelections).length) {
      // Criar nova lista com todos os valores únicos + duplicados
      const newPrizeSelections: { [key: string]: number } = { ...prizeSelections };
      duplicateSelections.forEach(value => {
        if (newPrizeSelections[value]) {
          newPrizeSelections[value]++;
        } else {
          newPrizeSelections[value] = 1;
        }
      });
      setPrizeSelections(newPrizeSelections);
      setBalloonCount(pendingBalloonCount);
    }
    handleDuplicateModalClose();
  };

  const handleBalloonCountChange = (newCount: number) => {
    setBalloonCount(newCount);
  };

  const toggleDuplicateValue = (value: string) => {
    if (duplicateSelections.includes(value)) {
      setDuplicateSelections(duplicateSelections.filter(v => v !== value));
    } else {
      setDuplicateSelections([...duplicateSelections, value]);
    }
  };

  const handleOpenWinnerModal = () => {
    setShowWinnerModal(true);
  };

  const handleCloseWinnerModal = () => {
    setShowWinnerModal(false);
  };

  const handleClearWinnerInfo = () => {
    setWinnerInfo({
      name: '',
      reference: '',
      pixKey: ''
    });
  };

  const handleSaveWinnerInfo = () => {
    setShowWinnerModal(false);
    trackWinnerInfoSaved(
      !!winnerInfo.name,
      !!winnerInfo.reference,
      !!winnerInfo.pixKey
    );
  };

  const handleToggleBalloonHighlight = (number: number) => {
    // Só alterna o destaque se o balão já foi estourado
    if (number in poppedBalloons) {
      const newHighlightedBalloon = highlightedBalloons === number ? null : number;
      setHighlightedBalloons(newHighlightedBalloon);
      
      // Se destacou um balão, copiar o valor para o campo "Referência do Prêmio"
      if (newHighlightedBalloon !== null) {
        const prize = poppedBalloons[number];
        setWinnerInfo(prev => ({
          ...prev,
          reference: prize
        }));
        trackBalloonHighlight(number, prize, true);
      } else {
        // Se desmarcou todos os balões, limpar o campo "Referência do Prêmio"
        setWinnerInfo(prev => ({
          ...prev,
          reference: ''
        }));
      }
    }
  };

  // Banner functions
  const handleBannerView = () => {
    setBannerConfig(prev => {
      const updated = { ...prev, currentViews: prev.currentViews + 1 };
      localStorage.setItem('pixpoc_banner_config', JSON.stringify(updated));
      trackBannerView(updated.imageUrl, updated.currentViews);
      return updated;
    });
  };

  const handleSaveBannerConfig = (config: BannerConfig) => {
    setBannerConfig(config);
    localStorage.setItem('pixpoc_banner_config', JSON.stringify(config));
    trackBannerConfigAccess(true);
  };

  const shouldShowBanner = () => {
    console.log('Banner check:', {
      isActive: bannerConfig.isActive,
      hasWinnerInfo: !!(winnerInfo.name || winnerInfo.reference || winnerInfo.pixKey),
      maxViews: bannerConfig.maxViews,
      currentViews: bannerConfig.currentViews,
      imageUrl: bannerConfig.imageUrl
    });
    
    if (!bannerConfig.isActive) return false;
    if (!(winnerInfo.name || winnerInfo.reference || winnerInfo.pixKey)) {
      // Banner só aparece se não houver dados do ganhador
      if (bannerConfig.maxViews === 0) return true; // Ilimitado
      return bannerConfig.currentViews < bannerConfig.maxViews;
    }
    return false;
  };

  const handleOpenBannerConfig = () => {
    setShowPasswordModal(true);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '5Eyl@eU!') {
      setShowPasswordModal(false);
      setShowBannerConfig(true);
      setPasswordInput('');
      setPasswordError(false);
      trackPasswordAttempt(true);
    } else {
      setPasswordError(true);
      trackPasswordAttempt(false);
    }
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onStart={() => setShowSplash(false)} />}

      {/* Main App */}
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Timestamp and IP info - top left */}
        <div className="fixed top-4 left-4 z-40 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-lg border border-white/20 text-white text-xs shadow-xl">
          <div className="font-semibold mb-1">📅 {currentDateTime.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          })} - {currentDateTime.toLocaleTimeString('pt-BR')}</div>
          <div className="text-white/80">🌐 IP: {ipAddress}</div>
        </div>

        {/* Help button - top right */}
        <button
          onClick={() => setShowSplash(true)}
          className="fixed top-4 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-xl transition-all hover:scale-110"
          title="Como Usar"
        >
          <HelpCircle size={20} />
        </button>

        {/* Banner Config button - top right, next to Help */}
        <button
          onClick={handleOpenBannerConfig}
          className="fixed top-4 right-16 z-40 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-xl transition-all hover:scale-110"
          title="Configurar Banner"
        >
          <ImageIcon size={20} />
        </button>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="p-6 border-b border-white/10">
            <div className="max-w-7xl mx-auto text-center">
              {/* Banner para monetização - só aparece se NÃO houver dados do ganhador */}
              {shouldShowBanner() && (
                <div className="mx-auto max-w-4xl">
                  <Banner
                    imageUrl={bannerConfig.imageUrl}
                    linkUrl={bannerConfig.linkUrl}
                    altText={bannerConfig.altText}
                    onView={handleBannerView}
                  />
                </div>
              )}
              
              {/* Winner info - below title, centered */}
              {(winnerInfo.name || winnerInfo.reference || winnerInfo.pixKey) && (
                <div className={`${shouldShowBanner() ? 'mt-4' : ''} mx-auto bg-yellow-400/95 backdrop-blur-lg px-4 py-3 rounded-lg border-2 border-yellow-500 shadow-xl text-gray-900 w-fit max-w-md`}>
                  <div className="font-bold text-sm text-center border-b-2 border-gray-900/30 pb-1 mb-2">
                    🏆 Ganhador
                  </div>
                  {winnerInfo.name && (
                    <div className="text-xs mb-1">
                      <span className="font-semibold">Nome:</span> {winnerInfo.name}
                    </div>
                  )}
                  {winnerInfo.reference && (
                    <div className="text-xs mb-1">
                      <span className="font-semibold">Ref:</span> {winnerInfo.reference}
                    </div>
                  )}
                  {winnerInfo.pixKey && (
                    <div className="text-xs">
                      <span className="font-semibold">PIX:</span> {winnerInfo.pixKey}
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Balloon canvas */}
          <main className="flex-1 p-6 md:p-12 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {/* Warning if counts don't match */}
              {balloonCount !== Object.keys(prizeSelections).reduce((acc, key) => acc + prizeSelections[key], 0) && (
                <div className="mb-6 mx-auto max-w-2xl bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={24} />
                  <div className="text-white">
                    <div className="font-bold mb-1">Atenção: Sorteio Bloqueado!</div>
                    <p className="text-sm text-white/90">
                      Para garantir a lisura do sorteio, o número de balões ({balloonCount}) deve ser igual ao número de valores de moeda selecionados ({Object.keys(prizeSelections).reduce((acc, key) => acc + prizeSelections[key], 0)}).
                    </p>
                    <p className="text-sm text-white/90 mt-2">
                      Por favor, ajuste as configurações no painel lateral.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
                {balloons.map((balloon, index) => (
                  <Balloon
                    key={balloon.id}
                    number={balloon.id}
                    color={shufflingColors.length > 0 ? shufflingColors[index] : balloon.color}
                    onPop={handlePopBalloon}
                    isPopped={balloon.id in poppedBalloons}
                    currency={poppedBalloons[balloon.id] || null}
                    soundEnabled={soundEnabled}
                    isHighlighted={highlightedBalloons === balloon.id}
                    onToggleHighlight={handleToggleBalloonHighlight}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 flex justify-center gap-6 text-white">
                <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                  <span className="text-sm opacity-70">Balões Restantes: </span>
                  <span className="font-bold text-lg">{balloonCount - Object.keys(poppedBalloons).length}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20">
                  <span className="text-sm opacity-70">Estourados: </span>
                  <span className="font-bold text-lg">{Object.keys(poppedBalloons).length}</span>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Settings panel */}
        <aside className="lg:w-80 lg:h-screen lg:sticky lg:top-0">
          <SettingsPanel
            balloonCount={balloonCount}
            setBalloonCount={handleBalloonCountChange}
            singleColor={singleColor}
            setSingleColor={setSingleColor}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            prizeSelections={prizeSelections}
            setPrizeSelections={setPrizeSelections}
            onReset={handleReset}
            onScreenshot={handleOpenWinnerModal}
            isShuffling={isShuffling}
            shuffleProgress={shuffleProgress}
          />
        </aside>

        {/* Duplicate Modal */}
        {showDuplicateModal && pendingBalloonCount !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Selecione Valores para Duplicar</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors" 
                  onClick={handleDuplicateModalClose}
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                Você selecionou <strong>{pendingBalloonCount} balões</strong>, mas existem apenas <strong>{Object.keys(prizeSelections).length} valores únicos</strong>.
                <br />
                Selecione <strong>{pendingBalloonCount - Object.keys(prizeSelections).length} valor(es)</strong> para serem duplicados no sorteio:
              </p>
              
              <div className="mb-6 max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                {Object.keys(prizeSelections).map((prize) => (
                  <label
                    key={prize}
                    className="flex items-center gap-3 text-gray-800 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={duplicateSelections.includes(prize)}
                      onChange={() => toggleDuplicateValue(prize)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="font-medium">{prize}</span>
                  </label>
                ))}
              </div>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selecionados:</strong> {duplicateSelections.length} de {pendingBalloonCount - Object.keys(prizeSelections).length} necessários
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                  onClick={handleDuplicateModalClose}
                >
                  Cancelar
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    duplicateSelections.length === pendingBalloonCount - Object.keys(prizeSelections).length
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={handleDuplicateModalConfirm}
                  disabled={duplicateSelections.length !== pendingBalloonCount - Object.keys(prizeSelections).length}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Winner Info Modal */}
        {showWinnerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={28} className="text-yellow-500" />
                  Dados do Ganhador
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors" 
                  onClick={handleCloseWinnerModal}
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Preencha as informações abaixo (todos os campos são opcionais). As informações serão exibidas no canto superior direito da tela para facilitar o print nativo do dispositivo.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🏆 Nome do Ganhador
                  </label>
                  <input
                    type="text"
                    value={winnerInfo.name}
                    onChange={(e) => setWinnerInfo({ ...winnerInfo, name: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Referência do Prêmio
                  </label>
                  <input
                    type="text"
                    value={winnerInfo.reference}
                    onChange={(e) => setWinnerInfo({ ...winnerInfo, reference: e.target.value })}
                    placeholder="Ex: Sorteio Live 29/03/2026"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💰 Chave PIX para Transferência
                  </label>
                  <input
                    type="text"
                    value={winnerInfo.pixKey}
                    onChange={(e) => setWinnerInfo({ ...winnerInfo, pixKey: e.target.value })}
                    placeholder="Ex: 11987654321 ou email@exemplo.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Dica:</strong> Use o print nativo do seu dispositivo (PrtScn no Windows, Cmd+Shift+3 no Mac, botão físico no mobile) para capturar a tela com todas as informações!
                </p>
              </div>
              
              <div className="flex justify-between gap-3">
                <button 
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-2" 
                  onClick={handleClearWinnerInfo}
                >
                  <Trash2 size={16} />
                  Limpar Dados
                </button>
                <div className="flex gap-3">
                  <button 
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                    onClick={handleCloseWinnerModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium flex items-center gap-2"
                    onClick={handleSaveWinnerInfo}
                  >
                    <CheckCircle size={18} />
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Config Modal */}
        <BannerConfigModal
          isOpen={showBannerConfig}
          onClose={() => setShowBannerConfig(false)}
          config={bannerConfig}
          onSave={handleSaveBannerConfig}
        />

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Configurar Banner</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors" 
                  onClick={() => setShowPasswordModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                Para configurar o banner, insira a senha de acesso:
              </p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Ex: %6WmoDF76$re30!hgf5%67&"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      Senha incorreta. Tente novamente.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button 
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium flex items-center gap-2"
                    type="submit"
                  >
                    <CheckCircle size={18} />
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}