import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { BackendService } from "../backend.service";

@Component({
    selector: 'tool-filter-holder',
    templateUrl: './tool-filter-holder.component.html',
    styleUrls:['../style/tool-filter-holder.css']
  })

export class ToolFilterHolder{
    title = "Tool Filter Holder";
    data:any = [];
    _children:any = [];
    _parent:any = null;
    _closed:boolean = false;
    dataFetched:boolean = false;

    @Input() 
    public set parent(p: any) {
      this._parent = p;   
      this._parent.addChild(this);   
    }

    @Input()
    public set closed(c:boolean){
        this._closed = c;
    }
    
    constructor(private service: BackendService){}

    ngOnInit() {
      this.service.getData().subscribe((value) => {
        //console.log("Data should be ready");
        this.data = value;
        this.dataFetched = true;
      });
    }

    render(){
      
    }

    updateFilterValues(){
      for(let key in this.data){
      }
      console.log(this.data);
    }

   triggerChange(globalchange:any,change:any){
      this._parent.triggerChange(globalchange,change);
   }

   update(){
     this.dataFetched = false;
    //console.log("Tool Filter Holder update");
       for(let i:number = 0;i<this._children.length;i++){
           this._children[i].update();
      }
      this.service.getData().subscribe((value) => {
       // console.log("Data Update");
       this.data = value;
        this.dataFetched = true;
      });
   }

   addChild(child:any){
       this._children.push(child);      
   }

   getCurrentFilters(){
       return this._parent.getCurrentFilters();
   }
}