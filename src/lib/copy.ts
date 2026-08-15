// src/lib/copy.ts
// All desi microcopy lives here. One place = consistent personality.

export const copy = {
  // Ticket screen
  ticketPreparing: 'PREPARING YOUR TICKET…',
  ticketScanning:  'BHAI SCAN HO RAHA HAI…',
  ticketVerified:  'VERIFIED ✓ — ANDAR AA JAO',
  ticketEnter:     'ENTER PARTY →',

  // Entry transition
  entryTearing:    'TICKET TOD RAHA HAI…',

  // Party scene — loading / error
  partyLoading:    'DJ BHAIYA AA RAHE HAIN…',
  partyConnecting: 'connecting…',
  partyNoInternet: 'INTERNET NE DHOKA DE DIYA 😭',
  partyNoSong:     'YE GAANA ABHI AVAILABLE NAHI HAI',

  // Music pill controls
  play:            'BAJAO 🔥',
  pause:           'BAS KAR BHAI',
  next:            'AGLE PE',
  prev:            'PEHLE WALA',
  share:           'DOST KO BULA 🔥',
  shareCopied:     'LINK COPIED — AB BHEJ DE',

  // Volume
  volume:          'AWAAZ',

  // Status hints
  liveNow:         'LIVE',
  paused:          'PAUSED',
  buffering:       'BUFFERING…',

  // Listener count
  listenerSingular:'1 person is vibing',
  listenerPlural:  (n: number) => `${n.toLocaleString('en-IN')} people are vibing`,
  listenerSticker: (n: number) => `🟢 ${n.toLocaleString('en-IN')} people vibing`,
};

export const sceneSigns = {
  djBhaiya:        'DJ BHAIYA',
  aajFullMasti:    'आज FULL MASTI',
  basAajKiRaat:    'बस आज की रात',
  entryFreeNahiHai: 'ENTRY FREE NAHI HAI 😭',
  goodMusicEtc:    ['GOOD MUSIC', 'GOOD PEOPLE', 'BAD DECISIONS'],
};
