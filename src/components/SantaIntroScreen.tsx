import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SantaIntroScreenProps {
  onNext: () => void;
}

const SantaIntroScreen = ({ onNext }: SantaIntroScreenProps) => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lowPerf = reduceMotion || isMobile;

  const floatingKittens = [
    { emoji: '😺', delay: 0 },
    { emoji: '😸', delay: 0.2 },
    { emoji: '😻', delay: 0.4 },
    { emoji: '😼', delay: 0.6 },
    { emoji: '🐱', delay: 0.8 },
  ];

  // Pre-calculated positions for decorations (avoid random during render)
  const baseDecorations = [
    { emoji: '🐱', top: 12, left: 8 },
    { emoji: '🎁', top: 25, left: 85 },
    { emoji: '⭐', top: 45, left: 12 },
    { emoji: '🐾', top: 68, left: 92 },
    { emoji: '🎄', top: 15, left: 78 },
    { emoji: '😺', top: 55, left: 5 },
    { emoji: '❄️', top: 35, left: 95 },
    { emoji: '🧶', top: 72, left: 15 },
    { emoji: '🔔', top: 8, left: 45 },
    { emoji: '🎀', top: 82, left: 55 },
    { emoji: '🌟', top: 20, left: 25 },
    { emoji: '🎅', top: 78, left: 75 },
    { emoji: '🍪', top: 40, left: 70 },
    { emoji: '🥛', top: 62, left: 30 },
    { emoji: '❤️', top: 30, left: 60 },
  ];
  const decorations = lowPerf ? baseDecorations.slice(0, 10) : baseDecorations;

  const baseSnowflakes = [
    { left: 5, delay: 0 },
    { left: 15, delay: 0.5 },
    { left: 25, delay: 1 },
    { left: 35, delay: 1.5 },
    { left: 45, delay: 0.3 },
    { left: 55, delay: 0.8 },
    { left: 65, delay: 1.2 },
    { left: 75, delay: 0.6 },
    { left: 85, delay: 1.8 },
    { left: 95, delay: 0.2 },
  ];
  const snowflakes = lowPerf ? baseSnowflakes.slice(0, 6) : baseSnowflakes;

  const baseLights = ['🔴', '🟡', '🟢', '🔵', '🟣', '🔴', '🟡', '🟢', '🔵', '🟣'];
  const lights = lowPerf ? baseLights.slice(0, 6) : baseLights;


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-background via-cream/30 to-cozy-pink/20">
      
      {/* Gradient orbs for depth (kept lightweight on mobile / reduced motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lowPerf ? (
          <>
            <div
              className="absolute w-[320px] h-[320px] rounded-full blur-2xl opacity-60"
              style={{
                top: '-10%',
                left: '-10%',
                background: 'radial-gradient(circle at 30% 30%, hsl(var(--christmas-red) / 0.20), transparent 65%)',
              }}
            />
            <div
              className="absolute w-[300px] h-[300px] rounded-full blur-2xl opacity-60"
              style={{
                bottom: '-8%',
                right: '-8%',
                background: 'radial-gradient(circle at 70% 70%, hsl(var(--christmas-green) / 0.18), transparent 65%)',
              }}
            />
          </>
        ) : (
          <>
            <motion.div
              className="absolute w-[360px] h-[360px] rounded-full blur-2xl will-change-transform"
              style={{
                top: '-10%',
                left: '-10%',
                background: 'radial-gradient(circle at 30% 30%, hsl(var(--christmas-red) / 0.22), transparent 65%)',
              }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.5, 0.35] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[340px] h-[340px] rounded-full blur-2xl will-change-transform"
              style={{
                bottom: '-8%',
                right: '-8%',
                background: 'radial-gradient(circle at 70% 70%, hsl(var(--christmas-green) / 0.20), transparent 65%)',
              }}
              animate={{ scale: [1.15, 1, 1.15], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[280px] h-[280px] rounded-full blur-xl will-change-transform"
              style={{
                top: '40%',
                right: '20%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--cozy-pink) / 0.22), transparent 65%)',
              }}
              animate={{ x: [-16, 16, -16], y: [-8, 8, -8] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
      </div>

      {/* Falling snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lowPerf
          ? snowflakes.map((flake, i) => (
              <span
                key={`snow-${i}`}
                className="intro-snow absolute text-xl opacity-50"
                style={{
                  left: `${flake.left}%`,
                  top: '-5%',
                  ['--intro-snow-dur' as any]: `${11 + i * 0.9}s`,
                  ['--intro-snow-delay' as any]: `${flake.delay}s`,
                }}
              >
                ❄️
              </span>
            ))
          : snowflakes.map((flake, i) => (
              <motion.div
                key={`snow-${i}`}
                className="absolute text-xl opacity-60 will-change-transform"
                style={{ left: `${flake.left}%`, top: '-5%' }}
                animate={{ y: ['-5vh', '105vh'] }}
                transition={{ duration: 10 + i * 0.6, repeat: Infinity, ease: 'linear', delay: flake.delay }}
              >
                ❄️
              </motion.div>
            ))}
      </div>

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {lowPerf
          ? decorations.map((dec, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-float opacity-80"
                style={{ top: `${dec.top}%`, left: `${dec.left}%`, animationDelay: `${i * 0.25}s` }}
              >
                {dec.emoji}
              </div>
            ))
          : decorations.map((dec, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl will-change-transform"
                style={{ top: `${dec.top}%`, left: `${dec.left}%` }}
                animate={{ y: [0, -10], rotate: [-5, 5] }}
                transition={{
                  duration: 3 + i * 0.12,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              >
                {dec.emoji}
              </motion.div>
            ))}
      </div>

      {/* Christmas lights string */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex gap-8 py-4">
          {lights.map((light, i) =>
            lowPerf ? (
              <span
                key={`light-${i}`}
                className="text-2xl drop-shadow-lg animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {light}
              </span>
            ) : (
              <motion.span
                key={`light-${i}`}
                className="text-2xl drop-shadow-lg will-change-transform"
                animate={{ opacity: [0.55, 1, 0.55], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
              >
                {light}
              </motion.span>
            )
          )}
        </div>
      </div>

      {/* Corner decorations */}
      {lowPerf ? (
        <>
          <div className="absolute top-4 left-4 text-5xl opacity-90">🎄</div>
          <div className="absolute top-4 right-4 text-5xl opacity-90">🎄</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-90">🎁</div>
          <div className="absolute bottom-4 right-4 text-4xl opacity-90">🎁</div>
        </>
      ) : (
        <>
          <motion.div
            className="absolute top-4 left-4 text-5xl will-change-transform"
            animate={{ rotate: [-4, 4], scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          >
            🎄
          </motion.div>
          <motion.div
            className="absolute top-4 right-4 text-5xl will-change-transform"
            animate={{ rotate: [4, -4], scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          >
            🎄
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-4 text-4xl will-change-transform"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🎁
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4 text-4xl will-change-transform"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            🎁
          </motion.div>
        </>
      )}

      {/* Paw print trail */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-6 opacity-30">
        {Array.from({ length: lowPerf ? 7 : 9 }).map((_, i) =>
          lowPerf ? (
            <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 0.12}s` }}>
              🐾
            </span>
          ) : (
            <motion.span
              key={i}
              className="text-2xl will-change-transform"
              animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, delay: i * 0.12, repeat: Infinity }}
            >
              🐾
            </motion.span>
          )
        )}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-lg"
      >
        {/* Santa character */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <div className="relative inline-block">
            {/* Santa emoji */}
            <motion.div
              className="text-[100px] md:text-[140px] drop-shadow-lg"
              animate={{ 
                rotate: [-2, 2, -2],
                y: [0, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎅
            </motion.div>
            
            {/* Tired expression - sweat drop */}
            <motion.div
              className="absolute top-6 right-4 text-2xl"
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [0, 10, 10, 20]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💧
            </motion.div>

            {/* Confused sparkle */}
            <motion.div
              className="absolute -top-2 -left-2 text-xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ❓
            </motion.div>
          </div>
        </motion.div>

        {/* Speech bubble - cozy style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="speech-bubble speech-bubble--cozy mx-4 mb-8"
        >
          <motion.p
            className="font-display text-lg md:text-xl text-foreground leading-relaxed font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <span className="text-christmas-red font-extrabold text-2xl">"Ho ho ho...</span>
            <br />
            <span className="block my-2 text-foreground">
              I am SO tired of these sassy furry kittens.
            </span>
            <br />
            <span className="text-foreground">Can you help me give them the right gifts?</span>
            <br />
            <span className="text-warmBrown text-base italic font-medium">
              (They're... very picky.)
            </span>
            <span className="text-christmas-red font-extrabold text-2xl">"</span>
          </motion.p>
        </motion.div>

        {/* Animated kitten faces */}
        <motion.div
          className="flex justify-center gap-3 mb-8 bg-card/60 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-cozy-pink/50 shadow-lg mx-auto w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {floatingKittens.map((kitten, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ 
                rotate: [-12, 12],
                y: [0, -8],
                scale: [1, 1.1]
              }}
              transition={{ 
                rotate: { duration: 0.4, repeat: Infinity, repeatType: 'reverse' as const, delay: kitten.delay, ease: 'easeInOut' },
                y: { duration: 0.6, repeat: Infinity, repeatType: 'reverse' as const, delay: kitten.delay, ease: 'easeInOut' },
                scale: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' as const, delay: kitten.delay, ease: 'easeInOut' }
              }}
            >
              {kitten.emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Help Santa button - Christmas themed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, type: 'spring' }}
        >
          <Button
            onClick={onNext}
            variant="christmas"
            size="xl"
            className="group"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-2xl"
            >
              🐱
            </motion.span>
            <span className="mx-1">Help the Kittens!</span>
            <motion.span
              animate={{ scale: [1, 1.15], rotate: [-8, 8] }}
              transition={{ 
                scale: { duration: 0.4, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut', delay: 0.4 },
                rotate: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut', delay: 0.4 }
              }}
              className="text-2xl"
            >
              🎁
            </motion.span>
          </Button>
        </motion.div>

        {/* Playful hint */}
        <motion.p
          className="mt-6 text-sm text-muted-foreground font-body flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span>🐾</span>
          Each kitten has a purrfect gift waiting!
          <span>🐾</span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SantaIntroScreen;