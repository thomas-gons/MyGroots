import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@environments/environment.development';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent, RegisterComponent, LogoutComponent, ForgotPasswordComponent, ChangePasswordComponent, ActivateAccountComponent } from './features/auth';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { ProfileComponent, NotificationsComponent, ProfileModifyComponent} from './features/user';
import { SearchComponent } from './features/search/search.component';
import { FamilyTreeComponent } from './features/family-tree/family-tree.component';
import { authGuard } from './core/guards/auth.guard';


const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  {
    path: "home",
    component: HomeComponent,
    title: environment.title,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        component: LoginComponent,
        title: environment.title + " - Connexion",
      },
      {
        path: "register",
        component: RegisterComponent,
        title: environment.title + " - Inscription",
      },
      {
        path: "logout",
        canActivate: [authGuard],
        component: LogoutComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        title: environment.title + " - Mot de passe oublié",
      },
      {
        path: "change-password/:id/:token",
        component: ChangePasswordComponent,
        title: environment.title + " - Modifier mot de passe",
      },
      {
        path: "activate-account/:id",
        component: ActivateAccountComponent,
      }
    ]
  },
  {
    path: "family-tree",
    canActivate: [authGuard],
    component: FamilyTreeComponent,
    title: environment.title + " - Arbre Familial",
  },
  {
    path: "search",
    component: SearchComponent,
    title: environment.title + " - Recherche",
  },
  {
    path: "user",
    children: [
      {
        path: "profile",
        canActivate: [authGuard],
        component: ProfileComponent,
        title: environment.title + " - Profil",
      },
      {
        path: "notifications",
        canActivate: [authGuard],
        component: NotificationsComponent,
        title: environment.title + " - Notifications",
      },
      {
        path: "profile-modify",
        canActivate: [authGuard],
        component: ProfileModifyComponent,
        title: environment.title + " - Profil-modify",
      },
    ]
  },
  {
    path: "**",
    pathMatch: "full",
    component: PageNotFoundComponent,
    title: environment.title,
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
