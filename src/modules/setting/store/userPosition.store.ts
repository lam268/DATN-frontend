import { IBodyResponse } from '@/common/types';
import { PermissionResources } from '@/modules/role/constants';
import store from '@/store';
import { appService } from '@/utils/app';
import { showErrorNotificationFunction } from '@/utils/helper';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { SettingKey } from '../constant';
import { generalSettingApiService } from '../services/settingService';
import { IGeneralSetting, IUserPosition } from '../type';

@Module({
    name: 'userPositionSetting',
    dynamic: true,
    namespaced: true,
    store,
})
class UserPositionSettingModule extends VuexModule {
    userPositionList: IUserPosition[] = [];

    // GETTER
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.SETTING);
    }

    @Action
    async getUserPositionList(): Promise<void> {
        const response = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.USER_POSITION,
        });
        if (response?.success) {
            this.MUTATE_USER_POSITION_LIST(
                (response?.data?.values as IUserPosition[]) || [],
            );
        } else {
            showErrorNotificationFunction(response?.message);
        }
    }

    @Action
    async saveUserPositionList(
        userPositionSetting: IGeneralSetting<IUserPosition>,
    ): Promise<IBodyResponse<IGeneralSetting<IUserPosition>>> {
        const response = (await generalSettingApiService.saveGeneralSetting(
            userPositionSetting,
        )) as IBodyResponse<IGeneralSetting<IUserPosition>>;

        if (response?.success) {
            this.MUTATE_USER_POSITION_LIST(
                (response?.data?.values as IUserPosition[]) || [],
            );
        }
        return response;
    }

    @Mutation
    MUTATE_USER_POSITION_LIST(userPositions: IUserPosition[]): void {
        this.userPositionList = userPositions;
    }
}

export const settingUserPositionModule = getModule(UserPositionSettingModule);
