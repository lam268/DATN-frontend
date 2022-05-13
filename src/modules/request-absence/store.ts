import { Module, VuexModule, getModule, Action, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import {
    initRequestAbsenceQueryString,
    RequestAbsenceStatus,
    RequestAbsenceTab,
} from './contants';
import { IGetDataRequestAbsence, IAbsenceFilterForm } from './types';
import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { requestAbsenceApiService } from './services/request-absence.api.service';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import { IBodyResponse, IGetListResponse } from '@/common/types';

@Module({ dynamic: true, namespaced: true, store, name: 'requestabsence' })
class RequestAbsenceModule extends VuexModule {
    requestAbsenceList: IGetDataRequestAbsence[] = [];
    selectedTab = RequestAbsenceTab.HISTORY;
    isShowRequestAbsencePopupForm = false;
    selectedRequestAbsence: IGetDataRequestAbsence = {};
    totalAbsences = 0;
    queryString: IAbsenceFilterForm = initRequestAbsenceQueryString;
    requestAbsenceStatusFilterForm: RequestAbsenceStatus[] = [];

    // GETTERS
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(
            PermissionResources.REQUEST_ABSENCE,
        );
    }

    // ACTION
    @Action
    async getRequestAbscenceList(): Promise<
        IBodyResponse<IGetListResponse<IGetDataRequestAbsence>>
    > {
        const response = (await requestAbsenceApiService.getList({
            ...this.queryString,
            page: this.queryString.page,
        })) as IBodyResponse<IGetListResponse<IGetDataRequestAbsence>>;
        if (response.success) {
            this.MUTATE_REQUEST_ABSENCE_LIST(response?.data?.items);
            this.MUTATE_TOTAL_ABSENCES(response?.data.totalItems);
        }
        return response;
    }

    @Action
    clearFilter() {
        this.MUTATE_QUERY_STRING({
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
    }

    @Action
    setQueryString(query: IAbsenceFilterForm) {
        this.MUTATE_QUERY_STRING(query);
    }

    @Action
    setTotalAbsences(totalAbsences: number) {
        this.MUTATE_TOTAL_ABSENCES(totalAbsences);
    }

    @Action
    setRequestAbsenceList(requestAbsenceList: IGetDataRequestAbsence[]) {
        this.MUTATE_REQUEST_ABSENCE_LIST(requestAbsenceList);
    }

    @Action
    setSelectedTab(tab: RequestAbsenceTab) {
        this.MUTATE_SELECTED_TAB(tab);
    }

    @Action
    setIsShowRequestAbsenceFormPopup(isShow: boolean) {
        this.MUTATE_IS_SHOW_REQUEST_ABSENCE_POPUP_FORM(isShow);
    }

    @Action
    setSelectedRequestAbsenceId(requestAbsence: IGetDataRequestAbsence) {
        this.MUTATE_SELECTED_REQUEST_ABSENCE(requestAbsence);
    }

    @Action
    setRequestAbsenceStatusFilterForm(
        requestAbsenceStatusFilterForm: RequestAbsenceStatus[],
    ) {
        this.MUTATE_REQUEST_ABSENCE_STATUS_FILTER_FORM(requestAbsenceStatusFilterForm);
    }

    // MUTATION

    @Mutation
    MUTATE_SELECTED_TAB(tab: RequestAbsenceTab) {
        this.selectedTab = tab;
    }

    @Mutation
    MUTATE_REQUEST_ABSENCE_LIST(requestAbsenceList: IGetDataRequestAbsence[]) {
        this.requestAbsenceList = requestAbsenceList;
    }

    @Mutation
    MUTATE_TOTAL_ABSENCES(totalAbsences: number) {
        this.totalAbsences = totalAbsences;
    }

    @Mutation
    MUTATE_QUERY_STRING(query: IAbsenceFilterForm) {
        this.queryString = {
            ...this.queryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_IS_SHOW_REQUEST_ABSENCE_POPUP_FORM(isShow: boolean) {
        this.isShowRequestAbsencePopupForm = isShow;
    }

    @Mutation
    MUTATE_SELECTED_REQUEST_ABSENCE(requestAbsence: IGetDataRequestAbsence) {
        this.selectedRequestAbsence = requestAbsence;
    }

    @Mutation
    MUTATE_REQUEST_ABSENCE_STATUS_FILTER_FORM(
        requestAbsenceStatusFilterForm: RequestAbsenceStatus[],
    ) {
        this.requestAbsenceStatusFilterForm = requestAbsenceStatusFilterForm;
    }
}

export const requestAbsenceModule = getModule(RequestAbsenceModule);
