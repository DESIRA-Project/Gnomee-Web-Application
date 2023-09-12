import {Chart} from './Chart';
import {Observable, of} from 'rxjs';
import {ModalController} from '../ComponentLibrary/DynamicModal/modal-controller';
import {ViewContainerRef} from '@angular/core';
import {Options} from 'highcharts';
import Highcharts from 'highcharts/highmaps';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

export class HorizontalBarchart implements Chart {

  private config: any;
  private readonly id: any;
  private readonly data: any;
  private readonly chartOptions: Options;
  private chart: Highcharts.Chart | null = null;

  constructor(id: any, config: any, data: any) {
    NoDataToDisplay(Highcharts);

    this.id = id;
    this.config = config;
    this.data = data;

    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: Object.keys(this.data),
        title: {
          text: null
        }
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: '',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      // tooltip: {
      //   valueSuffix: ' millions'
      // },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        maxPointWidth: 45,
        showInLegend: false,
        name: '',
        type: 'bar',
        color: this.config.fill_color,
        data:  Object.keys(this.data).map(key => this.data[key])
      }],
      lang: {
        noData: 'No data to display'
      }
    };
  }

  draw(): void {
    this.chart = Highcharts.chart(this.id, this.chartOptions);
  }

  isReady(): Observable<boolean> { return of(true); }
  setParent(parent: ModalController): void {}
  resize(): void {}
  handleDynamicContent(view: ViewContainerRef): void {}

}
