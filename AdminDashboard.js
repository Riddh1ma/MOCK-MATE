import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { adminAPI } from '../services/api';
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
  Users,
  Calendar,
  Code,
  Award,
  TrendingUp,
  Activity,
  Shield,
  Database,
} from 'lucide-react';

const AdminDashboard = () => {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery(
    'adminDashboardStats',
    () => adminAPI.getDashboardStats(),
    {
      select: (response) => response.data,
    }
  );

  const { data: systemStats } = useQuery(
    'systemStats',
    () => adminAPI.getSystemStats(),
    {
      select: (response) => response.data,
    }
  );

  // Mock data for charts (in a real app, this would come from the API)
  const userGrowthData = [
    { month: 'Jan', users: 120, interviews: 45, submissions: 89 },
    { month: 'Feb', users: 180, interviews: 67, submissions: 134 },
    { month: 'Mar', users: 240, interviews: 89, submissions: 178 },
    { month: 'Apr', users: 320, interviews: 112, submissions: 234 },
    { month: 'May', users: 410, interviews: 145, submissions: 289 },
    { month: 'Jun', users: 520, interviews: 178, submissions: 345 },
  ];

  const userRoleData = [
    { name: 'Students', value: 450, color: '#3B82F6' },
    { name: 'Mentors', value: 25, color: '#10B981' },
    { name: 'Admins', value: 3, color: '#F59E0B' },
  ];

  const interviewTypeData = [
    { name: 'Technical', completed: 120, scheduled: 45 },
    { name: 'Behavioral', completed: 89, scheduled: 32 },
    { name: 'Coding', completed: 156, scheduled: 67 },
    { name: 'Mixed', completed: 78, scheduled: 23 },
  ];

  const statsCards = [
    {
      title: 'Total Users',
      value: systemStats?.totalUsers || 478,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Interviews',
      value: systemStats?.totalInterviews || 443,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Code Submissions',
      value: systemStats?.totalSubmissions || 1234,
      icon: Code,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      change: '+15%',
      changeType: 'positive',
    },
    {
      title: 'Average Score',
      value: `${Math.round(systemStats?.averageScore || 0)}%`,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      change: '+3%',
      changeType: 'positive',
    },
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-red-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              System overview and user management
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Activity className="h-4 w-4" />
            <span>System Status: Healthy</span>
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
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            User Growth & Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="submissions" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Roles Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            User Roles Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {userRoleData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Interview Types Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Interview Types Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={interviewTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#10B981" name="Completed" />
            <Bar dataKey="scheduled" fill="#3B82F6" name="Scheduled" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            User Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  View All Users
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Add New Mentor
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  User Reports
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Content Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Manage Questions
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Add New Question
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Question Analytics
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            System Settings
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Database Status
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  System Logs
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Backup & Restore
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
