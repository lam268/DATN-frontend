import { computed } from '@vue/runtime-core';
import { useField, useForm } from 'vee-validate';
import { IGetTimeKeeping, ITimeKeepingCreate } from '../types';
import yup from '@/plugins/yup/index';
import moment from 'moment';
import { timeKeepingApiService } from '../services/timekeeping.api.service';
import i18n from '@/plugins/vue-i18n';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { IBodyResponse } from '@/common/types';
import { HttpStatus, INPUT_NUMBER_MAX_VALUE, REGEX } from '@/common/constants';
import { timeKeepingModule } from '../store';
import { useI18n } from 'vue-i18n';

const initAbsenceForm = {
    userId: undefined,
    dateTime: '',
    startTime: '',
    endTime: '',
};
export const validateAbsenceSchema = yup.object({
    userId: yup.number().max(INPUT_NUMBER_MAX_VALUE).required().label('employee'),
    dateTime: yup
        .string()
        .matches(REGEX.YYYY_MM_DD_HYPHEN)
        .nullable()
        .required()
        .label('date'),
    startTime: yup.string().nullable().required().label('checkin'),
    endTime: yup
        .string()
        .nullable()
        .required()
        .test('endTime', 'timekeeping.form.errors.checkOut', function checkEnd(endTime) {
            if (endTime) {
                const { startTime } = this.parent;
                return moment(endTime).isAfter(moment(startTime));
            }
            return true;
        })
        .label('checkout'),
});
export function initData(): Record<string, unknown> {
    const { t } = useI18n();
    const isCreate = computed(() => !timeKeepingModule.timeKeepingForm.id);
    const { errors, resetForm, validate, handleSubmit } = useForm<ITimeKeepingCreate>({
        initialValues: initAbsenceForm,
        validationSchema: validateAbsenceSchema,
    });
    const { value: userId } = useField('userId');
    const { value: dateTime } = useField('dateTime');
    const { value: startTime } = useField('startTime');
    const { value: endTime } = useField('endTime');
    const openPopup = async () => {
        const timeKeepingCreate = timeKeepingModule.timeKeepingForm;
        if (!isCreate.value) {
            const loading = ElLoading.service({
                target: '.timekeeping-form-popup',
            });
            const response = (await timeKeepingApiService.getDetail(
                timeKeepingModule.timeKeepingForm.id || NaN,
            )) as IBodyResponse<IGetTimeKeeping>;
            loading.close();
            if (response.success) {
                resetForm({
                    values: {
                        userId: timeKeepingCreate.userId as number,
                        dateTime: moment(response.data.scanAt).fmDayString(),
                        startTime: response.data?.checkIn
                            ? moment(response.data.checkIn).fmFullTimeString()
                            : null,
                        endTime: response.data?.checkOut
                            ? moment(response.data.checkOut).fmFullTimeString()
                            : null,
                    },
                });
            } else {
                showErrorNotificationFunction(response.message as string);
            }
        } else {
            resetForm({
                values: {
                    userId: timeKeepingCreate.userId as number,
                    dateTime: timeKeepingCreate.dateTime
                        ? moment(timeKeepingCreate.dateTime).fmDayString()
                        : '',
                    startTime: initAbsenceForm.startTime,
                    endTime: initAbsenceForm.endTime,
                },
            });
        }
    };

    async function getTimeKeepingList() {
        timeKeepingModule.clearQueryString();
        timeKeepingModule.setIsShowTimeKeepingForm(false);
        timeKeepingModule.setTimeKeepingForm({
            userId: undefined,
            timekeeping: null,
            dateTime: null,
        });
        const loading = ElLoading.service({
            target: '.content',
        });
        await timeKeepingModule.getTimeKeepingList();
        loading.close();
    }

    const submit = handleSubmit(async (timekeeping) => {
        const { userId, startTime, endTime } = timekeeping;
        const isCreate = computed(
            () => !timeKeepingModule.timeKeepingForm?.timekeeping?.checkIn,
        );
        const id = computed(() => timeKeepingModule.timeKeepingForm?.id);
        const fmStartTime = moment(startTime);
        const fmEndTime = moment(endTime);
        const dateTime = moment(timekeeping.dateTime).fmDayString();
        const data = {
            checkIn: moment(`${dateTime} ${fmStartTime.clone().fmTimeString()}`)
                .utc()
                .fmFullTimeString(),
            checkOut: moment(`${dateTime} ${fmEndTime.clone().fmTimeString()}`)
                .utc()
                .fmFullTimeString(),
            scanAt: moment(dateTime).utc().fmFullTimeString(),
        };

        const loading = ElLoading.service({
            target: '.timekeeping-form-popup',
        });
        let response: IBodyResponse<IGetTimeKeeping>;
        if (!isCreate.value) {
            response = (await timeKeepingApiService.update(id.value || NaN, {
                ...data,
            })) as unknown as IBodyResponse<IGetTimeKeeping>;
        } else {
            response = (await timeKeepingApiService.create({
                userId: userId,
                ...data,
            })) as unknown as IBodyResponse<IGetTimeKeeping>;
        }

        if (response?.success) {
            showSuccessNotificationFunction(
                isCreate.value
                    ? (i18n.global.t(
                          'timekeeping.list.timeLine.success.createSuccess',
                      ) as string)
                    : (i18n.global.t(
                          'timekeeping.list.timeLine.success.updateSuccess',
                      ) as string),
            );
            await getTimeKeepingList();
        } else {
            showErrorNotificationFunction(response.message);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                await getTimeKeepingList();
            }
        }
        loading.close();
    });

    const onDelete = async (): Promise<void> => {
        const isConfirm = await showConfirmPopUpFunction(
            t('timekeeping.list.confirmDelete.deleteConfirmText') as string,
            t('timekeeping.list.confirmDelete.deleteConfirmTitle') as string,
            {
                type: 'error',
            },
        );
        if (isConfirm) {
            const loading = ElLoading.service({
                target: '.timekeeping-form-popup',
            });
            const response = (await timeKeepingApiService.delete(
                timeKeepingModule.timeKeepingForm.id || NaN,
            )) as IBodyResponse;

            loading.close();
            timeKeepingModule.setIsShowTimeKeepingForm(false);
            if (response.success) {
                showSuccessNotificationFunction(
                    t('timekeeping.list.timeLine.success.deleteSuccess') as string,
                );
                const loading = ElLoading.service({
                    target: '.content',
                });
                await timeKeepingModule.getTimeKeepingList();
                loading.close();
            } else {
                showErrorNotificationFunction(response.message as string);
            }
        } else {
            timeKeepingModule.setIsShowTimeKeepingForm(false);
        }
    };

    return {
        userId,
        dateTime,
        startTime,
        endTime,
        errors,
        validate,
        openPopup,
        submit,
        onDelete,
    };
}
