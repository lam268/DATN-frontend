import { IPopupAttributes, ISelectOptions } from '@/common/types';
import { MessageBoxData } from 'element-plus';
import {
    showConfirmPopUpFunction,
    showSuccessNotificationFunction,
    showErrorNotificationFunction,
    showAlertMessageFunction,
    parseSelectOptions,
    parseDatePickerRangeValues,
} from '@/utils/helper';
import { Vue } from 'vue-class-component';
import {
    DATE_TIME_FORMAT,
    DEFAULT_MIN_DATE,
    INPUT_TEXT_MAX_LENGTH,
    INPUT_URL_MAX_LENGTH,
    MIN_DATE_PICKER,
    SupportLanguage,
} from '@/common/constants';
import { appModule } from '@/store/app';
import { IAppliedPosition, IUserPosition } from '@/modules/setting/type';
import moment from 'moment';
import { UserGenderSettings } from '@/modules/user/constants';

export class UtilMixins extends Vue {
    // Common variable
    MIN_DATE_PICKER = MIN_DATE_PICKER;
    DATE_TIME_FORMAT = DATE_TIME_FORMAT;
    DEFAULT_MIN_DATE = new Date(DEFAULT_MIN_DATE);

    INPUT_URL_MAX_LENGTH = INPUT_URL_MAX_LENGTH;
    INPUT_TEXT_MAX_LENGTH = INPUT_TEXT_MAX_LENGTH;

    // Common function
    async showConfirmPopup(
        message: string,
        title: string,
        options: IPopupAttributes,
    ): Promise<void | MessageBoxData> {
        return showConfirmPopUpFunction(message, title, options);
    }

    showSuccessNotification(message: string, title?: string): void {
        showSuccessNotificationFunction(message, title);
    }

    showErrorNotification(message?: string, title?: string): void {
        showErrorNotificationFunction(message, title);
    }

    showAlertPopup(message: string, title?: string): void {
        showAlertMessageFunction(message, title);
    }

    translateYupError(
        yupError:
            | {
                  i18nKey: string;
                  params?: Record<string, string>;
              }
            | string,
    ): string {
        if (typeof yupError === 'string') {
            return this.$t(yupError);
        }
        if (!yupError?.i18nKey) return '';
        return this.$t(yupError?.i18nKey, { ...yupError?.params });
    }

    parseMoney(money: number): string {
        return money || money === 0
            ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'VND',
              }).format(money)
            : '';
    }

    parseDateTime(dateTime: Date | string, dateTimeFormat = 'YYYY-MM-DD'): string {
        if (!moment(dateTime).isValid) {
            return '';
        }
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return moment(dateTime).locale(currentLanguage).format(dateTimeFormat);
    }

    getPositionOptions(
        userPositionList: IUserPosition[] | IAppliedPosition[],
    ): ISelectOptions[] {
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return parseSelectOptions(
            userPositionList.map((pos) => ({
                value: pos.code,
                label: pos.value?.[currentLanguage],
            })),
        );
    }

    parseDatePickerRangeValues(dateRange: string[] | Date[]): string[] | null {
        return parseDatePickerRangeValues(dateRange);
    }

    scrollToError(className: string): void {
        setTimeout(() => {
            const collectionElement = Array.from(
                document.getElementsByClassName(className),
            );

            if (collectionElement[0]) {
                collectionElement[0].scrollIntoView({
                    block: 'start',
                    inline: 'start',
                });
            }
        }, 0);
    }

    getGenderOptions(): ISelectOptions[] {
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return parseSelectOptions(
            UserGenderSettings.map((gender) => ({
                value: gender.code,
                label: gender.value?.[currentLanguage],
            })),
        );
    }
}
