import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface RulesScreenProps {
  onStart: () => void;
}

const RULES = [
  { emoji: '🎯', text: 'Each kitten wants ONE gift.' },
  { emoji: '🔍', text: 'Read the tagline carefully.' },
  { emoji: '😾', text: 'Wrong gift = MAXIMUM sass.' },
] as const;

const SIDE_CATS = [
  { emoji: '😺', top: 12 },
  { emoji: '😸', top: 28 },
  { emoji: '😻', top: 44 },
  { emoji: '😽', top: 60 },
  { emoji: '🐱', top: 76 },
] as const;

const DECORATIONS = [
  // Left side
  { emoji: '🎁', top: 6, left: 3 },
  { emoji: '⭐', top: 18, left: 6 },
  { emoji: '🧶', top: 35, left: 2 },
  { emoji: '🍪', top: 52, left: 5 },
  { emoji: '🎄', top: 70, left: 3 },
  { emoji: '❄️', top: 85, left: 6 },
  // Right side
  { emoji: '🎀', top: 8, left: 94 },
  { emoji: '🔔', top: 22, left: 96 },
  { emoji: '🌟', top: 38, left: 93 },
  { emoji: '🥛', top: 55, left: 95 },
  { emoji: '❤️', top: 68, left: 94 },
  { emoji: '🎄', top: 82, left: 96 },
  // Top area
  { emoji: '✨', top: 3, left: 20 },
  { emoji: '⭐', top: 5, left: 40 },
  { emoji: '🌟', top: 4, left: 60 },
  { emoji: '✨', top: 3, left: 80 },
  // Bottom area
  { emoji: '🐾', top: 92, left: 25 },
  { emoji: '🎅', top: 88, left: 50 },
  { emoji: '🐾', top: 92, left: 75 },
] as const;

const LIGHTS = ['🔴', '🟡', '🟢', '🔵', '🟣', '🔴', '🟡', '🟢', '🔵', '🟣', '🔴', '🟡'] as const;

const SNOWFLAKES = [
  { left: 5, delay: 0 },
  { left: 12, delay: 0.5 },
  { left: 20, delay: 1.0 },
  { left: 28, delay: 0.3 },
  { left: 36, delay: 0.8 },
  { left: 44, delay: 1.3 },
  { left: 52, delay: 0.2 },
  { left: 60, delay: 0.7 },
  { left: 68, delay: 1.1 },
  { left: 76, delay: 0.4 },
  { left: 84, delay: 0.9 },
  { left: 92, delay: 1.4 },
] as const;

const PAWS = [
  { left: 10 },
  { left: 20 },
  { left: 30 },
  { left: 40 },
  { left: 50 },
  { left: 60 },
  { left: 70 },
  { left: 80 },
  { left: 90 },
] as const;

const RulesScreen = ({ onStart }: RulesScreenProps) => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lowPerf = reduceMotion || isMobile;

  const green = 'hsl(var(--christmas-green))';
  const cardShadowA = '0 6px 16px -8px hsl(var(--warm-brown) / 0.18)';
  const cardShadowB = '0 14px 28px -14px hsl(var(--warm-brown) / 0.25)';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-background via-cream/30 to-cozy-pink/20">
      {/* Background depth - multiple orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lowPerf ? (
          <>
            <div
              className="absolute w-[320px] h-[320px] rounded-full blur-3xl opacity-60"
              style={{
                top: '-10%',
                left: '-8%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-red) / 0.22), transparent 60%)',
              }}
            />
            <div
              className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-60"
              style={{
                top: '-8%',
                right: '-6%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-green) / 0.20), transparent 60%)',
              }}
            />
            <div
              className="absolute w-[280px] h-[280px] rounded-full blur-2xl opacity-50"
              style={{
                bottom: '-8%',
                left: '-6%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-green) / 0.18), transparent 60%)',
              }}
            />
            <div
              className="absolute w-[260px] h-[260px] rounded-full blur-2xl opacity-50"
              style={{
                bottom: '-6%',
                right: '-5%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-red) / 0.16), transparent 60%)',
              }}
            />
            <div
              className="absolute w-[200px] h-[200px] rounded-full blur-xl opacity-40"
              style={{
                top: '45%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--gold-sparkle) / 0.15), transparent 65%)',
              }}
            />
          </>
        ) : (
          <>
            <motion.div
              className="absolute w-[350px] h-[350px] rounded-full blur-3xl will-change-transform"
              style={{
                top: '-10%',
                left: '-8%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-red) / 0.22), transparent 60%)',
              }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.65, 0.45] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[320px] h-[320px] rounded-full blur-3xl will-change-transform"
              style={{
                top: '-8%',
                right: '-6%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-green) / 0.20), transparent 60%)',
              }}
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full blur-2xl will-change-transform"
              style={{
                bottom: '-8%',
                left: '-6%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-green) / 0.18), transparent 60%)',
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[280px] h-[280px] rounded-full blur-2xl will-change-transform"
              style={{
                bottom: '-6%',
                right: '-5%',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--christmas-red) / 0.16), transparent 60%)',
              }}
              animate={{ scale: [1.08, 1, 1.08], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[220px] h-[220px] rounded-full blur-xl will-change-transform"
              style={{
                top: '45%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(circle at 50% 50%, hsl(var(--gold-sparkle) / 0.18), transparent 65%)',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
      </div>

      {/* Snow (lightweight on mobile / reduced motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {(lowPerf ? SNOWFLAKES.slice(0, 5) : SNOWFLAKES).map((flake, i) =>
          lowPerf ? (
            <span
              key={`snow-${i}`}
              className="intro-snow absolute text-xl opacity-50"
              style={{
                left: `${flake.left}%`,
                top: '-5%',
                ['--intro-snow-dur' as any]: `${12 + i * 0.9}s`,
                ['--intro-snow-delay' as any]: `${flake.delay}s`,
              }}
            >
              ❄️
            </span>
          ) : (
            <motion.div
              key={`snow-${i}`}
              className="absolute text-xl opacity-55 will-change-transform"
              style={{ left: `${flake.left}%`, top: '-5%' }}
              animate={{ y: ['-5vh', '105vh'] }}
              transition={{ duration: 11 + i * 0.6, repeat: Infinity, ease: 'linear', delay: flake.delay }}
            >
              ❄️
            </motion.div>
          )
        )}
      </div>

      {/* Christmas lights string at top */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex gap-6 py-3">
          {(lowPerf ? LIGHTS.slice(0, 6) : LIGHTS).map((light, i) =>
            lowPerf ? (
              <span
                key={`light-${i}`}
                className="text-xl drop-shadow-md animate-pulse"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {light}
              </span>
            ) : (
              <motion.span
                key={`light-${i}`}
                className="text-xl drop-shadow-md will-change-transform"
                animate={{ opacity: [0.55, 1, 0.55], scale: [0.92, 1.08, 0.92] }}
                transition={{ duration: 1.1, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
              >
                {light}
              </motion.span>
            )
          )}
        </div>
      </div>

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {(lowPerf ? DECORATIONS.slice(0, 7) : DECORATIONS).map((dec, i) =>
          lowPerf ? (
            <div
              key={`dec-${i}`}
              className="absolute text-2xl animate-float opacity-70"
              style={{ top: `${dec.top}%`, left: `${dec.left}%`, animationDelay: `${i * 0.2}s` }}
            >
              {dec.emoji}
            </div>
          ) : (
            <motion.div
              key={`dec-${i}`}
              className="absolute text-2xl will-change-transform"
              style={{ top: `${dec.top}%`, left: `${dec.left}%` }}
              animate={{ y: [0, -8], rotate: [-4, 4] }}
              transition={{ duration: 2.5 + i * 0.1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: i * 0.15 }}
            >
              {dec.emoji}
            </motion.div>
          )
        )}
      </div>

      {/* Floating cats on sides */}
      <div className="absolute inset-0 pointer-events-none">
        {SIDE_CATS.map((cat, i) =>
          lowPerf ? (
            <div
              key={`cat-${i}`}
              className="absolute text-4xl animate-float"
              style={{ top: `${cat.top}%`, left: i % 2 === 0 ? '4%' : '88%', animationDelay: `${i * 0.3}s` }}
            >
              {cat.emoji}
            </div>
          ) : (
            <motion.div
              key={`cat-${i}`}
              className="absolute text-4xl will-change-transform"
              style={{ top: `${cat.top}%`, left: i % 2 === 0 ? '4%' : '88%' }}
              animate={{ y: [0, -12, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
            >
              {cat.emoji}
            </motion.div>
          )
        )}
      </div>

      {/* Corner trees */}
      {lowPerf ? (
        <>
          <div className="absolute top-3 left-3 text-4xl opacity-80">🎄</div>
          <div className="absolute top-3 right-3 text-4xl opacity-80">🎄</div>
        </>
      ) : (
        <>
          <motion.div
            className="absolute top-3 left-3 text-4xl will-change-transform"
            animate={{ rotate: [-3, 3], scale: [1, 1.03, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            🎄
          </motion.div>
          <motion.div
            className="absolute top-3 right-3 text-4xl will-change-transform"
            animate={{ rotate: [3, -3], scale: [1, 1.03, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            🎄
          </motion.div>
        </>
      )}

      {/* Paw trail (background) */}
      <div className="absolute bottom-16 left-0 right-0 pointer-events-none opacity-30">
        <div className="relative h-10">
          {PAWS.map((p, i) =>
            lowPerf ? (
              <span
                key={`paw-${i}`}
                className="absolute text-2xl animate-float"
                style={{ left: `${p.left}%`, animationDelay: `${i * 0.12}s` }}
              >
                🐾
              </span>
            ) : (
              <motion.span
                key={`paw-${i}`}
                className="absolute text-2xl will-change-transform"
                style={{ left: `${p.left}%` }}
                animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.2, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
              >
                🐾
              </motion.span>
            )
          )}
        </div>
      </div>

      {/* Main content */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 max-w-md"
        aria-label="Game rules"
      >
        {/* Title */}
        <motion.header
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold text-primary mb-2"
            animate={
              lowPerf
                ? undefined
                : {
                    textShadow: [`2px 2px 0 ${green}`, `3px 3px 0 ${green}`, `2px 2px 0 ${green}`],
                  }
            }
            transition={lowPerf ? undefined : { duration: 1.6, repeat: Infinity }}
          >
            📜 Game Rules 📜
          </motion.h2>
          <p className="text-muted-foreground font-display">Pay attention, hooman!</p>
        </motion.header>

        {/* Rules cards */}
        <div className="space-y-4 mb-10">
          {RULES.map((rule, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.2, type: 'spring' }}
              className="relative"
            >
              <motion.div
                className="bg-card rounded-2xl p-5 shadow-lg border-[3px] border-accent flex items-center gap-4"
                whileHover={lowPerf ? undefined : { scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 }}
                animate={
                  lowPerf
                    ? undefined
                    : {
                        boxShadow: [cardShadowA, cardShadowB, cardShadowA],
                      }
                }
                transition={lowPerf ? undefined : { duration: 2.2, repeat: Infinity }}
              >
                <motion.span
                  className="text-4xl"
                  animate={lowPerf ? undefined : { scale: [1, 1.12], rotate: [-8, 8] }}
                  transition={
                    lowPerf
                      ? undefined
                      : {
                          scale: { duration: 0.75, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: index * 0.3 },
                          rotate: { duration: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: index * 0.3 },
                        }
                  }
                >
                  {rule.emoji}
                </motion.span>
                <p className="font-display text-lg md:text-xl text-foreground font-bold text-left">{rule.text}</p>
              </motion.div>

              {/* Decorative number */}
              <motion.div
                className="absolute -left-3 -top-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg"
                animate={lowPerf ? undefined : { rotate: [-8, 8] }}
                transition={lowPerf ? undefined : { duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              >
                {index + 1}
              </motion.div>
            </motion.article>
          ))}
        </div>

        {/* Warning text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mb-8">
          <motion.p
            className="text-muted-foreground font-display text-sm italic"
            animate={lowPerf ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={lowPerf ? undefined : { duration: 2, repeat: Infinity }}
          >
            ⚠️ Side effects may include: judging stares, dramatic sighs, and existential cat sass ⚠️
          </motion.p>
        </motion.div>

        {/* Start button */}
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 300 }}>
          <Button
            onClick={onStart}
            size="lg"
            className="text-xl px-10 py-7 rounded-2xl font-display font-bold shadow-cartoon-lg hover:shadow-glow-lg transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <motion.span animate={lowPerf ? undefined : { scale: [1, 1.05, 1] }} transition={lowPerf ? undefined : { duration: 0.6, repeat: Infinity }}>
              🔥 Start the Chaos 🔥
            </motion.span>
          </Button>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default RulesScreen;
