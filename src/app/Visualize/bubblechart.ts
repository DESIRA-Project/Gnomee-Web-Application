declare var require: any;

import { BehaviorSubject, Observable } from "rxjs";
import { Chart } from "./Chart";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";
import { Options, TooltipFormatterCallbackFunction } from "highcharts";

import * as Highcharts from 'highcharts';
import { ViewContainerRef } from "@angular/core";
import { DynamicHTMLContentService } from "../ComponentLibrary/DynamicModal/dynamic-html-content.service";
import { DynamicComponent } from "../ComponentLibrary/DynamicModal/dynamic-component";
import { environment } from 'src/environments/environment';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

//import * as HighchartsMore from "highcharts/highcharts-more";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);

export class Bubblechart implements Chart {
    private chartReady: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    private config:any = null;
    private data:any = null;
    private chartOptions: any = null;
    private chart: any | null = null;
    private dynHTMLContentService: DynamicHTMLContentService|undefined;
    private dynComponent:DynamicComponent|null = null;
    private bubbleTitleThreshold:number = 5;
    //private lastTarget:any = null;

    constructor(config: any, data: any){
      NoDataToDisplay(Highcharts);

      this.config = config;
      this.data = data;
      this.render();
    }

    private groupByValueCounts(data:any){

        let results = [];
        for(let k in data){
            let l = data[k];
            for(let i = 0;i<l.length;i++){
                let deduced:boolean = false;
                let name = l[i].name;
                l[i]['full'] = name;
                if(name.indexOf(" ") !== -1){
                    name = name.split(" ")[0];
                    deduced = true;
                }
                if(name.length > this.bubbleTitleThreshold){
                    name = name.substring(0, this.bubbleTitleThreshold);
                    deduced = true;
                }
                if(deduced === true){
                    name += "...";
                }
                l[i]['name'] = name;
            }
            results.push({name: k,data:l});
        }
        return results;
    }

    openToolPage(toolId:string){
        let prefix = environment.env.search_page.kbt.link;
/*        let host = window.location.host;
        let port =  window.location.port;
        let protocol = window.location.protocol;
        */
       if(toolId.indexOf(" ") !== -1){
            toolId = '"' + toolId + '"';
       }
        let url = prefix+environment.env.tool_details.search_url+"?term="+toolId;
        //console.log(url);

        let handle = window.open(url, '_blank');
        if(handle !== null){
            handle.focus();
        }
    }


    private render():void{
       let series:any = this.groupByValueCounts(this.data.data)
       let inst = this;

       const chartOptions:Options = {
        plotOptions: {
            packedbubble: {
           //     useSimulation:false,
                minSize: '40%',
                maxSize: '120%',
              //  zMin: 0,
               // zMax: 1000,
                layoutAlgorithm: {
/*                    splitSeries: "false",
                    gravitationalConstant: 0.02*/
                    bubblePadding:20,
                    maxSpeed:50
                },
                dataLabels: {
                    enabled: true,
                    format: `{point.name}`,
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 0
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                },events:{
                    click: function(p:any) {
                        inst.openToolPage(p.point.full);
/*                        if(inst.lastTarget === null){
                            inst.lastTarget = p.target;
                        }
                        else{
                            //search keyword
                            if(inst.lastTarget !== p.target){
                                inst.lastTarget = p.target;
                                inst.openToolPage(p.point.full);
                            }
                            else{
                                inst.openToolPage(p.point.full);
                            }
                        }*/

/*                        this.chart.update({
                            tooltip: {
                                enabled: true,
                                pointFormat:"{point.full}:{point.value}<br/>Click & search for Tools relevant to '{point.full}'"
                            }
                        });*/
                    },
                    mouseOut:function(){
                        //inst.lastTarget = null;
                        this.chart.update({tooltip:{enabled:true,pointFormat:'{point.full}:{point.value}'}})
                    },
                    mouseOver:function(){
                        //inst.lastTarget = null;
                        this.chart.update({tooltip:{enabled:true,pointFormat:"{point.full}:{point.value}<br/>Click & search for Tools relevant to '{point.full}'"}})
                    }

                }
            }
        },
            chart: {
                type: 'packedbubble',
                height: "500px"
            },
            title: {
                text: ''
            },
            tooltip: {
                useHTML: true,
                pointFormat: '{point.full}:{point.value}',
            },
            series: series,
            credits: {
              enabled: false
            },
            lang: {
              noData: 'No data to display'
            }
        };

        this.chartOptions = chartOptions;


        this.chartReady.next(true);

    }

    draw(): void {
        this.chart =  Highcharts.chart(this.config.id, this.chartOptions, () => {
            console.log("Map Ready");
            this.chart?.redraw(true);
          });
    }
    isReady(): Observable<boolean> {
        return this.chartReady;
    }
    setParent(parent: ModalController): void {
        this.dynHTMLContentService = parent.getDynamicHTMLContentService();
    }
    resize(): void {

    }

    handleDynamicContent(view: ViewContainerRef): void {
        if(this.dynHTMLContentService !== undefined){
            this.dynHTMLContentService.setRootViewContainerRef(view);
            this.dynHTMLContentService.addDynamicComponent();

            this.dynComponent = this.dynHTMLContentService.getDynamicComponent();
        }
    }



}
