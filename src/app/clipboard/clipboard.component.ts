import {Component, OnInit} from '@angular/core';
import {env} from '../env';
import {HttpClient} from "@angular/common/http";
import {delay, Observable, of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Clipboard, dummyClipboard} from "./Clipboard";

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css']
})

export class ClipboardComponent implements OnInit {
  contentChanged = false;
  textAreaContent = '';
  showingHistory = false;
  clipboardHistory: Clipboard[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.getLatestClipboardContent().subscribe((data) => {
      this.textAreaContent = data.content;
      this.snackBar.open('Connected', 'Close', {
        duration: 1000,
      });
    });
  }

  loadHistory() {
    this.showingHistory = true;
    this.getClipboardHistory().subscribe((history) => {
      this.clipboardHistory = history;
    });
  }

  closeHistory() {
    this.showingHistory = false;
    this.clipboardHistory = [];
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

  changeContent(event: any) {
    this.contentChanged = true
    this.textAreaContent = event.target.value;
  }

  getLatestClipboardContent(): Observable<Clipboard> {
    if (env.dummyDataMode) {
      return of(dummyClipboard()).pipe(delay(500));
    }
    return this.http.get<Clipboard>(env.apiEndPoint + '/clipboard');
  }

  uploadNewContent() {
    this.contentChanged = false;
    if (env.dummyDataMode) {
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

  getClipboardHistory(): Observable<Clipboard[]> {
    if (env.dummyDataMode) {
      // generate random history
      let history: Clipboard[] = [];
      for (let i = 0; i < 10; i++) {
        // generate random sentence
        history.push(dummyClipboard());
      }
      return of(history).pipe(delay(500));
    }
    return this.http.get<Clipboard[]>(env.apiEndPoint + '/clipboard/history');
  }

  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      this.snackBar.open('Copied to clipboard', 'Close', {
        duration: 1500,
      });
    });
  }
}
