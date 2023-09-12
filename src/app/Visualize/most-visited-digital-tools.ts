import {Chart} from './Chart';
import {ViewContainerRef} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ModalController} from '../ComponentLibrary/DynamicModal/modal-controller';

export class MostVisitedDigitalTools implements Chart {

  ready: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  config: any;
  data: any;

  constructor(config: any, data: any) {
    this.config = config;
    this.data = data;
    this.ready.next(true);
  }

  draw(): void {
  }

  handleDynamicContent(view: ViewContainerRef): void {
  }

  isReady(): Observable<boolean> {
    return this.ready.asObservable();
  }

  resize(): void {
  }

  setParent(parent: ModalController): void {
  }

}
