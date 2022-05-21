<template>
    <el-dialog
        width="50%"
        v-model="isShowContractFormPopUp"
        @open="form.openPopup"
        @closed="onClosedPopup"
        custom-class="contract-form-popup"
        destroy-on-close
    >
        <template #title>
            <h3 class="text-left">
                {{
                    isCreate ? $t('contract.form.title') : $t('contract.form.titleUpdate')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-6">
                <BaseSingleSelect
                    v-model:value="form.userId"
                    :error="translateYupError(form.errors.userId)"
                    :options="userOptions"
                    :filterable="true"
                    :is-required="true"
                    :isDisabled="!isCreate"
                    :label="$t('contract.form.employee.label')"
                    :placeholder="$t('contract.form.employee.placeholder')"
                    name="contractUserName"
                />
            </div>
            <div class="col-md-6">
                <BaseSingleSelect
                    :filterable="true"
                    v-model:value="form.contractTypeId"
                    :error="translateYupError(form.errors.contractTypeId)"
                    :is-required="true"
                    :options="contractTypeOptions"
                    :label="$t('contract.form.type.label')"
                    :placeholder="$t('contract.form.type.placeholder')"
                    name="contractTypeId"
                />
            </div>
            <div class="col-md-6">
                <BaseDatePicker
                    v-model:value="form.startDate"
                    :error="translateYupError(form.errors.startDate)"
                    :is-required="true"
                    :label="$t('contract.form.startDate.label')"
                    :placeholder="$t('contract.form.startDate.placeholder')"
                    :value-format="valueFormat"
                    name="contractStartDate"
                    :min-date="CONTRACT_MIN_DATE"
                />
            </div>
            <div class="col-md-6">
                <BaseInputText
                    v-model:value="form.url"
                    :error="translateYupError(form.errors.url)"
                    :is-required="true"
                    :label="$t('contract.form.url.label')"
                    :placeholder="$t('contract.form.url.placeholder')"
                    name="contractUrl"
                    :maxLength="INPUT_URL_MAX_LENGTH"
                />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="onClickClosePopup">
                            {{ $t('contract.form.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button type="primary" @click="onClickSaveButton()">
                            {{ $t('contract.form.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initData } from '../../composition/formPopup';
import { setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { contractModule } from '../../store';
import { initialSelectedContract } from '../../constants';
import { parseSelectOptions } from '@/utils/helper';
import { ISelectOptions } from '@/common/types';
import { ContractMixins } from '../../mixins';
export default class ContractFormPopup extends mixins(ContractMixins) {
    form = setup(() => initData());

    get isCreate(): boolean {
        return !contractModule.selectedContract?.id;
    }

    get isShowContractFormPopUp(): boolean {
        return contractModule.isShowContractFormPopUp || false;
    }

    set isShowContractFormPopUp(val: boolean) {
        contractModule.setIsShowContractFormPopUp(val);
    }

    get contractTypeOptions(): ISelectOptions[] {
        return parseSelectOptions(contractModule.contractTypeOptions);
    }

    get userOptions(): ISelectOptions[] {
        return parseSelectOptions(contractModule.userOptions);
    }

    async onClickSaveButton(): Promise<void> {
        await this.form.onSubmit();
    }

    onClosedPopup(): void {
        this.isShowContractFormPopUp = false;
        contractModule.setSelectedContract(initialSelectedContract);
        (this.form.resetForm as () => void)();
    }

    onClickClosePopup(): void {
        this.isShowContractFormPopUp = false;
    }
}
</script>
<style scoped>
@media (max-width: 1199.98px) {
    :deep(.el-dialog) {
        width: 80%;
    }
}
.text-left {
    text-align: left;
}
</style>
