import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import i18n from '@/plugins/vue-i18n';
import { ElLoading } from 'element-plus';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { contractTypeModule } from '../../store/contractType.store';

export const setupDelete = () => {
    const deleteContractType = async (id: number) => {
        const result = await showConfirmPopUpFunction(
            i18n.global.t('setting.contractType.message.deleteContractType') as string,
            i18n.global.t(
                'setting.contractType.message.deleteContractTypeTitle',
            ) as string,
            {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
        );
        if (result) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await contractTypeModule.deleteContractType(id);
            if (response?.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('setting.contractType.message.deleteSuccess') as string,
                );
                contractTypeModule.setQueryString({
                    page: DEFAULT_FIRST_PAGE,
                    limit: DEFAULT_SIZE_PER_PAGE,
                });
                await contractTypeModule.getContractTypeList();
            } else {
                showErrorNotificationFunction(response?.message as string);
                contractTypeModule.getContractTypeList();
            }
            loading.close();
        }
    };

    return { deleteContractType };
};
