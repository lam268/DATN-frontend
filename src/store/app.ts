import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import store from './index';
import { appService } from '@/utils/app';
import { SupportLanguage } from '@/common/constants';

@Module({ dynamic: true, namespaced: true, store, name: 'app' })
class AppModule extends VuexModule {
    isShowMobileSidebar = false;
    isShowNetworkError = false;
    selectedLanguage = appService.getLang();

    @Action
    toggleMobileSidebar(): void {
        this.SET_IS_SHOW_MOBILE_SIDEBAR(!this.isShowMobileSidebar);
    }

    @Action
    setLanguage(lang: SupportLanguage): void {
        this.SET_LANGUAGE(lang);
    }
    // GETTERS

    @Mutation
    SET_IS_SHOW_MOBILE_SIDEBAR(value: boolean): void {
        this.isShowMobileSidebar = value;
    }

    @Mutation
    SET_SHOW_NETWORK_ERROR(value: boolean): void {
        this.isShowNetworkError = value;
    }

    @Mutation
    SET_LANGUAGE(lang: SupportLanguage): void {
        this.selectedLanguage = lang;
    }
}

export const appModule = getModule(AppModule);
