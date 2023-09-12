import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {getUrl} from './common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private configData: any;

  constructor(private http: HttpClient) {
    this.configData = environment.env.backend;
  }

  private request(serviceUrl: string, params: any): Observable<any> {
    const url: string = getUrl(this.configData.protocol,
      this.configData.host,
      this.configData.port,
      serviceUrl);

    return this.http.get(url, { params, responseType: 'json'});
  }

  public getFilterIndicesUsage(params: any): Observable<any> {
    return this.request(this.configData.analytics_get_filter_indices_usage, params);
  }

  public getFilterValueFrequency(params: any): Observable<any> {
    return this.request(this.configData.analytics_get_filter_value_frequency, params);
  }

  public getSearchTerms(): Observable<any> {
      return this.request(this.configData.analytics_get_search_terms, {});
  }

  public getTopKSearchTerms(k = 3): Observable<any> {
    return this.request(this.configData.analytics_get_top_k_search_terms, {k});
  }

  public getToolVisits(): Observable<any> {
      return this.request(this.configData.analytics_get_tool_visits, {});
  }

  public getBrowsedAppScenarios(params: any): Observable<any> {
      return this.request(this.configData.analytics_get_browsed_app_scenarios, params);
  }

  public getBrowsedFilterPath(params: any): Observable<any> {
      return this.request(this.configData.analytics_get_browsed_filter_path, params);
  }

  public getMostPopularValueInFilters(): Observable<any> {
      return this.request(this.configData.analytics_get_most_popular_value_in_filters, {});
  }

  public getVisitorCountries(): Observable<any> {
    return this.request(this.configData.analytics_get_visitor_countries, {});
  }

  public getToolRelationGraph(params: any): Observable<any> {
    return this.request(this.configData.analytics_get_tool_relation_graph, params);
  }

}
