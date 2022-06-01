<template>
    <div class="base-table-layout">
        <el-table
            header-row-class-name="table-header"
            :data="data"
            :header-cell-style="headerStyle"
            :span-method="objectSpanMethod"
            :style="style"
            :border="border"
            :stripe="stripe"
            :cell-style="cellStyle"
            @cell-click="handleCellClick"
            :max-height="maxHeight"
            fit
        >
            <slot name="table-columns" />
        </el-table>
    </div>
</template>

<script lang="ts">
import { IColumnTable, IRowTable } from '@/modules/timekeeping/types';
import { Prop, Vue } from 'vue-property-decorator';

export default class TableLayout extends Vue {
    @Prop({
        default: {
            fontWeight: 600,
            backgroundColor: '#f5f5f5',
            padding: '8px',
        },
    })
    readonly headerStyle!: Record<string, string>;

    @Prop({ default: null }) readonly data!: any;
    @Prop({
        default: '',
    })
    readonly style!: Record<string, string>;

    @Prop({ default: false }) readonly border!: boolean;
    @Prop({ default: false }) readonly stripe!: boolean;
    @Prop({ default: null }) readonly cellStyle!: unknown;
    @Prop({ default: null }) readonly maxHeight!: string;
    @Prop({
        default: {
            rowspan: 0,
            colspan: 0,
        },
    })
    readonly objectSpanMethod!: unknown;

    handleCellClick(row: IRowTable, column: IColumnTable): void {
        this.$emit('cell-click', row, column);
    }
}
</script>

<style scoped lang="scss">
.base-table-layout {
    display: flex;
    align-items: center;
    min-height: 100%;
    overflow: hidden;
    /* width */
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: rgb(180, 179, 179);
        border-radius: 10px;
    }
    .el-table__body {
        width: 100% !important;
    }
}
:deep(.table-header > th) {
    background-color: $--color-gray-200 !important;
}
:deep(.el-table__body tr.hover-row > td.el-table__cell) {
    background-color: #ffffff;
}
:deep(.hover-row > .el-table-fixed-column--left) {
    background-color: #ffffff !important;
}
:deep(.hover-row > .el-table-fixed-column--right) {
    background-color: #ffffff !important;
}
:deep(.el-table-fixed-column--left) {
    background: #fafafa !important;
}
:deep(.el-table-fixed-column--right) {
    background: #fafafa !important;
}
:deep(.el-table tr) {
    background: transparent !important;
}
:deep(.el-table) {
    background-color: transparent !important;
}
</style>
