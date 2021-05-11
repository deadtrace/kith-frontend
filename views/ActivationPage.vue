<template>
    <div class="activation">
        <div v-if="step === 1" class="activation-box">
            <div class="activation-box-title">Активация пользователя</div>
            <button class="dark-button" @click="sendCode">Отправить код</button>
        </div>
        <div v-else class="activation-box">
            <input type="text" v-model="code" placeholder="Полученный код" class="activation-input" @keyup.enter="checkCode" />
            <button class="dark-button" @click="checkCode">Проверить</button>
        </div>
    </div>
</template>

<script>
import * as SMS from "@/services/sms";

export default {
    data: () => ({
        step: 1,
        code: ""
    }),
    metaInfo: {
        title: "Активация"
    },
    methods: {
        sendCode() {
            SMS.send(this.$route.params.user_id)
            .then(() => {
                this.$toast("Код успешно отправлен");
                this.step = 2;
            })
            .catch(() => {
                this.$toast.error("Произошла ошибка при отправке кода");
            })
        },
        checkCode() {
            if (this.code) {
                SMS.check(this.code, this.$route.params.user_id)
                    .then(() => {
                        this.$toast("Пользователь успешно активирован");
                        this.$router.push({ path: "/auth" });
                    })
                    .catch(err => {
                        err.response.data.message
                            ? this.$toast.error(err.response.data.message)
                            : this.$toast.error(
                                  "Произошла ошибка при активации пользователя"
                              );
                    });
            }
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.activation {
    color: white;
    height: 100vh;
    background-color: var(--main-color);
    display: flex;
    justify-content: center;
    align-items: center;
}

.dark-button {
    border-radius: 54px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    color: white;
    background-color: #006195;
    box-sizing: border-box;
    height: 48px;
    width: 280px;
    font-size: 20px;
    transition-duration: 0.5s;
}

.activation-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dark-button:hover {
    transform: scale(1.05);
}

.activation-input {
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.06);
    border-radius: 7px;
    box-sizing: border-box;
    font-size: 20px;
    height: 45px;
    background-color: white;
    padding: 0 10px;
    text-align: center;
    margin-bottom: 30px;
}

.activation-box-title {
    color: white;
    font-size: 20px;
    margin-bottom: 30px;
}
</style>