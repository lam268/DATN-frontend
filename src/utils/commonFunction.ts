import { IPermissions } from '@/modules/role/types';
import i18n from '@/plugins/vue-i18n';
import intersection from 'lodash/intersection';
import { appService } from './app';
import { showErrorNotificationFunction } from './helper';

export const randomVid = (): string => {
    return `${Math.floor(Math.random() * 100)}-${Date.now()}`;
};

export const capitalizeFirstLetter = (letter: string): string => {
    if (letter) {
        return letter.charAt(0).toUpperCase() + letter.slice(1);
    }
    return letter;
};

export function removeAccents(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

export function vietnameseStringInclude(str: string, keyword: string): boolean {
    return removeAccents(str.toLowerCase()).includes(
        removeAccents(keyword.toLowerCase()),
    );
}

export const networkErrNotitfication = (): void => {
    showErrorNotificationFunction(i18n.global.t('common.common.errors.network'));
};

export const downloadFile = (fileName: string, url: string): void => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
};

export function checkPermission(requiredPermissions: string[]): boolean {
    if (!requiredPermissions || !requiredPermissions.length) {
        return true;
    }
    const user = appService.getUser();
    if (user.isSuperAdmin) {
        return true;
    }
    const userPermissions: string[] = [];
    // return array of string resource_action
    // ex: ['user_login', 'user_create',...]
    (user?.role?.permissions || []).forEach((permission: IPermissions) => {
        userPermissions.push(
            `${permission.resource.content}_${permission.action.content}`,
        );
    });
    // check if the loginUser has any one permission in the needed permissions
    if (!intersection(userPermissions, requiredPermissions).length) {
        return false;
    }
    return true;
}

export function hasPermissionToAccessRoute(requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const user = appService.getUser();
    const resourceActionList: string[] = [];
    user.role.permissions
        .filter((item) => item)
        .forEach((item) => {
            resourceActionList.push(`${item.resource.content}_${item.action.content}`);
        });

    return intersection(resourceActionList, requiredPermissions).length > 0;
}
