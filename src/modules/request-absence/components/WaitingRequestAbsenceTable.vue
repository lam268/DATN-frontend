<template>
    <BaseTableLayout :data="requestAbsenceList">
        <template #table-columns>
            <el-table-column
                :label="$t('requestAbsence.form.employee.label')"
                prop="userInfo"
                min-width="200"
            >
                <template #default="scope">
                    <div class="v-avt">
                        <img :src="imageUrl(scope.row)" class="avt" />
                        <p class="txt-name">{{ scope.row?.userInfo?.fullName }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('requestAbsence.list.title.startTime')"
                prop="startAt"
                align="center"
                min-width="200"
            >
                <template #default="scope">
                    {{ formatDate(scope.row.startAt) }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('requestAbsence.list.title.endTime')"
                prop="endAt"
                align="center"
                min-width="200"
            >
                <template #default="scope">
                    {{ formatDate(scope.row.endAt) }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('requestAbsence.list.title.reason')"
                prop="reason"
                width="200"
                align="center"
            />
            <el-table-column
                :label="$t('requestAbsence.list.title.status')"
                prop="status"
                width="200"
                align="center"
            >
                <template #default="scope">
                    <el-dropdown @command="handleDropdownClick" v-if="isCanUpdateStatus">
                        <span class="badge status-field badge-md bg-secondary"
                            >{{ $t(`requestAbsence.list.filterForm.status.waiting`) }}
                            <ArrowDownBoldIcon class="action-icon" />
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    :command="{
                                        id: scope.row.id,
                                        status: 'approved',
                                    }"
                                    v-if="isCanUpdateStatus"
                                    type="primary"
                                    size="mini"
                                >
                                    {{
                                        $t(
                                            'requestAbsence.list.filterForm.status.approved',
                                        )
                                    }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                    :command="{
                                        id: scope.row.id,
                                        status: 'rejected',
                                    }"
                                    v-if="isCanUpdateStatus"
                                    type="warning"
                                    size="mini"
                                >
                                    {{
                                        $t(
                                            'requestAbsence.list.filterForm.status.rejected',
                                        )
                                    }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <span class="badge status-field badge-md bg-secondary" v-else
                        >{{ $t(`requestAbsence.list.filterForm.status.waiting`) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('requestAbsence.list.title.action')"
                prop="status"
                width="150"
                fixed="right"
                align="center"
            >
                <template #default="scope">
                    <div
                        class="button-group"
                        :class="checkFullPermissionActions() ? 'group-left' : ''"
                    >
                        <el-tooltip
                            effect="dark"
                            :content="$t('event.list.tooltip.edit')"
                            placement="top"
                        >
                            <el-button
                                @click="handleUpdate(scope.row)"
                                v-if="isCanUpdate"
                                size="mini"
                                type="warning"
                            >
                                <EditIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('event.list.tooltip.delete')"
                            placement="top"
                        >
                            <el-button
                                @click="handleDelete(scope.row.id)"
                                v-if="isCanDelete"
                                type="danger"
                                size="mini"
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
import { mixins, Options } from 'vue-class-component';
import { IStatusDropdown } from '../types';
import { updateStatusRequestAbsence } from '../composition/requestAbsence';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowDownBold as ArrowDownBoldIcon,
} from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { requestAbsenceModule } from '../store';
import { checkUserHasPermission } from '@/utils/helper';
import { RequestAbsenceMixins } from '../mixins';
@Options({
    components: {
        EditIcon,
        DeleteIcon,
        ArrowDownBoldIcon,
    },
})
export default class WaitingRequestAbsenceTable extends mixins(RequestAbsenceMixins) {
    get isCanUpdate(): boolean {
        return checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE}`,
        ]);
    }

    get isCanUpdateStatus(): boolean {
        return checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_STATUS}`,
        ]);
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(requestAbsenceModule.userPermissions, [
            `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE}`,
        ]);
    }

    async handleDropdownClick(data: IStatusDropdown): Promise<void> {
        await updateStatusRequestAbsence(data.id, data.status);
    }

    checkFullPermissionActions(): boolean {
        return (
            checkUserHasPermission(requestAbsenceModule.userPermissions, [
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE}`,
            ]) &&
            checkUserHasPermission(requestAbsenceModule.userPermissions, [
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE}`,
            ])
        );
    }
}
</script>

<style lang="scss" scoped>
.txt-name {
    margin: 0px;
    cursor: pointer !important;
}
.v-avt {
    display: flex;
    align-items: center;
}
.avt {
    width: 30px;
    height: 30px;
    margin-right: 15px;
    border-radius: 25px;
    object-fit: cover;
}
.style-empty {
    margin: 200px;
}
.action-icon {
    height: 1em;
    width: 1em;
}
:deep(.el-dropdown-menu) {
    padding: 0px !important;
}
.status-field {
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin: 0 auto;
}
.button-group {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
}
.group-left {
    justify-content: space-between;
}
</style>
