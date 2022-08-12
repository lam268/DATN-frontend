<template>
    <div>
        <BaseListPageHeader
            @toggle-filter-form="toggleFilterForm"
            :pageTitle="$t('user.list.pageName')"
            :createButtonText="$t('user.list.filterForm.createUser')"
            :isShowCreateButton="isCanCreate"
            v-model:page="selectedPage"
            :pageLimit="pageLimit"
            @create="onClickButtonCreate"
            @onPaginate="handlePaginate"
            :hasSortBox="true"
            :totalItems="totalItems"
        >
            <template #sort-box-content>
                <Sort />
            </template>
            <template #custom-button>
                <el-tooltip
                    v-if="isCanCreate"
                    :content="$t('user.list.upload.uploadUser')"
                    placement="top"
                >
                    <el-button
                        :style="{ backgroundImage: `url(${uploadUserImage})` }"
                        size="medium"
                        type="default"
                        @click="onClickButtonUploadUserFile"
                        class="icon-button"
                    />
                </el-tooltip>
            </template>
        </BaseListPageHeader>

        <FilterForm :isToggleFilterForm="isToggleFilterForm" @toggle="toggle" />
        <BaseEmptyBox
            v-if="totalItems === 0 && !loading"
            styleContainer="style-empty"
            :message="$t('user.list.filterForm.emptyMessage')"
        />
        <UserGrid v-else-if="!loading && totalItems > 0" />

        <!-- Popup user form -->
        <UserFormPopup />

        <!-- Popup upload -->
        <ImportUserPopup />
        <ImportUserResultPopup />
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import FilterForm from '../components/FilterForm.vue';
import UserGrid from '../components/UserGrid.vue';
import Sort from '../components/Sort.vue';
import UserFormPopup from '../components/UserFormPopup.vue';
import { Options } from 'vue-class-component';
import { ElLoading } from 'element-plus';
import { userModule } from '../store';
import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { mixins } from 'vue-property-decorator';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import ImportUserPopup from '../components/ImportUserPopup.vue';
import { checkUserHasPermission } from '@/utils/helper';
import { SettingKey } from '@/modules/setting/constant';
import { generalSettingApiService } from '@/modules/setting/services/settingService';
import { IUserPosition } from '@/modules/setting/type';
import ImportUserResultPopup from '../components/ImportUserResultPopup.vue';
@Options({
    components: {
        FilterForm,
        UserGrid,
        UserFormPopup,
        Sort,
        ImportUserPopup,
        ImportUserResultPopup,
    },
})
export default class UserListPage extends mixins(UtilMixins) {
    isToggleFilterForm = true;
    heightFilterForm = 0;

    get isCanCreate(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.CREATE}`,
        ]);
    }

    get totalItems(): number {
        return userModule.totalUsers;
    }

    get pageLimit(): number {
        return userModule.queryString.limit || DEFAULT_SIZE_PER_PAGE;
    }

    get selectedPage(): number {
        return userModule.queryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        userModule.queryString.page = value;
    }

    get uploadUserImage(): void {
        return require('@/assets/icons/btn.export.svg');
    }

    get uploadFingerImage(): void {
        return require('@/assets/icons/btn.import.svg');
    }

    created(): void {
        userModule.resetQueryString();
        const loading = ElLoading.service({
            target: '.content',
        });
        Promise.all([
            (userModule.getBanks(),
            userModule.getProvinceList(),
            userModule.getUsers(),
            userModule.getRoleOptions(),
            this.getPositions()),
        ]);
        loading.close();
    }

    async getUsers(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await userModule.getUsers();
        loading.close();

        if (!response?.success) {
            this.showErrorNotification(response?.message as string);
        }
    }

    async getPositions(): Promise<void> {
        const positions = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.USER_POSITION,
        });

        if (positions.success) {
            userModule.setUserPositionList(positions.data.values as IUserPosition[]);
        }
    }

    onClickButtonCreate(): void {
        userModule.setIsShowUserFormPopup(true);
        userModule.setIsDisabledSaveButton(false);
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async handlePaginate(): Promise<void> {
        userModule.setPage(this.selectedPage);
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await userModule.getUsers();
        loading.close();

        if (!response?.success) {
            this.showErrorNotification(response.message as string);
        }
    }

    onClickButtonUploadUserFile(): void {
        userModule.setIsOpenImportUserFilePopup(!userModule.isOpenImportUserFilePopup);
    }
}
</script>
<style lang="scss" scoped>
.style-empty {
    margin: 150px;
}
.empty-ctn {
    height: 50vh;
}
.icon-button {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    color: #212121;
    background-position: center;
}
</style>
