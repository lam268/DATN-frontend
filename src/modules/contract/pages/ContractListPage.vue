<template>
    <div class="custom-loading-svg">
        <BaseListPageHeader
            @toggle-filter-form="toggleFilterForm"
            :pageTitle="$t('contract.list.filterForm.title')"
            :hasSortBox="hasSortBox"
            v-model:page="selectedPage"
            :totalItems="totalItems"
            :isShowCreateButton="isCanCreate"
            @create="state.showContractFormPopup"
            @onPaginate="handlePaginate"
        >
            <template #sort-box-content>
                <ContractSort />
            </template>
        </BaseListPageHeader>

        <ContractFilterForm :isToggleFilterForm="isToggleFilterForm" />
        <ContractTab @changeTab="onChangeCurrentTab" />
        <ContractPopup />
        <StopContractFormPopup />
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { ElLoading } from 'element-plus';
import { Options, setup } from 'vue-class-component';
import ContractTab from '../components/ContractTab.vue';
import ContractFilterForm from '../components/ContractFilterForm.vue';
import ContractPopup from '../components/popup/ContractFormPopup.vue';
import StopContractFormPopup from '../components/popup/StopContractFormPopup.vue';
import ContractSort from '../components/Sort.vue';
import { contractModule, initQueryString } from '../store';
import { setupPopupContract } from '../composition/formPopup';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { CONTRACT_TABS } from '../constants';
@Options({
    components: {
        ContractFilterForm,
        ContractSort,
        ContractTab,
        ContractPopup,
        StopContractFormPopup,
    },
})
export default class ContractListPage extends mixins(UtilMixins) {
    currentTab = CONTRACT_TABS.VIEW_BY_CONTRACT;
    state = setup(() => {
        const { isShowContractForm, showContractFormPopup } = setupPopupContract();
        return {
            isShowContractForm,
            showContractFormPopup,
        };
    });

    isToggleFilterForm = true;

    // computed
    get totalItems(): number {
        return contractModule.totalContracts;
    }

    get selectedPage(): number {
        return contractModule.queryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        contractModule.queryString.page = value;
    }

    get hasSortBox(): boolean {
        return this.currentTab === CONTRACT_TABS.VIEW_BY_CONTRACT;
    }

    // lifecycle's methods
    created(): void {
        contractModule.setQueryString(initQueryString);
        this.getData();
    }

    // init table data
    async getData(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([
            contractModule.getContractList(),
            contractModule.getContractTypeOptions(),
            contractModule.getUserOptions(),
        ]);
        loading.close();
    }

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(contractModule.userPermissions, [
            `${PermissionResources.CONTRACT}_${PermissionActions.CREATE}`,
        ]);
    }

    // methods
    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async handlePaginate(): Promise<void> {
        contractModule.setQueryString({ page: this.selectedPage });
        await contractModule.getContractList();
    }

    onChangeCurrentTab(newTab: CONTRACT_TABS): void {
        this.currentTab = newTab;
    }
}
</script>
<style lang="scss" scoped></style>
