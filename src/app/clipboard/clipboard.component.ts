import {Component, OnInit} from '@angular/core';
import {env} from '../env';
import {HttpClient} from "@angular/common/http";
import {delay, Observable, of} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Clipboard, dummyClipboard} from "./Clipboard";
import {MainService} from "../service/main.service";
import {MatDialog} from "@angular/material/dialog";
import {HistoryComponent} from "./history/history.component";

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css']
})

export class ClipboardComponent implements OnInit {
  contentChanged = false;
  textAreaContent = '';

  constructor(private http: HttpClient, private mainService: MainService, private snackBar: MatSnackBar, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.reload()
    this.mainService.reloadEvent.subscribe(() => {
      this.reload()
    })
  }

  reload() {
    this.getLatestClipboardContent().subscribe((data) => {
      this.textAreaContent = data.content;
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


  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      this.snackBar.open('Copied to clipboard', 'Close', {
        duration: 1500,
      });
    });
  }

  openHistory() {
    const dialogRef = this.dialog.open(HistoryComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
