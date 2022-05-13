<template>
    <div class="asset-list-container">
        <div>
            <h3>{{ $t('dashboard.dashboard.title.assetManagement') }}</h3>
            <ul>
                <li v-for="asset in assetList" :key="`asset-${asset.id}`">
                    <span @click="onClickAsset(asset.id)" class="asset">
                        {{ asset.name }}</span
                    >
                </li>
            </ul>
        </div>
        <div class="footer">
            <span
                class="view-more"
                v-if="assetCount > assetPageLimit"
                @click="onClickViewMore"
                >{{ $t('dashboard.dashboard.assetManagement.viewMore') }}</span
            >
        </div>
    </div>
    <AssetPreviewPopup
        v-model:isShowAssetPreviewPopup="isShowAssetPreviewPopup"
        :selectedAssetId="selectedAssetId"
    />
</template>
<script lang="ts">
import { PageName } from '@/common/constants';
import { IAsset } from '@/modules/asset/types';
import router from '@/router';
import { appService } from '@/utils/app';
import { Options, Vue } from 'vue-class-component';
import { ASSET_PAGE_LIMIT } from '../constant';
import { dashboardModule } from '../store';
import AssetPreviewPopup from './AssetPreviewPopup.vue';

@Options({
    components: { AssetPreviewPopup },
})
export default class AssetList extends Vue {
    assetPageLimit = ASSET_PAGE_LIMIT;
    isShowAssetPreviewPopup = false;
    selectedAssetId = NaN;
    get assetList(): IAsset[] {
        return dashboardModule.assetList;
    }

    get assetCount(): number {
        return dashboardModule.assetCount;
    }

    onClickViewMore(): void {
        router.push({
            name: PageName.ASSET_LIST_PAGE,
            query: {
                assigneeIds: appService.getUser()?.id,
            },
        });
    }

    onClickAsset(assetId: number): void {
        this.selectedAssetId = assetId;
        this.isShowAssetPreviewPopup = true;
    }
}
</script>
<style lang="scss" scoped>
.asset-list-container {
    background-color: $--color-gray-200;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    padding: 10px;
    margin-top: 20px;
    text-align: left;
    position: relative;
    .asset {
        cursor: pointer;
        font-weight: 600;
        color: #313131;
        margin-bottom: 5px;
        text-decoration: underline;
    }
    .footer {
        text-align: right;
        .view-more {
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
</style>
