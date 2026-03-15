import { GoogleGenerativeAI } from '@google/generative-ai';

interface LeaderboardModel {
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

interface RecommendationRequest {
  taskDescription: string;
  taskSizeMultiplier: number;
}

interface RecommendationResponse {
  relevantBenchmarks: string[];
  reasoningDescription: string;
  recommendedModels: Array<
    LeaderboardModel & {
      score: number;
      reasoning: string;
    }
  >;
}

// Load leaderboard data
async function loadLeaderboard(): Promise<LeaderboardModel[]> {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/open-llm-leaderboard/open_llm_leaderboard/main/src/data/about.json'
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch {
    console.log('Failed to fetch from GitHub, using local fallback');
  }

  // Fallback to local data - try models.json first, then leaderboard.json
  try {
    const fs = await import('fs');
    const path = await import('path');
    let filePath = path.join(
      process.cwd(),
      'public/data/models.json'
    );
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      // Try legacy leaderboard.json
      filePath = path.join(
        process.cwd(),
        'public/data/leaderboard.json'
      );
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    console.log('Using embedded fallback data');
    return getEmbeddedLeaderboard();
  }
}

function getEmbeddedLeaderboard(): LeaderboardModel[] {
  return [
    {
      id: "meta-llama/Llama-3.1-70B",
      name: "Llama-3.1-70B",
      organization: "meta-llama",
      fullName: "meta-llama/Llama-3.1-70B",
      parameters: 70000000000,
      architecture: "Transformer",
      license: "Llama 2 Community License",
      benchmarks: {
        mmlu: 85.2,
        arc: 88.5,
        truthfulqa: 76.3,
        gsm8k: 89.2,
        hellaswag: 87.1,
        winogrande: 82.5,
        average: 84.8,
      },
    },
    {
      id: "meta-llama/Llama-3-70B",
      name: "Llama-3-70B",
      organization: "meta-llama",
      fullName: "meta-llama/Llama-3-70B",
      parameters: 70000000000,
      architecture: "Transformer",
      license: "Llama 2 Community License",
      benchmarks: {
        mmlu: 82.0,
        arc: 87.1,
        truthfulqa: 74.2,
        gsm8k: 86.5,
        hellaswag: 85.2,
        winogrande: 80.1,
        average: 82.5,
      },
    },
    {
      id: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      name: "Nous-Hermes-2-Mixtral-8x7B-DPO",
      organization: "NousResearch",
      fullName: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      parameters: 46700000000,
      architecture: "Mixtral MoE",
      license: "MIT",
      benchmarks: {
        mmlu: 78.9,
        arc: 85.3,
        truthfulqa: 72.1,
        gsm8k: 84.2,
        hellaswag: 83.5,
        winogrande: 79.8,
        average: 80.6,
      },
    },
  ];
}

async function getBenchmarkRecommendations(
  taskDescription: string
): Promise<{ benchmarks: string[]; reasoning: string }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    // If no API key, use rule-based recommendations
    return getRuleBasedBenchmarks(taskDescription);
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Given this task description: "${taskDescription}"

Analyze which of these benchmarks are most relevant for evaluating model performance on this task:
- MMLU (Common sense reasoning and general knowledge)
- ARC (Multiple choice science questions)
- TruthfulQA (Factual accuracy and hallucination resistance)
- GSM8K (Math problem solving)
- HellaSwag (Common sense reasoning about commonsense)
- Winogrande (Coreference resolution and understanding)

Return ONLY a JSON object in this format:
{
  "benchmarks": ["BENCHMARK_NAME", ...],
  "reasoning": "Brief explanation of why these benchmarks are relevant"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        benchmarks: parsed.benchmarks || ['mmlu', 'average'],
        reasoning:
          parsed.reasoning ||
          'Selected benchmarks based on task analysis',
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
  }

  return getRuleBasedBenchmarks(taskDescription);
}

function getRuleBasedBenchmarks(
  taskDescription: string
): { benchmarks: string[]; reasoning: string } {
  const lower = taskDescription.toLowerCase();

  if (
    lower.includes('math') ||
    lower.includes('calculate') ||
    lower.includes('arithmetic')
  ) {
    return {
      benchmarks: ['gsm8k', 'mmlu', 'average'],
      reasoning: 'Task focuses on mathematical reasoning',
    };
  }

  if (
    lower.includes('fact') ||
    lower.includes('knowledge') ||
    lower.includes('question')
  ) {
    return {
      benchmarks: ['mmlu', 'truthfulqa', 'arc', 'average'],
      reasoning: 'Task requires factual knowledge and accuracy',
    };
  }

  if (
    lower.includes('understand') ||
    lower.includes('reference') ||
    lower.includes('pronoun')
  ) {
    return {
      benchmarks: ['winogrande', 'hellaswag', 'average'],
      reasoning: 'Task involves understanding and coreference resolution',
    };
  }

  if (
    lower.includes('science') ||
    lower.includes('explain') ||
    lower.includes('reason')
  ) {
    return {
      benchmarks: ['arc', 'mmlu', 'average'],
      reasoning: 'Task requires scientific reasoning and explanation',
    };
  }

  return {
    benchmarks: ['mmlu', 'average'],
    reasoning: 'General language understanding benchmarks selected',
  };
}

function scoreModelForTask(
  model: LeaderboardModel,
  benchmarks: string[],
  taskSizeMultiplier: number
): { score: number; reasoning: string } {
  let score = 0;
  let benchmarkScores: number[] = [];

  benchmarks.forEach((bench) => {
    const benchKey = bench.toLowerCase() as keyof typeof model.benchmarks;
    if (benchKey in model.benchmarks) {
      benchmarkScores.push(model.benchmarks[benchKey]);
    }
  });

  if (benchmarkScores.length > 0) {
    score =
      benchmarkScores.reduce((a, b) => a + b, 0) /
      benchmarkScores.length;
  }

  // Adjust for task size
  const paramInBillions = model.parameters / 1000000000;
  let sizeBonus = 0;

  if (taskSizeMultiplier < 1.3) {
    // Small tasks benefit from smaller models (better efficiency)
    sizeBonus = Math.max(0, 10 - paramInBillions * 0.05);
  } else if (taskSizeMultiplier > 2) {
    // Large tasks benefit from larger models
    sizeBonus = Math.min(10, paramInBillions * 0.05);
  }

  score += sizeBonus;

  const reasoning = `Scored ${score.toFixed(1)}/100 based on ${benchmarks.join(', ')} benchmarks${
    sizeBonus !== 0 ? ` with ${sizeBonus > 0 ? '+' : ''}${sizeBonus.toFixed(1)} size adjustment` : ''
  }`;

  return { score, reasoning };
}

export async function POST(request: Request) {
  try {
    const body: RecommendationRequest = await request.json();
    const { taskDescription, taskSizeMultiplier } = body;

    if (!taskDescription || !taskDescription.trim()) {
      return Response.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }

    // Get relevant benchmarks
    const { benchmarks, reasoning: benchmarkReasoning } =
      await getBenchmarkRecommendations(taskDescription);

    // Load leaderboard
    const models = await loadLeaderboard();

    // Score and rank models
    const scoredModels = models.map((model) => {
      const { score, reasoning } = scoreModelForTask(
        model,
        benchmarks,
        taskSizeMultiplier
      );
      return {
        ...model,
        score,
        reasoning,
      };
    });

    // Sort by score and return top 5
    const topModels = scoredModels
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const response: RecommendationResponse = {
      relevantBenchmarks: benchmarks,
      reasoningDescription: benchmarkReasoning,
      recommendedModels: topModels,
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error in recommendation API:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
