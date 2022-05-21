import { useField, useForm } from 'vee-validate';
import yup from '@/plugins/yup/index';
import { useI18n } from 'vue-i18n';
import { DEFAULT_FIRST_PAGE, REGEX } from '@common/constants';
import moment from 'moment';
import { contractApiService } from '../services/api.service';
import { contractModule } from '../store';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { ContractStatus, initialSelectedContract } from '../constants';

export const validateStopContractSchema = yup.object({
    stopDate: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initData() {
    const { t } = useI18n();
    const initValues = {
        stopDate: null,
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateStopContractSchema,
    });

    const onStop = handleSubmit(async (values) => {
        const contractInfo = {
            stopDate: moment(values.stopDate).utc().fmFullTimeString(),
            status: ContractStatus.STOPPED,
        };
        const contractId = contractModule.selectedContract?.id;
        const loading = ElLoading.service({
            target: '.stop-contract-form-popup',
        });
        const result = await contractApiService.updateStatus(
            contractId as number,
            contractInfo,
        );
        loading.close();
        contractModule.setIsShowStopContractFormPopUp(false);
        contractModule.setSelectedContract(initialSelectedContract);
        if (result?.success) {
            showSuccessNotificationFunction(
                t('contract.form.message.stopSuccess') as string,
            );
            contractModule.setQueryString({
                page: DEFAULT_FIRST_PAGE,
            });
            const loading = ElLoading.service({
                target: '.content',
            });
            await contractModule.getContractList();
            loading.close();
        } else {
            showErrorNotificationFunction(result?.message as string);
        }
    });
    const { value: stopDate } = useField('stopDate');
    return {
        errors,
        stopDate,
        validate,
        onStop,
        resetForm,
    };
}
