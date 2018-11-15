import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class ApiService {
    accessToken: string;
    apiUrl: string;

    constructor(private http: HttpClient) {
        this.accessToken = '9933cd50d25fb92736dc21bc0d9d0a9f50c37c89';
        this.apiUrl = 'https://api.github.com';
    }

    createNotepad(data) {
        const that = this;
        return new Promise((resolve) => {

            const req = {
                'description': data,
                'public': true,
                'files': {
                    'Note 1': {
                        'content': 'Sample data for note 1.'
                    }
                }
            };
            const httpOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + that.accessToken
                }
            };

            that.http.post(that.apiUrl + '/gists', req, httpOptions).toPromise().then(function (response) {
                resolve(response);
            });
        });
    }

    updateNotepad(gistId, data) {
        const that = this;
        return new Promise((resolve) => {

            const req = {
                'description': data.title,
                'files': data.notes
            };

            const httpOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + that.accessToken
                }
            };

            that.http.patch(that.apiUrl + '/gists/' + gistId, req, httpOptions).toPromise().then(function (response) {
                resolve(response);
            });
        });
    }

    deleteNotepad(gistId) {
        const that = this;
        return new Promise((resolve) => {
            const httpOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + that.accessToken
                }
            };

            that.http.delete(that.apiUrl + '/gists/' + gistId, httpOptions).toPromise().then(function (response) {
                resolve(response);
            });
        });
    }
}
