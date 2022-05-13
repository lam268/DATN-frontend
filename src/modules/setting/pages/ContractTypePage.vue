<template>
    <div>
        <BaseListPageHeader
            :pageTitle="$t('setting.contractType.title')"
            :totalItems="totalContracts"
            :createButtonText="$t('setting.contractType.button.create')"
            :hasSortBox="true"
            :hasFilterForm="false"
            v-model:page="selectedPage"
            v-model:keyword="keyword"
            :isShowCreateButton="isCanUpdate"
            :isShowSearchBox="isShowSearchBox"
            @toggle-search-box="toggleSearchBox"
            @create="showContractTypeFormPopup"
            @onPaginate="handlePaginate"
            @search="handleFilter"
        >
            <template #sort-box-content>
                <ContractTypeSort />
            </template>
        </BaseListPageHeader>
        <ContractTypeTable />
        <ContractTypeFormPopup />
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import ContractTypeTable from '../components/contract-type/ContractTypeTable.vue';
import ContractTypeSort from '../components/contract-type/Sort.vue';
import ContractTypeFormPopup from '../components/contract-type/ContractTypeFormPopup.vue';
import { DEFAULT_FIRST_PAGE, LIMIT_PER_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { contractTypeModule, initQueryString } from '../store/contractType.store';
import { checkUserHasPermission } from '@/utils/helper';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';

@Options({
    components: { ContractTypeTable, ContractTypeSort, ContractTypeFormPopup },
})
export default class ContractTypePage extends mixins(UtilMixins) {
    isShowSearchBox = true;

    get isCanUpdate(): boolean {
        return checkUserHasPermission(contractTypeModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }

    get totalContracts(): number {
        return contractTypeModule.totalContractTypes;
    }

    get keyword(): string {
        return contractTypeModule.contractTypeQueryString?.keyword || '';
    }

    set keyword(keyword: string) {
        contractTypeModule.setQueryString({ keyword });
    }

    get selectedPage(): number {
        return contractTypeModule.contractTypeQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        contractTypeModule.contractTypeQueryString.page = value;
    }

    created(): void {
        contractTypeModule.setQueryString(initQueryString);
        this.getContractTypeList();
    }

    toggleSearchBox(): void {
        this.isShowSearchBox = !this.isShowSearchBox;
    }

    async getContractTypeList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await contractTypeModule.getContractTypeList();
        loading.close();

        if (!response?.success) {
            this.showErrorNotification(response.message as string);
        }
        loading.close();
    }

    async handleFilter(): Promise<void> {
        contractTypeModule.setQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: LIMIT_PER_PAGE,
        });
        await this.getContractTypeList();
    }

    async handlePaginate(): Promise<void> {
        contractTypeModule.setQueryString({
            page: this.selectedPage,
        });
        await this.getContractTypeList();
    }

    showContractTypeFormPopup(): void {
        contractTypeModule.setIsShowContractTypeFormPopUp(true);
    }
}
</script>
