<template>
    <el-collapse-transition>
        <div class="base-custom-filter-form" v-show="isToggleFilterForm" ref="filter">
            <div class="filter-inner">
                <div class="filter-content">
                    <div class="filter-action mt-3">
                        <div class="d-flex justify-content-flex-start">
                            <slot name="filter-title" />
                            <div class="button-group button-action">
                                <el-button type="danger" size="mini" @click="resetFilter">
                                    {{ $t('common.app.filterForm.reset') }}
                                </el-button>
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="handleFilter"
                                >
                                    {{ $t('common.app.filterForm.searchBy') }}
                                </el-button>
                            </div>

                            <slot name="button-action" />
                        </div>
                    </div>
                    <slot />
                </div>
            </div>
        </div>
    </el-collapse-transition>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

export default class FilterFormLayout extends Vue {
    @Prop({ default: false }) readonly isToggleFilterForm!: boolean;
    height = 0;

    handleFilter(): void {
        this.$emit('search');
    }

    resetFilter(): void {
        this.$emit('reset');
    }

    updated(): void {
        this.$nextTick(() => {
            setTimeout(() => {
                this.height = (this.$refs.filter as HTMLElement).clientHeight;
                this.$emit('toggle', this.height);
            }, 500);
        });
    }
}
</script>

<style scoped lang="scss">
.filter-action {
    margin: 0 auto !important;
}
.button-action {
    margin-left: auto;
}
.base-custom-filter-form {
    text-align: left;
    background-color: $--color-gray-200;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 20px;
    position: sticky;
    top: 137px;
    z-index: map-get($map: $zIndex, $key: baseCustomFilterForm);
}
.filter-inner {
    padding: 15px 0 25px;
}
</style>
