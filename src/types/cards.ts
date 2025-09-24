export interface Service {
  id?: string;
  name: string;
  price?: string;
  duration?: string;
  category?: string;
  description?: string;
}

export interface Product {
  id?: string;
  name: string;
  price?: string;
  category?: string;
  description?: string;
  image?: string;
}

export interface GalleryImage {
  url: string;
}

export interface BusinessCard {
  id: string;
  user_id?: string;
  name: number;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  profile_image?: string;
  business_description?: string;
  business_phone?: string;
  business_email?: string;
  business_cover_photo?: string;
  businesslogo?: string;
  website?: string;
  address?: string;
  linkedinurl?: string;
  twitterurl?: string;
  facebookurl?: string;
  instagramurl?: string;
  youtubeurl?: string;
  customnotes?: string;
  services?: Service[];
  products?: Product[];
  gallery?: GalleryImage[];
  qr_code?: string;
  views?: number;
  theme?: string;
  createdat?: string;
  updatedat?: string;
}
