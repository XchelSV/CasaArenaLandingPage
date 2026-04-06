import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-casa-arena-header',
    templateUrl: './casa-arena-header.component.html',
    styleUrls: ['./casa-arena-header.component.css'],
    standalone: false
})
export class CasaArenaHeaderComponent implements OnInit {

  readonly cartCount$: Observable<number> = this.cartService.cartCount$;

  constructor(private router: Router, private cartService: CartService){}

  ngOnInit(): void {
  }

}
