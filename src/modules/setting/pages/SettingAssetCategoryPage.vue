<template>
    <div>
        <SettingHeader
            :pageTitle="$t('setting.assetCategory.title')"
            @save="save"
            @reset="reset"
        />
        <div class="mt-3 category-layout">
            <div
                v-for="(category, index) in assetCategories"
                :key="index"
                class="form-group"
            >
                <div class="row space-evenly">
                    <div class="row col-md-10 col-sm-12">
                        <el-input
                            :disabled="category.inUse || !isCanUpdate"
                            :id="`code-${index}`"
                            :placeholder="$t('setting.assetCategory.errors.placeholder')"
                            v-model="category.code"
                            maxlength="255"
                            @input="onChangeInput(category.error, 'code')"
                        ></el-input>
                    </div>

                    <div class="col-md-2 col-sm-12 d-flex justify-content-start">
                        <el-button
                            plain
                            :disabled="category.inUse"
                            v-if="assetCategories.length > 1 && isCanUpdate"
                            @click="onClickButtonDelete(index)"
                        >
                            <DeleteIcon class="action-icon" />
                        </el-button>
                        <el-button
                            v-if="
                                index === 0 &&
                                assetCategories.length < MAX_ASSET_CATEORY_COUNT &&
                                isCanUpdate
                            "
                            plain
                            @click="onClickButtonAdd"
                        >
                            <PlusIcon class="action-icon" />
                        </el-button>
                    </div>
                    <div style="text-align: left; color: red" v-if="category.error.code">
                        {{ $t(category.error.code) }}
                    </div>
                    <div class="row col-md-10 mt-1 col-sm-12 justify-content-between">
                        <template v-for="(lang, i) in supportLanguage" :key="i">
                            <div class="col-md-6 col-sm-12 flex-column">
                                <el-input
                                    :id="`lang-${lang}-${index}`"
                                    v-model="category.value[lang]"
                                    :placeholder="
                                        $t(
                                            `setting.assetCategory.errors.${lang}.placeholder`,
                                        )
                                    "
                                    @input="onChangeInput(category.error, lang)"
                                    :disabled="!isCanUpdate"
                                ></el-input>
                                <div
                                    class="col-sm-12"
                                    style="text-align: left; color: red"
                                    v-if="category.error[lang]"
                                >
                                    {{ $t(category.error[lang]) }}
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-property-decorator';
import SettingHeader from '../components/SettingHeader.vue';
import { Delete as DeleteIcon, Plus as PlusIcon } from '@element-plus/icons-vue';
import { settingAssetCategoryModule } from '../store/assetCategory.store';
import { IGeneralSettingForm } from '../type';
import { setup } from 'vue-class-component';
import { setupSaveAssetCategorySetting } from '../compositions/asset-category/assetCategoryList';
import { ElLoading } from 'element-plus';
import { validateGeneralSettingBeforeSubmit } from '../helper';
import cloneDeep from 'lodash/cloneDeep';
import { SupportLanguage, ConfirmBoxAction } from '@/common/constants';
import { SettingMixins } from '../mixins';

@Options({
    components: {
        SettingHeader,
        DeleteIcon,
        PlusIcon,
    },
    async beforeRouteLeave(to, from, next) {
        next(await this.beforePageLeave());
    },
})
export default class SettingAssetCategoryPage extends mixins(SettingMixins) {
    assetCategories: IGeneralSettingForm[] = [
        {
            code: '',
            error: {} as Record<SupportLanguage, string>,
            value: {} as Record<SupportLanguage, string>,
        },
    ];

    saveAction = setup(() => setupSaveAssetCategorySetting());

    created(): void {
        this.supportLanguage = [...Object.values(SupportLanguage)];
        this.getData();
    }

    async getData(): Promise<void> {
        const loading = ElLoading.service({});
        await settingAssetCategoryModule.getAssetCategoryList();
        loading.close();
        this.setupAssetCategoryForm();
    }

    setupAssetCategoryForm(): void {
        this.assetCategories = cloneDeep(settingAssetCategoryModule.assetCategoryList)
            .reverse()
            .map((item) => ({
                code: item.code,
                error: {} as Record<SupportLanguage, string>,
                value: item.value,
                inUse: item.inUse,
            }));
        if (!this.assetCategories?.length) {
            this.onClickButtonAdd();
        }
    }

    onClickButtonDelete(index: number): void {
        this.isNotSaveAfterChangeData = true;
        this.assetCategories.splice(index, 1);
    }

    onClickButtonAdd(): void {
        this.isNotSaveAfterChangeData = true;
        this.assetCategories.unshift({
            code: '',
            error: {} as Record<SupportLanguage, string>,
            value: {} as Record<SupportLanguage, string>,
        });
    }

    onChangeInput(
        error: Record<SupportLanguage | string, string>,
        errorType: string,
    ): void {
        error[errorType] = '';
        this.isNotSaveAfterChangeData = true;
    }

    async save(): Promise<boolean> {
        const invalidElement = validateGeneralSettingBeforeSubmit(
            this.assetCategories,
            'setting.assetCategory.errors',
        );
        if (invalidElement !== null) {
            // eslint-disable-next-line no-unused-expressions
            document.getElementById(invalidElement)?.focus();

            return false;
        }
        const saveResult = await this.saveAction.saveAssetCategoryList(
            this.assetCategories.slice(0).reverse(),
        );
        if (saveResult) {
            this.isNotSaveAfterChangeData = false;
            this.setupAssetCategoryForm();
        }
        return saveResult;
    }

    async beforePageLeave(): Promise<boolean> {
        if (!this.isNotSaveAfterChangeData) {
            return true;
        }

        const result = await this.showWarningBeforeLeavePage();
        if (result === ConfirmBoxAction.CONFIRM) {
            return await this.save();
        } else {
            return true;
        }
    }

    reset(): void {
        this.isNotSaveAfterChangeData = false;
        this.setupAssetCategoryForm();
    }
}
</script>

<style lang="scss" scoped>
.category-layout {
    margin-left: 20px;
}

.action-icon {
    height: 1em;
    width: 1em;
}
</style>
