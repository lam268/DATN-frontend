/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { INPUT_TEXT_MAX_LENGTH, PASSWORD_MIN_LENGTH, REGEX } from '@/common/constants';
import { IBodyResponse } from '@/common/types';
import { IUser } from '@/modules/user/types';
import i18n from '@/plugins/vue-i18n';
import yup from '@/plugins/yup';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { authService } from '../services/api.services';
import { authModule } from '../store';

const validateChangePasswordSchema = yup.object({
    oldPassword: yup
        .string()
        .trim()
        .required()
        .matches(REGEX.PASSWORD)
        .min(PASSWORD_MIN_LENGTH)
        .max(INPUT_TEXT_MAX_LENGTH)
        .label('oldPassword'),
    newPassword: yup
        .string()
        .trim()
        .required()
        .matches(REGEX.PASSWORD)
        .min(PASSWORD_MIN_LENGTH)
        .max(INPUT_TEXT_MAX_LENGTH)
        .label('newPassword'),
    reNewPassword: yup
        .string()
        .trim()
        .required()
        .matches(REGEX.PASSWORD)
        .min(PASSWORD_MIN_LENGTH)
        .max(INPUT_TEXT_MAX_LENGTH)
        .label('reNewPassword')
        .oneOf(
            [yup.ref('newPassword')],
            i18n.global.t('auth.profile.changePassword.dontmatch'),
        ),
});

export function setupChangePasswordForm() {
    const initValues = {
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
    };
    const { handleSubmit, errors, resetForm } = useForm({
        initialValues: initValues,
        validationSchema: validateChangePasswordSchema,
    });
    const { t } = useI18n();

    const onSubmitChangePassword = handleSubmit(async (values) => {
        const loading = ElLoading.service({
            target: '.change-password-form-popup',
        });
        const response = await authService.changePassword({
            oldPassword: values?.oldPassword || '',
            newPassword: values?.newPassword || '',
        });
        console.log(response);
        loading.close();
        if (response.data) {
            showSuccessNotificationFunction(t('auth.profile.changePassword.success'));
            authModule.setIsShowPopupChangePassword(false);
        } else {
            showErrorNotificationFunction(
                (response as IBodyResponse<IUser>).message as string,
            );
        }
    });

    const openPopup = () => {
        resetForm({
            values: initValues,
        });
    };

    const { value: oldPassword } = useField('oldPassword');
    const { value: newPassword } = useField('newPassword');
    const { value: reNewPassword } = useField('reNewPassword');
    return {
        errors,
        oldPassword,
        openPopup,
        newPassword,
        reNewPassword,
        onSubmitChangePassword,
        resetForm,
    };
}
