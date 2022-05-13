import moment from 'moment';
import {
    DATE_TIME_FORMAT,
    DEFAULT_FIRST_PAGE,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '@/common/constants';
import { IQueryString } from '@/common/types';
import { ITimeKeepingFilter } from './types';
import { UserStatus } from '../user/constants';

export const TimeKeepingSortOptions = [
    {
        label: 'timekeeping.list.sort.userId',
        value: 'userId',
    },
    {
        label: 'timekeeping.list.sort.fullName',
        value: 'fullName',
    },
];

export interface ITimekeepingQueryString extends IQueryString {
    userIds?: number[] | null;
    keyword?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    statuses?: UserStatus[];
}

export const initTimeKeepingQueryString: ITimekeepingQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_SIZE_PER_PAGE,
    keyword: null,
    startDate: moment().startOf('isoWeek').format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    endDate: moment().endOf('isoWeek').format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    orderBy: TimeKeepingSortOptions[0].value,
    orderDirection: OrderDirection.ASC,
    statuses: [UserStatus.ACTIVE],
};

export const initTimeKeepingFilterForm = {
    keyword: null,
    selectedWeek: moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
    selectedMonth: moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
} as ITimeKeepingFilter;

export const TimeKeepingExtensions = ['dat'];

export const workingTimes = {
    morning: {
        startTime: '09:00',
        endTime: '12:30',
    },
    afternoon: {
        startTime: '13:30',
        endTime: '18:00',
    },
};

export const MINUTES_PER_HOUR = 60;

export const hourDecimalPrecision = 1;

export enum TIMEKEEPING_TAB {
    WEEK = 'Week',
    MONTH = 'Month',
}

export const dayDiff = 1;

export enum TimekeepingType {
    ALL_DAY = 'all_day',
    PARTIAL_DAY = 'partial_day',
    NOT_AVAILABLE = 'not_available',
    NOT_CHECKOUT = 'not_checkout',
}

export enum RequestAbsenceType {
    NOT_AVAILABLE = 'not_available',
    HOLIDAY = 'holiday',
    WEEKEND = 'weekend',
}

export enum PaidLeaveHourType {
    HAS_ANUAL_PAID_LEAVE_HOURS = 'has_anual_paid_leave_hour',
    INSUFFICIENT_ANUAL_PAID_LEAVE_HOURS = 'insufficient_anual_paid_leave_hour',
}

export const TimekeepingColors = {
    [RequestAbsenceType.WEEKEND]: '#F5F5F5',
    [RequestAbsenceType.HOLIDAY]: '#9B89B3',
    [TimekeepingType.ALL_DAY]: '#FFFFFF', // white
    [TimekeepingType.PARTIAL_DAY]: {
        [RequestAbsenceType.NOT_AVAILABLE]: '#C34A36', // red
        [PaidLeaveHourType.HAS_ANUAL_PAID_LEAVE_HOURS]: '#FFB700',
        [PaidLeaveHourType.INSUFFICIENT_ANUAL_PAID_LEAVE_HOURS]: '#C34A36',
    },
    [TimekeepingType.NOT_AVAILABLE]: {
        [RequestAbsenceType.NOT_AVAILABLE]: '#FFFFFF',
        [PaidLeaveHourType.HAS_ANUAL_PAID_LEAVE_HOURS]: '#FFB700', // orange
        [PaidLeaveHourType.INSUFFICIENT_ANUAL_PAID_LEAVE_HOURS]: '#C34A36',
    },
    [TimekeepingType.NOT_CHECKOUT]: '#C34A36',
};
