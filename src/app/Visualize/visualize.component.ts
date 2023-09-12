import { Component, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { PageConfigService } from "../pageconfig.service";
import { DynamicContentService } from "../ComponentLibrary/DynamicModal/dynamic-content.service";
import { DynamicHTMLContentService } from "../ComponentLibrary/DynamicModal/dynamic-html-content.service";
import { DynamicItem } from "../ComponentLibrary/DynamicModal/dynamic-item.components";
import { DynamicTooltipService } from "../ComponentLibrary/DynamicTooltip/dynamic-tooltip-service.service";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";

@Component({
    selector: 'visualize',
    templateUrl: './visualize.component.html',
    styleUrls: ['../style/visualize.css'],
    providers: [DynamicTooltipService]
})

export class VisualizeComponent implements ModalController{
    public pageData: any = null;
    private configKey: string = "visuals";
    public modalIsOpen: boolean = false;
    public item: DynamicItem|null = null;

    constructor(private configService: PageConfigService, private router: Router, private contentService: DynamicContentService,
         private htmlContentService:DynamicTooltipService) {
        
    }
    loadData(): void {
     
    }
    notifyUser(success: boolean, message: string): void {
        //do nothing
    }

    setDynamicHTMLContentService(serv:DynamicHTMLContentService): void {
      //  this.htmlContentService = serv;
    }

    getDynamicHTMLContentService(): DynamicHTMLContentService {
        //throw new Error("Method not implemented.");
        return this.htmlContentService;
    }

    public  getContentService():DynamicContentService{
        return this.contentService;
    }

    setContent(content: DynamicItem): void {
        if(content !== null){
            this.item = content;
        }
    }

    ngOnInit() {
        this.configService.getConfigData().subscribe((value) => {
            if (value === null) {
                return;
            }
            if (this.configKey in value) {
                this.pageData = value[this.configKey];
               // console.log(this.pageData);
            }
        });
    }

    openModal(){
        if(this.modalIsOpen){
            return;
        }
        this.modalIsOpen = true;
    }

    onModalClose(): Function {
        let parentRef = this;
        return (() => {
            //console.log("onDynamicModalClose");
            parentRef.modalIsOpen = false;
            //  parentRef.cookiesModalIsOpen = false;
        });
    }

}