<template>
    <BaseListPageHeader
        @toggle-filter-form="toggleFilterForm"
        :pageTitle="$t('common.app.menu.timekeeping.requestAbsence')"
        :isShowCreateButton="isCanCreate"
        :totalItems="totalItems"
        :hasSortBox="true"
        :createButtonText="$t('requestAbsence.list.title.create')"
        @create="onClickCreate"
        v-model:page="selectedPage"
        @onPaginate="handlePaginate"
    >
        <template #sort-box-content>
            <Sort />
        </template>
    </BaseListPageHeader>
    <FilterForm
        @toggle-filter-form="toggleFilterForm"
        :isToggleFilterForm="isToggleFilterForm"
    />
    <RequestAbsenceTabs v-if="isCanUpdateOrUpdateStatus" />
    <RequestAbsenceTable v-else />
    <RequestAbsenceFormPopup />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import RequestAbsenceTabs from '../components/RequestAbsenceTabs.vue';
import FilterForm from '../components/FilterForm.vue';
import WaitingRequestAbsenceTable from '../components/WaitingRequestAbsenceTable.vue';
import RequestAbsenceTable from '../components/RequestAbsenceTable.vue';
import RequestAbsenceFormPopup from '../components/RequestAbsenceFormPopup.vue';
import { Options } from 'vue-class-component';
import { ElLoading } from 'element-plus';
import Sort from '../components/Sort.vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { initRequestAbsenceQueryString, RequestAbsenceTab } from '../contants';
import { requestAbsenceModule } from '../store';
import { checkUserHasPermission } from '@/utils/helper';

@Options({
    components: {
        RequestAbsenceTabs,
        WaitingRequestAbsenceTable,
        RequestAbsenceTable,
        FilterForm,
        RequestAbsenceFormPopup,
        Sort,
    },
})
@Options({})
export default class RequestAbsencePage extends mixins(UtilMixins) {
    isToggleFilterForm = true;

    get totalItems(): number {
        return requestAbsenceModule.totalAbsences;
    }

    get selectedPage(): number {
        return requestAbsenceModule.queryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        requestAbsenceModule.queryString.page = +value.toString().replaceAll('-', '');
    }

    get isCanCreate(): boolean {
        return (
            requestAbsenceModule.userPermissions.includes(
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.CREATE_PERSONAL}`,
            ) ||
            requestAbsenceModule.userPermissions.includes(
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.CREATE}`,
            )
        );
    }

    get isCanUpdateOrUpdateStatus(): boolean {
        return checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE}`,
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_STATUS}`,
        ]);
    }

    async created(): Promise<void> {
        await this.initData();
    }

    unmounted(): void {
        requestAbsenceModule.clearFilter();
        requestAbsenceModule.setRequestAbsenceList([]);
        requestAbsenceModule.setTotalAbsences(0);
        requestAbsenceModule.setSelectedTab(RequestAbsenceTab.HISTORY);
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    onClickCreate(): void {
        requestAbsenceModule.setIsShowRequestAbsenceFormPopup(true);
    }

    async initData(): Promise<void> {
        requestAbsenceModule.setQueryString(initRequestAbsenceQueryString);
        await this.getAbsenceRequests();
    }

    async getAbsenceRequests(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await requestAbsenceModule.getRequestAbscenceList();
        loading.close();

        if (!response?.success) {
            this.showErrorNotification(response.message as string);
        }
    }

    async handlePaginate(): Promise<void> {
        await this.getAbsenceRequests();
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs--border-card) {
    .el-tabs__content {
        padding: 15px 0px !important;
    }
}
:deep(.el-table__header-wrapper) {
    .el-table__header {
        width: 100% !important;
    }
}
</style>
