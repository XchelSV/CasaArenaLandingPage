import { Component, Input, OnInit } from '@angular/core';
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

  ngOnInit(): void {
  }

  @Input('image-path') imagePath: string = '';
  @Input('image-preview') imagePreview: string = '';
  @Input('title') title: string = '';
  @Input('description') description: string = '';
  @Input('price') price: number = 0;
  @Input('product-id') productId: string = '';
  @Input('category') category: string = '';

  cdnUrl = environment.CDN_URL;
  imageLoaded = false;
  addedToCart = false;

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  addToCart(): void {
    this.cartService.addToCart({
      id: this.productId,
      title: this.title,
      description: this.description,
      imagePath: this.imagePath,
      price: this.price,
      category: this.category
    });

    this.showAddedToCartFeedback();
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
