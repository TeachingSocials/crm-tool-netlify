import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WEBHOOK_URLS = [
  "https://hook.eu1.make.com/qhdd5jvh7q425jjuuu2inpqfla1svvh8",
  "https://hook.eu1.make.com/ked0wpmencap6afbn97ofv4ouzgqlrjz",
  "https://hook.eu1.make.com/hr4neagwrtzpgqo990pwh95a3cyi18fd",
  "https://hook.eu1.make.com/c8g8vmm8eaac20b9x392c4rpramdg03z",
  "https://hook.eu1.make.com/rda1wy0c4e1nujnv5i1xccqi6sfqxxfh",
  "https://hook.eu1.make.com/5g4zu1tdgwshfo5ruefo2dd1aegnk8rn",
  "https://hook.eu1.make.com/t76xqvhbq6s8qgny6pce2hxnopw44agr",
  "https://hook.eu1.make.com/8dg67w11xb5azf1argcoiinictimlj8o",
  "https://hook.eu1.make.com/37g47c1yz5l89jh1bhbv84frfl4xt52o",
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
