import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import {
    IContractTypeQueryDropDown,
    IBank,
    IBodyResponse,
    IGetListResponse,
    IDropdownRoleItem,
    IDropdownUserItem,
    IDropdownUserQuery,
} from '@/common/types';
import { AxiosPromise } from 'axios';
import { IProvince } from '@/modules/user/types';

class CommonApiService extends BaseService {
    getProvinces(): Promise<IBodyResponse<IGetListResponse<IProvince>>> {
        return this.client.get(this.baseUrl + '/province');
    }

    getDropdownUsers(
        query?: IDropdownUserQuery,
    ): Promise<IBodyResponse<IGetListResponse<IDropdownUserItem>>> {
        return this.client.get(this.baseUrl + '/user', {
            params: query,
        });
    }

    getDropdownRoles(): Promise<IBodyResponse<IGetListResponse<IDropdownRoleItem>>> {
        return this.client.get(this.baseUrl + '/role');
    }

    getDropdownContractTypeList(
        path: string,
        query?: IContractTypeQueryDropDown,
    ): AxiosPromise {
        return this.client.get(path, {
            params: query,
        });
    }

    getDropdownBanks(): Promise<IBodyResponse<IGetListResponse<IBank>>> {
        return this.client.get(this.baseUrl + '/bank');
    }
}

export const commonService = new CommonApiService({ baseUrl: '/common' }, service);
