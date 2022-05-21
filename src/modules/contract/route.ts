import ContractListPage from './pages/ContractListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/contract',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.CONTRACT_LIST_PAGE,
                component: ContractListPage,

                meta: {
                    requiresAuth: true,
                    requiredPermissions: [
                        `${PermissionResources.CONTRACT}_${PermissionActions.READ}`,
                        `${PermissionResources.CONTRACT}_${PermissionActions.CREATE}`,
                        `${PermissionResources.CONTRACT}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.CONTRACT}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
