import { BehaviorSubject } from "rxjs";
import { URLPath } from "./URLPath";

export interface AttributePathIterator{
    hasNext():boolean;
    hasPrev():boolean;
    next():any;
    prev():any;
    isOnError():boolean;
    isLoaded():boolean;
    showAll():void;
    notify(i:number):void;
    getPath():string;
    getCategory():string;
    getHierarchy():any;
    reset():void;
    getData():any;
    setOnLoadCB(cb:Function|null):void;
    setNextDataIndex(i:number):void;
    fetchNextBatch():BehaviorSubject<any>|null;
    getSubject():string;
    traverse(p:URLPath,onFinish:Function, onError:Function):void;
    getName():string;
};