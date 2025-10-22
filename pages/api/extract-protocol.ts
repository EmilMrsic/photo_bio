import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import OpenAIClient from 'openai';
import pdf from 'pdf-parse';

// Disable Next.js body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

  const openai = new OpenAIClient({
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
const neuroradiantDefinitions = JSON.parse(
  fs.readFileSync(path.join(protocolLogicPath, 'neuroradiant_definitions.json'), 'utf-8')
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

    // Optional helmet type (light | neuroradiant1070)
    const userHelmetType = Array.isArray(fields.helmetType)
      ? fields.helmetType[0]
      : fields.helmetType;
    const helmetType = typeof userHelmetType === 'string' ? userHelmetType : 'light';

    // Require explicit consent
    const consentField = Array.isArray(fields.consent) ? fields.consent[0] : fields.consent;
    const consent = typeof consentField === 'string' ? consentField.toLowerCase() : consentField;
    if (!consent || (consent !== 'true' && consent !== 'on' && consent !== '1')) {
      return res.status(400).json({
        ok: false,
        error_code: 'CONSENT_REQUIRED',
        message: 'Consent is required: I have removed the name of the patient from this PDF.',
      });
    }

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
From the PDF extract a condition and the FIRST protocol number from the Eyes Open Brain Map section.

Rules:
1. Temperature 0
2. Do not guess
3. Output JSON only
4. Stable key order
5. CRITICAL: Protocol index MUST be between 1 and 24 inclusive
6. IGNORE page numbers, dates, and any numbers outside the protocol table

PDF extraction steps:
1. Find the section titled "Protocols from Eyes Open Brain Map" (usually on page 10)
2. Look for the table with header "Possible Two Channel Protocols"
3. Find the "Protocol #" column in this table
4. Extract ONLY the FIRST number from the "Protocol #" column
5. This number MUST be a single or double digit between 1-24
6. If you see numbers like 42, 638, etc., those are NOT protocol numbers - keep looking
7. Protocol numbers in brain maps are typically: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, or 24

Example protocol table format:
Protocol #    Left Protocol         Right Protocol        Sites
4             2-7d 15-18u          2-7d 13-15u          F3/F4
18            9-11d 15-20u         15-20d 9-11u         P3/P4

In this example: Extract "4" (the FIRST protocol number)

Condition extraction:
Parse a condition string that must match EXACTLY one of these: MEMORY, FOCUS, ANXIETY, DEPRESSION, SLEEP, HEAD INJURY, PEAK PERFORMANCE, OCD, CHRONIC PAIN, SPECTRUM, HEADACHE, STROKE, CHRONIC FATIGUE, ADDICTIONS

Output schema (JSON only, no markdown):
{
  "condition": "<UPPERCASE_CONDITION>",
  "index": <integer 1-24>
}

PDF TEXT:
${pdfText}

EXAMPLE OUTPUT:
{"condition":"DEPRESSION","index":4}`;

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

    const isNeuroradiant = helmetType === 'neuroradiant1070';
    let phases = protocolDefinitions[String(protocolId)] || [];
    let nrPayload: any = null;
    if (isNeuroradiant) {
      const def = neuroradiantDefinitions[String(protocolId)];
      if (def) {
        nrPayload = {
          protocol_id: protocolId,
          cycles: def.cycles,
          steps: def.steps,
        };
      }
    }

    console.log('✅ SUCCESS! Returning Protocol ID:', protocolId);
    console.log('   Number of phases:', phases.length);
    console.log('═══════════════════════════════════════════════');

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    // Return success JSON
    return res.status(200).json(
      isNeuroradiant
        ? {
            ok: true,
            condition,
            index,
            protocol_id: protocolId,
            phases,
            helmet_type: helmetType,
            neuroradiant: nrPayload,
          }
        : {
            ok: true,
            condition,
            index,
            protocol_id: protocolId,
            phases,
            helmet_type: helmetType,
          }
    );

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
