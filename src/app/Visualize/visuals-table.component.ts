import { Component, Input } from "@angular/core";
import { ModalController } from "../ComponentLibrary/DynamicModal/modal-controller";

@Component({
    selector: 'visuals-table',
    templateUrl: './visuals-table.component.html',
    styleUrls: ['../style/visuals-table.css'],
    providers: []
})
  
export class VisualsTableComponent {

    public chartConfig:any = null;
    public parent:ModalController|null = null;

    @Input()
    public set chartConfiguration(chartConfig:any) {
        this.chartConfig = chartConfig;
    }

    @Input()
    public set parentRef(parent:ModalController){
        this.parent = parent;
    }

    constructor(){
        
    }
}