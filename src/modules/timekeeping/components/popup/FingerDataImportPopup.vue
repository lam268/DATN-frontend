<template>
    <BaseImportFile
        :isShowUploadForm="isShowUploadFormPopup"
        @handleSave="handleSaveFile"
        @changeFile="handleChangeFile"
        @download="handleDownloadTimeline"
        @resetUpload="resetUpload"
        :title="$t('timekeeping.list.title.uploadTime')"
        :error="$t(`${importError}`)"
    />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { ElLoading } from 'element-plus';
import i18n from '@/plugins/vue-i18n';
import { MAX_SIZE_FILE } from '@/common/constants';
import { mixins } from 'vue-property-decorator';
import { fileToLines } from '@/utils/helper';
import { downloadFile } from '@/utils/commonFunction';
import { timeKeepingApiService } from '../../services/timekeeping.api.service';
import { TimeKeepingExtensions } from '@/modules/timekeeping/contants';
import { timeKeepingModule } from '@/modules/timekeeping/store';
import { IBodyResponse } from '@/common/types';

export default class FingerDataImportPopup extends mixins(UtilMixins) {
    importError = '';

    get isShowUploadFormPopup(): boolean {
        return timeKeepingModule.isShowUploadFormPopup;
    }

    async validateFile(file: File): Promise<boolean> {
        if (!file) {
            this.importError = 'timekeeping.form.errors.fileEmpty';
            return false;
        }
        // validate file size
        if (file?.size > MAX_SIZE_FILE) {
            this.importError = 'timekeeping.list.confirmUpdate.fileLarge.message';
            return false;
        }
        // validate file extension
        const fileNameSplitted = file?.name?.split('.');
        if (
            fileNameSplitted?.length < 1 ||
            !TimeKeepingExtensions.includes(fileNameSplitted[fileNameSplitted.length - 1])
        ) {
            this.importError = 'timekeeping.list.timeLine.error.fileName';
            return false;
        }
        // check if there is any empty line
        const linesArr = (await fileToLines(file, false)) as string[][];
        linesArr.forEach((line: string[]) => {
            if (!line?.[0] || !line?.[1] || !line?.[2]) {
                this.importError = 'timekeeping.form.errors.fileError';
                return false;
            }
        });

        return true;
    }

    async uploadFingerDataFile(file: File): Promise<boolean> {
        const formData = new FormData();
        formData.append('file', file as File);
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = (await timeKeepingApiService.upload(
            formData,
        )) as unknown as IBodyResponse;
        if (!response?.success) {
            this.showErrorNotification(response.message as string);
            return false;
        }

        this.showSuccessNotification(
            i18n.global.t('timekeeping.list.timeLine.success.uploadSuccess') as string,
        );
        timeKeepingModule.setIsShowUploadFormPopup(false);

        const getTimeKeepingResponse = await timeKeepingModule.getTimeKeepingList();

        if (!getTimeKeepingResponse?.success) {
            this.showErrorNotification(getTimeKeepingResponse.message as string);
        }

        loading.close();
        return true;
    }

    async handleSaveFile(file: File): Promise<void> {
        if (await this.validateFile(file)) {
            const isUploadSuccess = await this.uploadFingerDataFile(file);
            if (isUploadSuccess) {
                //
            }
        }
    }

    handleChangeFile(): void {
        this.importError = '';
    }

    resetUpload(): void {
        this.importError = '';
        timeKeepingModule.setIsShowUploadFormPopup(false);
    }

    handleDownloadTimeline(): void {
        downloadFile('timeline.dat', `${window.location.origin}/templates/timeline.dat`);
    }
}
</script>
