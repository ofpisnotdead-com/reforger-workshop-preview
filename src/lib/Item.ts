export interface Item {
  name: string;
  summary: string;
  currentVersionNumber: string;
  currentVersionSize: number;
  preview: string;
  updatedAt: string;
  author: string;
  id: string;
  ratingCount: number;
  subscriberCount: number;
  averageRating: number;
  scenariosIds: Array<string>;
}
