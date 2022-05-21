<template>
    <BaseFilterFormLayout
        :isToggleFilterForm="isToggleFilterForm"
        @search="handleFilter"
        @reset="resetFilter"
        @keyup.enter="handleFilter"
    >
        <template #filter-title>
            <h5 class="filter-title">
                {{ $t('common.app.filterForm.search') }}
            </h5>
        </template>
        <slot>
            <div class="action-group">
                <div class="row">
                    <div class="col-xl-4 col-md-4 col-12">
                        <label
                            class="text-start w-100 fw-bold"
                            style="margin-bottom: 8px"
                            >{{ $t('contract.list.filterForm.startDate.label') }}</label
                        >
                        <BaseDatePickerRange
                            v-model:value="startDateRange"
                            size="medium"
                            :range-separator="$t('contract.list.filterForm.to')"
                            :start-placeholder="
                                $t('contract.list.filterForm.startDate.placeholder')
                            "
                            :end-placeholder="
                                $t('contract.list.filterForm.endDate.placeholder')
                            "
                        />
                    </div>
                    <div class="col-xl-4 col-md-4 col-12">
                        <label
                            class="text-start w-100 fw-bold"
                            style="margin-bottom: 8px"
                            >{{ $t('contract.list.filterForm.endDate.label') }}</label
                        >
                        <BaseDatePickerRange
                            v-model:value="endDateRange"
                            size="medium"
                            :range-separator="$t('contract.list.filterForm.to')"
                            :start-placeholder="
                                $t('contract.list.filterForm.startDate.placeholder')
                            "
                            :end-placeholder="
                                $t('contract.list.filterForm.endDate.placeholder')
                            "
                        />
                    </div>
                    <div class="col-xl-4 col-md-4 col-12">
                        <label
                            class="text-start w-100 fw-bold"
                            style="margin-bottom: 8px"
                            >{{ $t('contract.list.filterForm.stopDate.label') }}</label
                        >
                        <BaseDatePickerRange
                            v-model:value="stopDateRange"
                            size="medium"
                            :range-separator="$t('contract.list.filterForm.to')"
                            :start-placeholder="
                                $t('contract.list.filterForm.startDate.placeholder')
                            "
                            :end-placeholder="
                                $t('contract.list.filterForm.endDate.placeholder')
                            "
                        />
                    </div>
                </div>
                <div class="row pt-2">
                    <div class="col-xl-4 col-md-4 col-12">
                        <BaseMultipleSelect
                            v-model:value="contractTypeIds"
                            :label="$t('contract.list.filterForm.type.label')"
                            :options="contractTypeOptions"
                            :placeholder="$t('contract.list.filterForm.type.placeholder')"
                            :filterable="true"
                            @keyup.enter="handleFilter"
                        />
                    </div>
                    <div class="col-xl-4 col-md-4 col-12">
                        <BaseMultipleSelect
                            v-model:value="statuses"
                            :label="$t('contract.list.filterForm.status.label')"
                            :options="statusOptions"
                            :placeholder="
                                $t('contract.list.filterForm.status.placeholder')
                            "
                            @keyup.enter="handleFilter"
                        />
                    </div>
                    <div class="col-xl-4 col-md-4 col-12">
                        <BaseMultipleSelect
                            v-model:value="userIds"
                            :options="userOptions"
                            :filterable="true"
                            :placeholder="
                                $t('contract.list.filterForm.employee.placeholder')
                            "
                            :label="$t('contract.list.filterForm.employee.label')"
                            @keyup.enter="handleFilter"
                        />
                    </div>
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { ElLoading } from 'element-plus';
import { Prop } from 'vue-property-decorator';
import { mixins, Options } from 'vue-class-component';
import { StatusOptions, CONTRACTS_SIZE_PER_PAGE } from '../constants';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { contractModule } from '../store';
import { parseLanguageSelectOptions, parseSelectOptions } from '@/utils/helper';
import { ISelectOptions } from '@/common/types';
import { UtilMixins } from '@/mixins/utilMixins';

@Options({})
export default class ContractFilterForm extends mixins(UtilMixins) {
    @Prop({ default: false }) readonly isToggleFilterForm!: boolean;
    @Prop({ default: true }) readonly isShowCreateButton!: boolean;
    get contractTypeOptions(): ISelectOptions[] {
        return parseSelectOptions(contractModule.contractTypeOptions);
    }

    get userOptions(): ISelectOptions[] {
        return parseSelectOptions(contractModule.userOptions);
    }

    get statusOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(StatusOptions);
    }

    // filter form variables
    userIds = [];
    contractTypeIds = [];
    statuses = [];
    startDateRange = [];
    stopDateRange = [];
    endDateRange = [];

    async resetFilter(): Promise<void> {
        this.userIds = [];
        this.contractTypeIds = [];
        this.statuses = [];
        this.startDateRange = [];
        this.stopDateRange = [];
        this.endDateRange = [];
        const loading = ElLoading.service({
            target: '.content',
        });
        contractModule.resetQueryString();
        await contractModule.getContractList();
        loading.close();
    }

    // filter form event
    async handleFilter(): Promise<void> {
        const startDate = this.parseDatePickerRangeValues(this.startDateRange);
        const stopDate = this.parseDatePickerRangeValues(this.stopDateRange);
        const endDate = this.parseDatePickerRangeValues(this.endDateRange);
        const loading = ElLoading.service({
            target: '.content',
        });
        contractModule.setQueryString({
            limit: CONTRACTS_SIZE_PER_PAGE,
            page: DEFAULT_FIRST_PAGE,
            userIds: this.userIds,
            contractTypeIds: this.contractTypeIds,
            startDate,
            endDate,
            stopDate,
            statuses: this.statuses,
        });
        await contractModule.getContractList();
        loading.close();
    }

    onClickCreateButton(): void {
        this.$emit('create');
    }
}
</script>

<style lang="scss" scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}
.el-input-group {
    margin-top: 30px;
}
.el-button {
    width: 120px;
}
.el-button--default {
    width: 50px;
}
.mt-20 {
    margin-top: 20px;
    margin-bottom: 10px;
}
.cp-button {
    margin-left: 10px;
    .el-button {
        width: 120px;
    }
}
.form-group {
    margin-bottom: 10px !important;
}
:deep(label) {
    font-size: 13px;
}
</style>
