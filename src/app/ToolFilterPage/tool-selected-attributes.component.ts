import { Component, Input } from "@angular/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { RuntimeObjectsService } from "./runtimeobjects.service";


export interface SelectedAttribute {
  attributeName:string;
  value:string,
  id:number
}

export interface SelectedQuery {
  value:string,
  type:string
}

@Component({
    selector: 'selected-attributes',
    templateUrl: './tool-selected-attributes.component.html',
  })
  
export class SelectedAttributes{
  name = "Selected Attributes"
  attributes:any = {};
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  expressions:any = null;
  _parent:any = null;
    
  @Input() 
  public set parent(p: any) {
    this._parent = p;   
    this._parent.addChild(this);  
  }
  constructor(private rts:RuntimeObjectsService){
    this.rts.storeCallback("selectedAttributes",(changes:any)=>{
        for(let i:number = 0;i<changes.length;i++){
           let found:boolean = false;
           for(let j:number = 0 ;j<this.selectedAttributes.length;j++){
              if(this.selectedAttributes[j].id === changes[i].id){
                found = true;
                continue;
              }
            }
            if(found === true) continue;
            this.selectedAttributes.push({id:changes[i].id,
                attributeName:this.capitalizeFirstLetter(changes[i].attributeName),
                value:changes[i].value});  
        }
        return;
    });
    
    this.rts.storeCallback("mobileSelectedAttributes",(value:any)=>{
//                    alert("triggered");
  //              console.log(value);
                for(let key in value){
                   let attrs = value[key];
                   for(let i:number = 0;i<attrs.length;i++){
                    this.selectedAttributes.push({id:attrs[i].id,
                      attributeName:this.capitalizeFirstLetter(attrs[i].attributeName),
                      value:attrs[i].value});  
      
                   }
                }
    });

 
  }

  selectedAttributes: SelectedAttribute[] = [];
 // selectedQueries: SelectedQuery[] = [];

  remove(attr: SelectedAttribute): void {
    const index = this.selectedAttributes.indexOf(attr);
    if (index >= 0) {
      let unselectedAttribute = this.selectedAttributes[index];
      this._parent.triggerUpdate({attributeName:this.lowerCaseFirstLetter(unselectedAttribute.attributeName),
                                  id:unselectedAttribute.id,value:unselectedAttribute.value});
      this.selectedAttributes.splice(index, 1);

    }
  }
  
  removeSearchQuery(i:number){
      this.expressions.exprs.splice(i, 1);
      this._parent.searchByQuery(this.expressions);
  }

  initializeSelectedAttributes(filters:any){
      console.log(filters);
  }

  update(){
      //console.log("Tool selected attributes component update");
      //console.log(this._parent.getLastChange())
    //  alert("add with update");
      let change:any = this._parent.getLastChange();
      this.expressions = this._parent.getExpressions();
     // console.log(this.expressions);
     // console.log(this.expressions);
/*     console.log(this._parent.getCurrentFilters());
     console.log(this.rts);*/
      if(change["added"] === true){

        //console.log(this.selectedAttributes.length);
        this.selectedAttributes.push({id:change.id,
            attributeName:this.capitalizeFirstLetter(change.attributeName),
            value:change.value});  
      }
      else{
          for(let i:number = 0;i<this.selectedAttributes.length;i++){
              let id = this.selectedAttributes[i].id;
              if(id === change.id){
                  this.selectedAttributes.splice(i,1);
                  break;
              }
          }
      }
  }

  capitalizeFirstLetter(s:string):string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  lowerCaseFirstLetter(s:string):string {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

}