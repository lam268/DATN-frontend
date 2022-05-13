import { IBodyResponse } from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import {
    IAppliedPosition,
    IGeneralSetting,
    IGetGeneralSettingQuery,
    IUserPosition,
} from '../type';

class SettingApiService extends BaseService {
    async getGeneralSetting(query: IGetGeneralSettingQuery) {
        return await this.client.get<
            IGeneralSetting<IUserPosition | IAppliedPosition>,
            IBodyResponse<IGeneralSetting<IUserPosition | IAppliedPosition>>
        >(`${this.detailUrl}?key=${query.key}`);
    }

    async saveGeneralSetting(data: IGeneralSetting<IUserPosition | string>) {
        data = this.beforeSave<IGeneralSetting<IUserPosition | string>>(data);
        return await this.client.post(`${this.detailUrl}`, data);
    }
}
class SettingHolidayApiService extends BaseService {}

export const generalSettingApiService = new SettingApiService(
    { baseUrl: '/setting' },
    service,
);

export const settingHolidayApiService = new SettingHolidayApiService(
    { baseUrl: '/setting/holiday' },
    service,
);
