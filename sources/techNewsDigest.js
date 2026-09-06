/**
 * Upstream Adapter for draco-agent/tech-news-digest
 * Fetches latest tech news, AI developments, software releases, cloud/infra, and cybersecurity updates.
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
 * Parses markdown changelog / digests into structured story objects
 */
function parseMarkdownDigest(markdownText) {
  const items = [];
  const lines = markdownText.split('\n');
  let currentHeader = '';
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('##') || line.startsWith('###')) {
      if (currentHeader && currentContent.length > 0) {
        const bodyText = currentContent.join(' ').trim();
        const urlMatch = /https?:\/\/[^\s\)\>]+/i.exec(bodyText);
        if (currentHeader.length > 5 && bodyText.length > 20) {
          items.push({
            id: urlMatch ? urlMatch[0] : `tech-news-${currentHeader.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            title: currentHeader.replace(/^#+\s*/, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim(),
            summary: bodyText.slice(0, 300),
            url: urlMatch ? urlMatch[0] : 'https://github.com/draco-agent/tech-news-digest',
            sourceName: 'Tech News Digest',
            sourceRepo: 'draco-agent/tech-news-digest',
            category: 'SOFTWARE',
            publishedAt: new Date().toISOString(),
            rawText: `${currentHeader}\n${bodyText}`
          });
        }
      }
      currentHeader = line;
      currentContent = [];
    } else if (line.trim().length > 0) {
      currentContent.push(line.trim());
    }
  }

  if (currentHeader && currentContent.length > 0) {
    const bodyText = currentContent.join(' ').trim();
    const urlMatch = /https?:\/\/[^\s\)\>]+/i.exec(bodyText);
    if (currentHeader.length > 5 && bodyText.length > 20) {
      items.push({
        id: urlMatch ? urlMatch[0] : `tech-news-${currentHeader.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: currentHeader.replace(/^#+\s*/, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim(),
        summary: bodyText.slice(0, 300),
        url: urlMatch ? urlMatch[0] : 'https://github.com/draco-agent/tech-news-digest',
        sourceName: 'Tech News Digest',
        sourceRepo: 'draco-agent/tech-news-digest',
        category: 'SOFTWARE',
        publishedAt: new Date().toISOString(),
        rawText: `${currentHeader}\n${bodyText}`
      });
    }
  }

  return items;
}

/**
 * Main fetcher function
 */
async function fetchTechNewsDigest() {
  try {
    const changelogUrl = 'https://raw.githubusercontent.com/draco-agent/tech-news-digest/main/CHANGELOG.md';
    const markdownContent = await fetchUrl(changelogUrl);
    const parsedItems = parseMarkdownDigest(markdownContent);
    return parsedItems;
  } catch (err) {
    console.warn('[TechNewsDigest Fetcher] Primary CHANGELOG.md failed, trying README.md:', err.message);
    try {
      const readmeUrl = 'https://raw.githubusercontent.com/draco-agent/tech-news-digest/main/README.md';
      const markdownContent = await fetchUrl(readmeUrl);
      return parseMarkdownDigest(markdownContent);
    } catch (fallbackErr) {
      console.error('[TechNewsDigest Fetcher] Fallback also failed:', fallbackErr.message);
    }
    return [];
  }
}

module.exports = {
  fetchTechNewsDigest
};
