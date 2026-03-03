import { motion } from 'motion/react';
import { Shield, Crosshair, Factory, Layers, FileText, Lock } from 'lucide-react';
import { useState } from 'react';

interface SetupOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: string;
}

const setupOptions: SetupOption[] = [
  {
    id: 'model',
    title: 'MODEL',
    description: 'Configure weapon model',
    icon: <Crosshair className="w-8 h-8" />,
    color: '#00ff88',
    status: 'READY'
  },
  {
    id: 'caliber',
    title: 'CALIBER',
    description: 'Set ammunition specs',
    icon: <Layers className="w-8 h-8" />,
    color: '#00d4ff',
    status: 'READY'
  },
  {
    id: 'make',
    title: 'MAKE',
    description: 'Select manufacturer',
    icon: <Factory className="w-8 h-8" />,
    color: '#ff00ff',
    status: 'READY'
  },
  {
    id: 'kind',
    title: 'KIND',
    description: 'Define classification',
    icon: <Shield className="w-8 h-8" />,
    color: '#ffaa00',
    status: 'READY'
  },
  {
    id: 'license',
    title: 'LICENSE',
    description: 'Licensing data',
    icon: <FileText className="w-8 h-8" />,
    color: '#ff3366',
    status: 'LOCKED'
  }
];

interface FirearmSetupCardProps {
  onOptionSelect: (option: SetupOption) => void;
}

export function FirearmSetupCard({ onOptionSelect }: FirearmSetupCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-6xl">
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }} />
      </div>

      {/* Main container */}
      <div className="relative bg-black/90 border-4 border-cyan-500/50 p-8">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400" />

        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-5xl tracking-wider text-cyan-400 font-mono mb-2"
                style={{ textShadow: '0 0 20px rgba(0,212,255,0.5)' }}
              >
                FIREARM SETUP
              </motion.h1>
              <div className="flex gap-4 text-sm font-mono">
                <span className="text-lime-400">SYSTEM: ONLINE</span>
                <span className="text-cyan-400">|</span>
                <span className="text-lime-400">STATUS: OPERATIONAL</span>
                <span className="text-cyan-400">|</span>
                <span className="text-yellow-400">SEC-LVL: 5</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
            />
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {setupOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              onClick={() => option.status === 'READY' && onOptionSelect(option)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={option.status === 'LOCKED'}
              className="relative group"
            >
              {/* Hexagon container */}
              <div className={`relative aspect-square bg-gradient-to-br from-slate-900 to-black border-2 transition-all duration-300 ${
                hoveredId === option.id ? 'scale-105' : ''
              } ${option.status === 'LOCKED' ? 'opacity-50' : ''}`}
                style={{ 
                  borderColor: hoveredId === option.id ? option.color : 'rgba(100,255,255,0.3)',
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                }}
              >
                {/* Glow effect */}
                {hoveredId === option.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="absolute inset-0 blur-xl"
                    style={{ backgroundColor: option.color }}
                  />
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center gap-3 p-6">
                  <motion.div
                    animate={{ 
                      y: hoveredId === option.id ? [-5, 5, -5] : 0,
                      color: hoveredId === option.id ? option.color : '#ffffff'
                    }}
                    transition={{ duration: 1, repeat: hoveredId === option.id ? Infinity : 0 }}
                  >
                    {option.status === 'LOCKED' ? <Lock className="w-8 h-8" /> : option.icon}
                  </motion.div>
                  
                  <div className="text-center">
                    <div 
                      className="font-mono tracking-widest mb-1 transition-colors"
                      style={{ 
                        color: hoveredId === option.id ? option.color : '#ffffff',
                        textShadow: hoveredId === option.id ? `0 0 10px ${option.color}` : 'none'
                      }}
                    >
                      {option.title}
                    </div>
                    <div className="text-xs text-cyan-300/60 font-mono">
                      {option.description}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: option.status === 'LOCKED' ? '#ff0000' : option.color }}
                    />
                  </div>
                </div>
              </div>

              {/* Status label */}
              <div className="mt-2 text-center">
                <span 
                  className="text-xs font-mono px-2 py-1 border"
                  style={{ 
                    color: option.status === 'LOCKED' ? '#ff0000' : option.color,
                    borderColor: option.status === 'LOCKED' ? '#ff0000' : option.color
                  }}
                >
                  [{option.status}]
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer data */}
        <div className="mt-8 pt-6 border-t-2 border-cyan-500/30">
          <div className="grid grid-cols-4 gap-4 font-mono text-sm">
            <div className="text-center">
              <div className="text-cyan-400">MODULES</div>
              <div className="text-lime-400 text-xl">05</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400">ACTIVE</div>
              <div className="text-lime-400 text-xl">04</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400">LOCKED</div>
              <div className="text-red-400 text-xl">01</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-400">INTEGRITY</div>
              <div className="text-lime-400 text-xl">98%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}