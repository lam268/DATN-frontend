import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IBodyResponse, IBulkImportResponse } from '@common/types';
import { AxiosPromise } from 'axios';
import { IImportUsers } from '../types';

class UserApiService extends BaseService {
    updateStatus<P>(id: number, data: P): AxiosPromise {
        data = this.beforeUpdate<P>(data);
        return this.client.patch<P, IBodyResponse<P>>(
            `${this.detailUrl}/${id}/status`,
            data,
        );
    }

    importUsers(data: IImportUsers): Promise<IBodyResponse<IBulkImportResponse>> {
        return this.client.post(`${this.detailUrl}/bulk-create`, data);
    }
}

export const userApiService = new UserApiService({ baseUrl: '/user' }, service);
export const userFingerUpdateApiService = new UserApiService(
    { baseUrl: '/user/update-finger-id' },
    service,
);
