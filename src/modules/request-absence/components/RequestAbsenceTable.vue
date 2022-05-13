<template>
    <BaseTableLayout :data="requestAbsenceList">
        <template #table-columns>
            <el-table-column
                :label="$t('requestAbsence.form.employee.label')"
                prop="userInfo"
                min-width="200"
                fixed=""
            >
                <template #default="scope">
                    <div class="v-avt">
                        <img :src="imageUrl(scope.row)" class="avt" />
                        <p class="txt-name">{{ scope.row?.userInfo.fullName }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('requestAbsence.list.title.startTime')"
                prop="startAt"
                min-width="200"
                align="center"
            >
                <template #default="scope">
                    {{ formatDate(scope.row.startAt) }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('requestAbsence.list.title.endTime')"
                prop="endAt"
                min-width="200"
                align="center"
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
                    <span
                        class="badge status-field badge-md"
                        :class="{
                            'bg-secondary': scope.row.status === absenceStatuses.WAITING,
                            'bg-danger': scope.row.status === absenceStatuses.REJECTED,
                            'bg-success': scope.row.status === absenceStatuses.APPROVED,
                        }"
                        >{{
                            $t(
                                `requestAbsence.list.filterForm.status.${scope.row.status}`,
                            )
                        }}</span
                    >
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
                                v-if="isCanUpdate(scope.row?.status)"
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
                                v-if="isCanDelete(scope.row?.status)"
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
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { mixins, Options } from 'vue-class-component';
import { RequestAbsenceStatus } from '../contants';
import { RequestAbsenceMixins } from '../mixins';
import { requestAbsenceModule } from '../store';
import { Edit as EditIcon, Delete as DeleteIcon } from '@element-plus/icons-vue';
@Options({
    components: {
        EditIcon,
        DeleteIcon,
    },
})
export default class RequestAbsenceTable extends mixins(RequestAbsenceMixins) {
    isCanUpdate(status: RequestAbsenceStatus): boolean {
        return (
            checkUserHasPermission(requestAbsenceModule.userPermissions, [
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE}`,
            ]) ||
            (status === RequestAbsenceStatus.WAITING &&
                checkUserHasPermission(requestAbsenceModule.userPermissions, [
                    `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_PERSONAL}`,
                ]))
        );
    }

    isCanDelete(status: RequestAbsenceStatus): boolean {
        return (
            checkUserHasPermission(requestAbsenceModule.userPermissions, [
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE}`,
            ]) ||
            (status !== RequestAbsenceStatus.APPROVED &&
                checkUserHasPermission(requestAbsenceModule.userPermissions, [
                    `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE_PERSONAL}`,
                ]))
        );
    }

    checkFullPermissionActions(): boolean {
        return (
            (checkUserHasPermission(requestAbsenceModule.userPermissions, [
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE}`,
            ]) ||
                checkUserHasPermission(requestAbsenceModule.userPermissions, [
                    `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.DELETE_PERSONAL}`,
                ])) &&
            (checkUserHasPermission(requestAbsenceModule.userPermissions, [
                `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE}`,
            ]) ||
                checkUserHasPermission(requestAbsenceModule.userPermissions, [
                    `${PermissionResources.REQUEST_ABSENCE}_${PermissionActions.UPDATE_PERSONAL}`,
                ]))
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
.status-field {
    font-size: 14px;
    width: 100px;
}
.action-icon {
    height: 1em;
    width: 1em;
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
