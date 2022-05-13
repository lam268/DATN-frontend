<template>
    <div class="dashboard-container">
        <div class="row">
            <div class="col-md-12">
                <TimekeepingInfo />
            </div>
            <div class="col-md-6">
                <AssetList />
            </div>
            <div class="col-md-6">
                <UpcomingEvents />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { ElLoading } from 'element-plus';
import { mixins, Options } from 'vue-class-component';
import { dashboardModule } from '@/modules/dashboard/store';
import TimekeepingInfo from '../components/TimekeepingInfo.vue';
import UpcomingEvents from '../components/UpcomingEvents.vue';
import AssetList from '../components/AssetList.vue';
import moment from 'moment';
@Options({
    components: { TimekeepingInfo, UpcomingEvents, AssetList },
})
export default class DashboardPage extends mixins(UtilMixins) {
    created(): void {
        this.initData();
    }

    async initData(): Promise<void> {
        const startDate = moment().startOf('month').utc().fmFullTimeString();
        const endDate = moment().endOf('month').utc().fmFullTimeString();
        dashboardModule.setDashboardTimekeepingQueryString({ startDate, endDate });

        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([
            dashboardModule.getTimekeepingInfo(),
            dashboardModule.getUpcomingEvents(),
            dashboardModule.getAssetList(),
        ]);
        loading.close();
    }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
    padding: 20px;
}
</style>
