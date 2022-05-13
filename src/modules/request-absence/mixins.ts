import moment from 'moment';
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { confirmDeleteRequestAbsence } from './composition/requestAbsence';
import {
    RequestAbsenceStatus,
    RequestAbsenceTab,
    RequestAbsenceType,
    workingTimes,
} from './contants';
import { requestAbsenceModule } from './store';
import { IGetDataRequestAbsence } from './types';

export class RequestAbsenceMixins extends mixins(UtilMixins) {
    absenceStatuses = RequestAbsenceStatus;
    type = RequestAbsenceType;
    timeStartMorning = workingTimes.morning.startTime;
    timeEndAfternoon = workingTimes.afternoon.endTime;
    requestAbsenceTab = RequestAbsenceTab;

    get requestAbsenceList(): IGetDataRequestAbsence[] {
        return requestAbsenceModule.requestAbsenceList;
    }

    imageUrl(row: IGetDataRequestAbsence): string {
        return row?.avatarInfo?.url || require('@/assets/icons/avatar-default.png');
    }

    async handleUpdate(requestAbsence: IGetDataRequestAbsence): Promise<void> {
        requestAbsenceModule.setIsShowRequestAbsenceFormPopup(true);
        requestAbsenceModule.setSelectedRequestAbsenceId(requestAbsence);
    }

    async handleDelete(id: number): Promise<void> {
        await confirmDeleteRequestAbsence(id);
    }

    formatDate(date: string): string {
        return moment(date).fmFullTimeWithoutSecond();
    }
}
