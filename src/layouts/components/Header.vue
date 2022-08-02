<template>
    <header class="header">
        <!--Logo-->
        <div class="header-left">
            <router-link to="/" class="logo">
                <img src="@/assets/images/logo-symbol.svg" height="40" alt="" />
            </router-link>
        </div>
        <!--/Logo-->
        <!-- Header Title -->
        <div class="page-title-box">
            <h3>Unicorn Company</h3>
        </div>
        <!-- /Header Title -->
        <a class="button-menu" @click.prevent="showDrawer">
            <i class="fa fa-bars" />
        </a>
        <!-- Header Menu -->
        <ul class="nav user-menu">
            <!-- Language Menu -->
            <li class="nav-item dropdown has-arrow flag-nav">
                <MenuLanguage />
            </li>
            <!-- /Language Menu -->
            <!-- /Account Menu -->
            <li class="nav-item dropdown has-arrow main-drop">
                <MenuAccount />
            </li>
            <!-- /Account Menu -->
        </ul>
    </header>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { appModule } from '@/store/app';
import MenuLanguage from './MenuLanguage.vue';
import MenuAccount from './MenuAccount.vue';

@Options({
    components: {
        MenuAccount,
        MenuLanguage,
    },
})
export default class Header extends Vue {
    showDrawer(): void {
        appModule.toggleMobileSidebar();
    }
}
</script>
<style scoped lang="scss">
.header {
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    height: 64px;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: map-get($map: $zIndex, $key: header);
    box-shadow: none;
    .header-left {
        float: left;
        width: 64px;
        height: 64px;
        padding: 7px;
        border-right: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        text-align: center;
        z-index: map-get($map: $zIndex, $key: headerLeft);
        transition: all 0.2s ease-in-out;
        @media only screen and (max-width: 991.98px) {
            position: absolute;
            width: 100%;
        }
        &:hover {
            background-color: #ededed;
        }
    }
}

.page-title-box {
    border-radius: 0;
    float: left;
    height: 64px;
    display: flex;
    align-items: center;
    margin-bottom: 0;
    padding: 17px 20px;
    h3 {
        color: #212121;
        font-size: 20px;
        font-weight: normal;
        margin: 0;
    }
    @media only screen and (max-width: 991.98px) {
        display: none;
    }
}

.user-menu {
    float: right;
    margin: 0;
    position: relative;
    z-index: map-get($map: $zIndex, $key: userMenu);
    height: 100%;
    &.nav > li > a {
        color: #fff;
        font-size: 15px;
        line-height: 60px;
        padding: 0 15px;
        height: 60px;

        &:hover,
        &:focus {
            background-color: rgba(0, 0, 0, 0.2);
        }
    }
}

.user-dropdown {
    background-color: transparent;
    border: none;
    padding: 0 2px;
    height: 100%;
    .nav-link {
        height: 100%;
        display: flex;
        align-items: center;
    }
}

.button-menu {
    display: none;
    float: left;
    color: #212121 !important;
    font-size: 24px;
    height: 60px;
    left: 0;
    line-height: 60px;
    padding: 0 20px;
    position: absolute;
    top: 0;
    width: 60px;
    z-index: map-get($map: $zIndex, $key: mobileBtn);
    @media only screen and (max-width: 991.98px) {
        display: block;
    }
    &:hover {
        cursor: pointer;
    }
}
</style>
