<template>
    <div>
        <el-dialog
            width="50%"
            v-model="isShow"
            custom-class="asset-preview-popup"
            @closed="onClosedPopup"
            @open="onOpenPopup"
        >
            <template #title>
                <h3 class="text-left">
                    {{ $t('dashboard.dashboard.assetManagement.popup.title') }}
                </h3>
            </template>
            <div class="row align-items-center">
                <div class="col-md-12">
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.assetName',
                                )
                            }}:</span
                        >
                        {{ assetDetail.name }}
                    </p>
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.purchaseDate',
                                )
                            }}:</span
                        >
                        {{ formatDate(assetDetail.purchaseDate) }}
                    </p>
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.category',
                                )
                            }}:</span
                        >
                        {{ getCategoryName(assetDetail.category) }}
                    </p>
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.type',
                                )
                            }}:</span
                        >
                        {{ $t(getTypeName(assetDetail.type)) }}
                    </p>
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.price',
                                )
                            }}:</span
                        >
                        {{ assetDetail.price }}
                    </p>
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.usingStatus',
                                )
                            }}:</span
                        >
                        {{ $t(getStatusName(assetDetail.usingStatus)) }}
                    </p>
                    <p>
                        <span class="label"
                            >{{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.label.description',
                                )
                            }}:</span
                        >
                        {{ assetDetail.description }}
                    </p>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="text-center">
                        <el-button @click="onClosedPopup">
                            {{
                                $t(
                                    'dashboard.dashboard.assetManagement.popup.button.close',
                                )
                            }}
                        </el-button>
                    </div>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { SupportLanguage } from '@/common/constants';
import { IBodyResponse, ISelectOptions } from '@/common/types';
import { AssetTypeOptions, UsingStatusOptions } from '@/modules/asset/constants';
import { assetService } from '@/modules/asset/services/asset-api.services';
import { assetModule } from '@/modules/asset/store/asset.store';
import { IAsset } from '@/modules/asset/types';
import { appModule } from '@/store/app';
import { parseSelectOptions } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import moment from 'moment';
import { Vue } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

const defaultInitAssetDetail: IAsset = {
    id: NaN,
    name: '',
    type: '',
    usingStatus: '',
    category: '',
    createdBy: '',
    description: '',
    price: NaN,
    assignee: {
        id: NaN,
        fullName: '',
    },
    code: '',
    isAutoGenerateCode: false,
    purchaseDate: '',
};

export default class AssetPreviewPopup extends Vue {
    @Prop({ default: NaN }) selectedAssetId!: number;
    @Model('isShowAssetPreviewPopup', { type: Boolean })
    isShow!: boolean;

    assetDetail: IAsset = defaultInitAssetDetail;

    get categoryOptions(): ISelectOptions[] {
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return parseSelectOptions(
            assetModule.categories.map((category) => ({
                value: category.code,
                label: category.value?.[currentLanguage],
            })),
        );
    }

    async onOpenPopup(): Promise<void> {
        const loading = ElLoading.service({ target: '.asset-preview-popup' });
        const response = (await assetService.getDetail(
            this.selectedAssetId,
        )) as IBodyResponse<IAsset>;
        await assetModule.getCategories();
        this.assetDetail = response.data;
        loading.close();
    }

    onClosedPopup(): void {
        this.isShow = false;
        this.assetDetail = defaultInitAssetDetail;
    }

    formatDate(date: string): string {
        return moment(date).fmDayString();
    }

    getCategoryName(categoryCode: string): string {
        const category = this.categoryOptions.find((cat) => cat.value === categoryCode);
        return category?.label || '';
    }

    getTypeName(typeCode: string): string {
        return (
            AssetTypeOptions.find((assetType) => assetType.value === typeCode)?.label ||
            ''
        );
    }

    getStatusName(statusCode: string): string {
        return (
            UsingStatusOptions.find((status) => status.value === statusCode)?.label || ''
        );
    }
}
</script>
<style lang="scss" scoped>
:deep(.asset-preview-popup) {
    text-align: left !important;
}
.label {
    font-weight: 600;
}
</style>
