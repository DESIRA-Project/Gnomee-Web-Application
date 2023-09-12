import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {HorizontalBarchart} from '../../Visualize/horizontal-barchart';

@Component({
  selector: 'app-browsed-app-scenarios',
  templateUrl: './browsed-app-scenarios.component.html',
  styleUrls: ['../analytics.component.css', './browsed-app-scenarios.component.sass']
})
export class BrowsedAppScenariosComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'browsed_app_scenarios';
  public chartId = 'browsed_app_scenarios';
  public config: any;
  public pageData: any;
  public data: any;
  public title: any;
  public description: any;
  public horizontalBarchart: any;
  public chartReady = false;
  public currentGroup = 'Default';
  public groups = ['Default', 'Domain', 'Sub Domain', 'Application Scenarios'];
  public groupDict: {[index: string]: any} = {
    'Default': '',
    'Domain': 'domains',
    'Sub Domain': 'subDomains',
    'Application Scenarios': 'applicationScenarios'
  };

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
        this.config = this.pageData[this.configKey2];
      }

      this.analyticsService.getBrowsedAppScenarios({}).subscribe((response) => {
        this.data = response.data;
        this.title = response.title;
        this.description = response.description;

        // Create barchart
        this.chartReady = true;

      });
    });
  }

  // When id is ready and #chart component is rendered, draw chart
  @ViewChild('chart', {static: false}) set chart(chart: ElementRef) {
    if (chart) { // initially setter gets called with undefined
      // Create barchart
      this.horizontalBarchart = new HorizontalBarchart(this.chartId, this.config, this.data);
      this.horizontalBarchart.draw();
    }
  }

  filter(currentGroup: string): void {
    this.currentGroup = currentGroup;
    const filter = this.groupDict[this.currentGroup];

    this.analyticsService.getBrowsedAppScenarios({groupBy: filter}).subscribe(response => {
      this.data = response.data;
      // Recreate barchart
      this.horizontalBarchart = new HorizontalBarchart(this.chartId, this.config, this.data);
      this.horizontalBarchart.draw();
    });
  }
}
