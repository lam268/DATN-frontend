import { IQueryString } from '@/common/types';
import { IAvatar } from '../user/types';
import { RequestAbsenceStatus } from './contants';

export interface IRequestAbsence {
    userId: number;
    status: RequestAbsenceStatus;
    startAt?: string | null;
    endAt?: string | null;
    createdAt?: string;
}

export interface IGetDataRequestAbsence {
    id?: number;
    userId?: number;
    startAt?: string;
    endAt?: string;
    lastMofifyTime?: string;
    reason?: string;
    status?: string;
    userName?: string;
    avatarInfo?: IAvatar;
    createdAt?: string;
}

export enum Status {
    APPROVED = 'approved',
    REJECTED = 'rejected',
}
export interface IAbsenceCreate {
    userId: number | null | string | undefined | unknown;
    startDate: string | undefined | unknown;
    endDate: string | undefined | unknown;
    startTime: string | undefined | unknown;
    endTime: string | undefined | unknown;
    reason?: string | undefined | unknown;
    shift?: string | undefined | unknown;
    type?: string | undefined | unknown;
}

export interface IAbsenceFilterForm extends IQueryString {
    userId?: number | null;
    keyword?: string | null;
    status?: RequestAbsenceStatus[] | null;
    startAt?: string[] | null;
    endAt?: string[] | null;
}

export interface ICreateRequestAbsence {
    userId: number;
    startAt: string;
    endAt: string;
    reason: string;
}
export interface IStatusDropdown {
    id: number;
    status: string;
}

export interface ITimeSelectOption {
    label: string;
    value: string;
    disabled: boolean;
}
