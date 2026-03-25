export interface ArticleSectionItem {
  id?: number;
  type?: string;
  [key: string]: unknown;
}

export interface ArticleSection {
  id?: number;
  item?: ArticleSectionItem | null;
  [key: string]: unknown;
}

export interface Article {
  id: number;
  title: string;
  subtitle?: string;
  category?: string;
  editor?: string;
  interviewee?: string;
  thumbnail_image_large?: string;
  thumbnail_image_small?: string;
  cover_image?: string | null;
  published_at?: string;
  is_featured: boolean;
  slug: string;
  status?: string;
  sections?: ArticleSection[] | null;
  [key: string]: unknown;
}

