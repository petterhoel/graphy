import {Component, effect, ElementRef, inject, input, OnInit, Renderer2} from '@angular/core';
import {bb, Chart, ChartOptions} from 'billboard.js';

@Component({
  selector: 'app-chart',
  template: '',
})
export class ChartComponent {
  element = inject(ElementRef);
  chart = input.required<ChartOptions>();
  #chart?: Chart | null;

  f = effect(() => {
    const opts = {
      ...this.chart(),
      bindto: this.element.nativeElement
    }
    if (this.#chart) {
      const data = {
        ...this.chart().data,
        append: false,
      }
      // @ts-ignore
      this.#chart.load(data);
      return;
    }
    opts.size ={ width: 600, height: 400 };
    this.#chart = bb.generate(opts)
  })
}
