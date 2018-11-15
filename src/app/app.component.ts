import {Component} from '@angular/core';
import {ApiService} from './api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ApiService]
})
export class AppComponent {
    loading = false;
    errors: any = {
        isset: false,
        message: ''
    };
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
        this.checkLocalCacking(); // Checking the local storage at the beginning.
    }

    saveClick() {
        const that = this;
        that.loading = true; // Turning the loader on.

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
            that.dataModel.notes = that.simplifyNotes(response.files); // Transforming objects - into arrays.

            that.localCaching();
            that.loading = false; // Turning the loader off.
        }, (error) => {
            that.errors.isset = true;
            that.errors.message = error.message;
        });
    }

    createNote() {
        const that = this;

        const notes = that.dataModel.notes;
        notes.unshift(that.noteModel);

        that.noteModel = {
            title: '',
            note: ''
        };

        const data = {
            title: that.dataModel.title,
            notes: that.objectifyNotes(notes)
        };

        that.api.updateNotepad(that.dataModel.id, data).then((response: any) => {
            that.dataModel.id = response.id;
            that.dataModel.notes = that.simplifyNotes(response.files);

            that.localCaching();
            that.loading = false;
        }, (error) => {
            that.errors.isset = true;
            that.errors.message = error.message;
        });
    }

    deleteNote(index) {
        const that = this;
        that.loading = true;

        const data = {
            title: that.dataModel.title,
            notes: that.objectifyNotes(that.dataModel.notes)
        };

        data.notes[that.dataModel.notes[index].title] = null;

        that.api.updateNotepad(that.dataModel.id, data).then((response: any) => {
            that.dataModel.id = response.id;
            that.dataModel.notes = that.simplifyNotes(response.files);

            that.localCaching();
            that.loading = false;
        }, (error) => {
            that.errors.isset = true;
            that.errors.message = error.message;
        });
    }

    /** A function that turns array items into GitHub API params.
     * @param files
     */
    objectifyNotes(files: any) {
        const data = {};

        files.forEach((item) => {
            data[item.title] = {
                content: item.note
            };
        });

        return data;
    }

    /** A function that turns GitHub API params into arrays -> for loop iterations.
     * @param files
     */
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
            that.loading = false;
        }, (error) => {
            that.errors.isset = true;
            that.errors.message = error.message;
        });
    }

    deleteNotepad() {
        const that = this;
        that.loading = true;


        that.api.deleteNotepad(that.dataModel.id).then((response: any) => {
            that.dataModel = {
                id: '',
                title: '',
                notes: []
            };

            localStorage.removeItem('cache');
            that.loading = false;
        }, (error) => {
            that.errors.isset = true;
            that.errors.message = error.message;
        });
    }

    /** A function for checking whether local storage is empty or not.
     * @param files
     */
    checkLocalCacking() {
        const that = this;
        let cachedModel = localStorage.getItem('cache');

        if (!cachedModel) {
            return;
        }
        cachedModel = JSON.parse(cachedModel);

        that.dataModel = cachedModel;
    }

    /** This function is responsible for adding datas to local storage.
     * @param files
     */
    localCaching() {
        const that = this;

        if (!that.dataModel.id) {
            return;
        }
        localStorage.setItem('cache', JSON.stringify(that.dataModel));
    }

    /** Click function, that works on the toasts - just makes it to disappear.
     * @param files
     */
    hideToast() {
        const that = this;

        that.errors.isset = false;
        that.errors.message = '';
    }
}
