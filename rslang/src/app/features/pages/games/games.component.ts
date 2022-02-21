import { Component, HostListener } from '@angular/core';


import { defineLordIconElement } from "lord-icon-element";
import lottie from "lottie-web"


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent {
  iconDimension:number|undefined;
  @HostListener('window:resize', ['$event'])
  onResize() {
    defineLordIconElement(lottie.loadAnimation);
  }
  constructor( ) {
    defineLordIconElement(lottie.loadAnimation);

  }


  }
