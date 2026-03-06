import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Send to all webhooks in parallel
    const results = await Promise.allSettled(
      WEBHOOK_URLS.map(async (url) => {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        let data: unknown;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = { raw: text };
        }

        return { url, status: response.status, ok: response.ok, data };
      })
    );

    const summary = results.map((r, i) => ({
      webhook: i + 1,
      url: WEBHOOK_URLS[i],
      ...(r.status === "fulfilled"
        ? { status: r.value.status, ok: r.value.ok, data: r.value.data }
        : { error: r.reason?.message ?? "Unknown error" }),
    }));

    const allOk = results.every((r) => r.status === "fulfilled" && (r as PromiseFulfilledResult<{ ok: boolean }>).value.ok);

    return new Response(
      JSON.stringify({ success: allOk, total: WEBHOOK_URLS.length, results: summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook proxy error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
