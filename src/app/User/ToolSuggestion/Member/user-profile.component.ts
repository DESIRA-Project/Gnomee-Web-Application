import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PageConfigService } from "src/app/pageconfig.service";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
  //  styleUrls: ['../style/about.css'],
    providers: []
  })
  
export class UserProfileComponent{
    private configKey = "profile";
    public pageData:any = null;
    public ready = false;

  constructor(private configService: PageConfigService,private router: Router){        

  }

  ngOnInit() {
    this.configService.getConfigData().subscribe((value) => {
      if (value === null) {
        return;
      }
      if (this.configKey in value) {
        this.pageData = value[this.configKey];
        //console.log(this.pageData);
      }    
      this.ready = true;

    });
  }

}