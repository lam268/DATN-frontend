import { IBodyResponse } from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { AxiosPromise } from 'axios';

class RequestAbsenceApiService extends BaseService {
    updateStatus<P>(id: number, data: P): Promise<IBodyResponse> {
        data = this.beforeUpdate<P>(data);
        return this.client.patch(`${this.detailUrl}/${id}/status`, data);
    }

    deleteTimeKeeping<R extends IBodyResponse>(): AxiosPromise {
        return this.client.delete<R>(`${this.detailUrl}`);
    }
}

export const requestAbsenceApiService = new RequestAbsenceApiService(
    { baseUrl: 'request-absence' },
    service,
);
