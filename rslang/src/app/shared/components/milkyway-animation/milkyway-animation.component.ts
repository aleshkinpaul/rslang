import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
interface IBubble {
  x:number,
  y:number,
  diameter:number,
  duration?:number,
  amplitude?:number,
  offsetY?:number,
  arc?:number,
  startTime:number,
  color:string

}
@Component({
  selector: 'app-milkyway-animation',
  templateUrl: './milkyway-animation.component.html',
  styleUrls: ['./milkyway-animation.component.scss'],
})
export class MilkywayAnimationComponent implements OnInit {
  NUM_BUBBLES = 400;
  BUBBLE_SIZE = 0.8;
  SPEED = 20000;
  bubbles: IBubble[] = [];

  @ViewChild('milkyway', { static: false })
  canvas!: ElementRef;
  constructor() {}

  ngOnInit(): void {
    if (document.readyState !== 'loading') {
      this.startAnimation();
      } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.startAnimation();
      })
    }
  }
  startAnimation() {
    const canvas = this.initializeCanvas();
    for (let i = 0; i < this.NUM_BUBBLES; i++) {
      this.bubbles.push(this.createBubble(canvas.canvas));
    }
    requestAnimationFrame((time) => this.draw(time, canvas.canvas, canvas.ctx!));
  }
  initializeCanvas() {
    let canvas = document.getElementById('milkyway')! as HTMLCanvasElement
    canvas.width =
    canvas.offsetWidth * window.devicePixelRatio;
    canvas.height =
    canvas.offsetHeight * window.devicePixelRatio;
    let ctx = canvas.getContext('2d');
    window.addEventListener('resize', () => {
      canvas.width =
      canvas.offsetWidth * window.devicePixelRatio;
      canvas.height =
      canvas.offsetHeight * window.devicePixelRatio;
      ctx = canvas.getContext('2d');
    });
    return {canvas:canvas, ctx:ctx};

  }
  createBubble(canvas: HTMLCanvasElement):IBubble {
    const colour = {
      r: 191,
      g: 226,
      b: 255,
      a: this.rand(0, 1),
    };
    return {
      x: -2,
      y: -2,
      diameter: Math.max(
        0,
        this.randomNormal({ mean: this.BUBBLE_SIZE, dev: this.BUBBLE_SIZE / 2 })!
      ),
      duration: this.randomNormal({ mean: this.SPEED, dev: this.SPEED * 0.1 }),
      amplitude: this.randomNormal({ mean: 16, dev: 2 }),
      offsetY: this.randomNormal({ mean: 0, dev: 10 }),
      arc: Math.PI * 2,
      startTime: performance.now() - this.rand(0, this.SPEED),
      color:
        'rgba(' +
        colour.r +
        ', ' +
        colour.g +
        ', ' +
        colour.b +
        ', ' +
        colour.a +
        ')',
    };
  }
  rand(a: number, b: number) {
    return Math.random() * (b - a) + a;
  }
  randomNormal(o: { mean: number; dev: number; pool?: number[] }) {
    if (
      ((o = Object.assign({ mean: 0, dev: 1, pool: [] }, o)),
      Array.isArray(o.pool) && o.pool.length > 0)
    )
      return this.normalPool(o);
    let r,
      a,
      n,
      e,
      l = o.mean,
      t = o.dev;
    do {
      r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n;
    } while (r >= 1);
    return (e = a * Math.sqrt((-2 * Math.log(r)) / r)), t * e + l;
  }
  normalPool(o:{ mean: number; dev: number; pool?: number[] }) {
    let r = 0;
    do {
      let a = Math.round(this.normalPool({ mean: o.mean, dev: o.dev })!);
      if (a < o.pool!.length && a >= 0) return o.pool![a];
      r++;
    } while (r < 100);
    return
  }
  draw(time:number, canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D) {
    this.bubbles.forEach((bubble, index) => {
      this.bubbles[index] = this.moveBubble(bubble, canvas, time);
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bubbles.forEach((bubble) => {
      this.drawBubble(bubble, canvas, ctx);
    })
    requestAnimationFrame((time) => this.draw(time, canvas, ctx));
  }
  drawBubble(bubble:IBubble, canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D) {

    const vh = canvas.height / 100;

    ctx.fillStyle = bubble.color;
    ctx.beginPath();
    ctx.ellipse(
      bubble.x * canvas.width,
      bubble.y * vh + (canvas.height / 2),
      bubble.diameter * vh,
      bubble.diameter * vh,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
  moveBubble(bubble:IBubble, canvas:HTMLCanvasElement, time:number) {
    const progress = ((time - bubble.startTime) % bubble.duration!) / bubble.duration!;
    return {
      ...bubble,
      x: progress,
      y: ((Math.sin(progress * bubble.arc!) * bubble.amplitude!) + bubble.offsetY!),
    };
  }
}
