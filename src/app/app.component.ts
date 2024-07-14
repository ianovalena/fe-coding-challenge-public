import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from './products/page';
import { Product } from './products/product';
import { ProductService } from './products/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly productService: ProductService) {}

  readonly products$: Observable<Page<Product>> = this.productService.get(0);
}
