import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './About/about.component';
import { AppComponent } from './app.component';
import { AuthGuardService } from './Auth/auth-guard.service';
import { SignInComponent } from './Auth/signin.component';
import { ContactComponent } from './ContactPage/contact.component';
import { LandingComponent } from './LandingPage/landing.component';
import { PrivacyComponent } from './Privacy/privacy.component';
import { ToolBrowserComponent } from './ToolBrowser/tool-browser.component';
import { ToolDetailedViewComponent } from './ToolDetailedView/tool-detailed-view.component';
import { AdvancedSearchComponent } from './ToolFilterPage/advanced-search.component';
import { UserProfileComponent } from './User/ToolSuggestion/Member/user-profile.component';
import { UserLandingPageComponent } from './User/user-landing-page.component';
import { VisualizeComponent } from './Visualize/visualize.component';
import { AnalyticsComponent } from './Analytics/analytics.component';
import { TermsOfServiceComponent } from './TermsOfService/terms-of-service.component';

const routes: Routes = [
  { path: '', component: LandingComponent ,  pathMatch: 'full'},
  { path: 'index', component: LandingComponent },
  { path: 'search', component: AdvancedSearchComponent  },
  { path: 'tool/:id', component: ToolDetailedViewComponent  },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'browse', component: ToolBrowserComponent },
  { path: 'dashboard', component: VisualizeComponent },
  { path: 'home', component: UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'digital-tool-suggestion', component: UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'my-suggestions', component: UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'users-management', component: UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'dt-management', component: UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'moderate-suggestions', component: UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'analytics', component: UserLandingPageComponent, canActivate:[AuthGuardService]  },
  { path: 'my-profile', component: /*UserProfileComponent*/UserLandingPageComponent, canActivate:[AuthGuardService] },
  { path: 'signin', component: SignInComponent/*, canDeactivate:[AuthGuardService] */ },
  /*  { path: 'signout', component: SignInComponent, canActivate:[AuthGuardService] },*/
  { path: 'browse/:category', component: ToolBrowserComponent },
  { path: 'browse/:category/:aid', component: ToolBrowserComponent }  ,
  { path: 'browse/:category/:aid/:bid', component: ToolBrowserComponent } ,
  { path: 'browse/:category/:aid/:bid/:cid', component: ToolBrowserComponent }

//  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })], providers: [
    AuthGuardService
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
