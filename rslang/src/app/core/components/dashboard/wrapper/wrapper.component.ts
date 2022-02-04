import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent  {
  isExpanded: boolean = false;
  isDarkTheme:boolean = false;
  isBubble:boolean=true;

  constructor() { }



}
