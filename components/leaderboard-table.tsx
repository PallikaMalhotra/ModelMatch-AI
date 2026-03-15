'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
}

interface LeaderboardTableProps {
  models: ModelData[];
}

type SortField = 'name' | 'parameters' | 'average' | 'mmlu' | 'arc';
type SortOrder = 'asc' | 'desc';

export function LeaderboardTable({ models }: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('average');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models.filter((model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: number | string = '';
      let bValue: number | string = '';

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'parameters':
          aValue = a.parameters;
          bValue = b.parameters;
          break;
        case 'average':
          aValue = a.benchmarks.average;
          bValue = b.benchmarks.average;
          break;
        case 'mmlu':
          aValue = a.benchmarks.mmlu;
          bValue = b.benchmarks.mmlu;
          break;
        case 'arc':
          aValue = a.benchmarks.arc;
          bValue = b.benchmarks.arc;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = Number(aValue);
      const numB = Number(bValue);
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

    return filtered;
  }, [models, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <Card className="border border-slate-200 bg-white p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Model Leaderboard
          </h3>
          <Input
            placeholder="Search by model name or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border-slate-300 focus:bg-white focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-purple-600"
                  >
                    Model
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('parameters')}
                    className="flex items-center gap-2 hover:text-purple-600"
                  >
                    Parameters
                    <SortIcon field="parameters" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('average')}
                    className="flex items-center gap-2 hover:text-purple-600"
                  >
                    Average Score
                    <SortIcon field="average" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('mmlu')}
                    className="flex items-center gap-2 hover:text-purple-600"
                  >
                    MMLU
                    <SortIcon field="mmlu" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('arc')}
                    className="flex items-center gap-2 hover:text-purple-600"
                  >
                    ARC
                    <SortIcon field="arc" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  License
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedModels.map((model) => (
                <tr
                  key={model.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-xs text-gray-500">{model.organization}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {(model.parameters / 1e9).toFixed(1)}B
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-semibold text-sm">
                      {model.benchmarks.average.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {model.benchmarks.mmlu.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {model.benchmarks.arc.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs bg-slate-100 text-gray-700 rounded">
                      {model.license}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Showing {filteredAndSortedModels.length} of {models.length} models
        </div>
      </div>
    </Card>
  );
}
