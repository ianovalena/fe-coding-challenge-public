import { Injectable } from '@angular/core';
import {
  randNumber,
  randProductCategory,
  randProductDescription,
  randProductName,
  randUrl
} from '@ngneat/falso';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from './page';
import { Product } from './product';

/**
 * A service to handle products.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private static readonly PAGE_SIZE = 12;
  private static readonly PAGE_COUNT = 4;
  private static readonly PAGE_ERROR = 0.1;

  /**
   * Get a page of products.
   * 
   * *Note:* This is a fake service that returns random data. It simulates a
   * network request by delaying the response and randomly returning an error.
   * 
   * @param page The page number.
   * @returns An observable of the page of products.
   */
  get(page: number): Observable<Page<Product>> {
    let res: Page<Product> | undefined;
    if (page > ProductService.PAGE_COUNT) {
      res = { more: false, content: [] };
    } else if (page === ProductService.PAGE_COUNT) {
      const content = this.getContent(randNumber({ min: 1, max: ProductService.PAGE_SIZE }));
      res = { more: false, content };
    } else if (page >= 0) {
      const content = this.getContent(ProductService.PAGE_SIZE);
      res = { more: true, content };
    }
    if (res) {
      return (this.randBooleanWeighted(ProductService.PAGE_ERROR)
        ? throwError(() => new Error('500 Internal Server Error'))
        : of(res)
      ).pipe(delay(randNumber({ min: 150, max: 1500 })));
    }
    return throwError(() => new Error('400 Bad Request'));
  }

  private getContent(length: number): Product[] {
    return Array.from({ length }, () => ({
      url: randUrl(),
      title: randProductName(),
      description: randProductDescription(),
      image: this.randBooleanWeighted(0.8)
        ? `https://picsum.photos/id/${randNumber({ max: 1000 })}/400/400`
        : null,
      categories: Array.from({ length: randNumber({ max: 5 }) }, () => randProductCategory())
    }));
  }

  private randBooleanWeighted(trueWeight: number): boolean {
    return randNumber({ max: 1, fraction: 2 }) <= trueWeight;
  }
}
