import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnChanges, OnInit } from '@angular/core';
import { defineLordIconElement } from 'lord-icon-element';
import lottie from "lottie-web";
import { MAIN_PAGE_CONTENT } from 'src/app/core/constants/constant';
interface ICardTemplate {
  id:number,
  title:string,
  iconPath:string,
  description:string,
  buttonTitle:string,
  routerLink: string
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit, AfterViewInit {
  iconDimension:number|undefined;
  cards:ICardTemplate[]=[]
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.defineIconDimensions()
  }
  constructor(private ref: ChangeDetectorRef) {
    this.cards =MAIN_PAGE_CONTENT;
    defineLordIconElement(lottie.loadAnimation);
  }

  ngOnInit() {
    defineLordIconElement(lottie.loadAnimation);
console.log(6)

  }


  ngAfterViewInit(){
    this.cards =MAIN_PAGE_CONTENT;
    this.defineIconDimensions()
    this.ref.detectChanges()

  }
  defineIconDimensions(){
    const width = document.getElementById('defineBackgroundMainPage')?.getBoundingClientRect().width
    this.iconDimension = width!*0.8;
  }
  getIconPath(i:number){
    return this.cards[i].iconPath
  }
  getContent(i:number){

    return this.cards[i].description
  }


}

