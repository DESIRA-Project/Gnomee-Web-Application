import Highcharts, { BoostDebugOptions, Options } from "highcharts/highmaps";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";

import { Component, Input, ViewContainerRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../backend.service";
import { BehaviorSubject, Observable } from "rxjs";

export enum Region {
  europe,
  africa,
  latinAmerica,
  centralAmerica,
  balticStates
};


@Component({
    selector: 'country-map',
    templateUrl: './country-map.component.html',
    styleUrls: ['../style/tool-detailed-view.css'],
    providers: []
})

export class CountryMapHighChart {
    _parent:any = null;
   el:any = null;
   features:any[] = [];
   countries:any = [];
   readyToRenderMap:boolean = false;
   startTime = 0;
    
    @Input() 
    public set parent(p: any) {
      this._parent = p; 
    }

    private chartOptions!: Options;
    private map: Highcharts.MapChart | null = null;
    private config: any = null;
    private chartReady: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    private sub: any = null;
    private firstId:string|null = null;

    constructor(/*config: any, data: any*/private backend:BackendService) {

        this.sub = this.backend.getData().subscribe((data)=>{
          //console.log(data);
            for(let i:number = 0;i<data.length;i++){
              if(data[i].data.attribute === 'countryRegions'){
                   this.countries = data[i].data.data;
                }
            }
        });

    }

    ngOnInit(){
      this.render(this.config, this.countries);
    }


    ngOnDestroy(){
        if(this.sub){
            this.sub.unsubscribe();
        }
    }
    handleDynamicContent(view: ViewContainerRef): void {
     // throw new Error("Method not implemented.");
    }
  
    resize(): void {
      //clean first
      //call render
    }  
  
    private prepareData(_data: any, onFinish: Function) {
      onFinish(_data);
    }
  
    private render(config: any, _data: any) {
      let inst = this;
      let dataToRender = [];

     for(let i = 0;i<_data.length;i++){
        let l = _data[i];
        let o = {"id":i.toString(), "code":l,"value":0};
        if( i === 0){
          this.firstId = i.toString();
        }
        dataToRender.push(o);
      }

      let dbg:BoostDebugOptions = {timeRendering:true, showSkipSummary:true,
        timeBufferCopy:true, timeKDTree:true,timeSeriesProcessing:true, timeSetup:true
      };
      
      this.chartOptions = {
        chart: {
          map: worldMap,
          //height: (10 / 16 * 100) + '%',
/*          spacingBottom: 0,
          spacingTop: 0,
          spacingLeft: 0,
          spacingRight: 0,
          marginBottom: 0,
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0
          ,*/
          animation:false
        },
        
        boost: {
          useGPUTranslations: true,
//          debug:dbg,
          enabled:true
      },
        title: {
          text: ""
        },
        subtitle: {
          text: ""
          //                'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: "spacingBox"
          }
        },
        legend: {
          enabled: false
        },
        colorAxis: {
          min: 0
        },
        tooltip:{
             enabled:false
        },
        series: [
          {
            enableMouseTracking:false,
            animation:false,
            dataLabels:{
              enabled:true,
              format:"{point.name}"
            },
            point: {
              
            },
            type: "map",
            name: "",
            states: {
              hover: {              
                color: ""
              },
            },
            allAreas: true,
            data: dataToRender,
            joinBy: ['hc-key', 'code'],
          }
        ]
      };
  
    //  this.config = config;
      setTimeout(()=>{
        console.log("timeout called")
        inst.draw();
        console.log("draw after call")

    },10);

    }
  
    draw() {
      //console.log("draw")
      this.startTime = performance.now();

      let p = this;
      console.log("draw start");

      this.map = Highcharts.mapChart("map", this.chartOptions, (c) => {

        p.chartReady.next(true);
        p.readyToRenderMap = true;

        var endTime = performance.now();

        console.log("Highcharts Map Ready");
      //  c.redraw(true);
  
        if(p.firstId !== null && p.firstId !== undefined){
            let e =  <Highcharts.Point>c.get(p.firstId);
            if(e !== undefined){
                e.zoomTo();
                c.mapZoom(1.5);
                c.mapZoom(1.5);  
                c.mapZoom(1.5);  
            }
        }

        console.log(`Call to draw took ${endTime - this.startTime} milliseconds`);


      });

      console.log("draw called");
    }
}

