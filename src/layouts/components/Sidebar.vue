<template>
    <!-- <sidebar> -->
    <div class="sidebar" :class="isCollapse ? 'mini-sidebar' : ''">
        <div class="sidebar-inner">
            <SidebarDesktop :isCollapse="isCollapse" />
            <SidebarMobile />
        </div>
        <div class="sidebar-minimizer" :class="{ collapse: isCollapse }">
            <a class="toggle_btn" @click="toggleSidebar">
                <ArrowRightIcon class="arrow-icon" v-if="isCollapse" />
                <ArrowLeftIcon class="arrow-icon" v-else />
            </a>
        </div>
    </div>
    <!-- </sidebar> -->
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
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
import SidebarDesktop from './SidebarDesktop.vue';
import SidebarMobile from './SidebarMobile.vue';

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
        SidebarDesktop,
        SidebarMobile,
    },
})
export default class SideBar extends Vue {
    isCollapse = false;

    toggleSidebar(): void {
        this.isCollapse = !this.isCollapse;
        this.$emit('toggleSidebar', this.isCollapse);
    }
}
</script>
<style lang="scss" scoped>
.sidebar {
    background-color: #ffffff;
    overflow: hidden;
    border-right: 1px solid #e0e0e0;
    bottom: 0;
    left: 0;
    margin-top: 0;
    position: fixed;
    top: 64px;
    transition: unset;
    width: 260px;
    z-index: map-get($map: $zIndex, $key: sideBar);
    height: auto;
    @media only screen and (max-width: 991.98px) {
        margin-left: -260px;
    }
}

.collapse {
    display: flex !important;
    .toggle_btn {
        margin: 0px !important;
    }
}
.arrow-icon {
    height: 1em;
    width: 1em;
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
}

.sidebar-minimizer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    margin-bottom: 5px;
    position: sticky;
    align-items: center;
    position: -webkit-sticky;
    width: inherit;
    cursor: pointer;
    border: 0;
    overflow: hidden;
    background: white;
}

:deep(.el-drawer__body) {
    margin-top: 84px;
    overflow-y: auto;
    overflow-x: hidden;
}

@media only screen and (min-width: 991px) {
    .toggle_btn {
        margin-right: 5px;
        color: #212121;
        float: left;
        font-size: 26px;
        height: 46px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        text-decoration: none;
        &:hover {
            background-color: #ededed;
            border-radius: 50px;
        }
    }
    .mini-sidebar {
        width: 64px;
        .sidebar-minimizer {
            justify-content: center;
        }
    }
}
</style>
