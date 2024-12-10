import {Component, effect, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {rxResource} from '@angular/core/rxjs-interop';
import { ChartOptions, line} from 'billboard.js';
import {ChartComponent} from './chart.component';
import {map} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [ChartComponent],
  styles: `
    :host {
      display: inline-block;
      padding: 2rem;
      max-width: 100vw;

      #datagrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        max-width: 100vw;
      }
    }
  `,
  template: `
    <h1>Grafer</h1>

    <div id="datagrid">

      <div>
        <h2>films {{ films.isLoading() ? 'laster...' : '' }}</h2>
        <app-chart [chart]="filmsChart()"/>
        <button (click)="films.reload()">reload</button>
      </div>

      <div>
        <h2>species {{ species.isLoading() ? 'laster...' : '' }}</h2>
        <app-chart [chart]="speciesChart()"/>
        <button (click)="species.reload()">reload</button>
      </div>

    </div>
  `,
})
export class AppComponent  {

  url = `https://swapi.dev/api/`
  http = inject(HttpClient);

  speciesChart = signal<ChartOptions>( {
    data: {
      columns: [],
      type: line(),
    },
  });

  filmsChart = signal<ChartOptions>( {
    data: {
      columns: [],
      type: line(),
    },
  });

  films = rxResource({
     loader: () => this.http.get(`${this.url}/films`)
       .pipe(
         map((data) =>{
           // @ts-ignore
           return data.results.map((r) => +r.characters.length)
         })
       )
   })

  species = rxResource({
    loader: () => {
      return this.http.get(`${this.url}/species`)
        .pipe(
          map((data) =>{
            // @ts-ignore
            return data.results.filter(({average_height}) => !isNaN(+average_height) ).map((r) => +r.average_height)
          })
        );
    },
  })

  filmData = effect(() => {
    const columns = this.films.hasValue() ? [['characters in film', ...this.films.value()]] : [[]]
    this.filmsChart.set({
      data: {
        columns,
        type: line(),
      }
    })
  })

  speciesData = effect(() => {
    const columns = this.species.hasValue() ? [['species', ...this.species.value()]] : [[]]
    this.speciesChart.set({
      data: {
        columns,
        type: line(),
      }
    })
  })
}
