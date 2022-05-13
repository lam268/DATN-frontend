import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import RequestAbsencePage from './pages/RequestAbsencePage.vue';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/request-absence',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.REQUEST_ABSENCE_PAGE,
                component: RequestAbsencePage,
                meta: {
                    requiresAuth: true,
                    requiredPermissions: [
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.READ}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.CREATE}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.READ_PERSONAL}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.CREATE_PERSONAL}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_PERSONAL}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE_PERSONAL}`,
                        `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_STATUS}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
