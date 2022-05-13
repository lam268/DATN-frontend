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
                                :content="validateFullName(scope.row.fullName)"
                                placement="bottom"
                                v-if="validateFullName(scope.row.fullName)"
                            >
                                <div class="error w-100">! {{ scope.row.fullName }}</div>
                            </el-tooltip>
                            <div class="w-100" v-else>{{ scope.row.fullName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('user.form.email.label')" min-width="250">
                        <template #default="scope">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="validateEmail(scope.row.email, scope.row.index)"
                                placement="bottom"
                                v-if="validateEmail(scope.row.email, scope.row.index)"
                            >
                                <div class="error w-100">! {{ scope.row.email }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'email',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'email',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.email }}</div>
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
                                :content="validatePhoneNumber(scope.row.phoneNumber)"
                                placement="bottom"
                                v-if="validatePhoneNumber(scope.row.phoneNumber)"
                            >
                                <div class="w-100 error">
                                    ! {{ scope.row.phoneNumber }}
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
                                :content="validateBirthday(scope.row.birthday)"
                                placement="bottom"
                                v-if="validateBirthday(scope.row.birthday)"
                            >
                                <div class="w-100 error">! {{ scope.row.birthday }}</div>
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
                                :content="validateGender(scope.row.gender)"
                                placement="bottom"
                                v-if="validateGender(scope.row.gender)"
                            >
                                <div class="error w-100">! {{ scope.row.gender }}</div>
                            </el-tooltip>
                            <div class="w-100" v-else>
                                {{
                                    $t(`user.list.filterForm.gender.${scope.row.gender}`)
                                }}
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
                                :content="validatePosition(scope.row.position)"
                                placement="bottom"
                                v-if="validatePosition(scope.row.position)"
                            >
                                <div class="error w-100">! {{ scope.row.position }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'position',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'position',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">
                                    ! {{ getUserPosition(scope.row.position) }}
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
                                :content="validateRole(scope.row.role)"
                                placement="bottom"
                                v-if="validateRole(scope.row.role)"
                            >
                                <div class="error w-100">! {{ scope.row.role }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'role',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'role',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.role }}</div>
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
                                :content="
                                    validateBankAccount(
                                        scope.row.bankAccount,
                                        scope.row.index,
                                    )
                                "
                                placement="bottom"
                                v-if="
                                    validateBankAccount(
                                        scope.row.bankAccount,
                                        scope.row.index,
                                    )
                                "
                            >
                                <div class="error w-100">
                                    ! {{ scope.row.bankAccount }}
                                </div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'bankAccount',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'bankAccount',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">
                                    ! {{ scope.row.bankAccount }}
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
                                :content="validateBank(scope.row.bank)"
                                placement="bottom"
                                v-if="validateBank(scope.row.bank)"
                            >
                                <div class="error w-100">! {{ scope.row.bank }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'bank',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'bank',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.bank }}</div>
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
                                :content="
                                    validateCitizenId(
                                        scope.row.citizenId,
                                        scope.row.index,
                                    )
                                "
                                placement="bottom"
                                v-if="
                                    validateCitizenId(
                                        scope.row.citizenId,
                                        scope.row.index,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.citizenId }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'citizenId',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'citizenId',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.citizenId }}</div>
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
                                :content="
                                    validateCitizenIdIssuedAt(scope.row.citizenIdIssuedAt)
                                "
                                placement="bottom"
                                v-if="
                                    validateCitizenIdIssuedAt(scope.row.citizenIdIssuedAt)
                                "
                            >
                                <div class="w-100 error">
                                    ! {{ scope.row.citizenIdIssuedAt }}
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
                                :content="
                                    validateIdCardIssuePlace(scope.row.idCardIssuePlace)
                                "
                                placement="bottom"
                                v-if="
                                    validateIdCardIssuePlace(scope.row.idCardIssuePlace)
                                "
                            >
                                <div class="w-100 error">
                                    ! {{ scope.row.idCardIssuePlace }}
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
                                :content="validateAddress(scope.row.address)"
                                placement="bottom"
                                v-if="validateAddress(scope.row.address)"
                            >
                                <div class="w-100 error">! {{ scope.row.address }}</div>
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
                                :content="
                                    validateHometownAddress(scope.row.hometownAddress)
                                "
                                placement="bottom"
                                v-if="validateHometownAddress(scope.row.hometownAddress)"
                            >
                                <div class="w-100 error">
                                    ! {{ scope.row.hometownAddress }}
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
                                :content="
                                    validateTaxCode(scope.row.taxCode, scope.row.index)
                                "
                                placement="bottom"
                                v-if="validateTaxCode(scope.row.taxCode, scope.row.index)"
                            >
                                <div class="error w-100">! {{ scope.row.taxCode }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'taxCode',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'taxCode',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.taxCode }}</div>
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
                                :content="
                                    validateSocialInsurance(
                                        scope.row.socialInsurance,
                                        scope.row.index,
                                    )
                                "
                                placement="bottom"
                                v-if="
                                    validateSocialInsurance(
                                        scope.row.socialInsurance,
                                        scope.row.index,
                                    )
                                "
                            >
                                <div class="error w-100">
                                    ! {{ scope.row.socialInsurance }}
                                </div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'socialInsurance',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'socialInsurance',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">
                                    ! {{ scope.row.socialInsurance }}
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
                                :content="validateProvince(scope.row.province)"
                                placement="bottom"
                                v-if="validateProvince(scope.row.province)"
                            >
                                <div class="error w-100">! {{ scope.row.province }}</div>
                            </el-tooltip>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="
                                    getImportErrorByFieldName(
                                        'province',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                                placement="bottom"
                                v-else-if="
                                    getImportErrorByFieldName(
                                        'province',
                                        importErrors?.[scope.row.index]?.errors,
                                    )
                                "
                            >
                                <div class="error w-100">! {{ scope.row.province }}</div>
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
                                :content="validateNote(scope.row.note)"
                                placement="bottom"
                                v-if="validateNote(scope.row.note)"
                            >
                                <div class="w-100 error">! {{ scope.row.note }}</div>
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
import { IImportError, IImportResponse } from '@/common/types';
import { showErrorNotificationFunction } from '@/utils/helper';
import { userModule } from '../store';
import { IImportUser } from '../types';
import { UserGender } from '../constants';
import { userApiService } from '../services/api.service';

@Options({})
export default class ImportUserResultPopup extends mixins(UtilMixins) {
    importErrors: Record<string, IImportResponse> | null = null;

    isDisabledSaveButton = false;

    get importUserList(): IImportUser[] {
        return userModule.importUsers;
    }

    get isOpenImportUserResultPopUp(): boolean {
        return userModule.isOpenImportUserResultPopUp;
    }

    get hasError(): boolean {
        let hasError = false;
        this.importUserList.forEach((importUser) => {
            const userPosition = userModule.userPositionList.find(
                (position) =>
                    position.value.en === importUser.position ||
                    position.value.vi === importUser.position,
            );

            if (userPosition) {
                importUser.position = userPosition.code;
            } else {
                hasError = true;
            }

            if (
                this.validateEmail(importUser.email, importUser.index) ||
                this.validateFullName(importUser.fullName) ||
                this.validatePhoneNumber(importUser.phoneNumber) ||
                this.validateBirthday(importUser.birthday) ||
                this.validateCitizenId(importUser.citizenId, importUser.index) ||
                this.validateCitizenIdIssuedAt(importUser.citizenIdIssuedAt) ||
                this.validateAddress(importUser.address) ||
                this.validateIdCardIssuePlace(importUser.idCardIssuePlace) ||
                this.validateGender(importUser.gender) ||
                this.validateRole(importUser.role) ||
                this.validatePosition(importUser.position) ||
                this.validateNote(importUser.note) ||
                this.validateSocialInsurance(
                    importUser.socialInsurance,
                    importUser.index,
                ) ||
                this.validateTaxCode(importUser.taxCode, importUser.index) ||
                this.validateBankAccount(importUser.bankAccount, importUser.index) ||
                this.validateBank(importUser.bank) ||
                this.validateProvince(importUser.province)
            ) {
                hasError = true;
            }
        });
        return hasError;
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

    validateHometownAddress(hometownAddress: string): string {
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
        if (bank?.length > INPUT_TEXT_MAX_LENGTH) {
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

    getImportErrorByFieldName(fieldName: string, errors: IImportError[]): string {
        if (!errors) {
            return '';
        }
        return errors.find((error) => error.column === fieldName)?.errorMessage || '';
    }

    async onClickSaveButton(): Promise<void> {
        this.isDisabledSaveButton = true;
        const importUsers = this.importUserList.map((importUser) => {
            return {
                ...importUser,
                phoneNumber: importUser.phoneNumber
                    ? importUser.phoneNumber.toString()
                    : '',
                bankAccount: importUser.bankAccount
                    ? importUser.bankAccount.toString()
                    : '',
                citizenId: importUser.citizenId ? importUser.citizenId.toString() : '',
                taxCode: importUser.taxCode ? importUser.taxCode.toString() : '',
                socialInsurance: importUser.socialInsurance
                    ? importUser.socialInsurance.toString()
                    : '',
                note: importUser.note ? importUser.note.toString() : '',
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
                this.importErrors = importUserResponses;
            }
        } else {
            showErrorNotificationFunction(response.message as string);
        }
    }

    openPopup(): void {
        this.isDisabledSaveButton = false;
        this.importErrors = null;
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
    :deep(.cell) {
        height: 100%;
        width: 100%;
        padding: 0px !important;
    }
}
</style>
