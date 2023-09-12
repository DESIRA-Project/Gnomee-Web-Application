import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ResolutionAwareComponent } from "./resolutionaware.component";
import { RuntimeObjectsService } from "./runtimeobjects.service";

@Component({
    selector: 'tool-result-size-setter',
    templateUrl: './tool-result-size-setter.component.html',
    styleUrls:['../style/tool-result-size-setter.css']
  })
  
export class ToolResultSizeSetter extends ResolutionAwareComponent{
    data:any = [];
    dataFetched:boolean = false;
    _parent:any = null;
    options=[10,20,25];
    selectedOption = 0;

    @Input() 
    public set parent(p: any) {
        this._parent = p;   
        this._parent.addChild(this);  
    }

    constructor(private rts:RuntimeObjectsService){
        super();
        let inst = this;
        this.rts.storeCallback("results",(value:any)=>{
             inst.setValue(value);
            return;
        });
        
        let value:any = this.rts.getValue("results");
        if(value !== null){
            this.setValue(value);
        }
        this.dataFetched = true;
    }

    private setValue(value:any){
        this.dataFetched = false;
        let pos:number = this.options.indexOf(Number( value) );

        if(pos !== -1){
            this.selectedOption = pos;
        }
        this.dataFetched = true;
    }

    onOptionClicked(index:number){
        this.selectedOption = index;
        this._parent.changeAmountOfResults(this.options[index]);
    }

    update(){

    }

    setSelection(){

    }

    ngOnDestroy(){
        this.rts.removeCallback("results");
    }


}