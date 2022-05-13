<template>
    <div class="form-group position-relative">
        <label
            v-if="label"
            class="fw-bold text-start mb-2"
            :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <el-select
            v-model="timeData"
            class="time-select"
            :placeholder="placeholder"
            :readonly="isReadonly"
            :disabled="isDisabled"
            :name="name"
            clearable
        >
            <el-option
                v-for="time in timeOptions"
                :key="time.value"
                :label="time.label"
                :value="time.value"
                :disabled="time.disabled"
            />
        </el-select>
        <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { DATE_TIME_FORMAT } from '@/common/constants';
import moment from 'moment';
import { Model, Prop, Vue } from 'vue-property-decorator';
import { ITimeSelectOption } from '../types';

export default class TimeSelect extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: '' }) readonly start!: string;
    @Prop({ default: '' }) readonly step!: string;
    @Prop({ default: '' }) readonly end!: string;
    @Prop({ default: '' }) readonly min!: string;
    @Prop({ default: '' }) readonly max!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isRequired!: string;

    @Model('value', { type: [String, Number] })
    readonly timeData!: string;

    get timeOptions(): ITimeSelectOption[] {
        const startTime = moment(this.start, DATE_TIME_FORMAT.HH_MM_COLON);
        const endTime = moment(this.end, DATE_TIME_FORMAT.HH_MM_COLON);

        const result = [];
        while (startTime.isSameOrBefore(endTime)) {
            let disabled = false;
            if (this.min.length) {
                disabled =
                    disabled ||
                    startTime.isSameOrBefore(
                        moment(this.min, DATE_TIME_FORMAT.HH_MM_COLON),
                    );
            }
            if (this.max.length) {
                disabled =
                    disabled ||
                    startTime.isSameOrAfter(
                        moment(this.max, DATE_TIME_FORMAT.HH_MM_COLON),
                    );
            }
            result.push({
                label: startTime.fmHourMinuteString(),
                value: startTime.fmHourMinuteString(),
                disabled,
            });
            startTime.add(this.step, 'minute');
        }

        return result;
    }
}
</script>

<style scoped>
.form-group label {
    text-align: initial;
    width: 100%;
    font-weight: bold;
    margin-bottom: 6px;
}
.time-select {
    margin: 0;
    display: block;
}
.mark-required {
    color: red;
}
</style>
