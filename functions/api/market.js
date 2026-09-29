export async function onRequestGet(context) {
  const apiKey = context.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "TWELVE_DATA_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const url = new URL(context.request.url);
  const symbol = url.searchParams.get("symbol") || "RELIANCE:NSE";

  const api = new URL("https://api.twelvedata.com/quote");
  api.searchParams.set("symbol", symbol);
  api.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(api.toString());
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return Response.json(
        { error: data.message || "Market data request failed." },
        { status: 502 }
      );
    }

    return Response.json({
      symbol: data.symbol,
      name: data.name,
      exchange: data.exchange,
      price: data.close,
      change: data.change,
      percent_change: data.percent_change,
      timestamp: data.timestamp,
      source: "Twelve Data"
    });
  } catch (error) {
    return Response.json(
      { error: "Unable to reach market data provider." },
      { status: 502 }
    );
  }
}
