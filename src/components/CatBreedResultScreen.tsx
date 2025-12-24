import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Confetti from './Confetti';

interface PerformanceData {
  wrongMoves: number;
  totalMoves: number;
  timeSpent: number; // in seconds
  retries: number;
}

interface CatBreed {
  name: string;
  emoji: string;
  personality: string[];
  shareCaption: string;
}

const catBreeds: Record<string, CatBreed> = {
  persian: {
    name: "Elegant Persian",
    emoji: "😽",
    personality: [
      "You navigated that maze like royalty walking through a palace.",
      "Grace, precision, and a hint of superiority. Purrfect."
    ],
    shareCaption: "I got Elegant Persian 😽✨ Flawless and fabulous!"
  },
  bengal: {
    name: "Zoomie Bengal",
    emoji: "🐆",
    personality: [
      "You ZOOMED through that maze! Fast, chaotic, but somehow effective.",
      "You live life at 3am energy. No regrets, only speed."
    ],
    shareCaption: "I got Zoomie Bengal 🐆💨 Chaos at max speed!"
  },
  maineCoon: {
    name: "Gentle Giant Maine Coon",
    emoji: "🦁",
    personality: [
      "Big brain, big paws, big energy. You took command like a boss.",
      "Steady and powerful. Everyone else is playing checkers, you're playing chess."
    ],
    shareCaption: "I got Gentle Giant Maine Coon 🦁👑 The wise ruler!"
  },
  siamese: {
    name: "Chatty Siamese",
    emoji: "🐱",
    personality: [
      "MROWWW! You have OPINIONS about this maze, don't you?",
      "Vocal, dramatic, and absolutely convinced you're right. Always."
    ],
    shareCaption: "I got Chatty Siamese 🐱🗣️ I have opinions and you WILL hear them!"
  },
  scottishFold: {
    name: "Curious Scottish Fold",
    emoji: "🐈",
    personality: [
      "Those adorable folded ears hide a brilliant detective mind.",
      "You explored every corner. No path left unturned!"
    ],
    shareCaption: "I got Curious Scottish Fold 🐈🔍 Explorer extraordinaire!"
  },
  orange: {
    name: "Chaotic Orange Cat",
    emoji: "🧡",
    personality: [
      "You made... choices. Bold, questionable choices.",
      "The one brain cell was working overtime. Respect."
    ],
    shareCaption: "I got Chaotic Orange Cat 🧡😭 One brain cell squad!"
  },
  disaster: {
    name: "Disaster Cat",
    emoji: "😹",
    personality: [
      "How did you even... you know what, nevermind.",
      "You found EVERY wrong path. That takes skill, actually."
    ],
    shareCaption: "I got Disaster Cat 😹💀 Professional wrong-turner!"
  },
  ninja: {
    name: "Shadow Ninja Cat",
    emoji: "🐈‍⬛",
    personality: [
      "Slow, calculated, and deadly precise. The prey never saw you coming.",
      "You took your time, and it paid off. Stealth mode: activated."
    ],
    shareCaption: "I got Shadow Ninja Cat 🐈‍⬛🥷 Silent but purrfect!"
  },
  chonky: {
    name: "Chonky Loaf Cat",
    emoji: "🍞",
    personality: [
      "You wandered. You explored. You took the scenic route.",
      "Life's a journey, not a race. Maximum loaf energy."
    ],
    shareCaption: "I got Chonky Loaf Cat 🍞😸 Scenic route champion!"
  }
};

const determineBreed = (performance: PerformanceData): CatBreed => {
  const { wrongMoves, totalMoves, timeSpent, retries } = performance;
  const errorRate = wrongMoves / Math.max(totalMoves, 1);
  const avgTimePerMaze = timeSpent / 5; // 5 mazes total
  
  // Few mistakes + fast → Elegant Persian (the perfectionist)
  if (wrongMoves <= 3 && avgTimePerMaze < 12) {
    return catBreeds.persian;
  }
  
  // Moderate speed, very few mistakes, consistent → Maine Coon (the wise leader)
  if (wrongMoves <= 5 && avgTimePerMaze >= 12 && avgTimePerMaze < 20 && retries === 0) {
    return catBreeds.maineCoon;
  }
  
  // Fast but messy → Zoomie Bengal (speed demon)
  if (avgTimePerMaze < 15 && wrongMoves > 5 && wrongMoves <= 12) {
    return catBreeds.bengal;
  }
  
  // Medium mistakes, medium-fast time, some retries → Siamese (opinionated and persistent)
  if (wrongMoves > 8 && wrongMoves <= 18 && retries >= 1 && retries <= 2) {
    return catBreeds.siamese;
  }
  
  // Explored a lot (high total moves), moderate mistakes → Scottish Fold (curious explorer)
  if (totalMoves > 40 && wrongMoves > 10 && wrongMoves <= 20 && avgTimePerMaze >= 15) {
    return catBreeds.scottishFold;
  }
  
  // Very slow but careful → Shadow Ninja
  if (avgTimePerMaze >= 30 && wrongMoves <= 8) {
    return catBreeds.ninja;
  }
  
  // Many mistakes → Chaotic Orange Cat
  if (wrongMoves > 18 && wrongMoves <= 30) {
    return catBreeds.orange;
  }
  
  // Very slow + many moves → Chonky Loaf
  if (avgTimePerMaze >= 25 && errorRate > 0.35) {
    return catBreeds.chonky;
  }
  
  // Very many mistakes / retries → Disaster Cat
  if (wrongMoves > 30 || retries > 3) {
    return catBreeds.disaster;
  }
  
  // Default fallback - Scottish Fold for explorers
  if (totalMoves > 35) {
    return catBreeds.scottishFold;
  }
  
  // Ultimate fallback
  return catBreeds.orange;
};

interface CatBreedResultScreenProps {
  performance: PerformanceData;
  onPlayAgain: () => void;
}

const CatBreedResultScreen = ({ performance, onPlayAgain }: CatBreedResultScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const breed = determineBreed(performance);
  
  const handleShare = useCallback(async () => {
    const shareText = `🎄 Meowry Christmas Cat Quiz! 🐱\n\n${breed.shareCaption}\n\nPlay now and find your cat breed!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meowry Christmas - Cat Breed Result',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error - fallback to copy
        await copyToClipboard(shareText);
      }
    } else {
      await copyToClipboard(shareText);
    }
  }, [breed.shareCaption]);
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div 
      className="min-h-screen p-4 md:p-6 flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Background sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      {/* Title */}
      <motion.h1
        className="game-title text-primary text-2xl md:text-4xl mb-6 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        🎄 Your Cat Breed Result! 🎄
      </motion.h1>

      {/* Result Card */}
      <motion.div
        ref={cardRef}
        className="relative bg-gradient-to-br from-card via-card to-accent/20 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-gold max-w-sm w-full text-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 text-2xl">🎄</div>
        <div className="absolute top-2 right-2 text-2xl">🎄</div>
        <div className="absolute bottom-2 left-2 text-xl">❄️</div>
        <div className="absolute bottom-2 right-2 text-xl">❄️</div>
        
        {/* Cat emoji with animation */}
        <motion.div
          className="text-8xl mb-4"
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {breed.emoji}
        </motion.div>
        
        {/* Breed name */}
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-primary mb-4"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {breed.name}
        </motion.h2>
        
        {/* Personality lines */}
        <div className="space-y-2 mb-6">
          {breed.personality.map((line, i) => (
            <motion.p
              key={i}
              className="font-body text-sm md:text-base text-foreground/80 italic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.2 }}
            >
              "{line}"
            </motion.p>
          ))}
        </div>
        
        {/* Stats badge */}
        <motion.div 
          className="bg-muted/50 rounded-xl px-4 py-2 inline-block mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-display text-xs text-muted-foreground">
            {performance.wrongMoves} wrong turns • {Math.round(performance.timeSpent)}s total
          </span>
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <motion.div 
        className="mt-8 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        {/* Share button */}
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gold hover:bg-gold/90 text-warmBrown px-8 py-4 rounded-full font-display text-lg shadow-lg border-4 border-gold/50 flex items-center gap-2 justify-center"
        >
          <span>📤</span>
          <span>{copied ? 'Copied!' : 'Share Result'}</span>
        </motion.button>
        
        {/* Play again button */}
        <motion.button
          onClick={onPlayAgain}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-display text-lg shadow-glow border-4 border-primary-foreground/20 flex items-center gap-2 justify-center"
        >
          <span>🔄</span>
          <span>Play Again</span>
        </motion.button>
      </motion.div>


      {/* Shareable card preview (hidden, for potential canvas export) */}
      <div className="sr-only">
        <div className="bg-card p-8 text-center w-80 h-80">
          <div className="text-6xl mb-4">{breed.emoji}</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-2">{breed.name}</h2>
          <p className="font-body text-sm text-muted-foreground">{breed.shareCaption}</p>
          <p className="font-body text-xs text-muted-foreground mt-4">🎄 Meowry Christmas 🎄</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CatBreedResultScreen;
