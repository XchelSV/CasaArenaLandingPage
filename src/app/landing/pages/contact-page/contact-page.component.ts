import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  name = '';
  message = '';
  cdnUrl = environment.CDN_URL;

  openWhatsApp() {
    const encodedMessage = encodeURI(this.message);
    const url = `https://wa.me/${environment.WHATSAPP_SOURCE_MOBILE}?text=${encodedMessage}`;
    window.open(url, '_blank')?.focus();
    this.name = '';
    this.message = '';
  }

}
