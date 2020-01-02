import { NgModule, ModuleWithProviders } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from '../Pages/Layouts/Public/Public-Layout.Component';
import { SecureLayoutComponent } from '../Pages/Layouts/Secure/Secure-Layout.Component';
import { AuthGuard } from '../Guards/auth.guard';
import { DashBoardComponent } from '../Pages/DashBoard/DashBoard.Component';
import { regisrationComponent } from '../Pages/Regisration/regisration.component';
const routes: Routes = [
  { path: '', loadChildren: '../Pages/Index/Module/Index.module#IndexModule' },
  { path: 'index', loadChildren: '../Pages/Index/Module/Index.module#IndexModule' },

  {
    path: 'AddEditRole', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Administration/AddEditRole/Module/addEditRole.module#AddEditRoleModule',
  },
  {
    path: 'CreateJobs', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/JobPost/CreateJob/Module/CreateJob.module#CreateJobsModule',
  },

  {
    path: 'CreateWalkins', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Walkin/CreateWalkin/Module/CreateWalkin.module#CreateWalkinsModule',
  },

  {
    path: 'WalkinList', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Walkin/WalkinList/Module/WalkinList.module#WalkinListModule',
  },

  {
    path: 'Candidate', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/AgencyCandidate/AgencyCandidateList/Module/agCandidate.module#agCandidateModule',
  },
  {
    path: 'AddCandidate', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/AgencyCandidate/AddAgencyCandidate/Module/AddAgCandidate.module#AddAgCandidateModule',
  },
  {
    path: 'UpdateCandidate', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/AgencyCandidate/UpdateAgencyCandidate/Module/UpdateAgCandidate.module#UpdateAgCandidateModule',
  },
  {
    path: 'GeoLocation', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/GeoLocation/Module/Geolocation.module#GeolocationModule',
  },
  {
    path: 'dashboard',
    component: SecureLayoutComponent,
    children: [
      { path: '', component: DashBoardComponent, },
    ], canActivate: [AuthGuard],
  },

  {
    path: 'AddUser', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/User/AddUser/Module/addUser.module#AddUserModule',

  },

  {
    path: 'ShowUser', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/User/ShowUser/Module/showUser.module#ShowUserModule',

  },
  {
    path: 'userpermission', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/User/UserPermission/Module/UserPermission.module#UserPermissionModule',

  },
  {
    path: 'JobSearch/:id', loadChildren: '../Pages/JobSearch/Module/JobSearch.module#JobSearchModule',
  },

  {
    path: 'AppliedJob', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/JobApplicantReceived/Module/JobApplicantReceived.module#JobApplicantReceivedModule',
  },


  {
    path: 'AppliedJob2', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/ReviewApp/Module/JobApplicantReceived.module#JobApplicantReceivedModule',
  },


  // {
  //   path:'screeningcandidate', canActivate: [AuthGuard], component:SecureLayoutComponent,loadChildren:'../Pages/CandidateScreening/Module/candidatescreening.module#CandidateScreeningModule',
  // },

  {
    path: 'CandidateSearch', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Search/CandidateSearch/Module/CandidateSearch.module#CandidateSearchModule',

  },


  {
    path: 'updateprofile', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren:
      '../Pages/UserProfile/UpdateProfile/Module/updateProfile.module#updateProfileModule',
  },

  {
    path: 'companyprofile', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren:
      '../Pages/UserProfile/companyProfile/Module/companyProfile.module#companyProfileModule',
  },

  {
    path: 'regisration', loadChildren: '../Pages/Regisration/Module/regisration.module#RegisrationModule',

  },
  {
    path: 'privacy', loadChildren: '../Pages/Privacy/Module/privacy.module#PrivacyModule',

  },
  {
    path: 'feedback', loadChildren: '../Pages/feedback/Module/feedback.module#FeedbackModule',

  },
  {
    path: 'events', loadChildren: '../Pages/Event/Module/event.module#EventModule',

  },
  {
    path: 'subscription', loadChildren: '../Pages/subscription/Module/subscription.module#SubscriptionModule'

  },
  {
    path: 'JobList', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/JobPost/JobList/Module/JobList.module#JobListModule',
  },

  {
    path: 'ViewJob', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/JobPost/ViewJob/Module/ViewJob.module#ViewJobModule',
  },


  {
    path: 'scheduleinterview', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Interview/ScheduleInterview/Module/ScheduleInterview.module#ScheduleInterviewModule',

  },

  {
    path: 'updateinterview', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Interview/UpdateInterview/Module/UpdateInterview.module#UpdateInterviewModule',

  },
  {
    path: 'offerletter', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Interview/OfferLetter/Module/OfferLetter.module#OfferLetterModule',

  },
  {
    path: 'joiningconfirmation', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Interview/JoiningConfirmation/Module/JoiningConfirmation.module#JoiningConfirmationModule',

  },
  {
    path: 'InterviewedCandidate', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Interview/InterviewedCandidate/Module/InterviewedCandidate.module#InterviewedCandidateModule',

  },
  {
    path: 'viewwalkin', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Walkin/ViewWalkIn/Module/ViewWalkIn.module#ViewWalkInModule',
  },

  {
    path: 'AgencyJobList', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/AgencyJobSearch/AgencyJobList/Module/AgencyJobList.module#AgencyJobListModule',

  },

  {
    path: 'ApplyJob', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/AgencyJobSearch/ApplyJobs/Module/ApplyJobs.module#ApplyJobsModule',

  },

  {
    path: 'AgencyJobApply', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/AgencyJobSearch/AgencyJobApply/Module/AgencyJobApply.module#AgencyJobApplyModule',
  },

  {
    path: 'PredictiveSearch', canActivate: [AuthGuard], component: SecureLayoutComponent,
    loadChildren: '../Pages/Predictive/Module/PredictiveSearch.module#PredictiveSearchModule'
  },

  {
    path: 'TCSearch', canActivate: [AuthGuard], component: SecureLayoutComponent,
    loadChildren: '../Pages/TCSearch/Module/TCSearch.module#TCSearchModule'

  },

  {
    path: 'agencyList', canActivate: [AuthGuard], component: SecureLayoutComponent,
    loadChildren: '../Pages/AgencyList/Module/agencyList.module#AgencyListModule'
  },

  {
    path: 'UploadDocument', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/UploadDocument/UploadDocument/Module/UploadDocument.module#UploadDocumentModule',

  },
  {
    path: 'uploadSalarySlip', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/UploadDocument/UploadSalarySlip/Module/UploadSalarySlip.module#UploadSalarySlipModule',

  },
  {
    path: 'YuvaSandesh', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/YuvaSendesh/Module/YuvaSendesh.module#YuvaSendeshModule',
  },

  {
    path: 'screeningQuestion', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/ScreeningQuestion/Module/ScreeningQuestion.module#ScreeningQuestionModule'
  },


  {
    path: 'mysandesh', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/MySendesh/Module/MySendesh.module#MySendeshModule'
  },

  {
    path: 'PlacedCandidate', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/PlacedCandidate/Module/PlacedCandidate.module#PlacedCandidateModule'
  },

  {
    path: 'candidateofferletter', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/EventCandidateOfferlatter/Module/Offerlatter.module#OfferlatterModule'
  },

  {
    path: 'event', canActivate: [AuthGuard], component: SecureLayoutComponent, loadChildren: '../Pages/Events/Module/Events.module#EventsModule'
  },
  {
    path: 'gallery',loadChildren: '../Pages/Gallery/Module/gallery.module#GalleryModule'
  },


  { pathMatch: 'full', path: '**', redirectTo: 'index' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

