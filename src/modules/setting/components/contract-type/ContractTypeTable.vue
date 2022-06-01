<template>
    <BaseTableLayout :data="tableData">
        <template #table-columns>
            <el-table-column
                prop="name"
                :label="$t('setting.contractType.fields.name')"
            />
            <el-table-column
                prop="description"
                :label="$t('setting.contractType.fields.description')"
            />
            <el-table-column
                prop="expiredIn"
                width="180"
                :label="$t('setting.contractType.fields.expiredIn')"
            />
            <el-table-column
                prop="paidLeaveDays"
                :label="$t('setting.contractType.fields.paidLeaveDays')"
                align="center"
                min-width="120"
            />
            <el-table-column
                fixed="right"
                width="150"
                align="center"
                :label="$t('setting.contractType.fields.action')"
                v-if="isCanUpdate"
            >
                <template #default="scope">
                    <div
                        class="button-group"
                        v-if="isCanUpdate"
                        :class="checkFullPermissionActions() ? 'group-left' : ''"
                    >
                        <el-tooltip
                            effect="dark"
                            :content="$t('setting.contractType.fields.tooltip.edit')"
                            placement="top"
                        >
                            <el-button
                                type="warning"
                                size="mini"
                                @click="updateContractType(scope.row)"
                            >
                                <EditIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('setting.contractType.fields.tooltip.delete')"
                            placement="top"
                        >
                            <el-button
                                type="danger"
                                size="mini"
                                @click="deleteContractType(scope.row.id)"
                            >
                                <DeleteIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { Options, setup, Vue } from 'vue-class-component';
import { setupDelete } from '../../compositions/contract-type/contractTypeList';
import { IContractType, IContractTypeUpdate } from '../../type';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { contractTypeModule } from '../../store/contractType.store';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
    },
})
export default class ContractTypeTable extends Vue {
    get tableData(): IContractType[] {
        return contractTypeModule.contractTypeList;
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(contractTypeModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }

    deleteAction = setup(() => setupDelete());

    updateContractType(data: IContractTypeUpdate): void {
        contractTypeModule.setSelectedContractType(data);
        contractTypeModule.setIsShowContractTypeFormPopUp(true);
    }

    deleteContractType(id: number): void {
        this.deleteAction.deleteContractType(id);
    }

    checkFullPermissionActions(): boolean {
        return checkUserHasPermission(contractTypeModule.userPermissions, [
            `${PermissionResources.SETTING}_${PermissionActions.UPDATE}`,
        ]);
    }
}
</script>

<style lang="scss" scoped>
.action-icon {
    height: 1em;
    width: 1em;
}
.button-group {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
    align-items: center;
}
.group-left {
    justify-content: space-between;
}
</style>
