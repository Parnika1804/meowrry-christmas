import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Kitten as KittenType } from '@/data/gameData';
import SpeechBubble from './SpeechBubble';

interface KittenProps {
  kitten: KittenType;
  onTap: (kittenId: string) => void;
  reaction: { message: string; isSuccess: boolean } | null;
  isMatched: boolean;
  hasSelectedGift: boolean;
  isThrowing?: boolean;
}

const Kitten = ({ kitten, onTap, reaction, isMatched, hasSelectedGift, isThrowing }: KittenProps) => {
  const [showBubble, setShowBubble] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<'idle' | 'happy' | 'angry'>('idle');
  const [isDoingThrow, setIsDoingThrow] = useState(false);

  // Handle throwing animation state
  useEffect(() => {
    if (isThrowing) {
      setIsDoingThrow(true);
      const timer = setTimeout(() => setIsDoingThrow(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isThrowing]);

  useEffect(() => {
    if (reaction) {
      setShowBubble(true);
      setCurrentReaction(reaction.isSuccess ? 'happy' : 'angry');
      
      const timer = setTimeout(() => {
        setShowBubble(false);
        if (!isMatched) {
          setCurrentReaction('idle');
        }
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [reaction, isMatched]);

  const handleClick = () => {
    if (!isMatched && hasSelectedGift) {
      onTap(kitten.id);
    }
  };

  // Pattern overlay
  const getPatternOverlay = () => {
    switch (kitten.pattern) {
      case 'striped':
        return (
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-2"
                style={{
                  top: `${20 + i * 15}%`,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  transform: 'rotate(-15deg)',
                }}
              />
            ))}
          </div>
        );
      case 'spotted':
        return (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-black/20"
                style={{
                  top: `${25 + (i % 2) * 30}%`,
                  left: `${15 + i * 20}%`,
                }}
              />
            ))}
          </div>
        );
      case 'tuxedo':
        return (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-10 bg-white rounded-t-full" />
          </div>
        );
      case 'calico':
        return (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-orange-400/40" />
            <div className="absolute bottom-4 right-2 w-5 h-5 rounded-full bg-gray-800/30" />
          </div>
        );
      default:
        return null;
    }
  };

  // Eye expressions
  const getEyes = () => {
    const baseClass = "absolute top-1/3 flex items-center justify-center";
    
    if (isMatched || currentReaction === 'happy') {
      // Happy squinty eyes
      return (
        <div className={`${baseClass} w-full px-4 gap-4`}>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="w-5 h-5 rounded-full flex items-center justify-center"
          >
            <div className="w-full h-1 bg-warmBrown rounded-full transform rotate-12" />
          </motion.div>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 0.5, repeat: 2, delay: 0.1 }}
            className="w-5 h-5 rounded-full flex items-center justify-center"
          >
            <div className="w-full h-1 bg-warmBrown rounded-full transform -rotate-12" />
          </motion.div>
        </div>
      );
    }
    
    if (currentReaction === 'angry') {
      // Angry eyes
      return (
        <div className={`${baseClass} w-full px-4 gap-4`}>
          <motion.div
            animate={{ rotate: [-15, -20, -15] }}
            transition={{ duration: 0.2, repeat: 3 }}
            className="relative"
          >
            <div 
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: kitten.eyeColor }}
            />
            <div className="absolute top-0 left-0 w-full h-2 bg-warmBrown/80 origin-left -rotate-12" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />
          </motion.div>
          <motion.div
            animate={{ rotate: [15, 20, 15] }}
            transition={{ duration: 0.2, repeat: 3 }}
            className="relative"
          >
            <div 
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: kitten.eyeColor }}
            />
            <div className="absolute top-0 right-0 w-full h-2 bg-warmBrown/80 origin-right rotate-12" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />
          </motion.div>
        </div>
      );
    }

    // Normal cute eyes with blink
    return (
      <div className={`${baseClass} w-full px-4 gap-4`}>
        <motion.div
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          className="relative"
        >
          <div 
            className="w-6 h-6 rounded-full shadow-inner"
            style={{ backgroundColor: kitten.eyeColor }}
          />
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80" />
          <motion.div 
            animate={{ x: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" 
          />
        </motion.div>
        <motion.div
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          className="relative"
        >
          <div 
            className="w-6 h-6 rounded-full shadow-inner"
            style={{ backgroundColor: kitten.eyeColor }}
          />
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80" />
          <motion.div 
            animate={{ x: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" 
          />
        </motion.div>
      </div>
    );
  };

  // Mouth expression
  const getMouth = () => {
    if (isMatched || currentReaction === 'happy') {
      return (
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: 3 }}
        >
          <div className="text-lg">😸</div>
        </motion.div>
      );
    }
    
    if (currentReaction === 'angry') {
      return (
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 0.1, repeat: 5 }}
        >
          <svg width="24" height="12" viewBox="0 0 24 12">
            <path
              d="M4 4 C8 10, 16 10, 20 4"
              stroke="#8B4513"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      );
    }

    // Cute cat mouth
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <svg width="20" height="12" viewBox="0 0 20 12">
          <path
            d="M2 2 Q10 12, 10 4 Q10 12, 18 2"
            stroke="#FFB6C1"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        {/* Nose */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-2 bg-pink-400 rounded-full" />
      </div>
    );
  };

  const getKittenAnimation = () => {
    // Throwing motion - quick swipe forward (use simpler 2-keyframe for spring compat)
    if (isDoingThrow) {
      return {
        x: [0, 8],
        rotate: [0, 12],
        scale: [1, 1.05],
      };
    }
    if (currentReaction === 'happy') {
      return {
        y: [0, -15],
        rotate: [-5, 5],
        scale: [1, 1.1],
      };
    }
    if (currentReaction === 'angry') {
      return {
        x: [-8, 8],
        rotate: [-8, 8],
      };
    }
    return {
      y: [0, -8],
      rotate: [0, 1],
    };
  };

  const getKittenTransition = () => {
    if (isDoingThrow) {
      return { duration: 0.15, repeat: 2, repeatType: 'reverse' as const, ease: "easeOut" as const };
    }
    if (currentReaction === 'happy') {
      return { duration: 0.25, repeat: 4, repeatType: 'reverse' as const, ease: "easeInOut" as const };
    }
    if (currentReaction === 'angry') {
      return { duration: 0.1, repeat: 4, repeatType: 'reverse' as const, ease: "easeInOut" as const };
    }
    return { duration: 1, repeat: Infinity, repeatType: 'reverse' as const, ease: "easeInOut" as const };
  };

  return (
    <motion.div
      className={`kitten-container relative ${hasSelectedGift && !isMatched ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      whileHover={{ scale: isMatched ? 1 : 1.05 }}
      whileTap={hasSelectedGift && !isMatched ? { scale: 0.95 } : {}}
    >
      <AnimatePresence>
        {showBubble && (
          <SpeechBubble
            message={reaction?.message || ''}
            isSuccess={reaction?.isSuccess || false}
            visible={showBubble}
          />
        )}
      </AnimatePresence>

      {/* Kitten Body */}
      <motion.div
        className="relative transition-transform duration-200"
        style={{ filter: isMatched ? 'brightness(1.1)' : 'none' }}
        animate={getKittenAnimation()}
        transition={getKittenTransition()}
      >
        {/* Ears with inner color */}
        <motion.div 
          className="absolute -top-5 left-2 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent"
          style={{ borderBottomColor: kitten.color }}
          animate={{ rotate: currentReaction === 'angry' ? [-5, 0] : [0, 3, 0] }}
          transition={{ duration: 0.5, repeat: currentReaction === 'idle' ? Infinity : 0 }}
        />
        <div className="absolute -top-3 left-4 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-l-transparent border-r-transparent border-b-pink-300" />
        
        <motion.div 
          className="absolute -top-5 right-2 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent"
          style={{ borderBottomColor: kitten.color }}
          animate={{ rotate: currentReaction === 'angry' ? [5, 0] : [0, -3, 0] }}
          transition={{ duration: 0.5, repeat: currentReaction === 'idle' ? Infinity : 0, delay: 0.2 }}
        />
        <div className="absolute -top-3 right-4 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-l-transparent border-r-transparent border-b-pink-300" />

        {/* Head */}
        <div
          className="w-24 h-24 rounded-full relative shadow-lg"
          style={{ 
            backgroundColor: kitten.color,
            boxShadow: `inset -4px -4px 8px rgba(0,0,0,0.1), inset 4px 4px 8px rgba(255,255,255,0.3)`
          }}
        >
          {getPatternOverlay()}
          {getEyes()}
          {getMouth()}
          
          {/* Cheek blush */}
          <div className="absolute left-1 top-1/2 w-4 h-3 rounded-full bg-pink-300 opacity-50 blur-[1px]" />
          <div className="absolute right-1 top-1/2 w-4 h-3 rounded-full bg-pink-300 opacity-50 blur-[1px]" />
          
          {/* Whiskers */}
          <div className="absolute left-0 top-[55%] flex flex-col gap-1.5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-0.5 bg-warmBrown/50 rounded-full"
                style={{ transform: `rotate(${(i - 1) * 15}deg)` }}
                animate={{ scaleX: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <div className="absolute right-0 top-[55%] flex flex-col gap-1.5">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-0.5 bg-warmBrown/50 rounded-full"
                style={{ transform: `rotate(${(1 - i) * 15}deg)` }}
                animate={{ scaleX: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div
          className="w-20 h-14 rounded-b-full mx-auto -mt-3 relative shadow-md"
          style={{ 
            backgroundColor: kitten.color,
            boxShadow: `inset -3px -3px 6px rgba(0,0,0,0.1)`
          }}
        >
          {/* Paws - animate during throw */}
          <motion.div 
            className="absolute -bottom-1 left-2 w-4 h-4 rounded-full"
            style={{ backgroundColor: kitten.color }}
            animate={isDoingThrow ? { x: [0, 12, 0], y: [0, -8, 0], rotate: [0, 45, 0] } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -bottom-1 right-2 w-4 h-4 rounded-full"
            style={{ backgroundColor: kitten.color }}
            animate={isDoingThrow ? { x: [0, 15, 0], y: [0, -12, 0], rotate: [0, 60, 0] } : {}}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          />
        </div>

        {/* Tail */}
        <motion.div
          className="absolute -right-8 bottom-4 w-10 h-4 rounded-full origin-left"
          style={{ backgroundColor: kitten.color }}
          animate={{ 
            rotate: currentReaction === 'angry' ? [-20, 20, -20] : [-10, 15, -10],
            scaleY: currentReaction === 'angry' ? [1, 1.5, 1] : 1
          }}
          transition={{ 
            duration: currentReaction === 'angry' ? 0.2 : 0.8, 
            repeat: Infinity 
          }}
        />

        {/* Matched indicator */}
        <AnimatePresence>
          {isMatched && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 text-3xl"
            >
              ✨
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Name */}
      <motion.div 
        className="mt-4 text-center px-2"
      >
        <h3 className="font-display font-bold text-foreground text-sm md:text-base drop-shadow-sm">
          {kitten.name}
        </h3>
      </motion.div>

      {/* Hanging Tagline Box */}
      <motion.div
        className="relative mt-3"
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Strings / Ribbons */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-8">
          <motion.div 
            className="w-0.5 h-4 bg-gradient-to-b from-secondary to-secondary/50 rounded-full"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="w-0.5 h-4 bg-gradient-to-b from-secondary to-secondary/50 rounded-full"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
        
        {/* Tag Box */}
        <motion.div
          className="bg-gradient-to-br from-card via-card to-accent/20 border-3 border-secondary rounded-xl px-3 py-2 shadow-lg relative"
          whileHover={{ scale: 1.05, rotate: 2 }}
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          }}
        >
          {/* Decorative ribbon bow */}
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎀
          </motion.div>
          
          <p className="text-xs md:text-sm font-display font-bold text-foreground leading-tight text-center mt-1">
            "{kitten.tagline}"
          </p>
        </motion.div>
      </motion.div>

      {/* Tap hint when gift selected */}
      <AnimatePresence>
        {hasSelectedGift && !isMatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 border-4 border-dashed border-accent rounded-3xl bg-accent/20 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Kitten;
