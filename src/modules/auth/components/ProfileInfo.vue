<template>
    <div class="row mx-4">
        <h3 class="justify-content-start d-flex main-info-title p-0">
            {{ $t(`auth.profile.title.mainInfo`) }}
        </h3>
        <div class="main-info">
            <div style="padding: 0px 12px">
                <div class="row">
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.fullName') }}
                            </div>
                            <div class="item-value col-7">
                                {{ userProfile?.fullName }}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.email') }}
                            </div>
                            <div class="item-value col-7">{{ userProfile?.email }}</div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.position') }}
                            </div>
                            <div class="item-value col-7">
                                {{ getNamePosition }}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.status') }}
                            </div>
                            <div class="item-value col-7">
                                {{ $t(`auth.profile.status.${userProfile?.status}`) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mx-4">
        <h3 class="justify-content-start d-flex personal-info-title p-0">
            {{ $t(`auth.profile.title.personalInfo`) }}
        </h3>
        <div class="more-info mt-10">
            <div style="padding: 0px 12px">
                <div class="row">
                    <!-- Birthday -->
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.birthday') }}
                            </div>
                            <div class="item-value col-7">
                                {{ formatDate(userProfile.birthday) }}
                            </div>
                        </div>
                    </div>
                    <!-- Gender -->
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.gender') }}
                            </div>
                            <div class="item-value col-7">
                                {{ $t(`auth.profile.gender.${userProfile.gender}`) }}
                            </div>
                        </div>
                    </div>
                    <!-- Phone -->
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.phone') }}
                            </div>
                            <div class="item-value col-7">
                                {{ userProfile.phoneNumber }}
                            </div>
                        </div>
                    </div>
                    <!-- Province -->
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.province') }}
                            </div>
                            <div class="item-value col-7">
                                {{ userProfile.province?.name || '' }}
                            </div>
                        </div>
                    </div>
                    <!-- Bank Account -->
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.bankAccount') }}
                            </div>
                            <div class="item-value col-7">
                                {{ userProfile.bankAccount }}
                            </div>
                        </div>
                    </div>
                    <!-- Bank -->
                    <div class="col-lg-6 col-xl-6 col-md-12">
                        <div class="row-item border row">
                            <div class="item-label col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.bank') }}
                            </div>
                            <div class="item-value col-7">{{ userProfile.bank }}</div>
                        </div>
                    </div>
                    <!-- Social Insurance -->
                    <div class="col-12">
                        <div class="row">
                            <div class="col-lg-6 col-xl-6 col-md-12">
                                <div class="row-item border row">
                                    <div class="item-label col-5 fw-bold text-start">
                                        {{ $t('auth.profile.fields.socialInsurance') }}
                                    </div>
                                    <div class="item-value col-7">
                                        {{ userProfile.socialInsurance }}
                                    </div>
                                </div>
                            </div>
                            <!-- Tax Code -->
                            <div class="col-lg-6 col-xl-6 col-md-12">
                                <div class="row-item border row">
                                    <div class="item-label col-5 fw-bold text-start">
                                        {{ $t('auth.profile.fields.taxCode') }}
                                    </div>
                                    <div class="item-value col-7">
                                        {{ userProfile.taxCode }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- CitizenCard -->
                    <div class="col-12">
                        <div class="row-item border row">
                            <div class="item-label-long col-4 fw-bold text-start">
                                {{ $t('auth.profile.fields.citizenCard') }}
                            </div>
                            <div class="layout-item-value-long">
                                <div class="item-value-long text-start col-12">
                                    {{
                                        formatCitizenInformation(
                                            $t('auth.profile.fields.citizenId'),
                                            userProfile.citizenId || '',
                                        )
                                    }}
                                </div>
                                <div class="item-value-long text-start col-12">
                                    {{
                                        formatCitizenInformation(
                                            $t('auth.profile.fields.citizenIdIssuedAt'),
                                            formatDate(
                                                userProfile.citizenIdIssuedAt || '',
                                            ),
                                        )
                                    }}
                                </div>
                                <div class="item-value-long text-start col-12">
                                    {{
                                        formatCitizenInformation(
                                            $t('auth.profile.fields.idCardIssuePlace'),
                                            userProfile.idCardIssuePlace || '',
                                        )
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Address -->
                    <div class="col-12">
                        <div class="row-item border row">
                            <div class="item-label-long col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.address') }}
                            </div>
                            <div class="layout-item-value-long">
                                <div class="item-value-long col-12 text-start">
                                    {{ userProfile.address }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Hometown Address -->
                    <div class="col-12">
                        <div class="row-item border row">
                            <div class="item-label-long col-5 fw-bold text-start">
                                {{ $t('auth.profile.fields.hometownAddress') }}
                            </div>
                            <div class="layout-item-value-long">
                                <div class="item-value-long col-12 text-start">
                                    {{ userProfile.hometownAddress }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { authModule } from '@auth/store';
import { IUserProfile } from '../types';
import moment from 'moment';
import { ElLoading } from 'element-plus';
import { generalSettingApiService } from '@/modules/setting/services/settingService';
import { SettingKey } from '@/modules/setting/constant';
import { SupportLanguage } from '@/common/constants';
import { appModule } from '@/store/app';
export default class ProfileInfo extends Vue {
    get userProfile(): IUserProfile {
        return authModule.userProfile;
    }

    get getNamePosition(): string {
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        const position = authModule.userPositionList.find(
            (position) => position.code === this.userProfile?.position,
        );
        return position ? position.value?.[currentLanguage] : '';
    }

    formatDate(date: Date): string {
        return date ? moment(date).fmDayString() : '';
    }

    formatCitizenInformation(label: string, value: string): string {
        return `${label}: ${value}`;
    }

    created(): void {
        this.getPositions();
    }

    async getPositions(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.USER_POSITION,
        });
        loading.close();
        if (response?.success) {
            authModule.setUserPositionList(response?.data?.values || []);
        }
    }
}
</script>

<style lang="scss" scoped>
.personal-info-title {
    margin-top: 49px;
    margin-bottom: 20px;
}
.main-info-title {
    margin-top: 40px;
    margin-bottom: 20px;
}
.more-info {
    margin-left: 0;
    padding: 0;
}
.main-info {
    margin-left: 0;
    padding: 0;
}
.item-label {
    background-color: #eeeeee;
    width: 40%;
    padding: 10px;
    text-align: left;
}
.item-value {
    padding: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.item-label-long {
    background-color: #eeeeee;
    width: 20%;
    padding: 10px;
    display: flex;
    align-items: center;
}
.layout-item-value-long {
    width: 80%;
    padding: 0;
}
.item-value-long {
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.row {
    height: 100%;
}
.row-item {
    display: flex;
}

.item-col {
    width: 50%;
}

.item-label {
    background-color: #eeeeee;
    width: 40%;
    padding: 10px;
    text-align: left;
}
.item-value {
    padding: 10px;
}
.row-item {
    display: flex;
}

@media only screen and (max-width: 992px) {
    .redundant {
        display: none;
    }
    .item-label-long {
        width: 40%;
    }
    .item-value-long {
        width: 60%;
    }
}
</style>
