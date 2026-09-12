module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.end(`# Grevix Official Robots.txt
# https://grevix.online

User-agent: *
Allow: /
Allow: /about
Allow: /projects
Allow: /events
Allow: /community
Allow: /blog
Allow: /privacy
Allow: /terms
Allow: /styles.css
Allow: /main.js
Allow: /favicon.jpg
Allow: /favicon.svg

# Disallow private and backend endpoints
Disallow: /api/
Disallow: /private_data/

# Sitemap location
Sitemap: https://grevix.online/sitemap.xml
`);
};
