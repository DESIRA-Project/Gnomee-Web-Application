import { Component, Input, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'tool-filter-modal',
    templateUrl: './tool-filter-modal.component.html',
  })

export class ToolFilterModal {
    _parent:any = null;
    _modal:NgbModalRef|null = null;
    @ViewChild("content") content:any;    
    
    @Input()
    public set parent(p: any) {
        this._parent = p;
        p.setModal(this);
    }
  
    constructor(private modalService: NgbModal){
    }

    open(){
        this._modal = this.modalService.open(this.content);

        const parentRef = this;
        this._modal.result.then(function(){
            //Get triggers when modal is closed
            parentRef._parent.setToggleFilterModal(false);
           }, function(){
            //gets triggers when modal is dismissed.
            parentRef._parent.setToggleFilterModal(false);
           })
    }

    close(){
        if(this.modalService.hasOpenModals()){
            this.modalService.dismissAll();
        }
    }

    public otherModalsOpen():boolean{
        return this.modalService.hasOpenModals();
    }


}
  