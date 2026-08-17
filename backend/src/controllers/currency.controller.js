import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Using exchangerate.host because it offers free, no-key rate lookup.
export const getExchangeRate = asyncHandler(async (req, res) => {
  const from = req.query.from || 'GHS';
  const to = req.query.to || 'NGN';
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(to)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const rate = payload?.rates?.[to];

    if (typeof rate !== 'number') {
      throw new Error('Invalid exchange rate response');
    }

    return res.json({
      success: true,
      data: {
        from,
        to,
        rate,
        date: payload.date || new Date().toISOString(),
        fallback: false,
      },
    });
  } catch (error) {
    const fallbackRate = 900;
    return res.json({
      success: true,
      data: {
        from,
        to,
        rate: fallbackRate,
        date: new Date().toISOString(),
        fallback: true,
      },
      message: 'Using fallback exchange rate.',
    });
  }
});
