import { ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";

export interface Chart{
    draw():void;
    isReady():Observable<boolean>;
    setParent(parent:ModalController):void;
    resize():void;
    handleDynamicContent(view:ViewContainerRef):void;
}