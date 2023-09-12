import { Component, HostListener, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "../backend.service";
import { GeoCountryService } from "../geocountry.service";
import { PageConfigService } from "../pageconfig.service";
import { ChartFactory } from "./chart-factory";
import { Chart } from "./Chart";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";
import { DynamicTooltipService } from "../ComponentLibrary/DynamicTooltip/dynamic-tooltip-service.service";
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from "@angular/platform-browser";

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['../style/charts.css'],
    providers: []
})

export class ChartContainerComponent {
    public chartConfig: any = null;
    public data: any = null;
    private chart: Chart | null = null;
    public chartIsReady: boolean = false;
    private viewReady: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    private chartReadyToRender: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    public parent: ModalController | null = null;
    public file: any = null;
    public fileResource: SafeResourceUrl | null = null;
    @ViewChild('view', { read: ViewContainerRef }) currentView: ViewContainerRef | undefined;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (this.chartIsReady && this.chart !== null) {
            this.chart.resize();
        }
    }

    @Input()
    public set parentRef(parent: ModalController) {
        this.parent = parent;
    }

    /*    colorSvg(){
            let doc:HTMLObjectElement = <any>document.getElementById(this.chartConfig.id+"_icon");
            if(doc !== null){
                if(doc.contentDocument !== null){
                    let svg = doc.contentDocument;
                    svg.querySelector("svg") ?.setAttribute("fill",this.chartConfig.fill_color)
                }
            }
        }*/

    public getFileURL(s: string): SafeResourceUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(s);
    }

    @Input()
    public set chartConfiguration(chartConfig: any) {
        this.chartConfig = chartConfig;
        //console.log(this.chartConfig.data_service);

        if (this.chartConfig.shared === true) {
            if (this.chartConfig.file !== undefined) {
                this.fileResource = this.getFileURL("/" + this.chartConfig.file);
                //console.log(this.fileResource);
                this.file = this.chartConfig.file;
            }
            this.backend.fetchChartDataOnce(this.chartConfig.data_service, (data: any) => {
                console.log('chartConfig');
                console.log(chartConfig);
                console.log("SHARED");
                console.log('data');
                console.log(data);
                let attr = chartConfig.attribute;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].attribute === attr) {
                        this.data = data[i];
                        break;
                    }
                }
                if (this.data === null) return;
                //this.data = data;
                //console.log(this.data);
                let chf = new ChartFactory();
                let c = this.chart = chf.create(chartConfig, this.data);
                if (c !== null) {
                    let inst = this;

                    inst.chart?.isReady().subscribe((ready) => {
                        if (ready === null || ready === false) {
                            return;
                        }
                        inst.chartIsReady = true;
                        inst.chartReadyToRender.next(true);
                    });
                }
            });
            return;
        }
        else {
            this.backend.fetchChartData(this.chartConfig.data_service, this.chartConfig.data_service_parameters ?? '',
              (data: any) => {
                this.data = data;
                //console.log(this.data);
                let chf = new ChartFactory();
                let c = this.chart = chf.create(chartConfig, data);

                console.log('chartConfig');
                console.log(chartConfig);
                console.log("NOT SHARED");
                console.log('data');
                console.log(data);
                if (c !== null) {
                    let inst = this;
                    inst.chart?.isReady().subscribe((ready) => {
                        if (ready === null || ready === false) {
                            return;
                        }
                        inst.chartIsReady = true;
                        inst.chartReadyToRender.next(true);

                    });
                }
            });
        }

    }

    constructor(private backend: BackendService, public tooltip: DynamicTooltipService, protected _sanitizer: DomSanitizer) {
        let inst = this;
        this.chartReadyToRender.subscribe((val) => {
            if (!val) {
                return;
            }
            if (inst.chartIsReady === true && inst.chart !== null) {
                inst.chart.draw();
                if (this.parent !== null) {
                    inst.chart.setParent(this.parent);
                    if (this.currentView !== undefined)
                        inst.chart.handleDynamicContent(this.currentView);
                }
            }

        });
    }

    ngAfterViewInit() {
        //console.log(this.currentView)
        this.viewReady.next(true);
        return;
    }

}
