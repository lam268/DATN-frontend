<template>
    <el-dialog
        width="35%"
        v-model="isShowTimeKeepingForm"
        @closed="onClosedPopup"
        @open="form.openPopup"
        custom-class="timekeeping-form-popup"
    >
        <template #title>
            <h3 class="text-left title-left">
                {{
                    isCreate
                        ? $t('timekeeping.list.timeLine.form.label.timeCreate')
                        : $t('timekeeping.list.timeLine.form.label.timeUpdate')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-6">
                <BaseSingleSelect
                    v-model:value="form.userId"
                    :error="translateYupError(form.errors.userId)"
                    :options="assigneeOptions"
                    :filterable="true"
                    :is-required="true"
                    :label="$t('timekeeping.list.timeLine.userId')"
                    :placeholder="$t('timekeeping.list.filterForm.placeholder.userId')"
                    name="contractUserName"
                    :isDisabled="!isCreate"
                />
            </div>
            <div class="col-md-6">
                <BaseDatePicker
                    v-model:value="form.dateTime"
                    :error="translateYupError(form.errors.dateTime)"
                    :is-required="true"
                    :label="$t('timekeeping.list.timeLine.date')"
                    :placeholder="$t('timekeeping.list.filterForm.placeholder.date')"
                    name="date"
                    :min-date="minTimeKeepingDate"
                    @navigateCalendar="onNavigateCalendar"
                />
            </div>
            <div class="col-md-6">
                <TimePicker
                    :label="$t('timekeeping.list.timeLine.checkIn')"
                    :placeholder="$t('timekeeping.list.filterForm.placeholder.checkIn')"
                    v-model:value="form.startTime"
                    name="startTime"
                    :isRequired="true"
                    :error="translateYupError(form.errors.startTime)"
                />
            </div>
            <div class="col-md-6">
                <TimePicker
                    :label="$t('timekeeping.list.timeLine.checkOut')"
                    :placeholder="$t('timekeeping.list.filterForm.placeholder.checkOut')"
                    v-model:value="form.endTime"
                    name="endTime"
                    :isRequired="true"
                    :error="translateYupError(form.errors.endTime)"
                />
            </div>
        </div>
        <template #footer>
            <div class="d-flex justify-content-center footer">
                <el-button @click="onClickCancel">
                    {{ $t('timekeeping.list.title.cancel') }}
                </el-button>
                <el-button
                    type="danger"
                    v-if="isCanDelete && !isCreate"
                    @click="form.onDelete"
                    class="col-auto d-flex justify-content-center"
                >
                    {{ $t('timekeeping.list.title.delete') }}
                </el-button>
                <el-button
                    type="primary"
                    @click="form.submit"
                    v-if="(isCanUpdate && !isCreate) || (isCanCreate && isCreate)"
                >
                    {{ $t('timekeeping.list.title.submit') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { ISelectOptions } from '@/common/types';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { initData } from '@/modules/timekeeping/composition/timekeepingForm';
import { timeKeepingModule } from '@/modules/timekeeping/store';
import { checkUserHasPermission, parseLanguageSelectOptions } from '@/utils/helper';
import { Options, setup } from 'vue-class-component';
import TimePicker from './TimePicker.vue';
import moment from 'moment';

@Options({
    components: { TimePicker },
})
export default class TimeKeepingForm extends UtilMixins {
    form = setup(() => initData());

    get isCanCreate(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
        ]);
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.DELETE}`,
        ]);
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.UPDATE}`,
        ]);
    }

    get isShowTimeKeepingForm(): boolean {
        return timeKeepingModule.isShowTimeKeepingForm;
    }

    get assigneeOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(timeKeepingModule.assigneeOptions);
    }

    get isCreate(): boolean {
        return !timeKeepingModule.timeKeepingForm?.id;
    }

    onClickCancel(): void {
        timeKeepingModule.setIsShowTimeKeepingForm(false);
    }

    onClosedPopup(): void {
        timeKeepingModule.setIsShowTimeKeepingForm(false);
        timeKeepingModule.setTimeKeepingForm({
            userId: undefined,
            timekeeping: null,
            dateTime: null,
        });
    }

    async onNavigateCalendar(date: Date): Promise<void> {
        await timeKeepingModule.getHolidayList({
            startDate: moment(date).startOf('month').utc().fmFullTimeString(),
            endDate: moment(date).endOf('month').utc().fmFullTimeString(),
        });
    }
}
</script>

<style lang="scss" scoped>
.btn {
    display: flex;
    justify-content: center;
    align-items: center;
}
.mr-right {
    margin-right: 12px;
}
.mr-left {
    margin-left: 12px;
}
.title-left {
    display: flex;
}
</style>
