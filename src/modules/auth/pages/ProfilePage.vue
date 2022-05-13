<template>
    <div class="pb-3">
        <div class="avatar-layout d-flex justify-content-between">
            <div class="d-flex mt-3">
                <div class="justify-content-start d-flex">
                    <BaseAvatar :imageUrl="imageUrl" />
                </div>
                <div class="justify-content-start d-flex align-self-center m-4">
                    <h3 class="text-full-name">{{ userName }}</h3>
                </div>
            </div>
        </div>
        <div class="update-btn-layout-wrapper row">
            <div class="update-btn-layout">
                <el-button class="update-btn" @click="openEditProfilePopup">{{
                    $t(`auth.profile.buttons.updateProfile`)
                }}</el-button>
            </div>
        </div>
        <ProfileInfo />

        <EditProfileForm />
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import EditProfileForm from '../components/ProfileFormPopup.vue';
import { Options } from 'vue-class-component';
import { authModule } from '@auth/store';
import { ElLoading } from 'element-plus';
import ProfileInfo from '../components/ProfileInfo.vue';
@Options({
    components: {
        ProfileInfo,
        EditProfileForm,
    },
})
export default class ProfilePage extends mixins(UtilMixins) {
    get imageUrl(): string {
        return (
            authModule.userProfile?.avatarUrl ||
            require('@/assets/icons/avatar-default.png')
        );
    }

    get userName(): string {
        return authModule.userProfile?.fullName;
    }

    created(): void {
        this.initData();
    }

    async initData(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await Promise.all([authModule.getBanks(), authModule.getProvinceList()]);
        loading.close();
    }

    openEditProfilePopup(): void {
        authModule.setUploadingAvatarUrl(authModule.avatarUrl);
        authModule.setIsShowPopupEditProfile(true);
    }
}
</script>

<style lang="scss" scoped>
.avatar-layout {
    margin: 7px 0px 22px 25px;
}
.update-btn-layout-wrapper {
    margin: 7px 0px 0px 25px;
    .update-btn-layout {
        justify-content: flex-start;
        width: 150px !important;
        float: left;
        width: auto;
        .update-btn {
            margin: 0 auto;
            border-radius: 8px;
            font-size: 14px;
        }
    }
}
.text-full-name {
    margin-bottom: 0px;
    word-break: break-all;
    text-align: start;
}
</style>
