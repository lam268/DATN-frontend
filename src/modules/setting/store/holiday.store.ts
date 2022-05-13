import { PermissionResources } from '@/modules/role/constants';
import store from '@/store';
import { appService } from '@/utils/app';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { initialSelectedHoliday } from '../constant';
import { IHoliday } from '../type';

@Module({ dynamic: true, namespaced: true, store, name: 'holidaySetting' })
class SettingHolidayModule extends VuexModule {
    isShowHolidayFormPopup = false;
    selectedDate = '';
    selectedHoliday: IHoliday = initialSelectedHoliday;

    // GETTER
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.SETTING);
    }

    @Action
    setIsShowHolidayFormPopup(value: boolean): void {
        this.MUTATE_IS_SHOW_HOLIDAY_FORM_POPUP(value);
    }

    @Action
    setSelectedDate(value: string): void {
        this.MUTATE_SELECTED_DATE(value);
    }

    @Action
    setSelectedHoliday(value: IHoliday): void {
        this.MUTATE_SELECTED_HOLIDAY(value);
    }

    @Action
    resetSelectedHoliday(): void {
        this.MUTATE_SELECTED_HOLIDAY(initialSelectedHoliday);
    }

    @Mutation
    MUTATE_IS_SHOW_HOLIDAY_FORM_POPUP(value: boolean): void {
        this.isShowHolidayFormPopup = value;
    }

    @Mutation
    MUTATE_SELECTED_DATE(value: string): void {
        this.selectedDate = value;
    }

    @Mutation
    MUTATE_SELECTED_HOLIDAY(value: IHoliday): void {
        this.selectedHoliday = value;
    }
}

export const settingHolidayModule = getModule(SettingHolidayModule);
