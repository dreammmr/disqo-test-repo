import {Component} from '@angular/core';
import {ApiService} from './api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ApiService]
})
export class AppComponent {
    dataModel: any = {
        id: '',
        title: '',
        notes: []
    };

    noteModel = {
        title: '',
        note: ''
    };

    constructor(private api: ApiService) {
        this.checkLocalCacking();
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
            that.dataModel.notes = that.simplifyNotes(response.files);

            that.localCaching();
        });
    }

    createNote() {
        const that = this;

        that.dataModel.notes.push(that.noteModel);
        that.noteModel = {
            title: '',
            note: ''
        };

        const data = {
            title: that.dataModel.title,
            notes: that.objectifyNotes(that.dataModel.notes)
        };

        that.api.updateNotepad(that.dataModel.id, data).then((response: any) => {
            that.dataModel.id = response.id;
            that.dataModel.notes = that.simplifyNotes(response.files);

            that.localCaching();
        });
    }

    deleteNote(index) {
        const that = this;

        that.dataModel.notes.splice(index, 1);

        const data = {
            title: that.dataModel.title,
            notes: that.objectifyNotes(that.dataModel.notes)
        };

        that.api.updateNotepad(that.dataModel.id, data).then((response: any) => {
            that.dataModel.id = response.id;
            that.dataModel.notes = that.simplifyNotes(response.files);

            debugger;

            that.localCaching();
        });
    }

    objectifyNotes(files: any) {
        const data = {};

        files.forEach((item) => {
            data[item.title] = {
                content: item.note
            };
        });

        return data;
    }

    simplifyNotes(files: any) {
        const data = [];

        for (const i of Object.keys(files)) {
            data.push({
                title: files[i].filename,
                note: files[i].content
            });
        }

        return data;
    }

    updateNotepad() {
        const that = this;
        const data = {
            title: that.dataModel.title,
            notes: that.objectifyNotes(that.dataModel.notes)
        };

        that.api.updateNotepad(that.dataModel.id, data).then((response: any) => {
            that.dataModel.id = response.id;
            that.dataModel.notes = that.simplifyNotes(response.files);

            that.localCaching();
        });
    }

    deleteNotepad() {
        const that = this;

        that.api.deleteNotepad(that.dataModel.id).then((response: any) => {
            that.dataModel = {
                id: '',
                title: '',
                notes: []
            };

            localStorage.removeItem('cache');
        });
    }

    checkLocalCacking() {
        const that = this;
        let cachedModel = localStorage.getItem('cache');

        if (!cachedModel) {
            return;
        }
        cachedModel = JSON.parse(cachedModel);

        that.dataModel = cachedModel;
    }

    localCaching() {
        const that = this;

        if (!that.dataModel.id) {
            return;
        }
        localStorage.setItem('cache', JSON.stringify(that.dataModel));
    }
}
