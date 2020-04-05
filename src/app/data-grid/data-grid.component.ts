import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit, OnChanges {
  @Input() fileDataRaw: string;
  fileData: string[][];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fileDataRaw) {
      this.fileData =
        this.fileDataRaw.split('\n').map(line => {
          return line.split(',').map(s => s.trim());
        });
    }
  }
}
