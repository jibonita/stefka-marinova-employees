import * as moment from 'moment';

export interface EmployeeProjectWorkRange {
    employee: number;
    project: number;
    dateFrom: moment.Moment;
    dateTo: moment.Moment;
}
