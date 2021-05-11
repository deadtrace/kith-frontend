<template>
    <div class="dialog">
        <div class="dialog-header">
            <div class="dialog-goback clickable" @click="$router.push({name: 'messagesList'})">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11">
                    <g
                        id="Polygon_16"
                        data-name="Polygon 16"
                        transform="translate(0 11) rotate(-90)"
                        fill="#0680c2"
                    >
                        <path
                            d="M 10.04948902130127 7.5 L 0.9505112767219543 7.5 L 5.5 0.8825618028640747 L 10.04948902130127 7.5 Z"
                            stroke="none"
                        />
                        <path
                            d="M 5.5 1.765133857727051 L 1.901029586791992 7 L 9.098970413208008 7 L 5.5 1.765133857727051 M 5.5 0 L 11 8 L 0 8 L 5.5 0 Z"
                            stroke="none"
                            fill="#0680c2"
                        />
                    </g>
                </svg>
                <span style="margin-left: 9px;">Сообщения</span>
            </div>
            <div class="dialog-username">{{ user }}</div>
        </div>
        <div class="dialog-status">
            <div class="dialog-timestamp">Был(а) вчера в 21:22</div>
            <div class="dialog-buttons">
                <button class="dialog-button" @click="deleteChat">Удалить чат</button>
                <button class="dialog-button" @click="blockChat">Заблокировать</button>
            </div>
        </div>
        <div class="dialog-subbuttons">
            <button class="dialog-button" @click="deleteChat">Удалить чат</button>
            <button class="dialog-button" @click="blockChat">Заблокировать</button>
        </div>
        <div class="dialog-area">
            <div v-for="(message, index) in messages" :key="index" class="dialog-message">
                <div
                    class="message-header"
                    :style="message.user.id === $store.getters.userID ? 'flex-direction: row-reverse;' : 'flex-direction: row;'"
                >
                    <div
                        class="message-photo"
                        :style="`background-image: url(${message.user.photo});`"
                    ></div>
                    <div class="message-header-spacer"></div>
                    <div class="message-whom" v-if="message.user.id === $store.getters.userID">Вы</div>
                    <div
                        class="message-whom"
                        v-else
                    >{{ `${message.user.firstname} ${message.user.lastname}` }}</div>
                    <div class="message-header-spacer"></div>
                    <div
                        class="message-timestamp"
                        v-if="$moment(message.timestamp).format('YYYY') === $moment().format('YYYY')"
                    >{{ $moment(message.timestamp).format('D MMMM в LT') }}</div>
                    <div
                        v-else
                        class="message-timestamp"
                    >{{ $moment(message.timestamp).format('D MMMM YYYY в LT') }}</div>
                </div>
                <div
                    class="message-text"
                    :style="message.user.id === $store.getters.userID ? `background-color: #F1F8F2; align-self: flex-end;` : `background-color: #F3F3F3; align-self: flex-start;`"
                >
                    <div class="message-files">
                        <a
                            download
                            class="message-file"
                            v-for="(file, index) in message.files"
                            :key="`f${index}`"
                            :href="`${file.url}`"
                        >{{ `Файл ${index + 1}` }}</a>
                    </div>
                    <div class="message-content">{{ message.content }}</div>
                </div>
            </div>
            <div
                v-if="page * size + skip < total"
                class="load-extra"
                @click="getMessages(++page)"
            >Загрузить ещё</div>
        </div>
        <div class="dialog-text-to-send">
            <div class="dialog-files-to-send">
                <div class="dialog-file-to-send" v-for="(file, index) in files" :key="index">
                    <div class="file-to-send-name">{{ file.name }}</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        class="file-remove-icon"
                        @click="removeFile(index)"
                    >
                        <path
                            fill="#0680C2"
                            d="M13.4,12l6.3-6.3c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4l6.3,6.3l-6.3,6.3C4.1,18.5,4,18.7,4,19c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.4,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L13.4,12z"
                        />
                    </svg>
                </div>
            </div>
            <div style="height: 10px;" v-if="files.length > 0"></div>
            <div class="dialog-text-to-send-container">
                <autosize-textarea
                    class="dialog-text"
                    v-model="messageToSend"
                    @keydown.enter.prevent.exact="sendMessage"
                    placeholder="Написать сообщение..."
                />
                <label v-if="files.length < 10">
                    <input type="file" id="dialogFileInput" @change="addFile" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        class="attach-icon"
                    >
                        <path
                            fill="#0680C2"
                            d="M18.1,12.4l-6.2,6.2c-1.7,1.7-4.4,1.7-6,0c-1.7-1.7-1.7-4.4,0-6l8-8c1-0.9,2.5-0.9,3.5,0c1,1,1,2.6,0,3.5l-6.9,6.9c-0.3,0.3-0.8,0.3-1.1,0c0,0,0,0,0,0c-0.3-0.3-0.3-0.8,0-1.1l5.1-5.1c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L8,12.6c-1.1,1.1-1.1,2.8,0,3.9c1.1,1,2.8,1,3.9,0l6.9-6.9c1.8-1.8,1.8-4.6,0-6.4c-1.8-1.8-4.6-1.8-6.4,0l-8,8c-1.2,1.2-1.8,2.8-1.8,4.4c0,3.5,2.8,6.2,6.3,6.2c1.7,0,3.2-0.7,4.4-1.8l6.2-6.2c0.4-0.4,0.4-1,0-1.4S18.5,12,18.1,12.4z"
                        />
                    </svg>
                </label>
                <label>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="29.263"
                        height="19.001"
                        viewBox="0 0 29.263 19.001"
                        class="clickable"
                        @click="sendMessage"
                    >
                        <g
                            id="Group_589"
                            data-name="Group 589"
                            transform="translate(-271.487 -1855.498)"
                        >
                            <path
                                id="Polygon_1"
                                data-name="Polygon 1"
                                d="M7.679,4.017a2,2,0,0,1,3.643,0l6.4,14.111A2,2,0,0,1,15.9,20.954H3.1a2,2,0,0,1-1.822-2.826Z"
                                transform="translate(300.75 1855.498) rotate(90)"
                                fill="#0680c2"
                            />
                            <path
                                id="Polygon_2"
                                data-name="Polygon 2"
                                d="M2.192,0,4.385,15.848H0Z"
                                transform="translate(287.335 1861.807) rotate(90)"
                                fill="#fff"
                            />
                        </g>
                    </svg>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { AutosizeTextarea } from "vue-autosizer";
import * as Chat from "@/services/chat";
import init_chat from "@/sockets/chat";

export default {
    data: () => ({
        messageToSend: "",
        page: 1,
        size: 25,
        skip: 0,
        total: 0,
        messages: [],
        files: []
    }),
    props: ["user"],
    metaInfo: {
        title: "Сообщения"
    },
    components: {
        AutosizeTextarea
    },
    methods: {
        getMessages(page) {
            Chat.getMessages(
                this.$route.params.user_id,
                page,
                this.size,
                this.skip
            )
                .then(res => {
                    this.messages = this.messages.concat(res.data.list);
                    this.total = res.data.total;
                })
                .catch(err => {
                    if (err.response.status !== 404) {
                        this.$toast.error(err.response.data.message);
                    }
                });
        },
        sendMessage() {
            if (this.messageToSend || this.files.length > 0) {
                let fd = new FormData();
                fd.append("content", this.messageToSend);
                for (let i = 0; i < this.files.length; i++) {
                    fd.append("files", this.files[i]);
                }
                Chat.sendMessage(this.$route.params.user_id, fd)
                    .then(res => {
                        this.messages.unshift(res.data);
                        this.skip++;
                        this.total++;
                        this.messageToSend = "";
                        var elems = document.getElementsByClassName(
                            "dialog-text"
                        );
                        elems[0].style.height = "14px";
                        this.files = [];
                    })
                    .catch(() => {
                        this.$toast.error(
                            "Произошла ошибка при отправке сообщения"
                        );
                    });
            }
        },
        deleteChat() {
            Chat.deleteChat(this.$route.params.user_id)
                .then(() => {
                    this.$toast("Чат успешно удалён!");
                    this.$router.push({ name: "messagesList" });
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при удалении чата");
                });
        },
        blockChat() {
            Chat.blockChat(this.$route.params.user_id)
                .then(() => {
                    this.$toast("Чат успешно Заблокирован!");
                    this.$router.push({ name: "messagesList" });
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при блокировке чата");
                });
        },
        addFile(event) {
            this.files.push(event.target.files[0]);
        },
        removeFile(index) {
            this.files.splice(index, 1);
        }
    },
    computed: {
        socketMessages() {
            return this.$store.getters.messages;
        }
    },
    watch: {
        socketMessages: function(messages) {
            if (messages.length !== 0) {
                this.messages.unshift(messages[0]);
                this.total++;
                this.skip++;
                this.$store.dispatch("DELETE_MESSAGE_FROM_QUERY", messages[0]);
            }
        }
    },
    created() {
        this.getMessages(this.page);
    },
    mounted() {
        init_chat(this.$route.params.user_id);
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.dialog {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.dialog-header {
    height: 68px;
    border-bottom: 2px solid #daddde;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialog-username {
    font-size: 14px;
}

.dialog-goback {
    color: var(--main-color);
    font-size: 20px;
    display: flex;
    align-items: center;
}

@media (min-width: 768px) {
    .dialog-username {
        font-size: 16px;
    }

    .dialog-goback {
        font-size: 23px;
    }

    .dialog-header {
        height: 86px;
        padding: 0px 50px;
    }

    .dialog {
        margin: 0 34px;
        width: calc(100% - 68px);
    }
}

@media (min-width: 1280px) {
    .dialog {
        margin: 0;
        min-width: 642px;
        max-width: 642px;
    }
}

.dialog-status {
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #daddde;
}

.dialog-timestamp {
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.5);
}

.dialog-button {
    font-size: 14px;
    line-height: 19px;
    color: rgba(0, 0, 0, 0.5);
}

.dialog-button + .dialog-button {
    margin-left: 23px;
}

.dialog-subbuttons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 6px;
}

.dialog-buttons {
    display: none;
}

@media (min-width: 768px) {
    .dialog-subbuttons {
        display: none;
    }

    .dialog-button + .dialog-button {
        margin-left: 35px;
    }

    .dialog-buttons {
        display: flex;
        align-items: center;
    }

    .dialog-status {
        justify-content: space-between;
        padding: 0px 50px;
    }
}

.dialog-area {
    height: 300px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: scroll;
}

@media (min-width: 768px) {
    .dialog-area {
        height: 330px;
    }
}

.dialog-text-to-send {
    width: 100%;
    padding: 13px 18px;
    box-sizing: border-box;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.16);
    border-radius: 0px 0px 20px 20px;
}

.dialog-text {
    resize: none;
    width: 100%;
    max-height: 100px;
    height: 14px;
    font-size: 14px;
    overflow: hidden;
}

@media (min-width: 768px) {
    .dialog-text-to-send {
        padding: 13px 50px;
    }

    .dialog-area {
        padding: 20px 50px;
    }
}

.message-header {
    display: flex;
    align-items: center;
}

.message-timestamp {
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.5);
}

.message-photo {
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
}

.message-whom {
    font-size: 13px;
    line-height: 17px;
}

.message-header-spacer {
    width: 14px;
}

.message-text {
    border-radius: 10px;
    max-width: 240px;
    box-sizing: border-box;
    padding: 13px 16px;
    font-size: 12px;
    line-height: 18px;
    margin-top: 10px;
    overflow-wrap: break-word;
}

@media (min-width: 768px) {
    .message-header-spacer {
        width: 20px;
    }

    .message-text {
        max-width: 430px;
        font-size: 14px;
        line-height: 20px;
    }
}

.dialog-message {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.load-extra {
    align-self: center;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.attach-icon {
    max-height: 20px;
    cursor: pointer;
    padding-left: 10px;
}

#dialogFileInput {
    display: none;
}

svg {
    display: block;
}

.dialog-text-to-send-container {
    align-items: flex-end;
    display: flex;
}

.dialog-file-to-send {
    display: flex;
    font-size: 12px;
    align-items: center;
}

.dialog-file-to-send + .dialog-file-to-send {
    margin-top: 5px;
}

.file-remove-icon {
    height: 14px;
    margin-left: 10px;
    cursor: pointer;
}

.message-file {
    margin-bottom: 4px;
    display: block;
    text-decoration: none;
    color: var(--main-color);
}
</style>