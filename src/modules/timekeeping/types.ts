import { IQueryString } from '@/common/types';
import { IRequestAbsence } from '../request-absence/types';
import { IContractType } from '../setting/type';
import { UserStatus } from '../user/constants';
export interface ITimekeepingQueryString extends IQueryString {
    keyword?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    userIds?: number[] | null;
    statuses?: UserStatus[];
    excludedUserIds?: number[];
}

export interface ITimekeeping {
    id: number | null;
    checkIn: string | null;
    checkOut: string | null;
    scanAt: string;
    requestAbsences: IRequestAbsence[];
    hasEnoughPaidLeaveHours?: boolean;
    authorizedLeaveHours: number;
    workingHours: number;
}

export interface IUserTimeKeeping {
    id?: number;
    fullName?: string;
    paidLeaveHourThisMonth: number;
    timekeepings: Record<string, ITimekeeping>;
    contractType: IContractType;
    avatarName?: string;
    avatarUrl?: string;
    avatarId?: number;
}

export interface ITimeKeepingFilter {
    keyword?: string | null;
    selectedWeek?: string;
    selectedMonth?: string;
}

export interface ICellColumn {
    row: {
        timekeepings: ITimekeeping;
    };
    column: {
        property: string;
        rawColumnKey: never;
    };
}

export interface IRowTable {
    id: number;
    timekeepings: ITimekeeping[];
}
export interface IColumnTable {
    property: string;
    rawColumnKey: never;
}

export interface ITimeKeepingCreate {
    userId: number | undefined;
    dateTime: string | Date;
    startTime: string | Date | null;
    endTime: string | Date | null;
}

export interface ITimeKeepingForm {
    id?: null | number;
    userId?: null | string | number;
    timekeeping?: ITimekeeping | null;
    dateTime?: string | Date | null;
}

export interface IGetTimeKeeping {
    id: number;
    userId: number;
    fingerId: string;
    checkIn: string;
    checkOut: string;
    scanAt: string;
}
export interface IExportTimekeeping {
    startDate: string;
    endDate: string;
    userIds?: number[];
}
