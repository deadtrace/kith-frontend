<template>
    <div class="dialog-page-container">
        <UserCard class="dialog-page-user-card" :key="componentKey"></UserCard>
        <div>
            <button class="dialog-page-ads-button" @click="$router.push({name: 'ads'})">Объявления</button>
            <div class="breadcrumbs">
                <div
                    class="breadcrumb-left"
                    @click="$router.push({path: `/user/${$store.getters.userID}`})"
                >Мой профиль</div>
                <svg
                    class="breadcrumb-separator"
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
                <div
                    class="breadcrumb-right"
                >Сообщения</div>
            </div>
            <Dialog :user="user" :key="componentKey"></Dialog>
        </div>
    </div>
</template>

<script>
import UserCard from "@/components/UserCard.vue";
import Dialog from "@/components/messages/Dialog.vue";
import * as Users from "@/services/users";

export default {
    data: () => ({
        boards: [],
        user: "",
        componentKey: 0
    }),
    methods: {
        getUserInfo() {
            Users.get(this.$route.params.user_id)
                .then(res => {
                    this.user = `${res.data.firstname} ${res.data.lastname}`;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке данных пользователя"
                    );
                });
        }
    },
    created() {
        this.getUserInfo();
    },
    components: {
        UserCard,
        Dialog
    },
    computed: {
        paramUser() {
            return this.$route.params.user_id;
        }
    },
    watch: {
        paramUser: function() {
            this.componentKey += 1;
            this.getUserInfo();
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.dialog-page-container {
    max-width: 1280px;
    width: 100%;
}

.dialog-page-user-card {
    display: none;
}

@media (min-width: 1280px) {
    .dialog-page-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    .dialog-page-user-card {
        display: block;
    }
}

.dialog-page-ads-button {
    border-radius: 18px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    color: #4d595e;
    font-size: 20px;
    box-sizing: border-box;
    height: 38px;
    padding: 0px 26px;
    margin-bottom: 30px;
    display: none;
}

@media (min-width: 1280px) {
    .dialog-page-ads-button {
        display: block;
    }
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