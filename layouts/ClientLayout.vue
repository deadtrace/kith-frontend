<template>
    <div class="main">
        <div class="header">
            <Header></Header>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
        <div class="footer">
            <Footer></Footer>
        </div>
        <Message class="message"></Message>
    </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Message from "@/components/Message";
// import * as Notifications from "@/services/notifications";

import init_notifications from '@/sockets/notifications'

export default {
    components: {
        Footer,
        Header,
        Message
    },
    methods: {
        
    },
    mounted() {
        init_notifications();
    },
    computed: {
        notifications() {
            return this.$store.getters.notifications;
        }
    },
    watch: {
        notifications: function(nots) {
            if (nots.length !== 0) {
                if (nots[0].message === "Новое сообщение!") {
                    this.$toast(`${nots[0].meta.user.firstname} ${nots[0].meta.user.lastname} написал(а) Вам новое сообщение!`, {position: "bottom-left"});
                } else {
                    this.$toast(nots[0].message, {position: "bottom-left"});
                }
                this.$store.dispatch('NOTIFICATIONS_LIST__DELETE', nots[0]);
            }
        }
    }
};
</script>

<style scoped>
.main {
    display: grid;
    grid-template:
        "header" auto
        "content" 1fr
        "footer" auto
        / 1fr;
    min-height: 100%;
}

.header {
    grid-area: header;
}

.content {
    grid-area: content;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px 0px;
    width: 100%;
}

.footer {
    grid-area: footer;
}
</style>