import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import TimekeepingPage from './pages/TimekeepingPage.vue';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/timekeeping',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.TIME_KEEPING_PAGE,
                component: TimekeepingPage,
                meta: {
                    requiresAuth: true,
                    requiredPermissions: [
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.READ}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.DELETE}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.READ_PERSONAL}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE_PERSONAL}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.UPDATE_PERSONAL}`,
                        `${PermissionResources.TIMEKEEPING}_${PermissionActions.DELETE_PERSONAL}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
