import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { MatSelectionListChange } from "@angular/material/list/selection-list";
import { Router } from "@angular/router";
import { BackendService } from "../backend.service";
import { PageConfigService } from "../pageconfig.service";

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['../style/contact.css'],
})

export class ContactComponent {
    configKey:string = "contact";
    pageData:any = null;
    data = {};

    constructor(private service: BackendService,private configService:PageConfigService,private router: Router) {

    }

    private loadConfig(){
        this.configService.getConfigData().subscribe((value) => {
            if(value === null){
                return;
            }
            if(this.configKey in value){
                this.pageData = value[this.configKey];
            }
        });
    }

    ngOnInit(){

        this.service.isInitialized().subscribe((init)=>{
            if(init !== true){
                return;
            }
            this.service.fetchContactForms((value:any)=>{
                this.loadConfig();
            });
            this.service.getContactForms().subscribe((contactData)=>{
                if(contactData === null){
                    return;
                }
                this.data = contactData;
            })
  
        });
    }
}