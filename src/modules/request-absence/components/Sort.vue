<template>
    <BaseSort
        :sort-options="sortOptions"
        :placeholder="$t('requestAbsence.list.sort.sort')"
        @handleSort="handleSort"
        order="id"
    />
</template>

<script lang="ts">
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '@/common/constants';
import { ISelectOptions } from '@/common/types';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import { RequestAbsenceSortOptions } from '../contants';
import { requestAbsenceModule } from '../store';

@Options({})
export default class RequestAbsenceSort extends Vue {
    get sortOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(RequestAbsenceSortOptions);
    }

    async handleSort(orderBy: string, orderDirection: OrderDirection): Promise<void> {
        requestAbsenceModule.setQueryString({
            orderBy,
            orderDirection,
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
        const loading = ElLoading.service({
            target: '.content',
        });
        await requestAbsenceModule.getRequestAbscenceList();
        loading.close();
    }
}
</script>
