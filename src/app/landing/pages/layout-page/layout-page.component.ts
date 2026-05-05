import { Component } from '@angular/core';
import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout-page',
    templateUrl: './layout-page.component.html',
    styleUrls: ['./layout-page.component.css'],
    animations: [
        trigger('routeFadeAnimation', [
            transition('* <=> *', [
                group([
                    query(':leave', [
                        style({
                            position: 'absolute',
                            inset: '0',
                            width: '100%',
                            opacity: 1
                        }),
                        animate('180ms cubic-bezier(0.4, 0, 1, 1)', style({
                            opacity: 0
                        }))
                    ], { optional: true }),
                    query(':enter', [
                        style({
                            opacity: 0
                        }),
                        animate('320ms cubic-bezier(0.22, 1, 0.36, 1)', style({
                            opacity: 1
                        }))
                    ], { optional: true })
                ])
            ])
        ])
    ],
    standalone: false
})
export class LayoutPageComponent {
    prepareRoute(outlet: RouterOutlet): string {
        if (!outlet.isActivated) {
            return '';
        }

        return outlet.activatedRoute.routeConfig?.path ?? '';
    }
}
