<template>
    <BaseListPageHeader
        @toggle-filter-form="toggleFilterForm"
        :pageTitle="$t('common.app.menu.timekeeping.title')"
        :totalItems="totalItems"
        :hasSortBox="true"
        v-model:page="selectedPage"
        :isShowCreateButton="isCanCreate"
        @onPaginate="handlePaginate"
        @create="onClickButtonCreate"
    >
        <template #sort-box-content>
            <Sort />
        </template>
        <template #custom-button>
            <el-tooltip
                v-if="isCanUpload"
                :content="$t('timekeeping.list.timeLine.form.label.timeLine')"
                placement="top"
            >
                <el-button
                    :style="{ backgroundImage: `url(${uploadFingerImage})` }"
                    size="medium"
                    type="default"
                    @click="onClickUploadTimeKeeping"
                    class="icon-button"
                />
            </el-tooltip>
            <el-tooltip
                :content="$t('timekeeping.list.timeLine.form.label.download')"
                placement="top"
            >
                <el-button
                    :style="{ backgroundImage: `url(${downloadCSV})` }"
                    size="medium"
                    type="default"
                    @click="onClickDownloadTimeKeeping"
                    class="icon-button"
                />
            </el-tooltip>
        </template>
    </BaseListPageHeader>
    <FilterForm :isToggleFilterForm="isToggleFilterForm" />
    <TimeKeepingTabs />
    <FingerDataImportPopup />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import FilterForm from '../components/FilterForm.vue';
import FingerDataImportPopup from '../components/popup/FingerDataImportPopup.vue';
import { initTimeKeepingQueryString, TIMEKEEPING_TAB } from '../contants';
import { Options } from 'vue-class-component';
import { ElLoading } from 'element-plus';
import Sort from '../components/Sort.vue';
import i18n from '@/plugins/vue-i18n';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { mixins } from 'vue-property-decorator';
import { downloadFile } from '@/utils/commonFunction';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import TimeKeepingTabs from '../components/TimekeepingTabs.vue';
import { timeKeepingModule } from '../store';
import { checkUserHasPermission } from '@/utils/helper';
import moment from 'moment';
import { timeKeepingApiService } from '../services/timekeeping.api.service';

@Options({
    components: {
        FilterForm,
        Sort,
        TimeKeepingTabs,
        FingerDataImportPopup,
    },
})
export default class TimekeepingPage extends mixins(UtilMixins) {
    isToggleFilterForm = true;

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
        ]);
    }

    get isCanUpload(): boolean {
        return checkUserHasPermission(timeKeepingModule.userPermissions, [
            `${PermissionResources.TIMEKEEPING}_${PermissionActions.CREATE}`,
        ]);
    }

    // computed
    get totalItems(): number {
        return timeKeepingModule.totalTimeKeepings;
    }

    get selectedPage(): number {
        return timeKeepingModule.timeKeepingQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        timeKeepingModule.timeKeepingQueryString.page = +value
            .toString()
            .replaceAll('-', '');
    }

    get isShowUploadFormPopup(): boolean {
        return timeKeepingModule.isShowUploadFormPopup;
    }

    get uploadFingerImage(): void {
        return require('@/assets/icons/btn.import.svg');
    }

    get downloadCSV(): void {
        return require('@/assets/icons/btn.downloadCSV.svg');
    }

    async created(): Promise<void> {
        await this.initData();
    }

    async initData(): Promise<void> {
        timeKeepingModule.setSelectedTab(TIMEKEEPING_TAB.WEEK);
        timeKeepingModule.setTimeKeepingQueryString(initTimeKeepingQueryString);
        timeKeepingModule.setSelectedDate(moment().fmDayString());
        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([
            timeKeepingModule.getAssignees(),
            this.getTimeKeepingList(false),
        ]);
        loading.close();
    }

    async getTimeKeepingList(showLoading = true): Promise<void> {
        let loading = null;
        if (showLoading) {
            loading = ElLoading.service({
                target: '.content',
            });
        }
        const [response] = await Promise.all([
            timeKeepingModule.getTimeKeepingList(),
            timeKeepingModule.getHolidayList(),
        ]);
        if (loading) {
            loading.close();
        }

        if (!response?.success) {
            this.showErrorNotification(response.message as string);
        }
    }

    onClickButtonCreate(): void {
        timeKeepingModule.setIsShowTimeKeepingForm(true);
    }

    // method
    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async handlePaginate(): Promise<void> {
        this.getTimeKeepingList();
    }

    onClickUploadTimeKeeping(): void {
        timeKeepingModule.setIsShowUploadFormPopup(true);
    }

    async onClickDownloadTimeKeeping(): Promise<void> {
        const startDate = moment(timeKeepingModule.selectedDate)
            .startOf('month')
            .utc()
            .fmFullTimeString();
        const endDate = moment(timeKeepingModule.selectedDate)
            .endOf('month')
            .utc()
            .fmFullTimeString();
        const loading = ElLoading.service({ target: '.main' });
        const response = await timeKeepingApiService.download({
            startDate,
            endDate,
        });
        loading.close();
        const fileName = response.data?.fileName;
        const downloadUrl = `${process.env.VUE_APP_API_BASE_URL}/export-data/${fileName}`;
        console.log(downloadUrl);
        downloadFile(fileName, downloadUrl);
    }

    logErrorFileLarge(message: string): void {
        this.showErrorNotification(i18n.global.t(message) as string);
    }

    handleDownloadTimeline(): void {
        downloadFile('timeline.dat', `${window.location.origin}/templates/timeline.dat`);
    }
}
</script>
<style lang="scss" scoped>
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
