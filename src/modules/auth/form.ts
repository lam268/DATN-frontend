import { useField, useForm } from 'vee-validate';
import yup from '@/plugins/yup/index';
import { authModule } from '@auth/store';
import { GenderArray, UserGender } from '@/modules/auth/constants';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
import {
    INPUT_NUMBER_MAX_VALUE,
    INPUT_TEXT_MAX_LENGTH,
    MAX_BANK_ACCOUNT_LENGTH,
    MAX_CITIZEN_ID_LENGTH,
    MAX_SOCIAL_INSURANCE_LENGTH,
    MAX_TAX_CODE_LENGTH,
    MIN_BANK_ACCOUNT_LENGTH,
    MIN_CITIZEN_ID_LENGTH,
    MIN_SOCIAL_INSURANCE_LENGTH,
    MIN_TAX_CODE_LENGTH,
    REGEX,
    TEXTAREA_MAX_LENGTH,
} from '@/common/constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { IUser } from '../user/types';
import trim from 'lodash/trim';

export const initEditForm = () => {
    const { t } = useI18n();
    const initValues = {
        phoneNumber: '',
        fullName: '',
        address: '',
        position: '',
        hometownAddress: '',
        birthday: null,
        gender: '',
        idCardIssuePlace: '',
        avatarId: null,
        socialInsurance: '',
        taxCode: '',
        bankAccount: '',
        bank: '',
        citizenId: '',
        provinceId: null,
        citizenIdIssuedAt: null,
    };

    const { handleSubmit, errors, validate, resetForm } = useForm({
        initialValues: initValues,
        validationSchema: yup.object({
            fullName: yup.string().trim().required().max(INPUT_TEXT_MAX_LENGTH),
            birthday: yup
                .string()
                .matches(REGEX.YYYY_MM_DD_HYPHEN)
                .max(INPUT_TEXT_MAX_LENGTH)
                .optional()
                .nullable(),
            gender: yup.string().oneOf(GenderArray).nullable().required(),
            position: yup.string().optional().nullable(),
            address: yup.string().trim().optional().max(TEXTAREA_MAX_LENGTH).nullable(),
            hometownAddress: yup.string().optional().max(TEXTAREA_MAX_LENGTH).nullable(),
            phoneNumber: yup
                .string()
                .trim()
                .matches(REGEX.PHONE_NUMBER, 'auth.profile.messages.invalidPhoneNumber')
                .required()
                .nullable(),
            idCardIssuePlace: yup
                .string()
                .trim()
                .max(INPUT_TEXT_MAX_LENGTH)
                .nullable()
                .required(),
            avatarId: yup
                .number()
                .positive()
                .max(INPUT_NUMBER_MAX_VALUE)
                .optional()
                .nullable(),
            citizenIdIssuedAt: yup
                .string()
                .matches(REGEX.YYYY_MM_DD_HYPHEN)
                .max(INPUT_TEXT_MAX_LENGTH)
                .nullable()
                .required(),
            socialInsurance: yup
                .string()
                .trim()
                .max(MAX_SOCIAL_INSURANCE_LENGTH)
                .nullable()
                .transform((o, c) => (o === '' ? null : c))
                .min(MIN_SOCIAL_INSURANCE_LENGTH),
            taxCode: yup
                .string()
                .trim()
                .max(MAX_TAX_CODE_LENGTH)
                .nullable()
                .transform((o, c) => (o === '' ? null : c))
                .min(MIN_TAX_CODE_LENGTH),
            bankAccount: yup
                .string()
                .trim()
                .max(MAX_BANK_ACCOUNT_LENGTH)
                .min(MIN_BANK_ACCOUNT_LENGTH)
                .nullable()
                .required(),
            bank: yup.string().nullable().required(),
            provinceId: yup
                .number()
                .positive()
                .max(INPUT_NUMBER_MAX_VALUE)
                .optional()
                .nullable()
                .required()
                .label('province'),
            citizenId: yup
                .string()
                .trim()
                .max(MAX_CITIZEN_ID_LENGTH)
                .min(MIN_CITIZEN_ID_LENGTH)
                .nullable()
                .required(),
        }),
    });

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({
            target: '.edit-profile-form-popup',
        });
        const newProfile = {
            fullName: trim(values.fullName as string),
            phoneNumber: trim(values.phoneNumber as string),
            birthday: values.birthday
                ? moment(values.birthday).utc().fmFullTimeString()
                : null,
            citizenIdIssuedAt: values.citizenIdIssuedAt
                ? moment(values.citizenIdIssuedAt).utc().fmFullTimeString()
                : null,
            address: trim(values.address as string),
            hometownAddress: trim(values.hometownAddress as string),
            idCardIssuePlace: values.idCardIssuePlace as string,
            avatarId: values.avatarId as number,
            gender: values.gender as UserGender,
            position: values.position as string,
            socialInsurance: trim(values.socialInsurance as string),
            taxCode: trim(values.taxCode as string),
            bank: trim(values.bank as string),
            bankAccount: trim(values.bankAccount as string),
            citizenId: trim(values.citizenId as string),
            provinceId: values.provinceId as number,
        } as IUser;
        const result = await authModule.updateProfile(newProfile);
        if (result.success) {
            await authModule.getProfile();
            showSuccessNotificationFunction(
                t('auth.profile.messages.updateProfileSuccess') as string,
            );
        } else {
            showErrorNotificationFunction(result.message as string);
        }
        loading.close();
        authModule.setIsShowPopupEditProfile(false);
    });
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: fullName } = useField('fullName');
    const { value: address } = useField('address');
    const { value: hometownAddress } = useField('hometownAddress');
    const { value: birthday } = useField('birthday');
    const { value: gender } = useField('gender');
    const { value: position } = useField('position');
    const { value: idCardIssuePlace } = useField('idCardIssuePlace');
    const { value: avatarId } = useField('avatarId');
    const { value: socialInsurance } = useField('socialInsurance');
    const { value: taxCode } = useField('taxCode');
    const { value: bank } = useField('bank');
    const { value: bankAccount } = useField('bankAccount');
    const { value: provinceId } = useField('provinceId');
    const { value: citizenId } = useField('citizenId');
    const { value: citizenIdIssuedAt } = useField('citizenIdIssuedAt');

    const openPopup = () => {
        const profile = authModule.userProfile;
        resetForm({
            values: {
                ...profile,
                birthday: profile.birthday
                    ? moment(profile.birthday).fmDayString()
                    : null,
                citizenIdIssuedAt: moment(profile.citizenIdIssuedAt).fmDayString(),
                position: profile?.position as unknown as string,
                taxCode: profile?.taxCode?.length ? profile.taxCode : null,
                socialInsurance: profile?.socialInsurance?.length
                    ? profile.socialInsurance
                    : null,
            },
        });
    };
    return {
        errors,
        onSubmit,
        phoneNumber,
        avatarId,
        bank,
        bankAccount,
        citizenIdIssuedAt,
        citizenId,
        socialInsurance,
        taxCode,
        fullName,
        position,
        address,
        hometownAddress,
        birthday,
        gender,
        provinceId,
        idCardIssuePlace,
        validate,
        resetForm,
        openPopup,
    };
};
