import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Snowfall from './Snowfall';

interface KittyWonderlandProps {
  onExit: () => void;
}

const kittenMessages = [
  { text: "Welcome to our winter wonderland! ❄️", delay: 1 },
  { text: "Did you bring treats? 🐟", delay: 4 },
  { text: "I knocked over 3 ornaments today. Personal best! 🎄", delay: 8 },
  { text: "That snowflake looked at me funny... 👀", delay: 12 },
  { text: "Meowry Christmas, hooman! 🎁", delay: 16 },
  { text: "I'm not stuck in the tree. I LIVE here now. 🌲", delay: 20 },
  { text: "*aggressive purring* 😸", delay: 24 },
  { text: "The jingle bells fear me. 🔔", delay: 28 },
];

const floatingElements = [
  { emoji: '🎄', size: 'text-6xl', depth: 0.8 },
  { emoji: '🎁', size: 'text-4xl', depth: 0.6 },
  { emoji: '⭐', size: 'text-3xl', depth: 0.4 },
  { emoji: '❄️', size: 'text-2xl', depth: 0.3 },
  { emoji: '🔔', size: 'text-3xl', depth: 0.5 },
  { emoji: '🎀', size: 'text-3xl', depth: 0.7 },
  { emoji: '✨', size: 'text-2xl', depth: 0.2 },
  { emoji: '🌟', size: 'text-4xl', depth: 0.55 },
  { emoji: '🧦', size: 'text-3xl', depth: 0.45 },
  { emoji: '🍪', size: 'text-2xl', depth: 0.35 },
  { emoji: '🥛', size: 'text-2xl', depth: 0.25 },
  { emoji: '🎅', size: 'text-5xl', depth: 0.9 },
];

const kittens = [
  { emoji: '😺', position: { x: 15, y: 60 }, depth: 0.7 },
  { emoji: '😸', position: { x: 75, y: 45 }, depth: 0.8 },
  { emoji: '🙀', position: { x: 50, y: 75 }, depth: 0.6 },
  { emoji: '😻', position: { x: 85, y: 70 }, depth: 0.9 },
  { emoji: '😹', position: { x: 25, y: 35 }, depth: 0.5 },
];

// Separate component for floating elements to avoid hook issues in map
const FloatingElement = ({ 
  el, 
  index, 
  isLoading, 
  smoothMouseX, 
  smoothMouseY 
}: { 
  el: { emoji: string; size: string; depth: number; x: number; y: number; rotation: number }; 
  index: number; 
  isLoading: boolean;
  smoothMouseX: any;
  smoothMouseY: any;
}) => {
  const x = useTransform(smoothMouseX, [-50, 50], [-30 * el.depth, 30 * el.depth]);
  const y = useTransform(smoothMouseY, [-50, 50], [-20 * el.depth, 20 * el.depth]);

  return (
    <motion.div
      className={`absolute ${el.size} pointer-events-none select-none`}
      style={{
        left: `${el.x}%`,
        top: `${el.y}%`,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isLoading ? 0 : [0.7, 1, 0.7],
        scale: isLoading ? 0 : 1,
        rotate: el.rotation,
      }}
      transition={{
        opacity: { duration: 3, repeat: Infinity, delay: index * 0.2 },
        scale: { delay: 1.5 + index * 0.1, type: 'spring' },
      }}
    >
      {el.emoji}
    </motion.div>
  );
};

// Separate component for kittens to avoid hook issues in map
const KittenWithBubble = ({ 
  kitten, 
  index, 
  isLoading, 
  activeMessages, 
  smoothMouseX, 
  smoothMouseY 
}: { 
  kitten: { emoji: string; position: { x: number; y: number }; depth: number }; 
  index: number; 
  isLoading: boolean;
  activeMessages: number[];
  smoothMouseX: any;
  smoothMouseY: any;
}) => {
  const x = useTransform(smoothMouseX, [-50, 50], [-40 * kitten.depth, 40 * kitten.depth]);
  const y = useTransform(smoothMouseY, [-50, 50], [-25 * kitten.depth, 25 * kitten.depth]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${kitten.position.x}%`,
        top: `${kitten.position.y}%`,
        x,
        y,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 50 : 0 }}
      transition={{ delay: 1.8 + index * 0.3, type: 'spring' }}
    >
      <motion.div
        className="text-5xl md:text-6xl cursor-pointer"
        animate={{ 
          y: [0, -8, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{ duration: 2 + index * 0.3, repeat: Infinity }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9, rotate: 15 }}
      >
        {kitten.emoji}
      </motion.div>

      <AnimatePresence>
        {activeMessages.includes(index) && index < kittenMessages.length && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl border-2 border-accent/30 whitespace-nowrap z-10"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
          >
            <p className="font-body text-sm text-foreground">
              {kittenMessages[index].text}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card/95 rotate-45 border-r-2 border-b-2 border-accent/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const KittyWonderland = ({ onExit }: KittyWonderlandProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeMessages, setActiveMessages] = useState<number[]>([]);
  const [hasGyroscope, setHasGyroscope] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  // Pre-calculate transforms at component level
  const groundX = useTransform(smoothMouseX, [-50, 50], [10, -10]);
  const mountainX = useTransform(smoothMouseX, [-50, 50], [5, -5]);
  const mountainY = useTransform(smoothMouseY, [-50, 50], [2, -2]);
  const moonX = useTransform(smoothMouseX, [-50, 50], [15, -15]);
  const moonY = useTransform(smoothMouseY, [-50, 50], [10, -10]);

  // Handle device orientation (gyroscope)
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        setHasGyroscope(true);
        const normalizedX = (event.gamma / 45) * 50;
        const normalizedY = ((event.beta - 45) / 45) * 50;
        mouseX.set(normalizedX);
        mouseY.set(normalizedY);
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // We'll trigger this on user interaction
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [mouseX, mouseY]);

  // Handle mouse/touch movement
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (containerRef.current && !hasGyroscope) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = ((clientX - rect.left - centerX) / centerX) * 50;
      const y = ((clientY - rect.top - centerY) / centerY) * 50;
      mouseX.set(x);
      mouseY.set(y);
    }
  }, [mouseX, mouseY, hasGyroscope]);

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Loading sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Kitten message timers
  useEffect(() => {
    if (isLoading) return;
    
    const timers = kittenMessages.map((msg, i) => 
      setTimeout(() => {
        setActiveMessages(prev => [...prev, i]);
        setTimeout(() => {
          setActiveMessages(prev => prev.filter(idx => idx !== i));
        }, 5000);
      }, msg.delay * 1000)
    );

    return () => timers.forEach(clearTimeout);
  }, [isLoading]);

  // Generate positions for floating elements (memoized with useMemo to avoid re-randomizing)
  const elementPositions = floatingElements.map((el, i) => ({
    ...el,
    x: 10 + (i * 7.5) % 80,
    y: 10 + ((i * 13) % 70),
    rotation: (i * 37) % 360, // deterministic rotation
  }));

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-[hsl(220,60%,15%)] via-[hsl(220,50%,20%)] to-[hsl(220,40%,10%)] overflow-hidden cursor-grab active:cursor-grabbing z-50"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-[hsl(220,50%,12%)] flex flex-col items-center justify-center z-50"
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-7xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🐱
            </motion.div>
            <motion.p
              className="mt-6 font-display text-xl text-white/80"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Entering Kitty Wonderland...
            </motion.p>
            <div className="mt-4 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-accent"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snowfall effect */}
      <Snowfall />

      {/* Aurora/Northern lights effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-secondary/40 via-transparent to-transparent"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-0 right-0 w-2/3 h-1/3 bg-gradient-to-bl from-primary/30 via-transparent to-transparent"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            x: [20, -20, 20],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Ground with snow */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/90 via-white/60 to-transparent"
        style={{ x: groundX }}
      />

      {/* Mountains in background */}
      <motion.div 
        className="absolute bottom-20 left-0 right-0 h-48 pointer-events-none"
        style={{ x: mountainX, y: mountainY }}
      >
        <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,200 L100,120 L200,160 L350,80 L500,140 L650,60 L800,130 L950,70 L1100,150 L1200,100 L1200,200 Z" 
            fill="hsl(220, 30%, 25%)"
            opacity="0.6"
          />
          <path 
            d="M0,200 L150,140 L300,170 L450,100 L600,160 L750,90 L900,150 L1050,110 L1200,170 L1200,200 Z" 
            fill="hsl(220, 25%, 35%)"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Floating Christmas elements with parallax */}
      {elementPositions.map((el, i) => (
        <FloatingElement
          key={i}
          el={el}
          index={i}
          isLoading={isLoading}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}

      {/* Kittens with speech bubbles */}
      {kittens.map((kitten, i) => (
        <KittenWithBubble
          key={i}
          kitten={kitten}
          index={i}
          isLoading={isLoading}
          activeMessages={activeMessages}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}

      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${(i * 3.33) % 100}%`,
              top: `${(i * 1.67) % 50}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1 + (i % 3),
              repeat: Infinity,
              delay: (i * 0.1) % 3,
            }}
          />
        ))}
      </div>

      {/* Central moon/glow */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(45, 100%, 90%) 0%, hsl(45, 100%, 70%) 30%, transparent 70%)',
          boxShadow: '0 0 60px 30px hsl(45, 100%, 70%, 0.3)',
          x: moonX,
          y: moonY,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.5 : 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />

      {/* Title overlay */}
      <motion.div
        className="absolute top-6 left-0 right-0 text-center pointer-events-none"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -30 : 0 }}
        transition={{ delay: 2 }}
      >
        <h1 className="font-display text-3xl md:text-5xl text-white drop-shadow-lg">
          ✨ Kitty Wonderland ✨
        </h1>
        <p className="font-body text-white/70 mt-2 text-sm md:text-base">
          {hasGyroscope ? 'Tilt your device to explore' : 'Move around to explore'}
        </p>
      </motion.div>

      {/* Jingle sounds indicator */}
      <motion.div
        className="absolute bottom-8 left-8 text-4xl pointer-events-none"
        animate={{ 
          rotate: [-10, 10, -10],
          y: [0, -5, 0],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        🔔
      </motion.div>

      {/* Exit button */}
      <motion.button
        onClick={onExit}
        className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-sm hover:bg-card text-foreground px-6 py-3 rounded-full font-display text-lg shadow-xl border-2 border-accent/30 flex items-center gap-2 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 50 : 0 }}
        transition={{ delay: 2.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🚪</span>
        <span>Exit Wonderland</span>
      </motion.button>

      {/* Hint text */}
      <motion.p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-white/50 text-xs md:text-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ delay: 3 }}
      >
        Tap kittens for surprises! 🐱
      </motion.p>
    </motion.div>
  );
};

export default KittyWonderland;
