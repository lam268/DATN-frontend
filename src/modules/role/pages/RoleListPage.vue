<template>
    <div class="page-content-custom">
        <BaseListPageHeader
            :pageTitle="$t('role.list.pageName.listPage')"
            :hasFilterForm="false"
            :isShowSearchBox="false"
        >
        </BaseListPageHeader>
        <div class="layout-container">
            <div class="row row-content">
                <!-- Sub right side bar -->
                <div class="col-xl-3 col-md-12 col-xs-12">
                    <RoleList />
                </div>
                <!-- Main-content -->
                <div class="col-xl-9 col-md-12 col-xs-12">
                    <div class="layout-information-role">
                        <RoleForm />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import RoleList from '../components/role-list/RoleList.vue';
import { roleModule } from '../store';
import { ElLoading } from 'element-plus';
import RoleForm from '../components/role-list/RoleForm.vue';

@Options({
    components: {
        RoleList,
        RoleForm,
    },
})
export default class RoleListPage extends mixins(UtilMixins) {
    async created(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([roleModule.getRoles(), roleModule.getPermissionList()]);
        if (roleModule.roles.length > 0) {
            await roleModule.getRole(roleModule.roles[0]?.id as number);
        }
        loading.close();
    }
}
</script>
<style lang="scss" scoped>
.row-content {
    padding: 10px;
}
.col-xl-3 {
    padding: 5px 20px 0px 20px;
}
.col-xl-9 {
    padding: 5px 20px 0px 0px;
    .layout-information-role {
        border: 1px #e0e0e0 solid;
        border-radius: 8px;
        background: white;
    }
}
.col-md-12,
.col-xs-12 {
    padding: 5px 20px 0px 20px;
}
</style>
