import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataReportsService {

  constructor() { }

  getLongestTeamPeriod(data: string[][]): string[][] {
    const date1 = data[0];

    //const date2 = data[1];
    //const date2 = data[2];
    const date2 = data[5];

    const daysInTeam =
      this.findIntersectionDays({ s: moment(date2[2]), e: moment(date2[3]) }, { s: moment(date1[2]), e: moment(date1[3]) });
    console.log(daysInTeam);

    this.groupByProjectId(data);

    return null;
  }

  findIntersectionDays(period1: { s: any, e: any }, period2: { s: any, e: any }): number {
    // console.log(period1);
    // console.log(period2);

    if (period2.s > period1.e) {
      return 0;
    } else {
      const oS = moment.max(period1.s, period2.s);
      const oE = moment.min(period1.e, period2.e);

      // console.log(oS);
      // console.log(oE);
      return oE.diff(oS, 'days') + 1;
    }

  }

  groupByProjectId(data) {
    const projectMembers = [];
    data.forEach(member => {
      //if (!projectMembers[member[1]]) {
      if (!projectMembers.hasOwnProperty(member[1])) {
        projectMembers[member[1]] = [];
      }
      projectMembers[member[1]].push(member);
    });
    console.log(projectMembers);
    return projectMembers;
  }
}
