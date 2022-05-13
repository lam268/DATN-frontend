<template>
    <BaseSort
        :sort-options="sortOptions"
        :placeholder="$t('timekeeping.list.sort.sort')"
        @handleSort="handleSort"
        order="userId"
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
import { TimeKeepingSortOptions } from '../contants';
import { timeKeepingModule } from '../store';

@Options({})
export default class TimeKeepingSort extends Vue {
    get sortOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(TimeKeepingSortOptions);
    }

    async handleSort(orderBy: string, orderDirection: OrderDirection): Promise<void> {
        timeKeepingModule.setTimeKeepingQueryString({
            orderBy,
            orderDirection,
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
        });
        const loading = ElLoading.service({
            target: '.content',
        });
        await timeKeepingModule.getTimeKeepingList();
        loading.close();
    }
}
</script>
