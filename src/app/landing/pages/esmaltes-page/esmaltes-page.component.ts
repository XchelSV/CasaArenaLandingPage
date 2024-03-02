import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-esmaltes-page',
  templateUrl: './esmaltes-page.component.html',
  styleUrls: ['./esmaltes-page.component.css']
})
export class EsmaltesPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cdnUrl = environment.CDN_URL;
  products = [
    {
      image: '/images/Esmaltes/Background-less/Esmalte-1-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-1-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-2-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-2-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-3-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-3-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-4-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-4-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-5-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-5-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-6-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-6-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-7-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-7-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-8-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-8-removebg-preview-loader.png',
      title: 'ESMALTE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    }
  ];

}
