import { IUser } from '@/modules/user/types';
import { IUserPosition } from '../setting/type';
export interface ILoginResponse {
    accessToken: {
        token: string;
        expiresIn: string;
    };
    refreshToken: {
        token: string;
        expiresIn: string;
    };
    profile: IUser;
}

export interface IGoogleLoginLinkParams {
    redirectUri: string;
    state?: string;
}
export interface IGoogleLoginForm {
    redirectUri?: string;
    code: string | (string | null)[];
}
export interface IGoogleLoginLinkResponse {
    link: string;
    redirectUri: string;
}

export interface ILoginForm {
    email: string;
    password: string;
}

export interface IUserProfile {
    id: number | null;
    address: string | null;
    birthday: string | null;
    email: string;
    status: string | null;
    gender: string | null;
    fullName: string;
    position: IUserPosition | null | string;
    idCardIssuePlace: string | null;
    lastLoginAt: string | null;
    phoneNumber: string | null;
    hometownAddress: string | null;
    avatarUrl: string | null;
    avatarId: number | null;
    taxCode: string | null;
    bankAccount: string | null;
    bank: string | null;
    citizenId: string | null;
    provinceId: number | null;
    citizenIdIssuedAt: string | null;
    socialInsurance: string | null;
    isSuperAdmin: boolean;
}

export interface IOption {
    label: string | null;
    value: number | string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}
