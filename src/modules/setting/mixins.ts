import { mixins } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import { MessageBoxData } from 'element-plus';
import i18n from '@/plugins/vue-i18n';
import { checkUserHasPermission } from '@/utils/helper';
import { PermissionResources, PermissionActions } from '../role/constants';
import { settingAssetCategoryModule } from './store/assetCategory.store';
import { DATE_TIME_FORMAT, SupportLanguage } from '@/common/constants';
import {
    MAX_APPLIED_POSITION_COUNT,
    MAX_ASSET_CATEORY_COUNT,
    MAX_USER_POSITION_COUNT,
} from './constant';

export class SettingMixins extends mixins(UtilMixins) {
    supportLanguage: SupportLanguage[] = [];
    isNotSaveAfterChangeData = false;
    MAX_APPLIED_POSITION_COUNT = MAX_APPLIED_POSITION_COUNT;
    MAX_ASSET_CATEORY_COUNT = MAX_ASSET_CATEORY_COUNT;
    MAX_USER_POSITION_COUNT = MAX_USER_POSITION_COUNT;
    DATE_TIME_FORMAT = DATE_TIME_FORMAT;
    get isCanUpdate(): boolean {
        return checkUserHasPermission(settingAssetCategoryModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }

    async showWarningBeforeLeavePage(): Promise<void | MessageBoxData> {
        return await this.showConfirmPopup(
            i18n.global.t('setting.setting.leavePage.message') as string,
            i18n.global.t('setting.setting.leavePage.title') as string,
            {
                distinguishCancelAndClose: true,
                confirmButtonText: i18n.global.t('common.app.confirmSaveBox.save'),
                cancelButtonText: i18n.global.t('common.app.confirmSaveBox.dontSave'),
            },
        );
    }
}
