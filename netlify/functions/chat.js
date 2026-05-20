// Netlify function — POST /api/chat
// Scenario mode chat. Sync function — Haiku responses are fast enough.

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { messages, audit, formData } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const brand = formData?.brand_name || 'Unknown concept';
    const cuisine = formData?.cuisine || '';
    const svcMode = formData?.service_mode || '';
    const daypart = formData?.daypart || '';
    const units = formData?.unit_count || '';
    const ticket = formData?.ticket_band || '';
    const priceTier = formData?.price_tier || '';

    const systemCtx = `You are a senior QSR strategy consultant. The operator has just run a brand audit on their concept and is now stress-testing strategic decisions.

CONCEPT: ${brand}
CUISINE: ${cuisine} | SERVICE: ${svcMode} | DAYPART: ${daypart}
UNITS: ${units} | TICKET: ${ticket} | TIER: ${priceTier}

FULL AUDIT:
${JSON.stringify(audit)}

ALL FORM DATA:
${JSON.stringify(formData)}

Be direct, specific, and honest. Use the audit data as your foundation. Every recommendation must be calibrated to this brand's actual unit count, market, operating model, and constraints.

Use real QSR vocabulary: AUV, 4-wall EBITDA, throughput, daypart, drive-thru stacking, LTO cadence, franchise ADA, development agreement, ghost kitchen, off-premise mix, loyalty program CAC, trade area, co-tenancy, inline vs endcap vs pad site, labor as % of sales, COGS.

Avoid generic advice. Give the sharp, practitioner answer a multi-unit franchisee or brand team would actually respect. Keep responses to 2-4 focused paragraphs — dense, not padded.

Use **bold** for key terms or numbers that matter.`;

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1400,
        system: systemCtx,
        messages: messages
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return new Response(JSON.stringify({ error: 'Anthropic API error', detail: errText.slice(0, 200) }), {
        status: 502, headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await apiRes.json();
    const reply = data.content[0].text;

    return new Response(JSON.stringify({ reply }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Chat failed',
      message: err.message || 'Unknown error'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const config = {
  path: '/api/chat'
};
