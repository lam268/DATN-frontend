import { PageName } from '@/common/constants';
import { ISidebar } from '@/common/types';
import {
    User as UserIcon,
    House as HouseIcon,
    Clock as ClockIcon,
    Key as KeyIcon,
    Setting as SettingIcon,
    Calendar as CalendarIcon,
} from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
// start dashboardGroup
const dashboard: ISidebar = {
    iconComponent: HouseIcon,
    name: 'common.app.menu.dashboard',
    class: '',
    active: true,
    subdrop: false,
    to: '/dashboard',
    pageName: PageName.DASHBOARD_PAGE,
};
// end dashboardGroup

// start user group
const userMenu: ISidebar = {
    iconComponent: UserIcon,
    name: 'common.app.menu.user.title',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    childs: [
        {
            name: 'common.app.menu.user.userManagement',
            to: '/user',
            class: '',
            active: false,
            pageName: PageName.USER_PAGE,
            requiredPermissions: [
                `${PermissionResources.USER}_${PermissionActions.READ}`,
                `${PermissionResources.USER}_${PermissionActions.CREATE}`,
                `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
                `${PermissionResources.USER}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.menu.user.contractManagement',
            to: '/contract',
            class: '',
            active: false,
            pageName: PageName.CONTRACT_LIST_PAGE,
            requiredPermissions: [
                `${PermissionResources.CONTRACT}_${PermissionActions.READ}`,
                `${PermissionResources.CONTRACT}_${PermissionActions.CREATE}`,
                `${PermissionResources.CONTRACT}_${PermissionActions.UPDATE}`,
                `${PermissionResources.CONTRACT}_${PermissionActions.DELETE}`,
            ],
        },
    ],
};
const timekeepingMenu: ISidebar = {
    iconComponent: ClockIcon,
    name: 'common.app.menu.timekeeping.title',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    childs: [
        {
            name: 'common.app.menu.timekeeping.timekeeping',
            to: '/timekeeping',
            class: '',
            active: false,
            pageName: PageName.TIME_KEEPING_PAGE,
            requiredPermissions: [
                `${PermissionResources.TIMEKEEPING}_${PermissionActions.READ}`,
                `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
                `${PermissionResources.TIMEKEEPING}_${PermissionActions.UPDATE}`,
                `${PermissionResources.TIMEKEEPING}_${PermissionActions.DELETE}`,
                `${PermissionResources.TIMEKEEPING}_${PermissionActions.READ_PERSONAL}`,
            ],
        },
        {
            name: 'common.app.menu.timekeeping.requestAbsence',
            to: '/request-absence',
            class: '',
            active: false,
            pageName: PageName.REQUEST_ABSENCE_PAGE,
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
    ],
};

const roleMenu: ISidebar = {
    iconComponent: KeyIcon,
    name: 'common.app.menu.role.title',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    to: '/role',
    pageName: PageName.ROLE_LIST_PAGE,
    requiredPermissions: [
        `${PermissionResources.ROLE}_${PermissionActions.READ}`,
        `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
        `${PermissionResources.ROLE}_${PermissionActions.UPDATE}`,
        `${PermissionResources.ROLE}_${PermissionActions.DELETE}`,
    ],
};

const holidayMenu: ISidebar = {
    iconComponent: CalendarIcon,
    name: 'common.app.menu.settings.holiday',
    to: '/setting/holiday',
    class: '',
    active: false,
    pageName: PageName.SETTINGS_HOLIDAY_PAGE,
    requiredPermissions: [
        `${PermissionResources.SETTING}_${PermissionActions.READ}`,
        `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
    ],
};

const settings: ISidebar = {
    iconComponent: SettingIcon,
    name: 'common.app.menu.settings.title',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    childs: [
        {
            name: 'common.app.menu.settings.position',
            to: '/setting/position',
            class: '',
            active: false,
            pageName: PageName.SETTINGS_POSITION_PAGE,
            requiredPermissions: [
                `${PermissionResources.SETTING}_${PermissionActions.READ}`,
                `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
            ],
        },
        {
            name: 'common.app.menu.settings.contractType',
            to: '/setting/contract-type',
            class: '',
            active: false,
            pageName: PageName.SETTINGS_CONTRACT_TYPE_PAGE,
            requiredPermissions: [
                `${PermissionResources.SETTING}_${PermissionActions.READ}`,
                `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
            ],
        },
    ],
};

export const sidebars = [
    dashboard,
    userMenu,
    timekeepingMenu,
    holidayMenu,
    settings,
    roleMenu,
];
