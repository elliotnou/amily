export type Tier = 'inner-circle' | 'close-friend' | 'casual'
export type Feeling = { label: string }

export interface ContactInfo {
  phone?: string
  email?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  snapchat?: string
}

export interface Friend {
  id: string
  name: string
  initials: string
  avatarColor: string
  location: string
  tier: Tier
  metHow: string
  metDate: string
  birthday: string
  dayCount: number
  tags: string[]
  interests: string[]
  facts: { category: string; value: string }[]
  notes: { date: string; text: string }[]
  aiLabel?: string
  hangoutCount: number
  contact: ContactInfo
}

export interface Hangout {
  id: string
  type: string
  location: string
  date: string
  highlights: string
  friends: { id: string; name: string; feeling?: Feeling }[]
  followUps: string[]
}

export interface Impression {
  id: string
  friendId: string
  title: string
  body: string
  date: string
}

export interface Nudge {
  id: string
  icon: 'clock' | 'cake' | 'check'
  message: string
  type: 'drift' | 'birthday' | 'followup'
  aiAction?: boolean
}

export const friends: Friend[] = [
  {
    id: '1',
    name: 'Maya Chen',
    initials: 'MC',
    avatarColor: '#e07a5f',
    location: 'Brooklyn, NY',
    tier: 'inner-circle',
    metHow: 'College roommate',
    metDate: '2019-08-20',
    birthday: 'Mar 15',
    dayCount: 2404,
    tags: ['creative', 'night-owl', 'foodie'],
    interests: ['film photography', 'indie rock', 'ramen'],
    facts: [
      { category: 'Fave food', value: 'Tonkotsu ramen' },
      { category: 'Drink order', value: 'Oat milk cortado' },
      { category: 'Fave artist', value: 'Japanese Breakfast' },
      { category: 'Fave movie', value: 'In the Mood for Love' },
      { category: 'Fave book', value: 'Norwegian Wood' },
      { category: 'Shirt size', value: 'S' },
    ],
    notes: [
      { date: '2024-03-10', text: 'She got promoted to lead designer at her studio' },
      { date: '2024-02-14', text: 'Mentioned wanting to visit Kyoto this fall' },
      { date: '2024-01-22', text: 'Started a 35mm photo series about her neighborhood' },
    ],
    aiLabel: 'your film friend',
    hangoutCount: 23,
    contact: {
      phone: '(917) 555-0142',
      email: 'maya.chen@email.com',
      instagram: '@mayafilms',
      twitter: '@mayachen_',
    },
  },
  {
    id: '2',
    name: 'Jordan Williams',
    initials: 'JW',
    avatarColor: '#457b9d',
    location: 'Oakland, CA',
    tier: 'close-friend',
    metHow: 'Pickup basketball',
    metDate: '2021-03-12',
    birthday: 'Jul 8',
    dayCount: 1835,
    tags: ['athletic', 'chill', 'tech'],
    interests: ['basketball', 'mechanical keyboards', 'cooking'],
    facts: [
      { category: 'Fave food', value: 'Jerk chicken' },
      { category: 'Drink order', value: 'Cold brew, black' },
      { category: 'Fave artist', value: 'Tyler, the Creator' },
      { category: 'Dietary', value: 'No dairy' },
    ],
    notes: [
      { date: '2024-03-05', text: 'Training for a half marathon in October' },
      { date: '2024-01-15', text: 'Considering switching from Android to iOS' },
    ],
    aiLabel: 'your hoops buddy',
    hangoutCount: 15,
    contact: {
      phone: '(510) 555-0198',
      instagram: '@jwhoops',
    },
  },
  {
    id: '3',
    name: 'Priya Sharma',
    initials: 'PS',
    avatarColor: '#6b8f71',
    location: 'Austin, TX',
    tier: 'close-friend',
    metHow: 'Book club',
    metDate: '2022-01-08',
    birthday: 'Nov 22',
    dayCount: 1532,
    tags: ['intellectual', 'warm', 'planner'],
    interests: ['sci-fi novels', 'hiking', 'board games'],
    facts: [
      { category: 'Fave food', value: 'Dosa' },
      { category: 'Fave book', value: 'Left Hand of Darkness' },
      { category: 'Fave color', value: 'Forest green' },
    ],
    notes: [
      { date: '2024-02-28', text: 'Just adopted a cat named Pixel' },
    ],
    hangoutCount: 9,
    contact: {
      email: 'priya.sharma@email.com',
      linkedin: 'priyasharma',
    },
  },
  {
    id: '4',
    name: 'Leo Morales',
    initials: 'LM',
    avatarColor: '#c9a96e',
    location: 'Chicago, IL',
    tier: 'casual',
    metHow: 'Friend of Maya',
    metDate: '2023-06-15',
    birthday: 'Apr 3',
    dayCount: 644,
    tags: ['artsy', 'spontaneous'],
    interests: ['murals', 'skateboarding', 'vinyl'],
    facts: [
      { category: 'Fave food', value: 'Al pastor tacos' },
      { category: 'Drink order', value: 'Mezcal negroni' },
    ],
    notes: [],
    hangoutCount: 4,
    contact: {
      instagram: '@leomorales.art',
    },
  },
  {
    id: '5',
    name: 'Sam Rivera',
    initials: 'SR',
    avatarColor: '#7ca5b8',
    location: 'San Diego, CA',
    tier: 'casual',
    metHow: 'Surf lesson',
    metDate: '2023-09-02',
    birthday: 'Aug 19',
    dayCount: 565,
    tags: ['outdoorsy', 'relaxed'],
    interests: ['surfing', 'coffee roasting', 'camping'],
    facts: [
      { category: 'Fave food', value: 'Fish tacos' },
    ],
    notes: [
      { date: '2024-02-10', text: 'Opened a small coffee pop-up on weekends' },
    ],
    hangoutCount: 3,
    contact: {
      phone: '(619) 555-0234',
      instagram: '@samsurf_',
      snapchat: 'samrivera',
    },
  },
  {
    id: '6',
    name: 'Aisha Okafor',
    initials: 'AO',
    avatarColor: '#9b8ec4',
    location: 'London, UK',
    tier: 'inner-circle',
    metHow: 'Study abroad',
    metDate: '2018-09-01',
    birthday: 'Dec 1',
    dayCount: 2757,
    tags: ['musical', 'thoughtful', 'loyal'],
    interests: ['jazz piano', 'poetry', 'thrift shopping'],
    facts: [
      { category: 'Fave food', value: 'Jollof rice' },
      { category: 'Drink order', value: 'Earl grey latte' },
      { category: 'Fave movie', value: 'Moonlight' },
      { category: 'Fave book', value: 'Beloved' },
    ],
    notes: [
      { date: '2024-03-12', text: 'Playing a jazz set at a Shoreditch bar next month' },
      { date: '2024-01-30', text: 'Thinking about getting her masters in ethnomusicology' },
    ],
    aiLabel: 'your music soulmate',
    hangoutCount: 18,
    contact: {
      email: 'aisha.okafor@email.com',
      instagram: '@aishajazz',
      twitter: '@aishaokafor',
      linkedin: 'aishaokafor',
    },
  },
]

export const hangouts: Hangout[] = [
  {
    id: '1',
    type: 'Dinner',
    location: 'Tatiana, NYC',
    date: '2024-03-08',
    highlights: 'Amazing Dominican food. Maya brought her new camera and we spent an hour after dinner shooting portraits in the neon light on the sidewalk. She told me about her promotion and we talked about what it means to grow into leadership. Felt really connected.',
    friends: [
      { id: '1', name: 'Maya', feeling: { label: 'grateful' } },
    ],
    followUps: ['Send Maya the photo she liked', 'Try making tostones at home'],
  },
  {
    id: '2',
    type: 'Pickup basketball',
    location: 'Mosswood Park',
    date: '2024-03-03',
    highlights: 'Good run. Jordan\'s three-point game is getting scary. Grabbed smoothies after and talked about his marathon training. He seems more focused lately.',
    friends: [
      { id: '2', name: 'Jordan', feeling: { label: 'happy' } },
    ],
    followUps: ['Look up that running shoe he mentioned'],
  },
  {
    id: '3',
    type: 'Book club',
    location: 'Priya\'s apartment',
    date: '2024-02-25',
    highlights: 'Discussed Parable of the Sower. Priya made incredible chai. Met her new cat Pixel — very friendly. The conversation drifted into climate anxiety and how fiction helps us process it.',
    friends: [
      { id: '3', name: 'Priya', feeling: { label: 'inspired' } },
    ],
    followUps: ['Read Parable of the Talents', 'Send Priya that climate fiction list'],
  },
  {
    id: '4',
    type: 'Birthday party',
    location: 'Leo\'s rooftop',
    date: '2024-02-10',
    highlights: 'Great energy. Leo\'s friends are all super creative. Sam drove up from San Diego and we finally hung out properly. The sunset from the roof was unreal.',
    friends: [
      { id: '4', name: 'Leo', feeling: { label: 'celebratory' } },
      { id: '5', name: 'Sam', feeling: { label: 'happy' } },
      { id: '1', name: 'Maya', feeling: { label: 'happy' } },
    ],
    followUps: ['Share the rooftop photos', 'Plan a surf day with Sam'],
  },
  {
    id: '5',
    type: 'Jazz night',
    location: 'Village Vanguard',
    date: '2024-01-20',
    highlights: 'Aisha was visiting from London. We caught a trio at the Vanguard — the pianist reminded us both of our study abroad days. Stayed out until 2am walking and talking.',
    friends: [
      { id: '6', name: 'Aisha', feeling: { label: 'loved' } },
    ],
    followUps: ['Send Aisha the Vanguard recordings', 'Plan London visit for summer'],
  },
]

export const impressions: Impression[] = [
  {
    id: '1',
    friendId: '1',
    title: 'After the Tatiana dinner',
    body: 'There\'s something about Maya that makes every meal feel like an event. She has this way of being fully present — phone away, eyes locked in, actually listening. When she talked about her promotion, she wasn\'t bragging. She was processing. I think she\'s nervous about managing people. I should ask about that next time.',
    date: '2024-03-08',
  },
  {
    id: '2',
    friendId: '6',
    title: 'London walks',
    body: 'Every time Aisha visits, I\'m reminded that some friendships exist outside of time. We hadn\'t talked in two months but within five minutes it was like no gap at all. She\'s thinking about grad school and I can tell it scares her — the commitment, the risk. I want to be the person who encourages her without pressure.',
    date: '2024-01-20',
  },
]

export const nudges: Nudge[] = [
  { id: '1', icon: 'clock', message: "You haven't hung out with Priya in 23 days", type: 'drift' },
  { id: '2', icon: 'cake', message: "Maya's birthday is in 5 days", type: 'birthday', aiAction: true },
  { id: '3', icon: 'check', message: "Follow up: send Maya the photo she liked", type: 'followup' },
  { id: '4', icon: 'clock', message: "It's been 45 days since you saw Sam", type: 'drift' },
]

export const feelings: Feeling[] = [
  { label: 'happy' },
  { label: 'grateful' },
  { label: 'inspired' },
  { label: 'loved' },
  { label: 'celebratory' },
  { label: 'peaceful' },
  { label: 'frustrated' },
  { label: 'sad' },
  { label: 'thoughtful' },
]

export function tierClass(tier: Tier): string {
  return `pill-${tier}`
}

export function tierDotClass(tier: Tier): string {
  return `tier-dot-${tier}`
}

export function tierLabel(tier: Tier): string {
  return tier.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

export function tierColor(tier: Tier): string {
  switch (tier) {
    case 'inner-circle': return 'var(--inner-circle)'
    case 'close-friend': return 'var(--close-friend)'
    case 'casual': return 'var(--casual)'
  }
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getFriend(id: string): Friend | undefined {
  return friends.find(f => f.id === id)
}

// Feeling color map for stats visualization
export function feelingColor(label: string): string {
  const map: Record<string, string> = {
    happy: '#4a9e6e',
    grateful: '#e07a5f',
    inspired: '#457b9d',
    loved: '#c45c5c',
    celebratory: '#c9a96e',
    peaceful: '#6b8f71',
    frustrated: '#d4644e',
    sad: '#7ca5b8',
    thoughtful: '#9b8ec4',
  }
  return map[label] || 'var(--text-muted)'
}
