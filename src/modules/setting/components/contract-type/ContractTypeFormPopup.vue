<template>
    <el-dialog
        width="50%"
        v-model="isShowContractTypeFormPopUp"
        :before-close="closePopup"
        @open="form.openPopup"
        custom-class="contract-type-form-popup"
        destroy-on-close
    >
        <template #title>
            <h3 class="text-left">
                {{
                    form.isCreate
                        ? $t('setting.contractType.fields.createTitle')
                        : $t('setting.contractType.fields.updateTitle')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-4">
                <BaseInputText
                    v-model:value="form.name"
                    :error="translateYupError(form.errors.name)"
                    :is-required="true"
                    :label="$t('setting.contractType.fields.name')"
                    :placeholder="$t('setting.contractType.fields.placeholder.name')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputNumber
                    v-model:value="form.expiredIn"
                    :is-required="false"
                    :label="$t('setting.contractType.fields.expiredIn')"
                    :error="translateYupError(form.errors.expiredIn)"
                    @keydown="preventInput"
                    :placeholder="$t('setting.contractType.fields.placeholder.expiredIn')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputNumber
                    v-model:value="form.paidLeaveDays"
                    :is-required="true"
                    :label="$t('setting.contractType.fields.paidLeaveDays')"
                    :error="translateYupError(form.errors.paidLeaveDays)"
                    @keydown="preventInput"
                    :placeholder="
                        $t('setting.contractType.fields.placeholder.paidLeaveDays')
                    "
                />
            </div>
            <div class="col-md-12">
                <BaseInputTextarea
                    v-model:value="form.description"
                    :error="translateYupError(form.errors.description)"
                    :label="$t('setting.contractType.fields.description')"
                    :placeholder="
                        $t('setting.contractType.fields.placeholder.description')
                    "
                />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="closePopup">
                            {{ $t('setting.contractType.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            :disabled="isDisabledSaveButton"
                            type="primary"
                            @click="onClickSaveButton"
                        >
                            {{ $t('setting.contractType.button.save') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initData } from '../../compositions/contract-type/contractTypeForm';
import { setup } from 'vue-class-component';
import { UtilMixins } from '@/mixins/utilMixins';
import { contractTypeModule } from '../../store/contractType.store';

export default class ContractTypeFormPopup extends UtilMixins {
    get isDisabledSaveButton(): boolean {
        return contractTypeModule.isDisabledSaveButton;
    }

    get isShowContractTypeFormPopUp(): boolean {
        return contractTypeModule.isShowContractTypeFormPopUp || false;
    }

    set isShowContractTypeFormPopUp(val: boolean) {
        contractTypeModule.setIsShowContractTypeFormPopUp(val);
    }

    form = setup(() => initData());

    closePopup(): void {
        contractTypeModule.setIsShowContractTypeFormPopUp(false);
        contractTypeModule.setSelectedContractType(null);
        (this.form.resetForm as () => void)();
        contractTypeModule.setIsDisabledSaveButton(false);
    }

    async onClickSaveButton(): Promise<void> {
        contractTypeModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        contractTypeModule.setIsDisabledSaveButton(false);
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
