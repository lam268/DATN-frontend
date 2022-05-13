<template>
    <el-dialog
        width="50%"
        v-model="isShowAbsenceForm"
        @closed="closedPopup"
        @open="form.openPopup"
        custom-class="request-absence-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    isCreate
                        ? $t('requestAbsence.form.title.create')
                        : $t('requestAbsence.form.title.update')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-12">
                <BaseSingleSelect
                    v-model:value="form.userId"
                    :label="$t('requestAbsence.form.employee.label')"
                    :placeholder="$t('requestAbsence.form.employee.placeholder')"
                    :options="form.absenceUserOptions"
                    :error="translateYupError(form.errors.userId)"
                    :isRequired="true"
                    :filterable="true"
                    :isDisabled="!isCanCreateAll"
                    name="user"
                />
            </div>
            <div class="col-md-12 radio">
                <el-radio-group v-model="form.type">
                    <el-radio :label="type.HALF_DAY">{{
                        $t('requestAbsence.list.title.halfDay')
                    }}</el-radio>
                    <el-radio :label="type.ALL_DAY">{{
                        $t('requestAbsence.list.title.allDay')
                    }}</el-radio>
                    <el-radio :label="type.CUSTOM_DAY">{{
                        $t('requestAbsence.list.title.customDay')
                    }}</el-radio>
                </el-radio-group>
            </div>
            <div class="col-md-12">
                <BaseInputText
                    v-model:value="form.reason"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    :label="$t('requestAbsence.list.title.reason')"
                    :placeholder="$t('requestAbsence.form.reason.placeholder')"
                    name="reason"
                    :isRequired="true"
                    :error="translateYupError(form.errors.reason)"
                />
            </div>
            <div class="col-md-6">
                <BaseDatePicker
                    format="yyyy-MM-dd"
                    v-model:value="form.startDate"
                    :label="
                        $t(
                            `requestAbsence.form.${
                                form.type === type.HALF_DAY
                                    ? `startDate.halfDay`
                                    : 'startDate.label'
                            }`,
                        )
                    "
                    :placeholder="$t('requestAbsence.form.startDate.placeholder')"
                    name="dayAbsence"
                    :isRequired="true"
                    :minDate="minStartDate"
                    :maxDate="maxStartDate"
                    :isDisabledWeekend="true"
                    :error="translateYupError(form.errors.startDate)"
                />
            </div>
            <div
                v-if="form.type === type.CUSTOM_DAY || form.type === type.ALL_DAY"
                class="col-md-6"
            >
                <BaseDatePicker
                    format="yyyy-MM-dd"
                    v-model:value="form.endDate"
                    :label="$t('requestAbsence.form.endDate.label')"
                    :placeholder="$t('requestAbsence.form.endDate.placeholder')"
                    name="endDate"
                    :isRequired="true"
                    :minDate="minEndDate"
                    :maxDate="maxEndDate"
                    :isDisabledWeekend="true"
                    :error="translateYupError(form.errors.endDate)"
                />
            </div>
            <div v-if="form.type === type.HALF_DAY" class="col-md-6">
                <BaseSingleSelect
                    name="shift"
                    v-model:value="form.shift"
                    :options="sessionDate"
                    :isRequired="true"
                    :error="translateYupError(form.errors.shift)"
                    :label="$t('requestAbsence.form.selectShift.label')"
                />
            </div>
            <div v-if="form.type === type.CUSTOM_DAY" class="col-md-6">
                <TimeSelect
                    :label="$t('requestAbsence.list.title.startAt')"
                    :placeholder="$t('requestAbsence.form.startTime.placeholder')"
                    v-model:value="form.startTime"
                    :start="timeStartMorning"
                    :step="timePickerStep"
                    :end="timeEndAfternoon"
                    :max="maxHourSelectValue"
                    name="startTime"
                    :isRequired="true"
                    :error="translateYupError(form.errors.startTime)"
                />
            </div>
            <div v-if="form.type === type.CUSTOM_DAY" class="col-md-6">
                <TimeSelect
                    :label="$t('requestAbsence.list.title.endAt')"
                    :placeholder="$t('requestAbsence.form.endTime.placeholder')"
                    v-model:value="form.endTime"
                    :start="timeStartMorning"
                    :step="timePickerStep"
                    :end="timeEndAfternoon"
                    :min="minHourSelectValue"
                    name="endTime"
                    :isRequired="true"
                    :error="translateYupError(form.errors.endTime)"
                />
            </div>
        </div>
        <template #footer>
            <div class="row justify-content-center">
                <div
                    class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                >
                    <el-button @click="onClickClosePopup">
                        {{ $t('requestAbsence.list.title.cancel') }}
                    </el-button>
                </div>
                <div
                    class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                >
                    <el-button type="primary" @click="form.submit">
                        {{ $t('requestAbsence.list.title.submit') }}
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initData } from '@/modules/request-absence/composition/requestAbsenceForm';
import { Options, setup } from 'vue-class-component';
import TimeSelect from './TimeSelect.vue';
import { workingTimes } from '@/modules/timekeeping/contants';
import { mixins } from 'vue-property-decorator';
import moment from 'moment';
import { ISelectOptions } from '@/common/types';
import { checkUserHasPermission, parseLanguageSelectOptions } from '@/utils/helper';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { requestAbsenceModule } from '@/modules/request-absence/store';
import {
    RequestAbsenceType,
    ShiftOptions,
    TIME_PICKER_MINUTES_STEP,
} from '@/modules/request-absence/contants';
import { RequestAbsenceMixins } from '../mixins';

@Options({
    components: { TimeSelect },
})
export default class RequestAbsenceFormPopup extends mixins(RequestAbsenceMixins) {
    type = RequestAbsenceType;
    timeStartMorning = workingTimes.morning.startTime;
    timeEndAfternoon = workingTimes.afternoon.endTime;
    timePickerStep = TIME_PICKER_MINUTES_STEP;
    form = setup(() => initData());

    get isCanCreateAll(): boolean {
        return checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.CREATE}`,
        ]);
    }

    get minStartDate(): string | null {
        if (this.isCanCreateAll) {
            return null;
        }
        return moment().subtract(1, 'day').fmFullTimeString();
    }

    get maxStartDate(): string | null {
        if (this.form.endDate) {
            return moment(this.form.endDate as string)
                .add(1, 'd')
                .fmDayString();
        }
        return null;
    }

    get minEndDate(): string | null {
        if (this.form.startDate) {
            return moment(this.form.startDate as string)
                .subtract(1, 'd')
                .fmDayString();
        }
        if (this.isCanCreateAll) {
            return null;
        }
        return moment().subtract(1, 'day').fmFullTimeString();
    }

    get maxEndDate(): string | null {
        return null;
    }

    get minHourSelectValue(): string {
        if (
            this.form.startDate &&
            this.form.endDate &&
            this.form.startTime &&
            moment(this.form.startDate as string).fmDayString() ===
                moment(this.form.endDate as string).fmDayString()
        ) {
            return this.form.startTime as string;
        }
        return '';
    }

    get maxHourSelectValue(): string {
        if (
            this.form.startDate &&
            this.form.endDate &&
            this.form.endTime &&
            moment(this.form.startDate as string).fmDayString() ===
                moment(this.form.endDate as string).fmDayString()
        ) {
            return this.form.endTime as string;
        }
        return '';
    }

    get sessionDate(): ISelectOptions[] {
        return parseLanguageSelectOptions(ShiftOptions);
    }

    get isCreate(): boolean {
        return !requestAbsenceModule.selectedRequestAbsence.id;
    }

    get isShowAbsenceForm(): boolean {
        return requestAbsenceModule.isShowRequestAbsencePopupForm;
    }

    set isShowAbsenceForm(val: boolean) {
        requestAbsenceModule.setIsShowRequestAbsenceFormPopup(val);
    }

    async closedPopup(): Promise<void> {
        requestAbsenceModule.setSelectedRequestAbsenceId({});
        (this.form.resetForm as () => void)();
    }

    onClickClosePopup(): void {
        this.isShowAbsenceForm = false;
    }
}
</script>
<style scoped>
@media (max-width: 1199.98px) {
    :deep(.el-dialog) {
        width: 80%;
    }
}
.text-left {
    text-align: left;
}
.radio {
    display: flex !important;
    margin-top: 10px;
    margin-bottom: 15px;
}
.request-absence-form-popup {
    height: 50px;
}
</style>
