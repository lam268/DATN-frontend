<template>
    <BaseFilterFormLayout
        :isToggleFilterForm="isToggleFilterForm"
        @search="state.applyFilter"
        @reset="state.clearFilter"
        @keyup.enter="state.applyFilter"
    >
        <template #filter-title>
            <h5 class="filter-title">{{ $t('common.app.filterForm.search') }}</h5>
        </template>
        <slot>
            <div class="row" v-if="isCanUpdateStatus">
                <div
                    class="col-12 mb-sm-2"
                    :class="{
                        'col-xl-6': isHistoryTab,
                        'col-md-6': isHistoryTab,
                        'col-xl-12': !isHistoryTab,
                        'col-md-12': !isHistoryTab,
                    }"
                >
                    <BaseInputText
                        v-model:value="state.filterForm.keyword"
                        :label="$t('requestAbsence.list.filterForm.keyword.label')"
                        :placeholder="
                            $t('requestAbsence.list.filterForm.keyword.placeholder')
                        "
                    />
                </div>
                <div class="col-xl-6 col-md-6 col-12 mb-sm-2" v-if="isHistoryTab">
                    <BaseMultipleSelect
                        :label="$t('requestAbsence.list.filterForm.status.label')"
                        v-model:value="state.filterForm.status"
                        :placeholder="
                            $t('requestAbsence.list.filterForm.status.placeholder')
                        "
                        :options="state.statusOptions"
                        name="option"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-xl-6 col-md-6 col-12 mb-sm-2">
                    <BaseDatePickerRange
                        :label="$t('requestAbsence.list.title.startAt')"
                        v-model:value="state.filterForm.startAt"
                        size="medium"
                        :range-separator="$t('requestAbsence.list.filterForm.to')"
                        :start-placeholder="
                            $t('requestAbsence.list.filterForm.startDate.placeholder')
                        "
                        :end-placeholder="
                            $t('requestAbsence.list.filterForm.endDate.placeholder')
                        "
                        :max-date="state.filterForm.endAt"
                    />
                </div>
                <div class="col-xl-6 col-md-6 col-12 mb-sm-2">
                    <BaseDatePickerRange
                        :label="$t('requestAbsence.list.title.endAt')"
                        v-model:value="state.filterForm.endAt"
                        size="medium"
                        :range-separator="$t('requestAbsence.list.filterForm.to')"
                        :start-placeholder="
                            $t('requestAbsence.list.filterForm.startDate.placeholder')
                        "
                        :end-placeholder="
                            $t('requestAbsence.list.filterForm.endDate.placeholder')
                        "
                    />
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { Options, setup, Vue } from 'vue-class-component';
import { handleFilter } from '@/modules/request-absence/composition/requestAbsence';
import { Prop } from 'vue-property-decorator';
import { RequestAbsenceTab } from '../contants';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { requestAbsenceModule } from '../store';
import { checkUserHasPermission } from '@/utils/helper';
@Options({})
export default class FilterForm extends Vue {
    @Prop({ default: false }) readonly isToggleFilterForm!: boolean;
    @Prop({ default: false }) readonly isActive!: boolean;

    state = setup(() => {
        const { filterForm, statusOptions, applyFilter, clearFilter } = handleFilter();
        return {
            filterForm,
            statusOptions,
            applyFilter,
            clearFilter,
        };
    });

    get selectedTab(): string {
        return requestAbsenceModule.selectedTab;
    }

    get isCanUpdateStatus(): boolean {
        return checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_STATUS}`,
        ]);
    }

    get isHistoryTab(): boolean {
        return this.selectedTab === RequestAbsenceTab.HISTORY;
    }
}
</script>
<style scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}

.btn-search {
    width: 160px;
}
:deep(label) {
    font-size: 13px;
}
.form-group {
    margin-bottom: 10px !important;
}
</style>
