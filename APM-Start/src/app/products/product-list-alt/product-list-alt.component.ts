import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY } from 'rxjs';

import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';

  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
        // return of([]);
      })
    )

  selectedProduct$ = this.productService.selectedProduct$;


  constructor(private productService: ProductService) { }


  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
