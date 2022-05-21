import {
    INPUT_NUMBER_MAX_VALUE,
    INPUT_TEXT_MAX_LENGTH,
    MAX_BANK_ACCOUNT_LENGTH,
    MAX_CITIZEN_ID_LENGTH,
    MAX_SOCIAL_INSURANCE_LENGTH,
    MAX_TAX_CODE_LENGTH,
    MIN_BANK_ACCOUNT_LENGTH,
    MIN_CITIZEN_ID_LENGTH,
    MIN_SOCIAL_INSURANCE_LENGTH,
    MIN_TAX_CODE_LENGTH,
    REGEX,
    TEXTAREA_MAX_LENGTH,
} from './../../common/constants';
import yup from '@/plugins/yup/index';

export enum UserRole {
    USER = 'member',
    ADMIN = 'admin',
    SUPERVISOR = 'supervisor',
}

export enum OrderDirectionText {
    ASC = 'Z - A',
    DESC = 'A - Z',
}

export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum UserStatus {
    WAITING_FOR_APPROVAL = 'waiting_for_approval',
    INACTIVE = 'inactive',
    ACTIVE = 'active',
}

export const ExcelExtensions = ['xls', 'xlsx', 'csv'];

export const RoleOptions = [
    {
        label: 'user.list.filterForm.role.member',
        value: UserRole.USER,
    },
    {
        label: 'user.list.filterForm.role.supervisor',
        value: UserRole.SUPERVISOR,
    },
    {
        label: 'user.list.filterForm.role.admin',
        value: UserRole.ADMIN,
    },
];
export const StatusOptions = [
    {
        label: 'user.list.filterForm.status.waiting_for_approval',
        value: UserStatus.WAITING_FOR_APPROVAL,
    },
    {
        label: 'user.list.filterForm.status.active',
        value: UserStatus.ACTIVE,
    },
    {
        label: 'user.list.filterForm.status.inactive',
        value: UserStatus.INACTIVE,
    },
];

export const SortOptions = [
    {
        label: 'user.list.filterForm.sort.fullName',
        value: 'fullName',
    },
    {
        label: 'user.list.filterForm.sort.status',
        value: 'status',
    },
    {
        label: 'user.list.filterForm.sort.createdAt',
        value: 'createdAt',
    },
];

export const PositionOptions = [
    {
        label: 'user.list.filterForm.position.developer',
        value: 'developer',
    },
    {
        label: 'user.list.filterForm.position.tester',
        value: 'tester',
    },
    {
        label: 'user.list.filterForm.position.admin',
        value: 'admin',
    },
    {
        label: 'user.list.filterForm.position.accounting',
        value: 'accounting',
    },
];

export const USERS_SIZE_PER_PAGE = 12;

export const PASSWORD_MIN_LENGTH = 8;

export const DEFAULT_ORDER_BY = 'createdAt';

export const AllowUpdateStatus = {
    [UserStatus.WAITING_FOR_APPROVAL]: [UserStatus.ACTIVE, UserStatus.INACTIVE],
    [UserStatus.ACTIVE]: [UserStatus.INACTIVE],
    [UserStatus.INACTIVE]: [UserStatus.ACTIVE],
};

// to validate user's form
export const userSchema = yup.object({
    email: yup
        .string()
        .trim()
        .max(INPUT_TEXT_MAX_LENGTH)
        .matches(REGEX.EMAIL, 'user.form.email.invalid')
        .required(),
    fullName: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).nullable().required(),
    phoneNumber: yup
        .string()
        .trim()
        .matches(REGEX.PHONE_NUMBER, 'user.form.phoneNumber.invalid')
        .optional()
        .required(),
    birthday: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable(),
    citizenIdIssuedAt: yup
        .string()
        .matches(REGEX.YYYY_MM_DD_HYPHEN)
        .nullable()
        .optional()
        .required(),
    address: yup.string().nullable().trim().max(TEXTAREA_MAX_LENGTH).optional(),
    hometownAddress: yup.string().nullable().trim().max(TEXTAREA_MAX_LENGTH).optional(),
    idCardIssuePlace: yup
        .string()
        .trim()
        .max(INPUT_TEXT_MAX_LENGTH)
        .nullable()
        .required(),
    gender: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(UserGender))
        .nullable()
        .optional(),
    roleId: yup
        .number()
        .positive()
        .max(INPUT_NUMBER_MAX_VALUE)
        .nullable()
        .required()
        .label('roleName'),
    avatarId: yup.number().positive().max(INPUT_NUMBER_MAX_VALUE).optional().nullable(),
    position: yup.string().max(INPUT_TEXT_MAX_LENGTH).required(),
    note: yup.string().trim().nullable().max(TEXTAREA_MAX_LENGTH).optional(),
    socialInsurance: yup
        .string()
        .trim()
        .max(MAX_SOCIAL_INSURANCE_LENGTH)
        .nullable()
        .transform((o, c) => (o === '' ? null : c))
        .min(MIN_SOCIAL_INSURANCE_LENGTH)
        .optional(),
    taxCode: yup
        .string()
        .trim()
        .max(MAX_TAX_CODE_LENGTH)
        .nullable()
        .transform((o, c) => (o === '' ? null : c))
        .min(MIN_TAX_CODE_LENGTH)
        .optional(),
    bankAccount: yup
        .string()
        .trim()
        .max(MAX_BANK_ACCOUNT_LENGTH)
        .min(MIN_BANK_ACCOUNT_LENGTH)
        .nullable()
        .required(),
    bank: yup.string().max(INPUT_TEXT_MAX_LENGTH).nullable().required(),
    provinceId: yup.number().positive().nullable().required().label('province'),
    citizenId: yup
        .string()
        .trim()
        .max(MAX_CITIZEN_ID_LENGTH)
        .min(MIN_CITIZEN_ID_LENGTH)
        .nullable()
        .required(),
});

export const UserGenderSettings = [
    {
        code: UserGender.MALE,
        value: {
            vi: 'Nam',
            en: 'Male',
        },
    },
    {
        code: UserGender.FEMALE,
        value: {
            vi: 'Nữ',
            en: 'Female',
        },
    },
    {
        code: UserGender.OTHER,
        value: {
            vi: 'Khác',
            en: 'Other',
        },
    },
];
