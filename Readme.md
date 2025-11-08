# Extera Service

A modular Node.js TypeScript service that uses AI agents to analyze and process transcripts.

## 💡 General Idea

This service provides a flexible AI agent architecture where you can:
- Define multiple AI agents with different configurations (models, prompts, schemas)
- Send transcripts (conversations) to these agents for analysis
- Get AI-powered insights, summaries, or any custom processing based on the agent's purpose

Think of it as a **plug-and-play AI agent system** - you configure agents in JSON files, and the service handles all the communication with AI providers (OpenAI, etc.).

## 🏗️ How It Works

### Architecture Flow

```
User Request → Controller → Service → Agent Service → AI Factory → OpenAI Client → GPT API
     ↓                                       ↓
  Transcript                          Load Agent Config
     ↓                               (instruction, schema, examples)
JSON format                                  ↓
                                      Build Prompt & Execute
                                             ↓
                                    ← AI Response (Summary)
```

### Step-by-Step Process

1. **User sends a request** with:
   - `agent_name`: Which agent to use (e.g., "summarize-agent")
   - `transcript`: Array of conversation messages
   - Additional parameters (e.g., `maxLength`)

2. **Controller validates** the request and passes it to the service

3. **Service formats** the transcript into readable text:
   ```
   user: Hello, how are you?
   assistant: I am doing well!
   ```

4. **Agent Service**:
   - Loads the agent configuration from `agent-content/{agent_name}/`
   - Reads: config.json, instruction.json, input-schema.json, output-schema.json, examples.json
   - Combines everything into a complete prompt

5. **AI Factory** creates the appropriate AI client (OpenAI, Anthropic, etc.)

6. **AI Client** sends the prompt to the AI provider (GPT-4, etc.)

7. **Response** flows back through the chain to the user

## 📁 Project Structure

```
extera_service/
├── src/
│   ├── modules/
│   │   ├── agent/                    # Agent management
│   │   │   ├── agent-content/        # Agent configurations
│   │   │   │   └── summarize-agent/
│   │   │   │       ├── config.json         # AI model settings
│   │   │   │       ├── instruction.json    # Agent instructions
│   │   │   │       ├── input-schema.json   # Input validation
│   │   │   │       ├── output-schema.json  # Output format
│   │   │   │       └── examples.json       # Example data
│   │   │   ├── service.ts            # Agent logic
│   │   │   └── index.ts
│   │   ├── ai-model/                 # AI provider integrations
│   │   │   ├── factory.ts            # AI client factory
│   │   │   └── openai.client.ts      # OpenAI implementation
│   │   └── transcript-analyze/       # Transcript analysis module
│   │       ├── schema.ts             # TypeScript types
│   │       ├── service.ts            # Business logic
│   │       ├── controller.ts         # HTTP handlers
│   │       ├── routes.ts             # API routes
│   │       └── index.ts
│   └── index.ts                      # Application entry point
├── package.json
├── tsconfig.json
└── .env
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the service:
```bash
# Development mode (recommended - auto-reload)
npm run dev

# Production mode (build first, then run)
npm run build
npm start
```

## 🚀 Available API Routes

### 1. Root Endpoint
```
GET /
```
Returns a welcome message to verify the service is running.

**Response:**
```json
{
  "message": "Welcome to Extera Service"
}
```

---

### 2. Analyze Transcript
```
POST /api/transcript-analyze/analyze
```

Analyzes a transcript using a specified AI agent.

**Request Body:**
```json
{
  "agent_name": "summarize-agent",    // Required: which agent to use
  "transcript": [                      // Required: conversation messages
    {
      "role": "user",
      "content": "Hello, how are you?"
    },
    {
      "role": "assistant",
      "content": "I am doing well, thank you!"
    }
  ],
  "maxLength": 100                     // Optional: agent-specific parameters
}
```

**Response:**
```json
{
  "success": true,
  "data": "The conversation is a friendly greeting where the user asks how the assistant is doing, and the assistant responds positively."
}
```

**Available Agents:**
- `summarize-agent` - Summarizes conversations

---

## 📝 Sample Requests

### cURL (Bash/Linux/Mac)
```bash
curl -X POST http://localhost:3000/api/transcript-analyze/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "summarize-agent",
    "transcript": [
      { "role": "user", "content": "Hello, how are you?" },
      { "role": "assistant", "content": "I am doing well!" }
    ],
    "maxLength": 100
  }'
```

### PowerShell (Windows)
```powershell
# Simple one-liner
Invoke-RestMethod -Uri "http://localhost:3000/api/transcript-analyze/analyze" `
  -Method Post `
  -Body '{"agent_name":"summarize-agent","transcript":[{"role":"user","content":"Hello, how are you?"},{"role":"assistant","content":"I am doing well!"}],"maxLength":100}' `
  -ContentType "application/json"

# View the response data
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/transcript-analyze/analyze" `
  -Method Post `
  -Body '{"agent_name":"summarize-agent","transcript":[{"role":"user","content":"Hello, how are you?"},{"role":"assistant","content":"I am doing well!"}],"maxLength":100}' `
  -ContentType "application/json"

$response.data  # Shows the AI-generated summary
```

---

## 🤖 Creating Custom Agents

To create a new agent, add a folder in `src/modules/agent/agent-content/` with these files:

1. **config.json** - AI model configuration
```json
{
  "ai_model": "OPENAI",
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "max_tokens": 500
}
```

2. **instruction.json** - Agent's purpose
```json
{
  "instruction": "You are an expert at analyzing customer sentiment..."
}
```

3. **input-schema.json** - Expected input format
4. **output-schema.json** - Expected output format
5. **examples.json** - Example inputs/outputs

Then use it by setting `"agent_name": "your-agent-name"` in your request!
