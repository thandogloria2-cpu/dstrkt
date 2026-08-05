import { Product, VaultDrop } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'cg-1',
    name: 'Cigarettes Duffel',
    price: '$280',
    description: 'A striking blend of provocative artistry and premium craftsmanship. This piece redefines the modern carry experience.',
    image: 'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Cigarettes.png',
    tag: 'NEW ARRIVAL',
    gallery: [
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Cigarettes%2001.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Cigarattes%2002.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Cigarettes%2003.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/cigarettes%2004.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Cigarettes%2005.jpg'
    ]
  },
  {
    id: 'sf-1',
    name: 'Scarface Duffel',
    price: '$280',
    description: 'Bold and uncompromising. A duffel designed for those who command respect and carry style.',
    image: 'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface.png',
    tag: 'NEW ARRIVAL',
    gallery: [
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface%20panel%20grid.jpeg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface%2002.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface%2001.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface%2009.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface%2010.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Scarface%2014.jpg'
    ]
  },
  {
    id: 'sj-1',
    name: 'Shadow Jin',
    price: '$280',
    description: 'A masterpiece of shadows. Designed for the bold, refined for the street.',
    image: 'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Shadow%20Jin%2001.jpg',
    tag: 'NEW ARRIVAL',
    gallery: [
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Shadow%20Jin%2001.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Shadow%20Jin%2002.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Shadow%20Jin%2003.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Shadow%20Jin%2004.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Shadow%20Jin%2005.jpg'
    ]
  },
  {
    id: 'sr-1',
    name: 'SOUL REAPER',
    price: '$280',
    description: 'The ultimate shadow gear. Ethereal grey gradients on a carbon-fiber frame.',
    image: 'https://image2url.com/r2/default/images/1773740807426-6d389057-c902-439f-aa3b-9cbf3d851dbd.png',
    tag: 'ELITE'
  },
  {
    id: 'bs-1',
    name: 'BLOOD SPLATTER',
    price: '$280',
    description: 'A visceral expression of urban intensity. Hand-painted crimson accents on matte black.',
    image: 'https://image2url.com/r2/default/images/1773740632749-b62a6efe-0bee-4352-b629-be60a5149a08.png',
    tag: 'NEW ARRIVAL'
  },
  {
    id: 'rd-1',
    name: 'RED DRAGON',
    price: '$280',
    description: 'Legendary durability. Embossed dragon-scale texture with deep red highlights.',
    image: 'https://image2url.com/r2/default/images/1773740754780-83570cee-9aad-4cb6-a4ea-ccf010f0bd80.png',
    tag: 'LIMITED'
  },
  {
    id: '2',
    name: 'Swarm Duffel',
    price: '$280',
    description: 'Gold-plated hardware meets military-grade ballistic nylon.',
    image: 'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20Deffel.png',
    tag: 'BEST SELLER',
    gallery: [
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20duffel%2001.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20duffel%2002.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20duffel%2003.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20duffel%2004.jpg',
      'https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20duffel%2005.jpg'
    ]
  },
  {
    id: 'v5',
    name: 'GOLD RUNNER',
    price: '$280',
    description: 'Vibrant gold interior accents hidden behind a stealth luxury exterior.',
    image: 'https://image2url.com/r2/default/images/1770733126077-0dab6a38-fcb8-41b4-932d-f73d03b167d3.png',
    tag: 'VAULT'
  },
  {
    id: 'v6',
    name: 'BEHIND TOJI',
    price: '$280',
    description: 'A tribute to the invisible strength. Minimalist design with hidden tactical features.',
    image: 'https://image2url.com/r2/default/images/1770733126077-0dab6a38-fcb8-41b4-932d-f73d03b167d3.png', // Placeholder image, user should update
    tag: 'VAULT'
  }
];

export const EXCLUDED_PRODUCT_NAMES = [
  "The Nomad Catalyst",
  "The Executive Slate",
  "Sticker Bomb",
  "STICKER BOMB EDITION: THE VOTEX",
  "ONYX PROTO-TYPE",
  "PHANTOM",
  "LOCKCODE SERIES"
];

export const filterProducts = <T extends { name: string }>(products: T[]): T[] => {
  return products.filter(p => 
    !EXCLUDED_PRODUCT_NAMES.some(excluded => 
      p.name.toLowerCase().includes(excluded.toLowerCase())
    )
  );
};

export const VAULT_DROPS: VaultDrop[] = [
  {
    id: 'v5',
    name: 'GOLD RUNNER',
    releaseDate: '2024-02-14',
    image: 'https://image2url.com/r2/default/images/1770733126077-0dab6a38-fcb8-41b4-932d-f73d03b167d3.png',
    status: 'active',
    description: 'Vibrant gold interior accents hidden behind a stealth luxury exterior.'
  },
  {
    id: 'v6',
    name: 'BEHIND TOJI',
    releaseDate: '2024-03-15',
    image: 'https://image2url.com/r2/default/images/1770733126077-0dab6a38-fcb8-41b4-932d-f73d03b167d3.png', // Placeholder image, user should update
    status: 'active',
    description: 'A tribute to the invisible strength. Minimalist design with hidden tactical features.'
  }
];
