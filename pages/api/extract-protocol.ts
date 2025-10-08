import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

// Disable Next.js body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load protocol logic files
const protocolLogicPath = path.join(process.cwd(), 'protocol-logic');
const protocolRouter = JSON.parse(
  fs.readFileSync(path.join(protocolLogicPath, 'protocol_router.json'), 'utf-8')
);
const protocolDefinitions = JSON.parse(
  fs.readFileSync(path.join(protocolLogicPath, 'protocol_definitions.json'), 'utf-8')
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    // Get the user-selected condition from form fields
    const userSelectedCondition = Array.isArray(fields.condition)
      ? fields.condition[0]
      : fields.condition;

    if (!file) {
      return res.status(400).json({
        ok: false,
        error_code: 'NO_FILE',
        message: 'No file uploaded',
        detail: { condition: null, index: null, missing: 'file' }
      });
    }

    // Read and parse PDF
    const fileContent = fs.readFileSync(file.filepath);
    const pdfData = await pdf(fileContent);
    const pdfText = pdfData.text;

    console.log('PDF parsed, total pages:', pdfData.numpages);

    // Updated prompt for ChatGPT
    const prompt = `You are a deterministic resolver that reads a neurofeedback PDF and extracts condition and protocol index.

Goal:
From the PDF extract a condition and a number between 1 and 24 from the Eyes Open Brain Map section.

Rules:
1. Temperature 0
2. Do not guess
3. Output JSON only
4. Stable key order

PDF extraction:
1. Find the Eyes Open Brain Map section on page 10
2. Parse a single integer 1 through 24 from the "Protocol #" column
3. Parse a condition string that must match one of these: MEMORY, FOCUS, ANXIETY, DEPRESSION, SLEEP, HEAD INJURY, PEAK PERFORMANCE, OCD, CHRONIC PAIN, SPECTRUM, HEADACHE, STROKE, CHRONIC FATIGUE, ADDICTIONS

Output schema (JSON only, no markdown):
{
  "condition": "<UPPERCASE_CONDITION>",
  "index": <integer 1-24>
}

PDF TEXT:
${pdfText}

EXAMPLE OUTPUT:
{"condition":"DEPRESSION","index":8}`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
      temperature: 0,
    });

    const responseText = response.choices[0].message.content?.trim();
    console.log('OpenAI response:', responseText);

    if (!responseText) {
      return res.status(500).json({
        ok: false,
        error_code: 'NO_RESPONSE',
        message: 'OpenAI returned empty response',
        detail: { condition: null, index: null, missing: 'openai_response' }
      });
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    const pdfCondition = String(parsed.condition || '').toUpperCase().trim();
    const index = parseInt(parsed.index, 10);

    // Use user-selected condition if provided, otherwise use PDF condition
    const condition = userSelectedCondition
      ? String(userSelectedCondition).toUpperCase().trim()
      : pdfCondition;

    console.log('═══════════════════════════════════════════════');
    console.log('📋 PROTOCOL EXTRACTION RESULTS:');
    console.log('═══════════════════════════════════════════════');
    console.log('Raw OpenAI Response:', responseText);
    console.log('PDF Condition (from OpenAI):', pdfCondition);
    console.log('User Selected Condition:', userSelectedCondition || 'NONE');
    console.log('FINAL Condition (being used):', condition);
    console.log('Parsed Index:', index);
    console.log('═══════════════════════════════════════════════');

    // Validate extraction
    if (!condition || !protocolRouter[condition]) {
      console.error('❌ INVALID CONDITION:', condition);
      return res.status(400).json({
        ok: false,
        error_code: 'INVALID_CONDITION',
        message: `Condition "${condition}" not found in protocol router`,
        detail: { condition: parsed.condition, index: parsed.index, missing: 'valid_condition' }
      });
    }

    if (isNaN(index) || index < 1 || index > 24) {
      console.error('❌ INVALID INDEX:', index);
      return res.status(400).json({
        ok: false,
        error_code: 'INVALID_INDEX',
        message: `Index must be between 1 and 24, got: ${index}`,
        detail: { condition, index: parsed.index, missing: 'valid_index' }
      });
    }

    // Resolution algorithm
    const protocolId = protocolRouter[condition][String(index)];
    console.log('🔍 PROTOCOL LOOKUP:');
    console.log(`   Condition: ${condition}`);
    console.log(`   Index: ${index}`);
    console.log(`   Protocol ID: ${protocolId}`);
    console.log(`   Mapping: protocolRouter["${condition}"]["${index}"] = ${protocolId}`);
    console.log('═══════════════════════════════════════════════');

    if (protocolId === undefined) {
      console.error('❌ PROTOCOL NOT FOUND');
      return res.status(400).json({
        ok: false,
        error_code: 'PROTOCOL_NOT_FOUND',
        message: `No protocol found for ${condition} index ${index}`,
        detail: { condition, index, missing: 'protocol_mapping' }
      });
    }

    const phases = protocolDefinitions[String(protocolId)] || [];
    console.log('✅ SUCCESS! Returning Protocol ID:', protocolId);
    console.log('   Number of phases:', phases.length);
    console.log('═══════════════════════════════════════════════');

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    // Return success JSON
    return res.status(200).json({
      ok: true,
      condition,
      index,
      protocol_id: protocolId,
      phases
    });

  } catch (error) {
    console.error('Error extracting protocol:', error);
    return res.status(500).json({
      ok: false,
      error_code: 'SERVER_ERROR',
      message: 'Failed to extract protocol',
      detail: {
        condition: null,
        index: null,
        missing: error instanceof Error ? error.message : 'unknown_error'
      }
    });
  }
}
