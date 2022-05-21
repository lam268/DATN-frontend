<template>
    <BaseSort
        :sort-options="sortOptions"
        @handleSort="handleSort"
        :order="DEFAULT_ORDER_BY"
    />
</template>

<script lang="ts">
import { ISelectOptions } from '@/common/types';
import { OrderDirection } from '@/common/constants';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { SortOptions } from '../constants';
import { contractModule } from '../store';
import { ContractMixins } from '../mixins';

@Options({})
export default class ContractSort extends mixins(ContractMixins) {
    get sortOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(SortOptions);
    }

    async handleSort(orderBy: string, orderDirection: OrderDirection): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        contractModule.setQueryString({
            orderBy,
            orderDirection,
        });
        await contractModule.getContractList();
        loading.close();
    }
}
</script>

<style lang="scss" scoped></style>
