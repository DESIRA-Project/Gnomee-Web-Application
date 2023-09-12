import { Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DynamicContent } from "./dynamic-content.component";
import { DynamicContentDirective } from "./dynamic-content.directive";
import { DynamicItem } from "./dynamic-item.components";
import { DynamicModalContainer } from "./dynamic-modal-container";
import { ModalController } from "./modal-controller";

@Component({
    selector: 'dynamic-content-section',
    template: `
    <div class="dynamic-content-section">
    <ng-template dynamicContent></ng-template>
  </div>
    `
  })

export class DynamicContentSectionComponent implements OnInit, OnDestroy {

    @Input() item: DynamicItem|null = null;
    @Input() parent:DynamicModalContainer | null = null;
    @Input() userToken:string | null = null;

  //  currentAdIndex = -1;
  
    @ViewChild(DynamicContentDirective, {static: true}) dynamicContent!: DynamicContentDirective;
    interval: number | undefined;
  
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  
    ngOnInit() {
      this.loadComponent();
      this.getContent();
    }
  
    ngOnDestroy() {
      clearInterval(this.interval);
    }
  
    loadComponent() {
      const i = this.item;

      if( i === null){return;}
      
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(i.component);      
      const viewContainerRef = this.dynamicContent.viewContainerRef;
      viewContainerRef.clear();
  
      const componentRef = viewContainerRef.createComponent<DynamicContent>(componentFactory);
      componentRef.instance.data = i.data;
      if(i.hasDependencies()){
        componentRef.instance.setDependencies(i.dependencies);
      }

      if(this.parent){
          componentRef.instance.initialize(this.parent);
      }

      if(this.userToken !== null){
        componentRef.instance.initializeWithAuthData(this.userToken);
      }
    }
  
    getContent() {

/*      this.interval = setInterval(() => {
        this.loadComponent();
      }, 3000);*/
    }
  }