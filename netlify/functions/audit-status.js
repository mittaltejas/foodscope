// Netlify function — GET /api/audit-status?id=xxx
// Frontend polls this to check on a running audit.

import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('id');

  if (!jobId) {
    return new Response(JSON.stringify({ error: 'Missing job ID' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const store = getStore('foodscope-audits');
    const job = await store.get(jobId, { type: 'json' });

    if (!job) {
      // Job not yet written — still starting up
      return new Response(JSON.stringify({ status: 'pending' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(job), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    // Blob doesn't exist yet — still pending
    return new Response(JSON.stringify({ status: 'pending' }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/audit-status'
};
