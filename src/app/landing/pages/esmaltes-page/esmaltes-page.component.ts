import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CatalogProduct } from 'src/app/shared/interfaces/catalog-product.interface';
import { CatalogService } from 'src/app/shared/services/catalog.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-esmaltes-page',
    templateUrl: './esmaltes-page.component.html',
    styleUrls: ['./esmaltes-page.component.css'],
    standalone: false
})
export class EsmaltesPageComponent implements OnInit {

  constructor(private readonly catalogService: CatalogService) { }

  readonly category = 'Esmalte';
  readonly cdnUrl = environment.CDN_URL;
  readonly skeletonCards = Array.from({ length: 4 }, (_, index) => index);

  products: CatalogProduct[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(forceRefresh = false): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.catalogService.getProductsByCategory(this.category, forceRefresh)
      .pipe(take(1))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: () => {
          this.products = [];
          this.isLoading = false;
          this.errorMessage = 'No pudimos cargar los esmaltes en este momento. Intenta de nuevo en unos segundos, por favor.';
        }
      });
  }

}
