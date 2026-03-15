'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface BenchmarkData {
  benchmark: string;
  score: number;
  range?: string;
}

interface BenchmarkRadarChartProps {
  modelName: string;
  data: BenchmarkData[];
}

export function BenchmarkRadarChart({ modelName, data }: BenchmarkRadarChartProps) {
  return (
    <Card className="p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        {modelName} - Benchmark Performance
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="benchmark" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
          />
          <Radar
            name={modelName}
            dataKey="score"
            stroke="#9333ea"
            fill="#a855f7"
            fillOpacity={0.6}
            dot={{ fill: '#9333ea', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value: number) => `${value.toFixed(1)}`}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Overall Average Score: <span className="font-semibold text-gray-900">{(data.reduce((sum, item) => sum + item.score, 0) / data.length).toFixed(1)}</span></p>
      </div>
    </Card>
  );
}
