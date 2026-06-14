export default async function handler(req, res) {
  // Allow CORS from your own domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });

  const { endpoint } = req.query;
  const urls = {
    gainers:  `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${key}`,
    news:     `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=earnings,ipo,mergers_and_acquisitions,financial_markets,economy_fiscal,economy_monetary&sort=RELEVANCE&limit=30&apikey=${key}`,
    sector:   `https://www.alphavantage.co/query?function=SECTOR&apikey=${key}`,
  };

  const url = urls[endpoint];
  if (!url) return res.status(400).json({ error: 'Unknown endpoint' });

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Upstream fetch failed' });
  }
}
