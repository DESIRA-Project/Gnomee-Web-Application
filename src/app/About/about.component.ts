import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PageConfigService } from "../pageconfig.service";

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['../style/about.css'],
    providers: []
  })
  
export class AboutComponent{
  public pageData:any = null;
  private configKey:string = "about";

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