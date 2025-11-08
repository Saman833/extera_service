import AIFactory from "../ai-model/ai.factory";
import * as fs from 'fs';
import * as path from 'path';

class AgentService {
    private agentContentPath: string;

    constructor() {
        this.agentContentPath = path.join(__dirname, 'agent-content');
    }
    
    async prepare_agent_data(agent_name: string , agent_request : object) {
        const agentPath = path.join(this.agentContentPath, agent_name);
        
        // Check if agent exists
        if (!fs.existsSync(agentPath)) {
            throw new Error(`Agent '${agent_name}' not found`);
        }

        try {
            // Load all agent configuration files
            const config = this.loadJsonFile(path.join(agentPath, 'config.json'));
            const instruction = this.loadJsonFile(path.join(agentPath, 'instruction.json'));
            const inputSchema = this.loadJsonFile(path.join(agentPath, 'input-schema.json'));
            const outputSchema = this.loadJsonFile(path.join(agentPath, 'output-schema.json'));
            const examples = this.loadJsonFile(path.join(agentPath, 'examples.json'));

            // Build the complete agent data object
            const agentData = {
                name: agent_name,
                config: config,
                instruction: instruction.instruction,
                inputSchema: inputSchema,
                outputSchema: outputSchema,
                examples: examples,
                input: agent_request  // Replace input with the agent request
            };

            return agentData;
        } catch (error) {
            throw new Error(`Failed to load agent configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async run_agent(agent_name: string, agent_request: object): Promise<any> {
        try {
            const agent_data = await this.prepare_agent_data(agent_name, agent_request);
            const ai_factory = new AIFactory();
            const agent = await ai_factory.createAI(agent_data.config.ai_model);
            
            // Build the complete prompt
            const request_prompt = `${agent_data.instruction}\n\nInput Schema: ${JSON.stringify(agent_data.inputSchema, null, 2)}\n\nOutput Schema: ${JSON.stringify(agent_data.outputSchema, null, 2)}\n\nExamples: ${JSON.stringify(agent_data.examples, null, 2)}\n\nInput: ${JSON.stringify(agent_data.input, null, 2)}`;
            
            // Run the agent with config
            const result = await agent.run(request_prompt, agent_data.config);
            return result;
        } catch (error) {
            throw new Error(`Failed to run agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    private loadJsonFile(filePath: string): any {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }
            
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            
            if (!fileContent || fileContent.trim() === '') {
                throw new Error(`File is empty: ${filePath}`);
            }
            
            return JSON.parse(fileContent);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`Invalid JSON in file ${filePath}: ${error.message}`);
            }
            throw error;
        }
    }
}

export default new AgentService();