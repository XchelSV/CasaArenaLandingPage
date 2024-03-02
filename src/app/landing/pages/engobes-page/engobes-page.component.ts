import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-engobes-page',
  templateUrl: './engobes-page.component.html',
  styleUrls: ['./engobes-page.component.css']
})
export class EngobesPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cdnUrl = environment.CDN_URL;
  products = [
    {
      image: '/images/Esmaltes/Background-less/Esmalte-9-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-9-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-10-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-10-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-11-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-11-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-12-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-12-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-13-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-13-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-14-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-14-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-15-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-15-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    },
    {
      image: '/images/Esmaltes/Background-less/Esmalte-16-removebg-preview.png?d=500x550',
      preview: '/images/Esmaltes/Background-less/Esmalte-16-removebg-preview-loader.png',
      title: 'ENGOBE COLOR X',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit id aliquid distinctio labore',
      price: 100
    }
  ];

}
