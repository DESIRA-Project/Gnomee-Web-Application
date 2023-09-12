import { Component, OnInit } from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';

@Component({
  selector: 'app-tool-visits',
  templateUrl: './tool-visits.component.html',
  styleUrls: ['../analytics.component.css', './tool-visits.component.css']
})
export class ToolVisitsComponent implements OnInit {

  private configKey = 'analytics';
  public pageData: any;
  public toolVisits: any;
  public initialToolVisits: any;
  public title: any;
  public description: any;
  public minViews: any;
  public maxViews: any;

  constructor(private configService: PageConfigService,
              private analyticsService: AnalyticsService) { }


  ngOnInit(): void {

    // Get 'analytics' config data
    this.configService.getConfigData().subscribe((value) => {
      if (value === null) {
        return;
      }
      if (this.configKey in value) {
        this.pageData = value[this.configKey];
      }

      this.analyticsService.getToolVisits().subscribe((response) => {
        this.initialToolVisits = this.toolVisits = response.data;
        this.title = response.title;
        this.description = response.description;
      });
    });
  }

  filter(): void {
    if (this.minViews !== undefined && this.maxViews !== undefined) {
      this.toolVisits = [];
      for (const toolVisit of this.initialToolVisits) {
        if (this.minViews <= toolVisit.count && toolVisit.count <= this.maxViews) {
          this.toolVisits.push(toolVisit);
        }
      }
    }
  }

  reset(): void {
    this.minViews = undefined;
    this.maxViews = undefined;
    this.toolVisits = this.initialToolVisits;
  }

}
