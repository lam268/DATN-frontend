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
    titleCreateUser: 'Tạo mới người dùng',
    titleUpdateUser: 'Chỉnh sửa người dùng',
    message: {
        title: 'Thông báo',
        createSuccess: 'Tạo mới người dùng thành công',
        updateSuccess: 'Chỉnh sửa người dùng thành công',
        systemError: 'Lỗi hệ thống',
        invalidEmail: 'Email không hợp lệ',
        text_length: 'Độ dài văn bản nhập vào không quá 255 ký tự',
        textarea_length: 'Độ dài văn bản nhập vào không quá 2000 ký tự',
        fileNameCSV: 'Định dạng tệp phải là .csv hoặc xlsx hoặc xls',
        uploadFail: 'Tải tệp không thành công',
        fileEmpty: 'Tệp dữ liệu là một trường bắt buộc',
        uploadSuccess: 'Tải tệp thành công',
        fileLarge: 'Dung lượng tệp tin quá lớn',
        fileError: 'Dữ liệu trong file bị lỗi',
        importUserSuccess: 'Người dùng được tải lên thành công',
    },
    fullName: {
        label: 'Họ tên',
        placeholder: 'Nhập họ tên người dùng',
    },
    socialInsurance: {
        label: 'Bảo hiểm xã hội',
        placeholder: 'Nhập số BHXH',
    },
    taxCode: {
        label: 'Mã số thuế',
        placeholder: 'Nhập mã số thuế',
    },
    email: {
        label: 'Email',
        placeholder: 'Nhập email',
        invalid: 'Email không hợp lệ',
    },
    phoneNumber: {
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại',
        invalid: 'Số điện thoại phải có 10 hoặc 11 chữ số',
    },
    bankAccount: {
        label: 'Tài khoản ngân hàng',
        placeholder: 'Nhập STK ngân hàng',
    },
    birthday: {
        label: 'Ngày sinh',
        placeholder: 'Chọn ngày sinh',
    },
    gender: {
        label: 'Giới tính',
        placeholder: 'Chọn giới tính',
    },
    bank: {
        label: 'Ngân hàng',
        placeholder: 'Chọn ngân hàng',
    },
    idCardIssuePlace: {
        label: 'Nơi cấp căn cước công dân',
        placeholder: 'Nhập nơi cấp',
    },
    citizenId: {
        label: 'Căn cước công dân',
        placeholder: 'Nhập ở đây',
    },
    citizenIdIssuedAt: {
        label: 'Ngày cấp',
        placeholder: 'Chọn ngày cấp',
    },
    role: {
        label: 'Vai trò',
        placeholder: 'Chọn vai trò',
    },
    province: {
        label: 'Tỉnh thành',
        placeholder: 'Chọn tỉnh',
    },
    position: {
        label: 'Vị trí',
        placeholder: 'Chọn vị trí',
    },
    address: {
        label: 'Nơi ở hiện tại',
        placeholder: 'Nhập vào đây',
    },
    hometownAddress: {
        label: 'Quê quán',
        placeholder: 'Nhập vào đây',
    },
    button: {
        cancel: 'Hủy',
        submit: 'Xác nhận',
        delete: 'Xóa',
    },
    import: {
        importUserResult: 'Danh sách người dùng được tải lên',
        importUser: 'Tải tệp người dùng',
        fullName: {
            required: 'Họ tên là trường bắt buộc',
            maxLength: `Họ tên phải có ít hơn hoặc bằng ${INPUT_TEXT_MAX_LENGTH} kí tự`,
        },
        birthday: {
            invalid: 'Ngày sinh không hợp lệ',
            afterNow: 'Ngày sinh phải nhỏ hơn hiện tại',
            minDate: `Ngày sinh phải lớn hơn ${moment(MIN_DATE_PICKER).format(
                DATE_TIME_FORMAT.DD_MM_YYYY_SLASH,
            )}`,
        },
        role: {
            required: 'Vai trò là trường bắt buộc',
            maxLength: `Vai trò phải có ít hơn hoặc bằng ${INPUT_TEXT_MAX_LENGTH} kí tự`,
        },
        citizenIdIssuedAt: {
            required: 'Ngày cấp căn cước công dân là trường bắt buộc',
            invalid: 'Ngày cấp căn cước công dân không hợp lệ',
            afterNow: 'Ngày cấp căn cước công dân phải nhỏ hơn hiện tại',
            minDate: `Ngày cấp căn cước công dân phải lớn hơn ${moment(
                MIN_DATE_PICKER,
            ).format(DATE_TIME_FORMAT.DD_MM_YYYY_SLASH)}`,
        },
        idCardIssuePlace: {
            required: 'Nơi cấp căn cước công dân là trường bắt buộc',
            maxLength: `Nơi cấp căn cước công dân phải có ít hơn hoặc bằng ${INPUT_TEXT_MAX_LENGTH} kí tự`,
        },
        bank: {
            required: 'Ngân hàng là trường bắt buộc',
            maxLength: `Ngân hàng phải có ít hơn hoặc bằng ${INPUT_TEXT_MAX_LENGTH} kí tự`,
        },
        province: {
            required: 'Tỉnh thành là trường bắt buộc',
            maxLength: `Tỉnh thành phải có ít hơn hoặc bằng ${INPUT_TEXT_MAX_LENGTH} kí tự`,
        },
        email: {
            required: 'Email là trường bắt buộc',
            formatError: 'Email không đúng định dạng',
            uniqueError: 'Email phải là duy nhất',
            maxLength: `Email phải có ít hơn hoặc bằng ${INPUT_TEXT_MAX_LENGTH} kí tự`,
        },
        phoneNumber: {
            required: 'Số điện thoại là trường bắt buộc',
            invalid: 'Số điện thoại không đúng định dạng',
        },
        gender: {
            required: 'Giới thính là trường bắt buộc',
            invalid: 'Giới tính không hợp lệ',
        },
        taxCode: {
            uniqueError: 'Mã số thuế phải là duy nhất',
            maxLength: `Mã số thuế phải có ít hơn hoặc bằng ${MAX_TAX_CODE_LENGTH} kí tự`,
            minLength: `Mã số thuế phải có nhiều hơn hoặc bằng ${MIN_TAX_CODE_LENGTH} kí tự`,
            invalid: 'Mã số thuế không đúng định dạng',
        },
        bankAccount: {
            required: 'Tài khoản ngân hàng là trường bắt buộc',
            uniqueError: 'Tài khoản ngân hàng phải là duy nhất',
            maxLength: `Tài khoản ngân hàng phải có ít hơn hoặc bằng ${MAX_BANK_ACCOUNT_LENGTH} kí tự`,
            minLength: `Tài khoản ngân hàng phải có nhiều hơn hoặc bằng ${MIN_BANK_ACCOUNT_LENGTH} kí tự`,
            invalid: 'Tài khoản ngân hàng không đúng định dạng',
        },
        citizenId: {
            required: 'Căn cước công dân là trường bắt buộc',
            uniqueError: 'Căn cước công dân phải là duy nhất',
            maxLength: `Căn cước công dân phải có ít hơn hoặc bằng ${MAX_CITIZEN_ID_LENGTH} kí tự`,
            mimLength: `Căn cước công dân phải có ít hơn hoặc bằng ${MIN_CITIZEN_ID_LENGTH} kí tự`,
            invalid: 'Căn cước công dân không đúng định dạng',
        },
        socialInsurance: {
            required: 'Mã bảo hiểm xã hội là trường bắt buộc',
            uniqueError: 'Mã bảo hiểm xã hội phải là duy nhất',
            maxLength: `Mã bảo hiểm xã hội phải có ít hơn hoặc bằng ${MAX_SOCIAL_INSURANCE_LENGTH} kí tự`,
            minLength: `Mã bảo hiểm xã hội phải có nhiều hơn hoặc bằng ${MIN_SOCIAL_INSURANCE_LENGTH} kí tự`,
            invalid: 'Mã bảo hiểm xã hội không đúng định dạng',
        },
        position: {
            required: 'Vị trí là trường bắt buộc',
            invalid: 'Vị trí không hợp lệ',
        },
        address: {
            maxLength: `Nơi ở hiện tại phải có ít hơn hoặc bằng ${TEXTAREA_MAX_LENGTH} kí tự`,
        },
        hometownAddress: {
            maxLength: `Quê quán phải có ít hơn hoặc bằng ${TEXTAREA_MAX_LENGTH} kí tự`,
        },
        note: {
            maxLength: `Ghi chú phải có ít hơn hoặc bằng ${TEXTAREA_MAX_LENGTH} kí tự`,
        },
    },
};
