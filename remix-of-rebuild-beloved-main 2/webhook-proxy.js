const WEBHOOK_URLS = [
  "https://n8n.srv1384444.hstgr.cloud/webhook/8a08171d-2ed5-4bbe-a6f0-3340d7d9f6df",
  "https://n8n.srv1384444.hstgr.cloud/webhook/4adf7a65-805e-4080-a47c-686a79b7a4eb",
  "https://n8n.srv1384444.hstgr.cloud/webhook/c82dc7e3-34c0-43b9-9133-a0664d37e5dd",
  "https://n8n.srv1384444.hstgr.cloud/webhook/e186c33b-1a27-42de-9212-f239ee88a090",
  "https://n8n.srv1384444.hstgr.cloud/webhook/2dced375-7318-42ac-8b41-619fdbc16a83",
  "https://n8n.srv1384444.hstgr.cloud/webhook/63e92cee-7a4f-4f95-a7a9-88fc28693456",
  "https://n8n.srv1384444.hstgr.cloud/webhook/0f2b3603-7cb4-430a-af80-d8eef06b0136",
  "https://n8n.srv1384444.hstgr.cloud/webhook/8b2b23f5-7219-4d7c-bbac-c2abf57c7c27",
  "https://n8n.srv1384444.hstgr.cloud/webhook/d6e4147d-2e6a-4ad1-a600-cb69640930e8",
];

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "ok" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body);
    const results = await Promise.allSettled(
      WEBHOOK_URLS.map(async (url) => {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        return { url, status: response.status, ok: response.ok };
      })
    );

    const summary = results.map((r, i) => ({
      webhook: i + 1,
      ...(r.status === "fulfilled"
        ? { status: r.value.status, ok: r.value.ok }
        : { error: r.reason?.message ?? "Unknown error" }),
    }));

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, total: WEBHOOK_URLS.length, results: summary }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
