import { DataReportsService } from './data-reports.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { EmployeeProjectWorkRange } from '../core/models/employee-project-work-range.model';
import { TeamCoupleWorkdays } from '../core/models/team-couple-workdays';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit, OnChanges {
  @Input() fileDataRaw: string;
  isFileDataDisplayed = false;
  fileData: EmployeeProjectWorkRange[];
  reportData: TeamCoupleWorkdays[];

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

  convertFileRawDataToArray(rawData): EmployeeProjectWorkRange[] {
    return rawData.split('\n').map(line => {
      if (line.trim().length) {
        const lineAsObject: EmployeeProjectWorkRange = <EmployeeProjectWorkRange>{};
        line.split(',').map((str, index) => {
          str = str.trim();
          switch (index) {
            case 0:
              lineAsObject.employee = +str;
              break;
            case 1:
              lineAsObject.project = +str;
              break;
            case 2:
              lineAsObject.dateFrom = moment(str);
              break;
            case 3:
              if (str === 'NULL') {
                str = moment();
              } else {
                str = moment(str);
              }
              lineAsObject.dateTo = str;
              break;
            default:
              break;
          }
        });
        return lineAsObject;
      }
    });
  }

  generateTeamsReport(): void {
    const result = this.dataReportService.getCoupleWithLongestTeamworkPeriod(this.fileData);
    console.log(result);
    if (result) {
      this.reportData = result;
    } else {
      this.isFileDataDisplayed = true;
    }
  }

  toggleClass(item) {
    item.active = !item.active;
  }
}
