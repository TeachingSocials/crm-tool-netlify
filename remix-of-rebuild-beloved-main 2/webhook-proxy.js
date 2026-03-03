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
