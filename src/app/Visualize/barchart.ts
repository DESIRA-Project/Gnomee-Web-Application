import { ChartFactory } from "./chart-factory";
import { Chart } from "./Chart";
import { shadeColor } from "./visual-utilities";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";
import { ViewContainerRef } from "@angular/core";
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';


import Highcharts, { Options, Tooltip, TooltipFormatterContextObject } from "highcharts/highmaps";
import {TooltipMode} from './TooltipMode';

interface TwoDimObject{
    x:any,
    y:any
};


export class Barchart implements Chart{
    private margin = 35;
    private width = 750 - (this.margin * 2);
    private height = 300 - (this.margin * 2);
    private extraHeightSpacing = 100;
    private chartReady: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    private config:any = null;
    private data:any = null;
//    private parent:any = null;

    private map: Highcharts.Chart | null = null;
    private chartOptions!: Options;

    constructor(config:any, data:any, tooltipMode = TooltipMode.Dashboard){
        this.config = config;
        this.data = data;
        NoDataToDisplay(Highcharts);
        this.render(tooltipMode);
    }
    handleDynamicContent(view: ViewContainerRef): void {
      //  throw new Error("Method not implemented.");
    }
    resize(): void {
        //clean first
        //console.log("resize barchart");
        /*
        if(this.config !== null){
            let e = document.getElementById(this.config.id);
            if(e !== null){
                e.innerHTML = "";
                this.render();
            }
        }*/
        //call render
    }

    setParent(parent: ModalController): void {
       // this.parent = parent;
    }

    draw() {
        this.map = Highcharts.chart(this.config.id, this.chartOptions, () => {
          // console.log("Barchart Ready");
          this.map?.redraw(true);
        });
      }

    isReady(): Observable<boolean> {
        return this.chartReady.asObservable();
    }

    private render(tooltipMode: TooltipMode):any{
        //let obs:TwoDimObject[] = [];
        // console.log(this.data.data)
        let keys = Object.keys(this.data.data);
        let xValues = [];
        let yValues:Array<any> = [];

        for(let i = 0;i<keys.length;i++){
            xValues.push(keys[i]);
            yValues.push(parseInt( this.data.data[keys[i]] ));
        }
        //console.log(yValues);

        this.chartOptions = {
            chart: {
                type: 'column',
             //   height: "60%"
            },
            title: {
                text: ''
            },/*
            subtitle: {
                text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
            },*/
            xAxis: {
                categories: xValues,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ""
                }
            },
            tooltip: {
              formatter: function(): string{
                switch (tooltipMode) {
                  case TooltipMode.Dashboard: {
                    return this.y + ' Tools use ' + this.x;
                  }
                  case TooltipMode.Analytics: {
                    return this.y + ' Searches used ' + this.x;
                  }
                }
                },
               valueSuffix: ' '
            },

            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    showInLegend:false,
                    minPointLength: 3
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                type:"column",
                data:yValues,
                color:this.config.fill_color
                }
            ],
          lang: {
            noData: 'No data to display'
          }
        };


        this.chartReady.next(true);

    }

}
