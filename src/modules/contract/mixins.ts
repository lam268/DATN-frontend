import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { UtilMixins } from '@/mixins/utilMixins';
import i18n from '@/plugins/vue-i18n';
import moment from 'moment';
import { ElLoading } from 'element-plus';
import { mixins } from 'vue-class-component';
import {
    ContractStatus,
    CONTRACT_MIN_DATE,
    CONTRACT_TABS,
    DEFAULT_ORDER_BY,
} from './constants';
import { contractApiService } from './services/api.service';
import { contractModule } from './store';
import { IContract, IContractUpdate } from './types';
import { checkUserHasPermission } from '@/utils/helper';
import { PermissionActions, PermissionResources } from '../role/constants';

export class ContractMixins extends mixins(UtilMixins) {
    CONTRACT_MIN_DATE = CONTRACT_MIN_DATE;
    CONTRACT_TABS = CONTRACT_TABS;
    DEFAULT_ORDER_BY = DEFAULT_ORDER_BY;

    get tableData(): IContract[] {
        return contractModule.contractList;
    }

    async confirmDelete(id: number): Promise<void> {
        const result = await this.showConfirmPopup(
            i18n.global.t('contract.list.deleteContract.confirmPopup.message') as string,
            i18n.global.t('contract.list.deleteContract.confirmPopup.title') as string,
            {},
        );
        if (result) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await contractApiService.delete(id);
            if (response?.success) {
                this.showSuccessNotification(
                    i18n.global.t(
                        'contract.list.deleteContract.notification.messageSuccess',
                    ) as string,
                );
                contractModule.setQueryString({
                    page: DEFAULT_FIRST_PAGE,
                    limit: DEFAULT_SIZE_PER_PAGE,
                });
                await contractModule.getContractList();
            } else {
                this.showErrorNotification(response?.message);
                await contractModule.getContractList();
            }
            loading.close();
        }
    }

    onClickUpdateContract(contract: IContractUpdate): void {
        contractModule.setSelectedContract(contract);
        contractModule.setIsShowContractFormPopUp(true);
    }

    onClickStopContract(contract: IContractUpdate): void {
        contractModule.setSelectedContract(contract);
        contractModule.setIsShowStopContractFormPopUp(true);
    }

    formatDate(date: string): string {
        return date ? moment(date).fmDayString() : '';
    }

    isCanDelete(status: ContractStatus): boolean {
        return (
            checkUserHasPermission(contractModule.userPermissions, [
                `${PermissionResources.CONTRACT}_${PermissionActions.DELETE}`,
            ]) &&
            (status === ContractStatus.ACTIVE ||
                status === ContractStatus.ABOUT_TO_ACTIVE)
        );
    }

    isCanUpdate(status: ContractStatus): boolean {
        return (
            checkUserHasPermission(contractModule.userPermissions, [
                `${PermissionResources.CONTRACT}_${PermissionActions.UPDATE}`,
            ]) &&
            (status === ContractStatus.ACTIVE ||
                status === ContractStatus.ABOUT_TO_ACTIVE)
        );
    }

    statusBadge(contract: IContract): string {
        if (contract.endDate) {
            const contractTimeRemaining = moment(contract.endDate).diff(
                moment(),
                'month',
            );
            if (
                contractTimeRemaining === 0 &&
                contract.status === ContractStatus.ACTIVE
            ) {
                if (moment(contract.endDate).diff(moment(), 'day') > 0) {
                    return ContractStatus.ABOUT_TO_EXPIRE;
                }
            }
        }
        switch (contract.status) {
            case ContractStatus.ACTIVE:
                return 'success';
            case ContractStatus.STOPPED:
                return 'warning';
            case ContractStatus.EXPIRED:
                return 'danger';
            default:
                return contract.status;
        }
    }

    statusText(contract: IContract): string {
        if (contract.endDate) {
            const contractTimeRemaining = moment(contract.endDate).diff(
                moment(),
                'month',
            );
            if (
                contractTimeRemaining === 0 &&
                contract.status === ContractStatus.ACTIVE
            ) {
                if (moment(contract.endDate).diff(moment(), 'day') > 0) {
                    return ContractStatus.ABOUT_TO_EXPIRE;
                }
            }
        }
        return contract.status;
    }
}
