<template>
    <BaseTableLayout :data="tableData" :objectSpanMethod="objectSpanMethod">
        <template #table-columns>
            <el-table-column
                prop="user.fullName"
                :label="$t('contract.list.contractTable.header.employee')"
                min-width="150px"
            />
            <el-table-column
                prop="contractType.name"
                :label="$t('contract.list.contractTable.header.contractType')"
                min-width="200px"
            />
            <el-table-column
                prop="startDate"
                :label="$t('contract.list.contractTable.header.startDate')"
                min-width="150px"
                align="center"
            >
                <template #default="scope">
                    <span> {{ formatDate(scope.row.startDate) }} </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="endDate"
                :label="$t('contract.list.contractTable.header.endDate')"
                min-width="150px"
                align="center"
            >
                <template #default="scope">
                    <span> {{ formatDate(scope.row.endDate) }} </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="stopDate"
                :label="$t('contract.list.contractTable.header.stopDate')"
                min-width="150px"
                align="center"
            >
                <template #default="scope">
                    <span> {{ formatDate(scope.row.stopDate) }} </span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('contract.list.contractTable.header.url')"
                min-width="220"
                align="center"
            >
                <template #default="scope">
                    <a
                        class="contract-url"
                        :href="scope.row.url"
                        target="_blank"
                        v-if="scope.row.url"
                        >{{ $t('billing.form.button.clickHere') }}</a
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                :label="$t('contract.list.contractTable.header.status')"
                width="250"
                align="center"
            >
                <template #default="scope">
                    <el-tooltip
                        effect="dark"
                        :content="
                            $t(
                                'contract.list.contractTable.tooltip.'.concat(
                                    scope.row.status,
                                ),
                            )
                        "
                        placement="top"
                    >
                        <ClockIcon
                            :class="scope.row.status"
                            style="width: 2em; height: 2em; margin-right: 8px"
                        />
                    </el-tooltip>
                    <span
                        :class="`badge status-field badge-md bg-${statusBadge(
                            scope.row,
                        )}`"
                        >{{
                            $t(`contract.list.filterForm.status.${statusText(scope.row)}`)
                        }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('contract.list.contractTable.header.actions')"
                fixed="right"
                width="200"
                align="center"
            >
                <template #default="scope">
                    <div
                        class="button-group"
                        :class="checkFullPermissionActions() ? 'group-left' : ''"
                    >
                        <el-tooltip
                            effect="dark"
                            :content="$t('contract.list.contractTable.tooltip.stop')"
                            placement="top"
                            v-if="isCanUpdate(scope?.row?.status)"
                        >
                            <el-button
                                type="danger"
                                size="mini"
                                @click="onClickStopContract(scope.row)"
                            >
                                <StopwatchIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('contract.list.contractTable.tooltip.edit')"
                            placement="top"
                            v-if="isCanUpdate(scope?.row?.status)"
                        >
                            <el-button
                                type="warning"
                                size="mini"
                                @click="onClickUpdateContract(scope.row)"
                            >
                                <EditIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('contract.list.contractTable.tooltip.delete')"
                            placement="top"
                            v-if="isCanDelete(scope.row?.status)"
                        >
                            <el-button
                                type="danger"
                                size="mini"
                                @click="confirmDelete(scope.row?.id)"
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
import { mixins } from 'vue-property-decorator';
import { ContractMixins } from '../mixins';
import { Options } from 'vue-class-component';
import {
    Clock as ClockIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Stopwatch as StopwatchIcon,
} from '@element-plus/icons-vue';
import { IRowSpan } from '@/common/types';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { contractModule } from '../store';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
        ClockIcon,
        StopwatchIcon,
    },
})
export default class ContractTableByUser extends mixins(ContractMixins) {
    get contractByUserCount(): Map<number, number> {
        const mapContractCountToUser = new Map<number, number>();

        this.tableData.forEach((contract) => {
            const contractCount = mapContractCountToUser.get(contract.userId);
            if (contractCount) {
                mapContractCountToUser.set(contract.userId, contractCount + 1);
            } else {
                mapContractCountToUser.set(contract.userId, 1);
            }
        });

        return mapContractCountToUser;
    }

    objectSpanMethod(row: IRowSpan): unknown {
        if (row.columnIndex === 0) {
            if (
                row?.rowIndex === 0 ||
                row.row?.user?.id !== this.tableData[row?.rowIndex - 1].userId
            ) {
                return {
                    rowspan: this.contractByUserCount.get(row.row?.user?.id),
                    colspan: 1,
                };
            } else {
                return {
                    rowspan: 0,
                    colspan: 0,
                };
            }
        }
        return {
            rowspan: 1,
            colspan: 1,
        };
    }

    checkFullPermissionActions(): boolean {
        return (
            checkUserHasPermission(contractModule.userPermissions, [
                `${PermissionResources.CONTRACT}_${PermissionActions.DELETE}`,
            ]) &&
            checkUserHasPermission(contractModule.userPermissions, [
                `${PermissionResources.CONTRACT}_${PermissionActions.UPDATE}`,
            ])
        );
    }
}
</script>

<style scoped lang="scss">
.status-field {
    font-size: 12px;
    width: 140px;
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
.badge {
    font-size: 100%;
    color: #fff;
}
.stopped {
    color: #ffc107;
    outline: none;
}
.expired {
    color: red;
    outline: none;
}
.aboutToExpire {
    color: #cc6770;
    outline: none;
}
.bg-aboutToActive {
    background-color: #00c9a7;
    outline: none;
    color: #ffffff;
}
.bg-aboutToExpire {
    background-color: #cc6770;
    outline: none;
    color: #ffffff;
}
.active {
    outline: none;
}
.action-icon {
    height: 1em;
    width: 1em;
}

.contract-url {
    text-decoration: underline;
}
</style>
