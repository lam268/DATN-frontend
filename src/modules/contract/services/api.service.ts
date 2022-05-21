import { IBodyResponse } from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class ContractApiService extends BaseService {
    updateStatus<P>(id: number, params: P): Promise<IBodyResponse> {
        params = this.beforeUpdate<P>(params);
        return this.client.patch(`${this.updateUrl}/${id}/status/`, params);
    }
}

export const contractApiService = new ContractApiService(
    { baseUrl: '/contract' },
    service,
);
