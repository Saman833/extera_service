import { Request, Response } from 'express';
import transcriptAnalyzeService from './service';

class TranscriptAnalyzeController {
    async analyze(req: Request, res: Response): Promise<void> {
        try {
            const { agent_name, transcript, ...agentRequest } = req.body;
            
            if (!agent_name) {
                res.status(400).json({ success: false, error: 'agent_name is required' });
                return;
            }
            
            if (!transcript) {
                res.status(400).json({ success: false, error: 'transcript is required' });
                return;
            }
            
            const result = await transcriptAnalyzeService.analyze(agent_name, transcript, agentRequest);
            res.json({ success: true, data: result });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ success: false, error: message });
        }
    }
}

export default new TranscriptAnalyzeController();

