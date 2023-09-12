import { isInteger } from "@ng-bootstrap/ng-bootstrap/util/util";
import { BehaviorSubject } from "rxjs";
import { AttributePathIterator } from "./attribute-path-iterator";
import { URLPath } from "./URLPath";

export class AttributeTreePathIterator implements AttributePathIterator{
    private _data:any = null;
    private onError:boolean = false;
    private onStart:boolean = true;
    private stack:any = [];
    private latestSelection:number = -1;
    private pathStack:string[] = [];
    private currentHierarchy:any[] = [];
    private keyStack:any[] = [];
    private style:any = null;
    private parentLabel:string|null = null;
    private styleCache:any = null;
    private fetchDataCB:Function|null = null;
    private attributeName:string[]|null = null;
    private onLoadCB:Function|null = null;
    private nextDataIndex:number = 0;

    constructor(data:any, style:any, cb:Function|null){
        if(data === null || data.data === undefined || data.data.attribute === undefined || 
           data.data === null || data.data.attribute === null){
            this.onError = true;
            return;
        }
        this._data = data;
        this.attributeName = this._data.name;
        this.style = style;
        this.parentLabel = this._data.data.repr[0].toLowerCase();
        this.pathStack.push(this._data.data.repr[0]);
        this.fetchDataCB = cb;
    }
    getName(): string {
        return this._data.data.attribute[0];
    }

    private getDatumFromId(id:number, pos:number):number{
           let node = this.stack[pos];
           //console.log(this.stack);
           if(this.onStart === true){
               return -2;
           }
           if(this.stack.length === 0){
               return -2;
           }
           /*console.log(this.stack)*/

           let keys = Object.keys(node);
           for(let i:number = 0;i<keys.length;i++){
               if(parseInt ( keys[i] ) === id){
                   //alert("found");
                   //console.log("FOUND" +id)
                   return i;
               }
           }
           return -1;
    }
    
    traverse(p: URLPath, onFinish: Function, onError:Function): void {
        let success = true;
        this.next();
        if(p.isEmpty()){
            onFinish();
            return;
        }

        this.next();
        
        let i:number = 0;
        while(!p.isEmpty()){
      
                  //select and call next
                  let item = p.popHead();
                  if(item !== null){
                      let selection = this.getDatumFromId( parseInt(item), i++ );
                      if(selection === -2){
                          this.next();
                          continue;
                      }
                      else if(selection === -1){
                          success = false;
                          break;
                      }
                      this.notify(selection);
                      if(!p.isEmpty()){
                          this.next();
                      }
                      else{
                          break;
                      }
                  }
                  else{
                      success = false;
                      break;
                  } 
        }

        if(success === true){
            onFinish();
        }
        else{
            onError();
        }
    }

    getSubject(): string {
        //console.log(this.keyStack);
        if(this.keyStack.length === 0){
           /* console.log(this._data.data.attribute);*/
            return this._data.data.attribute[0];
        }         
        return this.keyStack[this.keyStack.length - 1];
    }
    
    fetchNextBatch(): any {
        if(this.fetchDataCB === null) return null;
        if(this.onLoadCB !== null){
            this.onLoadCB();
        }
        let o: BehaviorSubject<any> = new BehaviorSubject<any>(null);
        this.fetchDataCB(this.attributeName,this.keyStack,this.nextDataIndex, o);
        return o;
    }

    setNextDataIndex(i: number): void {
        this.nextDataIndex = i;
    }

    setOnLoadCB(cb: Function): void {
        this.onLoadCB = cb;
    }

    getData() {
        return this._data;
    }

    reset(): void {
        //this.onStart = true;
        this.initializeState();
    }

    getHierarchy() {
        if(this.onError) return null;
        return this.currentHierarchy;
    }

    getCategory(): string {
        if(this.onError) return "";
        let level = this.stack.length - 1;
        if(level <= 0){
            return this._data.data.repr[0];
        }
        if(level >= this._data.data.repr.length){
            return this._data.data.repr[this._data.data.repr.length - 1];
        }
        return this._data.data.repr[level];
    }

    getPath(): string {
        return this.pathStack.join("/");
    }

    showAll(): void { }

    hasPrev(): boolean {        
        return this.stack.length > 1;
    }

    private initializeState():void{
        this.onStart = true;
        this.stack= [];
        this.latestSelection = -1;
        this.currentHierarchy = [];
        this.keyStack = [];  
        this.pathStack = [this._data.data.repr[0]];
       // this.styleCache = null;
    }

    prev():any {
        if(this.onError) return null;
        let parent = null;

        if(this.stack.length !== 0){
            this.stack.splice(this.stack.length - 1, 1);
        }
        if(this.keyStack.length !== 0){
            this.keyStack.splice(this.keyStack.length -1 , 1);
        }
        if(this.pathStack.length > 1){
            this.pathStack.splice(this.pathStack.length -1 , 1);
        }

        if(this.stack.length === 0 && this.keyStack.length === 0){
            this.initializeState();
            return {"value":this._data.data.repr[0], "style":""};
        }

        parent = this.stack[this.stack.length - 1];

        let keys = Object.keys(parent);
        this.populateHierarchy();

        return this.mapAttributes ( keys );        
    }

    private getStyle(label:string):string{
        if(this.parentLabel === null){
            return "";
        }

        if(this.style.colors[this.parentLabel] === undefined){
            return "";
        }
        
        if(this.stack.length >= 1){
            //check if label in styles
            let l = label.toLowerCase();
            if(this.style.colors[l] !== undefined){
                return this.style.colors[l];
            }
            else{
                if(this.styleCache !== null){
                    return this.style.colors[this.styleCache ];
                }
                return "";
            }
        }
        return this.style.colors[this.parentLabel];
    }
    
    private mapAttributes(l:any){
        let transformed = [];
        for(let i:number =0 ;i<l.length;i++){
            transformed.push({"value": this._data.data.mappedAttributes[l[i]],
            "style":this.getStyle(this._data.data.mappedAttributes[l[i]])});
        }
        return transformed;
    }

    private populateHierarchy():void{
        this.currentHierarchy = [];
        for(let i:number = 0;i<this.stack.length - 1;i++){
            let catName = this._data.data.repr[i];            
            let catValue = this._data.data.mappedAttributes[ this.keyStack[i] ] ;
            this.currentHierarchy.push([catName, catValue]);
        }
/*        let node = this.stack[this.stack.length - 1];
        let key = Object.keys(node)[this.latestSelection];
        let currentNode = node[key];

        this.currentHierarchy.push(['AAA',this._data.data.mappedAttributes[key ]])
        console.log(this.currentHierarchy)*/
    }

    private dumpState():void{
        console.log(this.stack);
        console.log(this.pathStack);
        console.log(this.keyStack);
    }

    private beforeDataNode(node:any){
        return node !== null && Number.isInteger(node);
    }

    hasNext(): boolean {
        if(this.onError === true){
            return false;
        }
        if(this.onStart === true && this._data.data.attribute.length !== 0){
            return true;
        }
        if(this.stack.length === 0 && Object.keys(this._data.data.data).length > 0){
            return true;
        }
        if(this.latestSelection === -1 && this.stack.length === 1){
            let node = this.stack[this.stack.length - 1];
            if(Object.keys(node).length > 0){
                return true;
            }
            return false;
        }

        let node = this.stack[this.stack.length - 1];
        let key = Object.keys(node)[this.latestSelection];
        let currentNode = node[key];

        if(currentNode === undefined || ( key === undefined && this.beforeDataNode(node) ) === true){     
            return false;
        }

        if(Object.keys(currentNode).length >= 0){
            return true;
        }
        return false;
    }

    next():any {
        if(this.onError) return null;
        if(this.onStart === true){
            this.onStart = false;
            return {"value":this._data.data.repr[0], "style":this.getStyle(this._data.data.attribute[0])};
        }

        if(this.stack.length === 0){
            let node = this._data.data.data;
            this.stack.push(node);
            let keys = Object.keys(node);
           // this.populateHierarchy();
            return this.mapAttributes ( keys );
        }
        else{
            let node = this.stack[this.stack.length - 1];
            let key = Object.keys(node)[this.latestSelection];
            let currentNode = node[key];
            this.stack.push(currentNode);
            this.keyStack.push(key);
            let keys = Object.keys(currentNode);
            this.pathStack.push(this._data.data.mappedAttributes[key]);
            this.populateHierarchy();
            if(Object.keys(keys).length  === 0 && this.fetchDataCB !== null){
                if(this.onLoadCB !== null){
                    this.onLoadCB();
                }
               
                let o: BehaviorSubject<any> = new BehaviorSubject<any>(null);
/*                console.log(this.attributeName);
                console.log(this.keyStack);
                console.log(key);*/
                this.fetchDataCB(this.attributeName,this.keyStack,this.nextDataIndex, o);
                return o;
            }

            if(this.style.colors[this._data.data.mappedAttributes[key].toLowerCase()] !== undefined){
                 this.styleCache = this._data.data.mappedAttributes[key].toLowerCase();
            }
            
            return this.mapAttributes ( keys );
        }

    }

    notify(i:number){
        if(this.stack.length === 0){
            return;
        }
        this.latestSelection = i;
    }

    isOnError(): boolean {
        return this.onError;
    }

    isLoaded(): boolean {
        return !this.onError;
    }
  
};