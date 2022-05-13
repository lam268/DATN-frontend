<template>
    <div class="calendar-container">
        <div class="header">
            <div class="heading-container">
                <h3 class="heading">{{ calendarTitle }}</h3>
            </div>
            <div class="date-picker">
                <BaseDatePicker
                    name="calendar_month"
                    class="month-picker"
                    :placeholder="$t('setting.holiday.placeholder.monthPicker')"
                    v-model:value="selectedMonthQuery"
                    type="month"
                    :dateFormat="DATE_TIME_FORMAT.YYYY_MM_HYPHEN"
                    @changeValue="onChangeSelectedMonthQuery"
                />
            </div>
        </div>
        <FullCalendar ref="calendar" :options="calendarOptions">
            <template v-slot:eventContent="arg">
                <div class="p-2">
                    <i class="content-holiday">{{ arg?.event?.title }}</i>
                    <p class="content-holiday">
                        {{ getHolidayDescription(+arg?.event?.id) }}
                    </p>
                </div>
            </template>
        </FullCalendar>
        <HolidayFormPopup @refresh-calendar="getHolidaysOfMonth" />
    </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import capitalize from 'lodash/capitalize';
import { settingHolidayModule } from '../../store/holiday.store';
import FullCalendar, {
    CalendarOptions,
    DateSelectArg,
    EventClickArg,
    LocaleSingularArg,
} from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import HolidayFormPopup from './HolidayFormPopup.vue';
import moment from 'moment';
import { IHoliday } from '../../type';
import {
    ArrowLeft as ArrowLeftIcon,
    ArrowRight as ArrowRightIcon,
    Delete as DeleteIcon,
} from '@element-plus/icons-vue';
import { calendarInitOptions } from '../../constant';
import { appModule } from '@/store/app';
import { settingHolidayApiService } from '../../services/settingService';
import { ElLoading } from 'element-plus';
import { checkUserHasPermission, showErrorNotificationFunction } from '@/utils/helper';
import { SupportLanguage } from '@/common/constants';
import { Watch, mixins } from 'vue-property-decorator';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { contractTypeModule } from '../../store/contractType.store';
import { SettingMixins } from '../../mixins';

interface CalendarApi extends Vue {
    // eslint-disable-next-line @typescript-eslint/ban-types
    getApi: Function;
}

@Options({
    components: {
        FullCalendar,
        HolidayFormPopup,
        ArrowLeftIcon,
        ArrowRightIcon,
        DeleteIcon,
    },
})
export default class Calendar extends mixins(SettingMixins) {
    selectedMonth = moment().fmDayString();
    selectedMonthQuery = moment().fmDayString();

    holidays: IHoliday[] = [];

    // define the function as a arrow function in a state to scope this.holidays to this class
    onClickDate = (selectedDate: DateSelectArg): void => {
        // eslint-disable-next-line no-unused-expressions
        selectedDate?.view?.calendar?.unselect();

        const existedHoliday = this.holidays.find((holiday) => {
            return (
                moment(holiday.date).startOf('day').fmDayString() ===
                moment(selectedDate.start).startOf('day').fmDayString()
            );
        });
        if (existedHoliday && this.isCanUpdate) {
            this.showUpdateHolidayFormPopup(existedHoliday);
            settingHolidayModule.setSelectedDate(
                moment(selectedDate.start).fmDayString(),
            );
        } else if (!existedHoliday && this.isCanUpdate) {
            settingHolidayModule.setSelectedDate(
                moment(selectedDate.start).fmDayString(),
            );
            settingHolidayModule.setIsShowHolidayFormPopup(true);
        }
    };

    onClickHoliday = (holiday: EventClickArg): void => {
        const selectedHoliday = this.getHolidayById(+holiday.event.id);
        if (selectedHoliday && this.isCanUpdate) {
            settingHolidayModule.setSelectedDate(selectedHoliday.date);
            this.showUpdateHolidayFormPopup(selectedHoliday);
        }
    };

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        events: [],
        select: this.onClickDate,
        eventClick: this.onClickHoliday,
        ...calendarInitOptions,
        locale: this.calendarLocale,
    };

    get isCanUpdate(): boolean {
        return checkUserHasPermission(contractTypeModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }

    get selectedLanguage(): string {
        return appModule.selectedLanguage;
    }

    get calendarLocale(): LocaleSingularArg | undefined {
        return this.selectedLanguage === SupportLanguage.VI ? viLocale : undefined;
    }

    get calendarTitle(): string {
        return capitalize(
            moment(this.selectedMonth)
                .locale(this.selectedLanguage)
                .fmMonthNameYearString(),
        );
    }

    created(): void {
        this.getHolidaysOfMonth();
    }

    async onChangeSelectedMonthQuery(): Promise<void> {
        if (this.selectedMonthQuery) {
            this.selectedMonth = this.selectedMonthQuery;
            const calendar = (this.$refs.calendar as CalendarApi).getApi();
            calendar.gotoDate(this.selectedMonthQuery);
            this.getHolidaysOfMonth();
        }
    }

    async showUpdateHolidayFormPopup(holiday: IHoliday): Promise<void> {
        settingHolidayModule.setSelectedHoliday(holiday);
        settingHolidayModule.setIsShowHolidayFormPopup(true);
    }

    getHolidayById(id: number): IHoliday | null {
        const holidayIndex = this.holidays.findIndex((holiday) => holiday.id === id);
        if (holidayIndex > -1) {
            return {
                ...this.holidays[holidayIndex],
                date: moment(this.holidays[holidayIndex].date).fmDayString(),
            };
        }
        return null;
    }

    getHolidayDescription(id: number): string {
        const holiday = this.getHolidayById(id);
        return holiday?.description || '';
    }

    async getHolidaysOfMonth(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = (await settingHolidayApiService.getList({
            startDate: moment(this.selectedMonth)
                .startOf('month')
                .utc()
                .fmFullTimeString(),
            endDate: moment(this.selectedMonth).endOf('month').utc().fmFullTimeString(),
        })) as IBodyResponse<IGetListResponse<IHoliday>>;
        loading.close();

        if (response.success) {
            this.holidays = response.data.items;
            this.calendarOptions.events = this.holidays.map((holiday) => ({
                id: holiday.id + '',
                title: holiday.title,
                start: moment(holiday.date).fmDayString() || '',
            }));
        } else {
            showErrorNotificationFunction(response.message as string);
            this.calendarOptions.events = [];
            this.holidays = [];
        }
    }

    @Watch('selectedLanguage')
    onChangeLanguage(): void {
        this.calendarOptions.locale = this.calendarLocale;
    }
}
</script>
<style scoped lang="scss">
.calendar-container {
    padding: 20px;
    .heading-container {
        display: flex;
        justify-content: center;
        .heading {
            margin: 0;
        }
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
:deep(.fc-event-main) {
    word-break: break-all;
    white-space: normal;
}
:deep(.fc .fc-popover) {
    z-index: map-get($map: $zIndex, $key: popoverCalendar);
}
.arrow-icon {
    height: 1em;
    width: 1em;
}
.month-picker {
    margin-bottom: 0;
}

.content-holiday {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.date-picker {
    right: 20px;
    position: absolute;
}

:deep(.fc-scroller-liquid-absolute) {
    overflow: hidden !important;
}
</style>
