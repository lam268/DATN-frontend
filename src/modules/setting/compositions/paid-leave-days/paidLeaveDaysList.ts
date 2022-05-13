import { ElLoading } from 'element-plus';
import { SettingKey } from '../../constant';
import { IGeneralSetting, IResetPaidLeaveDaysSchedule } from '../../type';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import { settingPaidLeaveDaysModule } from '../../store/paidLeaveDays.store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setupSaveResetPaidLeaveDaysSchedulesSetting = () => {
    const saveResetPaidLeaveDaysSchedulesList = async (
        paidLeaveDays: IResetPaidLeaveDaysSchedule[],
    ) => {
        const paidLeaveDaySetting = {
            key: SettingKey.PAID_LEAVE_DAYS_RESET_SCHEDULE,
            values: (paidLeaveDays || []).map((item) => {
                return item.resetDate;
            }),
        } as IGeneralSetting<string>;
        const loading = ElLoading.service({});
        const response =
            await settingPaidLeaveDaysModule.saveResetPaidLeaveDaysScheduleList(
                paidLeaveDaySetting,
            );
        loading.close();
        if (response?.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'setting.paidLeaveDays.savePaidLeaveDaysSchedule.message.success',
                ) as string,
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
        return response?.success;
    };
    return { saveResetPaidLeaveDaysSchedulesList };
};
