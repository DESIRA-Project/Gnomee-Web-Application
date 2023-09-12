import { BehaviorSubject } from "rxjs";
import { AttributeListPathIterator } from "./attribute-list-path-iterator";
import { AttributePathIterator } from "./attribute-path-iterator";
import { AttributeTreePathIterator } from "./attribute-tree-path-iterator";
import { URLPath } from "./URLPath";

export class PathIterator implements AttributePathIterator{
    private iterators:AttributePathIterator[] = [];
    private _data:any = null;
    private onError:boolean = false;
    private currentIterator:number = -1;
    private fetchDataSingleLevelCB:Function|null = null;
    private fetchDataMultiLevelCB:Function|null = null;

    constructor(data:any, singleLevelCB:Function, multiLevelCB:Function){
        this._data = data;
        this.fetchDataSingleLevelCB = singleLevelCB;
        this.fetchDataMultiLevelCB = multiLevelCB;

        this.loadData();
    }
    getName(): string {
        return "path";
    }
    
    traverse(p: URLPath, onFinish: Function, onError:Function): void {
        let selectedIteratorName = p.popHead();//p.getToken(0);

        //lets find the correct iterator first
        let found:boolean = false;
        for(let i:number = 0;i<this.iterators.length;i++){
            if(selectedIteratorName === this.iterators[i].getName() ){
                found = true;
                this.setCurrentIterator(i);
                break;
            }
        }

        if(found === true){
            this.iterators[this.currentIterator].traverse(p, onFinish, onError);
        }
        else{
            onError();
        }
    }
    
    fetchNextBatch(): BehaviorSubject<any>|null {
        if(this.currentIterator === -1){
            return null;
        }
        return this.iterators[this.currentIterator].fetchNextBatch();
    }

    setNextDataIndex(i: number): void {
        if(this.currentIterator === -1){
            return;
        }
        this.iterators[this.currentIterator].setNextDataIndex(i);
    }

    getSubject(): string {
        if(this.currentIterator === -1){
            return "";
        }
        return this.iterators[this.currentIterator].getSubject();
    }


    setOnLoadCB(cb: Function | null): void {
        for(let i:number = 0;i<this.iterators.length;i++){
            this.iterators[i].setOnLoadCB(cb);
        }    
    }

    getData():any{
        return this._data;
    }

    reset(): void {
        this.currentIterator = -1;
        for(let i:number = 0;i<this.iterators.length;i++){
            this.iterators[i].reset();
        }
    }

    getHierarchy() {
        if(this.currentIterator === -1){
            return null;
        }
        return this.iterators[this.currentIterator].getHierarchy();
    }
    
    getCategory(): string {
        if(this.currentIterator === -1){
            return "";
        }
        return this.iterators[this.currentIterator].getCategory();
    }

    getPath(): string {
        if(this.currentIterator === -1){
            return "";
        }
        return this.iterators[this.currentIterator].getPath();
    }

    showAll(): void {
        throw new Error("Method not implemented.");
    }

    private loadData():void{
        for(let i:number = 0;i<this._data.length;i++){
            let typ:string = this._data[i].data.type;
            switch(typ){
                case "list":{
                    this.iterators.push(new AttributeListPathIterator(this._data[i], this._data.style,
                        this.fetchDataSingleLevelCB));
                    break;
                }
                case "tree":{
                    this.iterators.push(new AttributeTreePathIterator(this._data[i], this._data.style,this.fetchDataMultiLevelCB));
                    break;
                }
                default:break;
            }
        }
    }

    public hasIteratorSelected(){
        return this.currentIterator !== -1;
    }

    public setCurrentIterator(i: number) {
        if(!this.hasIteratorSelected()){
            this.currentIterator = i;
        }

        this.iterators[this.currentIterator].notify(i);     
    }

    hasPrev(): boolean {
        if(this.onError === true){
            return false;
        }
        if(this.currentIterator < -1 || this.currentIterator > this.iterators.length - 1){
            return false;
        }
        if(this.currentIterator === -1){
            return false;
        }
        let res:boolean = this.iterators[this.currentIterator].hasPrev();
//        console.log(res);
        return res;
    }

    notify(i:number){

    }

    prev() {

        if(this.onError === true){
            return null;
        }
        if(this.currentIterator < -1 || this.currentIterator > this.iterators.length - 1){
            return null;
        }
        if(this.iterators[this.currentIterator].hasPrev()){
            return this.iterators[this.currentIterator].prev();
        }
        this.reset();
        let data = [];
        for(let i:number = 0;i<this.iterators.length;i++){
            if(this.iterators[i].hasNext()){
                 data.push(this.iterators[i].next());
            }
        }
        return data;
    }

    hasNext(): boolean {
        if(this.onError === true){
            return false;
        }
        if(this.currentIterator < -1 || this.currentIterator > this.iterators.length - 1){
            return false;
        }

        if(this.currentIterator === -1){
            return true;
        }
        return this.iterators[this.currentIterator].hasNext();
    }
    
    next() {
        if(this.onError === true){
            return null;
        }
        if(this.currentIterator < -1 || this.currentIterator > this.iterators.length - 1){
            return null;
        }
        if(this.currentIterator === -1){
            //show all
            let data = [];
            for(let i:number = 0;i<this.iterators.length;i++){
                if(this.iterators[i].hasNext()){
                     data.push(this.iterators[i].next());
                }
            }
            return data;
        }
        this.iterators[this.currentIterator].showAll();
        
        return this.iterators[this.currentIterator].next();
       
    }
    isOnError(): boolean {
        return this.onError;
    }

    isLoaded(): boolean {
        if(this.onError === true){
            return false;
        }
        return this.iterators.length > 0;
    }

};