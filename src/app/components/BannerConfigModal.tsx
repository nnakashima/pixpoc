import { useState, useRef, useEffect } from 'react';
import { X, Wand2, Save, Sparkles } from 'lucide-react';

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
  const [localConfig, setLocalConfig] = useState<BannerConfig>(config);
  const [imagePreview, setImagePreview] = useState<string>(config.imageUrl);
  
  // Create Banner States
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sincroniza o modal sempre que for reaberto ou o config for alterado externamente
  useEffect(() => {
    setLocalConfig(config);
    setImagePreview(config.imageUrl);
    setBannerTitle(config.altText || '');
    setBannerSubtitle('');
  }, [config, isOpen]);

  if (!isOpen) return null;

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

      // Usar gradiente baseado no estilo
      drawGradientBackground(ctx, canvas, bannerStyle);
      // Overlay leve para legibilidade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      drawDecorations(ctx, canvas, bannerStyle);

      // Converter para data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setImagePreview(dataUrl);
      setLocalConfig({ ...localConfig, imageUrl: dataUrl, altText: bannerTitle.trim() });
    } catch (error) {
      console.error('Erro ao gerar banner:', error);
      alert('Erro ao gerar banner. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
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
          {/* Título / Subtítulo */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Ex: Estoure a Boca do Balão!"
                maxLength={80}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subtítulo (opcional)</label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Ex: Prêmios instantâneos"
                maxLength={80}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>
          </div>

          {/* Estilos */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Opções de estilo</label>
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

          {/* Botão Gerar */}
          <button
            onClick={generateBanner}
            disabled={isGenerating || !bannerTitle.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Wand2 size={20} />
            {isGenerating ? 'Gerando...' : 'Gerar'}
          </button>

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
