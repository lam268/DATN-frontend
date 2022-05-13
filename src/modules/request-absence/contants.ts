import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { IAbsenceFilterForm } from './types';

export const RequestAbsenceSortOptions = [
    {
        label: 'requestAbsence.list.sort.time',
        value: 'id',
    },
    {
        label: 'requestAbsence.list.sort.fullName',
        value: 'fullName',
    },
    {
        label: 'requestAbsence.list.sort.startAt',
        value: 'startAt',
    },
    {
        label: 'requestAbsence.list.sort.endAt',
        value: 'endAt',
    },
];

export const initRequestAbsenceQueryString: IAbsenceFilterForm = {
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_SIZE_PER_PAGE,
    userId: null,
    keyword: null,
    status: null,
    startAt: null,
    endAt: null,
};

export enum RequestAbsenceStatus {
    WAITING = 'waiting',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export const StatusOptions = [
    {
        label: 'requestAbsence.list.filterForm.status.approved',
        value: RequestAbsenceStatus.APPROVED,
    },
    {
        label: 'requestAbsence.list.filterForm.status.rejected',
        value: RequestAbsenceStatus.REJECTED,
    },
    {
        label: 'requestAbsence.list.filterForm.status.waiting',
        value: RequestAbsenceStatus.WAITING,
    },
];

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

export enum Shift {
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
}

export enum RequestAbsenceType {
    CUSTOM_DAY = 'customDay',
    ALL_DAY = 'allDay',
    HALF_DAY = 'halfDay',
}

export const TIME_PICKER_MINUTES_STEP = '15';

export enum RequestAbsenceTab {
    WAITING = 'Waiting',
    HISTORY = 'History',
}

export const ShiftOptions = [
    {
        label: 'requestAbsence.list.title.morning',
        value: Shift.MORNING,
    },
    {
        label: 'requestAbsence.list.title.afternoon',
        value: Shift.AFTERNOON,
    },
];

export const RequestAbsenceDurationCondition = [
    {
        min: 0,
        max: 4,
        requiredMinimumDuration: 1,
    },
    {
        min: 4,
        max: 24,
        requiredMinimumDuration: 24,
    },
    {
        min: 24,
        requiredMinimumDuration: 72,
    },
];
