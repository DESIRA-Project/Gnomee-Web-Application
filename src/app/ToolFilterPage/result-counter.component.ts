import { Component, HostListener, Input } from "@angular/core";
import { BackendService } from "../backend.service";

@Component({
    selector: 'result-counter',
    templateUrl: './result-counter.component.html',
    styleUrls:['../style/advanced-search.css']
  })

export class ResultCounter{
    _parent:any = null;
    amountOfResults = -1;

    @Input() 
    public set parent(p: any) {
        this._parent = p;   
        this._parent.addChild(this);  
    }
    
    constructor(private service:BackendService){
      this.setupResultCountListener();
    }

    private setupResultCountListener(){
        this.service.getTotalAmountOfResults().subscribe((value)=>{
             if(value === null) return;
             if(value !== -1){
               this.amountOfResults = value;
             }
        });
    }

}