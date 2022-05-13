import i18n from '@/plugins/vue-i18n';
import {
    parseDatePickerRangeValues,
    parseLanguageSelectOptions,
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { reactive } from 'vue';
import { RequestAbsenceTab, StatusOptions } from '../contants';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_SIZE_PER_PAGE,
    HttpStatus,
} from '@/common/constants';
import { requestAbsenceApiService } from '../services/request-absence.api.service';
import { ElLoading } from 'element-plus';
import { requestAbsenceModule } from '../store';

export async function confirmDeleteRequestAbsence(id: number): Promise<void> {
    const result = await showConfirmPopUpFunction(
        i18n.global.t('requestAbsence.list.confirmDelete.deleteConfirmText') as string,
        i18n.global.t('requestAbsence.list.confirmDelete.deleteConfirmTitle') as string,
        {},
    );
    if (result) {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await requestAbsenceApiService.delete(id);
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'requestAbsence.list.confirmDelete.success.message',
                ) as string,
            );
            await requestAbsenceModule.getRequestAbscenceList();
        } else {
            showErrorNotificationFunction(response.message);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                await requestAbsenceModule.getRequestAbscenceList();
            }
        }
        loading.close();
    }
}

export async function updateStatusRequestAbsence(
    id: number,
    status: string,
): Promise<void> {
    const result = await showConfirmPopUpFunction(
        i18n.global.t(`requestAbsence.list.confirmUpdate.${status}ConfirmText`) as string,
        i18n.global.t(
            `requestAbsence.list.confirmUpdate.${status}ConfirmTitle`,
        ) as string,
        {
            confirmButtonText: i18n.global.t(
                'requestAbsence.list.confirmUpdate.confirmButtonText',
            ) as string,
            cancelButtonText: i18n.global.t(
                'requestAbsence.list.confirmUpdate.cancelButtonText',
            ) as string,
        },
    );
    if (result) {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await requestAbsenceApiService.updateStatus(id, {
            status,
        });
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'requestAbsence.list.confirmUpdate.success.message',
                ) as string,
            );
            await requestAbsenceModule.getRequestAbscenceList();
        } else {
            showErrorNotificationFunction(response.message);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                await requestAbsenceModule.getRequestAbscenceList();
            }
        }
        loading.close();
    }
}

export function handleFilter(): Record<string, string | unknown> {
    const filterForm = reactive({
        keyword: '',
        status: [],
        startAt: [],
        endAt: [],
    });
    const statusOptions = parseLanguageSelectOptions(StatusOptions);

    const clearFilter = () => {
        filterForm.endAt = [];
        filterForm.keyword = '';
        filterForm.status = [];
        filterForm.startAt = [];
        requestAbsenceModule.setRequestAbsenceStatusFilterForm([]);
        requestAbsenceModule.clearFilter();
        applyFilter();
    };

    const applyFilter = async () => {
        const startAt = parseDatePickerRangeValues(filterForm.startAt);
        const endAt = parseDatePickerRangeValues(filterForm.endAt);
        requestAbsenceModule.setRequestAbsenceStatusFilterForm(filterForm.status);
        filterForm.keyword = filterForm.keyword?.trim();
        requestAbsenceModule.setQueryString({
            keyword: filterForm.keyword?.length ? filterForm.keyword : null,
            startAt,
            endAt,
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
        if (requestAbsenceModule.selectedTab === RequestAbsenceTab.HISTORY) {
            requestAbsenceModule.setQueryString({
                status: filterForm.status?.length ? filterForm.status : [],
            });
        }
        const loading = ElLoading.service({
            target: '.content',
        });
        await requestAbsenceModule.getRequestAbscenceList();
        loading.close();
    };

    return {
        filterForm,
        statusOptions,
        applyFilter,
        clearFilter,
    };
}
