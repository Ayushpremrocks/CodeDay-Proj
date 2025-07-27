import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  level: number;
  constellation: string;
  date: string;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    playerName: 'StarShooter',
    score: 2500,
    accuracy: 95,
    level: 5,
    constellation: 'Orion',
    date: '2024-01-15'
  },
  {
    id: '2',
    playerName: 'CosmicHunter',
    score: 2200,
    accuracy: 92,
    level: 4,
    constellation: 'Ursa Major',
    date: '2024-01-14'
  },
  {
    id: '3',
    playerName: 'GalaxyGamer',
    score: 2100,
    accuracy: 88,
    level: 4,
    constellation: 'Cassiopeia',
    date: '2024-01-13'
  },
  {
    id: '4',
    playerName: 'SpaceExplorer',
    score: 1950,
    accuracy: 90,
    level: 3,
    constellation: 'Leo',
    date: '2024-01-12'
  },
  {
    id: '5',
    playerName: 'NebulaNinja',
    score: 1800,
    accuracy: 85,
    level: 3,
    constellation: 'Scorpius',
    date: '2024-01-11'
  },
  {
    id: '6',
    playerName: 'AstroAce',
    score: 1650,
    accuracy: 87,
    level: 2,
    constellation: 'Orion',
    date: '2024-01-10'
  },
  {
    id: '7',
    playerName: 'MeteorMaster',
    score: 1500,
    accuracy: 82,
    level: 2,
    constellation: 'Ursa Major',
    date: '2024-01-09'
  },
  {
    id: '8',
    playerName: 'CometChaser',
    score: 1350,
    accuracy: 80,
    level: 1,
    constellation: 'Cassiopeia',
    date: '2024-01-08'
  },
  {
    id: '9',
    playerName: 'PulsarPro',
    score: 1200,
    accuracy: 78,
    level: 1,
    constellation: 'Leo',
    date: '2024-01-07'
  },
  {
    id: '10',
    playerName: 'QuasarQueen',
    score: 1050,
    accuracy: 75,
    level: 1,
    constellation: 'Scorpius',
    date: '2024-01-06'
  }
];

const constellations = ['All', 'Orion', 'Ursa Major', 'Cassiopeia', 'Leo', 'Scorpius'];

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(mockLeaderboardData);
  const [selectedConstellation, setSelectedConstellation] = useState('All');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'level'>('score');

  const filteredData = leaderboardData.filter(entry => 
    selectedConstellation === 'All' || entry.constellation === selectedConstellation
  );

  const sortedData = [...filteredData].sort((a, b) => b[sortBy] - a[sortBy]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getConstellationIcon = (constellation: string) => {
    const icons: { [key: string]: string } = {
      'Orion': '🌟',
      'Ursa Major': '⭐',
      'Cassiopeia': '✨',
      'Leo': '🦁',
      'Scorpius': '🦂'
    };
    return icons[constellation] || '⭐';
  };

  return (
    <>
      <Head>
        <title>Leaderboard - Shooting the Star</title>
        <meta name="description" content="Top players and scores in Shooting the Star" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen starfield relative">
        {/* Header */}
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Home
              </motion.button>
            </Link>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-gradient"
            >
              🏆 Leaderboard
            </motion.h1>

            <Link href="/game">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Play Now
              </motion.button>
            </Link>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <label className="text-space-300 font-medium">Constellation:</label>
                <select
                  value={selectedConstellation}
                  onChange={(e) => setSelectedConstellation(e.target.value)}
                  className="bg-space-700 border border-space-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-space-400"
                >
                  {constellations.map(constellation => (
                    <option key={constellation} value={constellation}>
                      {constellation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 items-center">
                <label className="text-space-300 font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'score' | 'accuracy' | 'level')}
                  className="bg-space-700 border border-space-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-space-400"
                >
                  <option value="score">Score</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="level">Level</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-space-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Constellation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-space-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-700">
                  {sortedData.map((entry, index) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-space-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold">
                          {getRankIcon(index + 1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {entry.playerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">
                            {getConstellationIcon(entry.constellation)}
                          </span>
                          <span className="text-sm text-space-300">
                            {entry.constellation}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-star-gold">
                          {entry.score.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-space-300">
                          {entry.accuracy}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-space-300">
                          {entry.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-space-400">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="card text-center">
              <div className="text-3xl font-bold text-star-gold mb-2">
                {sortedData.length}
              </div>
              <div className="text-space-300">Total Players</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-star-gold mb-2">
                {Math.max(...sortedData.map(e => e.score)).toLocaleString()}
              </div>
              <div className="text-space-300">Highest Score</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-star-gold mb-2">
                {Math.round(sortedData.reduce((acc, e) => acc + e.accuracy, 0) / sortedData.length)}%
              </div>
              <div className="text-space-300">Average Accuracy</div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 