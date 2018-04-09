import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { JobTitle } from '../../job-title';
import { environment } from '../../../environments/environment';
import { Project } from '../../project/common/project';

const userUrl = `${environment.backend_url}/api/users`;
const skillsUrl = `${environment.backend_url}/api/skills`;

@Injectable()
export class UserService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    const url = userUrl;
    return this.http
      .get(url)
      .catch(this.handleError);
  }

  getUser(id: number): Observable<User> {
    const index = id;
    const url = userUrl + '/' + index;

    return this.http
      .get(url, { headers: this.headers })
      .catch(this.handleError);
  }

  getUserByEmail(name: string): Observable<User> {
    const url = userUrl + '/email/' + [name] + '/';
    return this.http.get(url)
      .catch(this.handleError);
  }

  getUsersByOrganization(organizationId: number): Observable<User[]> {
    const url = userUrl + '/organization/' + [organizationId];
    return this.http
      .get(url)
      .catch(this.handleError);
  }

  // Page data always starts at offset zero (0)
  // Returns a JSON object with the data array of Users and totalItems count
  searchUsers(
    keyword?: string,
    // jobTitle?: number,
    jobTitles?: number[],
    skills?: string[],
    countries?: number[],
    status?: string,
    role?: string,
    publishFlag?: string,
    page?: number,
    size?: number): Observable<any> {
    const params = new HttpParams();

    // TODO Append page, sort here

    if (keyword) {
      params.append('keyWord', keyword);
    }
    // if (jobTitle) {
    //  params.append('jobTitle', String(jobTitle));
    // }
    if (jobTitles) {
      for (let i = 0; i < jobTitles.length; i++) {
        params.append('jobTitles', String(jobTitles[i]));
      }
    }

    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        params.append('skills', skills[i]);
      }
    }

    if (countries) {
      for (let i = 0; i < countries.length; i++) {
        params.append('countries', String(countries[i]));
      }
    }

    if (status) {
      params.append('status', status);
    }

    if (publishFlag) {
      params.append('publishFlag', publishFlag);
    }

    if (role) {
      params.append('role', role);
    }

    if (page) {
      params.append('page', String(page - 1));
    }

    if (size) {
      params.append('size', String(size));
    }

    return this.http
      .get(`${userUrl}/search`, { headers: this.headers, params: params })
      .catch(this.handleError);
  }

  add(user: User): Observable<User> {
    // debugger;
    const url = userUrl;
    return this.http
      .post(url, user, { headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`) })
      .catch(this.handleError);
  }

  delete(id: number) {
    const url = userUrl + '/' + id;
    return this.http
      .delete(url, {
        headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response',
        responseType: 'text'
      })
      .catch(this.handleError);
  }

  update(user: User) {
    const url = userUrl;
    return this.http
      .put(url, user, {
        headers: this.headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response',
        responseType: 'text'
      })
      .catch(this.handleError);
  }

  retrieveAvatar(id: number) {
    return this.http
      .get(`${userUrl}/${id}/avatar`, { observe: 'response',responseType: 'text' });
  }

  saveAvatar(id: number, formData: FormData) {
    return this.http
      .post(`${userUrl}/${id}/avatar`, formData, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        observe: 'response',
        responseType: 'text'
      })
      .catch(this.handleError);
  }

  /*
    Http call to save the avatar image
  */
  saveAvatarImg(id: number, imgUrl: string) {
    return this.http
      .put(`${userUrl}/${id}/avatar`, '', {
        headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`),
        params: new HttpParams().set('imgUrl', `${imgUrl}`),
        observe: 'response',
        responseType: 'text'
      });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  public getAllJobTitlesBeforePageInit(): Promise<JobTitle[]> {
    const url = userUrl + '/jobTitles';
    return this.http
      .get(url).toPromise()
      .then(res => { return res as JobTitle[]; })
      .catch(this.handleError);
    // .map( res => { return res.json() as JobTitle[]; })
    // .catch(this.handleError);
  }
  public getAllJobTitles(): Observable<JobTitle[]> {
    const url = userUrl + '/jobTitles';
    return this.http
      .get(url)
      .catch(this.handleError);
  }
  /* obsolete
  // Page data always starts at offset zero (0)
  // Only active users are retrieved
  // Returns a JSON object with the data array of Users and totalItems count
  public getUsers(page: number): Observable<any> {
    const url = userUrl + '/active?page=' + (page - 1) + '&size=10' + '&sort=id,desc&sort=userName,asc';
    return this.http
               .get(url)
               .map( res => ({data: res.json().content, totalItems: res.json().totalElements}))
               .catch(this.handleError);
  } */
}
