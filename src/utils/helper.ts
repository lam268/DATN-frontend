import { ISelectOptions, IPopupAttributes, IImportResponse } from '@/common/types';
import { IUserTimeKeeping } from '@/modules/timekeeping/types';
import i18n from '@/plugins/vue-i18n';
import Papa from 'papaparse';
import { ElMessageBox, ElNotification, MessageBoxData } from 'element-plus';
import moment from 'moment';
import { WeekDay } from '@/common/constants';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import trim from 'lodash/trim';
import intersection from 'lodash/intersection';
import { appService } from './app';

export function parseSelectOptions(options: ISelectOptions[]): ISelectOptions[] {
    return options.map((option: ISelectOptions) => ({
        label: option.label,
        value: option.value,
    }));
}

export function parseLanguageSelectOptions(options: ISelectOptions[]): ISelectOptions[] {
    return options.map((option: ISelectOptions) => ({
        label: i18n.global.t(`${option.label}`),
        value: option.value,
    }));
}

export async function fileToLines(file: File, header: boolean): Promise<unknown> {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: header,
            download: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function (results) {
                resolve(results.data);
            },
        });
    });
}

export async function jsonToExcel(data: IUserTimeKeeping[]): Promise<unknown> {
    const file = data.map((e: any) => {
        if (e.timeLine) {
            const keys = Object.keys(e.timeLine);
            keys.forEach((key: any) => {
                e[`${key}`] = e.timeLine[`${key}`];
            });
        }
        delete e.avatarName;
        delete e.avatarId;
        delete e.timeLine;
        return e;
    });
    return Papa.unparse(file);
}

export async function showConfirmPopUpFunction(
    message: string,
    title: string,
    options?: IPopupAttributes,
): Promise<void | MessageBoxData> {
    const confirmButtonText =
        options?.confirmButtonText ||
        (i18n.global.t('common.app.buttons.confirm') as string);
    const cancelButtonText =
        options?.cancelButtonText ||
        (i18n.global.t('common.app.buttons.cancel') as string);
    const confirmButtonClass = options?.confirmButtonClass || 'el-button--danger';
    const cancelButtonClass = options?.cancelButtonClass || 'el-button--default';
    const distinguishCancelAndClose = options?.distinguishCancelAndClose || true;
    const type = options?.type || 'warning';
    const showCancelButton = options?.showCancelButton || true;
    const result = await ElMessageBox.confirm(
        message,
        title,
        {
            distinguishCancelAndClose,
            type,
            confirmButtonText,
            cancelButtonText,
            confirmButtonClass,
            cancelButtonClass,
            showCancelButton,
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ).catch(() => {});
    return result;
}

export function showSuccessNotificationFunction(message: string, title?: string): void {
    ElNotification({
        type: 'success',
        title: title || (i18n.global.t('common.app.notification') as string),
        message,
    });
}

export function showErrorNotificationFunction(message?: string, title?: string): void {
    ElNotification({
        type: 'error',
        title: title || (i18n.global.t('common.app.notification') as string),
        message,
    });
}

export async function showAlertMessageFunction(
    message: string,
    title?: string,
    options?: IPopupAttributes,
): Promise<MessageBoxData> {
    const confirmButtonText =
        options?.confirmButtonText ||
        (i18n.global.t('common.app.buttons.delete') as string);
    const cancelButtonText =
        options?.cancelButtonText ||
        (i18n.global.t('common.app.buttons.cancel') as string);
    const confirmButtonClass = options?.confirmButtonClass || 'el-button--danger';
    const cancelButtonClass = options?.cancelButtonClass || 'el-button--default';
    const distinguishCancelAndClose = options?.distinguishCancelAndClose || true;
    const type = options?.type || 'error';
    const showCancelButton = options?.showCancelButton || false;
    return await ElMessageBox.alert(
        message,
        title || i18n.global.t('common.app.notification'),
        {
            distinguishCancelAndClose,
            type,
            confirmButtonText,
            cancelButtonText,
            confirmButtonClass,
            cancelButtonClass,
            showCancelButton,
        },
    );
}

export function isWeekend(date: string | Date): boolean {
    const day = moment(date).day();
    return day === WeekDay.SATURDAY || day === WeekDay.SUNDAY;
}

export function trimObject(body: any): void {
    const trimValue = (item: any) => {
        mapKeys(item, (value, key) => {
            // remove string contain only space characters
            if (typeof value === 'string') {
                item[key] = value.trim();
            }

            // iterate array
            else if (Array.isArray(value)) {
                value.forEach((subValue, index) => {
                    // remove string contain only space characters
                    if (typeof subValue === 'string' && !trim(subValue as string)) {
                        value.splice(index, 1);
                    } else if (isPlainObject(subValue)) {
                        trimValue(subValue);
                    }
                });
            } else if (isPlainObject(value)) {
                trimValue(value);
            }
        });
    };

    trimValue(body);
}

export function checkUserHasPermission(
    userPermissions: string[],
    permissions: string[],
): boolean {
    if (appService.getUser().isSuperAdmin) return true;
    return intersection(userPermissions, permissions).length > 0;
}

export function parseDatePickerRangeValues(
    dateRange: string[] | Date[],
): string[] | null {
    if (dateRange?.length === 2) {
        return [
            moment(dateRange[0]).startOfDay().utc().fmFullTimeString(),
            moment(dateRange[1]).endOfDay().utc().fmFullTimeString(),
        ];
    }
    return null;
}

// parse error retrieved from api when import data
export function parseImportErrors(
    importErrors: Record<string, IImportResponse>,
): Record<string, Record<string, string>> {
    let errors = {};
    // parse error for each attribute
    Object.keys(importErrors).forEach((key) => {
        if (!importErrors[key].isValid) {
            let currentError = {};
            importErrors[key].errors.forEach((error) => {
                currentError = {
                    ...currentError,
                    [error.column]: error.errorMessage,
                };
            });
            errors = {
                ...errors,
                [key]: currentError,
            };
        }
    });
    return errors;
}
