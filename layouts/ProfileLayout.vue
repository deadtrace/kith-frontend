<template>
    <div class="profile-layout">
        <div class="profile-layout-left">
            <MyProfileCard></MyProfileCard>
            <ServicesCard></ServicesCard>
        </div>
        <div class="profile-layout-r">
            <div class="profile-layout-buttons">
                <button class="create-add-button" @click="$router.push({name: 'addAd'})">
                    Создать объявление
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.222"
                        height="12.52"
                        viewBox="0 0 13.222 12.52"
                        style="margin-left: 18px;"
                    >
                        <g
                            id="Group_510"
                            data-name="Group 510"
                            transform="translate(-1307.5 -31.5)"
                        >
                            <line
                                id="Line_63"
                                data-name="Line 63"
                                y2="10.52"
                                transform="translate(1314.111 32.5)"
                                fill="none"
                                stroke="#fff"
                                stroke-linecap="round"
                                stroke-width="2"
                            />
                            <line
                                id="Line_64"
                                data-name="Line 64"
                                x2="11.222"
                                transform="translate(1308.5 37.409)"
                                fill="none"
                                stroke="#fff"
                                stroke-linecap="round"
                                stroke-width="2"
                            />
                        </g>
                    </svg>
                </button>
                <button
                    class="profile-layout-ads-button"
                    @click="$router.push({name: 'ads'})"
                >Объявления</button>
            </div>
            <div class="breadcrumbs">
                <div class="breadcrumb-left" @click="$router.push({path: `/user/${$store.getters.userID}`})">Мой профиль</div>
                <svg class="breadcrumb-separator"
                    xmlns="http://www.w3.org/2000/svg"
                    width="7.828"
                    viewBox="0 0 7.828 12.828"
                >
                    <g
                        id="Group_356"
                        data-name="Group 356"
                        transform="translate(-167.086 490.914) rotate(-90)"
                    >
                        <line
                            id="Line_57"
                            data-name="Line 57"
                            x2="5"
                            y2="5"
                            transform="translate(479.5 168.5)"
                            fill="none"
                            stroke="#686868"
                            stroke-linecap="round"
                            stroke-width="2"
                        />
                        <line
                            id="Line_58"
                            data-name="Line 58"
                            x1="5"
                            y2="5"
                            transform="translate(484.5 168.5)"
                            fill="none"
                            stroke="#686868"
                            stroke-linecap="round"
                            stroke-width="2"
                        />
                    </g>
                </svg>
                <div class="breadcrumb-right" v-if="$router.currentRoute.path === `/profile/messages`">Сообщения</div>
                <div class="breadcrumb-right" v-if="$router.currentRoute.path === `/profile/settings`">Редактирование профиля</div>
                <div class="breadcrumb-right" v-if="$router.currentRoute.path === `/profile/password`">Редактирование пароля</div>
            </div>
            <div class="profile-layout-right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import MyProfileCard from "@/components/myProfileCard.vue";
import ServicesCard from "@/components/ServicesCard.vue";

export default {
    components: {
        MyProfileCard,
        ServicesCard
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.profile-layout {
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: flex-start;
    max-width: 1280px;
}

.profile-layout-left {
    display: none;
}

.profile-layout-right {
    display: flex;
    justify-content: center;
    width: 100%;
}

.profile-layout-r {
    width: 100%;
}

@media (min-width: 1280px) {
    .profile-layout-right {
        width: auto;
    }

    .profile-layout-r {
        margin-left: 33px;
    }

    .profile-layout-left {
        display: initial;
    }
}

.create-add-button {
    background-color: var(--main-color);
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
    border-radius: 21px;
    box-sizing: border-box;
    height: 36px;
    padding: 0px 13px;
    color: white;
    display: flex;
    align-items: center;
    font-size: 18px;
}

.profile-layout-buttons {
    display: none;
}

@media (min-width: 1280px) {
    .profile-layout-buttons {
        display: block;
    }
}

.profile-layout-ads-button {
    border-radius: 18px;
    box-sizing: border-box;
    height: 38px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
    color: #4d595e;
    font-size: 20px;
    padding: 0px 26px;
    margin-top: 19px;
    margin-bottom: 30px;
}

/* BREADCRUMBS_START */

.breadcrumbs {
    display: flex;
    align-items: center;
    margin-left: 27px;
    margin-bottom: 12px;
}

@media (min-width: 768px) {
    .breadcrumbs {
        margin-left: 36px;
        margin-bottom: 15px;
    }
}

@media (min-width: 1280px) {
    .breadcrumbs {
        display: none;
    }
}

.breadcrumb-left {
    font-family: Intro;
    color: #b2b2b2;
    font-size: 15px;
    line-height: 20px;
    cursor: pointer;
}

.breadcrumb-right {
    font-size: 15px;
    line-height: 20px;
    color: #7a7a7a;
    font-family: Intro;
}

.breadcrumb-separator {
    margin-left: 14px;
    margin-right: 14px;
    height: 12px;
}

@media (min-width: 768px) {
    .breadcrumb-right,
    .breadcrumb-left {
        font-size: 20px;
        line-height: 27px;
    }

    .breadcrumb-separator {
        margin-left: 19px;
        margin-right: 19px;
        height: 20px;
    }
}

/* BREADCRUMBS_END */
</style>