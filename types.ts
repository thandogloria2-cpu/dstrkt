
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  gallery?: string[];
  isLimited?: boolean;
  tag?: string;
  stock?: number;
}

export interface VaultDrop {
  id: string;
  name: string;
  releaseDate: string;
  image: string;
  status: 'upcoming' | 'sold-out' | 'active';
  description: string;
}