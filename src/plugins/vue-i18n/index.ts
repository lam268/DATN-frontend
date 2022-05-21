import { createI18n } from 'vue-i18n';
import { getLocaleFromModules } from './util';
import { appService } from '@/utils/app';
import { I18nConfig } from '@common/constants';
import commonViApp from '@/common/locale/app';
import commonViCommon from '@/common/locale/common';

const localeModules = getLocaleFromModules();

const i18n = createI18n({
    locale: appService.currentAppLang, // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        [I18nConfig.vi.code]: {
            ...localeModules.vi,
            common: {
                app: commonViApp,
                common: commonViCommon,
            },
        },
    }, // set locale messages
    globalInjection: true,
});

export default i18n;
