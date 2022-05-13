import store from '@/store';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    LIMIT_PER_PAGE,
} from '@/common/constants';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { contractTypeService } from '../services/contractTypeService';
import { IContractType, IContractTypeUpdate, IGetListContractTypeQuery } from '../type';
import { appService } from '@/utils/app';
import { PermissionResources } from '@/modules/role/constants';

export const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: '',
};
@Module({
    name: 'contractTypeSetting',
    dynamic: true,
    namespaced: true,
    store,
})
class ContractTypeModule extends VuexModule {
    // contract type
    contractTypeList: IContractType[] = [];
    totalContractTypes = 0;
    contractTypeQueryString: IGetListContractTypeQuery = initQueryString;

    isShowContractTypeFormPopUp = false;
    selectedContractType: IContractTypeUpdate | null = null;
    isDisabledSaveButton = false;

    // GETTER
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.SETTING);
    }

    // ACTION
    @Action
    setSelectedContractType(data: IContractTypeUpdate | null) {
        this.MUTATE_SELECTED_CONTRACT_TYPE(data);
    }

    @Action
    setIsShowContractTypeFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_CONTRACT_TYPE_FORM_POPUP(value);
    }

    @Action
    async getContractTypeList(): Promise<IBodyResponse<IGetListResponse<IContractType>>> {
        const response = (await contractTypeService.getList({
            ...this.contractTypeQueryString,
        })) as IBodyResponse<IGetListResponse<IContractType>>;
        if (response?.success) {
            this.MUTATE_CONTRACT_TYPE_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_CONTRACT_TYPES(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_CONTRACT_TYPE_LIST([]);
            this.MUTATE_TOTAL_CONTRACT_TYPES(0);
        }
        return response;
    }

    @Action
    async deleteContractType(id: number) {
        const response = (await contractTypeService.delete(id)) as IBodyResponse;
        return response;
    }

    @Action
    setQueryString(query: IGetListContractTypeQuery) {
        this.MUTATE_QUERY_STRING(query);
    }

    @Action
    setIsDisabledSaveButton(value: boolean) {
        this.MUTATE_IS_DISABLED_SAVE_BUTTON(value);
    }

    // MUTATIONS
    @Mutation
    MUTATE_QUERY_STRING(query: IGetListContractTypeQuery) {
        this.contractTypeQueryString = {
            ...this.contractTypeQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_IS_SHOW_CONTRACT_TYPE_FORM_POPUP(value: boolean) {
        this.isShowContractTypeFormPopUp = value;
    }

    @Mutation
    MUTATE_SELECTED_CONTRACT_TYPE(data: IContractTypeUpdate | null) {
        this.selectedContractType = data;
    }

    @Mutation
    MUTATE_IS_DISABLED_SAVE_BUTTON(value: boolean) {
        this.isDisabledSaveButton = value;
    }

    @Mutation
    MUTATE_CONTRACT_TYPE_LIST(value: IContractType[]) {
        this.contractTypeList = value;
    }

    @Mutation
    MUTATE_TOTAL_CONTRACT_TYPES(value: number) {
        this.totalContractTypes = value;
    }
}

export const contractTypeModule = getModule(ContractTypeModule);
