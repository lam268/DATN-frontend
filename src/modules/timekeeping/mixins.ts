import { UtilMixins } from '@/mixins/utilMixins';
import i18n from '@/plugins/vue-i18n';
import { appService } from '@/utils/app';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import { mixins } from 'vue-property-decorator';
import { PermissionActions, PermissionResources } from '../role/constants';
import {
    hourDecimalPrecision,
    RequestAbsenceType,
    TimekeepingType,
    MINUTES_PER_HOUR,
    TimekeepingColors,
    workingTimes,
    PaidLeaveHourType,
    TIMEKEEPING_TAB,
} from './contants';
import { DATE_TIME_FORMAT } from '@/common/constants';
import {
    IColumnTable,
    IUserTimeKeeping,
    IRowTable,
    ITimekeeping,
    ICellColumn,
} from './types';
import { timeKeepingModule } from './store';
import { checkUserHasPermission, isWeekend } from '@/utils/helper';
import { IHoliday } from '../setting/type';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';

export class TimeKeepingMixins extends mixins(UtilMixins) {
    timekeepingOptions = TIMEKEEPING_TAB;

    get timeKeepingList(): IUserTimeKeeping[] {
        const result = timeKeepingModule.timeKeepingList.map((userTimekeeping) => {
            const clonedUserTimekeeping = cloneDeep(userTimekeeping);
            let totalPaidLeaveHoursAvailable =
                clonedUserTimekeeping.paidLeaveHourThisMonth;
            forEach(userTimekeeping.timekeepings, (timekeeping, date) => {
                const absenceTime = this.convertMinuteToHour(
                    timekeeping.authorizedLeaveHours,
                );
                if (absenceTime > totalPaidLeaveHoursAvailable) {
                    clonedUserTimekeeping.timekeepings[date].hasEnoughPaidLeaveHours =
                        false;
                } else {
                    clonedUserTimekeeping.timekeepings[date].hasEnoughPaidLeaveHours =
                        true;
                }
                totalPaidLeaveHoursAvailable -= absenceTime;
            });

            return clonedUserTimekeeping;
        });

        return result;
    }

    get holidayList(): IHoliday[] {
        return timeKeepingModule.holidayList;
    }

    get holidayMapDateToTitle(): Map<string, string> {
        return this.holidayList.reduce((mapped, holiday) => {
            mapped.set(moment(holiday.date).fmDayString(), holiday.title);
            return mapped;
        }, new Map<string, string>());
    }

    get minTimeKeepingDate(): string | null {
        if (
            checkUserHasPermission(timeKeepingModule.userPermissions, [
                `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
            ])
        ) {
            return null;
        }
        return moment().fmDayString();
    }

    get isCanCreate(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
        ]);
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.UPDATE}`,
        ]);
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.DELETE}`,
        ]);
    }

    getCellColor(date: string, timekeeping: ITimekeeping): string {
        if (this.getHolidayTitleFromDate(date)) {
            return TimekeepingColors[RequestAbsenceType.HOLIDAY];
        }
        if (isWeekend(date)) {
            return TimekeepingColors[RequestAbsenceType.WEEKEND];
        }
        // if user work all day
        const timekeepingType = this.getTimekeepingType(timekeeping);
        if (
            timekeepingType === TimekeepingType.ALL_DAY ||
            timekeepingType === TimekeepingType.NOT_CHECKOUT
        ) {
            return TimekeepingColors[timekeepingType];
        }

        // check if user asked to absence
        if (!timekeeping.requestAbsences.length) {
            return TimekeepingColors[timekeepingType][RequestAbsenceType.NOT_AVAILABLE];
        }

        const hasEnoughPaidLeaveHour: PaidLeaveHourType =
            timekeeping.hasEnoughPaidLeaveHours
                ? PaidLeaveHourType.HAS_ANUAL_PAID_LEAVE_HOURS
                : PaidLeaveHourType.INSUFFICIENT_ANUAL_PAID_LEAVE_HOURS;

        return TimekeepingColors[timekeepingType][hasEnoughPaidLeaveHour];
    }

    getCellStyle(data: ICellColumn): Record<string, unknown> | void {
        const date = data?.column.rawColumnKey;
        if (data?.column.property !== 'fullName' && data.row?.timekeepings?.[date]) {
            const backgroundColor = this.getCellColor(date, data.row.timekeepings[date]);
            let textColor = null;

            if (
                !isWeekend(date) &&
                backgroundColor !== TimekeepingColors[TimekeepingType.ALL_DAY]
            ) {
                textColor = '#ffffff';
            }
            return {
                backgroundColor: this.getCellColor(date, data.row.timekeepings[date]),
                color: textColor,
            };
        }
    }

    getHolidayTitleFromDate(date: string): string | undefined {
        return this.holidayMapDateToTitle.get(moment(date).fmDayString());
    }

    generateTooltip(timekeeping: ITimekeeping): string {
        if (!timekeeping) {
            return i18n.global.t('timekeeping.list.timeLine.noData');
        }
        let holidayTooltip = '';
        let hasData = false;
        const holidayTitle = this.getHolidayTitleFromDate(timekeeping.scanAt);
        if (holidayTitle) {
            holidayTooltip = `<p>${holidayTitle}</p>`;
            hasData = true;
        }
        const checkIn = timekeeping?.checkIn
            ? `${i18n.global.t('timekeeping.list.timeLine.checkIn')}: ${moment(
                  timekeeping?.checkIn,
              )
                  .add(7, 'hours')
                  .fmHourMinuteString()} - `
            : '';
        const checkOut = timekeeping?.checkOut
            ? `${i18n.global.t('timekeeping.list.timeLine.checkOut')}: ${moment(
                  timekeeping?.checkOut,
              )
                  .add(7, 'hours')
                  .fmHourMinuteString()}`
            : '';

        if (checkIn.length || checkOut.length) {
            hasData = true;
        }

        const absences: string[] = timekeeping.requestAbsences.reduce(
            (totalAbsence, currentAbsence) => {
                hasData = true;
                return [
                    ...totalAbsence,
                    `<p>${i18n.global.t('timekeeping.list.timeLine.from')}:  ${moment(
                        currentAbsence.startAt,
                    ).fmHourMinuteString()} - ${i18n.global.t(
                        'timekeeping.list.timeLine.to',
                    )}: ${moment(currentAbsence.endAt).fmHourMinuteString()}</p>`,
                ];
            },
            [] as string[],
        );

        if (!hasData) {
            return i18n.global.t('timekeeping.list.timeLine.noData');
        }

        const timekeepingText =
            checkIn.length || checkOut.length ? `<p> ${checkIn} ${checkOut} </p>` : '';
        return `${holidayTooltip} ${timekeepingText} ${absences.join(' ')}`;
    }

    generateMonthHeader(items: IUserTimeKeeping[]): string {
        const arrMonth = Object.keys(
            (items[0]?.timekeepings as Record<string, unknown>) || {},
        );
        return capitalize(
            moment(arrMonth[0]).locale(appService.getLang()).fmMonthNameYearString(),
        );
    }

    onClickCell(row: IRowTable, column: IColumnTable): void {
        if (
            row?.timekeepings[column?.rawColumnKey]?.checkIn ||
            row?.timekeepings[column?.rawColumnKey]?.checkOut
        ) {
            if (this.isCanUpdate || this.isCanDelete) {
                timeKeepingModule.setTimeKeepingForm({
                    userId: row?.id,
                    dateTime: column?.rawColumnKey,
                    id: row?.timekeepings[column?.rawColumnKey].id,
                    timekeeping: {
                        ...row?.timekeepings[column?.rawColumnKey],
                    },
                });
                timeKeepingModule.setIsShowTimeKeepingForm(true);
            }
        } else if (this.isCanCreate) {
            timeKeepingModule.setTimeKeepingForm({
                userId: row?.id,
                dateTime: column?.rawColumnKey,
            });
            timeKeepingModule.setIsShowTimeKeepingForm(true);
        }
    }

    isWorkFullDay(timekeeping: ITimekeeping): boolean {
        return (
            !!timekeeping?.checkIn &&
            !!timekeeping?.checkOut &&
            !timekeeping.requestAbsences.length &&
            moment(
                moment(timekeeping?.checkIn).add(7, 'hours').fmHourMinuteString(),
                DATE_TIME_FORMAT.HH_MM_COLON,
            ).isSameOrBefore(
                moment(workingTimes.morning.startTime, DATE_TIME_FORMAT.HH_MM_COLON),
            ) &&
            moment(
                moment(timekeeping?.checkOut).add(7, 'hours').fmHourMinuteString(),
                DATE_TIME_FORMAT.HH_MM_COLON,
            ).isSameOrAfter(
                moment(workingTimes.afternoon.endTime, DATE_TIME_FORMAT.HH_MM_COLON),
            )
        );
    }

    getTimekeepingType(timekeeping: ITimekeeping): TimekeepingType {
        if (this.isWorkFullDay(timekeeping)) {
            return TimekeepingType.ALL_DAY;
        } else if (timekeeping?.checkIn && timekeeping?.checkOut) {
            return TimekeepingType.PARTIAL_DAY;
        } else if (timekeeping?.checkIn && !timekeeping?.checkOut) {
            return TimekeepingType.NOT_CHECKOUT;
        } else {
            return TimekeepingType.NOT_AVAILABLE;
        }
    }

    shouldDisplayTooltip(timekeeping: ITimekeeping | undefined): boolean {
        if (!timekeeping) {
            return false;
        }
        return (
            !!timekeeping?.checkIn ||
            !!timekeeping?.checkOut ||
            !!timekeeping?.requestAbsences?.length ||
            !!this.getHolidayTitleFromDate(moment(timekeeping?.scanAt).fmDayString())
        );
    }

    /**
     * Convert minute to hour
     * @param minutes amount of minute, for example: 130
     * @returns {number} amount of hour, for example: 2.2
     */
    convertMinuteToHour(minutes: number): number {
        return +(minutes / MINUTES_PER_HOUR).toFixed(hourDecimalPrecision);
    }
}
