import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

import { AuthenticationError, requireApiAuthentication } from '../../lib/server/auth';
import { checkRateLimit, getClientKey } from '../../lib/server/rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(getClientKey(req), {
    max: 20,
    windowMs: 60_000,
  });

  if (!rateResult.success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfterSeconds: rateResult.retryAfterSeconds,
    });
  }

  try {
    await requireApiAuthentication(req);
  } catch (error) {
    const status = error instanceof AuthenticationError ? error.statusCode : 401;
    return res.status(status).json({
      error: 'Unauthorized',
      details: error instanceof Error ? error.message : 'Missing credentials',
    });
  }

  const { input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const keywordsPrompt = `Given the following topic about photobiomodulation (PBM) therapy, generate 5-7 highly relevant SEO keywords that someone might search for. Focus on specific conditions, treatments, and benefits.\n\nTopic: "${input}"\n\nReturn ONLY a JSON array of keywords, no explanation. Example: ["photobiomodulation therapy", "red light therapy benefits", "PBM for brain health"]`;

    const keywordsResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO expert specializing in photobiomodulation and medical content. Always return valid JSON.',
        },
        {
          role: 'user',
          content: keywordsPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const keywordsText = keywordsResponse.choices[0]?.message?.content || '[]';
    let keywords: string[] = [];

    try {
      keywords = JSON.parse(keywordsText);
    } catch (e) {
      console.error('Failed to parse keywords:', keywordsText);
      keywords = [
        'photobiomodulation therapy',
        'red light therapy',
        'PBM treatment',
        'light therapy benefits',
        'non-invasive therapy',
      ];
    }

    const headlinesPrompt = `Create 5 compelling, SEO-optimized blog headlines about photobiomodulation based on this topic: "${input}"\n\nRequirements:\n- Include relevant keywords naturally\n- Make them engaging and click-worthy\n- Focus on benefits, solutions, or answering questions\n- Keep them between 50-60 characters when possible\n- Mix different headline types (how-to, listicles, questions, statements)\n\nKeywords to consider: ${keywords.join(', ')}\n\nReturn ONLY a JSON array of 5 headlines, no explanation.`;

    const headlinesResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional copywriter specializing in medical and wellness content. Create engaging, SEO-friendly headlines. Always return valid JSON.',
        },
        {
          role: 'user',
          content: headlinesPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const headlinesText = headlinesResponse.choices[0]?.message?.content || '[]';
    let headlines: string[] = [];

    try {
      headlines = JSON.parse(headlinesText);
    } catch (e) {
      console.error('Failed to parse headlines:', headlinesText);
      headlines = [
        `How Photobiomodulation Can Help With ${input}`,
        `The Science Behind PBM Therapy for ${input}`,
        `${input}: A Natural Solution with Red Light Therapy`,
        `Understanding Photobiomodulation Benefits for ${input}`,
        `Why Doctors Recommend PBM for ${input}`,
      ];
    }

    if (headlines.length > 5) {
      headlines = headlines.slice(0, 5);
    } else if (headlines.length < 5) {
      const genericHeadlines = [
        'Photobiomodulation: Your Guide to Natural Healing',
        'How Red Light Therapy Transforms Patient Outcomes',
        'The Future of Non-Invasive Treatment is Here',
        "Unlock Your Body's Natural Healing Power with PBM",
        'Evidence-Based Light Therapy for Better Health',
      ];
      headlines = [...headlines, ...genericHeadlines].slice(0, 5);
    }

    res.status(200).json({
      keywords,
      headlines,
    });
  } catch (error) {
    console.error('Error generating blog ideas:', error);
    const status = error instanceof AuthenticationError ? error.statusCode : 500;
    res.status(status).json({
      error: 'Failed to generate blog ideas',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
