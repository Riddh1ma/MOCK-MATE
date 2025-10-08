import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { interviewAPI, authAPI } from '../services/api';
import {
  Calendar,
  Clock,
  Users,
  User,
  Plus,
  Video,
  MessageCircle,
  Target,
} from 'lucide-react';

const InterviewScheduler = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'TECHNICAL',
    scheduledAt: '',
    durationMinutes: 60,
    isPeerInterview: false,
  });

  const queryClient = useQueryClient();

  const { data: interviews, isLoading } = useQuery(
    'myInterviews',
    () => interviewAPI.getMyInterviews(),
    {
      select: (response) => response.data,
    }
  );

  const { data: mentors } = useQuery(
    'mentors',
    () => authAPI.getMentors(),
    {
      select: (response) => response.data,
    }
  );

  const { data: availablePeerInterviews } = useQuery(
    'availablePeerInterviews',
    () => interviewAPI.getAvailablePeerInterviews(),
    {
      select: (response) => response.data,
    }
  );

  const createMutation = useMutation(
    (interviewData) => interviewAPI.create(interviewData),
    {
      onSuccess: () => {
        toast.success('Interview scheduled successfully!');
        queryClient.invalidateQueries('myInterviews');
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          type: 'TECHNICAL',
          scheduledAt: '',
          durationMinutes: 60,
          isPeerInterview: false,
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to schedule interview');
      },
    }
  );

  const joinMutation = useMutation(
    (interviewId) => interviewAPI.joinPeerInterview(interviewId),
    {
      onSuccess: () => {
        toast.success('Joined peer interview successfully!');
        queryClient.invalidateQueries('myInterviews');
        queryClient.invalidateQueries('availablePeerInterviews');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to join interview');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.scheduledAt) {
      toast.error('Please fill in all required fields');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TECHNICAL':
        return Target;
      case 'BEHAVIORAL':
        return MessageCircle;
      case 'CODING':
        return Users;
      case 'MIXED':
        return Calendar;
      default:
        return Calendar;
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
              Interview Scheduler
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule and manage your mock interviews
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Schedule Interview
          </button>
        </div>
      </motion.div>

      {/* Create Interview Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Schedule New Interview
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Technical Interview Practice"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                  placeholder="Describe what you want to practice..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="BEHAVIORAL">Behavioral</option>
                  <option value="CODING">Coding</option>
                  <option value="MIXED">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPeerInterview"
                  checked={formData.isPeerInterview}
                  onChange={(e) => setFormData({ ...formData, isPeerInterview: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Allow peer participation
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Available Peer Interviews */}
      {availablePeerInterviews && availablePeerInterviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Available Peer Interviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePeerInterviews.map((interview) => {
                const TypeIcon = getTypeIcon(interview.type);
                return (
                  <div key={interview.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {interview.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {interview.userName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {interview.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(interview.scheduledAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {interview.durationMinutes}m
                      </span>
                    </div>
                    <button
                      onClick={() => joinMutation.mutate(interview.id)}
                      disabled={joinMutation.isLoading}
                      className="w-full btn-primary text-sm disabled:opacity-50"
                    >
                      Join Interview
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* My Interviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            My Interviews
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {interviews?.map((interview) => {
                const TypeIcon = getTypeIcon(interview.type);
                return (
                  <div key={interview.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                          <TypeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {interview.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {interview.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(interview.scheduledAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {interview.durationMinutes} minutes
                            </span>
                            {interview.isPeerInterview && (
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                Peer Interview
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                        {interview.status === 'SCHEDULED' && (
                          <button className="btn-primary text-sm">
                            Start Interview
                          </button>
                        )}
                        {interview.status === 'IN_PROGRESS' && (
                          <button className="btn-secondary text-sm">
                            Continue
                          </button>
                        )}
                        {interview.status === 'COMPLETED' && interview.score && (
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Score: {Math.round(interview.score)}%
                          </span>
                        )}
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

export default InterviewScheduler;
