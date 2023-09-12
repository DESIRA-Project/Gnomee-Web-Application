import { AttachableButton } from "../attachable-button";
import { ModalController } from "./modal-controller";

export interface DynamicModalContainer{
    setTitle(title:string):void;
    setCloseButtonText(text:string):void;
    closeModal():void;
    getParent():ModalController|null;
    addButton(b:AttachableButton):void;
}