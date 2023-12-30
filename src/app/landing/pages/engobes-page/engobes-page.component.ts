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

}
