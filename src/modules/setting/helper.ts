import { IGeneralSettingForm } from './type';
import { SupportLanguage } from '@/common/constants';
import trim from 'lodash/trim';

export function validateGeneralSettingBeforeSubmit(
    settingValues: IGeneralSettingForm[],
    i18Key: string,
): string | null {
    let invalidElement: string | null = null;
    const uniqueCodeMap: Record<string, number> = {};
    (settingValues || []).forEach((item, index) => {
        item.error = {};
        // check is item 's code empty
        item.code = trim(item.code);
        if (!item.code) {
            item.error.code = `${i18Key}.empty`;
            invalidElement = invalidElement || 'code-' + index;
        }

        // check is item 's code duplicate
        if (uniqueCodeMap[item.code.toLowerCase()] !== undefined) {
            const duplicateAtInIndex = uniqueCodeMap[item.code.toLowerCase()];
            settingValues[duplicateAtInIndex].error.code = `${i18Key}.duplicate`;
            invalidElement = invalidElement || 'code-' + duplicateAtInIndex;
        }
        uniqueCodeMap[item.code.toLowerCase()] = index;

        // check is item 's support language null/empty
        Object.values(SupportLanguage).forEach((lang) => {
            item.value[lang] = trim(item.value?.[lang]);
            if (!item.value[lang]?.length) {
                item.error[lang] = `${i18Key}.${lang}.empty`;
                invalidElement = invalidElement || 'lang-' + lang + '-' + index;
            }
        });
    });
    return invalidElement;
}
