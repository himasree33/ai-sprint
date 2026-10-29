export const TARGET_TOTAL = 500;
export const BUDGET_TOTAL = 2000;

export type Channel = 'ambassador' | 'whatsapp' | 'social' | 'community';

export const CHANNELS: { id: Channel; label: string; short: string; target: number; color: string }[] = [
  { id: 'ambassador', label: 'College ambassadors & clubs', short: 'Ambassadors', target: 220, color: '#a3e635' },
  { id: 'whatsapp', label: 'WhatsApp referrals', short: 'WhatsApp', target: 150, color: '#22d3ee' },
  { id: 'social', label: 'LinkedIn & Instagram organic', short: 'Social', target: 80, color: '#a78bfa' },
  { id: 'community', label: 'Direct student-community outreach', short: 'Community', target: 50, color: '#fbbf24' },
];

export const BUDGET_LINES = [
  { id: 'ambassador', label: 'Ambassador incentives', amount: 1000, color: '#a3e635',
    note: 'Small rewards for ambassadors who drive verified registrations.' },
  { id: 'creative', label: 'Creative assets', amount: 300, color: '#22d3ee',
    note: 'Templates, short demo video edits and poster designs.' },
  { id: 'contingency', label: 'Contingency / targeted distribution', amount: 700, color: '#a78bfa',
    note: 'Held back; only released to the best-performing channel after Day 4.' },
] as const;

export const TIMELINE = [
  { day: 1, title: 'Build & instrument', text: 'Build the prototype, prepare campaign materials, and define tracking.' },
  { day: 2, title: 'Ambassador kit', text: 'Prepare outreach materials for college ambassadors and student clubs.' },
  { day: 3, title: 'Launch', text: 'Launch the campaign model and publish a project demonstration.' },
  { day: 4, title: 'Referral push', text: 'Encourage referral sharing and review initial channel assumptions.' },
  { day: 5, title: 'Optimise', text: 'Review performance assumptions and optimise messaging and distribution.' },
  { day: 6, title: 'Second creative', text: 'Publish another project-focused creative and reminder.' },
  { day: 7, title: 'Final reminder', text: 'Final reminder to opted-in leads, reconcile attribution, and evaluate the campaign model.' },
];

export const WORKSHOP_TITLE = 'Build Your First AI Project in 60 Minutes';

export function whatsappMessage(link: string): string {
  return `Hey! I found a free online workshop called ${WORKSHOP_TITLE}. It looks like a useful way to explore beginner AI projects and get started. Check it out here: ${link}. You can also explore a project idea before registering!`;
}

export function whatsappUrl(link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(whatsappMessage(link))}`;
}

/** Synthetic, illustrative-only dataset. NOT real students or real results. */
export const SYNTHETIC = {
  visits: 1200,
  generatorSessions: 610,
  registrations: 184,
  registrationsWithIdea: 132,
  sharers: 71,
  referred: 44,
  byChannel: { ambassador: 82, whatsapp: 44, social: 33, community: 25 } as Record<Channel, number>,
  spend: { ambassador: 420, creative: 300, contingency: 0 },
};
