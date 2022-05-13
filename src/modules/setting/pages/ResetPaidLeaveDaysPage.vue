<template>
    <div>
        <SettingHeader
            :pageTitle="$t('setting.paidLeaveDays.title')"
            @save="save"
            @reset="reset"
        />
        <div class="row mt-3 paid-leave-days-layout">
            <div class="col-md-12 col-sm-12 fw-bold">
                <div class="row">
                    <div class="col-md-3 title">
                        <span>{{ $t('setting.paidLeaveDays.fields.year') }}</span>
                    </div>
                    <div class="col-md-6 title">
                        <div class="month-select-container">
                            <span style="width: 100%">{{
                                $t('setting.paidLeaveDays.fields.resetMonth')
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-1 paid-leave-days-layout">
            <div>
                <div
                    v-for="(schedule, index) in paidLeaveDaysSchedule"
                    :key="index"
                    class="col-md-12 col-sm-12 mb-1"
                >
                    <div class="row">
                        <div class="block col-md-3">
                            <BaseDatePicker
                                v-model:value="schedule.year"
                                :placeholder="
                                    $t('setting.paidLeaveDays.placeholder.resetYear')
                                "
                                :dateFormat="DATE_TIME_FORMAT.YYYY"
                                :valueFormat="DATE_TIME_FORMAT.YYYY"
                                type="year"
                                class="custom-date-picker"
                                :error="schedule.yearError ? $t(schedule.yearError) : ''"
                                :isDisabled="!isCanUpdate"
                                @changeValue="onChangeYearDatePicker(schedule)"
                            />
                        </div>
                        <div class="block col-md-6">
                            <div class="month-select-container">
                                <BaseDatePicker
                                    v-model:value="schedule.resetDate"
                                    type="month"
                                    :placeholder="
                                        $t('setting.paidLeaveDays.placeholder.resetMonth')
                                    "
                                    :minDate="getMinDate(schedule.year)"
                                    :maxDate="getMaxDate(schedule.year)"
                                    :default-value="schedule.year"
                                    :error="
                                        schedule.dateError ? $t(schedule.dateError) : ''
                                    "
                                    :isDisabled="!isCanUpdate"
                                    :dateFormat="DATE_TIME_FORMAT.YYYY_MM_HYPHEN"
                                    :valueFormat="DATE_TIME_FORMAT.YYYY_MM_HYPHEN"
                                    @changeValue="
                                        validatePaidLeaveDaysScheduleBeforeSubmit
                                    "
                                />
                            </div>
                        </div>
                        <div
                            class="block col-md-3 col-sm-12 d-flex justify-content-start"
                            v-if="isCanUpdate"
                        >
                            <el-button
                                plain
                                v-if="paidLeaveDaysSchedule.length > 1"
                                @click="onClickButtonDelete(index)"
                            >
                                <DeleteIcon class="action-icon" />
                            </el-button>
                            <el-button v-if="index === 0" plain @click="onClickButtonAdd">
                                <PlusIcon class="action-icon" />
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-property-decorator';
import SettingHeader from '../components/SettingHeader.vue';
import { ElLoading } from 'element-plus';
import { Delete as DeleteIcon, Plus as PlusIcon } from '@element-plus/icons-vue';
import { settingPaidLeaveDaysModule } from '../store/paidLeaveDays.store';
import { IResetPaidLeaveDaysSchedule, IResetPaidLeaveDaysScheduleForm } from '../type';
import { setup } from 'vue-class-component';
import { setupSaveResetPaidLeaveDaysSchedulesSetting } from '../compositions/paid-leave-days/paidLeaveDaysList';
import moment from 'moment';
import trim from 'lodash/trim';
import { SettingMixins } from '../mixins';

@Options({
    components: {
        SettingHeader,
        DeleteIcon,
        PlusIcon,
    },
})
export default class SettingResetPaidLeaveDaysPage extends mixins(SettingMixins) {
    paidLeaveDaysSchedule: IResetPaidLeaveDaysScheduleForm[] = [
        {
            year: '',
            resetDate: '',
            yearError: '',
            dateError: '',
        },
    ];

    saveAction = setup(() => setupSaveResetPaidLeaveDaysSchedulesSetting());

    created(): void {
        this.getData();
    }

    getMinDate(date: string): string {
        return moment(date, this.DATE_TIME_FORMAT.YYYY)
            .startOf('year')
            .subtract(1, 'day')
            .fmDayString();
    }

    getMaxDate(date: string): string {
        return moment(date, this.DATE_TIME_FORMAT.YYYY).endOf('year').fmDayString();
    }

    async getData(): Promise<void> {
        const loading = ElLoading.service({});
        await settingPaidLeaveDaysModule.getResetScheduleList();
        loading.close();
        this.setupPaidLeaveDaysForm();
    }

    setupPaidLeaveDaysForm(): void {
        this.paidLeaveDaysSchedule = settingPaidLeaveDaysModule.paidLeaveDaysList.map(
            (item) => ({
                year: item.year,
                resetDate: item.resetDate,
                yearError: '',
                dateError: '',
            }),
        );
        if (!this.paidLeaveDaysSchedule?.length) {
            this.onClickButtonAdd();
        }
    }

    onClickButtonDelete(index: number): void {
        this.paidLeaveDaysSchedule.splice(index, 1);
        this.validatePaidLeaveDaysScheduleBeforeSubmit();
    }

    onClickButtonAdd(): void {
        this.paidLeaveDaysSchedule.unshift({
            year: '',
            resetDate: '',
            yearError: '',
            dateError: '',
        });
    }

    validatePaidLeaveDaysScheduleBeforeSubmit(): boolean {
        let isValid = true;
        const uniqueCodeMap: Record<string, number> = {};
        (this.paidLeaveDaysSchedule || []).forEach((item) => {
            item.year = trim(item.year);
            if (item.year) {
                uniqueCodeMap[item.year.toLowerCase()] =
                    (uniqueCodeMap?.[item.year.toLowerCase()] || 0) + 1;
            }
        });
        (this.paidLeaveDaysSchedule || []).forEach((item) => {
            item.yearError = '';
            item.dateError = '';
            // check if item's year is empty
            if (!item.year) {
                item.yearError = 'setting.paidLeaveDays.errors.emptyYear';
                isValid = false;
            }

            // check if item's year is duplicated
            --uniqueCodeMap[item.year.toLowerCase()];
            if (uniqueCodeMap[item.year.toLowerCase()] > 0) {
                item.yearError = 'setting.paidLeaveDays.errors.duplicate';
                isValid = false;
            }

            // check if item's reset date is null/empty
            item.resetDate = trim(item.resetDate);
            if (!item.resetDate) {
                item.dateError = 'setting.paidLeaveDays.errors.emptyMonth';
                isValid = false;
            }

            // reset error message
        });
        return isValid;
    }

    async save(): Promise<void> {
        const isValidData = this.validatePaidLeaveDaysScheduleBeforeSubmit();
        if (!isValidData) {
            return;
        }

        const saveResult = await this.saveAction.saveResetPaidLeaveDaysSchedulesList(
            this.paidLeaveDaysSchedule as IResetPaidLeaveDaysSchedule[],
        );
        if (saveResult) {
            this.setupPaidLeaveDaysForm();
        } else {
            this.getData();
        }
    }

    reset(): void {
        this.setupPaidLeaveDaysForm();
    }

    onChangeYearDatePicker(schedule: IResetPaidLeaveDaysSchedule): void {
        this.resetSelectedMonth(schedule);
        this.validatePaidLeaveDaysScheduleBeforeSubmit();
    }

    resetSelectedMonth(schedule: IResetPaidLeaveDaysSchedule): void {
        schedule.resetDate = '';
    }
}
</script>

<style lang="scss" scoped>
.paid-leave-days-layout {
    margin-left: 8px;
}

.action-icon {
    height: 1em;
    width: 1em;
}
.title {
    text-align: left;
}
.month-select-container {
    padding: 0 24px;
}
</style>
