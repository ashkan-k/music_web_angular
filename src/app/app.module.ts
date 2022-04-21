import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './pages/layout/layout.component';
import {FormsModule} from "@angular/forms";
import {DashboardComponent} from './pages/admin/dashboard/dashboard.component';
import {LoginComponent} from './pages/auth/login/login.component';
import {GlobalPropertiesService} from "./services/global-properties.service";
import {ReactiveFormsModule} from '@angular/forms';
import {UserProviderService} from "./services/user-provider.service";
import {SuperuserGuard} from "./guards/superuser.guard";
import {NgxLoadingModule} from 'ngx-loading';
import {Error404Component} from './pages/errors/error404/error404.component';
import {AuthCheckGuard} from "./guards/auth-check.guard";
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TokenInterceptorService} from "./services/token-interceptor.service";
import { SidebarComponent } from './pages/admin/sections/admin/sidebar/sidebar.component';
import { UsersListComponent } from './pages/admin/users/users-list/users-list.component';
import { UserModalComponent } from './pages/admin/users/user-modal/user-modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SingersListComponent } from './pages/admin/singers/singers-list/singers-list.component';
import { SingerModalComponent } from './pages/admin/singers/singer-modal/singer-modal.component';
import { TrackesListComponent } from './pages/admin/tracks/tracks-list/tracks-list.component';
import { TrackModalComponent } from './pages/admin/tracks/track-modal/track-modal.component';
import { AlbumsListComponent } from './pages/admin/albums/albums-list/albums-list.component';
import { AlbumModalComponent } from './pages/admin/albums/album-modal/album-modal.component';
import {SettingModalComponent} from "./pages/admin/settings/settings-modal/setting-modal.component";
import {SettingsListComponent} from "./pages/admin/settings/settings-list/settings-list.component";
import { TruncatePipePipe } from './truncate-pipe.pipe';
import {PaginationComponent} from "./pages/admin/sections/admin/pagination/pagination.component";
import { ProfileComponent } from './pages/auth/profile/profile.component';
import {CommentModalComponent} from "./pages/admin/comments/comment-modal/comment-modal.component";
import {CommentsListComponent} from "./pages/admin/comments/comments-list/comments-list.component";
import {CommentChangeStatusModalComponent} from "./pages/admin/comments/comment-change-status-modal/comment-modal.component";
import {Like_dislikesListComponent} from "./pages/admin/like_dislikes/like_dislikes-list/like_dislikes-list.component";
import {Wish_listsListComponent} from "./pages/admin/wish_lists/wish_lists/wish_lists-list.component";
import {Wish_listModalComponent} from "./pages/admin/wish_lists/wish_list-modal/wish_list-modal.component";
import {UploadsListComponent} from "./pages/admin/uploads/uploads-list/uploads-list.component";
import {UploadShowModalComponent} from "./pages/admin/uploads/upload-show-modal/upload-modal.component";
import {UploadModalComponent} from "./pages/admin/uploads/upload-modal/upload-modal.component";
import {BulkActionsComponent} from "./pages/admin/sections/admin/bulk-actions/bulk-actions.component";
import {BlockedUsersListComponent} from "./pages/admin/users/blocked-users-list/users-list.component";
import {SubscriptionsListComponent} from "./pages/admin/subscriptions/subscriptions-list/subscriptions-list.component";
import {SubscriptionModalComponent} from "./pages/admin/subscriptions/subscriptions-modal/subscription-modal.component";
import {SubscribersListComponent} from "./pages/admin/subscribers/subscribers-list/subscribers-list.component";
import {SubscriberModalComponent} from "./pages/admin/subscribers/subscriber-modal/subscriber-modal.component";
import {TransactionsListComponent} from "./pages/admin/transactions/transactions-list/transactions-list.component";
import {TransactionModalComponent} from "./pages/admin/transactions/transactions-modal/transaction-modal.component";
import {GenresListComponent} from "./pages/admin/genres/genres-list/genres-list.component";
import {GenreModalComponent} from "./pages/admin/genres/genre-modal/genre-modal.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {Verify_accountComponent} from "./pages/auth/verify_account/verify_account.component";
import {ResetPasswordComponent} from "./pages/auth/reset_password/reset_password/reset_password.component";
import {ResetPasswordConfirmComponent} from "./pages/auth/reset_password/reset_password_confirm/reset_password_confirm.component";
import {ResetPasswordEnterComponent} from "./pages/auth/reset_password/reset_password_enter/reset_password_enter.component";
import {GoogleAuthComponent} from "./pages/auth/google_auth/google_auth.component";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    DashboardComponent,
    LoginComponent,
    Error404Component,
    SidebarComponent,
    UsersListComponent,
    UserModalComponent,
    SingersListComponent,
    SingerModalComponent,
    TrackesListComponent,
    TrackModalComponent,
    AlbumsListComponent,
    AlbumModalComponent,
    SettingsListComponent,
    SettingModalComponent,
    TruncatePipePipe,
    PaginationComponent,
    ProfileComponent,
    CommentModalComponent,
    CommentsListComponent,
    CommentChangeStatusModalComponent,
    Like_dislikesListComponent,
    Wish_listsListComponent,
    Wish_listModalComponent,
    UploadsListComponent,
    UploadShowModalComponent,
    UploadModalComponent,
    BulkActionsComponent,
    BlockedUsersListComponent,
    SubscriptionsListComponent,
    SubscriptionModalComponent,
    SubscribersListComponent,
    SubscriberModalComponent,
    TransactionsListComponent,
    TransactionModalComponent,
    GenresListComponent,
    GenreModalComponent,
    RegisterComponent,
    Verify_accountComponent,
    ResetPasswordComponent,
    ResetPasswordConfirmComponent,
    ResetPasswordEnterComponent,
    GoogleAuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#2d958b',
      secondaryColour: '#2d958b',
      tertiaryColour: '#2d958b',
      fullScreenBackdrop: true
    }),
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    SuperuserGuard, AuthCheckGuard, UserProviderService, GlobalPropertiesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
