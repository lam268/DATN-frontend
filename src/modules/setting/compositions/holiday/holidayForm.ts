import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { IHoliday, IHolidayCreate } from '../../type';
import { ElLoading } from 'element-plus';
import { settingHolidayApiService } from '../../services/settingService';
import { IBodyResponse } from '@/common/types';
import { settingHolidayModule } from '../../store/holiday.store';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { useI18n } from 'vue-i18n';
import { HolidaySchema } from '../../constant';
import moment from 'moment';

export const initForm = (): Record<string, string | unknown> => {
    const { t } = useI18n();
    const initialValues = {
        title: '',
        description: '',
        date: undefined,
    };
    const { errors, validate, resetForm, handleSubmit } = useForm({
        validationSchema: HolidaySchema,
        initialValues,
    });
    const isCreate = computed(() => !settingHolidayModule.selectedHoliday?.id);

    const { value: title } = useField('title');
    const { value: description } = useField('description');
    const { value: date } = useField('date');

    const onSubmit = handleSubmit(async (holiday) => {
        const data: IHolidayCreate = {
            title: holiday.title?.trim() || '',
            description: holiday.description?.trim() || '',
            date: moment(holiday.date).startOf('day').utc().fmFullTimeString() || '',
        };

        let response;
        const loading = ElLoading.service({
            target: '.holiday-form-popup',
        });

        if (isCreate.value) {
            response = (await settingHolidayApiService.create(data)) as IBodyResponse;
        } else {
            response = (await settingHolidayApiService.update(
                settingHolidayModule.selectedHoliday.id,
                data,
            )) as IBodyResponse;
        }
        loading.close();
        if (response?.success) {
            settingHolidayModule.setIsShowHolidayFormPopup(false);
            showSuccessNotificationFunction(
                isCreate.value
                    ? t('setting.holiday.message.createSuccess')
                    : (t('setting.holiday.message.updateSuccess') as string),
            );
        } else {
            showErrorNotificationFunction(response.message as string);
        }

        return response?.code;
    });

    const openPopup = async () => {
        if (!isCreate.value) {
            const loading = ElLoading.service({
                target: '.holiday-form-popup',
            });
            const response = (await settingHolidayApiService.getDetail(
                settingHolidayModule.selectedHoliday.id,
            )) as IBodyResponse<IHoliday>;
            loading.close();
            if (response?.success) {
                resetForm({
                    values: {
                        title: response.data.title,
                        description: response.data.description,
                        date: moment(response.data.date).fmDayString(),
                    },
                });
            } else {
                showErrorNotificationFunction(response.message as string);
            }
        } else {
            resetForm({
                values: {
                    ...initialValues,
                    date: settingHolidayModule.selectedDate
                        ? moment(settingHolidayModule.selectedDate).fmDayString()
                        : '',
                },
            });
        }
    };

    const onDelete = async (): Promise<number | boolean> => {
        const isConfirm = await showConfirmPopUpFunction(
            t('setting.holiday.confirmDelete.deleteConfirmText') as string,
            t('setting.holiday.confirmDelete.deleteConfirmTitle') as string,
            {
                type: 'error',
            },
        );
        if (isConfirm) {
            const loading = ElLoading.service({
                target: '.holiday-form-popup',
            });
            const response = (await settingHolidayApiService.delete(
                settingHolidayModule.selectedHoliday.id,
            )) as IBodyResponse;

            if (response.success) {
                showSuccessNotificationFunction(
                    t('setting.holiday.message.deleteSuccess') as string,
                );
            } else {
                showErrorNotificationFunction(response.message as string);
            }

            loading.close();

            return response.code;
        }
        return false;
    };

    return {
        errors,
        validate,
        resetForm,
        title,
        description,
        date,
        onSubmit,
        openPopup,
        onDelete,
    };
};
