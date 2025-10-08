import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { questionAPI, behavioralAPI } from '../services/api';
import {
  Play,
  Square,
  Mic,
  MicOff,
  RotateCcw,
  Clock,
  Send,
  CheckCircle,
  Brain,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const BehavioralInterview = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [response, setResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { data: question, isLoading: questionLoading } = useQuery(
    ['question', questionId],
    () => questionAPI.getQuestion(questionId),
    {
      select: (response) => response.data,
      onSuccess: (data) => {
        if (data.timeLimitMinutes) {
          setTimeLeft(data.timeLimitMinutes * 60);
        }
      },
    }
  );

  const submitMutation = useMutation(
    (responseData) => behavioralAPI.submitResponse(responseData),
    {
      onSuccess: (response) => {
        toast.success('Response submitted successfully!');
        queryClient.invalidateQueries(['behavioral-responses']);
        navigate('/practice');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Submission failed');
      },
    }
  );

  const analyzeMutation = useMutation(
    (responseId) => behavioralAPI.analyzeResponse(responseId),
    {
      onSuccess: (response) => {
        toast.success('Analysis completed!');
        setIsAnalyzing(false);
      },
      onError: (error) => {
        toast.error('Analysis failed');
        setIsAnalyzing(false);
      },
    }
  );

  React.useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      toast.error('Time\'s up! Auto-submitting...');
      handleSubmit();
    }
  }, [timeLeft, isTimerRunning]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(question?.timeLimitMinutes * 60 || null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real implementation, you would upload this to a server
        toast.success('Audio recorded successfully!');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (!response.trim()) {
      toast.error('Please provide a response');
      return;
    }

    submitMutation.mutate({
      questionId: parseInt(questionId),
      response,
    });
  };

  if (questionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Question not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/practice')}
            className="btn-primary"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/practice')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back to Practice
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Behavioral Interview
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                    {question.difficulty}
                  </span>
                  <span>{question.points} points</span>
                  {question.timeLimitMinutes && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {question.timeLimitMinutes} minutes
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {timeLeft !== null && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className={`text-lg font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                    {formatTime(timeLeft)}
                  </span>
                  {!isTimerRunning && timeLeft === question.timeLimitMinutes * 60 && (
                    <button
                      onClick={startTimer}
                      className="btn-primary text-sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  )}
                  {isTimerRunning && (
                    <button
                      onClick={stopTimer}
                      className="btn-secondary text-sm"
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                Question
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {question.content}
                </p>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tips for a Great Answer
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Use the STAR method (Situation, Task, Action, Result)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Be specific and provide concrete examples
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Focus on your role and contributions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Show learning and growth from experiences
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Response Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Response
              </h2>
              
              <div className="space-y-4">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response here... Use the STAR method to structure your answer."
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                />
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4 mr-1" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-1" />
                        Record Audio
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {response.length} characters
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitMutation.isLoading || !response.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitMutation.isLoading ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          Submit Response
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Preview */}
            <div className="card p-6">
              <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-blue-600" />
                AI Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your response will be analyzed for content quality, sentiment, and structure.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Content Quality</span>
                  <span className="text-gray-400">-</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sentiment Analysis</span>
                  <span className="text-gray-400">-</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Structure Score</span>
                  <span className="text-gray-400">-</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralInterview;
