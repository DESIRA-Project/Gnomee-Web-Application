import { BehaviorSubject } from "rxjs";
import { AttributePathIterator } from "./attribute-path-iterator";
import { URLPath } from "./URLPath";
export enum State{
    ERROR = 0,
    INIT,
    UNFOLD,
    DATA
};

export class AttributeListPathIterator implements AttributePathIterator{
    private _data:any = null;
    private latestSelectedNode:number = -1;
    private pathStack:string[] = [];
    private style:any = null;
    private parentLabel:string|null = null;
    private fetchDataCB:Function|null = null;
    private attributeName:string|null = null;
    private onLoadCB:Function|null = null;
    private state:State = State.INIT;
    private nextDataIndex:number = 0;

    constructor(data:any, style:any,cb:Function|null){
        if(data === null || data.data === undefined || data.data.repr === undefined){
            this.state = State.ERROR;
            return;
        }
         this._data = data;
         this.style = style;
         this.pathStack.push(this._data.data.repr);
         this.parentLabel = this._data.data.repr.toLowerCase();
         this.attributeName = this._data.name;
         this.fetchDataCB = cb;
    }
    
    getName(): string {
        return this._data.name;
    }

    private getDatumFromId(id:number):number{
        for(let i:number = 0;i<this._data.data.data.length;i++){
            let _id:number  = this._data.data.data[i].id;
            if(_id === id){
                return i;
            }
        }
        return -1;
    }
    
    traverse(p: URLPath, onFinish: Function, onError:Function): void {
        let success = true;
        while(!p.isEmpty()){
            if(this.hasNext()){
                  //select and call next
                  let item = p.popHead();
                  if(item !== null){
                      let selection = this.getDatumFromId(parseInt(item));
                      if(selection === -1){
                          success = false;
                          break;
                      }
                      this.notify(selection);
                      this.showAll();
                   //   this.next();
                  }
                  else{
                      success = false;
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
        switch(this.state){
            case State.UNFOLD:{
                return this.attributeName !== null ? this.attributeName : "";
            }
            case State.DATA:{
                let id:number = this._data.data.data[this.latestSelectedNode].id;
                return id.toString();
            }
            case State.ERROR:{
                return "";
            }
            case State.INIT:{
                return "";
            }
            default: return "";
        }        
        return "";
    }

    
    setNextDataIndex(i: number): void {
        this.nextDataIndex = i;
    }
    setOnLoadCB(cb: Function): void {
        this.onLoadCB = cb;
    }

    getData() {
        return  this._data;
    }
    
    reset(): void {
        if(this.state !== State.ERROR){
            this.state = State.INIT;
            this.pathStack = [];        
            this.pathStack.push(this._data.data.repr);     
        }
        this.latestSelectedNode = -1;
        this.nextDataIndex = 0;
    }

    getHierarchy() {
        if(this.state !== State.DATA){
            return null;
        }        
        return [[this._data.data.unit,this._data.data.data[this.latestSelectedNode].name]];
    }

    getCategory(): string {
        return this._data.data.repr;
    }

    showAll():void {
       if(this.state === State.ERROR){
           return;
       }
       if(this.state  === State.INIT){
            this.state = State.UNFOLD;
       }
       else if(this.state === State.UNFOLD){
           this.state = State.DATA;
       }
    }

    getPath():string{
        return this.pathStack.join("/");
    }

    hasPrev(): boolean {
        if(this.state === State.ERROR){
            return false;
        }
        if(this.state === State.UNFOLD){
            return false;
        }
        if(this.state === State.DATA){
            return true;
        }
        return false;
    }

    private getStyle():string{
        if(this.parentLabel === null){
            return "";
        }
        if(this.style.colors[this.parentLabel] === undefined){
            return "";
        }
        return this.style.colors[this.parentLabel];
    }

    private getTerminalNodeStyle():any{
        if(this.style === null || this.style === undefined){
            return null;
        }
        return this.style;
    }

    prev():any {
       if(this.state === State.ERROR){
           return null;
       }
       if(this.state === State.DATA){
           this.state = State.UNFOLD;
           return this.unfoldNode();
       }
       if(this.state === State.UNFOLD){
           alert("what")
           this.state = State.INIT;
        return [{"value":this._data.data.repr,"style":this.getStyle(),"isTerminal":false}];
       }
       return true;
    }

    notify(i:number){
        this.latestSelectedNode = i;
    }

    hasNext(): boolean {
        return this.state !== State.ERROR && this.state !== State.DATA && ( this.state === State.UNFOLD || this.state === State.INIT );        
    }

    fetchNextBatch(): any {
        if(this.fetchDataCB === null) return null;
        if(this.onLoadCB !== null){
            this.onLoadCB();
        }
        let id:number = this._data.data.data[this.latestSelectedNode].id;
        let o: BehaviorSubject<any> = new BehaviorSubject<any>(null);
        this.fetchDataCB(this.attributeName,id,this.nextDataIndex, o);
        return o;
    }


    next():any {

        if(this.state === State.ERROR || this._data === null){
            return null;
        }
        if(this.state === State.INIT){
            return  {"value":this._data.data.repr,"style":this.getStyle(),"isTerminal":false};
        }

        if(this.state === State.DATA){

            if( this.fetchDataCB !== null  && 
                this.latestSelectedNode >= 0 && 
                this.latestSelectedNode < this._data.data.data.length){
                if(this.onLoadCB !== null){
                    this.onLoadCB();
                }
                let id:number = this._data.data.data[this.latestSelectedNode].id;
                let o: BehaviorSubject<any> = new BehaviorSubject<any>(null);
                this.fetchDataCB(this.attributeName,id,this.nextDataIndex, o);
                return o;
            }
        }
        return this.unfoldNode();
    }

    private unfoldNode(){
        let data = [];
        for(let i:number = 0;i<this._data.data.data.length;i++){
            data.push({"value": this._data.data.data[i].name,"style":this.getStyle(),"isTerminal":false});
        }
        return data;
    }

    isOnError(): boolean {
        return State.ERROR === this.state;//this.onError;
    }

    isLoaded(): boolean {
        return this._data !== null;
    }

};