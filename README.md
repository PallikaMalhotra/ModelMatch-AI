# ModelMatch AI

Find the perfect open-source language model for your specific task using AI-powered analysis and Open LLM Leaderboard benchmarks.

## Features

- **AI-Powered Task Analysis**: Describe your task and ModelMatch AI uses Gemini to determine relevant benchmarks
- **Intelligent Model Matching**: Scores and ranks models based on their performance on relevant benchmarks
- **Size-Aware Recommendations**: Adjusts recommendations based on your task complexity and scale requirements
- **Open LLM Leaderboard Integration**: Uses real benchmark data from the Open LLM Leaderboard
- **Detailed Model Information**: View parameters, architecture, license, and benchmark scores for each recommended model
- **Direct HuggingFace Links**: One-click access to model repositories
- **Example Tasks**: Pre-populated example tasks to help you get started quickly
- **Benchmark Visualizations**: Interactive charts comparing models across different benchmarks
- **Searchable Leaderboard**: Browse, filter, and sort all available models
- **Developer Profile**: Direct links to developer's GitHub and LinkedIn profiles

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the project root
   - Add your Google Generative AI API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

To get a Google API key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for "Gemini API"
3. Copy and paste it into your `.env.local` file

### Running the Application

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **User Input**: You describe your task, specifying what the model needs to do
2. **Benchmark Analysis**: Gemini API analyzes your description and determines which benchmarks are most relevant
3. **Model Scoring**: Each model is scored based on performance on the identified benchmarks
4. **Size Adjustment**: Scores are adjusted based on your complexity slider preference
5. **Results**: Top 5 models are displayed with detailed information and direct links

## Benchmarks Explained

- **MMLU**: Massive Multitask Language Understanding - tests knowledge across STEM, social sciences, and humanities
- **ARC Challenge**: AI2 Reasoning Challenge - multiple choice science questions requiring complex reasoning
- **TruthfulQA**: Measures factual accuracy and tendency to hallucinate or produce misleading information
- **GSM8K**: Grade School Math - evaluates mathematical reasoning ability
- **HellaSwag**: Commonsense inference about everyday situations and activities
- **WinoGrande**: Pronoun resolution and coreference understanding - requires semantic reasoning

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: Google Generative AI (Gemini)
- **Data Source**: Open LLM Leaderboard

## Deployment

Deploy to Vercel with:

```bash
vercel deploy
```

Make sure to add your `GOOGLE_GENERATIVE_AI_API_KEY` to your Vercel project's environment variables.

## Developer

Built by **Pallika Malhotra**

- [GitHub](https://github.com/PallikaMalhotra)
- [LinkedIn](https://www.linkedin.com/in/pallika-malhotra-a9099729a/)

## License

MIT
