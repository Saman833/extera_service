import OpenAIClient from "./openai.client";

/**
 * AI Factory - Creates the appropriate AI client based on the model type
 */
class AIFactory {
    /**
     * Create an AI client based on the model type
     * @param aiModel - The AI model type (e.g., "OPENAI", "ANTHROPIC", etc.)
     * @returns The appropriate AI client
     */
    async createAI(aiModel: string): Promise<any> {
        const modelType = aiModel.toUpperCase();
        
        switch (modelType) {
            case 'OPENAI':
                return new OpenAIClient({});
            
            case 'ANTHROPIC':
                throw new Error('Anthropic client not yet implemented');
            
            case 'GOOGLE':
                throw new Error('Google AI client not yet implemented');
            
            default:
                throw new Error(`Unsupported AI model: ${aiModel}`);
        }
    }
}

export default AIFactory;

