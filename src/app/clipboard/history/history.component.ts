import {Component, OnInit} from '@angular/core';
import {delay, Observable, of} from "rxjs";
import {Clipboard, dummyClipboard} from "../Clipboard";
import {env} from "../../env";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  clipboardHistory: Clipboard[] = [];
  loading = true;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.getClipboardHistory().subscribe((history) => {
      this.clipboardHistory = history;
      this.loading = false;
    });
  }

  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      this.snackBar.open('Copied to clipboard', 'Close', {
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
}
