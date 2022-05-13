import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import { dashboardService } from './services/api.services';
import {
    ITimekeepingDashboard,
    ITimekeepingDashboardQueryString,
    ITimekeepingDashboardResponse,
} from './types';
import store from '@/store';
import { showErrorNotificationFunction } from '@/utils/helper';
import { IEvent } from '../event/types';
import { eventService } from '../event/services/api.service';
import moment from 'moment';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { IAsset } from '../asset/types';
import { assetService } from '../asset/services/asset-api.services';
import { ASSET_PAGE_LIMIT, EVENT_PAGE_LIMIT } from './constant';
import { appService } from '@/utils/app';

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
    upcomingEvents: IEvent[] = [];
    eventCount = 0;
    assetList: IAsset[] = [];
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
    async getUpcomingEvents() {
        const response = (await eventService.getList({
            startDate: [
                moment().fmFullTimeString(),
                moment().add(1, 'months').fmFullTimeString(),
            ],
            limit: EVENT_PAGE_LIMIT,
        })) as IBodyResponse<IGetListResponse<IEvent>>;
        if (response.success) {
            this.setUpcomingEvents(response?.data?.items);
            this.setEventCount(response.data?.totalItems);
        } else {
            showErrorNotificationFunction(response.message);
        }
    }

    @Action
    async getAssetList() {
        const response = (await assetService.getList({
            limit: ASSET_PAGE_LIMIT,
            assigneeIds: [appService.getUser()?.id],
        })) as IBodyResponse<IGetListResponse<IAsset>>;
        if (response.success) {
            this.setAssetCount(response?.data?.totalItems);
            this.setAssetList(response?.data?.items);
        } else {
            showErrorNotificationFunction(response.message);
        }
    }

    @Action
    setDashboardTimekeepingQueryString(query: ITimekeepingDashboardQueryString) {
        this.MUTATE_DASHBOARD_TIMEKEEPING_QUERY_STRING(query);
    }

    @Action
    setAssetList(assets: IAsset[]) {
        this.MUTATE_ASSET_LIST(assets);
    }

    @Action
    setAssetCount(assetCount: number) {
        this.MUTATE_ASSET_COUNT(assetCount);
    }

    @Action
    setEventCount(eventCount: number) {
        this.MUTATE_EVENT_COUNT(eventCount);
    }

    @Action
    setUpcomingEvents(events: IEvent[]) {
        this.MUTATE_UPCOMING_EVENTS(events);
    }

    // MUTATIONS
    @Mutation
    MUTATE_TIMEKEEPING_INFO(timekeepingInfo: ITimekeepingDashboard) {
        this.timekeepingInfo = { ...timekeepingInfo };
    }

    @Mutation
    MUTATE_UPCOMING_EVENTS(events: IEvent[]) {
        this.upcomingEvents = [...events];
    }

    @Mutation
    MUTATE_DASHBOARD_TIMEKEEPING_QUERY_STRING(query: ITimekeepingDashboardQueryString) {
        this.dashboardTimekeepingQueryString = {
            ...this.dashboardTimekeepingQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_ASSET_LIST(assets: IAsset[]) {
        this.assetList = assets;
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
