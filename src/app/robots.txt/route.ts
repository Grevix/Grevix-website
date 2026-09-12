export const dynamic = 'force-dynamic';

export async function GET() {
  const txt = `# Grevix Official Robots.txt
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
`;

  return new Response(txt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
