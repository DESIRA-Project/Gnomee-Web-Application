import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../backend.service";

export interface Attribute{
   id:string,
   name:string,
   color:string
};

export interface AttributeList{
  attributeName:string,
  queryKey:string,
  values:Attribute[]
};

@Component({
  selector: 'application-scenario-holder',
  templateUrl: './application-scenario-holder.component.html',
  styleUrls: ['../style/tool-detailed-view.css'],
  providers: []
})

export class ApplicationScenarioHolderComponent {
    _parent:any = null;
    appScenarioData:any = null;
    attributeList:AttributeList[] = [];
    initialized:boolean = false;
    categoryColors:any = null;

    @Input()  pageData:any = null;

    @Input()
    public set parent(p: any) {
      this._parent = p;
    }

    @Input() onlyShowTaxonomyLevel: number | undefined;

    constructor(private service:BackendService){
      this.attributeList = [] as AttributeList[];
    }

    ngOnInit(){
      if(this._parent.dataFetched){
          this.service.getData().subscribe((value)=>{

            for(let i:number = 0;i<value.length;i++){
                  if(value[i].data.type === 'tree'){
                    this.appScenarioData = value[i].data;
                    this.categoryColors = this.pageData.category_colors;
//                    console.log(this.categoryColors);
                    break;
                  }
              }
              this.constructAttributeLists(()=>{
                  this.initialized = true;
              });
          });
      }
  }

  private constructAttributeLists(onFinish:Function){
       let levels = this.appScenarioData.attribute;
    //   console.log(this.appScenarioData);
       for(let i:number = 0;i<levels.length;i++){
           let attrList = {attributeName: this.appScenarioData.repr[i],values:[],queryKey:this.appScenarioData.attribute[i]} as AttributeList;
           this.attributeList?.push(attrList);
       }

       this.treeNodeVisitor(this.appScenarioData.data, 0, levels.length, this.appScenarioData.mappedAttributes, onFinish);
  }

  private treeNodeVisitor(node:any, level:number, maxLevel:number, mappedAttributes:any, onFinish:Function){
      this.visitTreeNodes(node, level, maxLevel,mappedAttributes, "");
      if(onFinish){
          onFinish();
      }
  }

  private visitTreeNodes(node:any, level:number, maxLevel:number, mappedAttributes:any, category:string){
//      let categoryColors = ["red","green","yellow"];
      //let categoryColors:any = {"Rural Areas": "red","Forestry" : "green","Agriculture": "yellow"};

//rural areas : #aed45f
//agriculture: #2b2a28
//forestry: #877131
      if(typeof node === 'string'){
          let list = this.attributeList[level].values;
          list.push({id:node, name:mappedAttributes[node], color:this.categoryColors[mappedAttributes[category]]} as Attribute);
          return;
       }
       //console.log(Object.keys(node));
       let keys = Object.keys(node);
       for (let key in node){
           //let key = keys[i];
           if(level + 1 >= maxLevel) return;

           if(level === 0){
               category = key;
/*               console.log(key);
               console.log(mappedAttributes[key]);
               console.log(this.categoryColors[mappedAttributes[key]])  ;*/
           }

           if(node[key].length === undefined){
               let list = this.attributeList[level].values;
               list.push({id:key, name:mappedAttributes[key], color:this.categoryColors[mappedAttributes[category]]} as Attribute);

               this.visitTreeNodes(node[key],level+1, maxLevel,mappedAttributes, category);
           }
           else{
               let list = this.attributeList[level].values;
               list.push({id:key, name:mappedAttributes[key], color:this.categoryColors[mappedAttributes[category]]} as Attribute);

               for(let j:number =0;j<node[key].length;j++){
                   this.visitTreeNodes(node[key][j],level+1, maxLevel,mappedAttributes, category);
               }
           }
       }
  }

}
