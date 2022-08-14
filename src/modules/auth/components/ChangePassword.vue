<template>
    <el-dialog
        width="50%"
        v-model="isShowChangePasswordForm"
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="change-password-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{ $t('auth.profile.changePassword.title') }}
            </h3>
        </template>
        <div class="row">
            <div class="col-12 mb-3">
                <BaseInputPassword
                    v-model:value="form.oldPassword"
                    :error="translateYupError(form.errors.oldPassword)"
                    :is-required="true"
                    :label="$t('auth.profile.fields.oldPassword')"
                    :placeholder="$t('auth.profile.fields.placeholder.oldPassword')"
                />
            </div>
            <div class="col-12 mb-3">
                <BaseInputPassword
                    v-model:value="form.newPassword"
                    :error="translateYupError(form.errors.newPassword)"
                    :is-required="true"
                    :label="$t('auth.profile.fields.newPassword')"
                    :placeholder="$t('auth.profile.fields.placeholder.newPassword')"
                />
            </div>
            <div class="col-12">
                <BaseInputPassword
                    v-model:value="form.reNewPassword"
                    :error="translateYupError(form.errors.reNewPassword)"
                    :is-required="true"
                    :label="$t('auth.profile.fields.reNewPassword')"
                    :placeholder="$t('auth.profile.fields.placeholder.reNewPassword')"
                />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="onClickCancel">
                            {{ $t('common.app.buttons.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            :disabled="isDisabledSaveButton"
                            type="primary"
                            @click="onClickSaveButton()"
                        >
                            {{ $t('common.app.buttons.confirm') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { setup } from 'vue-class-component';
import { setupChangePasswordForm } from '../composition/changePassword';
import { authModule } from '../store';

export default class ChangePassword extends mixins(UtilMixins) {
    form = setup(() => setupChangePasswordForm());

    get isDisabledSaveButton(): boolean {
        return authModule.isDisabledSaveButton;
    }

    get isShowChangePasswordForm(): boolean {
        return authModule.isShowPopupChangePassword || false;
    }

    set isShowChangePasswordForm(val: boolean) {
        authModule.setIsShowPopupChangePassword(val);
    }

    onClickCancel(): void {
        authModule.setIsShowPopupChangePassword(false);
    }

    async closePopup(): Promise<void> {
        authModule.setIsShowPopupChangePassword(false);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        authModule.setIsDisabledSaveButton(true);
        await this.form.onSubmitChangePassword();
        authModule.setIsDisabledSaveButton(false);
    }
}
</script>

<style scoped lang="scss"></style>
