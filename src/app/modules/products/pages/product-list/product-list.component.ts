import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {catchError, concat, of, Subject, switchMap, tap} from "rxjs";
import {Product} from "../../interfaces/product";
import {CommonModule} from "@angular/common";
import {ProductCardComponent} from "../../components/product-card/product-card.component";

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
  displayShowMoreButton: WritableSignal<boolean> = signal(true);

  private loadMore: Subject<null> = new Subject();
  private page: number = 0;

  constructor(private readonly productService: ProductService) {}

  ngOnInit() {
    this.loadMore.asObservable()
      .pipe(
        tap(() => this.isLoading.set(true)),
        switchMap(() => this.productService.get(this.page)),
        //retry(1),
        tap(result => {
          this.displayShowMoreButton.set(result.more);
          this.products.update(prevProducts => [...prevProducts, ...result.content])
        }),
        tap(() => this.page++),
        catchError((err, caught) => {
          console.log('error popup!');
          return concat(of(null), caught);
        }),
        tap(() => this.isLoading.set(false)),
      )
      .subscribe();

    this.loadMore.next(null);
  }

  loadMoreClick() {
    this.loadMore.next(null);
  }
}
