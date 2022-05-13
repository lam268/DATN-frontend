import { Module, VuexModule, getModule, Action, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import moment from 'moment';
import {
    initTimeKeepingFilterForm,
    initTimeKeepingQueryString,
    TIMEKEEPING_TAB,
} from './contants';
import {
    IUserTimeKeeping,
    ITimeKeepingFilter,
    ITimeKeepingForm,
    ITimekeepingQueryString,
} from './types';
import {
    DATE_TIME_FORMAT,
    DEFAULT_FIRST_PAGE,
    DEFAULT_SIZE_PER_PAGE,
    USER_LIMIT,
} from '@/common/constants';
import { appService } from '@/utils/app';
import { timeKeepingApiService } from './services/timekeeping.api.service';
import { UserStatus } from '../user/constants';
import { IBodyResponse, IGetListResponse, ISelectOptions } from '@/common/types';
import { userApiService } from '../user/services/api.service';
import { IUser } from '../user/types';
import { PermissionResources } from '../role/constants';
import { IHoliday, IHolidayQueryString } from '../setting/type';
import { settingHolidayApiService } from '../setting/services/settingService';

@Module({ dynamic: true, namespaced: true, store, name: 'timekeeping' })
class TimeKeepingModule extends VuexModule {
    // state
    timeKeepingList: IUserTimeKeeping[] = [];
    holidayList: IHoliday[] = [];
    assigneeOptions: ISelectOptions[] = [];
    selectedTab = TIMEKEEPING_TAB.WEEK as string;
    totalTimeKeepings = 0;
    timeKeepingQueryString: ITimekeepingQueryString = initTimeKeepingQueryString;
    isShowTimeKeepingForm = false;
    isShowUploadFormPopup = false;
    selectedDate = moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN);
    timeKeepingFilter = initTimeKeepingFilterForm;
    timeKeepingForm: ITimeKeepingForm = {
        id: null,
        userId: undefined,
        timekeeping: null,
        dateTime: null,
    };

    // GETTERS
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.TIMEKEEPING);
    }

    // ACTION
    @Action
    async getAssignees(): Promise<IBodyResponse<IGetListResponse<IUser>>> {
        const response = (await userApiService.getList({
            limit: USER_LIMIT,
            statuses: [UserStatus.ACTIVE],
        })) as IBodyResponse<IGetListResponse<IUser>>;
        if (response.success) {
            this.MUTATE_ASSIGNEE_OPTIONS(response.data.items);
        } else {
            this.MUTATE_ASSIGNEE_OPTIONS([]);
        }
        return response;
    }

    @Action
    async getTimeKeepingList(
        queryString: ITimekeepingQueryString = {},
    ): Promise<IBodyResponse<IGetListResponse<IUserTimeKeeping>>> {
        const query = {
            ...this.timeKeepingQueryString,
            ...queryString,
        };
        query.startDate = moment(query.startDate).utc().fmFullTimeString();
        query.endDate = moment(query.endDate).utc().fmFullTimeString();
        const response = (await timeKeepingApiService.getList(query)) as IBodyResponse<
            IGetListResponse<IUserTimeKeeping>
        >;
        if (response.success) {
            this.MUTATE_TIME_KEEPING_LIST(response?.data?.items);
            if (response?.data?.totalItems) {
                this.MUTATE_TOTAL_TIMEKEEPINGS(response?.data?.totalItems);
            }
        }
        return response;
    }

    @Action
    setSelectedTab(value: string) {
        this.MUTATE_SELECTED_TAB(value);
    }

    @Action
    setTimeKeepingQueryString(query: ITimekeepingQueryString) {
        this.MUTATE_TIME_KEEPING_QUERY_STRING(query);
    }

    @Action
    clearQueryString() {
        this.MUTATE_TIME_KEEPING_QUERY_STRING({
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
    }

    @Action
    setTimeKeepingFilter(payload: ITimeKeepingFilter) {
        this.MUTATE_FORM_TIME_KEEPING_FILTER({
            ...payload,
            keyword: payload.keyword?.trim(),
        });
    }

    @Action
    setSelectedDate(value: string) {
        this.MUTATE_SELECTED_DATE(value);
    }

    @Action
    setIsShowUploadFormPopup(isShow: boolean) {
        this.MUTATE_IS_SHOW_UPLOAD_FORM_POPUP(isShow);
    }

    @Action
    setIsShowTimeKeepingForm(isShow: boolean) {
        this.MUTATE_IS_SHOW_TIME_KEEPING_FORM(isShow);
    }

    @Action
    async getHolidayList(query: IHolidayQueryString = {}): Promise<void> {
        const response = (await settingHolidayApiService.getList({
            startDate: moment(this.selectedDate)
                .startOf('month')
                .utc()
                .fmFullTimeString(),
            endDate: moment(this.selectedDate).endOf('month').utc().fmFullTimeString(),
            ...query,
        })) as IBodyResponse<IGetListResponse<IHoliday>>;
        this.MUTATE_HOLIDAY_LIST(response.data?.items);
    }

    @Action
    setTimeKeepingForm(payload: ITimeKeepingForm) {
        this.MUTATE_TIMEKEEPING_FORM(payload);
    }

    // MUTATIONS
    @Mutation
    MUTATE_ASSIGNEE_OPTIONS(assigneeOptions: IUser[]) {
        this.assigneeOptions = assigneeOptions.map(function (assignee) {
            return {
                label: assignee.fullName,
                value: assignee.id,
            };
        });
    }

    @Mutation
    MUTATE_SELECTED_TAB(value: string) {
        this.selectedTab = value;
    }

    @Mutation
    MUTATE_TIME_KEEPING_LIST(data: IUserTimeKeeping[]) {
        this.timeKeepingList = data;
    }

    @Mutation
    MUTATE_TOTAL_TIMEKEEPINGS(totalTimeKeepings: number) {
        this.totalTimeKeepings = totalTimeKeepings;
    }

    @Mutation
    MUTATE_FORM_TIME_KEEPING_FILTER(payload: ITimeKeepingFilter) {
        this.timeKeepingFilter = {
            ...payload,
        };
    }

    @Mutation
    MUTATE_SELECTED_DATE(value: string) {
        this.selectedDate = value;
    }

    @Mutation
    MUTATE_IS_SHOW_UPLOAD_FORM_POPUP(isShow: boolean) {
        this.isShowUploadFormPopup = isShow;
    }

    @Mutation
    MUTATE_IS_SHOW_TIME_KEEPING_FORM(isShow: boolean) {
        this.isShowTimeKeepingForm = isShow;
    }

    @Mutation
    MUTATE_TIMEKEEPING_FORM(payload: ITimeKeepingForm) {
        this.timeKeepingForm = payload;
    }

    @Mutation
    MUTATE_TIME_KEEPING_QUERY_STRING(query: ITimekeepingQueryString) {
        this.timeKeepingQueryString = {
            ...this.timeKeepingQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_HOLIDAY_LIST(holidayList: IHoliday[]) {
        this.holidayList = holidayList;
    }
}
export const timeKeepingModule = getModule(TimeKeepingModule);
