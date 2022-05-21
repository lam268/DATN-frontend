import { useField, useForm } from 'vee-validate';
import yup from '@/plugins/yup/index';
import { useI18n } from 'vue-i18n';
import { computed, WritableComputedRef } from 'vue';
import {
    DEFAULT_FIRST_PAGE,
    INPUT_NUMBER_MAX_VALUE,
    INPUT_URL_MAX_LENGTH,
    REGEX,
} from '@common/constants';
import { IContractCreate } from '../types';
import moment from 'moment';
import { contractApiService } from '../services/api.service';
import { contractModule } from '../store';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { initialSelectedContract } from '../constants';

export function setupPopupContract(): {
    isShowContractForm: WritableComputedRef<boolean>;
    showContractFormPopup: () => void;
} {
    const isShowContractForm = computed({
        get: () => contractModule.isShowContractFormPopUp || false,
        set: (value: boolean) => {
            contractModule.setIsShowContractFormPopUp(value);
        },
    });
    const showContractFormPopup = () => {
        isShowContractForm.value = true;
    };
    return { isShowContractForm, showContractFormPopup };
}

export const validateContractSchema = yup.object({
    userId: yup
        .number()
        .positive()
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('employee'),
    contractTypeId: yup
        .number()
        .positive()
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('contractType'),
    startDate: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
    url: yup.string().max(INPUT_URL_MAX_LENGTH).required().url(),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initData() {
    const { t } = useI18n();
    const initValues = {
        userId: undefined,
        contractTypeId: undefined,
        startDate: null,
        url: '',
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateContractSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const contractInfo = {
            ...values,
            url: values.url?.trim(),
            startDate: moment(values.startDate).utc().fmFullTimeString(),
        } as IContractCreate;
        let result;
        const contractId = contractModule.selectedContract?.id;
        const loading = ElLoading.service({
            target: '.contract-form-popup',
        });
        if (contractModule.selectedContract?.id) {
            delete contractInfo.userId;
            result = await contractApiService.update(contractId as number, contractInfo);
        } else {
            result = await contractApiService.create(contractInfo);
        }
        if (result?.success) {
            showSuccessNotificationFunction(
                contractModule.selectedContract?.id
                    ? t('contract.form.message.updateSuccess')
                    : (t('contract.form.message.createSuccess') as string),
            );
            contractModule.setQueryString({
                page: DEFAULT_FIRST_PAGE,
            });
            await contractModule.getContractList();
        } else {
            showErrorNotificationFunction(result?.message as string);
        }
        contractModule.setIsShowContractFormPopUp(false);
        contractModule.setSelectedContract(initialSelectedContract);
        loading.close();
    });
    const { value: userId } = useField('userId');
    const { value: contractTypeId } = useField('contractTypeId');
    const { value: startDate } = useField('startDate');
    const { value: endDate } = useField('endDate');
    const { value: url } = useField('url');
    const openPopup = async () => {
        if (contractModule.selectedContract?.id) {
            const loading = ElLoading.service({ target: '.contract-form-popup' });
            const contractDetail = await contractApiService.getDetail(
                contractModule.selectedContract.id,
            );
            loading.close();
            resetForm({
                values: {
                    userId: contractDetail?.data?.user?.id,
                    url: contractDetail?.data?.url,
                    contractTypeId: contractDetail?.data?.contractType?.id,
                    startDate: moment(contractDetail?.data?.startDate).fmDayString(),
                },
            });
        } else {
            resetForm({
                values: initValues,
            });
        }
    };
    return {
        errors,
        userId,
        contractTypeId,
        startDate,
        endDate,
        url,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}
