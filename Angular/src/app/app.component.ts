import { Component } from '@angular/core';
import { environment } from '@environments/environment.development';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent{

  readonly title: string = environment.title;
  readonly navItems = {
      nav: [
        { name: "Arbre Familial", link: "/family-tree/user" },
        { name: "Recherche", link: "/search" },
      ],
      user: [
        {name: "Profil", link: "/user/profile", icon: "face"},
        {name: "Notifications", link: "/user/notifications", icon: "inbox"},
        {name: "Deconnexion", link: "/auth/logout", icon: "exit_to_app"},
      ]
  }
}
