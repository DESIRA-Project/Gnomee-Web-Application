import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { BackendService } from "../backend.service";
import { ResolutionAwareComponent } from "./resolutionaware.component";
import { RuntimeObjectsService } from "./runtimeobjects.service";

@Component({
    selector: 'tool-sorting',
    templateUrl: './tool-sorting.component.html',
    styleUrls:['../style/tool-sorting.css']
  })
  
export class ToolSorting extends ResolutionAwareComponent{
    dataFetched:boolean = false;
    _parent:any = null;
    options:any=[];
    selectedOption = 0;

    @Input() 
    public set parent(p: any) {
        this._parent = p;   
        this._parent.addChild(this);  
    }

    constructor(private service:BackendService,private rts:RuntimeObjectsService){
      super();
      let inst = this;

      this.rts.storeCallback("sort",(value:any)=>{
           inst.setValue(value);
          return;
      });
      
      let value = this.rts.getValue("sort");
      if(value !== null){
          this.setValue(value);
      }
      this.dataFetched = true;
    }

    private setValue(value:any){
        if(value === null) return;
        this.dataFetched = false;
        let pos:number = Number(value);
        
        if(pos >= 0 && pos < this.options.length){
          this.selectedOption = pos;
        }
        else{
          this.selectedOption = this.options.length - 1;
        }
        this.dataFetched = true;
    }

    ngOnInit() {
        this.service.getSorting().subscribe((value) => {
          if(value !== null){
            this.options = value.data;
            let v = this.rts.getValue("sort");
            //console.log(v);
            this.setValue(v);
            this.dataFetched = true;
          }
//          console.log("update sorting")
        });
      }
  

    onOptionClicked(index:number){
        this.selectedOption = index;
        this._parent.changeSortingOption(index);
    }

    update(){

    }

    ngOnDestroy(){
      this.rts.removeCallback("sort");
  }

}