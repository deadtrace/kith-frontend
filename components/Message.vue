<template>
    <div id="message-to-user">
        <div class="message">{{ message }}</div>
        <div class="code">{{ code }}</div>
        <img src="@/assets/delete.svg" alt class="delete-icon" @click="hideNotification" />
    </div>
</template>

<script>
import { bus } from "@/main";

export default {
    data: () => ({
        message: "",
        code: ""
    }),
    methods: {
        hideNotification() {
            let message = document.getElementById("message-to-user");
            message.style.zIndex = "-1";
            message.style.opacity = "0";
        }
    },
    created() {
        bus.$on("showMessage", data => {
            this.code = data.referral;
            this.message = data.message;
            let message = document.getElementById("message-to-user");
            if (data.type && data.type === "error") {
                message.style.color = "#fe4a49";
            } else {
                message.style.color = "#0680C2";
            }
            message.style.opacity = "1";
            message.style.zIndex = "1000";
            if (typeof(data.notToHide) == "undefined" || !data.notToHide ) {
                setTimeout(() => {
                    message.style.zIndex = "-1";
                    message.style.opacity = "0";
                }, 2000);
            }
        });
    }
};
</script>

<style scoped>
#message-to-user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.1);
    height: 124px;
    width: 266px;
    color: var(--main-color);
    font-family: Intro;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition-duration: 0.3s;
    z-index: -1;
    background: white;
    opacity: 0;
}

.message {
    font-size: 12px;
    line-height: 16px;
}

.code {
    font-size: 22px;
    line-height: 30px;
    margin-top: 4px;
}

.delete-icon {
    height: 16px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
}

@media (min-width: 768px) {
    #message-to-user {
        height: 278px;
        width: 596px;
    }

    .message {
        font-size: 27px;
        line-height: 36px;
    }

    .code {
        font-size: 50px;
        line-height: 67px;
        margin-top: 10px;
    }

    .delete-icon {
        display: initial;
    }
}
</style>
