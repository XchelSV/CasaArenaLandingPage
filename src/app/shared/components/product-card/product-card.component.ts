import { Component, Input, OnInit } from '@angular/core';
import { ProductPresentation } from '../../interfaces/product-presentation.interface';
import { environment } from 'src/environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css'],
    standalone: false
})
export class ProductCardComponent implements OnInit {
  private addedToCartTimeout?: ReturnType<typeof setTimeout>;

  constructor(private cartService: CartService) { }

  @Input('image-path') imagePath: string = '';
  @Input('image-preview') imagePreview: string = '';
  @Input('title') title: string = '';
  @Input('description') description: string = '';
  @Input('product-id') productId: string = '';
  @Input('category') category: string = '';
  @Input('presentations') presentations: ProductPresentation[] = [];

  cdnUrl = environment.CDN_URL;
  imageLoaded = false;
  addedToCart = false;
  selectedPresentationId = '';

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  get selectedPresentation(): ProductPresentation | undefined {
    return this.presentations.find((presentation) => presentation.id === this.selectedPresentationId);
  }

  ngOnInit(): void {
    this.selectedPresentationId = this.presentations[0]?.id ?? '';
  }

  addToCart(): void {
    const selectedPresentation = this.selectedPresentation;

    if (!selectedPresentation) {
      return;
    }

    this.cartService.addToCart({
      id: this.productId,
      title: this.title,
      description: this.description,
      imagePath: this.imagePath,
      price: selectedPresentation.price,
      category: this.category,
      presentationId: selectedPresentation.id,
      presentationLabel: selectedPresentation.label
    });

    this.showAddedToCartFeedback();
  }

  onPresentationChange(presentationId: string): void {
    this.selectedPresentationId = presentationId;
  }

  private showAddedToCartFeedback(): void {
    this.addedToCart = true;

    if (this.addedToCartTimeout) {
      clearTimeout(this.addedToCartTimeout);
    }

    this.addedToCartTimeout = setTimeout(() => {
      this.addedToCart = false;
    }, 1400);
  }

}
