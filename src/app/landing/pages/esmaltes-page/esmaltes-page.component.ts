import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-esmaltes-page',
    templateUrl: './esmaltes-page.component.html',
    styleUrls: ['./esmaltes-page.component.css'],
    standalone: false
})
export class EsmaltesPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cdnUrl = environment.CDN_URL;
  products = [
    {
      id: 'esmalte-1',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-1-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-1-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-2',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-2-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-2-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-3',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-3-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-3-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-4',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-4-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-4-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-5',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-5-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-5-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-6',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-6-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-6-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-7',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-7-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-7-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      id: 'esmalte-8',
      category: 'Esmalte',
      image: '/images/Esmaltes/Background-less/Esmalte-8-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-8-removebg-preview-loader.png?d=500x550',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    }
  ];

}
