import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import {
  BookOpen,
  Code,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Users,
  Award,
  Play,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery(
    'userStats',
    () => authAPI.getUserStats(),
    {
      select: (response) => response.data,
    }
  );

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery(
    'leaderboard',
    () => authAPI.getLeaderboard(5),
    {
      select: (response) => response.data,
    }
  );

  const quickActions = [
    {
      title: 'Practice Coding',
      description: 'Solve coding challenges',
      icon: Code,
      href: '/practice',
      color: 'bg-blue-500',
    },
    {
      title: 'Behavioral Interview',
      description: 'Practice HR questions',
      icon: BookOpen,
      href: '/practice',
      color: 'bg-green-500',
    },
    {
      title: 'Schedule Interview',
      description: 'Book a mock interview',
      icon: Calendar,
      href: '/schedule',
      color: 'bg-purple-500',
    },
    {
      title: 'View Performance',
      description: 'Check your progress',
      icon: BarChart3,
      href: '/performance',
      color: 'bg-orange-500',
    },
  ];

  const statsCards = [
    {
      title: 'Total Interviews',
      value: stats?.totalInterviews || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Average Score',
      value: `${Math.round(stats?.averageScore || 0)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Coding Problems',
      value: stats?.totalCodingSubmissions || 0,
      icon: Code,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Current Rank',
      value: `#${stats?.rank || 'N/A'}`,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-primary-100">
            Ready to ace your next interview? Let's practice and improve together.
          </p>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <Play className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Top Performers
            </h2>
            {leaderboardLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard?.map((user, index) => (
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
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/performance"
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View full leaderboard →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Completed coding challenge
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Two Sum - 85% score
                </p>
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Behavioral interview completed
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Mock interview session
                </p>
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  New goal set
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Complete 10 coding problems this week
                </p>
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
