import * as cheerio from 'cheerio';
import RSS from 'rss';

interface UrlEntry {
  loc?: string[];
  lastmod?: string[];
}

interface FeedItem {
  title: string;
  description: string;
  url: string;
  date: string;
}

// utils/dateParser.ts
export function parseAndFormatDate(dateString: string): string | null {
  if (!dateString)
    return null;

  // Handle date string like "January 19, 2025 at 03:32 PM"
  const dateRegex = /(\w+ \d+, \d+) at (\d+):(\d+) (AM|PM)/;
  const match = dateString.match(dateRegex);

  if (match) {
    const [_, datePart, hours, minutes, period] = match;
    let hour = Number.parseInt(hours);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    const date = new Date(`${datePart} ${hour.toString().padStart(2, '0')}:${minutes}`);
    return date.toUTCString();
  }

  // Try parsing ISO 8601 format
  const isoDate = new Date(dateString);
  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate.toUTCString();
  }

  return null;
}

export async function genFeed(urlEntries: UrlEntry[]): Promise<string> {
  const feed = new RSS({
    title: 'My Website RSS',
    description: 'Latest updates from my site',
    feed_url: 'https://www.aaron-shih.com/rss.xml',
    site_url: 'https://www.aaron-shih.com',
    language: 'en',
  });

  const feedEntries: FeedItem[] = [];

  for (const entry of urlEntries) {
    const loc = entry.loc?.[0];
    if (!loc)
      continue;

    try {
      const pageResp = await fetch(loc, { signal: AbortSignal.timeout(10_000) });
      if (!pageResp.ok)
        continue;

      const html = await pageResp.text();
      const $ = cheerio.load(html);

      // Get title
      const pageTitle = $('title').text()?.trim() || loc;

      // Get description
      const pageDescription = $('meta[name="description"]').attr('content')?.trim() || `Page URL: ${loc}`;

      const lastmod = entry.lastmod?.[0] || $('meta[property="article:modified_time"]').attr('content') as string;
      const pubDate = parseAndFormatDate(lastmod);

      feedEntries.push({
        title: pageTitle,
        description: pageDescription,
        url: loc,
        date: pubDate || new Date().toUTCString(),
      });
    } catch (e) {
      console.error(`Failed to fetch or parse ${loc}`, e);
    }
  }

  // Sort entries by date, newest first
  feedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Add sorted entries to feed
  for (const entry of feedEntries)
    feed.item(entry);

  return feed.xml({ indent: true });
}
