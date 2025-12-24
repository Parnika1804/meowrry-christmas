import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SantaReaction = 'idle' | 'nudge' | 'facepalm' | 'approve' | 'hint' | 'laugh' | 'walk' | 'wave';

interface SantaMessage {
  text: string;
  reaction: SantaReaction;
}

// Idle nudges - when user hesitates
const idleNudges: string[] = [
  "Ho ho ho… any day now!",
  "The kittens are waiting!",
  "Did you fall asleep? 😴",
  "Christmas won't wait forever!",
  "I've got cookies getting cold here!",
  "Even my reindeer move faster!",
  "Tick tock, little one!",
];

// Wrong move reactions
const wrongMoveLines: string[] = [
  "Bold choice.",
  "That was… interesting.",
  "Not quite!",
  "Ho ho— nope!",
  "The scenic route, I see!",
  "Ah, exploring are we?",
  "My beard felt that one!",
  "Oof! Try again!",
];

// Correct move reactions
const correctMoveLines: string[] = [
  "That's the Christmas spirit!",
  "Ho ho ho! Well done!",
  "Now you're getting it!",
  "Splendid!",
  "The nice list approves!",
  "Keep going!",
  "You've got this!",
];

// Vague/playful hints (sometimes misleading!)
const vagueHints: string[] = [
  "Hmm, I'd try… somewhere else.",
  "The gift is definitely NOT behind you!",
  "Go where your heart tells you!",
  "Follow the Christmas vibes!",
  "Mrs. Claus says go left. Or was it right?",
  "Trust your whiskers!",
  "The path less traveled… or not!",
  "I'd tell you, but where's the fun?",
];

interface SantaGuideProps {
  wrongMoveCount: number;
  lastMoveCorrect: boolean | null;
  lastMoveTimestamp: number;
}

const SantaGuide = ({ wrongMoveCount, lastMoveCorrect, lastMoveTimestamp }: SantaGuideProps) => {
  const [currentMessage, setCurrentMessage] = useState<SantaMessage | null>(null);
  const [santaReaction, setSantaReaction] = useState<SantaReaction>('idle');
  const [usedMessages, setUsedMessages] = useState<Set<string>>(new Set());
  const [santaPosition, setSantaPosition] = useState<'left' | 'right'>('left');
  const [isWalking, setIsWalking] = useState(false);
  const lastWrongMoveRef = useRef(wrongMoveCount);
  const lastMoveTimeRef = useRef(lastMoveTimestamp);
  const idleTimerRef = useRef<number | null>(null);
  const walkTimerRef = useRef<number | null>(null);
  const messageQueueRef = useRef<SantaMessage[]>([]);
  const isShowingMessageRef = useRef(false);

  // Get a random message that hasn't been used recently
  const getRandomMessage = useCallback((messages: string[], reaction: SantaReaction): SantaMessage | null => {
    const available = messages.filter(m => !usedMessages.has(m));
    if (available.length === 0) {
      setUsedMessages(new Set());
      return { text: messages[Math.floor(Math.random() * messages.length)], reaction };
    }
    const text = available[Math.floor(Math.random() * available.length)];
    return { text, reaction };
  }, [usedMessages]);

  // Show a message with animation
  const showMessage = useCallback((message: SantaMessage) => {
    if (isShowingMessageRef.current) {
      messageQueueRef.current.push(message);
      return;
    }

    isShowingMessageRef.current = true;
    setCurrentMessage(message);
    setSantaReaction(message.reaction);
    setUsedMessages(prev => new Set([...prev, message.text]));

    setTimeout(() => {
      setCurrentMessage(null);
      setSantaReaction('idle');
      isShowingMessageRef.current = false;

      if (messageQueueRef.current.length > 0) {
        const next = messageQueueRef.current.shift();
        if (next) {
          setTimeout(() => showMessage(next), 500);
        }
      }
    }, 3000);
  }, []);

  // Santa walks across occasionally
  const triggerWalk = useCallback(() => {
    if (isShowingMessageRef.current) return;
    
    setIsWalking(true);
    setSantaReaction('walk');
    
    setTimeout(() => {
      setSantaPosition(prev => prev === 'left' ? 'right' : 'left');
    }, 500);
    
    setTimeout(() => {
      setIsWalking(false);
      setSantaReaction('idle');
      // Sometimes laugh after walking
      if (Math.random() < 0.4) {
        setSantaReaction('laugh');
        setTimeout(() => setSantaReaction('idle'), 1500);
      }
    }, 2500);
  }, []);

  // Santa waves occasionally
  const triggerWave = useCallback(() => {
    if (isShowingMessageRef.current || santaReaction !== 'idle') return;
    
    setSantaReaction('wave');
    setTimeout(() => {
      setSantaReaction('idle');
    }, 2000);
  }, [santaReaction]);

  // Reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      const message = getRandomMessage(idleNudges, 'nudge');
      if (message) showMessage(message);
      resetIdleTimer();
    }, 8000 + Math.random() * 4000);
  }, [getRandomMessage, showMessage]);

  // Schedule random walks
  useEffect(() => {
    const scheduleWalk = () => {
      walkTimerRef.current = window.setTimeout(() => {
        triggerWalk();
        scheduleWalk();
      }, 15000 + Math.random() * 10000); // Every 15-25 seconds
    };
    scheduleWalk();
    
    return () => {
      if (walkTimerRef.current) clearTimeout(walkTimerRef.current);
    };
  }, [triggerWalk]);

  // Schedule random waves
  useEffect(() => {
    const waveTimer = window.setInterval(() => {
      if (Math.random() < 0.5) {
        triggerWave();
      }
    }, 6000 + Math.random() * 4000); // Check every 6-10 seconds
    
    return () => clearInterval(waveTimer);
  }, [triggerWave]);

  // Watch for wrong moves
  useEffect(() => {
    if (wrongMoveCount > lastWrongMoveRef.current) {
      const message = getRandomMessage(wrongMoveLines, 'facepalm');
      if (message) showMessage(message);
      
      if (Math.random() < 0.3) {
        const hint = getRandomMessage(vagueHints, 'hint');
        if (hint) {
          setTimeout(() => showMessage(hint), 3500);
        }
      }
    }
    lastWrongMoveRef.current = wrongMoveCount;
  }, [wrongMoveCount, getRandomMessage, showMessage]);

  // Watch for correct moves
  useEffect(() => {
    if (lastMoveCorrect === true && lastMoveTimestamp > lastMoveTimeRef.current) {
      if (Math.random() < 0.35) {
        const message = getRandomMessage(correctMoveLines, 'approve');
        if (message) showMessage(message);
      }
    }
    lastMoveTimeRef.current = lastMoveTimestamp;
  }, [lastMoveCorrect, lastMoveTimestamp, getRandomMessage, showMessage]);

  // Start idle timer on mount
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Reset idle timer on any move
  useEffect(() => {
    resetIdleTimer();
  }, [lastMoveTimestamp, resetIdleTimer]);

  return (
    <motion.div
      className={`fixed bottom-12 z-40 pointer-events-none ${santaPosition === 'left' ? 'left-6' : 'right-6'}`}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: isWalking ? (santaPosition === 'left' ? [0, 60, 0] : [0, -60, 0]) : 0,
      }}
      transition={{ 
        opacity: { delay: 0.5, duration: 0.5 },
        y: { delay: 0.5, type: 'spring', stiffness: 100 },
        x: { duration: 2.5, ease: 'easeInOut' }
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {currentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className={`absolute bottom-full mb-3 ${santaPosition === 'left' ? 'left-0' : 'right-0'} min-w-[180px] max-w-[240px]`}
          >
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border-3 border-christmas-red/60 relative">
              <p className="font-display text-sm md:text-base text-foreground leading-snug font-medium">
                {currentMessage.text}
              </p>
              <div className={`absolute -bottom-2 ${santaPosition === 'left' ? 'left-8' : 'right-8'} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-card/95`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Santa character - Clean single emoji design */}
      <motion.div
        className="relative"
        animate={
          santaReaction === 'walk' ? { y: [0, -10, 0] } :
          santaReaction === 'laugh' ? { rotate: [-5, 5] } :
          santaReaction === 'facepalm' ? { rotate: [-8, 8] } :
          santaReaction === 'approve' ? { y: [0, -15, 0] } :
          santaReaction === 'nudge' ? { x: [-6, 6] } :
          santaReaction === 'wave' ? { rotate: [-10, 10] } :
          { y: [0, -6, 0] }
        }
        transition={
          santaReaction === 'idle' 
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : santaReaction === 'walk'
            ? { duration: 0.4, repeat: 4, repeatType: 'reverse' as const, ease: 'easeInOut' }
            : santaReaction === 'laugh'
            ? { duration: 0.15, repeat: 8, repeatType: 'reverse' as const, ease: 'easeInOut' }
            : santaReaction === 'wave'
            ? { duration: 0.25, repeat: 6, repeatType: 'reverse' as const, ease: 'easeInOut' }
            : { duration: 0.3, repeat: 3, repeatType: 'reverse' as const, ease: 'easeInOut' }
        }
      >
        {/* Single large Santa emoji - clean and simple */}
        <motion.div
          className="text-8xl md:text-9xl drop-shadow-2xl"
          animate={
            santaReaction === 'facepalm' 
              ? { scale: 0.9 } 
              : santaReaction === 'laugh'
              ? { scale: 1.1 }
              : santaReaction === 'approve'
              ? { scale: 1.15 }
              : { scale: 1 }
          }
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          🎅
        </motion.div>

        {/* Reaction indicator - small emoji above Santa's head */}
        <AnimatePresence>
          {santaReaction !== 'idle' && santaReaction !== 'walk' && (
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl md:text-4xl"
              initial={{ opacity: 0, y: 10, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {santaReaction === 'facepalm' ? '🤦' :
               santaReaction === 'laugh' ? '😂' :
               santaReaction === 'approve' ? '✨' :
               santaReaction === 'nudge' ? '⏰' :
               santaReaction === 'hint' ? '💭' :
               santaReaction === 'wave' ? '👋' : ''}
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Ho ho ho" particles when laughing */}
        <AnimatePresence>
          {santaReaction === 'laugh' && (
            <>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute -top-4 left-1/2 text-sm md:text-base font-display font-bold text-christmas-red drop-shadow-lg"
                  initial={{ opacity: 0, y: 0, x: -15 + i * 15 }}
                  animate={{ opacity: [0, 1, 0], y: -40 - i * 15, x: -25 + i * 25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.25 }}
                >
                  Ho!
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Walking dust puffs */}
        <AnimatePresence>
          {santaReaction === 'walk' && (
            <>
              {[0, 1].map(i => (
                <motion.div
                  key={i}
                  className="absolute -bottom-2 text-xl"
                  style={{ left: i === 0 ? '20%' : '60%' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5], y: [0, -10, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.3, repeat: 4 }}
                >
                  💨
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SantaGuide;
