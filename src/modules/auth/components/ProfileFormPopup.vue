<template>
    <div>
        <el-dialog
            custom-class="edit-profile-form-popup"
            v-model="isShowPopupEditProfile"
            destroy-on-close
            width="60%"
            top="5vh"
            @open="form.openPopup"
            @closed="closedPopup"
        >
            <template #title>
                <h3 class="text-left">
                    {{ $t('auth.profile.title.updateProfile') }}
                </h3>
            </template>
            <div>
                <div class="row" wrap-style="padding-top: 0px;">
                    <!-- Avatar -->
                    <div class="col-12 col-xl-3">
                        <BaseUploadAvatar
                            isHorizontal="true"
                            name="avatar"
                            path="avatar"
                            :reset="isShowPopupEditProfile"
                            :currentImageURL="avatarUrl"
                            @set-avatar-id="setAvatarId"
                            @set-avatar-url="setUploadingAvatarUrl"
                        />
                    </div>
                    <!-- Name + Email + Phone + Birthday -->
                    <div class="col-12 col-xl-9">
                        <div class="row">
                            <!-- Name -->
                            <div class="col-12 col-lg-6">
                                <BaseInputText
                                    v-model:value="form.fullName"
                                    is-required="true"
                                    :label="$t('user.form.fullName.label')"
                                    :placeholder="$t('user.form.fullName.placeholder')"
                                    name="fullName"
                                    :error="translateYupError(form.errors.fullName)"
                                />
                            </div>
                            <!-- Email -->
                            <div class="col-12 col-lg-6">
                                <BaseInputText
                                    name="email"
                                    is-required="true"
                                    v-model:value="email"
                                    :label="$t('user.form.email.label')"
                                    :is-disabled="true"
                                />
                            </div>
                            <!-- Phone -->
                            <div class="col-12 col-lg-6">
                                <BaseInputNumber
                                    name="phoneNumber"
                                    is-required="true"
                                    v-model:value="form.phoneNumber"
                                    :label="$t('user.form.phoneNumber.label')"
                                    :placeholder="$t('user.form.phoneNumber.placeholder')"
                                    :error="translateYupError(form.errors.phoneNumber)"
                                />
                            </div>
                            <!-- Birthday -->
                            <div class="col-12 col-lg-6">
                                <BaseDatePicker
                                    name="birthday"
                                    v-model:value="form.birthday"
                                    :label="$t('user.form.birthday.label')"
                                    :placeholder="$t('user.form.birthday.placeholder')"
                                    :maxDate="new Date()"
                                    :minDate="MIN_DATE_PICKER"
                                    :error="translateYupError(form.errors.birthday)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <!-- Gender -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.gender"
                            :options="genderOptions"
                            :label="$t('user.form.gender.label')"
                            :placeholder="$t('user.form.gender.placeholder')"
                            name="gender"
                            is-required="true"
                            :error="translateYupError(form.errors.gender)"
                        />
                    </div>
                    <!-- Position -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.position"
                            :isRequired="true"
                            :options="userPositionOptions"
                            :label="$t('user.form.position.label')"
                            :placeholder="$t('user.form.position.placeholder')"
                            :filterable="true"
                            name="position"
                            :error="translateYupError(form.errors.position)"
                        />
                    </div>
                    <!-- Social Insurance -->
                    <div class="col-12 col-lg-4">
                        <BaseInputNumber
                            name="socialInsurance"
                            v-model:value="form.socialInsurance"
                            :label="$t('user.form.socialInsurance.label')"
                            :placeholder="$t('user.form.socialInsurance.placeholder')"
                            :error="translateYupError(form.errors.socialInsurance)"
                        />
                    </div>
                    <!-- Bank Account -->
                    <div class="col-12 col-lg-4">
                        <BaseInputNumber
                            name="bankAccount"
                            is-required="true"
                            v-model:value="form.bankAccount"
                            :label="$t('user.form.bankAccount.label')"
                            :placeholder="$t('user.form.bankAccount.placeholder')"
                            :error="translateYupError(form.errors.bankAccount)"
                        />
                    </div>
                    <!-- Bank -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.bank"
                            is-required="true"
                            :filterable="true"
                            :options="banksOptions"
                            :label="$t('user.form.bank.label')"
                            :placeholder="$t('user.form.bank.placeholder')"
                            name="bank"
                            :error="translateYupError(form.errors.bank)"
                        />
                    </div>
                    <!-- Tax Code -->
                    <div class="col-12 col-lg-4">
                        <BaseInputNumber
                            name="taxCode"
                            v-model:value="form.taxCode"
                            :label="$t('user.form.taxCode.label')"
                            :placeholder="$t('user.form.taxCode.placeholder')"
                            :error="translateYupError(form.errors.taxCode)"
                        />
                    </div>
                    <!-- Citizen Id -->
                    <div class="col-12 col-lg-4">
                        <BaseInputNumber
                            name="citizenId"
                            is-required="true"
                            v-model:value="form.citizenId"
                            :label="$t('user.form.citizenId.label')"
                            :placeholder="$t('user.form.citizenId.placeholder')"
                            :error="translateYupError(form.errors.citizenId)"
                        />
                    </div>
                    <!-- Citizen Issues At -->
                    <div class="col-12 col-lg-4">
                        <BaseDatePicker
                            name="citizenIdIssuedAt"
                            is-required="true"
                            v-model:value="form.citizenIdIssuedAt"
                            :maxDate="new Date()"
                            :minDate="MIN_DATE_PICKER"
                            :label="$t('user.form.citizenIdIssuedAt.label')"
                            :placeholder="$t('user.form.citizenIdIssuedAt.placeholder')"
                            :error="translateYupError(form.errors.citizenIdIssuedAt)"
                        />
                    </div>
                    <!-- Citizen Issues place -->
                    <div class="col-12 col-lg-4">
                        <BaseInputText
                            v-model:value="form.idCardIssuePlace"
                            is-required="true"
                            :label="$t('user.form.idCardIssuePlace.label')"
                            :placeholder="$t('user.form.idCardIssuePlace.placeholder')"
                            name="idCardIssuePlace"
                            :error="translateYupError(form.errors.idCardIssuePlace)"
                        />
                    </div>
                    <!-- Province -->
                    <div class="col-12 col-lg-4">
                        <BaseSingleSelect
                            v-model:value="form.provinceId"
                            is-required="true"
                            :options="provincesOptions"
                            :label="$t('user.form.province.label')"
                            :placeholder="$t('user.form.province.placeholder')"
                            name="province"
                            :error="translateYupError(form.errors.provinceId)"
                        />
                    </div>
                    <!-- Address -->
                    <div class="col-12 col-lg-4">
                        <BaseInputText
                            v-model:value="form.address"
                            :label="$t('user.form.address.label')"
                            :placeholder="$t('user.form.address.placeholder')"
                            name="address"
                            :error="translateYupError(form.errors.address)"
                        />
                    </div>
                    <!-- Hometown Address -->
                    <div class="col-12 col-lg-4">
                        <BaseInputText
                            v-model:value="form.hometownAddress"
                            :label="$t('user.form.hometownAddress.label')"
                            :placeholder="$t('user.form.hometownAddress.placeholder')"
                            name="hometownAddress"
                            :error="translateYupError(form.errors.hometownAddress)"
                        />
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="submit-section" style="margin-top: 20px">
                    <span class="dialog-footer">
                        <div class="row justify-content-center">
                            <div
                                class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                            >
                                <el-button @click="closeDialog">{{
                                    $t('auth.profile.buttons.cancel')
                                }}</el-button>
                            </div>
                            <div
                                class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                            >
                                <el-button
                                    type="primary submit"
                                    :disabled="isDisabledSaveButton"
                                    @click="onSubmit"
                                >
                                    {{ $t('auth.profile.buttons.submit') }}
                                </el-button>
                            </div>
                        </div>
                    </span>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Options, setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { initEditForm } from '../form';
import { authModule } from '../store';
import { ISelectOptions } from '@/common/types';
import { UtilMixins } from '@/mixins/utilMixins';
import { FormValidationResult } from 'vee-validate';
import { IUser } from '@/modules/user/types';
import { SettingKey } from '@/modules/setting/constant';
import { generalSettingApiService } from '@/modules/setting/services/settingService';
import { IUserPosition } from '@/modules/setting/type';
@Options({})
export default class ProfileFormPopup extends mixins(UtilMixins) {
    form = setup(initEditForm);

    get avatarUrl(): string {
        return (
            authModule?.uploadingAvatarUrl || require('@/assets/icons/avatar-default.png')
        );
    }

    get banksOptions(): ISelectOptions[] {
        return authModule.banks;
    }

    get provincesOptions(): ISelectOptions[] {
        return authModule.provinceOptions;
    }

    get email(): string {
        return authModule.userProfile.email;
    }

    get genderOptions(): ISelectOptions[] {
        return this.getGenderOptions();
    }

    get userPositionOptions(): ISelectOptions[] {
        return this.getPositionOptions(authModule.userPositionList);
    }

    get isShowPopupEditProfile(): boolean {
        return authModule.isShowPopupEditProfile;
    }

    set isShowPopupEditProfile(value: boolean) {
        authModule.setIsShowPopupEditProfile(value);
    }

    get isDisabledSaveButton(): boolean {
        return authModule.isDisabledSaveButton;
    }

    created(): void {
        this.getPositions();
    }

    async getPositions(): Promise<void> {
        const response = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.USER_POSITION,
        });

        if (response.success) {
            authModule.setUserPositionList(response.data.values as IUserPosition[]);
        }
    }

    closedPopup(): void {
        (this.form.resetForm as () => void)();
    }

    setAvatarId(fileId: number): void {
        this.form.avatarId = fileId;
    }

    setUploadingAvatarUrl(url: string): void {
        authModule.setUploadingAvatarUrl(url);
    }

    async onSubmit(): Promise<void> {
        authModule.setIsDisabledSaveButton(true);
        const isValid = (
            await (this.form.validate as () => Promise<FormValidationResult<IUser>>)()
        ).valid;
        if (isValid) {
            await this.form.onSubmit();
        }

        authModule.setIsDisabledSaveButton(false);
    }

    closeDialog(): void {
        authModule.setIsShowPopupEditProfile(false);
        authModule.setUploadingAvatarUrl(authModule.avatarUrl);
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
    text-align: left;
}
:deep(.el-dialog__body) {
    padding: 0px 20px;
}
:deep(.el-dialog__title) {
    font-weight: bold;
}
:deep(.el-dialog__footer) {
    padding-top: 0;
}
</style>
