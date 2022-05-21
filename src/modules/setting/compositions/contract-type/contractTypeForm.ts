import { useField, useForm } from 'vee-validate';
import { ElLoading } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { IBodyResponse } from '@/common/types';
import { IContractType, IContractTypeCreate } from '../../type';
import { contractTypeService } from '../../services/contractTypeService';
import { validateContractTypeSchema } from '../../constant';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { contractTypeModule } from '../../store/contractType.store';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initData() {
    const { t } = useI18n();
    const initValues = {
        name: '',
        description: '',
        expiredIn: null,
        paidLeaveDays: 0,
    };
    const isCreate = computed(() => !contractTypeModule.selectedContractType?.id);
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateContractTypeSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const createInfo = {
            ...values,
            name: values.name?.trim(),
            description: values.description?.trim(),
            expiredIn: values?.expiredIn || null,
            paidLeaveDays: values.paidLeaveDays,
        } as IContractTypeCreate;
        let result = {} as IBodyResponse<IContractTypeCreate>;
        const contractTypeId = contractTypeModule.selectedContractType?.id;
        const loading = ElLoading.service({
            target: '.contract-type-form-popup',
        });
        if (!isCreate.value) {
            result = (await contractTypeService.update(
                contractTypeId as number,
                createInfo,
            )) as IBodyResponse<IContractTypeCreate>;
        } else {
            result = (await contractTypeService.create(
                createInfo,
            )) as IBodyResponse<IContractTypeCreate>;
        }
        loading.close();
        contractTypeModule.setIsShowContractTypeFormPopUp(false);
        if (result?.success) {
            showSuccessNotificationFunction(
                !isCreate.value
                    ? t('setting.contractType.message.updateSuccess')
                    : (t('setting.contractType.message.createSuccess') as string),
            );
            contractTypeModule.setQueryString({
                page: DEFAULT_FIRST_PAGE,
            });
            const loading = ElLoading.service({ target: '.main' });
            await contractTypeModule.getContractTypeList();
            loading.close();
        } else {
            showErrorNotificationFunction(result?.message as string);
        }
        contractTypeModule.setSelectedContractType(null);
    });

    const { value: name } = useField('name');
    const { value: description } = useField('description');
    const { value: expiredIn } = useField('expiredIn');
    const { value: paidLeaveDays } = useField('paidLeaveDays');
    const openPopup = async () => {
        if (!isCreate.value) {
            const loading = ElLoading.service({
                target: '.contract-type-form-popup',
            });
            const contractTypeDetail = (await contractTypeService.getDetail(
                contractTypeModule.selectedContractType?.id
                    ? contractTypeModule.selectedContractType?.id
                    : 0,
            )) as IBodyResponse<IContractType>;
            loading.close();
            resetForm({
                values: {
                    description: contractTypeDetail?.data?.description,
                    expiredIn: contractTypeDetail?.data?.expiredIn,
                    name: contractTypeDetail?.data?.name,
                    paidLeaveDays: contractTypeDetail?.data?.paidLeaveDays,
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
        name,
        description,
        expiredIn,
        paidLeaveDays,
        isCreate,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}
