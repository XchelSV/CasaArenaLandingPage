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

}
