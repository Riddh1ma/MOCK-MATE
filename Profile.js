import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Save,
  Upload,
  Camera,
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (data) => authAPI.updateProfile(data),
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        queryClient.invalidateQueries('userStats');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to update profile');
      },
    }
  );

  const uploadImageMutation = useMutation(
    (formData) => authAPI.uploadImage(formData),
    {
      onSuccess: () => {
        toast.success('Profile image updated successfully!');
        queryClient.invalidateQueries('userStats');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to upload image');
      },
    }
  );

  const handleSave = () => {
    updateMutation.mutate(profileData);
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadImageMutation.mutate(formData);
    }
  };

  const stats = [
    {
      title: 'Total Interviews',
      value: user?.totalInterviews || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Average Score',
      value: `${Math.round(user?.averageScore || 0)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Coding Problems',
      value: user?.totalCodingProblems || 0,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Member Since',
      value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

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
              Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      {/* Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 font-medium text-2xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                @{user?.username}
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                  {user?.role}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                  ID: {user?.id}
                </span>
              </div>
              {user?.bio && (
                <p className="text-gray-600 dark:text-gray-400">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Personal Information
            </h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700 pl-10"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700 pl-10"
                  />
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={updateMutation.isLoading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {updateMutation.isLoading ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Statistics
            </h2>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Account Settings
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Change Password
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Notification Preferences
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Privacy Settings
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
