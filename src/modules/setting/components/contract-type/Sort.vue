<template>
    <BaseSort :sort-options="sortOptions" @handleSort="handleSort" />
</template>

<script lang="ts">
import { OrderDirection } from '@/common/constants';
import { ISelectOptions } from '@/common/types';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import { SortOptions } from '../../constant';
import { contractTypeModule } from '../../store/contractType.store';

@Options({})
export default class ContractTypeSort extends Vue {
    get sortOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(SortOptions);
    }

    async handleSort(orderBy: string, orderDirection: OrderDirection): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        contractTypeModule.setQueryString({
            orderBy,
            orderDirection,
        });
        await contractTypeModule.getContractTypeList();
        loading.close();
    }
}
</script>

<style lang="scss" scoped></style>
