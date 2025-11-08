import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Extera Service' });
});

// Load module routes
import transcriptAnalyzeModule from './modules/transcript-analyze';
app.use('/api/transcript-analyze', transcriptAnalyzeModule.routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

