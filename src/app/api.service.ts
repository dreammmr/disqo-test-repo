import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ApiService {
    accessToken: '98b739fccc27487bbfe4c0a0f4a0d6b16968be7f';
    apiUrl: 'https://api.github.com';

    constructor(private http: HttpClient) {
    }

    createNotepad(data) {
        const that = this;
        return new Promise((resolve, reject) => {
            that.http.post(that.apiUrl + '/gists', data).toPromise().then(function (response) {
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
