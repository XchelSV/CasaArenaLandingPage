import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styles: ['.card-text { font-weight :100; }', '.card { border: none; }', '.card-footer { font-weight :100; }']
})
export class ProductCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input('image-path') imagePath: string = '';
  @Input('title') title: string = '';
  @Input('description') description: string = '';
  @Input('price') price: number = 0;

  cdnUrl = environment.CDN_URL;

}
