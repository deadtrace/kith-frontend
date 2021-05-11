<template>
    <section class="header">
        <div class="header-container">
            <div class="header-left" @click="$router.push({path: '/'})">
                <img src="@/assets/logo.png" class="logo" />
                <span class="company-name">Знакомые</span>
            </div>
            <div v-if="$store.getters.userID" class="header-right">
                <div class="add" @click="$router.push({path: '/add'})">
                    <span class="add-text">Создать объявление</span>
                    <img src="@/assets/plus.svg" class="plus" />
                </div>
                <div class="username" v-on-clickaway:mousedown="hideDropdown">
                    <span @click="dropdownOpened = !dropdownOpened">{{ $store.getters.username }}</span>
                    <transition name="fade" appear>
                        <div class="dropdown" v-if="dropdownOpened">
                            <div
                                class="dropdown-item"
                                @click="$router.push({ name: 'profileSettings' }); dropdownOpened=false;"
                            >Профиль</div>
                            <div
                                class="dropdown-item"
                                @click="$router.push({ name: 'circle' }); dropdownOpened=false;"
                            >Мой круг</div>
                            <div
                                class="dropdown-item"
                                @click="$router.push({ name: 'messagesList' }); dropdownOpened=false;"
                            >Сообщения</div>
                            <div
                                class="dropdown-item"
                                @click="$router.push({ name: 'ads' }); dropdownOpened=false;"
                            >Объявления</div>
                            <div
                                class="dropdown-item"
                                @click="$router.push({path: `/user/${$store.getters.userID}`}); dropdownOpened=false;"
                            >Услуги</div>
                            <div
                                style="color: var(--main-color);"
                                class="dropdown-item"
                                @click="logout"
                            >Выйти</div>
                        </div>
                    </transition>
                </div>
                <div class="notifications clickable" v-on-clickaway:mousedown="hideNotifications">
                    <img
                        src="@/assets/notificationsRing.png"
                        class="ring"
                        @click="notifications = []; notificationsPage = 1; getNotifications(notificationsPage); notificationsOpened = !notificationsOpened;"
                    />
                    <div
                        class="notifications-counter"
                        v-if="$store.getters.unreadNotificationsCounter !== 0"
                    >{{ $store.getters.unreadNotificationsCounter }}</div>
                    <transition name="fade" appear>
                        <div class="notifications-box" v-if="notificationsOpened">
                            <div class="notifications-box-title">Уведомления</div>
                            <div class="notifications-box-items">
                                <div
                                    class="notifications-box-item"
                                    v-for="(notification, index) in notifications"
                                    :key="index"
                                    :style="!notification.read ? 'border: 1px solid rgba(6, 128, 194, 0.4);' : ''"
                                    @click="notification.text === 'Новое сообщение!' ? navigateToConversation(notification.meta.user.id) : ``"
                                >
                                    <div
                                        class="notifications-box-item-photo"
                                        :style="`background-image: url(${notification.meta.user.photo});`"
                                    ></div>
                                    <div class="notifications-box-item-right">
                                        <div
                                            class="notifications-box-item-username"
                                        >{{ `${notification.meta.user.firstname} ${notification.meta.user.lastname}` }}</div>
                                        <div
                                            class="notifications-box-item-info"
                                        >{{ `${notification.text}` }}</div>
                                        <div
                                            class="notifications-box-item-timestamp"
                                            v-if="$moment(notification.timestamp).format('YYYY') === $moment().format('YYYY')"
                                        >{{ $moment(notification.timestamp).format('D MMMM в LT') }}</div>
                                        <div
                                            v-else
                                            class="notifications-box-item-timestamp"
                                        >{{ $moment(notification.timestamp).format('D MMMM YYYY в LT') }}</div>
                                    </div>
                                </div>
                                <div
                                    class="notifications-box-more-notifications"
                                    @click="getNotifications(++notificationsPage)"
                                    v-if="notificationsSize * notificationsPage < notificationsTotal"
                                >Ещё</div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div v-else class="header-right">
                <router-link :to="{path: '/auth'}" class="header-link">Войти</router-link>
                <router-link :to="{path: '/registration'}" class="header-link">Регистрация</router-link>
            </div>
        </div>
    </section>
</template>

<script>
import Cookie from "js-cookie";
import store from "@/store";
import { CLEAR_USER_META } from "@/store/types";
import { directive as onClickaway } from "vue-clickaway2";
import * as Notifications from "@/services/notifications";

export default {
    data: () => ({
        dropdownOpened: false,
        notificationsOpened: false,
        notificationsSize: 10,
        notificationsPage: 1,
        notifications: [],
        notificationsTotal: 0
    }),
    directives: {
        onClickaway: onClickaway
    },
    created() {
        this.getUnread();
    },
    methods: {
        logout() {
            Cookie.remove("user-token");
            store.dispatch(CLEAR_USER_META);
            this.$router.replace("/auth");
        },
        hideDropdown() {
            if (this.dropdownOpened) {
                this.dropdownOpened = false;
            }
        },
        hideNotifications() {
            if (this.notificationsOpened) {
                this.notificationsOpened = false;
                this.notificationsPage = 1;
                this.notifications = [];
            }
        },
        getNotifications(page) {
            Notifications.getNotifications(page, this.notificationsSize)
                .then(res => {
                    this.notifications = this.notifications.concat(
                        res.data.list
                    );
                    this.notificationsTotal = res.data.total;
                    this.getUnread();
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке оповещений"
                    );
                });
        },
        getUnread() {
            if (this.$store.getters.userID) {
                Notifications.unread()
                    .then(res => {
                        this.$store.dispatch(
                            "NOTIFICATIONS_COUNTER_SET",
                            res.data.count
                        );
                    })
                    .catch(() => {
                        this.$toast.error(
                            "Произошла ошибка при загрузке непрочитанных оповещений"
                        );
                    });
            }
        },
        navigateToConversation(id) {
            if (this.$route.name === "dialog") {
                this.$router
                    .replace({
                        path: `/conversation/${id}`
                    })
                    .catch(() => {});
            } else {
                this.$router.push({ path: `/conversation/${id}` });
            }
            this.notificationsOpened = false;
        }
    }
};
</script>

<style scoped>
.header {
    min-height: 73px;
    background-color: var(--main-color);
    box-sizing: border-box;
}

.header-link {
    text-decoration: none;
    color: white;
    font-family: Intro Book;
    font-size: 16px;
    line-height: 21px;
}
.header-link + .header-link {
    margin-left: 18px;
}

.header-container {
    padding: 8px 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1288px;
    margin: 0 auto;
}

@media (min-width: 768px) {
    .header-container {
        padding: 11px 25px;
    }

    .header-link {
        font-size: 22px;
        line-height: 30px;
    }
}

@media (min-width: 1288px) {
    .header-container {
        padding: 11px 4px;
    }
}

.logo {
    max-height: 56px;
}

.company-name {
    text-transform: uppercase;
    font-family: Intro Book;
    font-size: 26px;
    line-height: 50px;
    color: white;
    margin-left: 17px;
    display: none;
}

@media (min-width: 1280px) {
    .company-name {
        display: inline;
    }
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
}

.header-left {
    cursor: pointer;
}

.add {
    width: 36px;
    height: 36px;
    background-color: white;
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
}

.add-text {
    font-family: Intro;
    font-size: 18px;
    color: var(--main-color);
    display: none;
}

.plus {
    height: 15px;
}

@media (min-width: 768px) {
    .add {
        width: fit-content;
        padding: 6px 12px;
    }

    .add-text {
        display: inline;
        margin-right: 18px;
    }
}

.username {
    margin-left: 15px;
    position: relative;
}

.username span {
    font-family: Intro Book;
    font-size: 16px;
    line-height: 21px;
    color: white;
    cursor: pointer;
}

.dropdown {
    position: absolute;
    background: white;
    border-radius: 16px;
    box-sizing: border-box;
    padding: 16px 0px;
    min-width: 133px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    right: 0px;
    margin-top: 8px;
    z-index: 100;
}

.dropdown-item {
    text-align: end;
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
    color: #7a7a7a;
    cursor: pointer;
    padding: 4px 25px;
    transition-duration: 0.3s;
}

.dropdown-item:hover {
    background-color: rgba(6, 128, 194, 0.1);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

@media (min-width: 768px) {
    .username {
        margin-left: 40px;
    }

    .username span {
        font-size: 22px;
        line-height: 30px;
    }
}

.notifications {
    display: flex;
    align-items: center;
    margin-left: 13px;
    min-width: 25px;
    position: relative;
}

.ring {
    height: 21px;
}

.notifications-counter {
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    right: -2px;
    top: -4px;
    font-family: Intro;
    font-size: 9px;
    color: var(--main-color);
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (min-width: 768px) {
    .ring {
        height: 30px;
    }

    .notifications {
        min-width: 32px;
        margin-left: 20px;
    }

    .notifications-counter {
        width: 15px;
        height: 15px;
        border-radius: 6px;
        font-size: 12px;
        right: -2px;
        top: -4px;
    }
}

.notifications-box {
    font-family: Intro;
    position: absolute;
    background-color: white;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    max-width: 390px;
    width: 390px;
    box-sizing: border-box;
    border-radius: 15px;
    padding: 20px 30px;
    right: 0px;
    top: 110%;
    z-index: 1000;
    cursor: default;
}

.notifications-box-title {
    color: var(--main-color);
    font-size: 19px;
    text-align: center;
}

.notifications-box-items {
    overflow-y: scroll;
    max-height: 300px;
}

.notifications-box-item {
    display: flex;
    align-items: center;
    margin-top: 20px;
    transition-duration: 0.4s;
    cursor: pointer;
}

.notifications-box-item:hover {
    background-color: rgba(6, 128, 194, 0.2);
}

.notifications-box-item-photo {
    margin-right: 20px;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    min-width: 50px;
    min-height: 50px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    background-position: center;
    background-size: cover;
}

.notifications-box-item-username {
    font-family: Intro;
    font-size: 17px;
    line-height: 22px;
    color: #03151c;
}

.notifications-box-item-info {
    color: rgba(3, 21, 28, 0.5);
    font-size: 14px;
    line-height: 19px;
}

.notifications-box-item-timestamp {
    color: rgba(3, 21, 28, 0.5);
    font-size: 12px;
    line-height: 16px;
}

.notifications-box-more-notifications {
    color: rgba(3, 21, 28, 0.5);
    margin-top: 20px;
    text-align: center;
    cursor: pointer;
}
</style>