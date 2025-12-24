import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface GameHUDProps {
  score: number;
  maxScore: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const GameHUD = ({ score, maxScore, streak, soundEnabled, onToggleSound }: GameHUDProps) => {
  const progressPercent = (score / maxScore) * 100;
  
  // Kitten-themed mood based on score
  const getMood = () => {
    if (score === 0) return { emoji: '😺', label: 'Ready to play!', color: 'hsl(var(--muted))' };
    if (score < maxScore * 0.4) return { emoji: '😸', label: 'Nice match!', color: 'hsl(var(--accent))' };
    if (score < maxScore * 0.8) return { emoji: '😻', label: 'They love you!', color: 'hsl(var(--secondary))' };
    if (score < maxScore) return { emoji: '🙀', label: 'Almost there!', color: 'hsl(var(--primary))' };
    return { emoji: '😽', label: 'PURRFECT!', color: 'hsl(var(--gold-sparkle))' };
  };

  const mood = getMood();

  // Kitten faces for progress
  const kittenFaces = ['😺', '😸', '😻', '😼', '🐱'];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-40 p-2"
    >
      <div className="max-w-3xl mx-auto">
        {/* Main HUD Panel - Cozy Christmas Kitten Theme */}
        <div className="relative cozy-card overflow-hidden">
          {/* Decorative paw prints */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-xl opacity-20 rotate-12">🐾</div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-xl opacity-20 -rotate-12">🐾</div>
          
          <div className="flex items-center justify-between gap-2 md:gap-4 px-4 py-2">
            {/* Score Panel with Kitten */}
            <motion.div 
              className="flex items-center gap-2 bg-gradient-to-br from-christmas-red to-candy text-primary-foreground px-3 py-1.5 rounded-xl shadow-lg border-2 border-christmas-green/30"
              animate={score > 0 ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.3 }}
              key={score}
            >
              <motion.span
                className="text-xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🐱
              </motion.span>
              <span className="font-display font-bold text-base md:text-lg">
                {score}/{maxScore}
              </span>
              <span className="text-lg">🎁</span>
            </motion.div>

            {/* Progress Bar with Kitten Faces */}
            <div className="flex-1 hidden sm:block">
              <div className="relative h-10 bg-cream/80 rounded-full border-3 border-cozy-pink/50 overflow-hidden shadow-inner">
                {/* Progress fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-christmas-green via-secondary to-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ left: ['-10%', '110%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
                {/* Kitten face indicators */}
                <div className="absolute inset-0 flex items-center justify-around px-2">
                  {kittenFaces.map((face, i) => (
                    <motion.span
                      key={i}
                      className={`text-lg transition-all duration-300 ${i < score ? 'scale-110 drop-shadow-md' : 'opacity-40 grayscale'}`}
                      animate={i < score ? { y: [0, -3, 0] } : {}}
                      transition={{ duration: 1, delay: i * 0.1, repeat: i < score ? Infinity : 0 }}
                    >
                      {face}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mood Indicator with Animation */}
            <motion.div 
              className="flex items-center gap-2 bg-card/90 px-3 py-1.5 rounded-xl border-2 shadow-md"
              style={{ borderColor: mood.color }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {mood.emoji}
              </motion.span>
              <span className="font-display font-bold text-xs md:text-sm text-foreground hidden md:block">
                {mood.label}
              </span>
            </motion.div>

            {/* Streak Badge with Sparkles */}
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-1 bg-gradient-to-br from-gold to-accent text-accent-foreground px-3 py-1.5 rounded-xl shadow-lg border-2 border-gold/50"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐
                </motion.span>
                <span className="font-display font-bold text-sm">x{streak}</span>
                <span>🔥</span>
              </motion.div>
            )}

            {/* Sound Toggle - Cute Paw Button */}
            <motion.button
              onClick={onToggleSound}
              className="p-2 rounded-full bg-cream hover:bg-cozy-pink/30 transition-all duration-300 border-2 border-border shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-foreground" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameHUD;