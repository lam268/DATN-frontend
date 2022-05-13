<template>
    <div class="main-wrapper">
        <Header />
        <Sidebar @toggleSidebar="handleToggleSidebar" />
        <!-- Page Wrapper -->
        <div
            name="slide-fade"
            class="page-wrapper"
            :class="isCollapse ? 'page-content-collapse' : 'page-content-expand'"
        >
            <!-- Page Content -->
            <div class="content">
                <router-view v-slot="{ Component }">
                    <component :is="Component" />
                </router-view>
            </div>
            <!-- /Page Content -->
        </div>
        <!-- /Page Wrapper -->
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

@Options({
    components: { Header, Sidebar },
})
export default class MainLayout extends Vue {
    isCollapse = false;

    handleToggleSidebar(isCollapse: boolean): void {
        this.isCollapse = isCollapse;
    }
}
</script>

<style lang="scss" scoped>
.page-content-collapse {
    margin-left: 64px;
}
.page-content-expand {
    margin-left: 260px;
}
.page-wrapper {
    left: 0;
    padding-top: 64px;
    position: relative;
    transition: all 0.2s ease-in-out;
    @media only screen and (max-width: 991.98px) {
        margin-left: 0;
    }
}
</style>
