import { useEffect, useMemo, useState } from 'react';
import { Balloon } from './components/Balloon';
import { SplashScreen } from './components/SplashScreen';
import { BannerConfigModal } from './components/BannerConfigModal';
import { secureArrayShuffle } from './utils/randomUtils';
import { AlertTriangle, HelpCircle, Dice5, Plus, Trash2, Upload } from 'lucide-react';

const BALLOON_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
const MESSAGES = {
  'pt-BR': {
    bannerDefault: 'BOA SORTE !',
    tabConfig: 'config',
    tabWinner: 'ganhador',
    wizardTitle: 'Configuração rápida',
    wizardCount: 'Quantos balões terá o sorteio?',
    wizardItems: 'Quais os textos (valores R$, itens ou nomes)? Separe por linha.',
    wizardSkip: 'Pular',
    wizardApply: 'Aplicar e continuar',
    prizesTitle: 'Prêmios (item, descrição, qtd, imagem)',
    tableItem: 'Item',
    tableDescription: 'Descrição',
    tableQty: 'Qtde',
    tableImage: 'Imagem',
    add: 'Adicionar',
    singleColor: 'Cor única dos balões',
    sound: 'Som',
    dark: 'Dark mode',
    language: 'Idioma',
    winnerTitle: 'Dados do Ganhador',
    name: 'Nome',
    prize: 'Prêmio',
    contact: 'Celular / Email',
    pix: 'Chave Pix',
    timestamp: 'Timestamp',
    ip: 'IP',
    audit: 'Auditoria',
    balloonsCount: '# balões',
    poppedCount: 'Estourados',
    saveReport: 'Salvar relatório (.txt)',
    clear: 'Limpar',
    statsRemaining: 'Restantes',
    statsPopped: 'Estourados',
    addImage: 'Upload',
    remove: 'Remover',
    sortAgain: 'Sortear novamente',
    headerHelp: 'Ajuda',
  },
  'en-US': {
    bannerDefault: 'GOOD LUCK!',
    tabConfig: 'settings',
    tabWinner: 'winner',
    wizardTitle: 'Quick setup',
    wizardCount: 'How many balloons?',
    wizardItems: 'Prize texts (one per line)',
    wizardSkip: 'Skip',
    wizardApply: 'Apply and continue',
    prizesTitle: 'Prizes (item, description, qty, image)',
    tableItem: 'Item',
    tableDescription: 'Description',
    tableQty: 'Qty',
    tableImage: 'Image',
    add: 'Add',
    singleColor: 'Single balloon color',
    sound: 'Sound',
    dark: 'Dark mode',
    language: 'Language',
    winnerTitle: 'Winner data',
    name: 'Name',
    prize: 'Prize',
    contact: 'Phone / Email',
    pix: 'Pix key',
    timestamp: 'Timestamp',
    ip: 'IP',
    audit: 'Audit',
    balloonsCount: '# balloons',
    poppedCount: 'Popped',
    saveReport: 'Save report (.txt)',
    clear: 'Clear',
    statsRemaining: 'Remaining',
    statsPopped: 'Popped',
    addImage: 'Upload',
    remove: 'Remove',
    sortAgain: 'Shuffle again',
    headerHelp: 'Help',
  },
} as const;

const DEFAULT_BANNER_TEXT = MESSAGES['pt-BR'].bannerDefault;
const diceAnimCss = `
@keyframes rollDice {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
}
`;

type PrizeItem = {
  id: number;
  description: string;
  qty: number;
  image?: string;
};

function createModernBanner(text: string, subtitle = ''): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 52px "Segoe UI", sans-serif';
  ctx.fillText(text, canvas.width / 2, subtitle ? canvas.height / 2 - 12 : canvas.height / 2);
  if (subtitle) {
    ctx.font = 'normal 26px "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 32);
  }
  return canvas.toDataURL('image/png');
}

// Wrapper garante fallback em ambientes sem Web Crypto (SSR / testes)
const safeShuffle = <T,>(arr: T[]) => {
  try {
    return secureArrayShuffle(arr);
  } catch {
    // Fallback não criptográfico apenas para não quebrar build/teste
    return [...arr].sort(() => Math.random() - 0.5);
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'winner' | null>(null);
  const [popped, setPopped] = useState<Record<number, { label: string; imageUrl?: string } | undefined>>({});
  const [prizes, setPrizes] = useState<PrizeItem[]>([
    { id: 1, description: 'Valor', qty: 2, image: '/valor.png' },
    { id: 2, description: 'Pontos', qty: 2, image: '/pontos.png' },
    { id: 3, description: 'Brinde', qty: 2, image: '/brinde.png' },
    { id: 4, description: 'Pessoa', qty: 2, image: '/pessoa.png' },
    { id: 5, description: 'Texto', qty: 1, image: '/texto.png' },
  ]);
  const [sound, setSound] = useState(true);
  const [singleColor, setSingleColor] = useState(false);
  const [language, setLanguage] = useState('pt-BR');
  const [bg, setBg] = useState<'gradient' | 'dark'>('dark');
  const [winner, setWinner] = useState({ name: '', prize: '', contact: '', pix: '' });
  const [bannerConfig, setBannerConfig] = useState({ imageUrl: '', altText: DEFAULT_BANNER_TEXT });
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [selectedPrizeIds, setSelectedPrizeIds] = useState<Set<number>>(new Set());
  const [isRolling, setIsRolling] = useState(false);
  const [rollTick, setRollTick] = useState(0);
  const [singleColorIndex, setSingleColorIndex] = useState(0);
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [wizardItems, setWizardItems] = useState('R$ 0,00\nR$ 5,00\nR$ 10,00');
  const [wizardBalloonCount, setWizardBalloonCount] = useState(12);
  const [publicIp, setPublicIp] = useState<string>('');

  const wizardItemsArray = useMemo(
    () => wizardItems.split(/\r?\n/).map((t) => t.trim()).filter(Boolean),
    [wizardItems]
  );

  const expandedPrizes = useMemo(() => {
    const list: { label: string; imageUrl?: string }[] = [];
    prizes.forEach((p) => {
      const times = Math.max(0, Math.min(99, p.qty || 0));
      for (let i = 0; i < times; i++) {
        list.push({ label: p.description || `Item ${p.id}`, imageUrl: p.image });
      }
    });
    return list;
  }, [prizes]);

  // Embaralha a lista de prêmios a cada nova rodada ou alteração
  const shuffledPrizes = useMemo(() => safeShuffle(safeShuffle(expandedPrizes)), [expandedPrizes, shuffleSeed]);

  const balloonCount = expandedPrizes.length;

  const balloons = useMemo(() => {
    let colors: string[];
    if (singleColor) {
      // Se estiver rolando, cicla rapidamente pela paleta para dar efeito
      if (isRolling) {
        colors = Array.from({ length: Math.max(balloonCount, 1) }, (_, i) =>
          BALLOON_COLORS[(i + rollTick) % BALLOON_COLORS.length]
        );
      } else {
        colors = Array(balloonCount).fill(BALLOON_COLORS[singleColorIndex % BALLOON_COLORS.length]);
      }
    } else {
      colors = safeShuffle(
        Array.from({ length: Math.max(balloonCount, 1) }, (_, i) => BALLOON_COLORS[i % BALLOON_COLORS.length])
      );
      if (isRolling) colors = safeShuffle(safeShuffle(colors));
    }
    return Array.from({ length: balloonCount || 0 }, (_, i) => ({ id: i + 1, color: colors[i] }));
  }, [balloonCount, singleColor, isRolling, rollTick]);

  useEffect(() => {
    setPopped({});
    setSelectedPrizeIds(new Set());
    setWinner((prev) => ({ ...prev, prize: '' }));
    // novo seed força reordenação dos prêmios revelados
    setShuffleSeed((s) => s + 1);
  }, [balloonCount, prizes]);

  // Animação visual e reembaralhamento durante o clique do dado
  useEffect(() => {
    if (!isRolling) return;
    const interval = setInterval(() => setRollTick((t) => t + 1), 140);
    const timeout = setTimeout(() => {
      setIsRolling(false);
      setRollTick(0);
      setShuffleSeed((s) => s + 1);
    }, 1200);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRolling]);

  // Injeta a animação do dado no documento (apenas uma vez)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleId = 'pixpoc-dice-anim';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = diceAnimCss;
    document.head.appendChild(style);
  }, []);

  // Busca IP público para exibir/auditar
  useEffect(() => {
    let cancelled = false;
    const fetchIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        if (!cancelled && data?.ip) setPublicIp(data.ip);
      } catch (e) {
        /* silencioso */
      }
    };
    fetchIp();
    return () => {
      cancelled = true;
    };
  }, []);

  // Banner default agora mostra apenas o texto sobre fundo transparente (sem imagem gerada)
  useEffect(() => {
    if (bannerConfig.imageUrl) return;
    setBannerConfig((prev) => ({ ...prev, altText: prev.altText || DEFAULT_BANNER_TEXT }));
  }, [bannerConfig.imageUrl, bannerConfig.altText]);

  const t = (key: keyof typeof MESSAGES['pt-BR']) =>
    (MESSAGES as any)[language]?.[key] ?? MESSAGES['pt-BR'][key];

  const applyWizard = () => {
    if (wizardItemsArray.length > 0) {
      const mapped: PrizeItem[] = wizardItemsArray.map((desc, idx) => ({ id: idx + 1, description: desc, qty: 1 }));
      setPrizes(mapped);
    }
    setShowWizard(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixpoc_wizard_done', 'true');
    }
  };

  const handlePop = (id: number) => {
    if (id in popped) return;
    const prize = shuffledPrizes.length ? shuffledPrizes[(Object.keys(popped).length) % shuffledPrizes.length] : undefined;
    setPopped((p) => ({ ...p, [id]: prize }));
  };

  const handleToggleHighlight = (id: number) => {
    if (!(id in popped)) return;
    setSelectedPrizeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      // Atualiza campo "Prêmio" do ganhador
      const orderedLabels = Array.from(next).map((pid) => popped[pid]?.label).filter(Boolean) as string[];
      setWinner((w) => ({ ...w, prize: orderedLabels.join(', ') }));
      return next;
    });
  };

  const playRollSound = () => {
    if (!sound) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      const playHit = (time: number) => {
        // low tom body
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, time);
        osc.frequency.exponentialRampToValueAtTime(90, time + 0.12);
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);

        // noise for snare-like rustle
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 2000;
        const ngain = ctx.createGain();
        ngain.gain.setValueAtTime(0.12, time);
        ngain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        noise.connect(bp);
        bp.connect(ngain);
        ngain.connect(ctx.destination);
        noise.start(time);
        noise.stop(time + 0.2);
      };

      const now = ctx.currentTime;
      const hits = 10;
      const spacing = 0.08; // seconds
      for (let i = 0; i < hits; i++) {
        playHit(now + i * spacing);
      }
    } catch (e) {
      /* ignore */
    }
  };

  const saveReport = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const lines = [
      'PixPoc - Relatório de Ganhador',
      `Data/Hora: ${now.toLocaleString(language)}`,
      `IP: ${publicIp || '-'}`,
      `Nome: ${winner.name || '-'}`,
      `Prêmio: ${winner.prize || '-'}`,
      `Contato: ${winner.contact || '-'}`,
      `Chave Pix: ${winner.pix || '-'}`,
      `Balões estourados: ${Object.keys(popped).length}/${balloonCount}`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PixPoc-${winner.name || 'ganhador'}-${stamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isDark = bg === 'dark';
  const bgStyle = isDark
    ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800'
    : 'bg-white';
  const textClass = isDark ? 'text-slate-100' : 'text-slate-900';
  const panelClass = isDark
    ? 'bg-slate-800/90 border-slate-700 text-slate-100 shadow-xl'
    : 'bg-white border-slate-200 text-slate-700 shadow-lg';
  const cardSoftBg = isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white/85 border-slate-200';
  const badgeClass = isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-700';
  const inputClass = (extra = '') =>
    `${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800'} ${extra}`;
  const headerClass = isDark ? 'backdrop-blur bg-slate-900/85 border-b border-slate-800 shadow-lg' : 'backdrop-blur bg-white/90 border-b border-slate-200 shadow-sm';
  const navActive = isDark ? 'bg-slate-800 text-white border-slate-600 shadow' : 'bg-white text-slate-900 border-slate-300 shadow';
  const navInactive = isDark ? 'bg-slate-800/50 text-slate-200 border-transparent hover:border-slate-600' : 'bg-white/70 text-slate-700 border-transparent hover:border-slate-200';
  const bannerButtonClass = isDark
    ? 'bg-transparent border-slate-700 hover:border-slate-600 shadow-none'
    : 'bg-white border-slate-200 hover:border-slate-300 shadow-inner';

  return (
    <>
      {showSplash && <SplashScreen onStart={() => setShowSplash(false)} language={language as 'pt-BR' | 'en-US'} />}

      <div className={`min-h-screen ${bgStyle} ${textClass}`}>
        {/* Header */}
        <header className={`sticky top-0 z-30 ${headerClass} bg-transparent border-none shadow-none`}>
          <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo-pixpoc.png" alt="PixPoc" className="h-24 sm:h-28 w-auto" />
            </div>
            <button
              onClick={() => setShowBannerModal(true)}
              className={`flex-1 h-14 sm:h-16 rounded-xl overflow-hidden relative focus:outline-none transition ${bannerButtonClass}`}
            >
              <div
                className="absolute inset-0 flex items-center justify-center text-slate-700 font-semibold px-3 sm:px-4 text-center text-lg sm:text-2xl md:text-3xl leading-tight truncate"
                style={bannerConfig.imageUrl
                  ? { backgroundImage: `url(${bannerConfig.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { backgroundColor: 'transparent', color: isDark ? '#e2e8f0' : undefined }}
                title={!bannerConfig.imageUrl ? (bannerConfig.altText || DEFAULT_BANNER_TEXT) : undefined}
              >
                {!bannerConfig.imageUrl && (bannerConfig.altText || t('bannerDefault'))}
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsRolling(true);
                  playRollSound();
                  setPopped({});
                  setShowSplash(false);
                  setSelectedPrizeIds(new Set());
                  setWinner((w) => ({ ...w, prize: '' }));
                  // escolhe uma cor diferente para o modo cor única
                  setSingleColorIndex((idx) => (idx + 1 + Math.floor(Math.random() * (BALLOON_COLORS.length - 1))) % BALLOON_COLORS.length);
                }}
                className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white shadow-[0_6px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.3)] active:scale-95 border border-emerald-600 flex items-center justify-center"
                title="Sortear novamente"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 border border-white/40 animate-[rollDice_1s_linear_infinite] text-lg shadow-inner">
                  🎲
                </span>
              </button>
              <button
                onClick={() => setShowSplash(true)}
                className="p-3 rounded-full bg-yellow-400 text-slate-900 shadow-md hover:shadow-lg active:scale-95 border border-yellow-500"
                title="Ajuda"
              >
                <HelpCircle size={18} />
              </button>
            </div>
          </div>
          <nav className={`max-w-6xl mx-auto px-4 pb-1 flex items-center gap-2 text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {[
              { id: 'config', label: t('tabConfig'), icon: '🎬' },
              { id: 'winner', label: t('tabWinner'), icon: '🏆' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(prev => prev === tab.id ? null : (tab.id as 'config' | 'winner'))}
                className={`group flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border transition cursor-pointer relative ${
                  activeTab === tab.id ? navActive : navInactive
                }`}
              >
                <span className={`absolute left-2 right-2 bottom-[2px] h-0.5 rounded-full transition-all duration-200 ${
                  activeTab === tab.id ? 'bg-sky-500 opacity-90' : 'bg-sky-500 opacity-0 group-hover:opacity-60'
                }`} />
                <span className="text-base">{tab.icon}</span>
                <span className="capitalize">{tab.label}</span>
              </button>
            ))}
            <div className="flex-1 flex items-center justify-end text-[11px] font-normal pr-1">
              <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Total: {Object.keys(popped).length}/{balloonCount}
              </span>
            </div>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto px-4 pb-10 space-y-4">
          {activeTab === 'config' && (
            <section className={`${panelClass} rounded-2xl p-3 sm:p-4 space-y-4 max-h-[70vh] min-h-[40vh] overflow-auto sm:max-h-none`}>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t('prizesTitle')}</span>
                  <button
                    type="button"
                    onClick={() => setPrizes((prev) => [...prev, { id: (prev.at(-1)?.id || 0) + 1, description: '', qty: 1 }])}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs shadow hover:shadow-md"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className={`overflow-x-auto rounded-lg ${isDark ? 'border border-slate-700 bg-slate-900/80' : 'border border-slate-200 bg-white/60'}`}>
                  <table className="w-full text-xs sm:text-sm">
                    <thead className={isDark ? 'bg-slate-800 text-slate-200 uppercase text-[11px]' : 'bg-slate-100 text-slate-600 uppercase text-[11px]'}>
                      <tr>
                        <th className="px-2 py-2 text-left">{t('tableItem')}</th>
                        <th className="px-2 py-2 text-left">{t('tableDescription')}</th>
                        <th className="px-2 py-2 text-left">{t('tableQty')}</th>
                        <th className="px-2 py-2 text-left">{t('tableImage')}</th>
                        <th className="px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {prizes.map((p, idx) => (
                        <tr key={p.id} className={idx % 2 ? (isDark ? 'bg-slate-800/60' : 'bg-white/40') : (isDark ? 'bg-slate-800/30' : 'bg-white/80')}>
                          <td className={`px-2 py-2 font-semibold ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{idx + 1}</td>
                          <td className="px-2 py-2">
                            <input
                              value={p.description}
                              onChange={(e) => setPrizes((prev) => prev.map((row) => row.id === p.id ? { ...row, description: e.target.value } : row))}
                              className={inputClass('w-full px-2 py-1 rounded-md text-sm')}
                              placeholder="Ex: R$ 10,00"
                            />
                          </td>
                          <td className="px-2 py-2 w-24">
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={p.qty}
                              onChange={(e) => {
                                const val = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                                setPrizes((prev) => prev.map((row) => row.id === p.id ? { ...row, qty: val } : row));
                              }}
                              className={inputClass('w-full px-2 py-1 rounded-md text-sm text-center')}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 cursor-pointer bg-white hover:border-slate-300 text-xs">
                                <Upload size={14} />
                                <span>{t('addImage')}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const dataUrl = ev.target?.result as string;
                                      setPrizes((prev) => prev.map((row) => row.id === p.id ? { ...row, image: dataUrl } : row));
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                              {p.image && (
                                <div className="w-10 h-10 rounded-md overflow-hidden border border-slate-200">
                                  <img src={p.image} alt="thumb" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right">
                            <button
                              onClick={() => setPrizes((prev) => prev.filter((row) => row.id !== p.id))}
                              className="text-red-500 hover:text-red-600"
                              title={t('remove')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {prizes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-slate-500 py-3">Adicione prêmios para compor o sorteio.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-xs text-slate-600">
                  Total de itens/balões: <strong>{balloonCount}</strong>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      label: t('singleColor'),
                      active: singleColor,
                      onToggle: () => setSingleColor(!singleColor),
                    },
                    {
                      label: t('sound'),
                      active: sound,
                      onToggle: () => setSound(!sound),
                    },
                    {
                      label: t('dark'),
                      active: bg === 'dark',
                      onToggle: () => setBg(bg === 'dark' ? 'gradient' : 'dark'),
                    },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                      <span className="font-medium">{item.label}</span>
                      <button
                        onClick={item.onToggle}
                        className={`relative w-14 h-7 rounded-full transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-400'}`}
                        type="button"
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            item.active ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex flex-col gap-1">
                  {t('language')}
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputClass('w-full px-3 py-2 rounded-lg')}>
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English</option>
                  </select>
                </label>
              </div>

            </section>
          )}

          {activeTab === 'winner' && (
            <section className={`${panelClass} rounded-2xl p-4 space-y-4 max-h-[70vh] min-h-[40vh] overflow-auto sm:max-h-none`}>
              <h2 className="text-lg font-bold flex items-center gap-2 text-amber-700">🏆 {t('winnerTitle')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <label className="flex flex-col gap-1">
                  {t('name')}
                  <input className={inputClass('w-full px-3 py-2 rounded-lg')} value={winner.name} onChange={(e)=>setWinner({...winner,name:e.target.value})} />
                </label>
                <label className="flex flex-col gap-1">
                  {t('prize')}
                  <input className={inputClass('w-full px-3 py-2 rounded-lg')} value={winner.prize} onChange={(e)=>setWinner({...winner,prize:e.target.value})} />
                </label>
                <label className="flex flex-col gap-1">
                  {t('contact')}
                  <input className={inputClass('w-full px-3 py-2 rounded-lg')} value={winner.contact} onChange={(e)=>setWinner({...winner,contact:e.target.value})} />
                </label>
                <label className="flex flex-col gap-1">
                  {t('pix')}
                  <input className={inputClass('w-full px-3 py-2 rounded-lg')} value={winner.pix} onChange={(e)=>setWinner({...winner,pix:e.target.value})} />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/70 border-slate-600' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="font-semibold">{t('timestamp')}</div>
                  <div>{new Date().toLocaleString(language)}</div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/70 border-slate-600' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="font-semibold">{t('ip')}</div>
                  <div className="truncate">{publicIp || '...'}</div>
                </div>
                <div className={`p-3 rounded-lg flex flex-col gap-1 ${isDark ? 'bg-slate-800/70 border-slate-600' : 'bg-amber-50 border border-amber-200'}`}>
                  <div className="font-semibold">{t('audit')}</div>
                  <span>{t('balloonsCount')}: {balloonCount}</span>
                  <span>{t('poppedCount')}: {Object.keys(popped).length}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={saveReport} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow hover:shadow-lg">{t('saveReport')}</button>
                <button onClick={()=>setWinner({name:'',prize:'',contact:'',pix:''})} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100">{t('clear')}</button>
              </div>
            </section>
          )}

            <section className={`rounded-2xl p-4 ${isDark ? '' : ''}`}>
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center"
              style={{
                gap: 'clamp(12px, 1.2vw, 20px)',
                ['--balloon-size' as any]: 'clamp(126px, 10.8vw, 190px)', // ~-10% no mobile
                ['--balloon-height' as any]: 'clamp(158px, 13.5vw, 234px)',
              }}
            >
              {balloons.map((b, idx) => (
                <Balloon
                  key={b.id}
                  number={b.id}
                  color={b.color}
                  onPop={handlePop}
                  isPopped={b.id in popped}
                  currency={popped[b.id] || null}
                  soundEnabled={sound}
                  isHighlighted={selectedPrizeIds.has(b.id)}
                  onToggleHighlight={handleToggleHighlight}
                  disableFloat
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <BannerConfigModal
        isOpen={showBannerModal}
        onClose={() => setShowBannerModal(false)}
        config={{
          imageUrl: bannerConfig.imageUrl,
          altText: bannerConfig.altText,
          linkUrl: '',
          isActive: true,
          maxViews: 0,
          currentViews: 0,
        }}
        onSave={(cfg) => {
          setBannerConfig(cfg);
          setShowBannerModal(false);
        }}
      />
    </>
  );
}
