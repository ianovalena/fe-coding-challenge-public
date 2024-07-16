import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, concat, of, Subject, switchMap, tap } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  isLoading: WritableSignal<boolean> = signal(true);
  products: WritableSignal<Product[]> = signal([]);
  displayLoadMoreButton: WritableSignal<boolean> = signal(true);
  displayLoadingError: WritableSignal<boolean> = signal(false);

  private loadMore: Subject<void> = new Subject<void>();
  private page = 0;

  constructor(
    private readonly productService: ProductService,
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    this.loadMore.asObservable()
      .pipe(
        tap(() => this.isLoading.set(true)),
        tap(() => this.displayLoadingError.set(false)),
        switchMap(() => this.productService.get(this.page)),
        // We can add retry to avoid some errors. Commented for proper error testing purposes
        //retry(1),
        tap(result => {
          this.displayLoadMoreButton.set(result.more);
          this.products.update(prevProducts => [...prevProducts, ...result.content])
        }),
        tap(() => this.page++),
        catchError((err, caught) => {
          this.displayLoadingError.set(true);
          return concat(of(null), caught);
        }),
        tap(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.loadMore.next();
  }

  loadMoreClick() {
    this.loadMore.next();
  }
}
