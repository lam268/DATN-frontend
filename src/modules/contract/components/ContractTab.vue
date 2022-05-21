<template>
    <el-tabs :before-leave="handleChangeTab" v-model="activeTab" class="contract-tab">
        <el-tab-pane
            :label="$t('contract.list.title.viewByContract')"
            :name="CONTRACT_TABS.VIEW_BY_CONTRACT"
        >
            <ContractTable />
        </el-tab-pane>
        <el-tab-pane
            :label="$t('contract.list.title.viewByUser')"
            :name="CONTRACT_TABS.VIEW_BY_USER"
        >
            <ContractTableByUser />
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts">
import { ElLoading } from 'element-plus';
import { Options } from 'vue-class-component';
import { Emit, mixins } from 'vue-property-decorator';
import { CONTRACT_TABS } from '../constants';
import { ContractMixins } from '../mixins';
import { contractModule } from '../store';
import { ContractGroupBy } from '../types';
import ContractTable from './ContractTable.vue';
import ContractTableByUser from './ContractTableByUser.vue';

@Options({
    components: {
        ContractTable,
        ContractTableByUser,
    },
})
export default class ContractTab extends mixins(ContractMixins) {
    activeTab = CONTRACT_TABS.VIEW_BY_CONTRACT;

    async handleChangeTab(tab: CONTRACT_TABS): Promise<void> {
        this.onChangeCurrentTab(tab);
        contractModule.setQueryString({
            groupBy:
                tab === CONTRACT_TABS.VIEW_BY_USER
                    ? ContractGroupBy.USER
                    : ContractGroupBy.CONTRACT,
        });

        const loading = ElLoading.service({
            target: '.content',
        });
        await contractModule.getContractList();
        loading.close();
    }

    @Emit('changeTab')
    onChangeCurrentTab(tabName: CONTRACT_TABS): CONTRACT_TABS {
        return tabName;
    }
}
</script>
<style lang="scss" scoped>
.contract-tab {
    border-right: 0;
    border-left: 0;

    @media only screen and (max-width: 991.98px) {
        margin: 0 -15px;
    }
}
</style>
