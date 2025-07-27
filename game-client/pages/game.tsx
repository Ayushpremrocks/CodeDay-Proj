import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import GameWrapper from '../components/GameWrapper';
import FactModal from '../components/FactModal';

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  accuracy: number;
  level: number;
  isWinner: boolean;
}

const spaceFacts = [
  {
    constellation: "Orion",
    fact: "Orion is one of the most recognizable constellations in the night sky. It contains two of the brightest stars: Betelgeuse and Rigel.",
    image: "🌟"
  },
  {
    constellation: "Ursa Major",
    fact: "Also known as the Big Dipper, this constellation has been used for navigation for thousands of years.",
    image: "⭐"
  },
  {
    constellation: "Cassiopeia",
    fact: "This W-shaped constellation is named after a vain queen from Greek mythology who was placed in the sky as punishment.",
    image: "✨"
  },
  {
    constellation: "Leo",
    fact: "The Lion constellation contains the bright star Regulus, which was considered one of the four 'royal stars' by ancient Persians.",
    image: "🦁"
  },
  {
    constellation: "Scorpius",
    fact: "This constellation resembles a scorpion and contains the bright red star Antares, which means 'rival of Mars'.",
    image: "🦂"
  }
];

export default function Game() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    accuracy: 100,
    level: 1,
    isWinner: false
  });
  const [showFactModal, setShowFactModal] = useState(false);
  const [currentFact, setCurrentFact] = useState(spaceFacts[0]);

  const handleGameStart = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: true,
      isWinner: false,
      score: 0,
      accuracy: 100
    }));
  };

  const handleGameEnd = (score: number, accuracy: number) => {
    // Calculate minimum score required for current level (10 + (level-1)*10)
    const minScoreRequired = 10 + (gameState.level - 1) * 10;
    
    // Determine if player is a winner (dynamic score requirement and accuracy >= 60%)
    const isWinner = score >= minScoreRequired && accuracy >= 60;
    
    setGameState(prev => ({ 
      ...prev, 
      score, 
      accuracy,
      isPlaying: false,
      isWinner
    }));
    
    // Show fact modal between levels
    const factIndex = (gameState.level - 1) % spaceFacts.length;
    setCurrentFact(spaceFacts[factIndex]);
    setShowFactModal(true);
  };

  const handleWinnerAchieved = (score: number, accuracy: number) => {
    // Player has achieved winning conditions during gameplay
    setGameState(prev => ({ 
      ...prev, 
      score, 
      accuracy,
      isWinner: true
    }));
    
    // Show winner modal immediately
    const factIndex = (gameState.level - 1) % spaceFacts.length;
    setCurrentFact(spaceFacts[factIndex]);
    setShowFactModal(true);
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  };

  const handleResume = () => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  };

  const handleNextLevel = () => {
    console.log('handleNextLevel called');
    setShowFactModal(false);
    setGameState(prev => ({ 
      ...prev, 
      level: prev.level + 1,
      isPlaying: true,
      isWinner: false,
      score: 0,
      accuracy: 100
    }));
    
    // Force a small delay to ensure the game component reinitializes
    setTimeout(() => {
      console.log('Starting level', gameState.level + 1);
    }, 100);
  };

  const handleMainMenu = () => {
    console.log('handleMainMenu called');
    router.push('/');
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Playing - Shooting the Star</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Enhanced background stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => {
            const animationType = Math.random() > 0.7 ? 'animate-twinkle-fast' : 
                                 Math.random() > 0.5 ? 'animate-twinkle-slow' : 'animate-twinkle';
            return (
              <div
                key={i}
                className={`absolute bg-white rounded-full ${animationType}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            );
          })}
        </div>
        
        {/* Nebula effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-32 bg-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-24 bg-pink-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-56 h-28 bg-blue-600 rounded-full blur-3xl"></div>
        </div>

        {/* Game container */}
        <div className="relative z-10 h-screen flex flex-col">
          {/* HUD */}
          <div className="flex justify-between items-center p-4 bg-space-800/50 backdrop-blur-sm">
            <div className="text-white">
              <div className="text-2xl font-bold">Level {gameState.level}</div>
              <div className="text-sm text-space-300">Shooting the Star</div>
            </div>
            
            <div className="flex items-center gap-6 text-white">
              <div className="text-center">
                <div className="text-lg font-bold">{gameState.score}</div>
                <div className="text-xs text-space-300">Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{gameState.accuracy}%</div>
                <div className="text-xs text-space-300">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-2">
              {gameState.isPaused && (
                <div
                  className="btn-primary cursor-pointer"
                  onClick={handleResume}
                  role="button"
                  tabIndex={0}
                >
                  ▶️ Resume
                </div>
              )}
              <button
                className="btn-secondary"
                onClick={handleExit}
              >
                🚪 Exit
              </button>
            </div>
          </div>

          {/* Game area */}
          <div className="flex-1 relative">
            {!gameState.isPlaying && !showFactModal && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="card text-center max-w-md"
                >
                  <h2 className="text-3xl font-bold mb-4 text-gradient">Ready to Shoot?</h2>
                  <p className="text-space-300 mb-6">
                    Click on falling stars to score points. Complete the level to unlock constellation facts!
                  </p>
                  <button
                    className="btn-primary"
                    onClick={handleGameStart}
                  >
                    🚀 Start Level {gameState.level}
                  </button>
                </div>
              </div>
            )}

            {gameState.isPlaying && !gameState.isPaused && (
              <GameWrapper
                onGameEnd={handleGameEnd}
                onPause={handlePause}
                onWinnerAchieved={handleWinnerAchieved}
                currentLevel={gameState.level}
              />
            )}

            {gameState.isPaused && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div
                  className="card text-center"
                >
                  <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
                  <button
                    className="btn-primary"
                    onClick={handleResume}
                  >
                    ▶️ Resume Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fact Modal */}
        {showFactModal && (
          <FactModal
            fact={currentFact}
            onNext={handleNextLevel}
            onClose={handleMainMenu}
            isWinner={gameState.isWinner}
            score={gameState.score}
            accuracy={gameState.accuracy}
            level={gameState.level}
          />
        )}
      </div>
    </>
  );
} 