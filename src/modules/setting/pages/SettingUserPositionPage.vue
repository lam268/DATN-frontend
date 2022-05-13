<template>
    <div>
        <SettingHeader
            :pageTitle="$t('setting.userPosition.position.title')"
            @save="save"
            @reset="reset"
        />
        <div class="mt-3 position-layout">
            <div
                v-for="(position, index) in userPositions"
                :key="index"
                class="form-group"
            >
                <div class="row space-evenly">
                    <div class="row col-md-10 col-sm-12">
                        <el-input
                            :disabled="position.inUse || !isCanUpdate"
                            :id="`code-${index}`"
                            :placeholder="$t('setting.userPosition.errors.placeholder')"
                            maxlength="255"
                            @input="onChangeInput(position.error, 'code')"
                            v-model="position.code"
                        ></el-input>
                    </div>

                    <div class="col-md-2 col-sm-12 d-flex justify-content-start">
                        <el-button
                            plain
                            :disabled="position.inUse"
                            v-if="userPositions.length > 1 && isCanUpdate"
                            @click="onClickButtonDelete(index)"
                        >
                            <DeleteIcon class="action-icon" />
                        </el-button>
                        <el-button
                            v-if="
                                index === 0 &&
                                userPositions.length < MAX_USER_POSITION_COUNT &&
                                isCanUpdate
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
                                            `setting.userPosition.errors.${lang}.placeholder`,
                                        )
                                    "
                                    @input="onChangeInput(position.error, lang)"
                                    :disabled="!isCanUpdate"
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
import SettingHeader from '../components/SettingHeader.vue';
import { ElLoading } from 'element-plus';
import { Delete as DeleteIcon, Plus as PlusIcon } from '@element-plus/icons-vue';
import { settingUserPositionModule } from '../store/userPosition.store';
import { IGeneralSettingForm } from '../type';
import { setup } from 'vue-class-component';
import { setupSaveUserPositionSetting } from '../compositions/user-position/userPositionList';
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
export default class SettingUserPositionPage extends mixins(SettingMixins) {
    userPositions: IGeneralSettingForm[] = [
        {
            code: '',
            error: {} as Record<SupportLanguage, string>,
            value: {} as Record<SupportLanguage, string>,
        },
    ];

    saveAction = setup(() => setupSaveUserPositionSetting());

    created(): void {
        this.supportLanguage = [...Object.values(SupportLanguage)];
        this.getData();
    }

    async getData(): Promise<void> {
        const loading = ElLoading.service({});
        await settingUserPositionModule.getUserPositionList();
        loading.close();
        this.setupUserPositionForm();
    }

    setupUserPositionForm(): void {
        // display list in reverse order
        this.userPositions = cloneDeep(settingUserPositionModule.userPositionList)
            .reverse()
            .map((item) => ({
                code: item.code,
                error: {},
                value: item.value,
                inUse: item.inUse,
            }));
        if (!this.userPositions?.length) {
            this.onClickButtonAdd();
        }
    }

    onClickButtonDelete(index: number): void {
        this.isNotSaveAfterChangeData = true;
        this.userPositions.splice(index, 1);
    }

    onClickButtonAdd(): void {
        this.isNotSaveAfterChangeData = true;
        this.userPositions.unshift({
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
            this.userPositions,
            'setting.userPosition.errors',
        );

        if (invalidElement !== null) {
            // eslint-disable-next-line no-unused-expressions
            document.getElementById(invalidElement)?.focus();

            return false;
        }
        const saveResult = await this.saveAction.saveUserPositionList(
            this.userPositions.slice(0).reverse(),
        );
        if (saveResult) {
            this.isNotSaveAfterChangeData = false;
            this.setupUserPositionForm();
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
        this.setupUserPositionForm();
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
