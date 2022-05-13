import { IBodyResponse } from '@/common/types';
import store from '@/store';
import { showErrorNotificationFunction } from '@/utils/helper';
import moment from 'moment-timezone';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { SettingKey } from '../constant';
import { generalSettingApiService } from '../services/settingService';
import { IGeneralSetting, IResetPaidLeaveDaysSchedule } from '../type';

@Module({
    name: 'paidLeaveDaysSetting',
    dynamic: true,
    namespaced: true,
    store,
})
class PaidLeaveDaysSettingModule extends VuexModule {
    paidLeaveDaysList: IResetPaidLeaveDaysSchedule[] = [];

    @Action
    async getResetScheduleList(): Promise<void> {
        const response = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.PAID_LEAVE_DAYS_RESET_SCHEDULE,
        });
        const paidLeaveDaysSchedule: IResetPaidLeaveDaysSchedule[] = [];
        const responseDate = response?.data.values;
        if (response?.success) {
            for (const property in responseDate) {
                paidLeaveDaysSchedule.push({
                    year: property,
                    resetDate: responseDate[property] as unknown as string,
                });
            }
            this.MUTATE_PAID_LEAVE_DAYS_SCHEDULE_LIST(
                (paidLeaveDaysSchedule as IResetPaidLeaveDaysSchedule[]) || [],
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
    }

    @Action
    async saveResetPaidLeaveDaysScheduleList(
        paidLeaveDaysSchedule: IGeneralSetting<string>,
    ): Promise<IBodyResponse<IResetPaidLeaveDaysSchedule>> {
        const response = (await generalSettingApiService.saveGeneralSetting(
            paidLeaveDaysSchedule,
        )) as IBodyResponse<IResetPaidLeaveDaysSchedule>;
        const newPaidLeaveDaysSchedule: IResetPaidLeaveDaysSchedule[] =
            paidLeaveDaysSchedule.values.map((item) => ({
                year: moment(item).year().toString(),
                resetDate: item,
            }));
        if (response?.success) {
            this.MUTATE_PAID_LEAVE_DAYS_SCHEDULE_LIST(
                (newPaidLeaveDaysSchedule as IResetPaidLeaveDaysSchedule[]) || [],
            );
        }
        return response;
    }

    @Mutation
    MUTATE_PAID_LEAVE_DAYS_SCHEDULE_LIST(
        paidLeaveDaysSchedule: IResetPaidLeaveDaysSchedule[],
    ): void {
        this.paidLeaveDaysList = paidLeaveDaysSchedule;
    }
}

export const settingPaidLeaveDaysModule = getModule(PaidLeaveDaysSettingModule);
