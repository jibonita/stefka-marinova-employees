import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataReportsService {

  constructor() { }

  getLongestTeamPeriod(data: string[][]): string[][] {
    // const date1 = data[0];

    // // const date2 = data[1];
    // // const date2 = data[2];
    // const date2 = data[5];

    // const daysInTeam =
    //   this.findIntersectionDays({ s: moment(date2[2]), e: moment(date2[3]) }, { s: moment(date1[2]), e: moment(date1[3]) });
    //console.log(daysInTeam);

    const projectGroups = this.groupByProjectId(data);
    const allTeams = [];
    for (const project in projectGroups) {
      if (projectGroups.hasOwnProperty(project)) {
        const group = projectGroups[project];
        allTeams.push(...this.getTeamsByTwoPerProject(group));
      }
    }
    // console.log(allTeams);
    return allTeams;
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
      if (!projectMembers.hasOwnProperty(member[1])) {
        projectMembers[member[1]] = [];
      }
      projectMembers[member[1]].push(member);
    });

    return projectMembers;
  }

  getTeamsByTwoPerProject(group) {
    const setProjectTeams = [];
    for (let empOne = 0; empOne < group.length; empOne++) {
      for (let empTwo = empOne + 1; empTwo < group.length; empTwo++) {
        const employee1 = group[empOne];
        const employee2 = group[empTwo];
        const daysInTeam =
          this.findIntersectionDays(
            { s: moment(employee1[2]), e: moment(employee1[3]) },
            { s: moment(employee2[2]), e: moment(employee2[3]) }
          );

        if (daysInTeam > 0) {
          setProjectTeams.push([
            employee1[0],
            employee2[0],
            employee1[1],
            daysInTeam]
          );
        }
      }

    }
    return setProjectTeams;
  }
}
