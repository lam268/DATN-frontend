import yup from '@/plugins/yup';
import {
    MAX_LENGTH_DAYS_OF_MONTH,
    TEXTAREA_MAX_LENGTH,
    INPUT_TEXT_MAX_LENGTH,
    INPUT_NUMBER_MAX_VALUE,
    REGEX,
} from '@/common/constants';
export const HolidaySchema = yup.object({
    title: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).required(),
    description: yup.string().trim().max(TEXTAREA_MAX_LENGTH).required(),
    date: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
});

export const initialSelectedHoliday = {
    id: NaN,
    title: '',
    description: '',
    date: '',
};

export const calendarInitOptions = {
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    headerToolbar: {
        left: '',
        center: '',
        right: '',
    },
    eventStartEditable: false,
    initialView: 'dayGridMonth',
    showNonCurrentDates: false,
};

export const SortOptions = [
    {
        label: 'setting.contractType.filterForm.createdAt',
        value: 'createdAt',
    },
    {
        label: 'setting.contractType.filterForm.name',
        value: 'name',
    },
];

function convertNaNtoNull(value: number | typeof NaN) {
    if (Number.isNaN(value)) {
        return null;
    }
    return value;
}

export const validateContractTypeSchema = yup.object({
    name: yup.string().max(INPUT_TEXT_MAX_LENGTH).trim().required(),
    description: yup.string().max(TEXTAREA_MAX_LENGTH).trim().optional(),
    expiredIn: yup
        .number()
        .max(INPUT_NUMBER_MAX_VALUE)
        .positive()
        .nullable()
        .transform((value) => convertNaNtoNull(value))
        .typeError('setting.contractType.message.expiredInType'),
    paidLeaveDays: yup
        .number()
        .required()
        .min(0)
        .max(MAX_LENGTH_DAYS_OF_MONTH)
        .typeError('setting.contractType.message.paidLeaveDaysRequired'),
});

export enum SettingKey {
    USER_POSITION = 'user_position',
    APPLIED_POSITION = 'applied_position',
    ASSET_CATEGORY = 'asset_category',
    PAID_LEAVE_DAYS_RESET_SCHEDULE = 'paid_leave_days_reset_schedule',
}

export const MAX_USER_POSITION_COUNT = 20;
export const MAX_APPLIED_POSITION_COUNT = 20;
export const MAX_ASSET_CATEORY_COUNT = 50;
