import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IExportTimekeeping } from '../types';

class TimeKeepingApiService extends BaseService {
    async upload(data: FormData) {
        data = this.beforeCreate<FormData>(data);
        return await this.client.post(
            `${this.detailUrl}/upload-finger-scanner-data`,
            data,
        );
    }

    async download(data: IExportTimekeeping) {
        data = this.beforeCreate<IExportTimekeeping>(data);
        return await this.client.post(`${this.detailUrl}/export`, data);
    }
}

export const timeKeepingApiService = new TimeKeepingApiService(
    { baseUrl: '/timekeeping' },
    service,
);
