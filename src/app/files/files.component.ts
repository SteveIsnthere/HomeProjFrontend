import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
  files: string[] = [];
  selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('http://localhost:8000/upload/', formData).subscribe(
      (response) => {
        console.log('File uploaded successfully:', response.filename);
        this.selectedFile = null;
        this.getFileList();
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  onDownload(filename: string) {
    this.http.get(`http://localhost:8000/download/${filename}`, { responseType: 'blob' }).subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  getFileList() {
    this.http.get<any>('http://localhost:8000/files/').subscribe(
      (response) => {
        this.files = response.files;
      },
      (error) => {
        console.error('Error retrieving file list:', error);
      }
    );
  }
}
