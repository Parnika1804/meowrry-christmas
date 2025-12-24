export interface Kitten {
  id: string;
  name: string;
  tagline: string;
  correctGift: string;
  color: string;
  pattern: 'solid' | 'striped' | 'spotted' | 'tuxedo' | 'calico';
  eyeColor: string;
  acceptMessages: string[];
  refuseMessages: string[];
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const kittens: Kitten[] = [
  {
    id: "princess",
    name: "Princess Fluffington",
    tagline: "Born better than you tbh",
    correctGift: "tiara",
    color: "#FFB6C1",
    pattern: "solid",
    eyeColor: "#4FC3F7",
    acceptMessages: [
      "FINALLY. Someone with taste. Took you long enough.",
      "Yes. YES. I AM the main character.",
      "Correct. Now bow. Lower. LOWER.",
      "The peasants are learning. There's hope yet.",
      "I'll allow you to breathe near me now. Congrats.",
    ],
    refuseMessages: [
      "No. Just... no. I'm calling HR.",
      "My therapist will be hearing about this.",
      "You looked at me. Looked at THIS. And thought yes??? JAIL.",
      "I'm not mad. I'm just gonna stare at you. Forever.",
      "Blocked. Reported. Unfollowed. Deleted.",
      "This is violence actually.",
    ],
  },
  {
    id: "chaos",
    name: "Sir Chaos McFloof",
    tagline: "Has never done nothing wrong ever",
    correctGift: "yarn",
    color: "#FF8C42",
    pattern: "striped",
    eyeColor: "#76FF03",
    acceptMessages: [
      "YOOOOO this gonna be SO destroyed let's GOOO",
      "I'm gonna unravel this SO HARD. You get it.",
      "Finally some good content for the chaos gods",
      "This plus 3am = pure MAYHEM. Thank u.",
      "You just gave me a weapon. I respect that.",
    ],
    refuseMessages: [
      "Boring. Can't even knock this off a table right.",
      "Where's the chaos potential?? Zero stars.",
      "I've yelled at birds more exciting than this.",
      "My disappointment is immeasurable and my day is ruined.",
      "This wouldn't even make a good mess. Pass.",
      "You call this a gift? I call this an insult.",
    ],
  },
  {
    id: "sleepy",
    name: "Lord Snoozelot",
    tagline: "Professionally tired since birth",
    correctGift: "blanket",
    color: "#B39DDB",
    pattern: "solid",
    eyeColor: "#FFD54F",
    acceptMessages: [
      "*happy sleepy noises* zzzz this is... perfect... zzz",
      "Finally... optimal nap conditions... achieved... zzz",
      "You may watch me sleep now. That's the reward.",
      "Warm... soft... I forgive you for waking me.",
      "16 hour nap incoming. Thanks. Goodnight.",
    ],
    refuseMessages: [
      "You woke me up... FOR THIS?! VIOLENCE.",
      "I was dreaming about treats and you ruined it.",
      "I'm too tired to be mad but I'm VERY mad.",
      "*angry sleepy noises* no. go away.",
      "This isn't a pillow. This isn't sleep. Why.",
      "The audacity. The DISRESPECT. I was mid-nap.",
    ],
  },
  {
    id: "fancy",
    name: "Professor Whiskerstein",
    tagline: "Reads books you've never heard of",
    correctGift: "bowtie",
    color: "#81C784",
    pattern: "tuxedo",
    eyeColor: "#FF7043",
    acceptMessages: [
      "Ah, exquisite. My monocle approves.",
      "Finally, someone who appreciates the AESTHETIC.",
      "Distinguished. Refined. Just like me. Obviously.",
      "I shall wear this to my next book club. *chef kiss*",
      "You've proven your worth. I'm mildly impressed.",
    ],
    refuseMessages: [
      "Have you... READ? Ever? This is uncultured.",
      "My monocle fell off in SHOCK. Look what you did.",
      "This belongs in the garbage of bad taste.",
      "I'm writing a strongly worded essay about this.",
      "The literary community will hear about this betrayal.",
      "Ew. I can smell the lack of sophistication.",
    ],
  },
  {
    id: "hungry",
    name: "Munchkin McMeow",
    tagline: "Would sell you for one (1) treat",
    correctGift: "treats",
    color: "#FFD54F",
    pattern: "calico",
    eyeColor: "#E91E63",
    acceptMessages: [
      "FOOOOOOD YES GIMME GIMME GIMME",
      "OMG OMG OMG IS THAT— yes. Yes it is. HEAVEN.",
      "I've never loved anyone more. Move aside.",
      "MY WHOLE LIFE LED TO THIS MOMENT.",
      "You are now my favorite human. Everyone else is canceled.",
    ],
    refuseMessages: [
      "This... this isn't food. You LIED to me.",
      "My tummy expected treats. My tummy got betrayal.",
      "Can I eat this? No? Then WHY.",
      "I'm baby and you gave me NOT treats?? RUDE.",
      "The crinkle bag lied. I trusted you. I trusted the crinkle.",
      "Food or nothing. This is nothing. You're nothing.",
    ],
  },
];

export const gifts: Gift[] = [
  {
    id: "tiara",
    name: "Sparkly Tiara",
    emoji: "👑",
    color: "#FFD700",
  },
  {
    id: "yarn",
    name: "Chaos Ball",
    emoji: "🧶",
    color: "#FF6B6B",
  },
  {
    id: "blanket",
    name: "Cozy Blanky",
    emoji: "🛏️",
    color: "#9B8EC2",
  },
  {
    id: "bowtie",
    name: "Fancy Bowtie",
    emoji: "🎀",
    color: "#4A7C59",
  },
  {
    id: "treats",
    name: "Yummy Treats",
    emoji: "🐟",
    color: "#FFD93D",
  },
];

export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};
