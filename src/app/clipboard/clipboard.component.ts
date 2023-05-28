import {Component, OnInit} from '@angular/core';
import {env} from '../env';
import {HttpClient} from "@angular/common/http";
import {catchError, delay, distinctUntilChanged, map, Observable, of, Subject, switchMap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css']
})
export class ClipboardComponent implements OnInit {
  contentChanged = false;
  textAreaContent = '';
  showingHistory = false;
  clipboardHistory: string[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.getLatestClipboardContent().subscribe((content) => {
      this.textAreaContent = content;
    });
  }

  uploadNewContent() {
    this.contentChanged = false;
    if (!env.production) {
      this.snackBar.open('Uploaded', 'Close', {
        duration: 1500,
      });
      return;
    }
    this.http.post(env.apiEndPoint + '/clipboard', this.textAreaContent).subscribe(() => {
      this.snackBar.open('Uploaded', 'Close', {
        duration: 1500,
      });
    });
  }

  loadHistory() {
    this.showingHistory = true;
    this.getClipboardHistory().subscribe((history) => {
      this.clipboardHistory = history;
    });
  }

  cut() {
    this.copyToClipboard(this.textAreaContent);
    this.textAreaContent = '';
  }

  paste() {
    // get device clipboard content, and set it to textAreaContent
    navigator.clipboard.readText().then((content) => {
      this.textAreaContent = content;
      this.uploadNewContent();
    });
  }

  getLatestClipboardContent(): Observable<string> {
    if (!env.production) {
      return of('test test').pipe(delay(500));
    }
    return this.http.get<string>(env.apiEndPoint + '/clipboard');
  }

  getClipboardHistory(): Observable<string[]> {
    if (!env.production) {
      // generate random history
      let history: string[] = [];
      for (let i = 0; i < 10; i++) {
        // generate random sentence
        let sentence = '';
        for (let j = 0; j < 10; j++) {
          sentence += 'test ';
        }
        history.push(sentence + i);
      }
      return of(history).pipe(delay(500));
    }
    return this.http.get<string[]>(env.apiEndPoint + '/clipboard/history');
  }

  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      this.snackBar.open('Copied to clipboard', 'Close', {
        duration: 1500,
      });
    });
  }
}
