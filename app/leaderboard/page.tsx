'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PaginationControls } from '@/components/pagination-controls';
import { Search } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  organization: string;
  fullName: string;
  parameters: number;
  architecture: string;
  license: string;
  huggingfaceUrl?: string;
  benchmarks: {
    mmlu: number;
    arc: number;
    truthfulqa: number;
    gsm8k: number;
    hellaswag: number;
    winogrande: number;
    average: number;
  };
}

const MODELS_PER_PAGE = 10;

export default function LeaderboardPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'average' | 'parameters' | 'name'>('average');
  const [isLoading, setIsLoading] = useState(true);

  // Load models from JSON
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch('/data/models.json');
        const data = await response.json();
        setModels(data);
        setFilteredModels(data);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Filter and sort models
  useEffect(() => {
    let result = [...models];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort models
    result.sort((a, b) => {
      if (sortBy === 'average') {
        return b.benchmarks.average - a.benchmarks.average;
      } else if (sortBy === 'parameters') {
        return b.parameters - a.parameters;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredModels(result);
    setCurrentPage(1);
  }, [models, searchQuery, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredModels.length / MODELS_PER_PAGE);
  const startIndex = (currentPage - 1) * MODELS_PER_PAGE;
  const endIndex = startIndex + MODELS_PER_PAGE;
  const paginatedModels = filteredModels.slice(startIndex, endIndex);

  const formatParameters = (params: number) => {
    if (params >= 1e9) {
      return `${(params / 1e9).toFixed(1)}B`;
    }
    if (params >= 1e6) {
      return `${(params / 1e6).toFixed(0)}M`;
    }
    return params.toString();
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
            <Link href="/recommender">
              <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                Recommender
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.3), transparent 50%)'}} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="mb-4 text-5xl sm:text-6xl font-bold text-gray-900">
              Model Leaderboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse and compare {filteredModels.length} open-source language models from the Open LLM Leaderboard
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-12">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by model name, organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Sort Options */}
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-medium text-gray-700 self-center">Sort by:</span>
                {(['average', 'parameters', 'name'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === option
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option === 'average' && 'Average Score'}
                    {option === 'parameters' && 'Parameters'}
                    {option === 'name' && 'Name'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Models Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading models...</p>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No models found matching your search.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {paginatedModels.map((model, index) => (
                  <Card key={model.id} className="p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold">
                            {startIndex + index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {model.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {model.organization}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {model.fullName}
                          </p>
                        </div>
                      </div>
                      {model.huggingfaceUrl && (
                        <a
                          href={model.huggingfaceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex-shrink-0 ml-4"
                        >
                          View on HF
                        </a>
                      )}
                    </div>

                    {/* Model Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Parameters</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatParameters(model.parameters)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Architecture</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {model.architecture}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">License</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {model.license}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Avg. Score</p>
                        <p className="text-sm font-semibold text-purple-600">
                          {model.benchmarks.average.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* Benchmark Scores */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'MMLU', key: 'mmlu' as const },
                        { label: 'ARC', key: 'arc' as const },
                        { label: 'TruthfulQA', key: 'truthfulqa' as const },
                        { label: 'GSM8K', key: 'gsm8k' as const },
                        { label: 'HellaSwag', key: 'hellaswag' as const },
                        { label: 'WinoGrande', key: 'winogrande' as const },
                      ].map(({ label, key }) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">{label}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                              style={{
                                width: `${(model.benchmarks[key] / 100) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                            {model.benchmarks[key].toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
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
