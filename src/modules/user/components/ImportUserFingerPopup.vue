<template>
    <BaseImportFile
        :isShowUploadForm="isOpenUploadFingerFilePopup"
        @handleSave="onClickButtonUpload"
        @download="handleDownloadUserFingerFile"
        @changeFile="handleChangeFile"
        @resetUpload="resetError"
        :title="$t('user.list.upload.uploadFinger')"
        :error="$t(`${importError}`)"
    />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import { userModule } from '../store';
import { downloadFile } from '@/utils/commonFunction';
import { userFingerUpdateApiService } from '../services/api.service';
import { commonService } from '@/common/services/api.services';
import i18n from '@/plugins/vue-i18n';
import { fileToLines } from '@/utils/helper';
import { IUserFinger } from '../types';
import { ExcelExtensions, UserStatus } from '../constants';
import { ElLoading } from 'element-plus';
import { WITH_DELETED_OPTION } from '@/common/constants';

@Options({})
export default class ImportUserFingerPopup extends mixins(UtilMixins) {
    importError = '';
    userIds = [] as number[];

    get isOpenUploadFingerFilePopup(): boolean {
        return userModule.getIsOpenUploadFingerFilePopup;
    }

    created(): void {
        this.getUserIds();
    }

    async getUserIds(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await commonService.getDropdownUsers({
            status: Object.values(UserStatus),
            withDeleted: WITH_DELETED_OPTION.YES,
        });
        loading.close();
        if (response.success) {
            (response.data?.items || []).forEach((user) => {
                this.userIds.push(user.id);
            });
        }
    }

    async uploadUserFingerFile(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file as File);
        const response = await userFingerUpdateApiService.create(formData);

        if (response?.success) {
            this.showSuccessNotification(
                i18n.global.t('user.form.message.uploadSuccess') as string,
            );
            userModule.setIsOpenUploadFingerFilePopup(false);
        } else {
            this.showErrorNotification(
                i18n.global.t('user.form.message.uploadFail') as string,
            );
        }
    }

    async validateFileData(file: File): Promise<boolean> {
        const isLt1M = file?.size / 1024 / 1024 < 5;
        if (!file) {
            this.importError = 'user.form.message.fileEmpty';
            return false;
        }
        if (file.name) {
            const finalFileName = file.name.split('.');
            if (!ExcelExtensions.includes(finalFileName[finalFileName.length - 1])) {
                this.importError = 'user.form.message.fileNameCSV';
                return false;
            }
        }
        if (!isLt1M) {
            this.importError = 'user.form.message.fileLarge';
            return false;
        }
        const linesArr = (await fileToLines(file, true)) as IUserFinger[];
        for (const line of linesArr) {
            if (!line.fingerId || this.userIds.indexOf(line.userId) < 0) {
                this.importError = 'user.form.message.fileError';
                return false;
            }
        }
        return true;
    }

    async onClickButtonUpload(file: File): Promise<void> {
        if (await this.validateFileData(file)) {
            await this.uploadUserFingerFile(file);
        }
    }

    handleChangeFile(): void {
        this.importError = '';
    }

    handleDownloadUserFingerFile(): void {
        downloadFile('fingers.csv', `${window.location.origin}/templates/fingers.csv`);
    }

    resetError(): void {
        this.importError = '';
        userModule.setIsOpenUploadFingerFilePopup(false);
    }
}
</script>

<style lang="scss" scoped></style>
