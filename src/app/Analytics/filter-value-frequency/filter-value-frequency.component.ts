import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatepickerRangePopupComponent} from '../datepicker-range-popup/datepicker-range-popup.component';
import {PageConfigService} from '../../pageconfig.service';
import {AnalyticsService} from '../../services/analytics.service';
import {DatePipe} from '@angular/common';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Piechart} from '../../Visualize/piechart';

@Component({
  selector: 'app-filter-value-frequency',
  templateUrl: './filter-value-frequency.component.html',
  styleUrls: ['./filter-value-frequency.component.sass']
})
export class FilterValueFrequencyComponent implements OnInit {

  private configKey = 'analytics';
  private configKey2 = 'filter_value_frequency';
  public pageData: any;
  public config: any;
  public data: any;
  public fromDate: any;
  public toDate: any;
  public title: any;
  public description: any;
  public ids: any;
  public idsPerRow: any;
  public piecharts: any;
  public emptyPiechart: any;
  public emptyPiechartId = 'filter-value-frequency-empty';
  public numOfCharts: any;
  public chartsPerRow = 3;
  public idsReady = false;
  public unique = 0;

  @ViewChild(DatepickerRangePopupComponent) datePicker!: DatepickerRangePopupComponent;

  constructor(private configService: PageConfigService,
              private analyticsService: AnalyticsService,
              public datePipe: DatePipe) {}


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
      this.analyticsService.getFilterValueFrequency({}).subscribe((response) => {

        this.title = response.title;
        this.description = response.description;
        this.data = response.data;
        const d1 = response.fromDate.split('-');
        this.fromDate = new NgbDate(+d1[0], +d1[1], +d1[2]);
        const d2 = response.toDate.split('-');
        this.toDate = new NgbDate(+d2[0], +d2[1], +d2[2]);

        this.setUpIds();
        this.idsReady = true;
      });
    });
  }


  // When ids are ready and #charts component is rendered, draw charts
  @ViewChild('charts', {static: false}) set charts(charts: ElementRef) {
    if (charts) { // initially setter gets called with undefined
      this.updatePieCharts();
    }
  }

  updatePieCharts(): void {
    this.piecharts = [];
    this.emptyPiechart = null;

    // If there are no data to display, create an empty piechart in order to have a
    // uniform error message 'No data to display' with the other charts in the page
    if (Object.keys(this.data).length === 0) {
      this.emptyPiechart = new Piechart(this.emptyPiechartId, this.config, {});
      this.emptyPiechart.draw();
    }

    else {
      for (const dataKey in this.data) {
        this.piecharts.push(new Piechart(this.ids[dataKey], this.config, this.data[dataKey]));
        this.piecharts[this.piecharts.length - 1].draw();
      }
    }
  }


  search(): void {

    if (this.datePicker.fromDate == null || this.datePicker.toDate == null) {
      return;
    }

    // Transform ngbDate to Date
    const tempFromDate = new Date(this.datePicker.fromDate.year, this.datePicker.fromDate.month - 1, this.datePicker.fromDate.day);
    const tempToDate = new Date(this.datePicker.toDate.year, this.datePicker.toDate.month - 1, this.datePicker.toDate.day);

    // Transform Date to 'yyyy-MM-dd' and fetch results from backend
    this.analyticsService.getFilterValueFrequency({
      fromDate: this.datePipe.transform(tempFromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(tempToDate, 'yyyy-MM-dd')
    }).subscribe((response) => {

      this.data = response.data;
      this.setUpIds();
      this.updatePieCharts();
    });
  }


  setUpIds(): void {
    // Count number of pie charts
    this.numOfCharts = Object.keys(this.data).length;

    // Create ids for each piechart ending with a unique id
    // ( the unique id thing was added because without it, I could not not redraw charts on search properly )
    // e.g. ids = {
    //  Domains: "Domains_0",
    //  Sub Domains: "Sub_Domains_1",
    //  Digital Technologies: "Digital_Technologies_2",
    //  Countries: "Countries_3"
    // }
    this.ids = {};

    // Create 2d array indicating how piecharts are going to appear on screen
    // e.g. idsPerRow = [
    //  [ "Domains_0", "Sub_Domains_1", "Digital_Technologies_2" ],
    //  [ "Countries_3" ]
    // ]
    this.idsPerRow = [];
    let i = 0;

    for (const dataKey in this.data) {
      const id = dataKey.split(' ').join('_') + '_' + this.unique++;
      this.ids[dataKey] = id;

      if (i === 0) {
        i = this.chartsPerRow;
        this.idsPerRow.push([]);
      }
      this.idsPerRow[this.idsPerRow.length - 1].push(id);
      i--;
    }
  }
}
