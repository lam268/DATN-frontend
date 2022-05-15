import { RouteRecordRaw } from 'vue-router';
import SettingHolidayPage from './pages/SettingHoliday.vue';
import SettingResetPaidLeaveDaysPage from './pages/ResetPaidLeaveDaysPage.vue';
import AboutPage from './pages/AboutPage.vue';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
export default [
    {
        path: '/setting',
        component: MainLayout,
        children: [
            {
                path: 'holiday',
                name: PageName.SETTINGS_HOLIDAY_PAGE,
                component: SettingHolidayPage,
                meta: {
                    requiresAuth: true,
                    name: PageName.SETTINGS_POSITION_PAGE,
                },
            },
            {
                path: 'reset-paid-leave-days',
                name: PageName.SETTINGS_RESET_PAID_LEAVE_DAYS,
                component: SettingResetPaidLeaveDaysPage,
                meta: {
                    requiresAuth: true,
                    name: PageName.SETTINGS_CONTRACT_TYPE_PAGE,
                },
            },
        ],
    },
    {
        path: '/about',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.ABOUT_PAGE,
                component: AboutPage,
                meta: {
                    requiresAuth: true,
                    name: PageName.ABOUT_PAGE,
                },
            },
        ],
    },
] as RouteRecordRaw[];
