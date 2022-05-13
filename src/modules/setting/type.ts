import { SupportLanguage } from '@/common/constants';
import { SettingKey } from './constant';
import { IQueryString } from '@/common/types';

export interface IGeneralSettingForm {
    code: string;
    error: Record<SupportLanguage | string, string>;
    value: Record<SupportLanguage, string>;
    isNew?: boolean;
}

export interface IResetPaidLeaveDaysScheduleForm {
    year: string;
    resetDate: string;
    yearError: string;
    dateError: string;
}

export interface IResetPaidLeaveDaysSchedule {
    year: string;
    resetDate: string;
}
export interface IGeneralSetting<T> {
    key: SettingKey;
    values: T[];
}

export type IUserPosition = {
    code: string;
    value: Record<SupportLanguage, string>;
    inUse?: boolean;
};

export type IAppliedPosition = {
    code: string;
    value: Record<SupportLanguage, string>;
    inUse?: boolean;
};

export interface IGetGeneralSettingQuery {
    key: string;
}
export interface IContractType {
    id: number;
    name: string;
    description: string;
    paidLeaveDays: number;
    expiredIn: number;
}

export interface IGetListContractTypeQuery extends IQueryString {
    keyword?: string | null;
}

export interface IContractTypeCreate {
    name: string | undefined;
    description: string | undefined;
    expiredIn: number | undefined;
    paidLeaveDays: number | undefined;
}

export interface IContractTypeUpdate extends IContractTypeCreate {
    id: number | undefined;
}
export interface IHolidayCreate {
    title: string;
    description: string;
    date: string;
}
export interface IHoliday {
    id: number;
    title: string;
    description: string;
    date: string;
}

export interface IHolidayQueryString {
    startDate?: string;
    endDate?: string;
}
