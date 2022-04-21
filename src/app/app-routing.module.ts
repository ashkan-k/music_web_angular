import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./pages/layout/layout.component";
import {DashboardComponent} from "./pages/admin/dashboard/dashboard.component";
import {LoginComponent} from "./pages/auth/login/login.component";
import {SuperuserGuard} from "./guards/superuser.guard";
import {Error404Component} from "./pages/errors/error404/error404.component";
import {AuthCheckGuard} from "./guards/auth-check.guard";
import {UsersListComponent} from "./pages/admin/users/users-list/users-list.component";
import { SingersListComponent } from './pages/admin/singers/singers-list/singers-list.component';
import { TrackesListComponent } from './pages/admin/tracks/tracks-list/tracks-list.component';
import { AlbumsListComponent } from './pages/admin/albums/albums-list/albums-list.component';
import {SettingsListComponent} from "./pages/admin/settings/settings-list/settings-list.component";
import {ProfileComponent} from "./pages/auth/profile/profile.component";
import {CommentsListComponent} from "./pages/admin/comments/comments-list/comments-list.component";
import {Like_dislikesListComponent} from "./pages/admin/like_dislikes/like_dislikes-list/like_dislikes-list.component";
import {Wish_listsListComponent} from "./pages/admin/wish_lists/wish_lists/wish_lists-list.component";
import {UploadsListComponent} from "./pages/admin/uploads/uploads-list/uploads-list.component";
import {BlockedUsersListComponent} from "./pages/admin/users/blocked-users-list/users-list.component";
import {GuestGuard} from "./guards/guest.guard";
import {SubscriptionsListComponent} from "./pages/admin/subscriptions/subscriptions-list/subscriptions-list.component";
import {SubscribersListComponent} from "./pages/admin/subscribers/subscribers-list/subscribers-list.component";
import {TransactionsListComponent} from "./pages/admin/transactions/transactions-list/transactions-list.component";
import {GenresListComponent} from "./pages/admin/genres/genres-list/genres-list.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {Verify_accountComponent} from "./pages/auth/verify_account/verify_account.component";
import {ResetPasswordComponent} from "./pages/auth/reset_password/reset_password/reset_password.component";
import {ResetPasswordConfirmComponent} from "./pages/auth/reset_password/reset_password_confirm/reset_password_confirm.component";
import {ResetPasswordEnterComponent} from "./pages/auth/reset_password/reset_password_enter/reset_password_enter.component";
import {GoogleAuthComponent} from "./pages/auth/google_auth/google_auth.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  },

  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [SuperuserGuard],
    children: [
      {
        path: '', component: DashboardComponent
      },
      {
        path: 'users', component: UsersListComponent
      },
      {
        path: 'blocked/users', component: BlockedUsersListComponent
      },
      {
        path: 'singers', component: SingersListComponent
      },
      {
        path: 'albums', component: AlbumsListComponent
      },
      {
        path: 'tracks', component: TrackesListComponent
      },
      {
        path: 'settings', component: SettingsListComponent
      },
      {
        path: 'comments', component: CommentsListComponent
      },
      {
        path: 'like_dislikes', component: Like_dislikesListComponent
      },
      {
        path: 'wish_lists', component: Wish_listsListComponent
      },
      {
        path: 'uploads', component: UploadsListComponent
      },
      {
        path: 'subscriptions', component: SubscriptionsListComponent
      },
      {
        path: 'subscribers', component: SubscribersListComponent
      },
      {
        path: 'transactions', component: TransactionsListComponent
      },
      {
        path: 'genres', component: GenresListComponent
      },
    ]
  },

  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthCheckGuard],
    children: [
      {
        path: 'profile', component: ProfileComponent
      },
    ]
  },

  {
    path: 'admin',
    canActivate: [GuestGuard],
    children: [
      { path : 'login' , component : LoginComponent },
      { path : 'register' , component : RegisterComponent },
      { path : 'verify' , component : Verify_accountComponent },
      { path : 'google/auth' , component : GoogleAuthComponent },
    ]
  },

  {
    path: 'admin/reset/password',
    canActivate: [GuestGuard],
    children: [
      { path : '' , component : ResetPasswordComponent },
      { path : 'confirm' , component : ResetPasswordConfirmComponent },
      { path : 'enter' , component : ResetPasswordEnterComponent },
    ]
  },

  {path: '**', component : Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
