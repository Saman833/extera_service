import { Router } from 'express';
import controller from './controller';

const router = Router();

router.post('/analyze', controller.analyze.bind(controller));

export default router;

