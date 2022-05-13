<template>
    <div>
        <BaseListPageHeader
            :pageTitle="$t('setting.holiday.title')"
            :isShowCreateButton="isCanUpdate"
            :isShowSearchBox="false"
            :hasSortBox="false"
            @create="onClickCreate"
        >
        </BaseListPageHeader>
        <Calendar />
    </div>
</template>

<script lang="ts">
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { Vue, Options } from 'vue-class-component';
import Calendar from '../components/holiday/Calendar.vue';
import { settingHolidayModule } from '../store/holiday.store';
@Options({
    components: { Calendar },
})
export default class SettingHoliday extends Vue {
    get isCanUpdate(): boolean {
        return checkUserHasPermission(settingHolidayModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }

    onClickCreate(): void {
        settingHolidayModule.setIsShowHolidayFormPopup(true);
    }
}
</script>

<style scoped>
:deep(.cp-search) {
    display: none !important;
}
</style>
