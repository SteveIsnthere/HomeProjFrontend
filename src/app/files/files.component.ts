import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {env} from '../env';
import {FileSchema} from "./FileSchema";
import {MatListOption} from "@angular/material/list";
import {MainService} from "../service/main.service";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  files: FileSchema[] = [];
  filesToUpload: File[] = [];
  selectedFileIds: number[] = [];
  selectedOptions: MatListOption[] = [];
  finishedLoading: boolean = false;

  constructor(private http: HttpClient, private mainService: MainService) {
  }

  ngOnInit(): void {
    this.reload();
    this.mainService.reloadEvent.subscribe(() => {
      this.reload()
    })
  }

  reload() {
    this.getFileList();
  }

  triggerReloadEvent(){
    this.mainService.refresh();
  }

  onFileListSelectionChange(event: MatListOption[]) {
    this.selectedFileIds = event.map(option => option.value);
  }

  onFileToUploadSelected(event: any) {
    this.filesToUpload = event.target.files;
    this.uploadAll()
  }

  uploadAll() {
    if (this.filesToUpload.length === 0) {
      return;
    }

    for (const selectedFile of this.filesToUpload) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      this.http.post<any>(env.apiEndPoint + '/files/upload', formData).subscribe(
        (response) => {
          this.getFileList();
          this.filesToUpload = [];
          console.log('File uploaded successfully:', response.filename);
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  download(fileId: number) {
    this.http.get(env.apiEndPoint + '/files/download/' + fileId.toString(), {responseType: 'blob'}).subscribe(
      (response) => {
        this.selectedFileIds = this.selectedFileIds.filter(id => id !== fileId);
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        // find the file name from variable files
        for (const file of this.files) {
          if (file.file_id === fileId) {
            a.download = file.file_name;
            break;
          }
        }
        a.click();
        window.URL.revokeObjectURL(url);
        if (this.selectedFileIds.length === 0) {
          this.selectedOptions = [];
        }
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  delete(fileId: number) {
    this.http.delete(env.apiEndPoint + '/files/delete/' + fileId.toString()).subscribe(
      () => {
        this.selectedFileIds = this.selectedFileIds.filter(id => id !== fileId);
        this.files = this.files.filter(file => file.file_id !== fileId);
      },
      (error) => {
        console.error('Error deleting file:', error);
      }
    );
  }

  deleteAll() {
    for (const fileId of this.selectedFileIds) {
      this.delete(fileId);
    }
  }

  downloadAll() {
    for (const fileId of this.selectedFileIds) {
      this.download(fileId);
    }
  }

  getFileList() {
    if (env.dummyDataMode) {
      this.files = [];
      for (let i = 0; i < 10; i++) {
        this.files.push({
          file_id: i,
          file_name: 'test.txt',
          user_id: 1,
          time_passed: '1 minute ago'
        });
      }
      return;
    }

    this.finishedLoading = false;
    this.http.get<FileSchema[]>(env.apiEndPoint + '/files/files').subscribe(
      (response) => {
        this.files = response;
        this.finishedLoading = true;
      },
      (error) => {
        console.error('Error retrieving file list:', error);
      }
    );
  }

  fileIcon(fileName: string): string {
    const ext = fileName.split('.').pop();
    //convert to lowercase
    if (ext === undefined) {
      return ""
    }
    ext.toLowerCase();

    if (ext === 'txt' || ext === 'docx' || ext === 'xlsx') {
      return 'description';
    } else if (ext === 'pdf') {
      return 'picture_as_pdf';
    } else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'svg' || ext === 'webp' || ext === 'tiff' || ext === 'heif' || ext === 'heic' || ext === 'dng') {
      return 'image';
    } else if (ext === 'mp4' || ext === 'webm' || ext === 'ogg' || ext === 'mp3' || ext === 'wav' || ext === 'flac' || ext === 'aac' || ext === 'm4a' || ext === 'opus') {
      return 'movie';
    } else if (ext === 'zip' || ext === 'rar' || ext === '7z' || ext === 'tar' || ext === 'gz' || ext === 'bz2' || ext === 'xz' || ext === 'zst' || ext === 'lz' || ext === 'lz4' || ext === 'lzo' || ext === 'z') {
      return 'archive';
    } else if (ext === 'exe' || ext === 'msi' || ext === 'deb' || ext === 'rpm' || ext === 'apk' || ext === 'appimage' || ext === 'dmg' || ext === 'pkg' || ext === 'jar' || ext === 'run' || ext === 'bin' || ext === 'sh' || ext === 'bat' || ext === 'vbs' || ext === 'cmd' || ext === 'com' || ext === 'gadget' || ext === 'wsf' || ext === 'app' || ext === 'vb' || ext === 'ps1' || ext === 'psm1' || ext === 'psd1' || ext === 'psc1' || ext === 'ps1xml' || ext === 'clixml' || ext === 'pssc' || ext === 'msh' || ext === 'msh1' || ext === 'msh2' || ext === 'mshxml' || ext === 'msh1xml' || ext === 'msh2xml' || ext === 'scf' || ext === 'lnk' || ext === 'inf' || ext === 'reg' || ext === 'appref-ms' || ext === 'ws' || ext === 'scf' || ext === 'lnk' || ext === 'inf' || ext === 'reg' || ext === 'appref-ms' || ext === 'ws') {
      return 'build';
    } else if (ext === 'html' || ext === 'htm' || ext === 'xhtml' || ext === 'xml' || ext === 'css' || ext === 'js' || ext === 'ts' || ext === 'tsx' || ext === 'jsx' || ext === 'php' || ext === 'py' || ext === 'rb' || ext === 'java' || ext === 'c' || ext === 'cpp' || ext === 'h' || ext === 'hpp' || ext === 'cs' || ext === 'go' || ext === 'rs' || ext === 'swift' || ext === 'kt' || ext === 'dart' || ext === 'pl' || ext === 'sql' || ext === 'json' || ext === 'yaml' || ext === 'yml' || ext === 'toml' || ext === 'ini' || ext === 'cfg' || ext === 'conf' || ext === 'md' || ext === 'markdown' || ext === 'rst' || ext === 'tex' || ext === 'rtf' || ext === 'odt' || ext === 'doc' || ext === 'docx' || ext === 'xls' || ext === 'xlsx' || ext === 'ppt' || ext === 'pptx' || ext === 'odp' || ext === 'ods' || ext === 'odt' || ext === 'csv' || ext === 'tsv' || ext === 'tex' || ext === 'rtf' || ext === 'odt' || ext === 'doc' || ext === 'docx' || ext === 'xls' || ext === 'xlsx' || ext === 'ppt' || ext === 'pptx' || ext === 'odp' || ext === 'ods' || ext === 'odt' || ext === 'csv' || ext === 'tsv') {
      return 'code';
    }

    return "folder"
  }
}
