import yup from '@/plugins/yup';
import { INPUT_TEXT_MAX_LENGTH } from '@/common/constants';

export enum PermissionResources {
    USER = 'user',
    CONTRACT = 'contract',
    TIMEKEEPING = 'timekeeping',
    REQUEST_ABSENCE = 'request_absence',
    ROLE = 'role',
    PERMISSION = 'permission',
    SETTING = 'setting',
}

export enum PermissionActions {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    CREATE_PERSONAL = 'create_personal',
    READ_PERSONAL = 'read_personal',
    UPDATE_PERSONAL = 'update_personal',
    DELETE_PERSONAL = 'delete_personal',
    HR_ROLE = 'hr_role',
    UPDATE_STATUS = 'update_status',
    UPDATE_ROLE = 'update_role',
}

export const personalPermissionSuffix = '_personal';

export const permissionSchema = yup.object({
    description: yup.string().trim().nullable().max(INPUT_TEXT_MAX_LENGTH),
    name: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).label('roleName').required(),
    permissionIds: yup.array().min(1, 'role.list.common.error.noPermission').required(),
});

export const permissions = [
    {
        model: 'user',
        actions: ['read', 'create', 'update', 'delete', 'change_status'],
    },
    {
        model: 'role',
        actions: ['read', 'update'],
    },
];

export const SortOptions = [
    {
        label: 'role.list.sort.name',
        value: 'name',
    },
    {
        label: 'role.list.sort.createdAt',
        value: 'createdAt',
    },
];

export const PERMISSION_LOGIN = 'login';

export const LOADING_BACKGROUND_COLOR = 'rgba(255, 255, 255, 0.9)';
