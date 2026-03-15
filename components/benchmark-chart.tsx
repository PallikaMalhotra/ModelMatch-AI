'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '@/components/ui/card';

interface BenchmarkChartProps {
  models: Array<{
    name: string;
    benchmarks: {
      mmlu: number;
      arc: number;
      truthfulqa: number;
      gsm8k: number;
      hellaswag: number;
      winogrande: number;
    };
  }>;
}

export function BenchmarkChart({ models }: BenchmarkChartProps) {
  const chartData = models.slice(0, 5).map((model) => ({
    name: model.name.split('/')[1] || model.name,
    MMLU: model.benchmarks.mmlu,
    ARC: model.benchmarks.arc,
    TruthfulQA: model.benchmarks.truthfulqa,
    GSM8K: model.benchmarks.gsm8k,
    HellaSwag: model.benchmarks.hellaswag,
    Winogrande: model.benchmarks.winogrande,
  }));

  const benchmarkComparison = [
    {
      name: 'MMLU',
      avg: (models.reduce((sum, m) => sum + m.benchmarks.mmlu, 0) / models.length).toFixed(1),
    },
    {
      name: 'ARC',
      avg: (models.reduce((sum, m) => sum + m.benchmarks.arc, 0) / models.length).toFixed(1),
    },
    {
      name: 'TruthfulQA',
      avg: (models.reduce((sum, m) => sum + m.benchmarks.truthfulqa, 0) / models.length).toFixed(1),
    },
    {
      name: 'GSM8K',
      avg: (models.reduce((sum, m) => sum + m.benchmarks.gsm8k, 0) / models.length).toFixed(1),
    },
    {
      name: 'HellaSwag',
      avg: (models.reduce((sum, m) => sum + m.benchmarks.hellaswag, 0) / models.length).toFixed(1),
    },
    {
      name: 'Winogrande',
      avg: (models.reduce((sum, m) => sum + m.benchmarks.winogrande, 0) / models.length).toFixed(1),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Models Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="MMLU" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="ARC" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="TruthfulQA" fill="#a78bfa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Benchmark Averages
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={benchmarkComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            />
            <Bar dataKey="avg" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
