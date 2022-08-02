<template>
    <div class="row">
        <div class="col-md-12 mb-3">
            <div class="date-picker">
                <BaseDatePicker
                    name="timekeeping month"
                    :placeholder="
                        $t('dashboard.dashboard.placeholder.timekeepingMonthPicker')
                    "
                    v-model:value="timekeepingMonth"
                    :max-date="maxDate"
                    type="month"
                    @changeValue="changeTimekeepingMonth"
                    dateFormat="YYYY-MM"
                />
            </div>
        </div>
        <div class="col-md-3 timekeeping-card-container">
            <div class="timekeeping-info">
                <div class="icon-container working-hour">
                    <ClockIcon class="icon" />
                </div>
                <div class="detail">
                    <h5 class="card-title">
                        {{ $t('dashboard.dashboard.timekeepingInfo.workingHours') }}
                    </h5>
                    <span>{{ workingHours }}/{{ workingHoursNeeded }}</span>
                </div>
            </div>
        </div>
        <div class="col-md-3 timekeeping-card-container">
            <div class="timekeeping-info">
                <div class="icon-container paid-leave">
                    <MoneyIcon class="icon" />
                </div>
                <div class="detail">
                    <h5 class="card-title">
                        {{ $t('dashboard.dashboard.timekeepingInfo.paidTimeOff') }}
                    </h5>
                    <span> {{ paidLeaveHoursUsed }}</span>
                </div>
            </div>
        </div>
        <div class="col-md-3 timekeeping-card-container">
            <div class="timekeeping-info">
                <div class="icon-container unpaid-leave">
                    <WarningIcon class="icon" />
                </div>
                <div class="detail">
                    <h5 class="card-title">
                        {{ $t('dashboard.dashboard.timekeepingInfo.unpaidTimeOff') }}
                    </h5>
                    <span>{{ unpaidLeaveHours }}</span>
                </div>
            </div>
        </div>
        <div class="col-md-3 timekeeping-card-container">
            <div class="timekeeping-info">
                <div class="icon-container anual-hour">
                    <CalendarIcon class="icon" />
                </div>
                <div class="detail">
                    <h5 class="card-title">
                        {{
                            $t(
                                'dashboard.dashboard.timekeepingInfo.annualLeaveHoursThisYear',
                            )
                        }}
                    </h5>
                    <span>{{ paidLeaveHoursLeft }}</span>
                </div>
                <span class="remaining-hours-last-year">
                    {{
                        $t(
                            'dashboard.dashboard.timekeepingInfo.annualLeaveHoursLastYear',
                        )
                    }}: {{ lastYearRemainingPaidLeaveHours }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { dashboardModule } from '../store';
import moment from 'moment';
import {
    Clock as ClockIcon,
    Money as MoneyIcon,
    Warning as WarningIcon,
    Calendar as CalendarIcon,
} from '@element-plus/icons-vue';
@Options({
    components: {
        ClockIcon,
        MoneyIcon,
        WarningIcon,
        CalendarIcon,
    },
})
export default class TimekeepingInfo extends Vue {
    timekeepingMonth = moment().startOf('month').fmDayString();
    maxDate = new Date();

    get workingHoursNeeded(): number {
        return dashboardModule.timekeepingInfo?.workingHoursNeeded || 0;
    }

    get paidLeaveHoursUsed(): number {
        return dashboardModule.timekeepingInfo?.paidLeaveHoursUsed || 0;
    }

    get unpaidLeaveHours(): number {
        return dashboardModule.timekeepingInfo?.unpaidLeaveHours || 0;
    }

    get workingHours(): number {
        return dashboardModule.timekeepingInfo?.workingHours || 0;
    }

    get lastYearRemainingPaidLeaveHours(): number {
        return dashboardModule.timekeepingInfo?.lastYearRemainingPaidLeaveHours || 0;
    }

    get paidLeaveHoursLeft(): number {
        return dashboardModule.timekeepingInfo?.paidLeaveHoursLeft || 0;
    }

    async changeTimekeepingMonth(): Promise<void> {
        if (this.timekeepingMonth) {
            const startDate = moment(this.timekeepingMonth)
                .startOf('month')
                .utc()
                .fmFullTimeString();
            const endDate = moment(this.timekeepingMonth)
                .endOf('month')
                .utc()
                .fmFullTimeString();
            dashboardModule.setDashboardTimekeepingQueryString({ startDate, endDate });
            await dashboardModule.getTimekeepingInfo();
        }
    }
}
</script>

<style lang="scss" scoped>
.timekeeping-info {
    padding: 20px 12px;
    border-radius: 10px;
    position: relative;
    display: flex;
    gap: 10px;
    text-align: left;
    background-color: $--color-gray-200;
    border: 1px solid rgba(0, 0, 0, 0.05);
    align-items: center;
    .icon-container {
        padding: 5px;
        border-radius: 10px;
        .icon {
            width: 32px;
            height: 32px;
        }
    }
    .detail {
        h5 {
            font-weight: 600;
        }
        span {
            font-weight: 500;
        }
    }
    @media only screen and (max-width: 1399.99px) {
        padding: 30px 12px;
    }
}
.working-hour {
    background-color: #e0e8f3;
    color: #1a55af;
}
.unpaid-leave {
    background-color: #fbece7;
    color: #fa5f1c;
}
.paid-leave {
    background-color: #ecf2e6;
    color: #427a0a;
}
.anual-hour {
    background-color: #eeecf9;
    color: #5843be;
}
:deep(.date-picker) {
    display: flex;
    .form-group {
        margin-bottom: 5px;
    }
}
.remaining-hours-last-year {
    font-size: 11px;
    position: absolute;
    bottom: 2px;
    left: 62px;
    font-weight: 500;
    @media screen and (max-width: 1150px) {
        bottom: 10px;
    }
}
.timekeeping-card-container {
    padding-left: 10px !important;
    padding-right: 10px !important;
    @media screen and (max-width: 1150px) {
        margin-bottom: 15px;
    }
}
</style>
