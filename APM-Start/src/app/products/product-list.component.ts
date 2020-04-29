import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable, never, EMPTY, of, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  pageTitle = 'Product List';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  categories;
  selectedCategoryId = 1;

  private categorySelectedSubject = new BehaviorSubject<number>(0); // We can give behaviour subject an initial value
  // private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
      // .pipe(
      //   startWith(0) // Default value of 0. Since combine latest won't work untill all observables 
      // emit atleast first value
      // )
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true)
    ),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
      // return of([]);
    })
  ) 

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  constructor(private productService: ProductService,
    private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }
}
