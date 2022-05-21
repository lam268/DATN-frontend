<template>
    <el-dialog
        width="30%"
        v-model="isShowStopContractFormPopUp"
        @open="onOpenPopup"
        @closed="onClosedPopup"
        custom-class="stop-contract-form-popup"
        destroy-on-close
    >
        <template #title>
            <h3 class="text-left">
                {{ $t('contract.form.titleStop') }}
            </h3>
        </template>
        <BaseDatePicker
            v-model:value="form.stopDate"
            :error="translateYupError(form.errors.stopDate)"
            :is-required="true"
            :label="$t('contract.form.stopDate.label')"
            :placeholder="$t('contract.form.stopDate.placeholder')"
            :value-format="valueFormat"
            name="contractStopDate"
            :min-date="minDate"
            :max-date="maxDate"
        />
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
import { initData } from '../../composition/stopContractForm';
import { setup } from 'vue-class-component';
import { contractModule } from '../../store';
import { ContractStatus, initialSelectedContract } from '../../constants';
import { UtilMixins } from '@/mixins/utilMixins';
import moment from 'moment';
import { IContract } from '../../types';
import { contractApiService } from '../../services/api.service';
import { ElLoading } from 'element-plus';
export default class StopContractFormPopup extends UtilMixins {
    selectedContract: IContract = {
        id: NaN,
        userId: NaN,
        contractTypeId: NaN,
        startDate: '',
        endDate: '',
        stopDate: '',
        url: '',
        status: ContractStatus.ACTIVE,
    };

    form = setup(() => initData());

    get isCreate(): boolean {
        return !contractModule.selectedContract?.id;
    }

    get isShowStopContractFormPopUp(): boolean {
        return contractModule.isShowStopContractFormPopUp;
    }

    set isShowStopContractFormPopUp(isShow: boolean) {
        contractModule.setIsShowStopContractFormPopUp(isShow);
    }

    get minDate(): string {
        return moment(this.selectedContract.startDate).fmDayString();
    }

    get maxDate(): string | null {
        return this.selectedContract?.endDate
            ? moment(this.selectedContract.endDate).fmDayString()
            : null;
    }

    async onClickSaveButton(): Promise<void> {
        await this.form.onStop();
    }

    async onOpenPopup(): Promise<void> {
        if (contractModule.selectedContract?.id) {
            const loading = ElLoading.service({ target: '.contract-form-popup' });
            const contractDetail = await contractApiService.getDetail(
                contractModule.selectedContract.id,
            );
            loading.close();
            this.selectedContract = {
                id: contractDetail?.data?.id,
                userId: contractDetail?.data?.userId,
                contractTypeId: contractDetail?.data?.contractTypeId,
                startDate: contractDetail?.data?.startDate,
                endDate: contractDetail?.data?.endDate,
                stopDate: contractDetail?.data?.stopDate,
                url: contractDetail?.data?.url,
                status: contractDetail?.data?.status,
            };
        }
    }

    onClosedPopup(): void {
        this.isShowStopContractFormPopUp = false;
        contractModule.setSelectedContract(initialSelectedContract);
        (this.form.resetForm as () => void)();
    }

    onClickClosePopup(): void {
        this.isShowStopContractFormPopUp = false;
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
