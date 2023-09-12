import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../backend.service";
import { PageConfigService } from "../pageconfig.service";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";
import { Location } from '@angular/common';
import {my180RotationTrigger, myInsertRemoveTrigger} from './custom-animations';

@Component({
    selector: 'tool-detailed-view',
    templateUrl: './tool-detailed-view.component.html',
    styleUrls: ['../style/advanced-search.css','../style/tool-detailed-view.css'],
    providers: [],
    animations: [myInsertRemoveTrigger, my180RotationTrigger]
})

export class ToolDetailedViewComponent extends ResolutionAwareComponent{
    title = "Tool detailed View Component"
    data = {}
    toolId: string | null = null;
    configKey = "tool_details";
    pageData:any = null;
    dataFetched = false;
    isMapReady = false;
    startTime = performance.now();
    mapRenderingTime = 0;
    isEmpty:boolean = false;
    showAdditionalInfo = false;

    constructor(private service: BackendService, private route: ActivatedRoute, private pageService:PageConfigService,
        private location: Location) {
        super();
    }

    ngOnInit() {

        this.service.isInitialized().subscribe((initializationDone) => {
            if (initializationDone === true) {
                this.route.paramMap.subscribe((m) => {
                    this.toolId = m.get("id");
                    if (this.toolId) {
                        let params = { id: this.toolId };
                        this.service.fetchToolDetails(params, () => {
                            console.log(params);
                            this.isEmpty = false;
                            this.dataFetched = true;
                        },()=>{
                            this.isEmpty = true;
                            this.dataFetched = true;
                        });
                    }
                });
            }
        });


        this.pageService.getConfigData().subscribe((value)=>{
                if (value === null) {
                  return;
                }
                if (this.configKey in value) {
                     this.pageData = value[this.configKey];
                }
        });
    }

    public countryMapEndRendering(){
        var endTime = performance.now()

        console.log(`Call to doSomething took ${endTime - this.startTime} milliseconds`);
        this.mapRenderingTime = endTime - this.startTime;
        this.isMapReady = true;
    }

    goBack(){
        this.location.back();
    }

    canGoBack(){
        return history.length > 2;
    }


}
