import {Component} from '@angular/core';
import {ApiService} from './api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ApiService]
})
export class AppComponent {
    dataModel = {
        id: '',
        title: '',
        notes: []
    };

    noteModel = {
        title: '',
        note: ''
    };

    constructor(private api: ApiService) {
    }

    saveClick() {
        const that = this;

        if (that.dataModel.id) {
            that.updateNotepad();
        } else {
            that.createNotepad();
        }
    }

    createNotepad() {
        const that = this;

        that.api.createNotepad(that.dataModel.title).then((response: any) => {
            that.dataModel.id = response.id;
            that.dataModel.notes = response.files;

            that.localCaching();
        });
    }

    updateNotepad() {
        alert('update');
    }

    deleteNotepad() {

    }

    localCaching() {
        const that = this;

        if (!that.dataModel.id) {
            return;
        }

        localStorage.setItem('cache', JSON.stringify(that.dataModel));
    }
}
