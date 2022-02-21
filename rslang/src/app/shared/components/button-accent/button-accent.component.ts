import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-button-accent',
  template: '<button mat-raised-button color="accent">{{title}}</button>'

})
export class ButtonAccentComponent {
  @Input() title:string|undefined;
  constructor() { }


}
