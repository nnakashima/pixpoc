import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface BalloonProps {
  number: number;
  color: string;
  onPop: (number: number) => void;
  isPopped: boolean;
  currency: string | null;
  soundEnabled: boolean;
  isHighlighted?: boolean;
  onToggleHighlight?: (number: number) => void;
}

export function Balloon({ number, color, onPop, isPopped, currency, soundEnabled, isHighlighted, onToggleHighlight }: BalloonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const balloonWidth = 'var(--balloon-size, 128px)';
  const balloonHeight = 'var(--balloon-height, 160px)';
  const wiggle = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 0.5 : 1;

  const handleClick = () => {
    if (!isPopped) {
      if (soundEnabled) {
        // Generate pop sound using Web Audio API with higher volume
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 100;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(1.8, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
          console.log('Audio not supported');
        }
      }
      onPop(number);
    }
  };

  const handleToggleHighlight = () => {
    if (onToggleHighlight) {
      onToggleHighlight(number);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: balloonWidth,
        height: balloonHeight,
      }}
    >
      <AnimatePresence mode="wait">
        {!isPopped ? (
          <motion.div
            key="balloon"
            className="relative cursor-pointer"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              opacity: 1,
              y: [0, -10 * wiggle, 0],
              rotate: [-2 * wiggle, 2 * wiggle, -2 * wiggle],
            }}
            exit={{
              scale: 0,
              opacity: 0,
              rotate: 360,
              transition: { duration: 0.4 }
            }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleClick}
            style={{
              filter: isHovered ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' : 'none'
            }}
          >
            {/* Balloon body - more realistic teardrop shape with wider top */}
            <div
              className="relative overflow-hidden"
              style={{
                width: 'calc(var(--balloon-size, 128px) * 0.75)',
                height: 'calc(var(--balloon-height, 160px) * 0.75)',
                borderRadius: '50% 50% 48% 48% / 55% 55% 45% 45%',
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}88 100%)`,
                boxShadow: `inset -10px -10px 20px rgba(0, 0, 0, 0.3), inset 10px 10px 20px rgba(255, 255, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.3)`,
                clipPath: 'ellipse(48% 50% at 50% 45%)',
              }}
            >
              {/* Glossy highlight */}
              <div
                className="absolute rounded-full opacity-60"
                style={{
                  top: '15%',
                  left: '25%',
                  width: '35%',
                  height: '40%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              />
              
              {/* Number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl font-bold drop-shadow-lg">
                  {number}
                </span>
              </div>
            </div>

            {/* Balloon knot at bottom */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-4"
              style={{
                background: `linear-gradient(180deg, ${color}aa 0%, ${color}66 100%)`,
                clipPath: 'polygon(50% 0%, 0% 40%, 40% 100%, 60% 100%, 100% 40%)',
              }}
            />

            {/* String - more curved/realistic */}
            <svg
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 'calc(var(--balloon-height, 160px) * 0.75)' }}
              width="40"
              height="32"
              viewBox="0 0 40 32"
              fill="none"
            >
              <path
                d="M20 0 Q25 8 18 16 Q22 24 20 32"
                stroke="rgba(150, 150, 150, 0.8)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </motion.div>
        ) : currency ? (
          <motion.div
            key="currency"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative cursor-pointer"
            onClick={handleToggleHighlight}
          >
            {/* Currency reveal */}
            <div
              className="rounded-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300"
              style={{
                width: 'calc(var(--balloon-size, 128px) * 0.9)',
                height: 'calc(var(--balloon-height, 160px) * 0.85)',
                padding: '6px 10px',
                fontSize: 'clamp(14px, 4vw, 18px)',
                lineHeight: 1.15,
                background: isHighlighted 
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' // Amarelo (mesmo do box Ganhador)
                  : 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', // Verde
                boxShadow: isHighlighted
                  ? '0 10px 40px rgba(251, 191, 36, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.4)'
                  : '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.3)',
                border: isHighlighted ? '3px solid #f59e0b' : 'none',
                transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div className="w-full text-center font-extrabold"
                   style={{
                     wordBreak: 'break-word',
                     hyphens: 'auto',
                   }}>
                {currency}
              </div>
              
              {/* Indicador visual de que é clicável */}
              {isHighlighted && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                  ★
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Pop effect particles */}
      {isPopped && (
        <AnimatePresence>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full"
              style={{
                background: color,
                top: '50%',
                left: '50%',
              }}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 50,
                y: Math.sin((i / 8) * Math.PI * 2) * 50,
                scale: 0,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
