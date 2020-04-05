import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-load',
  templateUrl: './file-load.component.html',
  styleUrls: ['./file-load.component.css']
})
export class FileLoadComponent implements OnInit {

  @Output() fileLoadEvent = new EventEmitter<string | ArrayBuffer>();

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      let reader = new FileReader();
      const file = event.target.files[0];

      reader.onload = () => {
        const text = reader.result;
        this.fileLoadEvent.emit(text);
      };

      reader.onerror = (error) => {
        console.warn('Error reading file:');
        console.error(error);
      };

      reader.onloadend = () => {
        reader = null;
      };

      reader.readAsText(file);

    }
  }
}
