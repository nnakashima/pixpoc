import { useState, useEffect } from 'react';

interface BannerProps {
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
  onView: () => void;
  className?: string;
}

export function Banner({ imageUrl, linkUrl, altText, onView, className = '' }: BannerProps) {
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    // Registrar visualização apenas uma vez quando o componente é montado
    if (!hasViewed) {
      onView();
      setHasViewed(true);
    }
  }, [hasViewed, onView]);

  const BannerContent = () => (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${linkUrl ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-300' : ''} ${className}`}>
      {/* Efeito de vidro translúcido sem fundo branco */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl"></div>
      
      {/* Imagem do banner */}
      <div className="relative p-3">
        <img
          src={imageUrl}
          alt={altText || 'Banner'}
          className="w-full h-auto object-contain"
        />
      </div>
      
      {/* Brilho sutil no topo */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );

  if (linkUrl) {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <BannerContent />
      </a>
    );
  }

  return <BannerContent />;
}