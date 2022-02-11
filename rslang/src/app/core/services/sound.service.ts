import { Injectable } from '@angular/core';
import { Sounds } from '../utils/enum';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
player:HTMLAudioElement|null;
playPromise:Promise<void>|null=null;
  constructor() {
    this.player=<HTMLAudioElement>document.getElementById('soundPlayer')
   }
   async play(sound: Sounds){
    this.player=<HTMLAudioElement>document.getElementById('soundPlayer')
     if (this.player && this.playPromise==null){
     this.player.src =`assets/sounds/${sound}.mp3`;
     this.playPromise = this.player.play()
     this.playPromise.then(()=> this.playPromise=null);
     }
   }
}
