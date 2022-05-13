<template>
    <div>
        <SettingHeader
            :pageTitle="$t('setting.appliedPosition.position.title')"
            @save="save"
            @reset="reset"
        />
        <div class="mt-3 position-layout">
            <div
                v-for="(position, index) in appliedPositions"
                :key="index"
                class="form-group"
            >
                <div class="row space-evenly">
                    <div class="row col-md-10 col-sm-12">
                        <el-input
                            :disabled="
                                position.inUse || (!isCanUpdate && !position.isNew)
                            "
                            :id="`code-${index}`"
                            :placeholder="
                                $t('setting.appliedPosition.errors.placeholder')
                            "
                            maxlength="255"
                            @input="onChangeInput(position.error, 'code')"
                            v-model="position.code"
                        ></el-input>
                    </div>

                    <div
                        class="col-md-2 col-sm-12 d-flex justify-content-start"
                        v-if="isCanUpdate"
                    >
                        <el-button
                            plain
                            :disabled="position.inUse"
                            v-if="appliedPositions.length > 1"
                            @click="onClickButtonDelete(index)"
                        >
                            <DeleteIcon class="action-icon" />
                        </el-button>
                        <el-button
                            v-if="
                                index === 0 &&
                                appliedPositions.length < MAX_APPLIED_POSITION_COUNT
                            "
                            plain
                            @click="onClickButtonAdd"
                        >
                            <PlusIcon class="action-icon" />
                        </el-button>
                    </div>
                    <div style="text-align: left; color: red" v-if="position.error?.code">
                        {{ $t(position.error?.code) }}
                    </div>
                    <div class="row col-md-10 mt-1 col-sm-12 justify-content-between">
                        <template v-for="(lang, i) in supportLanguage" :key="i">
                            <div class="col-md-6 col-sm-12 flex-column">
                                <el-input
                                    :id="`lang-${lang}-${index}`"
                                    v-model="position.value[lang]"
                                    :placeholder="
                                        $t(
                                            `setting.appliedPosition.errors.${lang}.placeholder`,
                                        )
                                    "
                                    @input="onChangeInput(position.error, lang)"
                                    :disabled="!isCanUpdate && !position?.isNew"
                                ></el-input>
                                <div
                                    style="text-align: left; color: red"
                                    v-if="position.error[lang]"
                                >
                                    {{ $t(position.error[lang]) }}
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
import { SettingMixins } from '../mixins';
import SettingHeader from '../components/SettingHeader.vue';
import { ElLoading } from 'element-plus';
import { Delete as DeleteIcon, Plus as PlusIcon } from '@element-plus/icons-vue';
import { settingAppliedPositionModule } from '../store/appliedPosition.store';
import { IGeneralSettingForm } from '../type';
import { setup } from 'vue-class-component';
import { setupSaveAppliedPositionSetting } from '../compositions/applied-position/appliedPositionList';
import { validateGeneralSettingBeforeSubmit } from '../helper';
import cloneDeep from 'lodash/cloneDeep';
import { SupportLanguage, ConfirmBoxAction } from '@/common/constants';

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
export default class SettingAppliedPositionPage extends mixins(SettingMixins) {
    appliedPositions: IGeneralSettingForm[] = [
        {
            code: '',
            error: {} as Record<SupportLanguage, string>,
            value: {} as Record<SupportLanguage, string>,
        },
    ];

    saveAction = setup(() => setupSaveAppliedPositionSetting());

    created(): void {
        this.supportLanguage = [...Object.values(SupportLanguage)];
        this.getData();
    }

    async getData(): Promise<void> {
        const loading = ElLoading.service({});
        await settingAppliedPositionModule.getAppliedPositionList();
        loading.close();
        this.setupAppliedPositionForm();
    }

    setupAppliedPositionForm(): void {
        // display list in reverse order
        this.appliedPositions = cloneDeep(
            settingAppliedPositionModule.appliedPositionList,
        )
            .reverse()
            .map((item) => ({
                code: item.code,
                error: {},
                value: item.value,
                inUse: item.inUse,
            }));
        if (!this.appliedPositions?.length) {
            this.onClickButtonAdd();
        }
    }

    onClickButtonDelete(index: number): void {
        this.isNotSaveAfterChangeData = true;
        this.appliedPositions.splice(index, 1);
    }

    onClickButtonAdd(): void {
        this.isNotSaveAfterChangeData = true;
        this.appliedPositions.unshift({
            code: '',
            error: {} as Record<SupportLanguage, string>,
            value: {} as Record<SupportLanguage, string>,
            isNew: true,
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
            this.appliedPositions,
            'setting.appliedPosition.errors',
        );

        if (invalidElement !== null) {
            // eslint-disable-next-line no-unused-expressions
            document.getElementById(invalidElement)?.focus();

            return false;
        }
        const saveResult = await this.saveAction.saveAppliedPositionList(
            this.appliedPositions.slice(0).reverse(),
        );
        if (saveResult) {
            this.isNotSaveAfterChangeData = false;
            this.setupAppliedPositionForm();
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
        this.setupAppliedPositionForm();
    }
}
</script>

<style lang="scss" scoped>
.form-group {
    margin-bottom: 15px;
}

.position-layout {
    margin-left: 20px;
}

.action-icon {
    height: 1em;
    width: 1em;
}
</style>
