import { motion } from 'framer-motion';

interface Fact {
  constellation: string;
  fact: string;
  image: string;
}

interface FactModalProps {
  fact: Fact;
  onNext: () => void;
  onClose: () => void;
  isWinner: boolean;
  score: number;
  accuracy: number;
  level: number;
}

export default function FactModal({ fact, onNext, onClose, isWinner, score, accuracy, level }: FactModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="card max-w-md w-full text-center bg-space-800 border-2 border-space-600 rounded-xl p-8"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Constellation Icon */}
        <div className="text-6xl mb-6">
          {fact.image}
        </div>

        {/* Winner/Loser Status */}
        {isWinner ? (
          <div className="mb-4">
            <div className="text-4xl mb-2">🏆</div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Level Complete!</h2>
            <div className="text-green-400 text-lg mb-2">You're a Star Shooter!</div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-4xl mb-2">💫</div>
            <h2 className="text-2xl font-bold text-blue-400 mb-2">Level Failed</h2>
            <div className="text-red-400 text-lg mb-2">Keep practicing!</div>
          </div>
        )}

        {/* Score Display */}
        <div className="mb-4 p-4 bg-space-700 rounded-lg">
          <div className="text-lg font-bold text-white mb-2">Your Performance</div>
          <div className="flex justify-between text-sm">
            <span>Score: <span className="text-yellow-400 font-bold">{score}</span></span>
            <span>Accuracy: <span className="text-green-400 font-bold">{accuracy}%</span></span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Target: {10 + (level - 1) * 10} points | Required: 60% accuracy
          </div>
        </div>

        {/* Constellation Name */}
        <h2 className="text-3xl font-bold mb-4 text-gradient">
          {fact.constellation}
        </h2>

        {/* Fact Text */}
        <p className="text-space-300 mb-8 leading-relaxed">
          {fact.fact}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              console.log('Main Menu clicked');
              onClose();
            }}
            className="btn-secondary cursor-pointer hover:bg-space-700 transition-colors px-6 py-3 rounded-lg border-2 border-space-400 text-white font-bold"
            style={{ cursor: 'pointer' }}
          >
            🏠 Main Menu
          </button>
          
          {isWinner && (
            <button
              onClick={() => {
                console.log('Next Level clicked');
                onNext();
              }}
              className="btn-primary cursor-pointer hover:bg-star-gold/80 transition-colors px-6 py-3 rounded-lg border-2 border-star-gold text-white font-bold"
              style={{ cursor: 'pointer' }}
            >
              ⭐ Next Level
            </button>
          )}
        </div>

        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-star-gold rounded-full"
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 