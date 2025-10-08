import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { questionAPI, codingAPI } from '../services/api';
import {
  Play,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Settings,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';

const CodingTest = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [isRunning, setIsRunning] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  const { data: submissions } = useQuery(
    ['submissions', questionId],
    () => codingAPI.getSubmissions({ questionId }),
    {
      select: (response) => response.data,
    }
  );

  const submitMutation = useMutation(
    (submissionData) => codingAPI.submitCode(submissionData),
    {
      onSuccess: (response) => {
        toast.success('Code submitted successfully!');
        queryClient.invalidateQueries(['submissions', questionId]);
        navigate('/practice');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Submission failed');
      },
    }
  );

  const testMutation = useMutation(
    (testData) => codingAPI.testCode(testData),
    {
      onSuccess: (response) => {
        const { output, error } = response.data;
        if (error) {
          setTestOutput(`Error: ${error}`);
        } else {
          setTestOutput(output);
        }
        setIsRunning(false);
      },
      onError: (error) => {
        setTestOutput(`Error: ${error.message}`);
        setIsRunning(false);
      },
    }
  );

  useEffect(() => {
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

  const languages = [
    { value: 'java', label: 'Java', template: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
    { value: 'python', label: 'Python', template: '# Your code here\ndef solution():\n    pass\n\nif __name__ == "__main__":\n    solution()' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
    { value: 'javascript', label: 'JavaScript', template: 'function solution() {\n    // Your code here\n}\n\nsolution();' },
  ];

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

  const handleRunCode = () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    testMutation.mutate({
      code,
      language: selectedLanguage,
      input: testInput,
    });
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    submitMutation.mutate({
      questionId: parseInt(questionId),
      code,
      language: selectedLanguage.toUpperCase(),
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLanguageTemplate = () => {
    const lang = languages.find(l => l.value === selectedLanguage);
    return lang?.template || '';
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
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
                  {question.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Problem Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {question.content}
                </p>
              </div>
            </div>

            {question.testCases && question.testCases.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Test Cases
                </h2>
                <div className="space-y-4">
                  {question.testCases.slice(0, 2).map((testCase, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Test Case {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="font-medium text-gray-700 dark:text-gray-300">Input:</label>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-gray-900 dark:text-gray-100">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700 dark:text-gray-300">Expected Output:</label>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-gray-900 dark:text-gray-100">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Code Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Code Editor */}
            <div className="card p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Code Editor
                  </h2>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      if (!code.trim()) {
                        setCode(getLanguageTemplate());
                      }
                    }}
                    className="input-field text-sm py-1"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCode(getLanguageTemplate())}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    title="Reset to template"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="h-96">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={getLanguageTemplate()}
                  className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none resize-none focus:outline-none"
                  style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                />
              </div>
            </div>

            {/* Test Input/Output */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Test Your Code
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Input (optional)
                  </label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter test input here..."
                    className="w-full h-20 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || !code.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Run Code
                      </>
                    )}
                  </button>
                </div>

                {testOutput && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Output
                    </label>
                    <pre className="w-full h-20 p-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 overflow-auto">
                      {testOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isLoading || !code.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Submit Solution
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;
