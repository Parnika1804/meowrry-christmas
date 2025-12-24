import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gift } from '@/data/gameData';

interface GiftCardProps {
  gift: Gift;
  isUsed: boolean;
  isSelected: boolean;
  onSelect: (giftId: string) => void;
  animationState: 'idle' | 'flying' | 'rejected' | 'accepted' | 'thrown';
  throwDirection?: { x: number; y: number };
}

const GiftCard = ({ gift, isUsed, isSelected, onSelect, animationState, throwDirection }: GiftCardProps) => {
  const [showImpact, setShowImpact] = useState(false);

  const handleClick = () => {
    if (!isUsed && animationState === 'idle') {
      onSelect(gift.id);
    }
  };

  // Show impact effect when thrown animation completes
  useEffect(() => {
    if (animationState === 'thrown') {
      const timer = setTimeout(() => {
        setShowImpact(true);
        setTimeout(() => setShowImpact(false), 300);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  const getAnimateProps = () => {
    if (animationState === 'thrown' && throwDirection) {
      // Gift flies back from kitten with arc trajectory
      return {
        x: [throwDirection.x, throwDirection.x * 0.3, 0],
        y: [throwDirection.y, throwDirection.y - 60, 0],
        rotate: [0, 360, 720],
        scale: [0.6, 1.1, 1],
      };
    }
    if (animationState === 'rejected') {
      return { x: [0, -20, 20, -15, 15, 0], rotate: [0, -10, 10, -5, 5, 0] };
    }
    if (animationState === 'accepted') {
      return { scale: [1, 1.2, 0], y: [0, -50, -50], opacity: [1, 1, 0] };
    }
    return { opacity: 1, y: 0, scale: isSelected ? 1.1 : 1, x: 0, rotate: 0 };
  };

  const getTransition = () => {
    if (animationState === 'thrown') {
      return { 
        type: 'tween' as const, 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        times: [0, 0.6, 1]
      };
    }
    if (animationState === 'rejected' || animationState === 'accepted') {
      return { type: 'tween' as const, duration: 0.5, ease: 'easeInOut' as const };
    }
    return { type: 'spring' as const, stiffness: 400, damping: 20 };
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`gift-card relative overflow-hidden cursor-pointer ${isUsed ? 'opacity-40 cursor-not-allowed' : ''}`}
      style={{
        borderColor: isSelected ? gift.color : isUsed ? 'transparent' : gift.color,
        background: isUsed ? 'hsl(var(--muted))' : `linear-gradient(145deg, hsl(var(--card)) 0%, ${gift.color}30 100%)`,
        boxShadow: isSelected ? `0 0 20px ${gift.color}80, 0 0 40px ${gift.color}40` : undefined,
      }}
      whileHover={!isUsed && animationState === 'idle' ? { scale: 1.1, y: -5 } : {}}
      whileTap={!isUsed && animationState === 'idle' ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 30 }}
      animate={getAnimateProps()}
      transition={getTransition()}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-full">
        <div className="w-full h-full opacity-40" style={{ backgroundColor: gift.color }} />
      </div>
      <div className="absolute top-1/4 left-0 w-full h-5">
        <div className="w-full h-full opacity-40" style={{ backgroundColor: gift.color }} />
      </div>
      <motion.div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl"
        style={{ filter: isUsed ? 'grayscale(100%)' : 'none' }}
        animate={isSelected ? { rotate: [-10, 10, -10], scale: [1, 1.2, 1] } : { rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
        transition={{ type: 'tween', duration: isSelected ? 0.5 : 2, repeat: Infinity }}
      >
        🎀
      </motion.div>
      <div className="relative z-10 flex flex-col items-center pt-5">
        <motion.span 
          className="text-5xl mb-2 drop-shadow-lg"
          animate={isSelected ? { y: [0, -8, 0], scale: [1, 1.1, 1] } : { y: [0, -3, 0] }}
          transition={{ type: 'tween', duration: isSelected ? 0.6 : 2, repeat: Infinity }}
        >
          {gift.emoji}
        </motion.span>
        <span className="font-display font-bold text-sm text-center text-foreground">{gift.name}</span>
      </div>
      {isUsed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 text-xl bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center">✓</motion.div>
      )}
      
      {/* Impact effect when gift lands */}
      <AnimatePresence>
        {showImpact && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Sparkle burst */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-accent rounded-full"
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{ 
                    x: Math.cos(i * 60 * Math.PI / 180) * 30,
                    y: Math.sin(i * 60 * Math.PI / 180) * 30,
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              ))}
            </div>
            {/* Ring effect */}
            <motion.div
              className="absolute inset-0 border-4 border-accent rounded-2xl"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GiftCard;
