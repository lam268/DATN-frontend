import { computed, ref, Ref } from 'vue';
import yup from '@/plugins/yup/index';
import i18n from '@/plugins/vue-i18n';
import { IAbsenceCreate, ICreateRequestAbsence, IGetDataRequestAbsence } from '../types';
import { useField, useForm } from 'vee-validate';
import moment from 'moment';
import trim from 'lodash/trim';
import { requestAbsenceApiService } from '../services/request-absence.api.service';
import { appService } from '@/utils/app';
import { workingTimes, RequestAbsenceType, Shift } from '../contants';
import { UserStatus } from '@/modules/user/constants';
import { commonService } from '@/common/services/api.services';
import {
    checkUserHasPermission,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { authModule } from '@/modules/auth/store';
import {
    HttpStatus,
    INPUT_NUMBER_MAX_VALUE,
    INPUT_TEXT_MAX_LENGTH,
    TEXTAREA_MAX_LENGTH,
    DATE_TIME_FORMAT,
    REGEX,
} from '@/common/constants';
import { requestAbsenceModule } from '../store';
import { IBodyResponse } from '@/common/types';

const initAbsenceForm = {
    userId: undefined,
    startDate: undefined,
    endDate: undefined,
    startTime: '',
    endTime: '',
    reason: '',
    shift: '',
    type: RequestAbsenceType.HALF_DAY,
};

export const validateAbsenceSchema = yup.object({
    userId: yup
        .number()
        .positive()
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('employee'),
    startDate: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
    endDate: yup
        .string()
        .matches(REGEX.YYYY_MM_DD_HYPHEN)
        .nullable()
        .when('type', {
            is: RequestAbsenceType.CUSTOM_DAY,
            then: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
            otherwise: yup
                .string()
                .matches(REGEX.YYYY_MM_DD_HYPHEN)
                .nullable()
                .when('type', {
                    is: RequestAbsenceType.ALL_DAY,
                    then: yup
                        .string()
                        .matches(REGEX.YYYY_MM_DD_HYPHEN)
                        .nullable()
                        .required(),
                }),
        }),
    startTime: yup.string().nullable().when('type', {
        is: RequestAbsenceType.CUSTOM_DAY,
        then: yup.string().nullable().required(),
    }),
    endTime: yup.string().nullable().when('type', {
        is: RequestAbsenceType.CUSTOM_DAY,
        then: yup.string().nullable().required(),
    }),
    reason: yup.string().trim().required().max(TEXTAREA_MAX_LENGTH),
    shift: yup.string().when('type', {
        is: RequestAbsenceType.HALF_DAY,
        then: yup.string().max(INPUT_TEXT_MAX_LENGTH).required(),
        otherwise: yup.string().nullable(),
    }),
    addDay: yup.boolean(),
    type: yup.string().oneOf(Object.values(RequestAbsenceType)),
});

export function initData(): Record<string, unknown> {
    const isCreate = computed(() => !requestAbsenceModule.selectedRequestAbsence.id);
    const { errors, resetForm, validate, setErrors, handleSubmit } =
        useForm<IAbsenceCreate>({
            initialValues: initAbsenceForm,
            validationSchema: validateAbsenceSchema,
        });

    const isCanCreate = computed(() =>
        checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.CREATE}`,
        ]),
    );
    const authedUserId = computed(() => authModule.userProfile.id);

    const { value: userId } = useField('userId');
    const { value: startDate } = useField('startDate');
    const { value: endDate } = useField('endDate');
    const { value: startTime } = useField('startTime');
    const { value: endTime } = useField('endTime');
    const { value: reason } = useField('reason');
    const { value: shift } = useField('shift');
    const { value: type } = useField('type');

    const openPopup = async () => {
        if (!isCreate.value) {
            const loading = ElLoading.service({ target: '.request-absence-form-popup' });
            const response = (await requestAbsenceApiService.getDetail(
                requestAbsenceModule.selectedRequestAbsence.id || NaN,
            )) as IBodyResponse<IGetDataRequestAbsence>;
            loading.close();
            if (response.success) {
                const requestAbsence = response.data;
                const startDateFormat = moment(requestAbsence?.startAt as string);
                const endDateFormat = moment(requestAbsence?.endAt as string);
                const fmDateStart = moment(
                    requestAbsence.startAt as string,
                ).fmHourMinuteString();
                const fmDateEnd = moment(
                    requestAbsence.endAt as string,
                ).fmHourMinuteString();

                let shift: Shift | string = '';
                let type: RequestAbsenceType;
                if (
                    fmDateStart === workingTimes.morning.startTime &&
                    fmDateEnd === workingTimes.morning.endTime
                ) {
                    shift = Shift.MORNING;
                    type = RequestAbsenceType.HALF_DAY;
                } else if (
                    fmDateStart === workingTimes.afternoon.startTime &&
                    fmDateEnd === workingTimes.afternoon.endTime
                ) {
                    shift = Shift.AFTERNOON;
                    type = RequestAbsenceType.HALF_DAY;
                }
                if (
                    fmDateStart === workingTimes.morning.startTime &&
                    fmDateEnd === workingTimes.afternoon.endTime
                ) {
                    type = RequestAbsenceType.ALL_DAY;
                } else {
                    type = RequestAbsenceType.CUSTOM_DAY;
                }

                resetForm({
                    values: {
                        userId: requestAbsence.userId,
                        reason: requestAbsence.reason,
                        startDate: startDateFormat.fmDayString(),
                        endDate: endDateFormat.fmDayString(),
                        startTime: fmDateStart,
                        endTime: fmDateEnd,
                        shift,
                        type,
                    },
                });
            } else {
                showErrorNotificationFunction(response.message as string);
            }
        } else {
            if (isCanCreate.value) {
                resetForm({ values: initAbsenceForm });
            } else {
                resetForm({
                    values: {
                        ...initAbsenceForm,
                        userId: authedUserId.value,
                    },
                });
            }
        }
    };
    const absenceUserOptions: Ref<Record<string, string | number>[]> = ref([]);
    const getUsers = async () => {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await commonService.getDropdownUsers({
            status: [UserStatus.ACTIVE, UserStatus.INACTIVE],
        });
        loading.close();
        if (response.success) {
            if (!isCanCreate.value) {
                const { id } = appService.getUser();
                const userOption = response.data?.items?.find((user) => user.id === id);
                absenceUserOptions.value = [
                    {
                        label: userOption?.fullName as string,
                        value: userOption?.id as number,
                    },
                ];
            } else {
                absenceUserOptions.value = response.data?.items?.map((user) => {
                    return {
                        label: user.fullName,
                        value: user.id,
                    };
                });
            }
        } else {
            absenceUserOptions.value = [];
        }
    };

    getUsers();

    const generateAbsenceTime = (absence: IAbsenceCreate): ICreateRequestAbsence => {
        let startAt: string;
        let endAt: string;
        const startDate = moment(absence.startDate as string).fmDayString();
        const endDate = moment(absence.endDate as string).fmDayString();
        if (absence.type === RequestAbsenceType.HALF_DAY) {
            if (absence?.shift === Shift.MORNING) {
                startAt = moment(
                    `${startDate} ${workingTimes.morning.startTime}`,
                ).fmFullTimeString();
                endAt = moment(
                    `${startDate} ${workingTimes.morning.endTime}`,
                ).fmFullTimeString();
            } else {
                startAt = moment(
                    `${startDate} ${workingTimes.afternoon.startTime}`,
                ).fmFullTimeString();
                endAt = moment(
                    `${startDate} ${workingTimes.afternoon.endTime}`,
                ).fmFullTimeString();
            }
        } else if (absence.type === RequestAbsenceType.ALL_DAY) {
            startAt = moment(
                `${startDate} ${workingTimes.morning.startTime}`,
            ).fmFullTimeString();
            endAt = moment(
                `${endDate} ${workingTimes.afternoon.endTime}`,
            ).fmFullTimeString();
        } else {
            startAt = moment(`${startDate} ${absence.startTime}`).fmFullTimeString();
            endAt = moment(`${endDate} ${absence.endTime}`).fmFullTimeString();
        }

        return {
            startAt,
            endAt,
            userId: absence.userId as number,
            reason: trim(absence.reason as string),
        };
    };

    const submit = handleSubmit(async (absence) => {
        const requestAbsenceData = generateAbsenceTime(absence);
        const { startAt, endAt } = requestAbsenceData;

        const fmTimeStart = moment(startAt).fmHourMinuteString();
        const fmTimeEnd = moment(endAt).fmHourMinuteString();
        const checkTime =
            fmTimeStart === workingTimes.afternoon.endTime ||
            fmTimeEnd === workingTimes.morning.startTime;

        const fmTimeMomentStart = moment(fmTimeStart, DATE_TIME_FORMAT.HH_MM_SS_COLON);
        const fmTimeMomentEnd = moment(fmTimeEnd, DATE_TIME_FORMAT.HH_MM_SS_COLON);
        const checkStartTime = fmTimeMomentStart.isBetween(
            moment(workingTimes.morning.endTime, DATE_TIME_FORMAT.HH_MM_SS_COLON),
            moment(workingTimes.afternoon.startTime, DATE_TIME_FORMAT.HH_MM_SS_COLON),
        );
        const checkEndTime = fmTimeMomentEnd.isBetween(
            moment(workingTimes.morning.endTime, DATE_TIME_FORMAT.HH_MM_SS_COLON),
            moment(workingTimes.afternoon.startTime, DATE_TIME_FORMAT.HH_MM_SS_COLON),
        );

        if (!moment(startAt).isBefore(moment(endAt))) {
            setErrors({
                startTime: i18n.global.t(
                    'requestAbsence.form.errors.startTime',
                ) as string,
            });
            return;
        }
        if (checkTime || checkStartTime || checkEndTime) {
            showErrorNotificationFunction(
                i18n.global.t('requestAbsence.form.errors.outSideTime') as string,
            );
            return;
        }

        let response = {} as IBodyResponse;
        const requestAbsenceDataSubmit = {
            ...requestAbsenceData,
            startAt: moment(startAt).utc().fmFullTimeString(),
            endAt: moment(endAt).utc().fmFullTimeString(),
        };
        const loading = ElLoading.service({ target: '.request-absence-form-popup' });
        if (isCreate.value) {
            response = await requestAbsenceApiService.create(requestAbsenceDataSubmit);
        } else {
            response = await requestAbsenceApiService.update(
                requestAbsenceModule.selectedRequestAbsence.id || NaN,
                requestAbsenceDataSubmit,
            );
        }
        if (!response?.success) {
            showErrorNotificationFunction(i18n.global.t(response?.message) as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                requestAbsenceModule.setIsShowRequestAbsenceFormPopup(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await requestAbsenceModule.getRequestAbscenceList();
                loading.close();
            }
        } else {
            showSuccessNotificationFunction(
                (isCreate.value
                    ? i18n.global.t('requestAbsence.form.message.createSuccess')
                    : i18n.global.t(
                          'requestAbsence.form.message.updateSuccess',
                      )) as string,
            );
            requestAbsenceModule.clearFilter();
            requestAbsenceModule.setIsShowRequestAbsenceFormPopup(false);
            const loading = ElLoading.service({
                target: '.content',
            });
            const getRequestAbsenceListResponse =
                await requestAbsenceModule.getRequestAbscenceList();
            loading.close();
            if (!getRequestAbsenceListResponse?.success) {
                showErrorNotificationFunction(
                    i18n.global.t(getRequestAbsenceListResponse?.message) as string,
                );
            }
        }

        loading.close();
    });
    return {
        userId,
        startDate,
        endDate,
        startTime,
        endTime,
        reason,
        isCreate,
        absenceUserOptions,
        errors,
        shift,
        type,
        validate,
        openPopup,
        submit,
        resetForm,
    };
}
