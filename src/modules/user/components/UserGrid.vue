<template>
    <div class="list-wrapper">
        <div class="row">
            <template v-for="user in users" :key="user.id">
                <div class="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
                    <UserCard :user="user" />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { userModule } from '../store';
import { IUser } from '../types';
import UserCard from './UserCard.vue';

@Options({
    components: { UserCard },
})
export default class UserGrid extends Vue {
    get users(): IUser[] {
        return userModule.users;
    }
}
</script>

<style scoped lang="scss">
.list-wrapper {
    padding: 20px 20px;
    @media only screen and (max-width: 991.98px) {
        margin: 0 5px;
    }
    overflow: auto;
    /* width */
    &::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: rgb(180, 179, 179);
        border-radius: 10px;
    }
}
</style>
