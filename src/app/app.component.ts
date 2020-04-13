import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Team Checker';
  fileDataRaw: string;

  getFileData(data: string) {
    this.fileDataRaw = data;
  }
}
