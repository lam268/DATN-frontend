<template>
    <BaseSort
        :sortOptions="sortOptions"
        :placeholder="$t('user.list.filterForm.sort.placeholder')"
        @handleSort="state.handleSort"
    />
</template>

<script lang="ts">
import { OrderDirectionText, SortOptions } from '@/modules/user/constants';
import { OrderDirection } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { Options, setup, Vue } from 'vue-class-component';
import { userModule } from '../store';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { ISelectOptions } from '@/common/types';

@Options({})
export default class Sort extends Vue {
    get sortOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(SortOptions);
    }

    state = setup(() => {
        const handleSort = async (orderBy: string, orderDirection: OrderDirection) => {
            userModule.setOrder({
                orderBy,
                orderDirection,
            });
            const loading = ElLoading.service({
                target: '.content',
            });
            await userModule.getUsers();
            loading.close();
        };

        return {
            handleSort,
            OrderDirectionText,
        };
    });
}
</script>

<style lang="scss" scoped></style>
