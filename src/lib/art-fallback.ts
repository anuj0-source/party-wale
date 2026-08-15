// src/lib/art-fallback.ts
// Single switch for "do we have the designer-produced artwork yet?"
// All art components go through this so swapping in real .webp files later
// is a one-line change per asset.

/**
 * Returns the path to use for an art asset. Real designer file wins;
 * otherwise consumers render the inline-SVG fallback in their own component.
 *
 * The intent is that whoever produces the .webp files just drops them in
 * /public/art/... with the names listed in the plan, and the app upgrades
 * itself. No code changes needed on the consumer side.
 */
export const art = {
  background:   '/art/background-scene.webp',
  backgroundMob: '/art/background-scene-mobile.webp',
  djIdle:       '/art/dj-idle.webp',
  djDance:      '/art/dj-dance.webp',
  djBassdrop:   '/art/dj-bassdrop.webp',
  djMobile:     '/art/dj-mobile.webp',
  logo:         '/art/logo-wordmark.webp',
  ticketPaper:  '/art/ticket-paper.webp',
  verifiedStamp:'/art/ticket-verified-stamp.webp',
  crowd: [
    '/art/crowd/crowd-1-college-guy.webp',
    '/art/crowd/crowd-2-phone-girl.webp',
    '/art/crowd/crowd-3-sunglasses-guy.webp',
    '/art/crowd/crowd-4-jumping-friend.webp',
    '/art/crowd/crowd-5-recording.webp',
    '/art/crowd/crowd-6-couple.webp',
    '/art/crowd/crowd-7-uncle.webp',
    '/art/crowd/crowd-8-back-guy.webp',
  ],
  crowdMobile: [
    '/art/crowd/crowd-mobile-1.webp',
    '/art/crowd/crowd-mobile-2.webp',
    '/art/crowd/crowd-mobile-3.webp',
    '/art/crowd/crowd-mobile-4.webp',
  ],
  signs: {
    djBhaiya:        '/art/handwritten/dj-bhaiya.webp',
    aajFullMasti:    '/art/handwritten/aaj-full-masti.webp',
    basAajKiRaat:    '/art/handwritten/bas-aaj-ki-raat.webp',
    entryFreeNahiHai:'/art/handwritten/entry-free-nahi-hai.webp',
  },
};

/**
 * Test if a given URL exists by issuing a HEAD request. Returns a promise
 * resolving to true/false. Use sparingly — we cache the result.
 */
const cache = new Map<string, boolean>();
export async function artExists(path: string): Promise<boolean> {
  if (cache.has(path)) return cache.get(path)!;
  try {
    const res = await fetch(path, { method: 'HEAD' });
    const isImage = res.headers.get('content-type')?.includes('image');
    const ok = res.ok && isImage;
    cache.set(path, ok);
    return !!ok;
  } catch {
    cache.set(path, false);
    return false;
  }
}
