'use client';

import { ModelResultCard } from './model-result-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  score: number;
  reasoning: string;
}

interface ResultsSectionProps {
  relevantBenchmarks: string[];
  reasoningDescription: string;
  recommendedModels: ModelData[];
}

export function ResultsSection({
  relevantBenchmarks,
  reasoningDescription,
  recommendedModels,
}: ResultsSectionProps) {
  const benchmarkLabels: Record<string, string> = {
    mmlu: 'MMLU',
    arc: 'ARC Challenge',
    truthfulqa: 'TruthfulQA',
    gsm8k: 'GSM8K',
    hellaswag: 'HellaSwag',
    winogrande: 'WinoGrande',
    average: 'Average Score',
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Benchmark Analysis */}
      <Card className="border border-slate-200 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Relevant Benchmarks for Your Task
            </h3>
            <p className="text-sm text-gray-700">{reasoningDescription}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {relevantBenchmarks.map((benchmark) => (
              <Badge
                key={benchmark}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {benchmarkLabels[benchmark] || benchmark}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Recommended Models */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Top {recommendedModels.length} Recommended Models
          </h2>
          <p className="text-gray-600 text-sm">
            Ranked by relevance to your specific task based on benchmark
            performance
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {recommendedModels.map((model, index) => (
            <ModelResultCard
              key={model.id}
              model={model}
              rank={index + 1}
            />
          ))}
        </div>
      </div>

      {/* Benchmark Explanation */}
      <Card className="border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Understanding the Benchmarks
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                MMLU
              </h4>
              <p className="text-sm text-gray-700">
                Massive Multitask Language Understanding - tests knowledge across
                STEM, social sciences, and humanities
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                ARC Challenge
              </h4>
              <p className="text-sm text-gray-700">
                AI2 Reasoning Challenge - multiple choice science questions
                requiring complex reasoning
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                TruthfulQA
              </h4>
              <p className="text-sm text-gray-700">
                Measures factual accuracy and tendency to hallucinate or produce
                misleading information
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                GSM8K
              </h4>
              <p className="text-sm text-gray-700">
                Grade School Math - evaluates mathematical reasoning ability
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                HellaSwag
              </h4>
              <p className="text-sm text-gray-700">
                Commonsense inference about everyday situations and activities
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                WinoGrande
              </h4>
              <p className="text-sm text-gray-700">
                Pronoun resolution and coreference understanding - requires
                semantic reasoning
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
