import { ViewContainerRef } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Chart } from "./Chart";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";

export class Counter implements Chart {
    private chartReady: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    private config:any = null;
    private data:any = null;

    constructor(config: any, data: any){
        this.config = config;
        this.data = data;
        this.render();
    }
    handleDynamicContent(view: ViewContainerRef): void {
       // throw new Error("Method not implemented.");
    }

    private render():void{
        let e = document.getElementById(this.config.id);
        if(e !== null){
            e.innerHTML = this.data.data;
            this.chartReady.next(true);
        }
    }

    draw(): void {        
        /*console.log("draw")
        this.chartReady.next(true);*/
    }

    isReady(): Observable<boolean> {
        return this.chartReady.asObservable();
    }
    setParent(parent: ModalController): void {

    }
    resize(): void {

    }


}