'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TaskInputForm } from '@/components/task-input-form';
import { ResultsSection } from '@/components/results-section';
import { LoadingAnimation } from '@/components/loading-animation';

interface ModelData {
  id: string;
  name: string;
  organization: string;
  fullName: string;
  parameters: number;
  architecture: string;
  license: string;
  benchmarks: {
    mmlu: number;
    arc: number;
    truthfulqa: number;
    gsm8k: number;
    hellaswag: number;
    winogrande: number;
    average: number;
  };
  score?: number;
  reasoning?: string;
}

interface RecommendationResponse {
  relevantBenchmarks: string[];
  reasoningDescription: string;
  recommendedModels: ModelData[];
}

export default function RecommenderPage() {
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    taskDescription: string,
    taskSizeMultiplier: number
  ) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskDescription,
          taskSizeMultiplier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data: RecommendationResponse = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
      {/* Header with Navigation */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            ModelMatch AI
          </Link>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                Home
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.3), transparent 50%)'}} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl sm:text-6xl font-bold text-gray-900">
              AI Model Recommender
            </h1>
            <p className="mb-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Describe your task and get personalized model recommendations powered by AI analysis
            </p>
          </div>

          {/* Main Content Area */}
          <div className="mx-auto max-w-3xl">
            {/* Task Input Form */}
            <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow">
              <TaskInputForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="mb-8">
                <ResultsSection
                  relevantBenchmarks={results.relevantBenchmarks}
                  reasoningDescription={
                    results.reasoningDescription
                  }
                  recommendedModels={results.recommendedModels}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <LoadingAnimation />
              </div>
            )}

            {/* Example Tasks */}
            {!results && !isLoading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-600 font-medium mb-6">Try an example task:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {[
                    'Chatbot for customer support',
                    'Coding assistant for Python',
                    'Medical document summarization',
                    'Math reasoning and problem solving'
                  ].map((task) => (
                    <button
                      key={task}
                      onClick={() => {
                        const form = document.querySelector('textarea') as HTMLTextAreaElement;
                        if (form) {
                          form.value = task;
                          form.focus();
                        }
                      }}
                      className="px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Developed by <span className="font-medium text-gray-900">Pallika Malhotra</span>
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/PallikaMalhotra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/pallika-malhotra-a9099729a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.668-2.236-1.006 0-1.607.678-1.871 1.334-.098.237-.121.568-.121.9v5.571h-3.553v-9.349h3.553v1.271c.396-.612 1.107-1.485 2.693-1.485 1.966 0 3.443 1.283 3.443 4.043l.006 5.52zM5.337 9.432c-1.143 0-2.063-.929-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.136-.925 2.065-2.064 2.065zm1.782 11.02H3.555v-9.349h3.564v9.349zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500">
            <p>
              ModelMatch AI © 2025. Open source and built with Next.js.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
