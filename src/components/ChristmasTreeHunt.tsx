import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { gifts, Gift } from '@/data/gameData';
import SantaGuide from './SantaGuide';
import { useIsMobile } from '@/hooks/use-mobile';

// Background element constants
const BG_SNOWFLAKES = [
  { left: 4, delay: 0 },
  { left: 12, delay: 0.7 },
  { left: 22, delay: 1.3 },
  { left: 32, delay: 0.3 },
  { left: 42, delay: 1.0 },
  { left: 52, delay: 0.5 },
  { left: 62, delay: 1.6 },
  { left: 72, delay: 0.2 },
  { left: 82, delay: 0.9 },
  { left: 92, delay: 1.4 },
] as const;

const BG_DECORATIONS = [
  { emoji: '🎁', top: 5, left: 6 },
  { emoji: '⭐', top: 8, left: 90 },
  { emoji: '🎄', top: 78, left: 4 },
  { emoji: '🔔', top: 82, left: 94 },
  { emoji: '🧶', top: 45, left: 2 },
  { emoji: '🎀', top: 30, left: 96 },
  { emoji: '🌟', top: 3, left: 48 },
  { emoji: '❄️', top: 22, left: 95 },
  { emoji: '🍪', top: 60, left: 4 },
  { emoji: '🥛', top: 68, left: 95 },
  { emoji: '😺', top: 15, left: 3 },
  { emoji: '😸', top: 55, left: 97 },
  { emoji: '🎅', top: 88, left: 50 },
  { emoji: '❤️', top: 12, left: 92 },
  { emoji: '🐾', top: 75, left: 92 },
  { emoji: '🐾', top: 25, left: 5 },
] as const;

const BG_LIGHTS = ['🔴', '🟡', '🟢', '🔵', '🟣', '🔴', '🟡', '🟢', '🔵', '🟣'] as const;

const BG_PAWS = [
  { left: 15 },
  { left: 25 },
  { left: 35 },
  { left: 45 },
  { left: 55 },
  { left: 65 },
  { left: 75 },
  { left: 85 },
] as const;

const BG_SIDE_CATS = [
  { emoji: '😺', top: 18, side: 'left' },
  { emoji: '😸', top: 38, side: 'right' },
  { emoji: '😻', top: 58, side: 'left' },
  { emoji: '😼', top: 78, side: 'right' },
] as const;

const BG_CORNER_TREES = [
  { pos: 'top-left' },
  { pos: 'top-right' },
  { pos: 'bottom-left' },
  { pos: 'bottom-right' },
] as const;

// Maze cell types
type CellType = 'path' | 'wall' | 'start' | 'gift' | 'trap' | 'fake-path';

interface MazeCell {
  type: CellType;
  decoration?: string;
  visited?: boolean;
}

// Each gift has its own mini-maze
interface GiftMaze {
  giftId: string;
  grid: MazeCell[][];
  startPos: [number, number];
  giftPos: [number, number];
}

// Playful messages for wrong moves
const trapMessages = [
  "Bold choice. 😏",
  "Nope! Snow wall! ❄️",
  "That's a candy cane! 🍬",
  "Dead end! 🧱",
  "The yarn blocked you! 🧶",
  "Oops! 💫",
  "Not that way! 🎄",
  "Slippery! 🏂",
];

const fakePathMessages = [
  "It looked open! 👀",
  "A mirage! 🌀",
  "Tricky! 🎭",
  "Sneaky loop! 🔄",
];

// Generate a maze for a gift
const generateMaze = (giftId: string, difficulty: number): GiftMaze => {
  const size = 7;
  const grid: MazeCell[][] = [];
  
  // Initialize with walls
  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < size; x++) {
      grid[y][x] = { type: 'wall', decoration: getRandomWallDecoration() };
    }
  }
  
  // Different maze patterns based on gift
  const patterns: Record<string, { start: [number, number]; gift: [number, number]; paths: [number, number][]; traps: [number, number][]; fakePaths: [number, number][] }> = {
    tiara: {
      start: [0, 3],
      gift: [6, 3],
      paths: [[0,3],[1,3],[1,2],[1,4],[2,2],[2,4],[3,2],[3,3],[3,4],[4,3],[4,4],[5,4],[5,3],[6,3]],
      traps: [[2,3],[4,2],[5,2]],
      fakePaths: [[1,1],[3,1],[5,5]],
    },
    yarn: {
      start: [3, 0],
      gift: [3, 6],
      paths: [[3,0],[3,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[3,5],[3,6]],
      traps: [[3,2],[4,2],[2,4],[3,4]],
      fakePaths: [[1,1],[5,3],[2,5]],
    },
    blanket: {
      start: [0, 0],
      gift: [6, 6],
      paths: [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2],[3,3],[3,4],[4,4],[5,4],[5,5],[5,6],[6,6]],
      traps: [[2,0],[2,1],[0,2],[4,3],[6,5]],
      fakePaths: [[2,3],[4,5],[6,4]],
    },
    bowtie: {
      start: [6, 3],
      gift: [0, 3],
      paths: [[6,3],[5,3],[5,2],[4,2],[3,2],[3,3],[3,4],[2,4],[1,4],[1,3],[0,3]],
      traps: [[5,4],[4,3],[2,3],[1,2]],
      fakePaths: [[4,4],[2,2],[0,4]],
    },
    treats: {
      start: [3, 0],
      gift: [3, 6],
      paths: [[3,0],[4,0],[4,1],[4,2],[3,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[3,5],[3,6]],
      traps: [[3,1],[5,2],[1,3],[5,4],[2,5]],
      fakePaths: [[1,2],[5,3],[1,5]],
    },
  };
  
  const pattern = patterns[giftId] || patterns.tiara;
  
  // Set start
  grid[pattern.start[1]][pattern.start[0]] = { type: 'start', decoration: '🎅' };
  
  // Set paths
  pattern.paths.forEach(([x, y]) => {
    if (grid[y][x].type !== 'start') {
      grid[y][x] = { type: 'path', decoration: getRandomPathDecoration() };
    }
  });
  
  // Set gift
  grid[pattern.gift[1]][pattern.gift[0]] = { type: 'gift', decoration: gifts.find(g => g.id === giftId)?.emoji || '🎁' };
  
  // Set traps
  pattern.traps.forEach(([x, y]) => {
    grid[y][x] = { type: 'trap', decoration: getRandomTrapDecoration() };
  });
  
  // Set fake paths (look like paths but are traps)
  pattern.fakePaths.forEach(([x, y]) => {
    grid[y][x] = { type: 'fake-path', decoration: getRandomPathDecoration() };
  });
  
  return {
    giftId,
    grid,
    startPos: pattern.start,
    giftPos: pattern.gift,
  };
};

const getRandomWallDecoration = (): string => {
  const decorations = ['🎄', '❄️', '🍬', '🧶', '🎀', '⭐', '🔔', '🎁', '💡', '🌟', '🍭', '🎿', '⛄'];
  return decorations[Math.floor(Math.random() * decorations.length)];
};

const getRandomPathDecoration = (): string => {
  const decorations = ['·', '∘', '◦', '○', '◌'];
  return decorations[Math.floor(Math.random() * decorations.length)];
};

const getRandomTrapDecoration = (): string => {
  const decorations = ['❄️', '🧱', '🍬', '🧶', '💨'];
  return decorations[Math.floor(Math.random() * decorations.length)];
};

interface PerformanceData {
  wrongMoves: number;
  totalMoves: number;
  timeSpent: number;
  retries: number;
}

interface ChristmasTreeHuntProps {
  onComplete: (revealedGifts: Gift[], performance: PerformanceData) => void;
}

const ChristmasTreeHunt = ({ onComplete }: ChristmasTreeHuntProps) => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lowPerf = reduceMotion || isMobile;

  const [currentGiftIndex, setCurrentGiftIndex] = useState(0);
  const [collectedGifts, setCollectedGifts] = useState<Gift[]>([]);
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showGiftReveal, setShowGiftReveal] = useState(false);
  const [wrongMoveCount, setWrongMoveCount] = useState(0);
  const [totalWrongMoves, setTotalWrongMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [startTime] = useState(() => Date.now());
  
  // Santa guide state
  const [lastMoveCorrect, setLastMoveCorrect] = useState<boolean | null>(null);
  const [lastMoveTimestamp, setLastMoveTimestamp] = useState(Date.now());
  
  // Generate all mazes upfront
  const mazes = useMemo(() => {
    return gifts.map((gift, i) => generateMaze(gift.id, i + 1));
  }, []);
  
  const currentMaze = mazes[currentGiftIndex];
  const currentGift = gifts[currentGiftIndex];
  
  // Initialize player position when maze changes
  const initMaze = useCallback(() => {
    if (currentMaze) {
      setPlayerPos(currentMaze.startPos);
      setVisitedCells(new Set([`${currentMaze.startPos[0]},${currentMaze.startPos[1]}`]));
      setMessage(null);
      setWrongMoveCount(0);
    }
  }, [currentMaze]);
  
  // Reset when gift index changes
  useState(() => {
    initMaze();
  });
  
  // Check if position is valid
  const isValidMove = useCallback((x: number, y: number): boolean => {
    if (!currentMaze) return false;
    if (x < 0 || x >= 7 || y < 0 || y >= 7) return false;
    const cell = currentMaze.grid[y][x];
    return cell.type === 'path' || cell.type === 'start' || cell.type === 'gift' || cell.type === 'trap' || cell.type === 'fake-path';
  }, [currentMaze]);
  
  // Check if move is adjacent
  const isAdjacent = useCallback((x: number, y: number): boolean => {
    const [px, py] = playerPos;
    const dx = Math.abs(x - px);
    const dy = Math.abs(y - py);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }, [playerPos]);
  
  const handleCellTap = useCallback((x: number, y: number) => {
    if (!currentMaze || showGiftReveal) return;
    
    // Must be adjacent
    if (!isAdjacent(x, y)) {
      setIsShaking(true);
      setMessage("Too far! Move step by step 👣");
      setTimeout(() => {
        setIsShaking(false);
        setMessage(null);
      }, 800);
      return;
    }
    
    const cell = currentMaze.grid[y][x];
    
    // Handle different cell types
    if (cell.type === 'wall') {
      setIsShaking(true);
      setMessage(trapMessages[Math.floor(Math.random() * trapMessages.length)]);
      const newCount = wrongMoveCount + 1;
      setWrongMoveCount(newCount);
      setTotalWrongMoves(prev => prev + 1);
      setTotalMoves(prev => prev + 1);
      setLastMoveCorrect(false);
      setLastMoveTimestamp(Date.now());
      if (newCount === 1) {
        setShowTip(true);
        setTimeout(() => setShowTip(false), 3000);
      }
      setTimeout(() => {
        setIsShaking(false);
        setMessage(null);
      }, 800);
      return;
    }
    
    if (cell.type === 'trap') {
      setIsShaking(true);
      setMessage(trapMessages[Math.floor(Math.random() * trapMessages.length)]);
      setWrongMoveCount(prev => prev + 1);
      setTotalWrongMoves(prev => prev + 1);
      setTotalMoves(prev => prev + 1);
      setLastMoveCorrect(false);
      setLastMoveTimestamp(Date.now());
      // Slide back animation
      setTimeout(() => {
        setIsShaking(false);
        setMessage(null);
      }, 800);
      return;
    }
    
    if (cell.type === 'fake-path') {
      // Move there but then bounce back
      setPlayerPos([x, y]);
      setVisitedCells(prev => new Set([...prev, `${x},${y}`]));
      setTotalMoves(prev => prev + 1);
      setTotalWrongMoves(prev => prev + 1);
      setLastMoveCorrect(false);
      setLastMoveTimestamp(Date.now());
      setTimeout(() => {
        setMessage(fakePathMessages[Math.floor(Math.random() * fakePathMessages.length)]);
        setIsShaking(true);
        setTimeout(() => {
          // Bounce back to previous position
          setPlayerPos(playerPos);
          setIsShaking(false);
          setMessage(null);
        }, 600);
      }, 200);
      return;
    }
    
    // Valid path or gift - correct move!
    setPlayerPos([x, y]);
    setVisitedCells(prev => new Set([...prev, `${x},${y}`]));
    setTotalMoves(prev => prev + 1);
    setLastMoveCorrect(true);
    setLastMoveTimestamp(Date.now());
    
    // Check if reached gift
    if (cell.type === 'gift') {
      setShowGiftReveal(true);
      setTimeout(() => {
        setCollectedGifts(prev => [...prev, currentGift]);
        setShowGiftReveal(false);
        
        // Move to next maze or complete
        if (currentGiftIndex < gifts.length - 1) {
          setCurrentGiftIndex(prev => prev + 1);
          // Reset for next maze
          const nextMaze = mazes[currentGiftIndex + 1];
          setPlayerPos(nextMaze.startPos);
          setVisitedCells(new Set([`${nextMaze.startPos[0]},${nextMaze.startPos[1]}`]));
          setMessage(null);
          setWrongMoveCount(0);
        }
      }, 1500);
    }
  }, [currentMaze, playerPos, isAdjacent, showGiftReveal, wrongMoveCount, currentGiftIndex, currentGift, mazes]);
  
  const handleContinue = useCallback(() => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onComplete(collectedGifts, {
      wrongMoves: totalWrongMoves,
      totalMoves: totalMoves,
      timeSpent: timeSpent,
      retries: 0,
    });
  }, [collectedGifts, onComplete, totalWrongMoves, totalMoves, startTime]);
  
  const allCollected = collectedGifts.length === gifts.length;
  
  // Get cell style based on type
  const getCellStyle = (cell: MazeCell, x: number, y: number) => {
    const isPlayer = playerPos[0] === x && playerPos[1] === y;
    const isVisited = visitedCells.has(`${x},${y}`);
    
    if (isPlayer) {
      return 'bg-primary/80 shadow-glow';
    }
    
    switch (cell.type) {
      case 'start':
        return 'bg-green-500/40 border-green-400';
      case 'gift':
        return 'bg-gold/40 border-gold animate-pulse';
      case 'path':
      case 'fake-path':
        return isVisited ? 'bg-snow/60 border-snow/40' : 'bg-snow/30 border-snow/20';
      case 'trap':
        return 'bg-snow/30 border-snow/20'; // Looks like a path!
      case 'wall':
      default:
        return 'bg-christmas-green/60 border-christmas-green/80';
    }
  };

  return (
    <>
      {/* Santa Guide - rendered outside the overflow container */}
      {!allCollected && !showGiftReveal && (
        <SantaGuide
          wrongMoveCount={totalWrongMoves}
          lastMoveCorrect={lastMoveCorrect}
          lastMoveTimestamp={lastMoveTimestamp}
        />
      )}
      <div className="min-h-screen p-4 md:p-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-background via-cream/30 to-cozy-pink/20">
        
        {/* Background depth orbs - richer */}
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
                className="absolute w-[180px] h-[180px] rounded-full blur-xl opacity-40"
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

        {/* Snowflakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {(lowPerf ? BG_SNOWFLAKES.slice(0, 4) : BG_SNOWFLAKES).map((flake, i) =>
            lowPerf ? (
              <span
                key={`snow-${i}`}
                className="intro-snow absolute text-lg opacity-45"
                style={{
                  left: `${flake.left}%`,
                  top: '-4%',
                  ['--intro-snow-dur' as string]: `${13 + i * 0.9}s`,
                  ['--intro-snow-delay' as string]: `${flake.delay}s`,
                }}
              >
                ❄️
              </span>
            ) : (
              <motion.div
                key={`snow-${i}`}
                className="absolute text-lg opacity-50 will-change-transform"
                style={{ left: `${flake.left}%`, top: '-4%' }}
                animate={{ y: ['-4vh', '104vh'] }}
                transition={{ duration: 12 + i * 0.7, repeat: Infinity, ease: 'linear', delay: flake.delay }}
              >
                ❄️
              </motion.div>
            )
          )}
        </div>

        {/* Lights at top */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-0">
          <div className="flex gap-5 py-2">
            {(lowPerf ? BG_LIGHTS.slice(0, 5) : BG_LIGHTS).map((light, i) =>
              lowPerf ? (
                <span
                  key={`light-${i}`}
                  className="text-lg drop-shadow animate-pulse"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {light}
                </span>
              ) : (
                <motion.span
                  key={`light-${i}`}
                  className="text-lg drop-shadow will-change-transform"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 1.2, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {light}
                </motion.span>
              )
            )}
          </div>
        </div>

        {/* Floating decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {(lowPerf ? BG_DECORATIONS.slice(0, 5) : BG_DECORATIONS).map((dec, i) =>
            lowPerf ? (
              <div
                key={`dec-${i}`}
                className="absolute text-xl animate-float opacity-60"
                style={{ top: `${dec.top}%`, left: `${dec.left}%`, animationDelay: `${i * 0.2}s` }}
              >
                {dec.emoji}
              </div>
            ) : (
              <motion.div
                key={`dec-${i}`}
                className="absolute text-xl will-change-transform"
                style={{ top: `${dec.top}%`, left: `${dec.left}%` }}
                animate={{ y: [0, -7], rotate: [-3, 3] }}
                transition={{ duration: 2.8 + i * 0.1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: i * 0.15 }}
              >
                {dec.emoji}
              </motion.div>
            )
          )}
        </div>

        {/* Side cats */}
        <div className="absolute inset-0 pointer-events-none">
          {BG_SIDE_CATS.map((cat, i) =>
            lowPerf ? (
              <div
                key={`sidecat-${i}`}
                className="absolute text-3xl animate-float"
                style={{
                  top: `${cat.top}%`,
                  left: cat.side === 'left' ? '4%' : undefined,
                  right: cat.side === 'right' ? '4%' : undefined,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {cat.emoji}
              </div>
            ) : (
              <motion.div
                key={`sidecat-${i}`}
                className="absolute text-3xl will-change-transform"
                style={{
                  top: `${cat.top}%`,
                  left: cat.side === 'left' ? '4%' : undefined,
                  right: cat.side === 'right' ? '4%' : undefined,
                }}
                animate={{ y: [0, -10, 0], rotate: [0, cat.side === 'left' ? 6 : -6, 0] }}
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
            <div className="absolute bottom-3 left-3 text-3xl opacity-70">🎁</div>
            <div className="absolute bottom-3 right-3 text-3xl opacity-70">🎁</div>
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-3 left-3 text-4xl will-change-transform"
              animate={{ rotate: [-3, 3], scale: [1, 1.04, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              🎄
            </motion.div>
            <motion.div
              className="absolute top-3 right-3 text-4xl will-change-transform"
              animate={{ rotate: [3, -3], scale: [1, 1.04, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              🎄
            </motion.div>
            <motion.div
              className="absolute bottom-3 left-3 text-3xl will-change-transform"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              🎁
            </motion.div>
            <motion.div
              className="absolute bottom-3 right-3 text-3xl will-change-transform"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}
            >
              🎁
            </motion.div>
          </>
        )}

        {/* Paw trail */}
        <div className="absolute bottom-12 left-0 right-0 pointer-events-none opacity-30">
          <div className="relative h-8 flex justify-center gap-4">
            {(lowPerf ? BG_PAWS.slice(0, 6) : BG_PAWS).map((p, i) =>
              lowPerf ? (
                <span key={`paw-${i}`} className="text-xl animate-float" style={{ animationDelay: `${i * 0.12}s` }}>
                  🐾
                </span>
              ) : (
                <motion.span
                  key={`paw-${i}`}
                  className="text-xl will-change-transform"
                  animate={{ y: [0, -6, 0], opacity: [0.25, 0.6, 0.25] }}
                  transition={{ duration: 2.2, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🐾
                </motion.span>
              )
            )}
          </div>
        </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="game-title text-primary text-2xl md:text-4xl mb-2">
          🎄 Gift Maze! 🎄
        </h1>
        <p className="font-display text-foreground text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
          Navigate the maze to collect your gift! Tap adjacent cells to move.
        </p>
        <motion.div 
          className="mt-3 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 inline-block shadow-lg border-2 border-accent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-display text-lg text-foreground font-bold">
            🎁 {collectedGifts.length}/5 Collected
          </span>
        </motion.div>
      </motion.div>

      {/* Tip after first wrong move */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 md:top-28 z-50 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-accent"
          >
            <p className="font-display text-sm text-foreground">
              Not all paths lead to gifts! 🧭
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current gift indicator */}
      {!allCollected && (
        <motion.div
          key={currentGift?.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-border"
        >
          <span className="font-display text-sm text-muted-foreground">Finding: </span>
          <span className="font-display text-lg">{currentGift?.emoji} {currentGift?.name}</span>
        </motion.div>
      )}

      {/* Maze Grid */}
      {!allCollected && currentMaze && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: isShaking ? [-5, 5] : 0,
          }}
          transition={isShaking 
            ? { x: { duration: 0.1, repeat: 4, repeatType: 'reverse' as const } }
            : { type: 'spring', stiffness: 200 }
          }
          className="relative"
        >
          <div 
            className="grid gap-1 p-3 bg-christmas-green/30 rounded-2xl border-4 border-christmas-green/50 shadow-xl"
            style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
          >
            {currentMaze.grid.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer = playerPos[0] === x && playerPos[1] === y;
                const isGift = cell.type === 'gift';
                const isStart = cell.type === 'start';
                const isPath = cell.type === 'path' || cell.type === 'fake-path' || cell.type === 'trap';
                
                return (
                  <motion.button
                    key={`${x}-${y}`}
                    onClick={() => handleCellTap(x, y)}
                    className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 
                      flex items-center justify-center text-lg md:text-xl
                      cursor-pointer select-none touch-manipulation
                      transition-all duration-200
                      ${getCellStyle(cell, x, y)}
                      ${isAdjacent(x, y) && !isPlayer ? 'ring-2 ring-primary/40' : ''}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isPlayer ? { 
                      scale: [1, 1.1, 1],
                    } : isGift ? {
                      rotate: [-5, 5],
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={isPlayer 
                      ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } 
                      : isGift 
                      ? { rotate: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }, scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' } }
                      : {}
                    }
                  >
                    {isPlayer ? (
                      <span className="text-2xl">🐱</span>
                    ) : isGift ? (
                      <span className="text-2xl">{cell.decoration}</span>
                    ) : isStart && !isPlayer ? (
                      <span className="text-lg opacity-50">{cell.decoration}</span>
                    ) : isPath ? (
                      <span className="text-muted-foreground opacity-40">{cell.decoration}</span>
                    ) : (
                      <span className="text-base">{cell.decoration}</span>
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-3 flex justify-center gap-4 text-xs font-display text-muted-foreground">
            <span>🎅 Start</span>
            <span>🐱 You</span>
            <span>🎁 Gift</span>
          </div>
        </motion.div>
      )}

      {/* Message popup */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute bottom-32 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-accent z-50"
          >
            <p className="font-display text-sm text-foreground font-bold">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift reveal animation */}
      <AnimatePresence>
        {showGiftReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-card p-8 rounded-3xl shadow-2xl border-4 border-gold text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [-10, 10],
                }}
                transition={{ 
                  y: { duration: 0.5, repeat: 3, ease: 'easeInOut' },
                  rotate: { duration: 0.25, repeat: 6, repeatType: 'reverse' as const, ease: 'easeInOut' }
                }}
                className="text-7xl mb-4"
              >
                {currentGift?.emoji}
              </motion.div>
              <h2 className="font-display text-2xl text-foreground font-bold">
                {currentGift?.name} Found!
              </h2>
              <p className="font-body text-muted-foreground mt-2">
                {collectedGifts.length + 1} of 5 gifts collected!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collected gifts display */}
      <motion.div 
        className="mt-6 flex gap-2 flex-wrap justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {collectedGifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
            className="bg-card/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-border"
          >
            <span className="text-2xl">{gift.emoji}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue button when all collected */}
      <AnimatePresence>
        {allCollected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-4"
            >
              <h2 className="font-display text-2xl text-primary font-bold">
                🎉 All Gifts Collected! 🎉
              </h2>
              <p className="font-body text-muted-foreground mt-2">
                Time to give them to the kittens!
              </p>
            </motion.div>
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-display text-xl shadow-glow border-4 border-primary-foreground/20"
            >
              🐱 Meet the Kittens! 🐱
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
};

export default ChristmasTreeHunt;
