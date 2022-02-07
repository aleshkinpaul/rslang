import { Component, HostListener, OnInit } from '@angular/core';

import { defineLordIconElement } from "lord-icon-element";
import lottie from "lottie-web"


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit{
  iconDimension:number|undefined;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.defineIonDimensions()
  }
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
  ngOnInit(): void {
    this.defineIonDimensions()
  }
  defineIonDimensions(){
    const width = document.getElementById('defineBackground')?.getBoundingClientRect().width
    this.iconDimension = width!*0.8;
  }

  }
