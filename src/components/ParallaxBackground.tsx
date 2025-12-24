import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface ParallaxBackgroundProps {
  mouseX: number;
  mouseY: number;
}

const ParallaxBackground = ({ mouseX, mouseY }: ParallaxBackgroundProps) => {
  // Smooth parallax to avoid restarting tweens on every mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 70, damping: 20, mass: 0.7 });
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 20, mass: 0.7 });

  useEffect(() => {
    rawX.set((mouseX - 0.5) * 20);
    rawY.set((mouseY - 0.5) * 20);
  }, [mouseX, mouseY, rawX, rawY]);

  const farX = useTransform(smoothX, (v) => v * 0.3);
  const farY = useTransform(smoothY, (v) => v * 0.3);
  const midX = useTransform(smoothX, (v) => v * 0.6);
  const midY = useTransform(smoothY, (v) => v * 0.6);
  const nearX = smoothX;
  const nearY = smoothY;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Far background layer - moves slowest */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ x: farX, y: farY }}>
        {/* Distant trees/hills */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/10 to-transparent" />
        <motion.span
          className="absolute top-[15%] left-[5%] text-6xl opacity-10"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎄
        </motion.span>
        <motion.span
          className="absolute top-[20%] right-[8%] text-5xl opacity-10"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          🎄
        </motion.span>
        <motion.span
          className="absolute bottom-[10%] left-[12%] text-7xl opacity-10"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        >
          🏔️
        </motion.span>
        <motion.span
          className="absolute bottom-[8%] right-[15%] text-7xl opacity-10"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          🏔️
        </motion.span>
      </motion.div>

      {/* Mid background layer */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ x: midX, y: midY }}>
        {/* Medium elements */}
        <motion.span
          className="absolute top-[25%] left-[15%] text-4xl opacity-20"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          ⭐
        </motion.span>
        <motion.span
          className="absolute top-[30%] right-[20%] text-3xl opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute bottom-[25%] left-[25%] text-5xl opacity-15"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎄
        </motion.span>
        <motion.span
          className="absolute bottom-[30%] right-[10%] text-4xl opacity-15"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        >
          🎄
        </motion.span>
      </motion.div>

      {/* Floating decorations layer - moves most */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ x: nearX, y: nearY }}>
        {/* Christmas lights string effect */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-around opacity-30">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i % 4 === 0
                  ? 'bg-primary'
                  : i % 4 === 1
                    ? 'bg-secondary'
                    : i % 4 === 2
                      ? 'bg-accent'
                      : 'bg-gold'
              }`}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>

        {/* Floating ornaments */}
        <motion.span
          className="absolute top-[40%] left-[5%] text-3xl opacity-30"
          animate={{ y: [0, -10], rotate: [-8, 8] }}
          transition={{
            y: { duration: 2.5, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' },
            rotate: { duration: 2, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' },
          }}
        >
          🎀
        </motion.span>
        <motion.span
          className="absolute top-[35%] right-[3%] text-2xl opacity-30"
          animate={{ y: [0, -12], rotate: [-12, 12] }}
          transition={{
            y: { duration: 2, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut', delay: 1 },
            rotate: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut', delay: 1 },
          }}
        >
          🔔
        </motion.span>
        <motion.span
          className="absolute bottom-[40%] left-[8%] text-2xl opacity-25"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          🎁
        </motion.span>
        <motion.span
          className="absolute bottom-[35%] right-[6%] text-3xl opacity-25"
          animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          ❄️
        </motion.span>
      </motion.div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/30" />
    </div>
  );
};

export default ParallaxBackground;
