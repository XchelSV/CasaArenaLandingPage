import { ProductPresentation } from './product-presentation.interface';

export interface CatalogProduct {
    id: string;
    category: string;
    image: string;
    preview: string;
    title: string;
    description: string;
    presentations: ProductPresentation[];
}
