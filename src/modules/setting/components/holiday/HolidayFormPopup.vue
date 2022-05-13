<template>
    <el-dialog
        width="50%"
        v-model="isShowHolidayFormPopup"
        @open="form.openPopup"
        @closed="onClosedPopup"
        custom-class="holiday-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    isCreate
                        ? $t('setting.holiday.popup.title.create')
                        : $t('setting.holiday.popup.title.update')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-12">
                <BaseInputText
                    v-model:value="form.title"
                    :label="$t('setting.holiday.popup.form.title.label')"
                    :placeholder="$t('setting.holiday.popup.form.title.placeholder')"
                    name="title"
                    :isRequired="true"
                    :error="translateYupError(form.errors.title)"
                />
            </div>
            <div class="col-md-12">
                <BaseDatePicker
                    v-model:value="form.date"
                    :label="$t('setting.holiday.popup.form.date.label')"
                    :placeholder="$t('setting.holiday.popup.form.date.placeholder')"
                    name="date"
                    :isRequired="true"
                    :minDate="DEFAULT_MIN_DATE"
                    :error="translateYupError(form.errors.date)"
                />
            </div>
            <div class="col-md-12">
                <BaseInputText
                    v-model:value="form.description"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    :label="$t('setting.holiday.popup.form.description.label')"
                    :placeholder="
                        $t('setting.holiday.popup.form.description.placeholder')
                    "
                    name="description"
                    :isRequired="true"
                    :error="translateYupError(form.errors.description)"
                />
            </div>
        </div>
        <template #footer>
            <div class="d-flex justify-content-center footer">
                <el-button @click="onClickCancel">
                    {{ $t('setting.holiday.popup.cancel') }}
                </el-button>
                <el-button type="danger" @click="onClickDeleteHoliday" v-if="!isCreate">
                    {{ $t('setting.holiday.popup.delete') }}
                </el-button>
                <el-button type="primary" @click="onSubmit">
                    {{ $t('setting.holiday.popup.submit') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initForm } from '../../compositions/holiday/holidayForm';
import { Options, setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { settingHolidayModule } from '../../store/holiday.store';
import { UtilMixins } from '@/mixins/utilMixins';
import { initialSelectedHoliday } from '../../constant';
import { HttpStatus } from '@/common/constants';

@Options({
    components: {},
})
export default class HolidayFormPopup extends mixins(UtilMixins) {
    form = setup(() => initForm());

    get isCreate(): boolean {
        return !settingHolidayModule.selectedHoliday?.id;
    }

    get isShowHolidayFormPopup(): boolean {
        return settingHolidayModule.isShowHolidayFormPopup;
    }

    set isShowHolidayFormPopup(val: boolean) {
        settingHolidayModule.setIsShowHolidayFormPopup(val);
    }

    onClickCancel(): void {
        this.isShowHolidayFormPopup = false;
    }

    onClosedPopup(): void {
        this.isShowHolidayFormPopup = false;
        settingHolidayModule.setSelectedHoliday(initialSelectedHoliday);
        settingHolidayModule.setSelectedDate('');
        (this.form.resetForm as () => void)();
    }

    async onSubmit(): Promise<void> {
        const responseCode = await (this.form.onSubmit as () => number)();
        if (
            responseCode === HttpStatus.OK ||
            responseCode === HttpStatus.ITEM_NOT_FOUND
        ) {
            settingHolidayModule.setIsShowHolidayFormPopup(false);
            this.$emit('refresh-calendar');
        }
    }

    async onClickDeleteHoliday(): Promise<void> {
        const responseCode = await (this.form.onDelete as () => number | boolean)();
        if (
            responseCode &&
            (responseCode === HttpStatus.OK || responseCode === HttpStatus.ITEM_NOT_FOUND)
        ) {
            settingHolidayModule.setIsShowHolidayFormPopup(false);
            this.$emit('refresh-calendar');
        }
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
</style>
