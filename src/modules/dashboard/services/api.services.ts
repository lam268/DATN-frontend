import { IBodyResponse } from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { ITimekeepingDashboardQueryString } from '../types';

class DashboardApiService extends BaseService {
    getTimekeepingInfo<R extends IBodyResponse>(query: ITimekeepingDashboardQueryString) {
        return this.client.get<R, R>(`timekeeping/dashboard`, {
            params: query,
        });
    }
}
export const dashboardService = new DashboardApiService({ baseUrl: '/' }, service);
