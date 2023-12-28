import { Injectable } from '@angular/core';
import { User } from '../models';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly keyName: string = "auth-user";

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(this.keyName);
    window.sessionStorage.setItem(this.keyName, JSON.stringify(user));
  }

  public deleteUser(): void {
    window.sessionStorage.removeItem(this.keyName);
  }

  public getUser(): User | null {
    const user = window.sessionStorage.getItem(this.keyName);
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(this.keyName);
    if (user) {
      return true;
    } else {
      return false;
    }
  }
    
}