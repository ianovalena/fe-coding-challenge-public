import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { Page } from '../../interfaces/page';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  const mockProductResponse: Page<Product> = {
    more: true,
    content: [
      {
        title: 'Product Title',
        description: 'Description',
        image: null,
        categories: [],
        url: '',
      }
    ]
  };

  const getProductsResponse = new Subject<Page<Product> | Error>();

  const productServiceStub = {
    get: () => getProductsResponse.asObservable(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: productServiceStub }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should show spinner', () => {
      component.isLoading.set(false);
      fixture.detectChanges();
      expect(component.isLoading()).toBe(true);
    });

    it('should request products for 0 page', () => {
      const getProductsSpy = spyOn(productService, 'get').and.callThrough();
      fixture.detectChanges();
      expect(getProductsSpy).toHaveBeenCalledOnceWith(0);
    });

    it('should update products', () => {
      fixture.detectChanges();
      expect(component.products().length).toBe(0);

      getProductsResponse.next(mockProductResponse);

      expect(component.products().length).toBe(1);
    });

    it('should update more button visibility', () => {
      fixture.detectChanges();
      expect(component.displayShowMoreButton()).toBeTrue();

      getProductsResponse.next({
        ...mockProductResponse,
        more: false,
      });

      expect(component.displayShowMoreButton()).toBeFalse();
    });

    it('should hide spinner when products received', () => {
      fixture.detectChanges();
      expect(component.isLoading()).toBeTrue();

      getProductsResponse.next(mockProductResponse);

      expect(component.isLoading()).toBeFalse();
    });

    it('should show error if error received', () => {
      fixture.detectChanges()
      expect(component.displayLoadingError()).toBeFalse();

      getProductsResponse.next(new Error());

      expect(component.displayLoadingError()).toBeTrue();
    });

    it('should hide spinner when error received', () => {
      fixture.detectChanges();
      expect(component.isLoading()).toBeTrue();

      getProductsResponse.next(new Error());

      expect(component.isLoading()).toBeFalse();
    });
  });

  describe('loadMoreClick', () => {
    beforeEach( () => {
      fixture.detectChanges();
      getProductsResponse.next(mockProductResponse);
    });

    it('should request products for 1 page', () => {
      const getProductsSpy = spyOn(productService, 'get').and.callThrough();
      component.loadMoreClick();
      expect(getProductsSpy).toHaveBeenCalledOnceWith(1);
    });

    it('should add new products to products list', () => {
      expect(component.products().length).toBe(1);

      component.loadMoreClick();
      getProductsResponse.next(mockProductResponse);

      expect(component.products().length).toBe(2);
    });

    it('should show and hide spinner', () => {
      component.loadMoreClick();
      expect(component.isLoading()).toBeTrue();
      getProductsResponse.next(mockProductResponse);
      expect(component.isLoading()).toBeFalse();
    });

    it('should show error message if error received', () => {
      expect(component.displayLoadingError()).toBeFalse();

      component.loadMoreClick();
      getProductsResponse.next(new Error());

      expect(component.displayLoadingError()).toBeTrue();
    });

    it('should hide error message if products received after error', () => {
      component.loadMoreClick()
      getProductsResponse.next(new Error());
      expect(component.displayLoadingError()).toBeTrue();

      component.loadMoreClick()
      getProductsResponse.next(mockProductResponse);
      expect(component.displayLoadingError()).toBeFalse();
    });
  });
});
