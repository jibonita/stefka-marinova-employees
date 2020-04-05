import { DataReportsService } from './data-reports.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit, OnChanges {
  @Input() fileDataRaw: string;
  isFileDataDisplayed = false;
  fileData: string[][];
  reportData: string[][];

  constructor(
    private dataReportService: DataReportsService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.fileDataRaw) {
      this.fileData = this.convertFileRawDataToArray(this.fileDataRaw);
      this.generateTeamsReport();
    }
  }

  convertFileRawDataToArray(rawData) {
    return rawData.split('\n').map(line => {
      return line.split(',').map((s, index) => {
        if (index === 3 && s.trim() === 'NULL') {
          const now = moment().format('YYYY-MM-DD');
          return now;
        }
        return s.trim();
      });
    });
  }

  generateTeamsReport() {
    const result = this.dataReportService.getLongestTeamPeriod(this.fileData);
    if (result) {
      this.reportData = result;
    } else {
      this.isFileDataDisplayed = true;
    }
  }
}
