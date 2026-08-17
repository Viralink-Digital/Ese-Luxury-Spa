import express from 'express';
import { getExchangeRate } from '../controllers/currency.controller.js';

const router = express.Router();

router.get('/rate', getExchangeRate);

export default router;
