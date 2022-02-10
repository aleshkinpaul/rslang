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
})
export class MainPageComponent {

  cards:ICardTemplate[]=[]
  @HostListener('window:resize', ['$event'])
  onResize() {
    defineLordIconElement(lottie.loadAnimation);
  }
  constructor(private ref: ChangeDetectorRef) {
    this.cards =MAIN_PAGE_CONTENT;
    defineLordIconElement(lottie.loadAnimation);
  }






  getIconPath(i:number){
    return this.cards[i].iconPath
  }
  getContent(i:number){

    return this.cards[i].description
  }


}

