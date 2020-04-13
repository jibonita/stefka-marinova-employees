import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { EmployeeProjectWorkRange } from '../core/models/employee-project-work-range.model';
import { TeamProjectsWorkdays } from '../core/models/team-projects-workdays';
import { TeamCoupleWorkdays } from '../core/models/team-couple-workdays';


@Injectable({
  providedIn: 'root'
})
export class DataReportsService {
  teamCouples = new Map<string, TeamProjectsWorkdays>();

  constructor() { }

  getCoupleWithLongestTeamworkPeriod(data: EmployeeProjectWorkRange[]): TeamCoupleWorkdays[] {
    const projectGroups = this.groupByProjectId(data);

    projectGroups.forEach((group: EmployeeProjectWorkRange, key: string) => {
      this.setMaxWorkingDaysTeamCouple(group);
    });

    return this.getMaxWorkingDaysTeamData();
  }

  findIntersectionDays(period1: { s: moment.Moment, e: moment.Moment }, period2: { s: moment.Moment, e: moment.Moment }): number {
    if (period2.s > period1.e) {
      return 0;
    } else {
      const oS = moment.max(period1.s, period2.s);
      const oE = moment.min(period1.e, period2.e);

      return oE.diff(oS, 'days') + 1;
    }
  }

  groupByProjectId(data): any {
    const projectMembers = new Map();
    data.forEach(member => {
      if (!projectMembers.has(member.project)) {
        projectMembers.set(member.project, []);
      }
      projectMembers.get(member.project).push(member);
    });

    return projectMembers;
  }

  setMaxWorkingDaysTeamCouple(group): void {
    for (let empOne = 0; empOne < group.length; empOne++) {
      for (let empTwo = empOne + 1; empTwo < group.length; empTwo++) {
        const employee1: EmployeeProjectWorkRange = group[empOne];
        const employee2: EmployeeProjectWorkRange = group[empTwo];
        const daysInTeam: number =
          this.findIntersectionDays(
            { s: employee1.dateFrom, e: employee1.dateTo },
            { s: employee2.dateFrom, e: employee2.dateTo }
          );

        if (daysInTeam > 0) {
          const teamCouple = employee1.employee < employee2.employee ?
            [employee1.employee, employee2.employee] : [employee2.employee, employee1.employee];

          const teamCoupleKey = teamCouple.map(e => `e${e}`).join('');

          if (!this.teamCouples.has(teamCoupleKey)) {
            this.teamCouples.set(teamCoupleKey, {
              allWorkDays: 0,
              projects: []
            });
          }
          this.teamCouples.get(teamCoupleKey).allWorkDays += daysInTeam;
          this.teamCouples.get(teamCoupleKey).projects.push([employee1.project, daysInTeam]);

        }
      }
    }
  }

  getTeamCouplesPerProject(group): any[] {
    const projectTeams = [];
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
          projectTeams.push([
            employee1[0],
            employee2[0],
            employee1[1],
            daysInTeam]
          );
        }
      }
    }

    return projectTeams;
  }

  getMaxWorkingDaysTeamData(): TeamCoupleWorkdays[] {
    const maxTeams: TeamCoupleWorkdays[] = [];
    if (!this.teamCouples.size) {
      return [];
    }

    const teamCouplesSortedArr = [...this.teamCouples].sort((a, b) => {
      return b[1].allWorkDays - a[1].allWorkDays;
    });

    const maxWorkingDays = teamCouplesSortedArr[0][1].allWorkDays;
    let index = 0;

    while (index < teamCouplesSortedArr.length && teamCouplesSortedArr[index][1].allWorkDays === maxWorkingDays) {
      const [e1, e2] = teamCouplesSortedArr[index][0].substr(1).split('e')

      maxTeams.push({
        employee1: e1,
        employee2: e2,
        strProjects: teamCouplesSortedArr[index][1].projects.map(e => e[0]).join(', '),
        ...teamCouplesSortedArr[index][1],
        active: false
      });

      index++;
    }

    this.teamCouples.clear();
    return maxTeams;
  }

}
