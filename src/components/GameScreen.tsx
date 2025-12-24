import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { kittens, gifts, getRandomMessage, Gift } from '@/data/gameData';
import Kitten from './Kitten';
import GiftCard from './GiftCard';
import Confetti from './Confetti';
import GameHUD from './GameHUD';
import FloatingBadge from './FloatingBadge';
import ParallaxBackground from './ParallaxBackground';
import ActionFeedback from './ActionFeedback';
import { 
  playHappyMeow, 
  playGrumpyMeow, 
  playSuccessChime, 
  playRejectSound,
  playWhooshSound,
  playThudSound,
  startBackgroundAmbience,
  stopBackgroundAmbience,
  setAmbienceVolume
} from '@/utils/sounds';

interface Reaction {
  kittenId: string;
  message: string;
  isSuccess: boolean;
}

interface GiftAnimation {
  giftId: string;
  state: 'idle' | 'flying' | 'rejected' | 'accepted' | 'thrown';
  targetPosition?: { x: number; y: number };
  throwDirection?: { x: number; y: number };
}

interface ThrowingKitten {
  kittenId: string;
  timestamp: number;
}

interface GameScreenProps {
  revealedGifts?: Gift[];
  onGameComplete?: () => void;
}

const GameScreen = ({ revealedGifts, onGameComplete }: GameScreenProps) => {
  // Use revealed gifts if provided, otherwise show all gifts
  const availableGifts = revealedGifts && revealedGifts.length > 0 ? revealedGifts : gifts;
  const [matchedGifts, setMatchedGifts] = useState<Record<string, string>>({});
  const [usedGifts, setUsedGifts] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [giftAnimations, setGiftAnimations] = useState<Record<string, GiftAnimation>>({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [throwingKittens, setThrowingKittens] = useState<Record<string, ThrowingKitten>>({});
  const kittenRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const giftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Mouse position for parallax
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const mouseRafId = useRef<number | null>(null);
  const latestMousePos = useRef({ x: 0.5, y: 0.5 });
  
  // Feedback states
  const [feedbackType, setFeedbackType] = useState<'sparkle' | 'confetti' | 'poof' | 'purr' | 'none'>('none');
  const [feedbackTrigger, setFeedbackTrigger] = useState(0);
  const [feedbackPosition, setFeedbackPosition] = useState({ x: 0, y: 0 });
  
  // Floating badge state
  const [badgeState, setBadgeState] = useState<{ visible: boolean; type: 'correct' | 'wrong' | 'streak' | 'complete'; message: string }>({
    visible: false,
    type: 'correct',
    message: ''
  });

  // Track mouse for parallax (throttled via rAF to prevent excessive rerenders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      latestMousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };

      if (mouseRafId.current != null) return;
      mouseRafId.current = window.requestAnimationFrame(() => {
        setMousePos(latestMousePos.current);
        mouseRafId.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseRafId.current != null) window.cancelAnimationFrame(mouseRafId.current);
    };
  }, []);

  // Start ambient sound after first user interaction (browsers require gesture for audio)
  const [ambienceStarted, setAmbienceStarted] = useState(false);
  
  useEffect(() => {
    const startAudio = () => {
      if (soundEnabled && !ambienceStarted) {
        startBackgroundAmbience();
        setAmbienceStarted(true);
      }
    };
    
    // Listen for first interaction
    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
    
    return () => {
      stopBackgroundAmbience();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, [soundEnabled, ambienceStarted]);

  useEffect(() => {
    if (soundEnabled) {
      setAmbienceVolume(1);
    } else {
      setAmbienceVolume(0);
    }
  }, [soundEnabled]);

  const showBadge = (type: 'correct' | 'wrong' | 'streak' | 'complete', message: string) => {
    setBadgeState({ visible: true, type, message });
    setTimeout(() => setBadgeState(prev => ({ ...prev, visible: false })), 1500);
  };

  const handleGiftSelect = useCallback((giftId: string) => {
    if (usedGifts.has(giftId)) return;
    setSelectedGiftId(prev => prev === giftId ? null : giftId);
  }, [usedGifts]);

  const handleKittenTap = useCallback((kittenId: string) => {
    if (!selectedGiftId || matchedGifts[kittenId]) return;
    
    const kitten = kittens.find(k => k.id === kittenId);
    if (!kitten) return;

    const giftId = selectedGiftId;
    const isCorrect = kitten.correctGift === giftId;

    // Get kitten position for feedback effects
    const kittenEl = kittenRefs.current[kittenId];
    if (kittenEl) {
      const rect = kittenEl.getBoundingClientRect();
      setFeedbackPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }

    if (isCorrect) {
      setGiftAnimations(prev => ({
        ...prev,
        [giftId]: { giftId, state: 'accepted' }
      }));

      const message = getRandomMessage(kitten.acceptMessages);
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Trigger sparkle effect
      setFeedbackType('sparkle');
      setFeedbackTrigger(prev => prev + 1);
      
      setTimeout(() => {
        setReactions(prev => ({
          ...prev,
          [kittenId]: { kittenId, message, isSuccess: true }
        }));
        setMatchedGifts(prev => ({ ...prev, [kittenId]: giftId }));
        setUsedGifts(prev => new Set([...prev, giftId]));
        setScore(prev => prev + 1);
        setShowConfetti(true);
        
        // Show badge
        if (newStreak >= 3) {
          showBadge('streak', `${newStreak}x STREAK!`);
        } else {
          showBadge('correct', 'PURRFECT! ✨');
        }
        
        // Trigger purr effect
        setFeedbackType('purr');
        setFeedbackTrigger(prev => prev + 1);
        
        if (soundEnabled) {
          playHappyMeow(kittenId);
          playSuccessChime();
        }
      }, 300);
    } else {
      // Reset streak on wrong answer
      setStreak(0);
      
      // Calculate throw direction based on kitten and gift positions
      const giftEl = giftRefs.current[giftId];
      let throwDirection = { x: 0, y: 80 };
      
      if (kittenEl && giftEl) {
        const kittenRect = kittenEl.getBoundingClientRect();
        const giftRect = giftEl.getBoundingClientRect();
        throwDirection = {
          x: (kittenRect.left - giftRect.left) * 0.6,
          y: (kittenRect.top - giftRect.top) * 0.4
        };
      }

      // Start kitten throwing animation
      setThrowingKittens(prev => ({
        ...prev,
        [kittenId]: { kittenId, timestamp: Date.now() }
      }));

      // Play whoosh sound when kitten throws
      if (soundEnabled) {
        playWhooshSound();
      }

      // Trigger poof effect
      setFeedbackType('poof');
      setFeedbackTrigger(prev => prev + 1);
      
      // Show wrong badge
      showBadge('wrong', 'NOPE! 😾');

      // After a brief delay, start the gift flying back
      setTimeout(() => {
        setGiftAnimations(prev => ({
          ...prev,
          [giftId]: { giftId, state: 'thrown', throwDirection }
        }));

        // Play thud when gift lands
        setTimeout(() => {
          if (soundEnabled) {
            playThudSound();
          }
        }, 350);
      }, 150);

      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);

      const message = getRandomMessage(kitten.refuseMessages);
      
      // Delay reaction message to show after throw
      setTimeout(() => {
        setReactions(prev => ({
          ...prev,
          [kittenId]: { kittenId, message, isSuccess: false }
        }));
      }, 200);

      if (soundEnabled) {
        playGrumpyMeow(kittenId);
        playRejectSound();
      }
      
      // Clear throwing state
      setTimeout(() => {
        setThrowingKittens(prev => {
          const newState = { ...prev };
          delete newState[kittenId];
          return newState;
        });
      }, 400);
      
      // Reset gift animation after throw completes
      setTimeout(() => {
        setGiftAnimations(prev => ({
          ...prev,
          [giftId]: { giftId, state: 'idle' }
        }));
      }, 700);
    }

    setSelectedGiftId(null);
  }, [selectedGiftId, matchedGifts, soundEnabled, streak]);

  const handleReplay = useCallback(() => {
    setMatchedGifts({});
    setUsedGifts(new Set());
    setReactions({});
    setGiftAnimations({});
    setScore(0);
    setStreak(0);
    setShowConfetti(false);
    setSelectedGiftId(null);
    setThrowingKittens({});
    setShowWinModal(false);
    setShowConfetti(false);
    setSelectedGiftId(null);
    setThrowingKittens({});
  }, []);

  const allKittensMatched = Object.keys(matchedGifts).length === 5;
  const [showWinModal, setShowWinModal] = useState(false);

  // Delay showing win modal so user can see last kitten's message
  useEffect(() => {
    if (allKittensMatched && !showWinModal) {
      const timer = setTimeout(() => {
        setShowWinModal(true);
        showBadge('complete', 'ALL DONE! 🎉');
      }, 2500); // 2.5 second delay to read the last message
      return () => clearTimeout(timer);
    }
  }, [allKittensMatched, showWinModal]);

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      animate={screenShake ? { x: [-6, 6], rotate: [-1, 1] } : { x: 0, rotate: 0 }}
      transition={screenShake 
        ? { duration: 0.08, repeat: 5, repeatType: 'reverse' as const, ease: "easeInOut" }
        : { duration: 0.3 }
      }
    >
      {/* Parallax Background */}
      <ParallaxBackground mouseX={mousePos.x} mouseY={mousePos.y} />
      
      {/* Action Feedback Effects */}
      <ActionFeedback type={feedbackType} trigger={feedbackTrigger} position={feedbackPosition} />
      
      {/* Floating Badge */}
      <FloatingBadge 
        type={badgeState.type} 
        message={badgeState.message} 
        visible={badgeState.visible} 
      />
      
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Game HUD */}
      <GameHUD 
        score={score} 
        maxScore={5} 
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Game Area - with top padding for HUD */}
      <div className="relative z-10 pt-24 md:pt-28 p-4 md:p-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.h1 
            className="game-title text-primary text-2xl md:text-4xl lg:text-5xl"
            animate={{ 
              textShadow: [
                '3px 3px 0 hsl(140, 50%, 35%)',
                '4px 4px 0 hsl(140, 50%, 35%)',
                '3px 3px 0 hsl(140, 50%, 35%)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Meowry Christmas 🎄😺
          </motion.h1>
        </motion.div>

        {/* Kittens Row - Foreground layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mb-8 max-w-6xl mx-auto relative z-20"
          style={{ transform: `translate(${(mousePos.x - 0.5) * -8}px, ${(mousePos.y - 0.5) * -4}px)` }}
        >
          {kittens.map((kitten, index) => (
            <motion.div
              key={kitten.id}
              ref={el => { kittenRefs.current[kitten.id] = el; }}
              initial={{ opacity: 0, y: 40, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.1 * index, type: 'spring', stiffness: 200 }}
            >
              <Kitten
                kitten={kitten}
                onTap={handleKittenTap}
                reaction={reactions[kitten.id] || null}
                isMatched={!!matchedGifts[kitten.id]}
                hasSelectedGift={!!selectedGiftId}
                isThrowing={!!throwingKittens[kitten.id]}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Divider - with playful animation */}
        <motion.div 
          className="flex items-center justify-center gap-3 md:gap-4 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="h-1.5 w-16 md:w-24 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
            animate={{ scaleX: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-xl border-3 border-accent shadow-cartoon"
            whileHover={{ scale: 1.05, rotate: [-2, 2, 0] }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              className="text-2xl"
              animate={{ rotate: [-10, 10], scale: [1, 1.1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }}
            >
              🎁
            </motion.span>
            <span className="font-display text-lg md:text-xl text-foreground font-bold">
              Pick a Gift!
            </span>
            <motion.span 
              className="text-2xl"
              animate={{ rotate: [10, -10], scale: [1, 1.1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut', delay: 0.5 }}
            >
              🎁
            </motion.span>
          </motion.div>
          <motion.div 
            className="h-1.5 w-16 md:w-24 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
            animate={{ scaleX: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Gifts Row - Mid-ground layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5 max-w-5xl mx-auto relative z-10"
          style={{ transform: `translate(${(mousePos.x - 0.5) * -4}px, ${(mousePos.y - 0.5) * -2}px)` }}
        >
          {availableGifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              ref={el => { giftRefs.current[gift.id] = el; }}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6 + 0.1 * index, type: 'spring', stiffness: 300 }}
            >
              <GiftCard
                gift={gift}
                isUsed={usedGifts.has(gift.id)}
                isSelected={selectedGiftId === gift.id}
                onSelect={handleGiftSelect}
                animationState={giftAnimations[gift.id]?.state || 'idle'}
                throwDirection={giftAnimations[gift.id]?.throwDirection}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-border shadow-cartoon"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💡
            </motion.span>
            <span className="text-sm text-muted-foreground font-display">
              Tap a gift, then tap a kitten to give it!
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Win Message */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-gradient-to-br from-card via-card to-accent/20 rounded-3xl p-6 md:p-8 text-center shadow-2xl max-w-md border-4 border-accent"
              initial={{ y: 100, scale: 0.5, rotate: -10 }}
              animate={{ y: 0, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div 
                className="text-6xl md:text-7xl mb-4"
                animate={{ 
                  rotate: [-10, 10],
                  scale: [1, 1.15]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }}
              >
                🎉😻🎄
              </motion.div>
              <motion.h2 
                className="font-display text-3xl md:text-4xl font-bold text-primary mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                PURRFECT!!
              </motion.h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4 font-display">
                All kittens got their gifts! You're a certified cat whisperer now. 🏆
              </p>
              <div className="flex gap-3 justify-center text-3xl md:text-4xl mb-6">
                {['😸', '😻', '😺', '😽', '🐱'].map((cat, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -12],
                      rotate: [-8, 8]
                    }}
                    transition={{ 
                      y: { delay: i * 0.15, repeat: Infinity, repeatType: 'reverse' as const, duration: 0.3, ease: 'easeInOut' },
                      rotate: { delay: i * 0.15, repeat: Infinity, repeatType: 'reverse' as const, duration: 0.4, ease: 'easeInOut' }
                    }}
                  >
                    {cat}
                  </motion.span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {onGameComplete && (
                  <motion.button
                    onClick={onGameComplete}
                    className="px-6 py-3 bg-gold text-warmBrown font-display font-bold text-base md:text-lg rounded-full shadow-cartoon-lg border-4 border-gold/50 hover:bg-gold/90 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🐱 See Your Cat Breed!
                  </motion.button>
                )}
                <motion.button
                  onClick={handleReplay}
                  className="px-6 py-3 bg-primary text-primary-foreground font-display font-bold text-base md:text-lg rounded-full shadow-cartoon-lg border-4 border-accent hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Play Again!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameScreen;
