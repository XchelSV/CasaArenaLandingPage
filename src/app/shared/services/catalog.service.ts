import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { CatalogProduct } from '../interfaces/catalog-product.interface';
import { ProductPresentation } from '../interfaces/product-presentation.interface';
import { environment } from 'src/environments/environment';

interface CachedCatalogProducts {
    expiresAt: number;
    products: CatalogProduct[];
}

interface ApiCatalogProduct {
    id: string;
    category: string;
    image: string;
    title: string;
    description: string;
    presentations: ProductPresentation[];
}

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private readonly storageKey = 'casa-arena-catalog-products';
    private readonly cacheDurationMs = 30 * 60 * 1000;
    private readonly guestSessionEndpoint = `${environment.API_GATEWAY}/guest/session`;
    private readonly productListEndpoint = `${environment.API_GATEWAY}/product/list`;

    private productsRequest$?: Observable<CatalogProduct[]>;

    constructor(private readonly http: HttpClient) {}

    getProducts(forceRefresh = false): Observable<CatalogProduct[]> {
        if (!forceRefresh) {
            const cachedProducts = this.readProductsFromStorage();

            if (cachedProducts !== null) {
                return of(cachedProducts);
            }
        } else {
            this.clearProductsCache();
        }

        if (this.productsRequest$) {
            return this.productsRequest$;
        }

        this.productsRequest$ = this.fetchProductsWithRetry().pipe(
            tap((products) => this.saveProductsToStorage(products)),
            shareReplay(1),
            finalize(() => {
                this.productsRequest$ = undefined;
            })
        );

        return this.productsRequest$;
    }

    getProductsByCategory(category: string, forceRefresh = false): Observable<CatalogProduct[]> {
        const normalizedCategory = category.trim().toLowerCase();

        return this.getProducts(forceRefresh).pipe(
            map((products) =>
                products.filter((product) => product.category.trim().toLowerCase() === normalizedCategory)
            )
        );
    }

    clearProductsCache(): void {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.removeItem(this.storageKey);
    }

    private fetchProductsWithRetry(): Observable<CatalogProduct[]> {
        return this.fetchProductList().pipe(
            catchError(() =>
                this.createGuestSession().pipe(
                    switchMap(() => this.fetchProductList())
                )
            )
        );
    }

    private fetchProductList(): Observable<CatalogProduct[]> {
        return this.http.get<ApiCatalogProduct[]>(this.productListEndpoint, {
            withCredentials: true
        }).pipe(
            map((products) => products.map((product) => this.normalizeProduct(product)))
        );
    }

    private createGuestSession(): Observable<unknown> {
        return this.http.post(this.guestSessionEndpoint, null, {
            withCredentials: true,
            observe: 'response'
        });
    }

    private readProductsFromStorage(): CatalogProduct[] | null {
        if (typeof window === 'undefined') {
            return null;
        }

        const rawCachedProducts = window.localStorage.getItem(this.storageKey);

        if (!rawCachedProducts) {
            return null;
        }

        try {
            const cachedProducts = JSON.parse(rawCachedProducts) as Partial<CachedCatalogProducts>;

            if (
                typeof cachedProducts.expiresAt !== 'number' ||
                cachedProducts.expiresAt <= Date.now() ||
                !Array.isArray(cachedProducts.products)
            ) {
                this.clearProductsCache();
                return null;
            }

            return cachedProducts.products.map((product) => this.normalizeProduct(product));
        } catch {
            this.clearProductsCache();
            return null;
        }
    }

    private saveProductsToStorage(products: CatalogProduct[]): void {
        if (typeof window === 'undefined') {
            return;
        }

        const payload: CachedCatalogProducts = {
            expiresAt: Date.now() + this.cacheDurationMs,
            products
        };

        window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
    }

    private normalizeProduct(product: Partial<ApiCatalogProduct>): CatalogProduct {
        const normalizedPresentations = Array.isArray(product.presentations)
            ? product.presentations
                .map((presentation) => this.normalizePresentation(presentation))
                .filter((presentation): presentation is ProductPresentation => presentation !== null)
            : [];

        if (
            typeof product.id !== 'string' ||
            typeof product.category !== 'string' ||
            typeof product.image !== 'string' ||
            typeof product.title !== 'string' ||
            typeof product.description !== 'string'
        ) {
            throw new Error('Invalid catalog product received from API');
        }

        return {
            id: product.id,
            category: product.category,
            image: product.image,
            preview: product.image,
            title: product.title,
            description: product.description,
            presentations: normalizedPresentations
        };
    }

    private normalizePresentation(presentation: Partial<ProductPresentation>): ProductPresentation | null {
        if (
            typeof presentation.id !== 'string' ||
            typeof presentation.label !== 'string' ||
            typeof presentation.volumeLabel !== 'string' ||
            typeof presentation.price !== 'number'
        ) {
            return null;
        }

        return {
            id: presentation.id,
            label: presentation.label,
            volumeLabel: presentation.volumeLabel,
            price: presentation.price
        };
    }
}
