/**
 * Upstream Adapter for duanyytop/agents-radar
 * Fetches latest AI models, agents, frameworks, and research items.
 */
const https = require('https');
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'GrevixBot/1.0 (+https://grevix.org)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Parses RSS/XML feed items from feed.xml
 */
function parseRssFeed(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(block);
    const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(block);
    const descMatch = /<description>([\s\S]*?)<\/description>/i.exec(block);
    const dateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(block);

    const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    const rawDesc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').trim() : '';
    const pubDate = dateMatch ? new Date(dateMatch[1].trim()).toISOString() : new Date().toISOString();

    if (title && title.length > 5) {
      items.push({
        id: link || `agents-radar-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: title,
        summary: rawDesc.slice(0, 300),
        url: link || 'https://github.com/duanyytop/agents-radar',
        sourceName: 'Agents Radar',
        sourceRepo: 'duanyytop/agents-radar',
        category: 'AI / ML',
        publishedAt: pubDate,
        rawText: `${title}\n${rawDesc}`
      });
    }
  }
  return items;
}

/**
 * Main fetcher function
 */
async function fetchAgentsRadar() {
  try {
    const feedXmlUrl = 'https://raw.githubusercontent.com/duanyytop/agents-radar/master/feed.xml';
    const xmlContent = await fetchUrl(feedXmlUrl);
    const parsedItems = parseRssFeed(xmlContent);
    return parsedItems;
  } catch (err) {
    console.warn('[AgentsRadar Fetcher] Primary XML feed failed, trying fallback manifest:', err.message);
    try {
      const manifestUrl = 'https://raw.githubusercontent.com/duanyytop/agents-radar/master/manifest.json';
      const manifestText = await fetchUrl(manifestUrl);
      const data = JSON.parse(manifestText);
      if (Array.isArray(data)) {
        return data.slice(0, 15).map((item, idx) => ({
          id: item.url || item.link || `agents-radar-fallback-${idx}`,
          title: item.title || item.name || 'AI Model & Agent Update',
          summary: (item.description || item.summary || item.text || '').slice(0, 300),
          url: item.url || item.link || 'https://github.com/duanyytop/agents-radar',
          sourceName: 'Agents Radar',
          sourceRepo: 'duanyytop/agents-radar',
          category: 'AI / ML',
          publishedAt: item.date || new Date().toISOString(),
          rawText: `${item.title || ''}\n${item.description || ''}`
        }));
      }
    } catch (fallbackErr) {
      console.error('[AgentsRadar Fetcher] Fallback also failed:', fallbackErr.message);
    }
    return [];
  }
}

module.exports = {
  fetchAgentsRadar
};
