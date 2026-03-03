import { motion } from 'motion/react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface SetupOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: string;
}

interface DetailPanelProps {
  option: SetupOption;
  onClose: () => void;
}

const mockData = {
  model: ['AR-15', 'AK-47', 'Glock 19', 'M4 Carbine', 'Desert Eagle'],
  caliber: ['.223 Remington', '5.56x45mm NATO', '7.62x39mm', '9mm Parabellum', '.45 ACP'],
  make: ['Colt', 'Smith & Wesson', 'Glock', 'Sig Sauer', 'Beretta'],
  kind: ['Rifle', 'Pistol', 'Shotgun', 'Carbine', 'Submachine Gun'],
  license: ['Class A', 'Class B', 'Class C', 'Federal Firearms License', 'Concealed Carry']
};

export function DetailPanel({ option, onClose }: DetailPanelProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const items = mockData[option.id as keyof typeof mockData] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }} />
      </div>

      <motion.div
        initial={{ scale: 0.8, rotateX: -15 }}
        animate={{ scale: 1, rotateX: 0 }}
        exit={{ scale: 0.8, rotateX: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-black border-4 max-w-lg w-full"
        style={{ borderColor: option.color }}
      >
        {/* Corner accents */}
        <div className="absolute -top-2 -left-2 w-6 h-6" style={{ backgroundColor: option.color }} />
        <div className="absolute -top-2 -right-2 w-6 h-6" style={{ backgroundColor: option.color }} />
        <div className="absolute -bottom-2 -left-2 w-6 h-6" style={{ backgroundColor: option.color }} />
        <div className="absolute -bottom-2 -right-2 w-6 h-6" style={{ backgroundColor: option.color }} />

        {/* Alert bar */}
        <div className="bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent p-2 border-b border-yellow-500/30">
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-mono text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>SECURE CONNECTION REQUIRED</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b-2" style={{ borderColor: `${option.color}40` }}>
            <div className="flex items-center gap-3">
              <div className="p-3 border-2" style={{ borderColor: option.color, backgroundColor: `${option.color}20` }}>
                {option.icon}
              </div>
              <div>
                <h2 className="font-mono tracking-wider" style={{ color: option.color, textShadow: `0 0 10px ${option.color}` }}>
                  {option.title}
                </h2>
                <p className="text-xs text-cyan-300/60 font-mono mt-1">{option.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-cyan-400/30 hover:bg-cyan-400/10 transition-colors"
            >
              <X className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto pr-2">
            {items.map((item, index) => (
              <motion.button
                key={item}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left px-4 py-3 border-2 font-mono transition-all relative overflow-hidden ${
                  selectedItem === item
                    ? 'bg-black/50'
                    : 'bg-black/30 hover:bg-black/50'
                }`}
                style={{
                  borderColor: selectedItem === item ? option.color : 'rgba(100,255,255,0.2)'
                }}
              >
                {selectedItem === item && (
                  <motion.div
                    layoutId="selector"
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="text-sm" style={{ color: selectedItem === item ? option.color : '#ffffff' }}>
                    {item}
                  </span>
                  {selectedItem === item && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      <Check className="w-5 h-5" style={{ color: option.color }} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-black border-2 border-red-500 text-red-400 font-mono hover:bg-red-500/10 transition-all"
            >
              [ABORT]
            </button>
            <button
              disabled={!selectedItem}
              className="flex-1 px-4 py-3 border-2 font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: option.color,
                color: option.color,
                backgroundColor: selectedItem ? `${option.color}10` : 'transparent'
              }}
            >
              [CONFIRM]
            </button>
          </div>

          {/* Info bar */}
          <div className="mt-4 pt-4 border-t border-cyan-500/20 flex justify-between text-xs font-mono text-cyan-400/60">
            <span>ID: {option.id.toUpperCase()}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
            <span>AUTH: GRANTED</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}