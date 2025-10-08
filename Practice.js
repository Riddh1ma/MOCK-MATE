import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { questionAPI } from '../services/api';
import {
  Code,
  BookOpen,
  Brain,
  Filter,
  Play,
  Clock,
  Star,
  Users,
  TrendingUp,
  Target,
} from 'lucide-react';

const Practice = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const { data: questions, isLoading } = useQuery(
    ['questions', selectedCategory, selectedDifficulty, selectedType],
    () => {
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedDifficulty !== 'ALL') params.difficulty = selectedDifficulty;
      if (selectedType !== 'ALL') params.type = selectedType;
      params.limit = 20;
      return questionAPI.getQuestions(params);
    },
    {
      select: (response) => response.data,
    }
  );

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'JAVA', label: 'Java' },
    { value: 'PYTHON', label: 'Python' },
    { value: 'CPP', label: 'C++' },
    { value: 'DATA_STRUCTURES', label: 'Data Structures' },
    { value: 'ALGORITHMS', label: 'Algorithms' },
    { value: 'SYSTEM_DESIGN', label: 'System Design' },
    { value: 'DATABASE', label: 'Database' },
    { value: 'NETWORKING', label: 'Networking' },
    { value: 'BEHAVIORAL', label: 'Behavioral' },
  ];

  const difficulties = [
    { value: 'ALL', label: 'All Levels' },
    { value: 'EASY', label: 'Easy' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HARD', label: 'Hard' },
  ];

  const types = [
    { value: 'ALL', label: 'All Types' },
    { value: 'CODING', label: 'Coding' },
    { value: 'MCQ', label: 'Multiple Choice' },
    { value: 'BEHAVIORAL', label: 'Behavioral' },
    { value: 'TECHNICAL', label: 'Technical' },
  ];

  const practiceTypes = [
    {
      title: 'Coding Challenges',
      description: 'Practice with real coding interview questions',
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      href: '/practice?type=CODING',
      count: questions?.filter(q => q.type === 'CODING').length || 0,
    },
    {
      title: 'Multiple Choice',
      description: 'Test your theoretical knowledge',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      href: '/practice?type=MCQ',
      count: questions?.filter(q => q.type === 'MCQ').length || 0,
    },
    {
      title: 'Behavioral Questions',
      description: 'Practice HR and behavioral interviews',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      href: '/practice?type=BEHAVIORAL',
      count: questions?.filter(q => q.type === 'BEHAVIORAL').length || 0,
    },
    {
      title: 'System Design',
      description: 'Design scalable systems and architectures',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      href: '/practice?category=SYSTEM_DESIGN',
      count: questions?.filter(q => q.category === 'SYSTEM_DESIGN').length || 0,
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'HARD':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CODING':
        return Code;
      case 'MCQ':
        return BookOpen;
      case 'BEHAVIORAL':
        return Brain;
      default:
        return BookOpen;
    }
  };

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
              Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose your practice mode and start improving your interview skills
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>1,234 students practicing</span>
          </div>
        </div>
      </motion.div>

      {/* Practice Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {practiceTypes.map((type, index) => (
          <Link
            key={type.title}
            to={type.href}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white hover:scale-105 transition-transform duration-200"
            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${type.color}`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <type.icon className="h-8 w-8" />
                <span className="text-sm font-medium opacity-90">
                  {type.count} questions
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
              <p className="text-sm opacity-90">{type.description}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filter Questions
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Questions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Available Questions
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span>{questions?.length || 0} questions found</span>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {questions?.map((question) => {
                const TypeIcon = getTypeIcon(question.type);
                return (
                  <div
                    key={question.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                          <TypeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {question.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {question.content}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                                question.difficulty
                              )}`}
                            >
                              {question.difficulty}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {question.points} points
                            </span>
                            {question.timeLimitMinutes && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{question.timeLimitMinutes} min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={
                            question.type === 'CODING'
                              ? `/coding/${question.id}`
                              : `/behavioral/${question.id}`
                          }
                          className="btn-primary text-sm"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Practice;
