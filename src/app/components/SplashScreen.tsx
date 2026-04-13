import React from 'react';
import { Play, Settings, Gift, Lock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
// Use logo from public folder for production
const pixpocLogo = '/logo-pixpoc.png';

interface SplashScreenProps {
  onStart: () => void;
  language?: 'pt-BR' | 'en-US';
}

const COPY = {
  'pt-BR': {
    title: '✨ Passo a passo',
    steps: [
      { title: 'Monte os prêmios e banner', body: 'Ajuste quantidades e imagens na tabela de prêmios. Clique no banner para editar.' },
      { title: 'Sortear', body: 'Toque no dado para embaralhar e redefinir os balões. 100% aleatório via Web Crypto API.' },
      { title: 'Estourar & destacar', body: 'Estoure para revelar. Toque de novo no card para destacar em amarelo e preencher o campo de prêmio.' },
      { title: 'Registrar ganhador', body: 'Abra o painel “Ganhador”, preencha nome, contato e chave PIX e salve o relatório se quiser.' },
    ],
    security: 'Aleatoriedade criptográfica (Web Crypto + rejection sampling).',
  },
  'en-US': {
    title: '✨ Quick steps',
    steps: [
      { title: 'Set prizes and banner', body: 'Adjust quantities and images in the prize table. Tap the banner to edit.' },
      { title: 'Shuffle', body: 'Tap the dice to shuffle and reset balloons. 100% random via Web Crypto API.' },
      { title: 'Pop & highlight', body: 'Pop to reveal. Tap the card again to highlight in yellow and fill the prize field.' },
      { title: 'Record winner', body: 'Open the “Winner” panel, fill name, contact and Pix key, and save the report if you want.' },
    ],
    security: 'Cryptographic randomness (Web Crypto + rejection sampling).',
  },
} as const;

export function SplashScreen({ onStart, language = 'pt-BR' }: SplashScreenProps) {
  const copy = COPY[language] || COPY['pt-BR'];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 z-50 flex items-center justify-center p-4 overflow-hidden"
    >
      <div
        className="w-full max-w-md h-full flex flex-col justify-center gap-1"
        style={{ transform: 'translateY(-24px)' }}
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-1"
        >
          <div className="flex justify-center mb-2">
            <img 
              src={pixpocLogo} 
              alt="PixPoc Logo" 
              className="h-32 md:h-48 object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5))',
              }}
            />
          </div>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/20 shadow-2xl mb-3 max-h-[65vh] overflow-y-auto"
        >
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
            {copy.title}
          </h2>

          <div className="space-y-2.5">
            {copy.steps.map((step, idx) => {
              const chips = [
                { colors: 'from-purple-500 to-pink-500', Icon: Settings },
                { colors: 'from-blue-500 to-cyan-500', Icon: Zap },
                { colors: 'from-green-500 to-emerald-500', Icon: Gift },
                { colors: 'from-yellow-500 to-orange-500', Icon: Lock },
              ];
              const chip = chips[idx] || chips[0];
              return (
                <div className="flex gap-3" key={step.title}>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${chip.colors} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <chip.Icon className="text-white/80" size={16} />
                      <h3 className="text-white font-semibold text-sm">{step.title}</h3>
                    </div>
                    <p className="text-white/80 text-xs leading-snug">
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-green-500/15 backdrop-blur-lg rounded-xl p-3 border border-green-500/30 mb-3"
        >
          <div className="flex items-center justify-center gap-2 text-white text-xs">
            <Lock className="text-green-300" size={16} />
            <p>
              {copy.security}
            </p>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105"
          >
            <Play size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>Começar Agora!</span>
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-white/60 text-[11px] mt-2"
        >
          Created by PixPoc 2026 - admin@pixpoc.com.br
        </motion.p>
      </div>
    </motion.div>
  );
}
