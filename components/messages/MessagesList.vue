<template>
    <div class="messages-list">
        <div class="searchline space-between">
            <div class="messages-text">Сообщения</div>
            <div class="searchbox">
                <input type="text" v-model="search" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.82 7.84" class="loop-icon">
                    <path
                        id="Search"
                        d="M7.358,7.84A.463.463,0,0,1,7.024,7.7L4.885,5.551l0,0a3.036,3.036,0,0,1-1.8.595H3.072A3.088,3.088,0,0,1,.888.893,3.014,3.014,0,0,1,3.037,0H3.05A3.094,3.094,0,0,1,6.122,3.085a3.025,3.025,0,0,1-.586,1.81L7.676,7.042a.463.463,0,0,1-.318.8ZM3.041.615a2.409,2.409,0,0,0-1.718.715A2.455,2.455,0,0,0,.612,3.065,2.484,2.484,0,0,0,3.07,5.533h.009A2.412,2.412,0,0,0,4.8,4.818,2.457,2.457,0,0,0,5.51,3.082,2.483,2.483,0,0,0,3.052.615Z"
                        fill="#0680c2"
                    />
                </svg>
            </div>
        </div>
        <div class="chats">
            <div class="no-chats-info" v-if="chats.length === 0 && !loading">Чаты не найдены</div>
            <div class="center" v-if="loading">
                <Loader></Loader>
            </div>
            <div class="chat" v-for="(chat, index) in chats" :key="index">
                <div class="chat-actions">
                    <button class="chat-action" @click="deleteChat(chat.user.id, index)">Удалить чат</button>
                    <button class="chat-action" @click="blockChat(chat.user.id)">Заблокировать</button>
                </div>
                <div
                    class="chat-box"
                    @click="$router.push({path: `/conversation/${chat.user.id}`})"
                >
                    <div class="chat-photo" :style="`background-image: url(${chat.user.photo});`"></div>
                    <div class="chat-main">
                        <div
                            class="chat-username"
                        >{{ `${chat.user.firstname} ${chat.user.lastname}` }}</div>
                        <template v-if="chat.last_message.content">
                            <div class="chat-message" v-if="chat.last_message.content.length < 74">{{ `${chat.last_message.content}` }}</div>
                            <div class="chat-message" v-else>{{ `${chat.last_message.content.slice(0,73)}...` }}</div>
                        </template>
                        <template v-else>
                            <div
                                class="chat-message"
                                v-if="chat.last_message.files.length > 1"
                            >Файлы</div>
                            <div class="chat-message" v-else>Файл 1</div>
                        </template>
                    </div>
                    <div
                        class="chat-timestamp"
                        v-if="$moment(chat.last_message.timestamp).format('YYYY') === $moment().format('YYYY')"
                    >{{ $moment(chat.last_message.timestamp).format('D MMMM в LT') }}</div>
                    <div
                        v-else
                        class="chat-timestamp"
                    >{{ $moment(chat.last_message.timestamp).format('D MMMM YYYY в LT') }}</div>
                </div>
            </div>
            <div class="more-chats" v-if="page * size < total" @click="getChats(++page)">Ещё...</div>
        </div>
    </div>
</template>

<script>
import * as Chat from "@/services/chat.js";
import Loader from "@/components/Loader";

export default {
    data: () => ({
        chats: [],
        page: 1,
        size: 25,
        total: 0,
        search: "",
        loading: false
    }),
    components: {
        Loader
    },
    metaInfo: {
        title: "Сообщения"
    },
    methods: {
        getChats(page) {
            Chat.getChats(page, this.size, this.search)
                .then(res => {
                    this.chats = this.chats.concat(res.data.list);
                    this.total = res.data.total;
                    if (this.loading) {
                        this.loading = false;
                    }
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке списка диалогов"
                    );
                });
        },
        deleteChat(user_id, index) {
            Chat.deleteChat(user_id)
                .then(() => {
                    this.chats.splice(index, 1);
                    this.$toast("Чат успешно удалён!");
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при удалении чата");
                });
        },
        blockChat(user_id) {
            Chat.blockChat(user_id)
                .then(() => {
                    this.$toast("Чат успешно заблокирован!");
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при блокировке чата");
                });
        }
    },
    created() {
        this.getChats(this.page);
    },
    watch: {
        search: function() {
            this.page = 1;
            this.loading = true;
            this.chats = [];
            this.getChats(this.page);
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.messages-list {
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    width: 100%;
    max-width: 641px;
    box-sizing: border-box;
    padding: 27px 25px 22px;
}

@media (min-width: 768px) {
    .messages-list {
        padding: 36px 67px 60px;
    }
}

@media (min-width: 1280px) {
    .messages-list {
        min-width: 641px;
    }
}

.searchline {
    margin-bottom: 3px;
}

.messages-text {
    color: var(--main-color);
    font-size: 12px;
}

input[type="text"] {
    border-radius: 18px;
    border: 1px solid var(--main-color);
    box-sizing: border-box;
    height: 20px;
    font-size: 12px;
    width: 174px;
    padding: 0px 10px;
    margin-left: 10px;
}

.searchbox {
    position: relative;
}

.loop-icon {
    position: absolute;
    right: 8px;
    transform: translateY(-50%);
    top: 50%;
    height: 8px;
}

@media (min-width: 768px) {
    .searchline {
        margin-bottom: 48px;
    }

    .messages-text {
        font-size: 23px;
    }

    .loop-icon {
        right: 13px;
        height: 14px;
    }

    input[type="text"] {
        height: 29px;
        font-size: 16px;
        width: 350px;
        padding: 0px 20px;
        margin-left: 20px;
    }
}

.chat {
    margin-top: 9px;
}

.chat-actions {
    display: flex;
    margin-bottom: 4px;
}

.chat-action {
    font-size: 8px;
    line-height: 11px;
    color: rgba(0, 0, 0, 0.5);
}

.chat-action + .chat-action {
    margin-left: 12px;
}

.chat-box {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
    padding: 7px 10px 12px;
    box-sizing: border-box;
    display: flex;
    transition-duration: 0.3s;
    cursor: pointer;
}

.chat-box:hover {
    background-color: rgba(6, 128, 194, 0.4);
}

.chat-photo {
    min-height: 36px;
    min-width: 36px;
    max-height: 36px;
    max-width: 36px;
    border-radius: 50%;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    margin-right: 7px;
    background-position: center;
    background-size: cover;
    background-color: white;
}

.chat-main {
    width: 100%;
}

.chat-username {
    font-size: 11px;
    line-height: 15px;
}

.chat-message {
    color: #919191;
    font-size: 8px;
    line-height: 12px;
}

.chat-timestamp {
    font-size: 8px;
    color: rgba(0, 0, 0, 0.5);
    min-width: fit-content;
}

@media (min-width: 768px) {
    .chat {
        margin-top: 0px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    .chat-actions {
        flex-direction: column;
        margin-left: 12px;
    }

    .chat-action {
        font-size: 10px;
        text-align: left;
    }

    .chat-box {
        width: 100%;
    }

    .chat-box {
        padding: 14px 20px 17px;
    }

    .chat-photo {
        min-height: 50px;
        min-width: 50px;
        margin-right: 22px;
        max-height: 50px;
        max-width: 50px;
    }

    .chat-username {
        font-size: 16px;
        line-height: 21px;
    }

    .chat-message {
        font-size: 10px;
        line-height: 14px;
    }

    .chat-timestamp {
        font-size: 10px;
    }

    .chat-action + .chat-action {
        margin-left: 0px;
        margin-top: 5px;
    }
}

.no-chats-info {
    color: var(--main-color);
    text-align: center;
}

.chats {
    max-height: 405px;
    overflow-y: scroll;
    padding-right: 5px;
    /* -ms-overflow-style: none;
    scrollbar-width: none; */
}

.more-chats {
    text-align: center;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 10px;
    cursor: pointer;
}
/* 
.chats::-webkit-scrollbar {
    display: none;
} */
</style>