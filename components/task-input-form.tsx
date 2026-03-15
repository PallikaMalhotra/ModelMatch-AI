'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Spinner } from '@/components/ui/spinner';

interface TaskInputFormProps {
  onSubmit: (taskDescription: string, taskSizeMultiplier: number) => void;
  isLoading?: boolean;
}

export function TaskInputForm({
  onSubmit,
  isLoading = false,
}: TaskInputFormProps) {
  const [taskDescription, setTaskDescription] = useState('');
  const [taskSize, setTaskSize] = useState([1.5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskDescription.trim()) {
      onSubmit(taskDescription, taskSize[0]);
    }
  };

  const sizeLabels = {
    1: 'Tiny (single task)',
    1.5: 'Small (basic queries)',
    2: 'Medium (standard use)',
    2.5: 'Large (complex tasks)',
    3: 'XL (production scale)',
  };

  const getSizeLabel = (value: number) => {
    return (
      Object.entries(sizeLabels).find(([_, label]) =>
        label.includes(
          Object.values(sizeLabels)[Math.round((value - 1) * 4)]?.split('(')[1]
        )
      )?.[1] || `Task Size: ${value.toFixed(1)}x`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="task-description"
            className="block text-sm font-semibold text-gray-900"
          >
            Describe Your Task
          </label>
          <Textarea
            id="task-description"
            placeholder="E.g., 'I need a model that can understand context across long documents and answer factually accurate questions. The task involves medical literature analysis.'"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="min-h-32 resize-none bg-slate-50 border-slate-300 focus:bg-white focus:border-purple-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Be specific about what your model needs to do. Include any domain
            expertise requirements.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="task-size"
              className="block text-sm font-semibold text-gray-900"
            >
              Expected Complexity & Scale
            </label>
            <p className="text-xs text-gray-500">
              {taskSize[0] === 1 && 'Tiny (single task)'}
              {taskSize[0] === 1.5 && 'Small (basic queries)'}
              {taskSize[0] === 2 && 'Medium (standard use)'}
              {taskSize[0] === 2.5 && 'Large (complex tasks)'}
              {taskSize[0] === 3 && 'XL (production scale)'}
              {taskSize[0] !== 1 &&
                taskSize[0] !== 1.5 &&
                taskSize[0] !== 2 &&
                taskSize[0] !== 2.5 &&
                taskSize[0] !== 3 &&
                `Custom: ${taskSize[0].toFixed(1)}x`}
            </p>
          </div>
          <Slider
            id="task-size"
            min={1}
            max={3}
            step={0.1}
            value={taskSize}
            onValueChange={setTaskSize}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Smaller, efficient</span>
            <span>Larger, powerful</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!taskDescription.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Finding Best Models...
            </>
          ) : (
            'Find Best Models'
          )}
        </Button>
      </div>
    </form>
  );
}
