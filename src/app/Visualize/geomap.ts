//import Highcharts from 'highcharts';
// Alternatively, this is how to load Highstock. Highmaps and Highcharts Gantt are similar.
// import Highcharts from 'highcharts/highstock';

// Load the exporting module.
//import * as Highcharts from 'highcharts';


// Generate the chart
import Highcharts, { Options } from 'highcharts/highmaps';
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import { Chart } from './Chart';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalController } from '../ComponentLibrary/DynamicModal/modal-controller';
import { DynamicItem } from '../ComponentLibrary/DynamicModal/dynamic-item.components';
import { ViewContainerRef } from '@angular/core';


export enum Mode {
  Dashboard,
  AnalyticsVisitorCountries
}

export class Geomap implements Chart {

  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  private chartOptions!: Options;
  private map: Highcharts.MapChart | null = null;
  private config: any = null;
  private chartReady: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  private parent: ModalController | null = null;
  private readonly mode: Mode;
  private id: any;

  constructor(config: any, data: any, id: any = null, mode: Mode = Mode.Dashboard) {

    this.mode = mode;
    if (this.mode === Mode.AnalyticsVisitorCountries) {
      this.id = id;
    }
    else if (this.mode === Mode.Dashboard) {
      this.id = config.id;
    }

    this.render(config, data);
  }
  handleDynamicContent(view: ViewContainerRef): void {
    // throw new Error("Method not implemented.");
  }

  resize(): void {
    //clean first
    //call render
  }


  isReady(): Observable<boolean> {
    return this.chartReady.asObservable();
  }

  setParent(parent: ModalController): void {
    this.parent = parent;
  }


  private prepareData(_data: any, onFinish: Function) {
    onFinish(_data);
  }

  private render(config: any, _data: any) {

    let inst = this;

    let onClick: any;
    let joinByOption: any;

    if (this.mode === Mode.Dashboard) {
      joinByOption = 'hc-key';

      onClick = (e: any) => {
        if(e.point.options.value <= 0){
          return;
        }
        let index = e.point.index;
        let id = _data.mappedAttributes[index].id;
        if(id === undefined){
          return;
        }
        let content:DynamicItem|undefined = inst.parent?.getContentService().getToolListingComponent();
        //construct data for dynamic view
        let objectData = {id:id, name:e.point['name']};
        if(content !== undefined){
          content?.setData(objectData);
          inst.parent?.setContent(content);
          inst.parent?.openModal();
        }
      };
    }

    else if (this.mode === Mode.AnalyticsVisitorCountries) {
      joinByOption = ['iso-a2', 'code'];
      onClick = () => {};
    }


    /*    let cp = [];
        let k:string = "";
        console.log(_data);
        for(k in _data.data){
          console.log(_data.data[k]);
          if(_data.data[k][1] === 0){
            continue;
          }
          cp.push ( _data.data[k] );
        }
    //    console.log(_data.data);

    _data.data = cp;
    console.log(_data.data);
    */

//console.log(_data.data);

    this.chartOptions = {
      chart: {
        map: worldMap,
        height: config.height ? config.height : undefined,
        //height: (10 / 16 * 100) + '%',
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
      },
      title: {
        text: config.title
      },
      subtitle: {
        text: config.subtitle
        //                'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox'
        }
      },
      legend: {
        enabled: true
      },
      colorAxis: {
        min: 0
      },
      series: [
        {
          joinBy: joinByOption,
          point: {
            events: {
              click: onClick,
            }
          },
          type: 'map',
          name: config.series.name,
          states: {
            hover: {
              color: config.states.hover.color
            },
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
          allAreas: true,
          data: _data.data
        }
      ],
      credits: {
        enabled: false
      }
    };

    this.config = config;
    this.chartReady.next(true);
  }

  draw() {
    this.map = Highcharts.mapChart(this.id, this.chartOptions, () => {
      console.log('Map Ready');
      this.map?.redraw(true);
    });
  }
}
