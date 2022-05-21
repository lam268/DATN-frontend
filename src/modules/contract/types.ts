import { IQueryString } from '@/common/types';
import { ContractStatus } from './constants';

export interface IContractUser {
    id: number;
    fullName: string;
}

export interface IContractTypeInContractTable {
    id: number;
    name: string;
}

export interface IContract {
    id: number;
    userId: number;
    contractTypeId: number;
    startDate: string;
    endDate: string;
    stopDate: string;
    url: string;
    status: ContractStatus;
}

export interface IContractCreate {
    userId: string | undefined;
    contractTypeId: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    url: string | undefined;
}

export interface IContractUpdate extends IContractCreate {
    id: number | undefined;
}

export interface IContractForm {
    isShowContractCreate: boolean | undefined;
    contractId: number | null;
    contract: IContractUpdate | null;
}
export enum ContractGroupBy {
    CONTRACT = 'contract',
    USER = 'user',
}

export interface IContractFilterForm {
    userIds?: string[] | null;
    contractTypeIds?: string[] | null;
    startDate?: string[] | null;
    stopDate?: string[] | null;
    endDate?: string[] | null;
    statuses?: ContractStatus[] | null;
}

export interface IQueryStringContract extends IQueryString, IContractFilterForm {
    groupBy?: ContractGroupBy;
}
