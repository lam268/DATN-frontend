import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class ContractTypeApiService extends BaseService {}
export const contractTypeService = new ContractTypeApiService(
    { baseUrl: '/setting/contract-type' },
    service,
);
