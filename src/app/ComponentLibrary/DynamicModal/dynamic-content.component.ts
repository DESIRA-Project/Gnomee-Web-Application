import { DynamicItem } from "./dynamic-item.components";
import { DynamicModalContainer } from "./dynamic-modal-container";

export interface DynamicContent{
    data:any;
    initialize(parent:DynamicModalContainer):void;
    getUserToken():string|null;
    initializeWithAuthData(userToken:string):void;
    setDependencies(dependencies:DynamicItem[]):void;
}