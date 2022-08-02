<template>
    <el-menu
        :default-openeds="activeHighlightMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
    >
        <template
            :key="['d', sidebarIndex].join('-')"
            v-for="(sidebar, sidebarIndex) in sidebars"
        >
            <router-link
                :to="sidebar.to"
                v-if="!sidebar.childs && hasPermission(sidebar)"
            >
                <el-menu-item
                    :index="['d', sidebarIndex, Date.now()].join('-')"
                    :class="{
                        'active-menu': isActiveMenu(sidebar),
                        'collapsed-menu-item': isCollapse,
                    }"
                >
                    <component :is="sidebar.iconComponent" class="module-icon" />
                    <template #title>
                        <span>{{ $t(sidebar.name) }}</span>
                    </template>
                </el-menu-item>
            </router-link>
            <el-sub-menu
                v-if="sidebar.childs && hasPermission(sidebar)"
                :index="['d', sidebarIndex].join('-')"
                :class="{
                    'active-menu': isActiveParentMenu(sidebar),
                    'collapsed-menu-item': isCollapse,
                }"
            >
                <template #title>
                    <component :is="sidebar.iconComponent" class="module-icon" />
                    <span>{{ $t(sidebar.name) }}</span>
                </template>
                <el-menu-item-group>
                    <router-link
                        :key="itemIndex"
                        v-for="(item, itemIndex) in sidebar.childs"
                        :to="item.to"
                    >
                        <el-menu-item
                            :index="['d', sidebarIndex, itemIndex].join('-')"
                            v-if="hasPermission(item)"
                            :class="isActiveSubMenu(item)"
                        >
                            <component :is="item.iconComponent" class="module-icon" />
                            <span>{{ $t(item.name) }}</span>
                        </el-menu-item>
                    </router-link>
                </el-menu-item-group>
            </el-sub-menu>
        </template>
    </el-menu>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { sidebars as initSidebar } from '../menu';
import { ISidebar } from '@/common/types';
import {
    ArrowLeft as ArrowLeftIcon,
    ArrowRight as ArrowRightIcon,
    User as UserIcon,
    House as HouseIcon,
    Clock as ClockIcon,
    Calendar as CalenderIcon,
    Monitor as MonitorIcon,
    Service as ServiceIcon,
    Printer as PrinterIcon,
    Key as KeyIcon,
    Setting as SettingIcon,
    QuestionFilled as QuestionIcon,
} from '@element-plus/icons-vue';
import { checkPermission } from '@/utils/commonFunction';
import { authModule } from '@/modules/auth/store';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        UserIcon,
        HouseIcon,
        ClockIcon,
        CalenderIcon,
        MonitorIcon,
        ServiceIcon,
        PrinterIcon,
        KeyIcon,
        SettingIcon,
        QuestionIcon,
        ArrowLeftIcon,
        ArrowRightIcon,
    },
})
export default class SidebarInner extends Vue {
    @Prop({ default: false }) isCollapse!: boolean;

    get sidebars(): ISidebar[] {
        return initSidebar;
    }

    get activeHighlightMenu(): string[] {
        const menuObj: Record<string, string[]> = {};
        this.sidebars.forEach((item: ISidebar, index: number) => {
            menuObj[index] = item.childs
                ? item.childs.map((child: ISidebar) => child.pageName || '')
                : [];
        });
        const path = this.$router.currentRoute?.value?.name as string;
        const mainMenu: string[] = [];

        Object.values(menuObj).forEach((itemSubMenu: string[], index: number) => {
            if (itemSubMenu?.includes(path)) mainMenu.push(`d-${index}`);
        });
        return mainMenu;
    }

    toggleSidebar(): void {
        this.isCollapse = !this.isCollapse;
        this.$emit('toggleSidebar', this.isCollapse);
    }

    isActiveMenu(value: ISidebar): boolean {
        return value.to === `/${this.$route.path.split('/')[1]}`;
    }

    isActiveSubMenu(value: ISidebar): string {
        const router = this.$router.currentRoute?.value?.name as string;
        if (value.pageName === router) return 'active-menu';
        else return '';
    }

    isActiveParentMenu(items: ISidebar): boolean | undefined {
        const isActive = items?.childs
            ?.map((item: ISidebar) => item.to)
            .includes(this.$route.path);
        return isActive;
    }

    hasPermission(item: ISidebar): boolean {
        if (authModule.userProfile.isSuperAdmin) return true;
        if (item?.childs) {
            return item?.childs.some((child) =>
                checkPermission(child?.requiredPermissions as string[]),
            );
        } else {
            return checkPermission(item?.requiredPermissions as string[]);
        }
    }
}
</script>
<style lang="scss" scoped>
.module-icon {
    height: 2em;
    width: 2em;
    margin-right: 5px;
    padding-right: 5px;
}

.sidebar-inner {
    display: flex;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    /* width */
    &::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: rgb(180, 179, 179);
        border-radius: 10px;
    }
    flex-direction: column;
    height: calc(97vh - 98px);
    transition: all 0.2s ease-in-out 0s;
    .el-menu {
        border: none;
        padding-top: 20px;
        height: 100%;
        a {
            color: #212121;
            text-decoration: none;
            display: block;
            &:not(:last-child) {
                margin-bottom: 5px;
            }
        }
        li {
            &:not(:last-child) {
                margin-bottom: 5px;
            }
            a {
                margin-bottom: 0;
            }
        }
        .el-sub-menu {
            text-align: left;
        }
        .el-menu-item,
        .el-sub-menu {
            color: #212121;
            border-radius: 8px;
            a {
                padding-left: 25px;
            }
            &.active-menu {
                background-color: #e6f6ff;
                &.is-opened {
                    background-color: transparent;
                }
            }
        }

        .el-menu-item {
            border-radius: 8px;
            &.active-menu {
                color: #212121;
                background-color: #e6f6ff;
            }
        }
        .el-menu-item {
            &:hover {
                color: #212121;
                background-color: #ededed;
            }
        }
        .el-menu-item,
        .el-sub-menu__title {
            text-align: left;
            height: 40px;
            line-height: 40px;
            i {
                font-size: 22px;
                padding-right: 10px;
                color: #212121;
            }
        }
        :deep(.el-sub-menu__title) {
            height: 40px;
            border-radius: 8px;
            line-height: 40px;
            &:hover {
                color: #212121;
                background-color: #ededed;
            }
        }
        &.el-menu--collapse {
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
            width: 100%;
            :deep(.el-menu-item) * {
                text-align: center;
            }
        }
        ul {
            .el-menu-item {
                color: #212121;
                padding-left: 15px !important;
            }
        }
        :deep(.el-sub-menu__icon-arrow) {
            transform: rotate(-90deg);
        }
        :deep(.is-opened .el-sub-menu__icon-arrow) {
            transform: rotate(0);
        }
    }
}

.el-popper {
    .el-menu {
        .el-menu-item {
            height: 40px;
            line-height: 40px;
            &.active-menu {
                color: #212121;
                background-color: #e6f6ff;
            }
            &:hover {
                color: #212121;
                background-color: #ededed;
            }
            &:not(:last-child) {
                margin-bottom: 5px;
            }
        }
        .el-menu-item-group {
            :deep(.el-menu-item-group__title) {
                display: none !important;
            }
        }
    }
}
:deep(.el-drawer__body) {
    margin-top: 84px;
    overflow-y: auto;
    overflow-x: hidden;
}

.collapsed-menu-item {
    align-items: center;
    :deep(.el-tooltip__trigger) {
        display: flex !important;
        align-items: center;
        justify-items: center;
    }
    .module-icon {
        margin: 0 !important;
        padding: 0 !important;
    }
}
</style>
