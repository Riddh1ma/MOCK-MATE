import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { authAPI } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Award,
  Calendar,
  Code,
  BookOpen,
  Brain,
  Trophy,
} from 'lucide-react';

const Performance = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'userStats',
    () => authAPI.getUserStats(),
    {
      select: (response) => response.data,
    }
  );

  const { data: leaderboard } = useQuery(
    'leaderboard',
    () => authAPI.getLeaderboard(10),
    {
      select: (response) => response.data,
    }
  );

  // Mock data for charts (in a real app, this would come from the API)
  const performanceData = [
    { month: 'Jan', interviews: 2, coding: 5, score: 75 },
    { month: 'Feb', interviews: 4, coding: 8, score: 82 },
    { month: 'Mar', interviews: 3, coding: 12, score: 88 },
    { month: 'Apr', interviews: 5, coding: 15, score: 85 },
    { month: 'May', interviews: 7, coding: 18, score: 92 },
    { month: 'Jun', interviews: 6, coding: 22, score: 89 },
  ];

  const categoryData = [
    { name: 'Coding', value: 45, color: '#3B82F6' },
    { name: 'Behavioral', value: 30, color: '#10B981' },
    { name: 'Technical', value: 25, color: '#F59E0B' },
  ];

  const difficultyData = [
    { name: 'Easy', completed: 15, accuracy: 95 },
    { name: 'Medium', completed: 8, accuracy: 78 },
    { name: 'Hard', completed: 3, accuracy: 60 },
  ];

  const achievementData = [
    { title: 'First Interview', description: 'Completed your first mock interview', earned: true, date: '2024-01-15' },
    { title: 'Coding Master', description: 'Solved 50 coding problems', earned: false, date: null },
    { title: 'Perfect Score', description: 'Achieved 100% on an interview', earned: true, date: '2024-02-20' },
    { title: 'Consistent Performer', description: 'Maintained 80%+ average for 30 days', earned: false, date: null },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Performance Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and identify areas for improvement
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Trophy className="h-4 w-4" />
            <span>Rank #{stats?.rank || 'N/A'}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.totalInterviews || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% this month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(stats?.averageScore || 0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% improvement</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Coding Problems</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.totalCodingSubmissions || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+8 this week</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Coding Average</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(stats?.averageCodingScore || 0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+3% this month</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Performance Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Practice Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Difficulty Performance
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Achievements
          </h2>
          <div className="space-y-3">
            {achievementData.map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  achievement.earned
                    ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {achievement.earned ? (
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    ) : (
                      <Award className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  {achievement.earned && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top Performers
          </h2>
          <div className="space-y-3">
            {leaderboard?.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {Math.round(user.averageScore || 0)}% avg score
                  </p>
                </div>
                {index < 3 && (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Performance;
