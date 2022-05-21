import { IBodyResponse, IQueryString } from '@common/types';

export interface ITimekeepingDashboard {
    workingHoursNeeded: number | null;
    leaveHours: number | null;
    paidLeaveHoursLeft: number | null;
    paidLeaveHoursUsed: number | null;
    unpaidLeaveHours: number | null;
    authorizedLeaveHoursOfMonth: number | null;
    workingHours: number | null;
    lastYearRemainingPaidLeaveHours: number | null;
}

export interface ITimekeepingDashboardQueryString extends IQueryString {
    startDate: string;
    endDate: string;
}

export interface ITimekeepingDashboardResponse extends IBodyResponse {
    data: ITimekeepingDashboard;
}
