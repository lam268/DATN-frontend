import { IQueryString } from '@/common/types';
import { UserGender, UserRole, UserStatus } from './constants';
import { IRole } from '../role/types';

export interface IProvince {
    id: number;
    name: string;
}
export interface IUserFinger {
    userId: number;
    fingerId: number;
}

export interface IUserUpload {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
}

export interface IAvatar {
    fileName: string | null;
    avatarId: number | null;
    url: string | null;
}

export interface IUser {
    id: number;
    status: UserStatus;
    position: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    socialInsurance?: string | null;
    birthday?: string | Date | null;
    citizenIdIssuedAt?: string | Date | null;
    gender?: UserGender | null;
    idCardIssuePlace?: string | null;
    roleId: number | null;
    provinceId?: number | null;
    address?: string | null;
    hometownAddress?: string | null;
    avatarId?: number | null;
    note?: string | null;
    bankAccount?: string | null;
    citizenId?: string | null;
    taxCode?: string | null;
    bank?: string | null;
    lastLoginAt: Date | string | null;
    role: IRole;
    province?: IProvince | null;
    avatar?: IAvatar | null;
    isSuperAdmin: boolean;
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    createdBy: number | null;
    updatedBy: number | null;
}

export interface IUserFilterForm {
    keyword?: string | null;
    statuses?: UserStatus[] | null;
    genders?: UserGender[] | null;
    roles?: UserRole[] | null;
    provinces?: number[] | null;
    positions?: string[] | null;
}

export interface IQueryStringUser extends IQueryString, IUserFilterForm {}

export interface IUserUpdate {
    email?: string;
    fullName: string;
    phoneNumber: string | null;
    birthday?: string | Date | null;
    gender?: UserGender | null;
    idCardIssuePlace?: string | null;
    roleId: number | null;
    position: string;
    address?: string | null;
    hometownAddress?: string | null;
    avatarId?: number | null;
}

export interface IImportUser {
    email: string;
    fullName: string;
    phoneNumber: string;
    birthday?: string;
    gender: UserGender;
    position: string;
    role: string;
    bankAccount: string;
    bank: string;
    citizenId: string;
    citizenIdIssuedAt: string;
    idCardIssuePlace: string;
    address?: string;
    hometownAddress?: string;
    taxCode?: string;
    note?: string;
    province: string;
    socialInsurance?: string;
    index?: number;
}

export interface IImportUsers {
    importUsers: IImportUser[];
}
