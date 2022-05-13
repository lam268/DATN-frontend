import { ElLoading } from 'element-plus';
import { SettingKey } from '../../constant';
import { settingUserPositionModule } from '../../store/userPosition.store';
import { IGeneralSetting, IUserPosition } from '../../type';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';

export const setupSaveUserPositionSetting = () => {
    const saveUserPositionList = async (userPositions: IUserPosition[]) => {
        const userPositionSetting = {
            key: SettingKey.USER_POSITION,
            values: (userPositions || []).map((item) => {
                return {
                    code: item.code,
                    value: item.value,
                };
            }) as IUserPosition[],
        } as IGeneralSetting<IUserPosition>;

        const loading = ElLoading.service({});
        const response = await settingUserPositionModule.saveUserPositionList(
            userPositionSetting,
        );
        loading.close();
        if (response?.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'setting.userPosition.updatePosition.message.success',
                ) as string,
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
        return response?.success;
    };
    return { saveUserPositionList };
};
