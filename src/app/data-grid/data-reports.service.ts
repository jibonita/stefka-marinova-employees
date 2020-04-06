import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataReportsService {
  teamCouples = [];
  maxTeamCoupleWorkDays = { team: '', workDays: 0 };

  constructor() { }

  getCoupleWithLongestTeamworkPeriod(data: string[][]): string[][] {
    const projectGroups = this.groupByProjectId(data);
    // const allTeams = [];
    for (const project in projectGroups) {
      if (projectGroups.hasOwnProperty(project)) {
        const group = projectGroups[project];
        // allTeams.push(...this.getTeamCouplesPerProject(group));
        this.getMaxWorkingDaysTeamCouple(group);
      }
    }

    return this.formatMaxWorkingDaysTeamData();
    // return allTeams;
  }

  findIntersectionDays(period1: { s: any, e: any }, period2: { s: any, e: any }): number {
    if (period2.s > period1.e) {
      return 0;
    } else {
      const oS = moment.max(period1.s, period2.s);
      const oE = moment.min(period1.e, period2.e);

      return oE.diff(oS, 'days') + 1;
    }

  }

  groupByProjectId(data): any[] {
    const projectMembers = [];
    data.forEach(member => {
      if (!projectMembers.hasOwnProperty(member[1])) {
        projectMembers[member[1]] = [];
      }
      projectMembers[member[1]].push(member);
    });

    return projectMembers;
  }

  getMaxWorkingDaysTeamCouple(group): void {
    for (let empOne = 0; empOne < group.length; empOne++) {
      for (let empTwo = empOne + 1; empTwo < group.length; empTwo++) {
        const employee1 = group[empOne];
        const employee2 = group[empTwo];
        const daysInTeam =
          this.findIntersectionDays(
            { s: moment(employee1[2]), e: moment(employee1[3]) },
            { s: moment(employee2[2]), e: moment(employee2[3]) }
          );

        const teamCouple = +employee1[0] < +employee2[0] ?
          [employee1[0], employee2[0]] : [employee2[0], employee1[0]];

        if (daysInTeam > 0) {
          const teamCoupleKey = teamCouple.map(e => `e${e}`).join('');
          if (!this.teamCouples.hasOwnProperty(teamCoupleKey)) {
            this.teamCouples[teamCoupleKey] = {
              allWorkDays: 0,
              projects: []
            };
          }
          this.teamCouples[teamCoupleKey].allWorkDays += daysInTeam;
          this.teamCouples[teamCoupleKey].projects.push([employee1[1], daysInTeam]);

          if (this.maxTeamCoupleWorkDays.workDays < this.teamCouples[teamCoupleKey].allWorkDays) {
            this.maxTeamCoupleWorkDays = {
              team: teamCoupleKey,
              workDays: this.teamCouples[teamCoupleKey].allWorkDays
            };
          }
        }
      }
    }
  }

  getTeamCouplesPerProject(group): any[] {
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

  formatMaxWorkingDaysTeamData() {
    const data = this.teamCouples[this.maxTeamCoupleWorkDays.team];
    const [e1, e2] = this.maxTeamCoupleWorkDays.team.substr(1).split('e');
    return data.projects.reduce((acc, project) => {
      acc.push([e1, e2, ...project]);
      return acc;
    }, []);
  }
}
