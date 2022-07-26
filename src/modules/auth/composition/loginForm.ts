import { REGEX } from '@/common/constants';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { authModule } from '../store';
import { ILoginForm } from '../types';

const loginValidateSchema = yup.object({
    email: yup.string().email().matches(REGEX.EMAIL).required(),
    password: yup.string().matches(REGEX.PASSWORD).required(),
});

export const loginForm = () => {
    const initValues = {
        email: '',
        password: '',
    };

    const { errors, resetForm, handleSubmit } = useForm({
        validationSchema: loginValidateSchema,
        initialValues: initValues,
    });

    const onSubmit = handleSubmit(async (values) => {
        await authModule.loginWithEmail({
            ...values,
        } as ILoginForm);
    });

    const { value: email } = useField('email');
    const { value: password } = useField('password');

    return {
        errors,
        email,
        password,
        resetForm,
        onSubmit,
    };
};
