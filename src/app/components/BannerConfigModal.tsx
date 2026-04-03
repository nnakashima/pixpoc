import { useState, useRef, useEffect } from 'react';
import { X, Link2, Wand2, Save, Sparkles, Search } from 'lucide-react';

interface BannerConfig {
  imageUrl: string;
  isActive: boolean;
  maxViews: number;
  currentViews: number;
  linkUrl: string;
  altText: string;
}

interface BannerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BannerConfig;
  onSave: (config: BannerConfig) => void;
}

type BannerStyle = 'modern' | 'festive' | 'minimal' | 'neon';

export function BannerConfigModal({ isOpen, onClose, config, onSave }: BannerConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'create'>('url');
  const [localConfig, setLocalConfig] = useState<BannerConfig>(config);
  const [imagePreview, setImagePreview] = useState<string>(config.imageUrl);
  
  // Create Banner States
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>('modern');
  const [useUnsplashBg, setUseUnsplashBg] = useState(false);
  const [unsplashImageUrl, setUnsplashImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const handleUrlChange = (url: string) => {
    setImagePreview(url);
    setLocalConfig({ ...localConfig, imageUrl: url });
  };

  const searchUnsplash = async () => {
    setIsSearching(true);
    try {
      // Usar Picsum Photos que não tem problema de CORS
      // Gera uma imagem aleatória de 1200x150px
      const randomId = Math.floor(Math.random() * 1000) + 1;
      const imageUrl = `https://picsum.photos/1200/150?random=${randomId}`;
      
      // Adicionar um pequeno delay para dar feedback visual
      setTimeout(() => {
        setUnsplashImageUrl(imageUrl);
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
      alert('Erro ao buscar imagem. Tente novamente.');
      setIsSearching(false);
    }
  };

  const generateBanner = async () => {
    if (!bannerTitle.trim()) {
      alert('Por favor, adicione um título para o banner!');
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsGenerating(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      // Dimensões do banner (horizontal)
      canvas.width = 1200;
      canvas.height = 150;

      // Se tiver imagem de fundo do Unsplash, carregar primeiro
      if (useUnsplashBg && unsplashImageUrl) {
        try {
          const bgImg = await loadImage(unsplashImageUrl);
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          
          // Overlay mais escuro para garantir legibilidade
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } catch (error) {
          console.error('Erro ao carregar imagem de fundo:', error);
          // Se falhar, usar gradiente
          drawGradientBackground(ctx, canvas, bannerStyle);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        // Usar gradiente baseado no estilo
        drawGradientBackground(ctx, canvas, bannerStyle);
        
        // Adicionar overlay para melhor legibilidade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Configurar texto
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Desenhar título
      const titleY = bannerSubtitle ? canvas.height / 2 - 15 : canvas.height / 2;
      drawStyledText(ctx, bannerTitle, canvas.width / 2, titleY, bannerStyle, 'title');

      // Desenhar subtítulo se existir
      if (bannerSubtitle.trim()) {
        drawStyledText(ctx, bannerSubtitle, canvas.width / 2, canvas.height / 2 + 25, bannerStyle, 'subtitle');
      }

      // Adicionar decoração baseada no estilo (apenas se não tiver imagem de fundo)
      if (!useUnsplashBg || !unsplashImageUrl) {
        drawDecorations(ctx, canvas, bannerStyle);
      }

      // Converter para data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setImagePreview(dataUrl);
      setLocalConfig({ ...localConfig, imageUrl: dataUrl });
    } catch (error) {
      console.error('Erro ao gerar banner:', error);
      alert('Erro ao gerar banner. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function para carregar imagem com Promise
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const drawGradientBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, style: BannerStyle) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    switch (style) {
      case 'modern':
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        break;
      case 'festive':
        gradient.addColorStop(0, '#f093fb');
        gradient.addColorStop(0.5, '#f5576c');
        gradient.addColorStop(1, '#ffd140');
        break;
      case 'minimal':
        gradient.addColorStop(0, '#485563');
        gradient.addColorStop(1, '#29323c');
        break;
      case 'neon':
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(1, '#ff00ff');
        break;
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawStyledText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, style: BannerStyle, type: 'title' | 'subtitle') => {
    const isTitle = type === 'title';
    const fontSize = isTitle ? 48 : 24;
    const fontWeight = isTitle ? 'bold' : 'normal';
    
    // Sombra do texto para melhor legibilidade
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Estilo de fonte baseado no estilo do banner
    let fontFamily = 'Arial, sans-serif';
    if (style === 'modern') fontFamily = '"Segoe UI", Tahoma, sans-serif';
    if (style === 'festive') fontFamily = 'Comic Sans MS, cursive, sans-serif';
    if (style === 'minimal') fontFamily = 'Helvetica, Arial, sans-serif';
    if (style === 'neon') fontFamily = 'Impact, fantasy';

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    
    // Cor do texto baseada no estilo
    let textColor = '#ffffff';
    if (style === 'neon') {
      textColor = '#00ff00';
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 20;
    }
    
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);

    // Resetar sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  const drawDecorations = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, style: BannerStyle) => {
    if (style === 'festive') {
      // Adicionar confetes
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 10 + 5;
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#f7dc6f'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
      }
    } else if (style === 'neon') {
      // Adicionar linhas neon
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.moveTo(50, canvas.height / 2);
      ctx.lineTo(150, canvas.height / 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(canvas.width - 150, canvas.height / 2);
      ctx.lineTo(canvas.width - 50, canvas.height / 2);
      ctx.stroke();
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else if (style === 'minimal') {
      // Adicionar linha simples no topo e embaixo
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      
      ctx.beginPath();
      ctx.moveTo(100, 20);
      ctx.lineTo(canvas.width - 100, 20);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(100, canvas.height - 20);
      ctx.lineTo(canvas.width - 100, canvas.height - 20);
      ctx.stroke();
      
      ctx.globalAlpha = 1;
    }
  };

  const handleSave = () => {
    if (!localConfig.imageUrl) {
      alert('Por favor, adicione uma imagem para o banner!');
      return;
    }
    onSave(localConfig);
    onClose();
  };

  const styles: { id: BannerStyle; name: string; emoji: string; desc: string }[] = [
    { id: 'modern', name: 'Moderno', emoji: '🎨', desc: 'Gradiente roxo elegante' },
    { id: 'festive', name: 'Festivo', emoji: '🎉', desc: 'Cores vibrantes e confetes' },
    { id: 'minimal', name: 'Minimalista', emoji: '⚡', desc: 'Simples e sofisticado' },
    { id: 'neon', name: 'Neon', emoji: '💫', desc: 'Estilo cyberpunk brilhante' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            Configuração de Banner
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Banner Status */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${localConfig.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="font-semibold text-gray-800 text-sm">
                Status: {localConfig.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.isActive}
                onChange={(e) => setLocalConfig({ ...localConfig, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm transition-all ${
                activeTab === 'url'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Link2 size={16} />
              URL de Imagem
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm transition-all ${
                activeTab === 'create'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Wand2 size={16} />
              Criar com IA
            </button>
          </div>

          {/* Tab Content - URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Hospede sua imagem no Google Drive, Dropbox ou outro serviço de nuvem e copie o link público aqui.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🔗 URL da Imagem do Banner
                </label>
                <input
                  type="url"
                  value={localConfig.imageUrl.startsWith('data:') ? '' : localConfig.imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Tab Content - Create */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  ✨ <strong>Crie seu banner personalizado com Inteligência Artificial!</strong> Preencha os campos abaixo e clique em "Gerar Banner".
                </p>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📝 Título do Banner *
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Ex: Sorteio R$ 500,00"
                  maxLength={50}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📄 Subtítulo (Opcional)
                </label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Ex: Participe agora!"
                  maxLength={50}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                />
              </div>

              {/* Estilo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🎨 Estilo do Banner
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((styleOption) => (
                    <button
                      key={styleOption.id}
                      onClick={() => setBannerStyle(styleOption.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        bannerStyle === styleOption.id
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-white border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{styleOption.emoji}</span>
                        <span className="font-semibold text-sm">{styleOption.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">{styleOption.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Usar imagem do Unsplash */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useUnsplashBg}
                    onChange={(e) => setUseUnsplashBg(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="text-sm font-bold text-gray-700">
                    🖼️ Adicionar imagem de fundo aleatória
                  </span>
                </label>
              </div>

              {/* Buscar imagem */}
              {useUnsplashBg && (
                <div className="space-y-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      ✨ Clique no botão abaixo para adicionar uma imagem de fundo aleatória ao seu banner!
                    </p>
                  </div>
                  <button
                    onClick={searchUnsplash}
                    disabled={isSearching}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Search size={16} />
                    {isSearching ? 'Carregando...' : 'Carregar Imagem de Fundo'}
                  </button>
                  {unsplashImageUrl && (
                    <div className="text-center">
                      <p className="text-xs text-green-600 font-semibold">✓ Imagem carregada! Clique em "Gerar Banner" para criar.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Botão Gerar */}
              <button
                onClick={generateBanner}
                disabled={isGenerating || !bannerTitle.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Wand2 size={20} />
                {isGenerating ? 'Gerando...' : 'Gerar Banner Grátis'}
              </button>
            </div>
          )}

          {/* Canvas oculto para geração */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Image Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👁️ Preview do Banner
              </label>
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Preview do banner"
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '120px' }}
                  onError={() => {
                    setImagePreview('');
                    alert('Erro ao carregar imagem. Verifique a URL.');
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium flex items-center gap-1 text-sm"
          >
            <Save size={16} />
            Salvar Banner
          </button>
        </div>
      </div>
    </div>
  );
}