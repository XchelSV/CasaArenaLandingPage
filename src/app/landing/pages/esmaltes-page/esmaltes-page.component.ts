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

}
