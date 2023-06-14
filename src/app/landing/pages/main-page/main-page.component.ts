import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private sanitizer:DomSanitizer){}

  ngOnInit(): void {
  }

  mapsApiKey = environment.mapsApiKey;
  mapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?key="+this.mapsApiKey+"&q=Taller+de+Cerámica+Casa+Arena");
  
}
