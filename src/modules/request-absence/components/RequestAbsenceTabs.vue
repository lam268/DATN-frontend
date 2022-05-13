<template>
    <el-tabs
        class="request-absence-tab"
        v-model="selectedTab"
        :before-leave="handleChangeTab"
    >
        <el-tab-pane
            :label="$t('requestAbsence.list.title.history')"
            :name="requestAbsenceTab.HISTORY"
        >
            <RequestAbsenceTable />
        </el-tab-pane>
        <el-tab-pane
            :label="$t('requestAbsence.list.title.waiting')"
            :name="requestAbsenceTab.WAITING"
        >
            <WaitingRequestAbsenceTable />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts">
import { mixins } from 'vue-property-decorator';
import WaitingRequestAbsenceTable from './WaitingRequestAbsenceTable.vue';
import RequestAbsenceTable from './RequestAbsenceTable.vue';
import { Options } from 'vue-class-component';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { RequestAbsenceStatus, RequestAbsenceTab } from '../contants';
import { requestAbsenceModule } from '../store';
import { RequestAbsenceMixins } from '../mixins';

@Options({
    components: {
        WaitingRequestAbsenceTable,
        RequestAbsenceTable,
    },
})
@Options({})
export default class RequestAbsenceTabs extends mixins(RequestAbsenceMixins) {
    selectedTab = RequestAbsenceTab.HISTORY;
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

    async handleGetAbsence(
        tab: RequestAbsenceTab,
        status: RequestAbsenceStatus[] | null,
    ): Promise<void> {
        requestAbsenceModule.setSelectedTab(tab);
        requestAbsenceModule.setQueryString({
            page: DEFAULT_FIRST_PAGE,
            status,
        });
        await this.getAbsenceRequests();
    }

    async handleChangeTab(tabName: string): Promise<void> {
        if (tabName === RequestAbsenceTab.WAITING) {
            await this.handleGetAbsence(RequestAbsenceTab.WAITING, [
                RequestAbsenceStatus.WAITING,
            ]);
        } else {
            await this.handleGetAbsence(
                RequestAbsenceTab.HISTORY,
                requestAbsenceModule.requestAbsenceStatusFilterForm,
            );
        }
        requestAbsenceModule.clearFilter();
    }
}
</script>

<style lang="scss" scoped>
.request-absence-tab {
    border-right: 0;
    border-left: 0;

    @media only screen and (max-width: 991.98px) {
        margin: 0 -15px;
    }
}
</style>
