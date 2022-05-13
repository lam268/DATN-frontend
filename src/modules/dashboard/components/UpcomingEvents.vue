<template>
    <div class="upcoming-events-container">
        <h3 class="justify-content-start d-flex upcoming-events-title p-0">
            {{ $t(`dashboard.dashboard.title.upcomingEvents`) }}
        </h3>
        <div class="events">
            <ul>
                <li
                    v-for="event in upcomingEvents"
                    :key="`event-${event.id}`"
                    class="event"
                >
                    <h5>{{ event.title }}</h5>
                    <span
                        >{{ formatDate(event.startDate) }} -
                        {{ formatDate(event.endDate) }}</span
                    >
                </li>
            </ul>
        </div>
        <div class="footer">
            <span
                class="view-more"
                v-if="eventCount > eventPageLimit"
                @click="onClickViewMore"
                >{{ $t('dashboard.dashboard.assetManagement.viewMore') }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { dashboardModule } from '../store';
import { EVENT_PAGE_LIMIT } from '../constant';
import { IEvent } from '@/modules/event/types';
import moment from 'moment';
import router from '@/router';
import { PageName } from '@/common/constants';
export default class UpcomingEvents extends Vue {
    eventPageLimit = EVENT_PAGE_LIMIT;
    get upcomingEvents(): IEvent[] {
        return dashboardModule.upcomingEvents;
    }

    get eventCount(): number {
        return dashboardModule.eventCount;
    }

    formatDate(date: string): string {
        return moment(date).fmDayString();
    }

    onClickViewMore(): void {
        router.push({
            name: PageName.EVENT_PAGE,
        });
    }
}
</script>

<style lang="scss" scoped>
.upcoming-events-container {
    background-color: $--color-gray-200;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    padding: 10px;
    text-align: left;
    margin-top: 20px;

    .events {
        overflow-y: auto;
        max-height: 220px;
    }

    .footer {
        text-align: right;
        margin-top: 10px;
        .view-more {
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
.event {
    margin-bottom: 5px;
    h5 {
        font-weight: 600;
        color: #313131;
    }
}
</style>
