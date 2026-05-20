// Netlify Background Function — POST /api/audit-start
// Client generates the jobId and fires this without waiting.
// Filename ends in -background so Netlify gives it up to 15 minutes.
// Stores result in Netlify Blobs so audit-status can retrieve it.

import { getStore } from "@netlify/blobs";

function buildPrompt(f) {
  const brand      = f.brand_name      || 'Unknown brand';
  const cuisine    = f.cuisine         || 'Not specified';
  const units      = f.unit_count      || 'Not specified';
  const geoReach   = f.geo_reach       || 'Not specified';
  const reFormat   = f.re_format       || 'Not specified';
  const franchPct  = f.franchise_pct   !== undefined ? f.franchise_pct + '% franchise' : 'Not specified';
  const svcMode    = f.service_mode    || 'Not specified';
  const daypart    = f.daypart         || 'Not specified';
  const ticket     = f.ticket_band     || 'Not specified';
  const offPrem    = f.offpremise_pct  !== undefined ? f.offpremise_pct + '% off-premise' : 'Not specified';
  const menuBreadth = f.menu_breadth   || 'Not specified';
  const ltoCadence = f.lto_cadence     || 'Not specified';
  const heroItem   = f.hero_item       || 'Not specified';
  const beverage   = f.beverage        || 'Not specified';
  const priceTier  = f.price_tier      || 'Not specified';
  const personality = f.personality    || 'Not specified';
  const occasion   = f.occasion        || 'Not specified';
  const brief      = f.brief           || 'Not specified';
  const hqMarket   = f.hq_market       || 'Not specified';
  const yearFounded = f.year_founded   || 'Not specified';

  const c1 = `${f.c1_name || 'Not named'} — ${f.c1_pos || ''}${f.c1_threat ? ': ' + f.c1_threat : ''}`;
  const c2 = `${f.c2_name || 'Not named'} — ${f.c2_pos || ''}${f.c2_threat ? ': ' + f.c2_threat : ''}`;
  const c3 = `${f.c3_name || 'Not named'} — ${f.c3_pos || ''}${f.c3_threat ? ': ' + f.c3_threat : ''}`;

  return `You are a senior QSR strategy consultant with 25+ years advising operators, franchisors, and private equity across fast food, fast casual, and quick-service concepts. You have deep expertise in unit economics, real estate strategy, daypart expansion, franchise development, throughput optimization, LTO strategy, and competitive positioning.

Run a rigorous, no-fluff QSR brand audit. Be ruthlessly specific — name real brands, cite real AUV benchmarks, reference real estate formats, daypart dynamics, and franchise economics. Calibrate all recommendations to this brand's actual stage, unit count, and constraints. The competitive landscape section is the core of the output.

BRAND INPUTS:
Concept: ${brand}
Founded / Planned: ${yearFounded} | HQ Market: ${hqMarket}
Cuisine: ${cuisine}
Unit Count: ${units} | Geographic Reach: ${geoReach}
Real Estate Format: ${reFormat}
Franchise / Corporate Split: ${franchPct}

SERVICE & OPERATIONS:
Primary Service Mode: ${svcMode}
Daypart Focus: ${daypart}
Average Ticket: ${ticket}
Off-Premise Mix: ${offPrem}

MENU:
Menu Breadth: ${menuBreadth}
LTO Cadence: ${ltoCadence}
Hero / Signature Item: ${heroItem}
Beverage Program: ${beverage}

POSITIONING:
Price Tier: ${priceTier}
Brand Personality: ${personality}
Primary Occasion: ${occasion}

COMPETITIVE SET:
1. ${c1}
2. ${c2}
3. ${c3}

STRATEGIC BRIEF (what the operator most wants to understand):
${brief}

Return ONLY valid JSON — no markdown fences, no preamble:
{
  "verdict": {
    "signal": "green|yellow|red",
    "headline": "sharp 8-10 word headline capturing the brand's strategic position",
    "summary": "3-5 sentences. Honest overall assessment. Biggest priorities called out directly. Calibrated to this brand's actual stage and competitive set."
  },
  "competitive": {
    "overview": "2-3 paragraphs of specific competitive landscape analysis. Name competitors. Describe daypart dynamics, AUV benchmarks relative to category, positioning clusters, and where the white space is. Use real QSR vocabulary.",
    "market_dynamics": "1 paragraph on the forces shaping competition in this specific QSR category right now — franchise growth patterns, real estate cost pressures, labor dynamics, off-premise growth, menu simplification trends, value-vs-premium shifts.",
    "competitors": [
      {
        "name": "competitor name",
        "positioning": "their actual market positioning in 1-2 sentences with QSR specifics",
        "strengths": ["specific operational or brand strength 1", "specific strength 2"],
        "weaknesses": ["specific weakness 1", "specific weakness 2"],
        "threat_level": "high|medium|low",
        "opportunity_gap": "the specific lane or daypart or positioning gap this brand can exploit against THIS competitor. Concrete and actionable."
      }
    ],
    "white_space": "the specific underserved positioning, daypart, or format territory this brand can own. Name the consumer, the occasion, and the operating model.",
    "differentiation_score": 65,
    "differentiation_rationale": "2-3 sentences explaining the score honestly using QSR primitives — throughput, AUV potential, daypart defensibility, menu focus discipline, brand clarity.",
    "vulnerabilities": ["specific competitive vulnerability 1", "specific competitive vulnerability 2", "specific competitive vulnerability 3"],
    "advantages": ["specific competitive advantage 1", "specific competitive advantage 2", "specific competitive advantage 3"],
    "competitive_moat": "what specifically makes this brand defensible long-term — labor model, throughput IP, daypart ownership, menu focus, real estate format, brand equity, franchise discipline, supply chain."
  },
  "real_estate": {
    "priority": "critical|watch|strong",
    "headline": "8-10 word headline on the real estate strategy",
    "insights": "substantive paragraph on site selection, format mix, trade area dynamics, drive-thru vs in-line vs endcap, AUV implications of current format mix, and what the real estate playbook should be given stage and market.",
    "actions": ["specific real estate action 1", "specific real estate action 2", "specific real estate action 3"]
  },
  "unit_economics": {
    "priority": "critical|watch|strong",
    "headline": "8-10 word headline on unit economics",
    "insights": "substantive paragraph on AUV trajectory, ticket size levers, throughput constraints, labor as % of sales, COGS discipline, the path to 4-wall profitability, and what the unit-level P&L looks like against category benchmarks.",
    "actions": ["specific unit economics action 1", "specific unit economics action 2", "specific unit economics action 3"]
  },
  "menu_strategy": {
    "priority": "critical|watch|strong",
    "headline": "8-10 word headline on menu strategy",
    "insights": "substantive paragraph on menu breadth vs throughput tradeoff, hero item defensibility, LTO cadence as traffic driver vs complexity cost, daypart extension opportunities, beverage attach rate, and how the menu architecture supports or undermines the unit economics.",
    "actions": ["specific menu action 1", "specific menu action 2", "specific menu action 3"]
  },
  "marketing_brand": {
    "priority": "critical|watch|strong",
    "headline": "8-10 word headline on marketing and brand",
    "insights": "substantive paragraph on brand positioning clarity, social and digital strategy against the competitive set, LTO marketing flywheel, loyalty program ROI, franchise marketing fund efficiency, and the brand-building levers available at this stage and budget.",
    "actions": ["specific marketing action 1", "specific marketing action 2", "specific marketing action 3"]
  },
  "growth_model": {
    "priority": "critical|watch|strong",
    "headline": "8-10 word headline on growth model",
    "insights": "substantive paragraph on franchise vs corporate development strategy, development agreement pace, territory selection, the AUV floor required before franchising, ghost kitchen or licensing plays, and the growth sequencing that protects brand integrity while hitting unit targets.",
    "actions": ["specific growth action 1", "specific growth action 2", "specific growth action 3"]
  }
}`;
}

export default async (req) => {
  console.log('[fs-bg] audit-start-background invoked');
  const store = getStore('foodscope-audits');
  let jobId;

  try {
    const body = await req.json();
    jobId = body.jobId;
    console.log('[fs-bg] jobId:', jobId);

    if (!jobId) {
      return new Response('Missing jobId', { status: 400 });
    }

    // Write "processing" immediately so status polling sees activity
    await store.setJSON(jobId, { status: 'processing', createdAt: Date.now() });

    const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      console.log('[fs-bg] no API key');
      await store.setJSON(jobId, { status: 'error', error: 'Server misconfiguration — API key missing' });
      return new Response('No API key', { status: 500 });
    }

    const prompt = buildPrompt(body); // body contains jobId + all FORM_DATA fields spread in
    console.log('[fs-bg] calling Anthropic for brand:', body.brand_name);

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    console.log('[fs-bg] Anthropic status:', apiRes.status);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.log('[fs-bg] Anthropic error:', errText.slice(0, 300));
      await store.setJSON(jobId, {
        status: 'error',
        error: 'Anthropic API error',
        detail: errText.slice(0, 500)
      });
      return new Response('API error', { status: 502 });
    }

    const data = await apiRes.json();
    let text = (data.content[0].text || '').trim();
    // Strip any accidental markdown fences
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    console.log('[fs-bg] parsing JSON...');
    const audit = JSON.parse(text);

    await store.setJSON(jobId, {
      status: 'complete',
      audit,
      completedAt: Date.now()
    });

    console.log('[fs-bg] DONE for jobId:', jobId);
    return new Response('OK', { status: 200 });

  } catch (err) {
    console.log('[fs-bg] error:', err.message);
    if (jobId) {
      await store.setJSON(jobId, {
        status: 'error',
        error: err.message || 'Unknown error',
        completedAt: Date.now()
      });
    }
    return new Response('Error', { status: 500 });
  }
};

export const config = {
  path: '/api/audit-start'
};
