import { TranscriptAnalyzeSchema } from "../transcript_analyze/schema";
import OpenAI from "openai";

class OpenAIClient {
    private openai: OpenAI;
    
    constructor(config: any = {}) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || config.apiKey
        });
    }
    
    /**
     * Run the agent with a prompt
     * @param prompt - The complete prompt to send to OpenAI
     * @param config - Optional configuration (model, temperature, etc.)
     */
    async run(prompt: string, config?: any): Promise<any> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: config?.model || 'gpt-4o-mini',
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: config?.temperature || 0.7,
                max_tokens: config?.max_tokens || 1000,
                top_p: config?.top_p || 1,
                frequency_penalty: config?.frequency_penalty || 0,
                presence_penalty: config?.presence_penalty || 0
            });

            return completion.choices[0].message.content;
        } catch (error) {
            throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    async sendRequest(request: object) {
        // Legacy method for compatibility
        return await this.run(JSON.stringify(request));
    }
    
    async summarizeTranscript(transcript_analyze_schema: TranscriptAnalyzeSchema) {
        const prompt = `Please summarize the following transcript:\n\n${JSON.stringify(transcript_analyze_schema)}`;
        return await this.run(prompt, { model: transcript_analyze_schema.ai_model });
    }
}

export default OpenAIClient;