import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  @Output() reloadEvent = new EventEmitter<string>()

  constructor() {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === "visible") {
        this.reloadEvent.emit("app-reopened")
      }
    })
  }

  refresh() {
    this.reloadEvent.emit("refreshed")
  }
}
