import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  // Floating kitten emojis with different positions
  const floatingKittens = [
    { emoji: '😺', x: '10%', y: '20%', delay: 0, size: 'text-4xl' },
    { emoji: '🐱', x: '85%', y: '15%', delay: 0.3, size: 'text-5xl' },
    { emoji: '😸', x: '5%', y: '60%', delay: 0.6, size: 'text-3xl' },
    { emoji: '😻', x: '90%', y: '55%', delay: 0.9, size: 'text-4xl' },
    { emoji: '🐈', x: '15%', y: '80%', delay: 1.2, size: 'text-3xl' },
    { emoji: '😽', x: '80%', y: '75%', delay: 1.5, size: 'text-4xl' },
  ];

  const christmasDecorations = [
    { emoji: '🎄', x: '3%', y: '30%', size: 'text-5xl' },
    { emoji: '🎁', x: '92%', y: '35%', size: 'text-4xl' },
    { emoji: '⭐', x: '50%', y: '8%', size: 'text-4xl' },
    { emoji: '🔔', x: '25%', y: '12%', size: 'text-3xl' },
    { emoji: '❄️', x: '75%', y: '10%', size: 'text-2xl' },
    { emoji: '🧣', x: '8%', y: '45%', size: 'text-3xl' },
    { emoji: '🎀', x: '88%', y: '48%', size: 'text-3xl' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-background via-cream/50 to-cozy-pink/20">
      {/* Floating Kittens */}
      {floatingKittens.map((kitten, i) => (
        <motion.div
          key={i}
          className={`absolute ${kitten.size} pointer-events-none`}
          style={{ left: kitten.x, top: kitten.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{
            opacity: { delay: kitten.delay, duration: 0.5 },
            scale: { delay: kitten.delay, duration: 0.5, type: 'spring' },
            y: { delay: kitten.delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { delay: kitten.delay + 0.5, duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          {kitten.emoji}
        </motion.div>
      ))}

      {/* Christmas Decorations */}
      {christmasDecorations.map((deco, i) => (
        <motion.div
          key={`deco-${i}`}
          className={`absolute ${deco.size} pointer-events-none opacity-70`}
          style={{ left: deco.x, top: deco.y }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: deco.emoji === '⭐' ? [0, 360] : [-3, 3, -3]
          }}
          transition={{
            duration: deco.emoji === '⭐' ? 8 : 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {deco.emoji}
        </motion.div>
      ))}

      {/* Twinkling lights at top */}
      <div className="absolute top-0 left-0 right-0 flex justify-around py-3 px-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              background: ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#ec4899'][i % 5],
              boxShadow: `0 0 10px ${['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#ec4899'][i % 5]}`
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.08,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* String connecting lights */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-warmBrown/30 to-transparent" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10 max-w-lg mx-auto"
      >
        {/* Big Kitten Mascot */}
        <motion.div
          className="text-8xl md:text-9xl mb-4"
          animate={{ 
            y: [0, -10, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="drop-shadow-lg">🐱</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="game-title text-primary mb-2"
          animate={{ 
            textShadow: [
              '4px 4px 0 hsl(150, 55%, 38%), 0 0 30px hsl(42, 100%, 62%, 0.6)',
              '5px 5px 0 hsl(150, 55%, 38%), 0 0 40px hsl(42, 100%, 62%, 0.8)',
              '4px 4px 0 hsl(150, 55%, 38%), 0 0 30px hsl(42, 100%, 62%, 0.6)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Meowry Christmas
        </motion.h1>

        {/* Subtitle with paw prints */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐾
          </motion.span>
          <span className="text-lg font-display font-bold text-secondary">
            A Gift-Giving Game
          </span>
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐾
          </motion.span>
        </motion.div>

        {/* Kitten faces row */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6 bg-card/60 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-cozy-pink/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          {['😺', '😸', '😻', '😼', '🙀'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div
          className="cozy-card px-6 py-4 mb-8 mx-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-base md:text-lg text-foreground font-body leading-relaxed">
            Match the <span className="text-primary font-bold">purrfect gifts</span> to 5 adorable kittens!
          </p>
          <p className="text-sm text-muted-foreground mt-2 italic font-body">
            🎀 Warning: They're picky, dramatic, and judging you 🎀
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 400 }}
        >
          <Button
            onClick={onStart}
            className="btn-christmas text-xl px-12 py-8 rounded-2xl"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🐱
            </motion.span>
            <span className="mx-2">Let's Play!</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              🎁
            </motion.span>
          </Button>
        </motion.div>

        {/* Instructions hint */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>🐾</span>
          <span className="font-body">Tap a gift, then tap a kitten!</span>
          <span>🐾</span>
        </motion.div>
      </motion.div>

      {/* Bottom paw prints decoration */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 opacity-30">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
          >
            🐾
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default LandingScreen;