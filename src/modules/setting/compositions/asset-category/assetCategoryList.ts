import { ElLoading } from 'element-plus';
import { SettingKey } from '../../constant';
import { IGeneralSetting } from '../../type';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import { IAssetCategory } from '@/modules/asset/types';
import { settingAssetCategoryModule } from '../../store/assetCategory.store';

export const setupSaveAssetCategorySetting = () => {
    const saveAssetCategoryList = async (assetCategories: IAssetCategory[]) => {
        const assetCategorySetting = {
            key: SettingKey.ASSET_CATEGORY,
            values: (assetCategories || []).map((item) => {
                return {
                    code: item.code,
                    value: item.value,
                };
            }) as IAssetCategory[],
        } as IGeneralSetting<IAssetCategory>;

        const loading = ElLoading.service({});
        const response = await settingAssetCategoryModule.saveAssetCategoryList(
            assetCategorySetting,
        );
        loading.close();
        if (response?.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'setting.assetCategory.updateCategory.message.success',
                ) as string,
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
        return response?.success;
    };
    return { saveAssetCategoryList };
};
