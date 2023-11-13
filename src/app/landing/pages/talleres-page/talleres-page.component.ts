import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-talleres-page',
  templateUrl: './talleres-page.component.html',
  styleUrls: ['./talleres-page.component.css']
})
export class TalleresPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cdnUrl = environment.CDN_URL;
  
  openWhatsApp(index: string) {
    const messages: any = {
      "torno": "¡Hola!\nQuisiera solicitar mas información respecto a las clases de cerámica en torno.",
      "manual": "¡Hola!\nQuisiera solicitar mas información respecto a las clases de cerámica en construcción manual."
    };
    const encodedMessage = encodeURI(messages[index]);
    const url = `https://wa.me/${environment.WHATSAPP_SOURCE_MOBILE}?text=${encodedMessage}`;
    window.open(url, '_blank')?.focus();
  }

}
