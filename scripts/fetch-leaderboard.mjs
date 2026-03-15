import fs from 'fs';
import path from 'path';

/**
 * Fetches and processes the Open LLM Leaderboard data
 * Filters for models from official providers with HuggingFace availability
 */
async function fetchLeaderboard() {
  try {
    console.log('Fetching Open LLM Leaderboard data...');
    
    // Fetch from the official Open LLM Leaderboard API
    const response = await fetch('https://huggingface.co/api/datasets/open-llm-leaderboard/results/parquet');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.length} models from leaderboard`);

    // Process and filter the data
    const processedModels = data
      .filter(model => {
        // Only include non-flagged models
        return !model.flagged && model.model_name;
      })
      .map(model => ({
        id: model.model_name,
        name: model.model_name.split('/').pop(),
        organization: model.model_name.split('/')[0],
        fullName: model.model_name,
        parameters: model.params || 0,
        architecture: model.architecture || 'Unknown',
        license: model.license || 'Unknown',
        benchmarks: {
          mmlu: model.mmlu || 0,
          arc: model.arc_challenge || 0,
          truthfulqa: model.truthful_qa || 0,
          gsm8k: model.gsm8k || 0,
          hellaswag: model.hellaswag || 0,
          winogrande: model.winogrande || 0,
          average: calculateAverage([
            model.mmlu,
            model.arc_challenge,
            model.truthful_qa,
            model.gsm8k,
            model.hellaswag,
            model.winogrande,
          ]),
        },
      }))
      .sort((a, b) => b.benchmarks.average - a.benchmarks.average)
      .slice(0, 100); // Top 100 models

    // Write to public folder for easy access
    const publicDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, 'leaderboard.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedModels, null, 2));
    
    console.log(`✓ Processed and saved ${processedModels.length} models to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    process.exit(1);
  }
}

function calculateAverage(values) {
  const filtered = values.filter(v => v && !isNaN(v));
  if (filtered.length === 0) return 0;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
}

fetchLeaderboard();
