import { Volume2, VolumeX, Plus, Minus, User, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  balloonCount: number;
  setBalloonCount: (count: number) => void;
  singleColor: boolean;
  setSingleColor: (single: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  prizeSelections: { [key: string]: number };
  setPrizeSelections: (selections: { [key: string]: number }) => void;
  onReset: () => void;
  onScreenshot: () => void;
  isShuffling?: boolean;
  shuffleProgress?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SettingsPanel({
  balloonCount,
  setBalloonCount,
  singleColor,
  setSingleColor,
  soundEnabled,
  setSoundEnabled,
  prizeSelections,
  setPrizeSelections,
  onReset,
  onScreenshot,
  isShuffling,
  shuffleProgress,
  className,
  style,
}: SettingsPanelProps) {
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [editingPrize, setEditingPrize] = useState<string | null>(null);
  const [prizeInput, setPrizeInput] = useState('');

  const incrementPrize = (prize: string) => {
    setPrizeSelections({
      ...prizeSelections,
      [prize]: (prizeSelections[prize] || 0) + 1,
    });
  };

  const decrementPrize = (prize: string) => {
    const currentCount = prizeSelections[prize] || 0;
    if (currentCount > 0) {
      setPrizeSelections({
        ...prizeSelections,
        [prize]: currentCount - 1,
      });
    }
  };

  const getTotalSelectedCount = () => {
    return Object.values(prizeSelections).reduce((acc, count) => acc + count, 0);
  };

  const handleOpenAddPrize = () => {
    setEditingPrize(null);
    setPrizeInput('');
    setShowPrizeModal(true);
  };

  const handleOpenEditPrize = (prize: string) => {
    setEditingPrize(prize);
    setPrizeInput(prize);
    setShowPrizeModal(true);
  };

  const handleDeletePrize = (prize: string) => {
    const newSelections = { ...prizeSelections };
    delete newSelections[prize];
    setPrizeSelections(newSelections);
  };

  const handleSavePrize = () => {
    if (!prizeInput.trim()) return;

    const newSelections = { ...prizeSelections };

    if (editingPrize && editingPrize !== prizeInput) {
      // Editando: transferir a contagem do prêmio antigo para o novo
      const count = newSelections[editingPrize] || 0;
      delete newSelections[editingPrize];
      newSelections[prizeInput.trim()] = count;
    } else if (!editingPrize) {
      // Adicionando: criar com contagem 1
      newSelections[prizeInput.trim()] = 1;
    } else {
      // Editando mas o nome não mudou, não faz nada
    }

    setPrizeSelections(newSelections);
    setShowPrizeModal(false);
    setPrizeInput('');
    setEditingPrize(null);
  };

  const handleClosePrizeModal = () => {
    setShowPrizeModal(false);
    setPrizeInput('');
    setEditingPrize(null);
  };

  return (
    <div
      className={`w-80 h-full p-6 overflow-y-auto ${className ?? ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)',
        ...style,
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Configurações</h2>

      {/* Number of balloons */}
      <div className="mb-6">
        <label className="block text-white text-sm font-medium mb-2">
          Número de Balões
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={balloonCount}
          onChange={(e) => setBalloonCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
        />
      </div>

      {/* Single color toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between text-white text-sm font-medium cursor-pointer">
          <span>Cor Única</span>
          <button
            onClick={() => setSingleColor(!singleColor)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              singleColor ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                singleColor ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Sound effects toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between text-white text-sm font-medium cursor-pointer">
          <span className="flex items-center gap-2">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            Efeitos Sonoros
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              soundEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Prize management */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-white text-sm font-medium">
            Prêmios
          </label>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white/70">
              Total: {getTotalSelectedCount()}
            </div>
            <button
              onClick={handleOpenAddPrize}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1 transition-colors"
              title="Adicionar novo prêmio"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {Object.keys(prizeSelections).map((prize) => (
            <div
              key={prize}
              className="flex items-center justify-between text-white text-sm hover:bg-white/5 p-2 rounded transition-colors group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium truncate" title={prize}>{prize}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditPrize(prize)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Editar prêmio"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeletePrize(prize)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Deletar prêmio"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-2 py-1 ml-2">
                <button
                  onClick={() => decrementPrize(prize)}
                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!prizeSelections[prize] || prizeSelections[prize] === 0}
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[24px] text-center font-bold">{prizeSelections[prize] || 0}</span>
                <button
                  onClick={() => incrementPrize(prize)}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        disabled={isShuffling}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {/* Progress bar */}
        {isShuffling && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-75"
            style={{ 
              width: `${shuffleProgress}%`,
              transformOrigin: 'left'
            }}
          />
        )}
        <span className="relative z-10">
          {isShuffling ? '🎲 Sorteando...' : 'Sortear !'}
        </span>
      </button>

      {/* Screenshot button */}
      <button
        onClick={onScreenshot}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mt-4 flex items-center justify-center"
      >
        <User size={18} className="mr-2" />
        Dados do Ganhador
      </button>

      {/* Prize Modal */}
      {showPrizeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPrize ? 'Editar Prêmio' : 'Adicionar Prêmio'}
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700 transition-colors" 
                onClick={handleClosePrizeModal}
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {editingPrize 
                ? 'Edite o nome do prêmio abaixo:' 
                : 'Digite o nome do novo prêmio (ex: "R$ 500,00", "iPhone 15", "Vale-compras", etc.):'}
            </p>
            
            <input
              type="text"
              value={prizeInput}
              onChange={(e) => setPrizeInput(e.target.value)}
              placeholder="Ex: R$ 500,00 ou iPhone 15"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePrize();
                if (e.key === 'Escape') handleClosePrizeModal();
              }}
            />
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                onClick={handleClosePrizeModal}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSavePrize}
                disabled={!prizeInput.trim()}
              >
                {editingPrize ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
