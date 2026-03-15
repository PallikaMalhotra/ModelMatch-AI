'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.3), transparent 50%)'}} />
        <div className="relative mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-purple-100 rounded-full text-sm font-medium text-purple-700">
              AI Model Discovery Platform
            </div>
            <h1 className="mb-6 text-6xl sm:text-7xl font-bold text-gray-900">
              ModelMatch AI
            </h1>
            <p className="mb-4 text-2xl text-gray-700 max-w-3xl mx-auto font-light">
              Find the perfect open-source language model for your specific task
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              AI-powered recommendations powered by the Open LLM Leaderboard
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/recommender">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-6 text-lg"
                >
                  Get Recommendations
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-6 text-lg"
                >
                  Browse All Models
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why ModelMatch AI?</h2>
            <p className="text-xl text-gray-600">Everything you need to find the right model</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Analysis',
                description: 'Describe your task and let Gemini AI identify the most relevant benchmarks for your use case.',
                icon: '🤖'
              },
              {
                title: 'Real Benchmark Data',
                description: 'Compare models using real data from the Open LLM Leaderboard across 6 key benchmarks.',
                icon: '📊'
              },
              {
                title: 'Smart Recommendations',
                description: 'Get personalized model recommendations ranked by relevance to your specific requirements.',
                icon: '⭐'
              },
              {
                title: 'Size-Aware Matching',
                description: 'Specify your complexity needs and get models optimized for your performance requirements.',
                icon: '⚙️'
              },
              {
                title: 'Detailed Insights',
                description: 'View comprehensive model information including parameters, architecture, and license details.',
                icon: '🔍'
              },
              {
                title: 'Easy Deployment',
                description: 'Direct links to HuggingFace repositories for quick access and easy deployment options.',
                icon: '🚀'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to find your perfect model?</h2>
          <p className="text-xl text-purple-100 mb-8">Start with AI recommendations or browse all 35+ models on the leaderboard.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recommender">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
              >
                Get AI Recommendations
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button 
                size="lg" 
                className="border-2 border-white text-white hover:bg-purple-600 font-semibold px-8 py-6 text-lg"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
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
              ModelMatch AI © 2026. Open source and built with Next.js.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
