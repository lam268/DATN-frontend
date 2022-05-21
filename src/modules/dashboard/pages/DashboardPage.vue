<template>
    <div class="dashboard-container">
        <div class="row">
            <div class="col-md-12">
                <TimekeepingInfo />
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
import moment from 'moment';
@Options({
    components: { TimekeepingInfo },
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
        await Promise.all([dashboardModule.getTimekeepingInfo()]);
        loading.close();
    }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
    padding: 20px;
}
</style>
