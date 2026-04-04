import React from 'react';
import { Play, Settings, Gift, Lock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
// Use logo from public folder for production
const pixpocLogo = '/logo-pixpoc.png';

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl">
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="flex justify-center mb-2">
            <img 
              src={pixpocLogo} 
              alt="PixPoc Logo" 
              className="h-32 md:h-40 object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5))',
              }}
            />
          </div>
          <p className="text-white/80 text-base md:text-lg">
            Sorteios transparentes com segurança criptográfica
          </p>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl mb-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
            ✨ Como Usar
          </h2>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="text-purple-400" size={16} />
                  <h3 className="text-white font-bold text-sm">Configure o Sorteio</h3>
                </div>
                <p className="text-white/80 text-xs">
                  No painel lateral direito, defina a <strong>quantidade de balões</strong> e gerencie os <strong>prêmios</strong>:
                  adicione, edite ou remova itens. Use os botões <strong>+/-</strong> para ajustar as quantidades.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="text-blue-400" size={16} />
                  <h3 className="text-white font-bold text-sm">Inicie o Sorteio</h3>
                </div>
                <p className="text-white/80 text-xs">
                  Clique no botão <strong>"Sortear!"</strong> para embaralhar os prêmios nos balões.
                  Aguarde 1,5 segundos enquanto o sistema distribui aleatoriamente os valores.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="text-green-400" size={16} />
                  <h3 className="text-white font-bold text-sm">Estoure os Balões</h3>
                </div>
                <p className="text-white/80 text-xs">
                  Clique nos balões para revelar os prêmios! Após estourar, clique novamente no card verde para
                  <strong> destacá-lo em amarelo</strong> e copiar automaticamente para o campo "Referência do Prêmio".
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                4
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="text-yellow-400" size={16} />
                  <h3 className="text-white font-bold text-sm">Registre o Ganhador</h3>
                </div>
                <p className="text-white/80 text-xs">
                  Clique no botão <strong>"Dados do Ganhador"</strong> para preencher nome, referência e chave PIX.
                  Os dados aparecerão no topo da tela. Use o <strong>print nativo</strong> do seu dispositivo para capturar!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-green-500/20 backdrop-blur-lg rounded-xl p-3 border border-green-500/40 mb-4"
        >
          <div className="flex items-center justify-center gap-2 text-white">
            <Lock className="text-green-400" size={18} />
            <p className="text-xs md:text-sm">
              <strong>100% Transparente:</strong> Usa Web Crypto API com rejection sampling para garantir aleatoriedade sem viés
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
          className="text-center text-white/50 text-xs mt-3"
        >
          Dica: Você pode ver estas instruções novamente clicando em "(?)" no topo da página
        </motion.p>
      </div>
    </motion.div>
  );
}
