<template>
    <div class="v-avt">
        <img :src="imageUrl" class="avt" />
        <p class="txt-name">{{ user?.fullName }}</p>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IUserTimeKeeping } from '../types';
export default class UserColumn extends Vue {
    @Prop() readonly user!: IUserTimeKeeping;

    get imageUrl(): string {
        return this.user?.avatarUrl || require('@/assets/icons/avatar-default.png');
    }
}
</script>
<style scoped lang="scss">
.txt-name {
    margin: 0px;
    cursor: pointer !important;
}
.v-avt {
    display: flex;
    align-items: center;
}
.avt {
    width: 30px;
    height: 30px;
    margin-right: 15px;
    border-radius: 25px;
    object-fit: cover;
    margin-left: 20px;
}
</style>
