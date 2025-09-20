import { Router } from 'express';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const router = Router();

const recommendationOutputFormat = {
  type: SchemaType.OBJECT,
  properties: {
    recommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          provider: { type: SchemaType.STRING },
          confidence: { type: SchemaType.NUMBER },
          costSavings: { type: SchemaType.NUMBER },
          performanceGain: { type: SchemaType.NUMBER },
          migrationTime: { type: SchemaType.STRING },
          reasoning: { type: SchemaType.STRING },
          estimatedDowntime: { type: SchemaType.STRING }
        },
        required: ['id','title','provider','confidence','costSavings','performanceGain','migrationTime','reasoning']
      }
    }
  },
  required: ['recommendations']
};

function buildPrompt(workload: string, optimizationType: string) {
  return `You are an expert multi-cloud optimization assistant.
Generate 3 actionable recommendations in JSON only (no extra commentary) for the workload: ${workload}.
Primary objective: ${optimizationType}.
Allowed providers: aws, gcp, azure.
Each recommendation must include: id (short slug), title, provider, confidence (0-100), costSavings (monthly USD estimate), performanceGain (percentage, can be negative), migrationTime (short string), reasoning (1 sentence), estimatedDowntime (short string).
Return ONLY valid JSON object with shape {"recommendations": [...]}.
Ensure numbers are raw numbers (no % or $ in values except inside reasoning).`;
}

router.post('/recommendations', async (req, res) => {
  try {
    const { workload = 'web-app-frontend', optimizationType = 'cost' } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = buildPrompt(workload, optimizationType);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed: any;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse Gemini output', raw: text });
    }

    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      return res.status(500).json({ error: 'Invalid structure from Gemini', raw: parsed });
    }

    const recommendations = parsed.recommendations.slice(0,3).map((r: any, idx: number) => ({
      id: r.id || `rec-${idx+1}`,
      title: r.title || 'Untitled Recommendation',
      provider: ['aws','gcp','azure'].includes((r.provider||'').toLowerCase()) ? r.provider.toLowerCase() : 'aws',
      confidence: typeof r.confidence === 'number' ? Math.min(Math.max(r.confidence,0),100) : 70,
      costSavings: typeof r.costSavings === 'number' ? r.costSavings : 0,
      performanceGain: typeof r.performanceGain === 'number' ? r.performanceGain : 0,
      migrationTime: r.migrationTime || '1-2 hours',
      reasoning: r.reasoning || 'No reasoning provided',
      estimatedDowntime: r.estimatedDowntime || 'Unknown'
    }));

    return res.json({ workload, optimizationType, recommendations, source: 'gemini' });
  } catch (error: any) {
    console.error('[gemini] error', error);
    return res.status(500).json({ error: 'Gemini request failed', details: error?.message });
  }
});

export { router as geminiRouter };
