import { useState, useCallback } from 'react';
import SantaIntroScreen from '@/components/SantaIntroScreen';
import RulesScreen from '@/components/RulesScreen';
import ChristmasTreeHunt from '@/components/ChristmasTreeHunt';
import GameScreen from '@/components/GameScreen';
import CatBreedResultScreen from '@/components/CatBreedResultScreen';
import Snowfall from '@/components/Snowfall';
import { Gift } from '@/data/gameData';

type GamePhase = 'santa' | 'rules' | 'hunt' | 'game' | 'result';

interface PerformanceData {
  wrongMoves: number;
  totalMoves: number;
  timeSpent: number;
  retries: number;
}

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>('santa');
  const [revealedGifts, setRevealedGifts] = useState<Gift[]>([]);
  const [mazePerformance, setMazePerformance] = useState<PerformanceData>({
    wrongMoves: 0,
    totalMoves: 0,
    timeSpent: 0,
    retries: 0,
  });

  const handleHuntComplete = (gifts: Gift[], performance: PerformanceData) => {
    setRevealedGifts(gifts);
    setMazePerformance(performance);
    setPhase('game');
  };

  const handleGameComplete = () => {
    setPhase('result');
  };

  const handlePlayAgain = useCallback(() => {
    setPhase('santa');
    setRevealedGifts([]);
    setMazePerformance({
      wrongMoves: 0,
      totalMoves: 0,
      timeSpent: 0,
      retries: 0,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-background to-muted relative overflow-hidden">
      <Snowfall />
      
      {/* Christmas tree background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🎄</div>
        <div className="absolute top-20 right-20 text-6xl">🎄</div>
        <div className="absolute bottom-10 left-20 text-7xl">🎄</div>
        <div className="absolute bottom-20 right-10 text-8xl">🎄</div>
      </div>

      <div className="relative z-10">
        {phase === 'santa' && (
          <SantaIntroScreen onNext={() => setPhase('rules')} />
        )}
        {phase === 'rules' && (
          <RulesScreen onStart={() => setPhase('hunt')} />
        )}
        {phase === 'hunt' && (
          <ChristmasTreeHunt onComplete={handleHuntComplete} />
        )}
        {phase === 'game' && (
          <GameScreen revealedGifts={revealedGifts} onGameComplete={handleGameComplete} />
        )}
        {phase === 'result' && (
          <CatBreedResultScreen performance={mazePerformance} onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </div>
  );
};

export default Index;
