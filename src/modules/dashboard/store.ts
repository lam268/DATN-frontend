import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import { dashboardService } from './services/api.services';
import {
    ITimekeepingDashboard,
    ITimekeepingDashboardQueryString,
    ITimekeepingDashboardResponse,
} from './types';
import store from '@/store';
import { showErrorNotificationFunction } from '@/utils/helper';

const initTimekeepingDashboard: ITimekeepingDashboard = {
    workingHoursNeeded: null,
    leaveHours: null,
    paidLeaveHoursLeft: null,
    paidLeaveHoursUsed: null,
    unpaidLeaveHours: null,
    authorizedLeaveHoursOfMonth: null,
    workingHours: null,
    lastYearRemainingPaidLeaveHours: null,
};

@Module({ dynamic: true, namespaced: true, store, name: 'dashboard' })
class DashboardModule extends VuexModule {
    timekeepingInfo: ITimekeepingDashboard = { ...initTimekeepingDashboard };
    timekeepingMonth = new Date().toDateString();
    eventCount = 0;
    assetCount = 0;
    dashboardTimekeepingQueryString: ITimekeepingDashboardQueryString = {
        startDate: '',
        endDate: '',
    };
    // GETTERS

    // actions
    @Action
    async getTimekeepingInfo(): Promise<void> {
        const timekeepingInfo =
            await dashboardService.getTimekeepingInfo<ITimekeepingDashboardResponse>(
                this.dashboardTimekeepingQueryString,
            );
        if (timekeepingInfo.success) {
            this.MUTATE_TIMEKEEPING_INFO(timekeepingInfo.data);
        } else {
            showErrorNotificationFunction(timekeepingInfo.message);
            this.MUTATE_TIMEKEEPING_INFO({ ...initTimekeepingDashboard });
        }
    }

    @Action
    setDashboardTimekeepingQueryString(query: ITimekeepingDashboardQueryString) {
        this.MUTATE_DASHBOARD_TIMEKEEPING_QUERY_STRING(query);
    }

    @Action
    setAssetCount(assetCount: number) {
        this.MUTATE_ASSET_COUNT(assetCount);
    }

    @Action
    setEventCount(eventCount: number) {
        this.MUTATE_EVENT_COUNT(eventCount);
    }

    // MUTATIONS
    @Mutation
    MUTATE_TIMEKEEPING_INFO(timekeepingInfo: ITimekeepingDashboard) {
        this.timekeepingInfo = { ...timekeepingInfo };
    }

    @Mutation
    MUTATE_DASHBOARD_TIMEKEEPING_QUERY_STRING(query: ITimekeepingDashboardQueryString) {
        this.dashboardTimekeepingQueryString = {
            ...this.dashboardTimekeepingQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_ASSET_COUNT(assetCount: number) {
        this.assetCount = assetCount;
    }

    @Mutation
    MUTATE_EVENT_COUNT(eventCount: number) {
        this.eventCount = eventCount;
    }
}

export const dashboardModule = getModule(DashboardModule);
