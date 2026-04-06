import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-casa-arena-footer',
    templateUrl: './casa-arena-footer.component.html',
    styleUrls: ['./casa-arena-footer.component.css'],
    standalone: false
})
export class CasaArenaFooterComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
