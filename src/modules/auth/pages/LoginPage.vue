<template>
    <div class="container-fluid">
        <div class="row">
            <div class="login-page">
                <BaseErrorMessage v-if="errorMessage" :title="errorMessage" />
                <div class="login-inner">
                    <img
                        class="m-auto d-block"
                        width="150"
                        height="80"
                        src="@/assets/images/logo-symbol.svg"
                    />
                    <BaseInputText
                        :label="$t('auth.login.login.email')"
                        :isRequired="true"
                        v-model:value="form.email"
                        :placeholder="$t('auth.login.login.placeholder.email')"
                        :error="translateYupError(form.errors.email)"
                    />
                    <BaseInputPassword
                        :label="$t('auth.login.login.password')"
                        :isRequired="true"
                        v-model:value="form.password"
                        :placeholder="$t('auth.login.login.placeholder.password')"
                        :error="translateYupError(form.errors.password)"
                    />
                    <el-button type="primary" @click="form.onSubmit">
                        {{ $t('auth.login.login.loginButton') }}
                    </el-button>
                    <el-button class="v-btn--text" @click="getGoogleLoginLink">
                        <img
                            :alt="$t('auth.login.google.googleLoginText')"
                            src="@/assets/icons/logo_google.svg"
                        />
                        {{ $t('auth.login.google.googleLoginText') }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mixins, Options, setup } from 'vue-class-component';
import { useRoute } from 'vue-router';
import { IGoogleLoginLinkParams } from '../types';
import { authModule } from '@auth/store';
import { ElLoading } from 'element-plus';
import { loginForm } from '../composition/loginForm';
import { UtilMixins } from '@/mixins/utilMixins';

@Options({})
export default class LoginPage extends mixins(UtilMixins) {
    errorMessage = '';

    form = setup(() => loginForm());

    async getGoogleLoginLink(): Promise<void> {
        const route = useRoute();
        const params: IGoogleLoginLinkParams = {
            redirectUri: `${window.location.origin}/google-login`,
        };
        if (route?.query?.redirect) {
            params.state = (route?.query?.redirect || '') as string;
        }
        const loading = ElLoading.service({
            target: '.content',
        });
        await authModule.getGoogleLoginLink(params);
        loading.close();
        if (authModule?.googleLoginLink) {
            window.open(authModule.googleLoginLink, '_self');
        }
    }
}
</script>

<style lang="scss" scoped>
.login-page {
    background-image: url('~@/assets/images/login-bg.jpeg');
    background-color: #f5f5f5;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-position: center;
    background-size: cover;
    position: relative;
    justify-content: center;
    &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
    }
}
.login-inner {
    align-self: center;
    position: relative;
    z-index: map-get($map: $zIndex, $key: loginInner);
    width: 300px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 25px;
    border-radius: 8px;
    background-color: #ffffff;
    @media (min-width: 768px) {
        width: 400px;
    }
}

.login-inner {
    button {
        margin-top: 15px;
        width: 210px;
        text-transform: none;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
    }

    span {
        display: flex;
        align-items: center;
        img {
            width: 20px;
            margin-right: 5px;
        }
    }

    .v-btn--text {
        margin-left: 0px !important;
        color: #212121;
    }
}
</style>
