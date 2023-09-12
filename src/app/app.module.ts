import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AdvancedSearchComponent } from './ToolFilterPage/advanced-search.component';
import { OAuthModule } from 'angular-oauth2-oidc';

import { ToolFilter } from './ToolFilterPage/tool-filter.component';
import { ToolMainView } from './ToolFilterPage/tool-main-view.component';
import { ToolFilterHolder } from './ToolFilterPage/tool-filter-holder.component';
import { ToolTermSearch } from './ToolFilterPage/tool-term-search.component';
import { SelectedAttributes } from './ToolFilterPage/tool-selected-attributes.component';
import { ToolNavigation} from './ToolFilterPage/tool-navigation.component';
import { ToolResultSizeSetter} from './ToolFilterPage/tool-result-size-setter.component';
import { LandingComponent} from './LandingPage/landing.component';
import { ContactComponent } from './ContactPage/contact.component';
import { ToolSorting} from './ToolFilterPage/tool-sorting.component';
import { ToolFilterModal} from './ToolFilterPage/tool-filter-modal.component';
import { ResultCounter } from './ToolFilterPage/result-counter.component';
import CustomUrlSerializer from './CustomUrlSerializer';
import { AboutComponent } from './About/about.component';
import { PrivacyComponent } from './Privacy/privacy.component';
import { AppComponent } from './app.component';
import { KBTFooterComponent} from './Footer/kbt-footer.component';
import { ToolDetailedViewComponent } from './ToolDetailedView/tool-detailed-view.component';
import { ToolMainInfo } from './ToolDetailedView/tool-main-info.component';
import { ApplicationScenarioHolderComponent } from './ToolDetailedView/application-scenario-holder.component';
import { ClickableBadgeList } from './ToolDetailedView/clickable-badge-list.component';
import { ToolDetails } from './ToolDetailedView/tool-details.component';
import { HorizontalAttributeList } from './ComponentLibrary/horizontal-attribute-list.component';
import { SingleValueAttributeComponent } from './ComponentLibrary/single-value-attribute.component';


import { HttpClientModule } from '@angular/common/http';
import { OptionsTree } from './ComponentLibrary/options-tree.component';
import { OptionsList } from './ComponentLibrary/options-list.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Routes, RouterModule, UrlSerializer } from '@angular/router'; // CLI imports router
import { NgbModule, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {APP_BASE_HREF, CommonModule, DatePipe} from '@angular/common';
import { CookieBanner } from './CookieBanner/cookie-banner.component';
import { KBTCookieService } from './CookieBanner/cookie-service.component';
import {CookieService} from 'ngx-cookie-service';
import { GAService } from './GoogleAnalytics/ga.service';
import { Form } from './ComponentLibrary/form.component';
import { FormTab } from './ComponentLibrary/form-tab.component';
import { EmailStringAttribute } from './ComponentLibrary/email-string-attribute.component';
import { StringAttribute } from './ComponentLibrary/string-attribute.component';
import { NavbarComponent } from './Navbar/navbar.component';
import { BreadcrumbComponent } from './Breadcrumb/breadcrumb.component';
import { ToolBrowserComponent } from './ToolBrowser/tool-browser.component';
import { PathViewerComponent } from './ToolBrowser/path-viewer.component';
import { CategoryHierarchyViewerComponent } from './ToolBrowser/category-hierarchy-viewer.component';
import { NodeViewerComponent } from './ToolBrowser/node-viewer.component';
import { VisualizeComponent } from './Visualize/visualize.component';
import { VisualsTableComponent } from './Visualize/visuals-table.component';
import { ChartContainerComponent } from './Visualize/chart-container.component';
import { DynamicModalComponent } from './ComponentLibrary/DynamicModal/dynamic-modal.component';
import { DynamicContentService } from './ComponentLibrary/DynamicModal/dynamic-content.service';
import { DynamicContentSectionComponent } from './ComponentLibrary/DynamicModal/dynamic-content-section.component';
import { DynamicContentDirective } from './ComponentLibrary/DynamicModal/dynamic-content.directive';
import { ToolListingComponent } from './Visualize/tool-listing.component';
import { DynamicTooltip } from './ComponentLibrary/DynamicTooltip/dynamic-tooltip.component';
import { CountryMapHighChart } from './ToolDetailedView/country-map-highchart';
import { SignInComponent } from './Auth/signin.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from './Auth/auth-guard.service';
import { UserLandingPageComponent } from './User/user-landing-page.component';
import { ToolSuggestionFormComponent } from './User/ToolSuggestion/Member/tool-suggestion-form.component';
import { EditableSingleValueAttributeComponent } from './ComponentLibrary/editable-single-value-attribute.component';
import { SelectableDropDownComponent } from './ComponentLibrary/selectable-drop-down.component';
import { InteractiveKeywordContainerComponent } from './ComponentLibrary/interactive-keyword-container.component';
import { UserToolSuggestionsComponent } from './User/ToolSuggestion/Member/user-tool-suggestions.component';
import { CancellableOperationComponent } from './ComponentLibrary/DynamicModal/cancellable-operation.component';
import { UserFunctionListComponent } from './ComponentLibrary/DynamicSidebar/user-function-list.component';
import { UserFunctionContentComponent } from './ComponentLibrary/DynamicSidebar/user-function-content.component';
import { AdminToolSuggestionsComponent } from './User/ToolSuggestion/Admin/admin-tool-suggestions.component';
import { AdminToolSuggestionModerationFormComponent } from './User/ToolSuggestion/Admin/admin-tool-suggestion-moderation-form.component';
import { UserManagementService } from './User/ToolSuggestion/user-management.service';
import { UserEditProfileComponent } from './User/ToolSuggestion/Member/user-edit-profile.component';
import { ListValueAttributeComponent } from './ComponentLibrary/list-value-attribute.component';
import { UserMenuDropdownComponent } from './ComponentLibrary/user-menu-dropdown.component';
import { UserProfileComponent } from './User/ToolSuggestion/Member/user-profile.component';
import { UsersManagementComponent } from './User/ToolSuggestion/Admin/users-management.component';
import { AnalyticsComponent } from './Analytics/analytics.component';
import { DatepickerRangePopupComponent } from './Analytics/datepicker-range-popup/datepicker-range-popup.component';
import { FilterIndicesUsageComponent } from './Analytics/filter-indices-usage/filter-indices-usage.component';
import { FilterValueFrequencyComponent } from './Analytics/filter-value-frequency/filter-value-frequency.component';
import { SearchTermsComponent } from './Analytics/search-terms/search-terms.component';
import { ToolVisitsComponent } from './Analytics/tool-visits/tool-visits.component';
import { BrowsedAppScenariosComponent } from './Analytics/browsed-app-scenarios/browsed-app-scenarios.component';
import { BrowsedFilterPathComponent } from './Analytics/browsed-filter-path/browsed-filter-path.component';
import { MostPopularValueInFiltersComponent } from './Analytics/most-popular-value-in-filters/most-popular-value-in-filters.component';
import { VisitorCountriesComponent } from './Analytics/visitor-countries/visitor-countries.component';
import { SingleSelectionListComponent } from './ComponentLibrary/single-selection-list.component';
import { UserHomePageComponent } from './User/ToolSuggestion/Member/user-home-page.component';
import { SearchableDropDownComponent } from './ComponentLibrary/dropdown-with-search.component';
import { TermsOfServiceComponent } from './TermsOfService/terms-of-service.component';
import { DigitalToolManagementComponent } from './User/ToolSuggestion/DTEditor/dt-management.component';
import { DigitalToolFormComponent } from './User/ToolSuggestion/DTEditor/dt-tool-form.component';
import { ToolRelationGraphComponent } from './Analytics/tool-relation-graph/tool-relation-graph.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserBackgroundModal } from './UserBackgroundModal/user-background-modal.component';
import { KeywordsComponent } from './ToolDetailedView/keywords.component';
import { GeneralInfoBlockAComponent } from './ToolDetailedView/general-info-block-a/general-info-block-a.component';
import { GeneralInfoBlockBComponent } from './ToolDetailedView/general-info-block-b/general-info-block-b.component';
import { AdditionalInfoBlockAComponent } from './ToolDetailedView/additional-info-block-a/additional-info-block-a.component';

@NgModule({
  declarations: [
    DynamicContentDirective,
    AppComponent,
    AdvancedSearchComponent,
    LandingComponent,
    ContactComponent,
    ToolFilter,
    ToolMainView,
    SelectedAttributes,
    ToolFilterHolder,
    OptionsTree,
    OptionsList,
    ToolTermSearch,
    ToolNavigation,
    ToolResultSizeSetter,
    KBTFooterComponent,
    ToolSorting,
    ToolFilterModal,
    ToolDetailedViewComponent,
    CountryMapHighChart,
    ToolMainInfo,
    ApplicationScenarioHolderComponent,
    ClickableBadgeList,
    ToolDetails,
    HorizontalAttributeList,
    SingleValueAttributeComponent,
    ResultCounter,
    AboutComponent,
    PrivacyComponent,
    CookieBanner,
    Form,
    FormTab,
    EmailStringAttribute,
    StringAttribute,
    NavbarComponent,
    BreadcrumbComponent,
    ToolBrowserComponent,
    PathViewerComponent,
    CategoryHierarchyViewerComponent,
    NodeViewerComponent,
    VisualizeComponent,
    VisualsTableComponent,
    ChartContainerComponent,
    DynamicModalComponent,
    DynamicContentSectionComponent,
    ToolListingComponent,
    DynamicTooltip,
    SignInComponent,
    UserLandingPageComponent,
    ToolSuggestionFormComponent,
    EditableSingleValueAttributeComponent,
    SelectableDropDownComponent,
    InteractiveKeywordContainerComponent,
    UserToolSuggestionsComponent,
    CancellableOperationComponent,
    UserFunctionListComponent,
    UserFunctionContentComponent,
    AdminToolSuggestionsComponent,
    AdminToolSuggestionModerationFormComponent,
    UserEditProfileComponent,
    ListValueAttributeComponent,
    UserMenuDropdownComponent,
    UserProfileComponent,
    UsersManagementComponent,
    AnalyticsComponent,
    DatepickerRangePopupComponent,
    FilterIndicesUsageComponent,
    FilterValueFrequencyComponent,
    SearchTermsComponent,
    ToolVisitsComponent,
    BrowsedAppScenariosComponent,
    BrowsedFilterPathComponent,
    MostPopularValueInFiltersComponent,
    VisitorCountriesComponent,
    SingleSelectionListComponent,
    UserHomePageComponent,
    SearchableDropDownComponent,
    TermsOfServiceComponent,
    DigitalToolManagementComponent,
    DigitalToolFormComponent,
    SearchableDropDownComponent,
    ToolRelationGraphComponent,
    UserBackgroundModal,
    KeywordsComponent,
    GeneralInfoBlockAComponent,
    GeneralInfoBlockBComponent,
    AdditionalInfoBlockAComponent,
  ],

    imports: [
        OAuthModule.forRoot(),
        CommonModule,
        BrowserModule,
        HttpClientModule,
        NoopAnimationsModule,
        MatListModule,
        MatTreeModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatTableModule,
        MatIconModule,
        MatFormFieldModule,
        MatChipsModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        MatButtonModule,
        MatRadioModule,
        AppRoutingModule,
        NgbModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
    ],
  providers: [
    CookieService, DynamicContentService, UserManagementService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
    {provide: APP_BASE_HREF, useValue: '/kbt'},
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [DynamicTooltip],
  exports: [ MatFormFieldModule, MatInputModule, DynamicContentDirective, NgbTooltipModule, NgbTooltip ]
})
export class AppModule {
  constructor(){}
}
