import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-button-primary',
  template: '<button mat-raised-button color="primary">{{title}}</button>',

})
export class ButtonPrimaryComponent{
  @Input() title:string|undefined;
  constructor() { }



}
