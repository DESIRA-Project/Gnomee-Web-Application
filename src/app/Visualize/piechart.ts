import {Chart} from './Chart';
import {Observable, of} from 'rxjs';
import {ModalController} from '../ComponentLibrary/DynamicModal/modal-controller';
import {ViewContainerRef} from '@angular/core';
import {Options} from 'highcharts';
import Highcharts from 'highcharts/highmaps';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

export class Piechart implements Chart {

  private readonly id: any;
  private readonly title: string;
  private data: any;
  private readonly chartOptions: Options;
  private chart: Highcharts.Chart | null = null;

  constructor(id: any, config: any, data: any) {
    NoDataToDisplay(Highcharts);

    this.id = id;
    this.title = data.title;
    this.data = data.frequencies;

    let totalCount = 0;
    for (const dataKey in this.data) {
      totalCount += this.data[dataKey];
    }

    const dataList = [];
    for (const dataKey in this.data) {
      dataList.push([dataKey, this.data[dataKey] / totalCount]);
    }

    this.chartOptions = {
      chart: {
        plotBorderWidth: 0,
        plotShadow: false,
        // spacingBottom: 0,
        // spacingTop: -500,
        marginTop: 0,
        marginBottom: 0,
        height: 200
      },
      title: {
        text: this.title ? '<p class="font-weight-light">' + this.title + '</p>' : '',
        align: 'center',
        verticalAlign: 'bottom',
        y: 17,
        // widthAdjust: -1000,
        style: {
          fontSize: '15px',
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -25,
            style: {
              fontWeight: 'bold',
              color: 'white'
            },
            filter: {
              property: 'percentage',
              operator: '>',
              value: 10
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '120%',
          colors: config.fill_colors,
          borderWidth: 0
        }
      },
      series: [{
        type: 'pie',
        name: 'Filter frequency',
        innerSize: '50%',
        data: dataList
      }],
      credits: {
        enabled: false
      },
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
