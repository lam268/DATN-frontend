import { ElLoading } from 'element-plus';
import { SettingKey } from '../../constant';
import { IGeneralSetting, IAppliedPosition } from '../../type';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import { settingAppliedPositionModule } from '../../store/appliedPosition.store';

export const setupSaveAppliedPositionSetting = () => {
    const saveAppliedPositionList = async (appliedPosition: IAppliedPosition[]) => {
        const appliedPositionSetting = {
            key: SettingKey.APPLIED_POSITION,
            values: (appliedPosition || []).map((item) => {
                return {
                    code: item.code,
                    value: item.value,
                };
            }) as IAppliedPosition[],
        } as IGeneralSetting<IAppliedPosition>;

        const loading = ElLoading.service({});
        const response = await settingAppliedPositionModule.saveAppliedPositionList(
            appliedPositionSetting,
        );
        loading.close();
        if (response?.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'setting.appliedPosition.updatePosition.message.success',
                ) as string,
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
        return response?.success;
    };
    return { saveAppliedPositionList };
};
