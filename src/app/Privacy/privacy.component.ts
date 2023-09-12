import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PageConfigService } from "../pageconfig.service";

@Component({
    selector: 'privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['../style/privacy.css'],
    providers: []
  })
  
export class PrivacyComponent{
  public pageData:any = null;
  private configKey:string = "privacy";

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