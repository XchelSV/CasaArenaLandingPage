import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    standalone: false
})
export class MainPageComponent implements OnInit {

  constructor(private sanitizer:DomSanitizer){}

  readonly heroImageUrl = `${environment.CDN_URL}/images/banner1.png?d=600x620`;
  readonly logoImageUrl = `${environment.CDN_URL}/images/white-logo.png`;
  readonly firstSectionImageUrl = `${environment.CDN_URL}/images/home-us-1.png?d=700x720`;
  readonly secondSectionImageUrl = `${environment.CDN_URL}/images/home-us-2.png?d=700x720`;

  heroImageLoaded = false;
  logoLoaded = false;
  firstSectionImageLoaded = false;
  secondSectionImageLoaded = false;

  ngOnInit(): void {
    this.preloadHeroImage();
  }

  cdnUrl = environment.CDN_URL;
  mapsApiKey = environment.mapsApiKey;
  mapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?key="+this.mapsApiKey+"&q=Taller+de+Cerámica+Casa+Arena");

  preloadHeroImage(): void {
    const image = new Image();
    image.fetchPriority = 'high';
    image.decoding = 'async';
    image.src = this.heroImageUrl;

    if (image.complete) {
      this.heroImageLoaded = true;
      return;
    }

    image.onload = () => {
      this.heroImageLoaded = true;
    };
  }

  markImageAsLoaded(imageKey: 'logo' | 'first' | 'second'): void {
    if (imageKey === 'logo') {
      this.logoLoaded = true;
      return;
    }

    if (imageKey === 'first') {
      this.firstSectionImageLoaded = true;
      return;
    }

    this.secondSectionImageLoaded = true;
  }
}
