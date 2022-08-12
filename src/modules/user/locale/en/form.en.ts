import {
    DATE_TIME_FORMAT,
    INPUT_TEXT_MAX_LENGTH,
    MAX_BANK_ACCOUNT_LENGTH,
    MAX_CITIZEN_ID_LENGTH,
    MAX_SOCIAL_INSURANCE_LENGTH,
    MAX_TAX_CODE_LENGTH,
    MIN_BANK_ACCOUNT_LENGTH,
    MIN_CITIZEN_ID_LENGTH,
    MIN_DATE_PICKER,
    MIN_SOCIAL_INSURANCE_LENGTH,
    MIN_TAX_CODE_LENGTH,
    TEXTAREA_MAX_LENGTH,
} from '@/common/constants';
import moment from 'moment-timezone';

export default {
    titleCreateUser: 'Create new user',
    titleUpdateUser: 'Update user',
    message: {
        title: 'Notification',
        createSuccess: 'Create user successfully',
        updateSuccess: 'Update user successfully',
        systemError: 'System error',
        invalidEmail: 'The email field must be a valid email',
        text_length: 'Input text length must not exceed 255 characters',
        textarea_length: 'Input text length must not exceed 2000 characters',
        fileNameCSV: 'File type must be .csv, .xlsx or .xls',
        uploadFail: 'Upload file failed',
        fileEmpty: 'File is not allowed to be empty',
        uploadSuccess: 'Upload file success',
        fileLarge: 'File size too large',
        fileError: "File's data is error",
        importUserSuccess: 'Import user successfully',
    },
    fullName: {
        label: 'Full name',
        placeholder: 'Enter full name',
    },
    socialInsurance: {
        label: 'Social insurance',
        placeholder: 'Enter social insurance',
    },
    taxCode: {
        label: 'Tax code',
        placeholder: 'Enter tax code',
    },
    email: {
        label: 'Email',
        placeholder: 'Enter email',
        invalid: 'The Email field format is invalid',
    },
    phoneNumber: {
        label: 'Phone number',
        placeholder: 'Enter phone number',
        invalid: 'Phone number must be 10 or 11 digits',
    },
    bankAccount: {
        label: 'Bank account',
        placeholder: 'Enter bank account',
    },
    birthday: {
        label: 'Birthday',
        placeholder: 'Select a birthday',
    },
    gender: {
        label: 'Gender',
        placeholder: 'Select a gender',
    },
    bank: {
        label: 'Bank',
        placeholder: 'Select a bank',
    },
    province: {
        label: 'Province',
        placeholder: 'Select a province',
    },
    idCardIssuePlace: {
        label: 'Place of issue of identity card',
        placeholder: 'Enter place',
    },
    role: {
        label: 'Role',
        placeholder: 'Select a role',
    },
    citizenId: {
        label: 'Citizen Id',
        placeholder: 'Enter citizen Id',
    },
    citizenIdIssuedAt: {
        label: 'Citizen id issued at',
        placeholder: 'Select a citizen ID issued time',
    },
    position: {
        label: 'Position',
        placeholder: 'Select a position',
    },
    address: {
        label: 'Address',
        placeholder: 'Enter address',
    },
    hometownAddress: {
        label: 'Hometown address',
        placeholder: 'Enter hometown address',
    },
    button: {
        cancel: 'Cancel',
        submit: 'Save',
        delete: 'Delete',
    },
    import: {
        importUserResult: 'Imported users',
        importUser: 'Import users',
        fullName: {
            required: 'The full name field is required',
            maxLength: `Full name length must be less than or equal to ${INPUT_TEXT_MAX_LENGTH} characters`,
        },
        birthday: {
            invalid: 'Birthday is invalid',
            afterNow: 'Birthday must be less than now',
            minDate: `Birthday must be more than ${moment(MIN_DATE_PICKER).format(
                DATE_TIME_FORMAT.DD_MM_YYYY_SLASH,
            )}`,
        },
        role: {
            required: 'The role field is required',
            maxLength: `Role must be less than or equal to ${INPUT_TEXT_MAX_LENGTH} characters`,
        },
        citizenIdIssuedAt: {
            required: 'The citizen id issued at field is required',
            invalid: 'Citizen id issued at is invalid',
            afterNow: 'Citizen id issued at must be less than now',
            minDate: `Citizen id issued at must be more than ${moment(
                MIN_DATE_PICKER,
            ).format(DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)}`,
        },
        idCardIssuePlace: {
            required: 'The id card issue place field is required',
            maxLength: `Id card issue place must be less than or equal to ${INPUT_TEXT_MAX_LENGTH} characters`,
        },
        bank: {
            required: 'The bank field is required',
            invalid: 'Bank is invalid',
            maxLength: `Bank must be less than or equal to ${INPUT_TEXT_MAX_LENGTH} characters`,
        },
        province: {
            required: 'The province field is required',
            maxLength: `Province must be less than or equal to ${INPUT_TEXT_MAX_LENGTH} characters`,
        },
        email: {
            required: 'The email field is required',
            formatError: 'The email must be correct format',
            uniqueError: 'Email must be unique',
            maxLength: `Email length must be less than or equal to ${INPUT_TEXT_MAX_LENGTH} characters`,
        },
        phoneNumber: {
            required: 'The phone number field is required',
            invalid: 'Phone number is invalid',
        },
        gender: {
            required: 'The gender field is required',
            invalid: 'Gender is invalid',
        },
        taxCode: {
            uniqueError: 'Tax code must be unique',
            maxLength: `Tax code length must be less than or equal to ${MAX_TAX_CODE_LENGTH} characters`,
            minLength: `Tax code length must be more than or equal to ${MIN_TAX_CODE_LENGTH} characters`,
            invalid: 'Tax code is invalid',
        },
        bankAccount: {
            required: 'The bank account field is required',
            uniqueError: 'Bank account must be unique',
            maxLength: `Bank account length must be less than or equal to ${MAX_BANK_ACCOUNT_LENGTH} characters`,
            minLength: `Bank account length must be more than or equal to ${MIN_BANK_ACCOUNT_LENGTH} characters`,
            invalid: 'Bank account is invalid',
        },
        citizenId: {
            required: 'The citizen id field is required',
            uniqueError: 'Citizen id must be unique',
            maxLength: `Citizen id length must be less than or equal to ${MAX_CITIZEN_ID_LENGTH} characters`,
            minLength: `Citizen id length must be more than or equal to ${MIN_CITIZEN_ID_LENGTH} characters`,
            invalid: 'Citizen id is invalid',
        },
        socialInsurance: {
            required: 'The social insurance field is required',
            uniqueError: 'Social insurance must be unique',
            maxLength: `Social insurance must be less than or equal to ${MAX_SOCIAL_INSURANCE_LENGTH} characters`,
            minLength: `Social insurance must be more than or equal to ${MIN_SOCIAL_INSURANCE_LENGTH} characters`,
            invalid: 'Social insurance is invalid',
        },
        position: {
            required: 'The position field is required',
            invalid: 'Position is invalid',
        },
        address: {
            maxLength: `Address must be less than or equal to ${TEXTAREA_MAX_LENGTH} characters`,
        },
        hometownAddress: {
            maxLength: `Hometown address must be less than or equal to ${TEXTAREA_MAX_LENGTH} characters`,
        },
        note: {
            maxLength: `Note must be less than or equal to ${TEXTAREA_MAX_LENGTH} characters`,
        },
    },
};
