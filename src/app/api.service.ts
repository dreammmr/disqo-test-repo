import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class ApiService {
    accessToken: string;
    apiUrl: string;

    constructor(private http: HttpClient) {
        this.accessToken = '0affb05227288b2411a44571c6e4405ea33e9018';
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

    readNotepad(data) {

    }

    updateNotepad(data) {

    }

    deleteNotepad(data) {

    }
}
