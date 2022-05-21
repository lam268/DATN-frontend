import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import { contractApiService } from './services/api.service';
import store from '@/store';
import {
    ContractGroupBy,
    IContract,
    IContractUpdate,
    IQueryStringContract,
} from './types';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_MAX_SIZE_PER_PAGE,
    DEFAULT_ORDER_DIRECTION,
    LIMIT_PER_PAGE,
} from '@/common/constants';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import {
    IContractTypeDropdownDto,
    IBodyResponse,
    IGetListResponse,
    ISelectOptions,
    IDropdownUserItem,
} from '@/common/types';
import { commonService } from '@/common/services/api.services';
import { UserStatus } from '../user/constants';
import { DEFAULT_ORDER_BY, initialSelectedContract } from './constants';

export const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    userIds: null,
    contractTypeIds: null,
    startDate: null,
    endDate: null,
    statuses: null,
    groupBy: ContractGroupBy.CONTRACT,
};

@Module({ dynamic: true, namespaced: true, store, name: 'contract' })
class ContractModule extends VuexModule {
    contractList: IContract[] = [];
    totalContracts = 0;
    queryString: IQueryStringContract = initQueryString;
    userOptions: ISelectOptions[] = [];
    contractTypeOptions: ISelectOptions[] = [];
    selectedContract: IContractUpdate = initialSelectedContract;
    isShowContractFormPopUp = false;
    isShowStopContractFormPopUp = false;

    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.CONTRACT);
    }

    // Actions
    @Action
    async getContractList() {
        const response = (await contractApiService.getList({
            ...this.queryString,
            page: this.queryString.page,
        })) as IBodyResponse<IGetListResponse<IContract>>;
        if (response?.success) {
            const contractList: IContract[] = response?.data?.items || [];
            this.MUTATE_CONTRACT_LIST(contractList);
            this.MUTATE_TOTAL_CONTRACTS(response?.data?.totalItems);
        } else {
            this.MUTATE_CONTRACT_LIST([]);
            this.MUTATE_TOTAL_CONTRACTS(0);
        }
        return response;
    }

    @Action
    setIsShowContractFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_CONTRACT_FORM_POPUP(value);
    }

    @Action
    async getContractTypeOptions() {
        const response = await commonService.getDropdownContractTypeList(
            '/setting/contract-type',
            {
                limit: DEFAULT_MAX_SIZE_PER_PAGE,
            },
        );
        if (response?.data?.items) {
            this.MUTATE_CONTRACT_TYPE_OPTIONS(response?.data?.items);
        } else {
            this.MUTATE_CONTRACT_TYPE_OPTIONS([]);
        }
        return response;
    }

    @Action
    async getUserOptions() {
        const response = await commonService.getDropdownUsers({
            status: [UserStatus.ACTIVE, UserStatus.INACTIVE],
        });
        if (response?.success) {
            this.MUTATE_USER_OPTIONS(response?.data?.items || []);
        } else {
            this.MUTATE_USER_OPTIONS([]);
        }
        return response;
    }

    @Action
    setSelectedContract(data: IContractUpdate) {
        this.MUTATE_SELECTED_CONTRACT(data);
    }

    @Action
    resetQueryString() {
        this.MUTATE_QUERY_STRING({
            ...initQueryString,
            groupBy: this.queryString.groupBy,
        });
    }

    @Action
    setQueryString(query: IQueryStringContract) {
        this.MUTATE_QUERY_STRING(query);
    }

    @Action
    setIsShowStopContractFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_STOP_CONTRACT_FORM_POPUP(value);
    }

    // Mutations
    @Mutation
    MUTATE_IS_SHOW_CONTRACT_FORM_POPUP(value: boolean) {
        this.isShowContractFormPopUp = value;
    }

    @Mutation
    MUTATE_SELECTED_CONTRACT(data: IContractUpdate) {
        this.selectedContract = data;
    }

    @Mutation
    MUTATE_QUERY_STRING(query: IQueryStringContract) {
        this.queryString = {
            ...this.queryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_CONTRACT_LIST(contracts: IContract[]) {
        this.contractList = contracts;
    }

    @Mutation
    MUTATE_TOTAL_CONTRACTS(totalContracts: number) {
        this.totalContracts = totalContracts;
    }

    @Mutation
    MUTATE_CONTRACT_TYPE_OPTIONS(contractTypeOptions: IContractTypeDropdownDto[]) {
        this.contractTypeOptions = contractTypeOptions.map(function (contractType) {
            return {
                label: contractType.name,
                value: contractType.id,
            };
        });
    }

    @Mutation
    MUTATE_USER_OPTIONS(userOptions: IDropdownUserItem[]) {
        this.userOptions = userOptions.map(function (user) {
            return {
                label: user.fullName,
                value: user.id,
            };
        });
    }

    @Mutation
    MUTATE_IS_SHOW_STOP_CONTRACT_FORM_POPUP(value: boolean) {
        this.isShowStopContractFormPopUp = value;
    }
}

export const contractModule = getModule(ContractModule);
