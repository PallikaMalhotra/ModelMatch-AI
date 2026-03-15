// Environment variable helper
export function getGoogleApiKey(): string | undefined {
  return process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

export function isGoogleApiKeyConfigured(): boolean {
  return !!getGoogleApiKey();
}
