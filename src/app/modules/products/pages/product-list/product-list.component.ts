import { Component } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Observable} from "rxjs";
import {Page} from "../../interfaces/page";
import {Product} from "../../interfaces/product";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  constructor(private readonly productService: ProductService) {}

  readonly products$: Observable<Page<Product>> = this.productService.get(0);
}
