import { Component, OnInit } from '@angular/core';
import { DEFAULT_PRODUCT_PRESENTATIONS } from 'src/app/shared/constants/product-presentations';
import { CatalogProduct } from 'src/app/shared/interfaces/catalog-product.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-engobes-page',
    templateUrl: './engobes-page.component.html',
    styleUrls: ['./engobes-page.component.css'],
    standalone: false
})
export class EngobesPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cdnUrl = environment.CDN_URL;
  readonly products: CatalogProduct[] = [
    {
      id: 'engobe-1',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-9-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-9-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-2',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-10-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-10-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-3',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-11-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-11-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-4',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-12-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-12-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-5',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-13-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-13-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-6',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-14-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-14-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-7',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-15-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-15-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    },
    {
      id: 'engobe-8',
      category: 'Engobe',
      image: '/images/Esmaltes/Background-less/Esmalte-16-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-16-removebg-preview-loader.png?d=500x550',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      presentations: DEFAULT_PRODUCT_PRESENTATIONS
    }
  ];

}
