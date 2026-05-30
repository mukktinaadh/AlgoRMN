export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  published: boolean;
  published_at: string | null;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  subscribed_at: string;
}
