<template>
    <keep-alive>
        <fragment>
            <el-tabs
                class="req-table"
                v-model="selectedTab"
                :before-leave="handleChangeTab"
            >
                <el-tab-pane
                    lazy
                    :label="$t('timekeeping.list.title.week')"
                    :name="timekeepingOptions.WEEK"
                >
                    <TableViewByWeek />
                </el-tab-pane>
                <el-tab-pane
                    lazy
                    :label="$t('timekeeping.list.title.month')"
                    :name="timekeepingOptions.MONTH"
                >
                    <TableViewByMonth />
                </el-tab-pane>
            </el-tabs>
        </fragment>
    </keep-alive>
</template>

<script lang="ts">
import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import moment from 'moment';
import { Options } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { TIMEKEEPING_TAB } from '../contants';
import { timeKeepingModule } from '../store';
import TableViewByMonth from './view-by-month/TimekeepingTable.vue';
import TableViewByWeek from './view-by-week/TimekeepingTable.vue';
import { TimeKeepingMixins } from '../mixins';
@Options({
    components: {
        TableViewByMonth,
        TableViewByWeek,
    },
})
export default class TimeKeepingTabs extends mixins(TimeKeepingMixins) {
    selectedTab = TIMEKEEPING_TAB.WEEK;

    get dateOptions(): Record<string, unknown> {
        return { week: TIMEKEEPING_TAB.WEEK, month: TIMEKEEPING_TAB.MONTH };
    }

    async getTimekeepingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await timeKeepingModule.getTimeKeepingList();
        loading.close();
    }

    async handleChangeTab(tabName: string): Promise<void> {
        let startDate, endDate;
        if (tabName === this.timekeepingOptions.WEEK) {
            timeKeepingModule.setSelectedTab(this.dateOptions.week as string);
            startDate = moment().startOf('week').fmFullTimeString();
            endDate = moment().endOf('week').endOfDay().fmFullTimeString();
        } else {
            timeKeepingModule.setSelectedTab(this.dateOptions.month as string);
            startDate = moment().startOf('month').fmFullTimeString();
            endDate = moment().endOf('month').endOfDay().fmFullTimeString();
        }

        timeKeepingModule.setTimeKeepingQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
            startDate,
            endDate,
        });
        timeKeepingModule.setSelectedDate(moment().fmDayString());
        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([
            timeKeepingModule.getTimeKeepingList(),
            timeKeepingModule.getHolidayList(),
        ]);
        loading.close();
    }
}
</script>

<style lang="scss" scoped>
.btn-group-container {
    position: relative;
}
.arrow-icon {
    height: 1em;
    width: 1em;
}
.btn-group {
    position: absolute;
    top: 3px;
    right: 20px;
    z-index: map-get($map: $zIndex, $key: dateNavigator);
}
</style>
