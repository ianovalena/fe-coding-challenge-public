import { Component } from '@angular/core';
import { ProductService } from "../../services/product.service";
import { Observable } from "rxjs";
import { Page } from "../../interfaces/page";
import { Product } from "../../interfaces/product";
import { CommonModule } from "@angular/common";
import { ProductCardComponent } from "../../components/product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  constructor(private readonly productService: ProductService) {}

  readonly products$: Observable<Page<Product>> = this.productService.get(0);
}
