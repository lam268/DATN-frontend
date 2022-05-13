import { IBodyResponse } from '@/common/types';
import { IAssetCategory } from '@/modules/asset/types';
import { PermissionResources } from '@/modules/role/constants';
import store from '@/store';
import { appService } from '@/utils/app';
import { showErrorNotificationFunction } from '@/utils/helper';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { SettingKey } from '../constant';
import { generalSettingApiService } from '../services/settingService';
import { IGeneralSetting, IUserPosition } from '../type';

@Module({
    name: 'assetCategorySetting',
    dynamic: true,
    namespaced: true,
    store,
})
class AssetCategorySettingModule extends VuexModule {
    assetCategoryList: IAssetCategory[] = [];

    // GETTER
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.SETTING);
    }

    @Action
    async getAssetCategoryList(): Promise<void> {
        const response = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.ASSET_CATEGORY,
        });
        if (response?.success) {
            this.MUTATE_ASSET_CATEGORY_LIST(
                (response?.data?.values as IUserPosition[]) || [],
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
    }

    @Action
    async saveAssetCategoryList(
        assetCategorySetting: IGeneralSetting<IAssetCategory>,
    ): Promise<IBodyResponse<IGeneralSetting<IUserPosition>>> {
        const response = (await generalSettingApiService.saveGeneralSetting(
            assetCategorySetting,
        )) as IBodyResponse<IGeneralSetting<IUserPosition>>;

        if (response?.success) {
            this.MUTATE_ASSET_CATEGORY_LIST(
                (response?.data?.values as IUserPosition[]) || [],
            );
        }
        return response;
    }

    @Mutation
    MUTATE_ASSET_CATEGORY_LIST(assetCategory: IAssetCategory[]): void {
        this.assetCategoryList = assetCategory;
    }
}

export const settingAssetCategoryModule = getModule(AssetCategorySettingModule);
