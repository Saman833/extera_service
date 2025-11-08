import agentService from '../agent/service';
import { Transcript } from './schema';

class TranscriptAnalyzeService {
    async analyze(agentName: string, transcript: Transcript, agentRequest: any): Promise<any> {
        const transcriptText = this.formatTranscript(transcript);
        const request = {
            text: transcriptText,
            ...agentRequest
        };
        return await agentService.run_agent(agentName, request);
    }
    
    private formatTranscript(transcript: Transcript): string {
        return transcript.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    }
}

export default new TranscriptAnalyzeService();

