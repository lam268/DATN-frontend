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
                    width="45"
                    prop="timekeeping"
                    v-for="key in generateDayOfMonth()"
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
                                <SelectIcon
                                    v-if="isWorkFullDay(scope.row.timekeepings?.[key])"
                                    class="icon full-day"
                                />
                                <CalendarIcon
                                    class="icon"
                                    v-else-if="getHolidayTitleFromDate(key)"
                                />
                                <p
                                    class="timekeeping-txt"
                                    v-else-if="
                                        shouldShowAbsenceDetail(
                                            scope.row.timekeepings?.[key],
                                            key,
                                        )
                                    "
                                >
                                    {{
                                        getAbsenceDurationDisplay(
                                            scope.row.timekeepings?.[key],
                                            key,
                                        )
                                    }}
                                </p>
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
import { mixins, Options } from 'vue-class-component';
import { ITimekeeping } from '../../types';
import { TimeKeepingMixins } from '../../mixins';
import i18n from '@/plugins/vue-i18n';
import TimeKeepingForm from '../timekeeping-form/TimekeepingForm.vue';
import UserColumn from '../UserColumn.vue';
import { checkWeekend } from '@/utils/helper';
import { Calendar as CalendarIcon, Select as SelectIcon } from '@element-plus/icons-vue';
@Options({
    components: {
        TimeKeepingForm,
        UserColumn,
        CalendarIcon,
        SelectIcon,
    },
})
export default class TimeKeepingTable extends mixins(TimeKeepingMixins) {
    generateDayOfMonth(): string[] {
        return Object.keys(this.timeKeepingList[0]?.timekeepings || {}) || [];
    }

    getAbsenceDurationDisplay(item: ITimekeeping, date: string): string {
        if (checkWeekend(date)) {
            return '';
        } else if (item?.requestAbsences.length) {
            const result = this.calculateAbsenceTime(item.requestAbsences);
            return `${this.convertMinuteToHour(result)} ${i18n.global.t(
                'timekeeping.list.timeLine.hours',
            )}`;
        } else {
            return '';
        }
    }

    shouldShowAbsenceDetail(items: ITimekeeping, date: string): boolean {
        return !!items?.requestAbsences?.length && !checkWeekend(date);
    }

    generateDate(date: string): string {
        return this.parseDateTime(date, this.DATE_TIME_FORMAT.DD);
    }
}
</script>
<style lang="scss" scoped>
.text-center {
    display: flex;
    justify-content: center;
    cursor: pointer;
}
.timekeeping-txt {
    color: white;
    font-size: 10px;
    font-weight: 500;
    margin-bottom: 0;
    word-break: break-word;
}
.style-empty {
    margin: 200px;
}
:deep(.el-table .el-table__cell) {
    padding: 0 !important;
    .cell {
        padding: 8px 0 !important;
    }
}
.icon {
    width: 1rem;
    height: 1rem;
    font-weight: 600;
    color: #ffffff;
}
.full-day {
    color: #67c23a !important;
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
