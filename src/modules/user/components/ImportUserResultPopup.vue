<template>
    <div>
        <el-dialog
            v-model="isOpenImportUserResultPopUp"
            width="80%"
            custom-class="confirm-dialog"
            destroy-on-close="true"
            @closed="closePopup"
            @open="openPopup"
        >
            <template #title>
                <h3 class="text-left">
                    {{ $t('user.form.import.importUserResult') }}
                </h3>
            </template>
            <BaseTableLayout :data="importUserList">
                <template #table-columns>
                    <el-table-column
                        :label="$t('user.form.fullName.label')"
                        min-width="200"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.fullName"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.fullName"
                            >
                                <div class="error w-100">
                                    {{ scope.row.fullName }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>{{ scope.row.fullName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('user.form.email.label')" min-width="250">
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.email"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.email"
                            >
                                <div class="error w-100">{{ scope.row.email }}&nbsp;</div>
                            </el-tooltip>
                            <div class="w-100" v-else>{{ scope.row.email }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.phoneNumber.label')"
                        min-width="150"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.phoneNumber"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.phoneNumber"
                            >
                                <div class="w-100 error">
                                    {{ scope.row.phoneNumber }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>{{ scope.row.phoneNumber }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.birthday.label')"
                        min-width="150"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.birthday"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.birthday"
                            >
                                <div class="w-100 error">
                                    {{ scope.row.birthday }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>{{ scope.row.birthday }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.gender.label')"
                        min-width="150"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.gender"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.gender"
                            >
                                <div class="error w-100">
                                    {{ scope.row.gender }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ getUserGender(scope.row.gender) }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.position.label')"
                        min-width="200"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.position"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.position"
                            >
                                <div class="error w-100">
                                    {{ scope.row.position }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ getUserPosition(scope.row.position) }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('user.form.role.label')" min-width="150">
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.role"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.role"
                            >
                                <div class="error w-100">{{ scope.row.role }}&nbsp;</div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.role }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.bankAccount.label')"
                        min-width="200"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.bankAccount"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.bankAccount"
                            >
                                <div class="error w-100">
                                    {{ scope.row.bankAccount }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.bankAccount }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('user.form.bank.label')" min-width="170">
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.bank"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.bank"
                            >
                                <div class="error w-100">{{ scope.row.bank }}&nbsp;</div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.bank }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.citizenId.label')"
                        min-width="200"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.citizenId"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.citizenId"
                            >
                                <div class="error w-100">
                                    {{ scope.row.citizenId }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.citizenId }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.citizenIdIssuedAt.label')"
                        min-width="180"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.citizenIdIssuedAt"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.citizenIdIssuedAt"
                            >
                                <div class="w-100 error">
                                    {{ scope.row.citizenIdIssuedAt }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.citizenIdIssuedAt }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.idCardIssuePlace.label')"
                        min-width="260"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.idCardIssuePlace"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.idCardIssuePlace"
                            >
                                <div class="w-100 error">
                                    {{ scope.row.idCardIssuePlace }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.idCardIssuePlace }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.address.label')"
                        min-width="250"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.address"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.address"
                            >
                                <div class="w-100 error">
                                    {{ scope.row.address }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.address }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.hometownAddress.label')"
                        min-width="250"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.hometownAddress"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.hometownAddress"
                            >
                                <div class="w-100 error">
                                    {{ scope.row.hometownAddress }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.hometownAddress }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.taxCode.label')"
                        min-width="170"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.taxCode"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.taxCode"
                            >
                                <div class="error w-100">
                                    {{ scope.row.taxCode }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.taxCode }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.socialInsurance.label')"
                        min-width="170"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.socialInsurance"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.socialInsurance"
                            >
                                <div class="error w-100">
                                    {{ scope.row.socialInsurance }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.socialInsurance }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.form.province.label')"
                        min-width="170"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.province"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.province"
                            >
                                <div class="error w-100">
                                    {{ scope.row.province }}&nbsp;
                                </div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.province }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('user.list.filterForm.note.label')"
                        min-width="250"
                    >
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="errors[scope.row?.index]?.note"
                                placement="bottom"
                                v-if="errors[scope.row?.index]?.note"
                            >
                                <div class="w-100 error">{{ scope.row.note }}&nbsp;</div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{ scope.row.note }}
                            </div>
                        </template>
                    </el-table-column>
                </template>
            </BaseTableLayout>
            <template #footer>
                <span class="dialog-footer">
                    <div class="row justify-content-center footer">
                        <div
                            class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                        >
                            <el-button @click="closePopup">
                                {{ $t('user.form.button.cancel') }}
                            </el-button>
                        </div>
                        <div
                            class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                        >
                            <el-button
                                :disabled="isDisabledSaveButton || hasError"
                                type="primary"
                                @click="onClickSaveButton"
                            >
                                {{ $t('user.form.button.submit') }}
                            </el-button>
                        </div>
                    </div>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-property-decorator';
import { UtilMixins } from '@/mixins/utilMixins';
import moment from 'moment';
import {
    DATE_TIME_FORMAT,
    INPUT_TEXT_MAX_LENGTH,
    MAX_BANK_ACCOUNT_LENGTH,
    MAX_CITIZEN_ID_LENGTH,
    MAX_SOCIAL_INSURANCE_LENGTH,
    MAX_TAX_CODE_LENGTH,
    MIN_BANK_ACCOUNT_LENGTH,
    MIN_CITIZEN_ID_LENGTH,
    MIN_SOCIAL_INSURANCE_LENGTH,
    MIN_TAX_CODE_LENGTH,
    REGEX,
    SupportLanguage,
    TEXTAREA_MAX_LENGTH,
} from '@/common/constants';
import { appModule } from '@/store/app';
import { ElLoading } from 'element-plus';
import { parseImportErrors, showErrorNotificationFunction } from '@/utils/helper';
import { userModule } from '../store';
import { IImportUser } from '../types';
import { UserGender, UserGenderSettings } from '../constants';
import { userApiService } from '../services/api.service';

@Options({})
export default class ImportUserResultPopup extends mixins(UtilMixins) {
    isDisabledSaveButton = false;

    errors = {};
    hasError = false;

    get importUserList(): IImportUser[] {
        return userModule.importUsers;
    }

    get isOpenImportUserResultPopUp(): boolean {
        return userModule.isOpenImportUserResultPopUp;
    }

    validateData(): void {
        this.hasError = false;
        this.importUserList.forEach((importUser) => {
            const userPosition = userModule.userPositionList.find(
                (position) =>
                    position?.value?.en?.toLocaleLowerCase() ===
                        importUser?.position?.toLocaleLowerCase() ||
                    position?.value?.vi?.toLocaleLowerCase() ===
                        importUser?.position?.toLocaleLowerCase(),
            );

            if (userPosition) {
                importUser.position = userPosition.code;
            } else {
                this.hasError = true;
            }

            const userGender = UserGenderSettings.find(
                (gender) =>
                    gender?.value?.en?.toLocaleLowerCase() ===
                        importUser?.gender?.toLocaleLowerCase() ||
                    gender?.value?.vi?.toLocaleLowerCase() ===
                        importUser?.gender?.toLocaleLowerCase(),
            );
            if (userGender) {
                importUser.gender = userGender.code;
            } else {
                this.hasError = true;
            }

            if (importUser.index !== undefined) {
                const emailError = this.validateEmail(importUser.email, importUser.index);
                const fullNameError = this.validateFullName(importUser.fullName);
                const phoneNumberError = this.validatePhoneNumber(importUser.phoneNumber);
                const birthdayError = this.validateBirthday(importUser.birthday);
                const citizenIdError = this.validateCitizenId(
                    importUser.citizenId,
                    importUser.index,
                );
                const citizenIdIssuedAtError = this.validateCitizenIdIssuedAt(
                    importUser.citizenIdIssuedAt,
                );
                const addressError = this.validateAddress(importUser.address);
                const idCardIssuePlaceError = this.validateIdCardIssuePlace(
                    importUser.idCardIssuePlace,
                );
                const genderError = this.validateGender(importUser.gender);
                const roleError = this.validateRole(importUser.role);
                const positionError = this.validatePosition(importUser.position);
                const noteError = this.validateNote(importUser.note);
                const socialInsuranceError = this.validateSocialInsurance(
                    importUser.socialInsurance,
                    importUser.index,
                );
                const taxCodeError = this.validateTaxCode(
                    importUser.taxCode,
                    importUser.index,
                );
                const bankAccountError = this.validateBankAccount(
                    importUser.bankAccount,
                    importUser.index,
                );
                const bankError = this.validateBank(importUser.bank);
                const provinceError = this.validateProvince(importUser.province);
                const hometownAddressError = this.validateHometownAddress(
                    importUser.hometownAddress,
                );
                this.errors = {
                    ...this.errors,
                    [importUser.index]: {
                        email: emailError,
                        fullName: fullNameError,
                        phoneNumber: phoneNumberError,
                        birthday: birthdayError,
                        citizenId: citizenIdError,
                        citizenIdIssuedAt: citizenIdIssuedAtError,
                        address: addressError,
                        idCardIssuePlace: idCardIssuePlaceError,
                        gender: genderError,
                        role: roleError,
                        position: positionError,
                        note: noteError,
                        socialInsurance: socialInsuranceError,
                        taxCode: taxCodeError,
                        bankAccount: bankAccountError,
                        bank: bankError,
                        province: provinceError,
                        hometownAddress: hometownAddressError,
                    },
                };

                if (
                    emailError ||
                    fullNameError ||
                    phoneNumberError ||
                    birthdayError ||
                    citizenIdError ||
                    citizenIdIssuedAtError ||
                    addressError ||
                    idCardIssuePlaceError ||
                    genderError ||
                    roleError ||
                    positionError ||
                    noteError ||
                    socialInsuranceError ||
                    taxCodeError ||
                    bankAccountError ||
                    bankError ||
                    provinceError ||
                    hometownAddressError
                ) {
                    this.hasError = true;
                }
            }
        });
    }

    validateFullName(fullName: string): string {
        if (!fullName) {
            return this.$t('user.form.import.fullName.required');
        }
        if (fullName?.length > INPUT_TEXT_MAX_LENGTH) {
            return this.$t('user.form.import.fullName.maxLength');
        }
        return '';
    }

    validateEmail(email: string, index?: number): string {
        if (!email) {
            return this.$t('user.form.import.email.required');
        }
        if (!REGEX.EMAIL.test(email)) {
            return this.$t('user.form.import.email.formatError');
        }
        if (email?.length > INPUT_TEXT_MAX_LENGTH) {
            return this.$t('user.form.import.email.maxLength');
        }
        if (
            this.importUserList.some(
                (importUser) => importUser.email === email && importUser.index !== index,
            )
        ) {
            return this.$t('user.form.import.email.uniqueError');
        }
        return '';
    }

    validatePhoneNumber(phoneNumber: string): string {
        if (!phoneNumber) {
            return this.$t('user.form.import.phoneNumber.required');
        }
        if (!REGEX.PHONE_NUMBER.test(phoneNumber)) {
            return this.$t('user.form.import.phoneNumber.invalid');
        }
        return '';
    }

    validateGender(gender: UserGender): string {
        if (!gender) {
            return this.$t('user.form.import.gender.required');
        }
        if (!Object.values(UserGender).includes(gender)) {
            return this.$t('user.form.import.gender.invalid');
        }
        return '';
    }

    validateTaxCode(taxCode?: string, index?: number): string {
        if (!taxCode) {
            return '';
        }
        if (!REGEX.NUMBER.test(taxCode)) {
            return this.$t('user.form.import.taxCode.invalid');
        }
        if (taxCode.toString().length > MAX_TAX_CODE_LENGTH) {
            return this.$t('user.form.import.taxCode.maxLength');
        }
        if (taxCode.toString().length < MIN_TAX_CODE_LENGTH) {
            return this.$t('user.form.import.taxCode.minLength');
        }
        if (
            this.importUserList.some(
                (importUser) =>
                    importUser.taxCode === taxCode && importUser.index !== index,
            )
        ) {
            return this.$t('user.form.import.taxCode.uniqueError');
        }
        return '';
    }

    validateBankAccount(bankAccount: string, index?: number): string {
        if (!bankAccount) {
            return this.$t('user.form.import.bankAccount.required');
        }
        if (!REGEX.NUMBER.test(bankAccount)) {
            return this.$t('user.form.import.bankAccount.invalid');
        }
        if (bankAccount.toString().length > MAX_BANK_ACCOUNT_LENGTH) {
            return this.$t('user.form.import.bankAccount.maxLength');
        }
        if (bankAccount.toString().length < MIN_BANK_ACCOUNT_LENGTH) {
            return this.$t('user.form.import.bankAccount.minLength');
        }
        if (
            this.importUserList.some(
                (importUser) =>
                    importUser.bankAccount === bankAccount && importUser.index !== index,
            )
        ) {
            return this.$t('user.form.import.bankAccount.uniqueError');
        }
        return '';
    }

    validateCitizenId(citizenId: string, index?: number): string {
        if (!citizenId) {
            return this.$t('user.form.import.citizenId.required');
        }
        if (!REGEX.NUMBER.test(citizenId)) {
            return this.$t('user.form.import.citizenId.invalid');
        }
        if (citizenId.toString().length > MAX_CITIZEN_ID_LENGTH) {
            return this.$t('user.form.import.citizenId.maxLength');
        }
        if (citizenId.toString().length < MIN_CITIZEN_ID_LENGTH) {
            return this.$t('user.form.import.citizenId.minLength');
        }
        if (
            this.importUserList.some(
                (importUser) =>
                    importUser.citizenId === citizenId && importUser.index !== index,
            )
        ) {
            return this.$t('user.form.import.citizenId.uniqueError');
        }
        return '';
    }

    validateSocialInsurance(socialInsurance?: string, index?: number): string {
        if (!socialInsurance) {
            return '';
        }
        if (!REGEX.NUMBER.test(socialInsurance)) {
            return this.$t('user.form.import.socialInsurance.invalid');
        }
        if (socialInsurance.toString().length > MAX_SOCIAL_INSURANCE_LENGTH) {
            return this.$t('user.form.import.socialInsurance.maxLength');
        }
        if (socialInsurance.toString().length < MIN_SOCIAL_INSURANCE_LENGTH) {
            return this.$t('user.form.import.socialInsurance.minLength');
        }
        if (
            this.importUserList.some(
                (importUser) =>
                    importUser.socialInsurance === socialInsurance &&
                    importUser.index !== index,
            )
        ) {
            return this.$t('user.form.import.socialInsurance.uniqueError');
        }
        return '';
    }

    validatePosition(position: string): string {
        if (!position) {
            return this.$t('user.form.import.position.required');
        }
        if (
            !userModule.userPositionList
                .map((position) => position.code)
                .includes(position)
        ) {
            return this.$t('user.form.import.position.invalid');
        }
        return '';
    }

    validateCitizenIdIssuedAt(citizenIdIssuedAt: string): string {
        if (!citizenIdIssuedAt) {
            return this.$t('user.form.import.citizenIdIssuedAt.required');
        }
        if (
            !moment(citizenIdIssuedAt, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH).isValid() ||
            !isNaN(+citizenIdIssuedAt)
        ) {
            return this.$t('user.form.import.citizenIdIssuedAt.invalid');
        }
        if (
            moment(citizenIdIssuedAt, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)?.isAfter(
                moment(),
            )
        ) {
            return this.$t('user.form.import.citizenIdIssuedAt.afterNow');
        }
        if (
            moment(citizenIdIssuedAt, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)?.isSameOrBefore(
                moment(this.MIN_DATE_PICKER).startOf('day'),
            )
        ) {
            return this.$t('user.form.import.citizenIdIssuedAt.minDate');
        }
        return '';
    }

    validateBirthday(birthday?: string): string {
        if (!birthday) {
            return '';
        }
        if (
            !moment(birthday, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)?.isValid() ||
            !isNaN(+birthday)
        ) {
            return this.$t('user.form.import.birthday.invalid');
        }
        if (
            moment(birthday, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)?.isSameOrAfter(
                moment().startOf('day'),
            )
        ) {
            return this.$t('user.form.import.birthday.afterNow');
        }
        if (
            moment(birthday, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)?.isSameOrBefore(
                moment(this.MIN_DATE_PICKER).startOf('day'),
            )
        ) {
            return this.$t('user.form.import.birthday.minDate');
        }
        return '';
    }

    validateAddress(address?: string): string {
        if (address && address.length > TEXTAREA_MAX_LENGTH) {
            return this.$t('user.form.import.address.maxLength');
        }
        return '';
    }

    validateHometownAddress(hometownAddress?: string): string {
        if (!hometownAddress) {
            return '';
        }
        if (hometownAddress?.length > TEXTAREA_MAX_LENGTH) {
            return this.$t('user.form.import.hometownAddress.maxLength');
        }
        return '';
    }

    validateIdCardIssuePlace(idCardIssuePlace: string): string {
        if (!idCardIssuePlace) {
            return this.$t('user.form.import.idCardIssuePlace.required');
        }
        if (idCardIssuePlace?.length > INPUT_TEXT_MAX_LENGTH) {
            return this.$t('user.form.import.idCardIssuePlace.maxLength');
        }
        return '';
    }

    validateRole(role: string): string {
        if (!role) {
            return this.$t('user.form.import.role.required');
        }
        if (role?.length > INPUT_TEXT_MAX_LENGTH) {
            return this.$t('user.form.import.role.maxLength');
        }
        return '';
    }

    validateNote(note?: string): string {
        if (note && note.length > TEXTAREA_MAX_LENGTH) {
            return this.$t('user.form.import.note.maxLength');
        }
        return '';
    }

    validateBank(bank: string): string {
        if (!bank) {
            return this.$t('user.form.import.bank.required');
        }
        if (!userModule.banks.map((bank) => bank.value).includes(bank)) {
            return this.$t('user.form.import.bank.invalid');
        }
        if (bank.length > INPUT_TEXT_MAX_LENGTH) {
            return this.$t('user.form.import.bank.maxLength');
        }
        return '';
    }

    validateProvince(province: string): string {
        if (!province) {
            return this.$t('user.form.import.province.required');
        }
        if (province?.length > INPUT_TEXT_MAX_LENGTH) {
            return this.$t('user.form.import.province.maxLength');
        }
        return '';
    }

    getUserPosition(userPosition: string): string {
        const currentPosition = userModule.userPositionList.find(
            (position) => position.code === userPosition,
        );
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return currentPosition?.value?.[currentLanguage] || userPosition;
    }

    getUserGender(userGender: string): string {
        const currentGender = UserGenderSettings.find(
            (gender) => gender.code === userGender,
        );
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return currentGender?.value?.[currentLanguage] || userGender;
    }

    async onClickSaveButton(): Promise<void> {
        this.isDisabledSaveButton = true;
        const importUsers = this.importUserList.map((importUser) => {
            return {
                ...importUser,
                phoneNumber: importUser.phoneNumber?.toString(),
                bankAccount: importUser.bankAccount?.toString(),
                citizenId: importUser.citizenId?.toString(),
                taxCode: importUser.taxCode?.toString(),
                socialInsurance: importUser.socialInsurance?.toString(),
                note: importUser.note?.toString(),
                birthday: importUser.birthday
                    ? moment(importUser.birthday, DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)
                          .utc()
                          .fmFullTimeString()
                    : '',
                citizenIdIssuedAt: importUser.citizenIdIssuedAt
                    ? moment(
                          importUser.citizenIdIssuedAt,
                          DATE_TIME_FORMAT.DD_MM_YYYY_SLASH,
                      )
                          .utc()
                          .fmFullTimeString()
                    : '',
            };
        });
        const response = await userApiService.importUsers({ importUsers: importUsers });

        if (response.success) {
            const importUserResponses = response.data.results;

            if (
                !Object.keys(importUserResponses).find(
                    (key) => !importUserResponses[key].isValid,
                )
            ) {
                this.showSuccessNotification(
                    this.$t('user.form.message.importUserSuccess') as string,
                );
                userModule.setIsOpenImportUserResultPopup(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await userModule.getUsers();
                loading.close();
                this.isDisabledSaveButton = false;
            } else {
                this.errors = parseImportErrors(importUserResponses);
                this.scrollToError('error');
            }
        } else {
            showErrorNotificationFunction(response.message as string);
        }
    }

    openPopup(): void {
        this.isDisabledSaveButton = false;
        this.validateData();
        this.scrollToError('error');
    }

    closePopup(): void {
        userModule.setIsOpenImportUserResultPopup(false);
        userModule.setImportUsers([]);
    }
}
</script>

<style lang="scss" scoped>
.error {
    color: rgb(219, 58, 104) !important;
    background-color: rgb(255, 203, 193);
}
.w-100 {
    height: 100%;
    width: 100%;
    padding: 8px 12px;
}
:deep(td.el-table__cell) {
    padding: 0px !important;
    .cell {
        height: 100%;
        width: 100%;
    }
}
</style>
