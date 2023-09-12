import {Component, OnInit, ViewChild} from '@angular/core';
import {DatepickerRangePopupComponent} from '../datepicker-range-popup/datepicker-range-popup.component';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {DatePipe} from '@angular/common';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Barchart} from '../../Visualize/barchart';
import {TooltipMode} from '../../Visualize/TooltipMode';

@Component({
  selector: 'app-filter-indices-usage',
  templateUrl: './filter-indices-usage.component.html',
  styleUrls: ['./filter-indices-usage.component.sass']
})
export class FilterIndicesUsageComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'filter_indices_usage';
  public config: any;
  public chartId = 'filter_indices_usage';
  public pageData: any;
  public filterIndicesUsage: any;
  public fromDate: any;
  public toDate: any;
  public title: any;
  public description: any;

  @ViewChild(DatepickerRangePopupComponent) datePicker!: DatepickerRangePopupComponent;

  constructor(private configService: PageConfigService,
              private analyticsService: AnalyticsService,
              public datePipe: DatePipe) { }



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

      // Fetch barchart data
      this.analyticsService.getFilterIndicesUsage({}).subscribe((response) => {

        this.title = response.title;
        this.description = response.description;
        this.filterIndicesUsage = response.data;
        const d1 = response.fromDate.split('-');
        this.fromDate = new NgbDate(+d1[0], +d1[1], +d1[2]);
        const d2 = response.toDate.split('-');
        this.toDate = new NgbDate(+d2[0], +d2[1], +d2[2]);

        // Create barchart
        const barchart = new Barchart({id: this.chartId, fill_color: this.config.fill_color},
          {data: this.filterIndicesUsage},
          TooltipMode.Analytics);
        barchart.draw();

      });
    });
  }


  search(): void {

    if (this.datePicker.fromDate == null || this.datePicker.toDate == null) {
      return;
    }

    // Transform ngbDate to Date
    const tempFromDate = new Date(this.datePicker.fromDate.year, this.datePicker.fromDate.month - 1, this.datePicker.fromDate.day);
    const tempToDate = new Date(this.datePicker.toDate.year, this.datePicker.toDate.month - 1, this.datePicker.toDate.day);

    // Transform Date to 'yyyy-MM-dd' and fetch results from backend
    this.analyticsService.getFilterIndicesUsage({
      fromDate: this.datePipe.transform(tempFromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(tempToDate, 'yyyy-MM-dd')
    }).subscribe((response) => {

      this.filterIndicesUsage = response.data;

      // Re-draw barchart
      const barchart = new Barchart({id: this.chartId, fill_color: this.config.fill_color},
        {data: this.filterIndicesUsage},
        TooltipMode.Analytics);
      barchart.draw();

    });
  }

}
