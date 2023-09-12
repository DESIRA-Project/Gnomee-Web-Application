import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PageConfigService } from "../pageconfig.service";

@Component({
    selector: 'terms-of-service',
    templateUrl: './terms-of-service.component.html',
    styleUrls: ['../style/about.css'],
    providers: []
  })
  
export class TermsOfServiceComponent{
  public pageData:any = null;
  private configKey:string = "terms-of-service";

  constructor(private configService:PageConfigService,private router: Router){        
  }

  ngOnInit(){
    this.configService.getConfigData().subscribe((value) => {
        if(value === null){
            return;
        }
        if(this.configKey in value){
            this.pageData = value[this.configKey];
        }
    });
}

}