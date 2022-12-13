/**
 * A simple product.
 */
export interface Product {
  url: string;
  title: string;
  description: string;
  image: string | null;
  categories: string[];
}
