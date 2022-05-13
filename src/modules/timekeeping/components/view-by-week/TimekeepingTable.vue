<template>
    <BaseTableLayout
        :border="true"
        :stripe="true"
        :data="timeKeepingList"
        :cell-style="getCellStyle"
        @cell-click="onClickCell"
    >
        <template #table-columns>
            <el-table-column
                fixed="left"
                prop="fullName"
                :label="$t('timekeeping.list.title.employee')"
                min-width="200"
            >
                <template #default="scope">
                    <user-column :user="scope.row" />
                </template>
            </el-table-column>
            <el-table-column>
                <template #header>
                    <div class="text-center">
                        {{ generateMonthHeader(timeKeepingList) }}
                    </div>
                </template>
                <el-table-column
                    min-width="200"
                    prop="timekeeping"
                    v-for="key in weekHeader"
                    :key="key"
                    :row-key="key"
                >
                    <template #header>
                        <div class="text-center">
                            {{ generateDate(key) }}
                        </div>
                    </template>
                    <template #default="scope">
                        <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="generateTooltip(scope.row?.timekeepings?.[key])"
                            raw-content
                            show-after="100"
                        >
                            <div class="text-center tooltip-hover">
                                <span
                                    v-if="
                                        scope.row.timekeepings?.[key]?.checkIn ||
                                        scope.row.timekeepings?.[key]?.checkOut
                                    "
                                    >{{
                                        generateWorkingHourText(
                                            scope.row.timekeepings?.[key],
                                        )
                                    }}</span
                                >
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table-column>
        </template>
    </BaseTableLayout>
    <TimeKeepingForm />
</template>

<script lang="ts">
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import { mixins, Options } from 'vue-class-component';
import { ITimekeeping } from '../../types';
import { TimeKeepingMixins } from '../../mixins';
import TimeKeepingForm from '../timekeeping-form/TimekeepingForm.vue';
import UserColumn from '../UserColumn.vue';
import { timeKeepingModule } from '@/modules/timekeeping/store';
@Options({
    components: {
        TimeKeepingForm,
        UserColumn,
    },
})
export default class TimeKeepingTable extends mixins(TimeKeepingMixins) {
    get weekHeader(): string[] {
        const headerDate = [];
        for (let index = 0; index < 7; index++) {
            const date = moment(timeKeepingModule.selectedDate)
                .startOf('isoWeek')
                .add(index, 'day')
                .fmDayString();

            headerDate.push(date);
        }
        return headerDate;
    }

    generateDate(date: string): string {
        return capitalize(
            this.parseDateTime(date, this.DATE_TIME_FORMAT.DAY_NAME_MONTH_STRING),
        );
    }

    generateWorkingHourText(timekeeping: ITimekeeping): string | boolean {
        if (!timekeeping?.checkIn && !timekeeping?.checkOut) {
            return false;
        }
        const startTime = timekeeping?.checkIn
            ? moment(timekeeping.checkIn).fmHourMinuteString()
            : '';
        const endTime = timekeeping?.checkOut
            ? moment(timekeeping.checkOut).fmHourMinuteString()
            : '';
        return `${startTime} - ${endTime}`;
    }
}
</script>
<style scoped lang="scss">
.text-center {
    text-align: center;
    height: 100%;
    width: 100%;
    cursor: pointer;
}
.time-center {
    text-align: center;
}
.style-empty {
    margin: 200px;
}
.el-tooltip {
    cursor: pointer;
}
.holiday {
    color: #ffffff;
    text-align: center;
}
:deep(.el-table .el-table__cell) {
    padding: 0 !important;
    .cell {
        padding: 8px 0 !important;
    }
}
.tooltip-hover {
    min-height: 10px;
    min-width: 10px;
    width: 100%;
    height: 100%;
}
:deep(tr.table-header) {
    &:nth-child(1) {
        .el-table__cell {
            &:nth-child(1) {
                .cell {
                    padding-left: 20px !important;
                }
            }
        }
    }
}
</style>
