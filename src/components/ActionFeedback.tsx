import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  scale: number;
  rotation: number;
}

interface ActionFeedbackProps {
  type: 'sparkle' | 'confetti' | 'poof' | 'purr' | 'none';
  trigger: number; // Changes to this value trigger the effect
  position?: { x: number; y: number };
}

const ActionFeedback = ({ type, trigger, position }: ActionFeedbackProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showPurr, setShowPurr] = useState(false);

  useEffect(() => {
    if (trigger === 0 || type === 'none') return;

    if (type === 'sparkle') {
      const newParticles = [...Array(8)].map((_, i) => ({
        id: Date.now() + i,
        x: Math.cos((i / 8) * Math.PI * 2) * 60,
        y: Math.sin((i / 8) * Math.PI * 2) * 60,
        emoji: ['✨', '⭐', '💫', '🌟'][i % 4],
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }

    if (type === 'confetti') {
      const newParticles = [...Array(12)].map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 120,
        y: -Math.random() * 100 - 50,
        emoji: ['🎉', '🎊', '✨', '💖', '⭐', '🌟'][i % 6],
        scale: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * 720,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 800);
    }

    if (type === 'poof') {
      const newParticles = [...Array(6)].map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        emoji: ['💨', '💭', '☁️'][i % 3],
        scale: 0.8 + Math.random() * 0.4,
        rotation: Math.random() * 180,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 500);
    }

    if (type === 'purr') {
      setShowPurr(true);
      setTimeout(() => setShowPurr(false), 1000);
    }
  }, [trigger, type]);

  return (
    <>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="fixed pointer-events-none text-2xl z-50"
            initial={{ 
              x: position?.x || window.innerWidth / 2, 
              y: position?.y || window.innerHeight / 2,
              scale: 0,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              x: (position?.x || window.innerWidth / 2) + particle.x,
              y: (position?.y || window.innerHeight / 2) + particle.y,
              scale: particle.scale,
              rotate: particle.rotation,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {particle.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Purr waves effect */}
      <AnimatePresence>
        {showPurr && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: position?.x || '50%',
              top: position?.y || '50%',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2, 3], opacity: [1, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 w-20 h-20 -ml-10 -mt-10 border-4 border-accent rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionFeedback;
