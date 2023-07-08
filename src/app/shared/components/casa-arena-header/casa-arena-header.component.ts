import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-casa-arena-header',
  templateUrl: './casa-arena-header.component.html',
  styleUrls: ['./casa-arena-header.component.css']
})
export class CasaArenaHeaderComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit(): void {
  }

}
