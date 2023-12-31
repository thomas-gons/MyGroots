import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly url: string = environment.apiUrl + "/search";
  private readonly httpOptions = {
    headers: new HttpHeaders({ "Content-type": "application/json" })
  };

  constructor(
    private _httpClient: HttpClient,
  ) {}

  /**
   * Send request to server to get a list of Person matching firstName, lastName or birthDate.
   * @param firstName FirstName to match
   * @param lastName LastName to match
   * @param birthDate BirthDate to match
   */
  public searchByName(firstName: string, lastName: string, birthDate: string): Observable<any> {
    return this._httpClient.post(this.url + "/name", {firstName: firstName, lastName: lastName, birthDate: birthDate}, this.httpOptions);
  }

  /**
   * Send request to server to get an Account.
   * @param accountId Id of the Person in database
   */
  public searchById(accountId: string): Observable<any> {
    return this._httpClient.post(this.url + "/id", {accountId: accountId}, this.httpOptions);
  }
  /**
   * Send request to server to get an Account.
   * @param accountId Id of the Person in database
   */
  public searchCommon(src_acc_id: string, target_id: string): Observable<any> {
    return this._httpClient.post(this.url + "/common-members", {src_acc_id: src_acc_id, target_id: target_id}, this.httpOptions);
  }
}
