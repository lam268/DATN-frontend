import { IContractUpdate } from './types';

// date
export const CONTRACT_MIN_DATE = '2018-09-09';

export enum OrderDirectionText {
    ASC = 'Z - A',
    DESC = 'A - Z',
}

export enum ContractOrderBy {
    CREATED_AT = 'contract.createdAt',
    FULL_NAME = 'user.fullName',
}

export const DAY = 86400000;
export const MONTH = DAY * 30;

export const StatusOptions = [
    {
        label: 'contract.list.filterForm.status.active',
        value: 'active',
    },
    {
        label: 'contract.list.filterForm.status.aboutToActive',
        value: 'aboutToActive',
    },
    {
        label: 'contract.list.filterForm.status.stopped',
        value: 'stopped',
    },
    {
        label: 'contract.list.filterForm.status.expired',
        value: 'expired',
    },
    {
        label: 'contract.list.filterForm.status.aboutToExpire',
        value: 'aboutToExpire',
    },
];

export enum ContractType {
    INTERN = 'intern',
    EMPLOYEE = 'employee',
    LONGTERM = 'longterm',
    ONEYEAR = 'oneyear',
    TWOYEAR = 'twoyear',
    INTERNAL = 'internal',
}

export enum ContractStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    STOPPED = 'stopped',
    ABOUT_TO_EXPIRE = 'aboutToExpire',
    ABOUT_TO_ACTIVE = 'aboutToActive',
}

export enum CONTRACT_TABS {
    VIEW_BY_CONTRACT = 'VIEW_BY_CONTRACT',
    VIEW_BY_USER = 'VIEW_BY_USER',
}

export const DEFAULT_ORDER_BY = 'contract.createdAt';

export const SortOptions = [
    {
        label: 'contract.list.filterForm.sort.createdAt',
        value: 'contract.createdAt',
    },
    {
        label: 'contract.list.filterForm.sort.fullName',
        value: 'user.fullName',
    },
    {
        label: 'contract.list.filterForm.sort.contractType',
        value: 'contractType.id',
    },
    {
        label: 'contract.list.filterForm.sort.startDate',
        value: 'contract.startDate',
    },
    {
        label: 'contract.list.filterForm.sort.endDate',
        value: 'contract.endDate',
    },
    {
        label: 'contract.list.filterForm.sort.status',
        value: 'contract.status',
    },
];

export const CONTRACTS_SIZE_PER_PAGE = 10;

export enum CONTRACT_TABLE_CLASSES {
    EXPIRED = 'expired',
    DEADLINE = 'deadline',
    INPROGRESS = 'inprogress',
}

export const initialSelectedContract: IContractUpdate = {
    id: NaN,
    userId: undefined,
    contractTypeId: undefined,
    startDate: '',
    endDate: '',
    url: '',
};
