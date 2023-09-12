import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../backend.service";
import { ResolutionAwareComponent } from "../ToolFilterPage/resolutionaware.component";

@Component({
    selector: 'tool-details',
    templateUrl: './tool-details.component.html',
     styleUrls: ['../style/tool-details.css'],
    providers: []
})

export class ToolDetails extends ResolutionAwareComponent{
    data:any = null;
    @Input()  pageData:any = null;

    constructor(private service:BackendService){
        super();
    }

    ngOnInit(){
        this.service.getData().subscribe((value)=>{
             if(value !== null){
                 this.data = value;
             }
            console.log('toolDetails');
            console.log('data');
            console.log(this.data);
            console.log('pageData');
            console.log(this.pageData);
        });
    }
}
