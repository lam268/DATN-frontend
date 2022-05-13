import { IBodyResponse } from '@/common/types';
import { PermissionResources } from '@/modules/role/constants';
import store from '@/store';
import { appService } from '@/utils/app';
import { showErrorNotificationFunction } from '@/utils/helper';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { SettingKey } from '../constant';
import { generalSettingApiService } from '../services/settingService';
import { IGeneralSetting, IAppliedPosition } from '../type';

@Module({
    name: 'appliedPositionSetting',
    dynamic: true,
    namespaced: true,
    store,
})
class AppliedPositionSettingModule extends VuexModule {
    appliedPositionList: IAppliedPosition[] = [];

    // GETTER
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.SETTING);
    }

    @Action
    async getAppliedPositionList(): Promise<void> {
        const response = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.APPLIED_POSITION,
        });
        if (response?.success) {
            this.MUTATE_APPLIED_POSITION_LIST(response?.data?.values || []);
        } else {
            showErrorNotificationFunction(response?.message);
        }
    }

    @Action
    async saveAppliedPositionList(
        appliedPositionSetting: IGeneralSetting<IAppliedPosition>,
    ): Promise<IBodyResponse<IGeneralSetting<IAppliedPosition>>> {
        const response = (await generalSettingApiService.saveGeneralSetting(
            appliedPositionSetting,
        )) as IBodyResponse<IGeneralSetting<IAppliedPosition>>;

        if (response?.success) {
            this.MUTATE_APPLIED_POSITION_LIST(response?.data?.values || []);
        }
        return response;
    }

    @Mutation
    MUTATE_APPLIED_POSITION_LIST(appliedPositions: IAppliedPosition[]): void {
        this.appliedPositionList = appliedPositions;
    }
}

export const settingAppliedPositionModule = getModule(AppliedPositionSettingModule);
