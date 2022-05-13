<template>
    <div class="cp-header">
        <!-- Cpanel Left -->
        <div class="cp-left">
            <h3 class="cp-page-title">{{ pageTitle }}</h3>
        </div>
        <!-- End Cpanel Left -->

        <!-- Cpanel Right -->
        <div class="cp-pagination-action">
            <span v-if="isCanUpdate"
                ><el-button @click="handleBtnReset">{{
                    $t('common.app.formPageHeader.button.resetButton')
                }}</el-button></span
            >
            <span style="margin-left: 10px" v-if="isCanUpdate"
                ><el-button @click="handleBtnSave" type="primary">{{
                    $t('common.app.formPageHeader.button.submitButton')
                }}</el-button></span
            >
        </div>
    </div>
</template>

<script lang="ts">
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { Prop, Vue } from 'vue-property-decorator';
import { contractTypeModule } from '../store/contractType.store';

export default class SettingHeader extends Vue {
    @Prop({ default: '' }) readonly pageTitle!: string;

    get isCanUpdate(): boolean {
        return checkUserHasPermission(contractTypeModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }

    handleBtnReset(): void {
        this.$emit('reset');
    }

    handleBtnSave(): void {
        this.$emit('save');
    }
}
</script>

<style scoped lang="scss">
.cp-header {
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 18px 20px;
    @media only screen and (max-width: 991.98px) {
        margin: -15px -15px 0 -15px;
    }
    @media (min-width: 576px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    position: sticky;
    top: 64px;
    z-index: map-get($map: $zIndex, $key: cpHeader);
}
.cp-page-title {
    font-size: 20px;
    color: #212121;
    font-weight: 400;
    margin: 0;
    margin-right: 15px;
    @media (max-width: 980px) {
        margin-left: 15px;
    }
}
</style>
