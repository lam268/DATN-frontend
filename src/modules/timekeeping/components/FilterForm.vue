<template>
    <BaseFilterFormLayout
        :isToggleFilterForm="isToggleFilterForm"
        @keyup.enter="handleSearch"
        @reset="resetFilter"
        @search="handleSearch"
    >
        <template #filter-title>
            <h5 class="filter-title-time">{{ $t('common.app.filterForm.search') }}</h5>
        </template>
        <slot>
            <div class="row">
                <div class="col-sm-6 col-md-6">
                    <BaseInputText
                        v-model:value="form.keyword"
                        type="text"
                        :placeholder="$t('timekeeping.list.fields.placeHolderSearch')"
                        :label="$t('timekeeping.list.title.keyword')"
                        name="search"
                    />
                </div>
                <div
                    v-if="viewModeOption !== timekeepingOptions.MONTH"
                    class="col-sm-6 col-md-6"
                >
                    <BaseDatePicker
                        v-model:value="form.selectedWeek"
                        :label="$t('timekeeping.list.title.weekFilter')"
                        :placeholder="$t('timekeeping.list.title.weekFilter')"
                        type="week"
                        name="searchByWeek"
                        :date-format="`[${$t('timekeeping.list.title.weekFilter')}] ww`"
                        @changeValue="handleSearch"
                    />
                </div>
                <div v-else class="col-sm-6 col-md-6">
                    <BaseDatePicker
                        v-model:value="form.selectedMonth"
                        :label="$t('timekeeping.list.title.month')"
                        :placeholder="$t('timekeeping.list.fields.month')"
                        type="month"
                        name="searchByMonth"
                        :dateFormat="DATE_TIME_FORMAT.YYYY_MM_HYPHEN"
                        @changeValue="handleSearch"
                    />
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { mixins, Prop } from 'vue-property-decorator';
import { initTimeKeepingFilterForm, dayDiff } from '../contants';
import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { Options } from 'vue-class-component';
import moment from 'moment';

import { ElLoading } from 'element-plus';
import { ITimeKeepingFilter } from '../types';
import { timeKeepingModule } from '../store';
import { TimeKeepingMixins } from '../mixins';
@Options({})
export default class FilterForm extends mixins(TimeKeepingMixins) {
    @Prop({ default: false }) readonly isToggleFilterForm!: boolean;

    get form(): ITimeKeepingFilter {
        return timeKeepingModule.timeKeepingFilter;
    }

    set form(form: ITimeKeepingFilter) {
        timeKeepingModule.setTimeKeepingFilter({
            keyword: form.keyword,
            selectedWeek: moment(form.selectedWeek).format(
                this.DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
            ),
            selectedMonth: moment(form.selectedMonth).format(
                this.DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN,
            ),
        });
    }

    get viewModeOption(): string {
        return timeKeepingModule.selectedTab;
    }

    async resetFilter(): Promise<void> {
        this.form = {
            keyword: null,
            selectedWeek: moment().format(this.DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
            selectedMonth: moment().format(this.DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN),
        };
        timeKeepingModule.clearQueryString();
        await this.handleSearch();
    }

    created(): void {
        timeKeepingModule.setTimeKeepingFilter(initTimeKeepingFilterForm);
    }

    async handleSearch(): Promise<void> {
        timeKeepingModule.timeKeepingFilter.keyword =
            timeKeepingModule.timeKeepingFilter.keyword?.trim();
        const { keyword, selectedMonth = '', selectedWeek = '' } = this.form;

        let startDate = null;
        let endDate = null;

        if (timeKeepingModule.selectedTab === this.timekeepingOptions.WEEK) {
            if (!this.form.selectedWeek) {
                return;
            }
            const mondayDate = moment(selectedWeek).add(dayDiff, 'd');
            timeKeepingModule.setSelectedDate(
                mondayDate.startOf('isoWeek').fmDayString(),
            );
            startDate = selectedWeek
                ? mondayDate.startOf('isoWeek').fmDayString()
                : moment().startOf('isoWeek').fmDayString();
            endDate = selectedWeek
                ? mondayDate.endOf('isoWeek').fmDayString()
                : moment().endOf('isoWeek').fmDayString();
        } else {
            if (!this.form.selectedMonth) {
                return;
            }
            timeKeepingModule.setSelectedDate(selectedMonth);
            startDate = selectedMonth
                ? moment(selectedMonth).startOf('month').fmDayString()
                : moment().startOf('month').fmDayString();
            endDate = selectedMonth
                ? moment(selectedMonth).endOf('month').fmDayString()
                : moment().endOf('month').fmDayString();
        }
        timeKeepingModule.setTimeKeepingQueryString({
            keyword: keyword || null,
            startDate,
            endDate,
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
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
<style scoped>
.filter-title-time {
    font-weight: bold;
    margin-bottom: 8px;
}
:deep(.form-group) {
    margin-bottom: 0 !important;
}
:deep(label) {
    font-size: 13px;
}
</style>
