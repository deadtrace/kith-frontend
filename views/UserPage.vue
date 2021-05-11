<template>
    <div class="user-page-container">
        <UserCard v-if="parseInt($store.getters.userID, 10) !== parseInt($route.params.user_id, 10)"></UserCard>
        <div v-else class="user-page-layout-me">
            <myProfileCard></myProfileCard>
            <ServicesCard></ServicesCard>
        </div>
        <div class="user-ads-section">
            <div class="ads--title" @click="$router.push({name: 'ads'})">Объявления</div>
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
                <button class="profile-layout-ads-button" v-if="$route.params.user_id === $store.getters.userID" @click="$router.push({name: 'ads'})">
                    Объявления
                </button>
                <button class="profile-layout-ads-button" v-else @click="$router.push({path: `/user/${$route.params.user_id}/ads`})">
                    Объявления
                </button>
            </div>
            <div class="user-ads">
                <Ad v-for="board in boards" :key="board.id" :board="board"></Ad>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from "@/components/UserCard";
import myProfileCard from "@/components/myProfileCard";
import Ad from "@/components/ads/SmallAd";
import * as Boards from "@/services/boards";
import ServicesCard from "@/components/ServicesCard";

export default {
    data: () => ({
        boards: []
    }),
    methods: {
        getUserAds() {
            Boards.getUserBoardsById(4, 0, "", this.$route.params.user_id)
                .then(res => {
                    this.boards = res.data.boards;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        }
    },
    created() {
        this.getUserAds();
    },
    components: {
        UserCard,
        Ad,
        myProfileCard,
        ServicesCard
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.user-page-container {
    max-width: 1280px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.ads--title {
    color: #4d595e;
    font-size: 20px;
    line-height: 27px;
    border-radius: 18px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    height: 38px;
    padding: 0 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin-top: 23px;
    margin-bottom: 20px;
    cursor: pointer;
}

.user-ads-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.user-ads {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
    width: 100%;
}

@media (min-width: 768px) {
    .ads--title {
        align-self: flex-start;
    }

    .user-ads-section {
        margin-left: 80px;
        margin-right: 80px;
        display: block;
    }

    .user-ads {
        gap: 12px;
        flex-direction: row;
        justify-content: space-between;
        width: calc(100% - 160px);
    }
}

@media (min-width: 1280px) {
    .user-page-container {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
    }

    .user-ads-section {
        margin-left: 0px;
        margin-right: 0px;
        min-width: 642px;
        max-width: 642px;
    }

    .ads--title {
        margin-top: 0px;
    }

    .user-ads {
        justify-content: flex-start;
        gap: 25px;
        width: 100%;
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

    .ads--title {
        display: none;
    }
}

.profile-layout-ads-button {
    border-radius: 18px;
    box-sizing: border-box;
    height: 38px;
    box-shadow: 0px 6px 6px rgba(0,0,0,0.06);
    color: #4D595E;
    font-size: 20px;
    padding: 0px 26px;
    margin-top: 19px;
    margin-bottom: 30px;
}

@media (max-width: 1280px) {
    .user-page-layout-me {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>