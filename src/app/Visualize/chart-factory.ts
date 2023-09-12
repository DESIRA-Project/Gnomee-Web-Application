import { GeoCountryService } from "../geocountry.service";
import { Barchart } from "./barchart";
import { Geomap } from "./geomap";
import { Chart } from "./Chart";
import { Counter } from "./counter";
import { Bubblechart } from "./bubblechart";
import {Piechart} from './piechart';
import {MostVisitedDigitalTools} from './most-visited-digital-tools';

export class ChartFactory{
    private geoService:GeoCountryService|null = null;
    constructor(){
    }

    public create(config:any, data:any):Chart|null{
        switch(config.type){
        case "barchart":{
             let bc = new Barchart(config,data);
             return bc;
        }
        case "attribute-geomap":{
            let map = new Geomap(config, data);
            return map;
        }
        case "counter":{
            let counter = new Counter(config, data);
            return counter;
        }
        case "bubblechart":{
            let bubblechart = new Bubblechart(config, data);
            return bubblechart;
        }
        case 'piechart': {
          return new Piechart(config.id, config, data);
        }
        case 'most-visited-dts': {
          return new MostVisitedDigitalTools(config, data);
        }
        default:break;
        }
        return null;
    }
}
