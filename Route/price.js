const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ── POST /api/price/predict ───────────────────────────────────────────────
router.post('/predictp', async (req, res) => {
    const { grade } = req.body;

    if (!grade || grade.trim() === '') {
        return res.status(400).json({ message: 'Tea grade is required' });
    }

    const gradeUpper = grade.trim().toUpperCase();

    const prompt = `
You are an expert in Sri Lankan Ceylon tea auction markets with deep knowledge of the 
Colombo Tea Auction — the largest tea auction in the world.

A user wants to know the current auction price and market analysis for the following 
Ceylon tea grade: "${gradeUpper}"

Please respond in the following strict JSON format only, with no extra text outside the JSON:

{
  "grade": "${gradeUpper}",
  "valid": true or false (false if this is not a real Ceylon tea grade),
  "price_range": {
    "min": number (LKR per kg, realistic estimate),
    "max": number (LKR per kg, realistic estimate),
    "currency": "LKR",
    "unit": "per kg"
  },
  "average_price": number (LKR per kg),
  "usd_equivalent": {
    "min": number (USD per kg),
    "max": number (USD per kg)
  },
  "market_analysis": "2-3 sentences explaining current market conditions for this grade, demand trends, and what affects pricing",
  "recommendation": "1-2 sentences of actionable advice for a tea producer or buyer dealing with this grade",
  "grade_info": "1 sentence describing what this grade is",
  "demand_level": "High" or "Medium" or "Low",
  "price_trend": "Rising" or "Stable" or "Declining",
  "last_auction_note": "Brief note about recent Colombo auction activity for this grade"
}

Base your estimates on recent Colombo Tea Auction data and Ceylon tea market knowledge.
If the grade is not valid or unrecognized, set valid to false and fill other fields with null.
`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Ceylon tea market expert. Always respond with valid JSON only, no markdown, no code blocks, no extra text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,       // low temperature for more consistent pricing
            max_tokens: 600,
        });

        const raw = completion.choices[0].message.content.trim();

        // Strip markdown code fences if model adds them despite instructions
        const cleaned = raw
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            return res.status(500).json({
                message: 'Failed to parse AI response',
                raw: cleaned
            });
        }

        res.json(parsed);

    } catch (err) {
        console.error('OpenAI error:', err.message);
        res.status(500).json({
            message: 'AI service error',
            error: err.message
        });
    }
});

module.exports = router;