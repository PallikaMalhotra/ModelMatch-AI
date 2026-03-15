'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

interface ModelResultCardProps {
  model: ModelData;
  rank: number;
}

function formatParameters(params: number): string {
  if (params >= 1000000000000) {
    return `${(params / 1000000000000).toFixed(1)}T`;
  }
  if (params >= 1000000000) {
    return `${(params / 1000000000).toFixed(1)}B`;
  }
  if (params >= 1000000) {
    return `${(params / 1000000).toFixed(1)}M`;
  }
  return params.toString();
}

export function ModelResultCard({ model, rank }: ModelResultCardProps) {
  const huggingFaceUrl = `https://huggingface.co/${model.fullName}`;

  return (
    <Card className="overflow-hidden border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 shadow-lg hover:shadow-xl transition-all hover:border-purple-300">
      <div className="p-6">
        {/* Header with rank and score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {rank}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {model.name}
              </h3>
              <p className="text-sm text-gray-600">{model.organization}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">
              {model.score.toFixed(1)}
            </div>
            <p className="text-xs text-gray-500">Match Score</p>
          </div>
        </div>

        {/* Model specifications */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Parameters
            </p>
            <p className="text-sm font-medium text-gray-900">
              {formatParameters(model.parameters)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Architecture
            </p>
            <p className="text-sm font-medium text-gray-900">
              {model.architecture}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              License
            </p>
            <Badge variant="outline" className="text-xs">
              {model.license}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Avg Score
            </p>
            <p className="text-sm font-medium text-gray-900">
              {model.benchmarks.average.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Benchmark scores */}
        <div className="mb-4 pb-4 border-b border-slate-200">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Benchmark Scores
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'mmlu', label: 'MMLU' },
              { key: 'arc', label: 'ARC' },
              { key: 'truthfulqa', label: 'TruthfulQA' },
              { key: 'gsm8k', label: 'GSM8K' },
              { key: 'hellaswag', label: 'HellaSwag' },
              { key: 'winogrande', label: 'WinoGrande' },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="p-2 rounded bg-purple-100 text-center"
              >
                <p className="text-xs font-medium text-purple-900">{label}</p>
                <p className="text-sm font-bold text-purple-600">
                  {
                    model.benchmarks[
                      key as keyof typeof model.benchmarks
                    ]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div className="mb-4 pb-4 border-b border-slate-200">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Why This Match
          </p>
          <p className="text-sm text-gray-700">{model.reasoning}</p>
        </div>

        {/* Action button */}
        <Link href={huggingFaceUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full" variant="default">
            View on HuggingFace →
          </Button>
        </Link>
      </div>
    </Card>
  );
}
