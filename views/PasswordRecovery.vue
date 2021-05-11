<template>
    <div class="password-recovery">
        <template v-if="!loading">
            <div v-if="step === 0" class="password-recovery-container">
                <div class="password-recovery-text">Введите логин</div>
                <div style="height: 30px;"></div>
                <input type="text" placeholder="Логин" v-model="user" class="recovery-input" />
                <button class="dark-button" @click="sendRecoveryCode">Отправить</button>
            </div>

            <div v-if="step === 1" class="password-recovery-container">
                <div class="password-recovery-text">Введите полученный код</div>
                <div style="height: 30px;"></div>
                <input type="text" placeholder="Код" v-model="code" class="recovery-input" />
                <button class="dark-button" @click="checkRecoveryCode">Подтвердить</button>
            </div>

            <div v-if="step === 2" class="password-recovery-container">
                <div class="password-recovery-text">Придумайте новый пароль</div>
                <div style="height: 30px;"></div>
                <input
                    type="password"
                    placeholder="Пароль"
                    v-model="password1"
                    class="recovery-input"
                />
                <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    v-model="password2"
                    class="recovery-input"
                />
                <button class="dark-button" @click="changePassword">Подтвердить</button>
            </div>
        </template>
        <Loader v-else></Loader>
    </div>
</template>

<script>
import * as Auth from "@/services/auth";
import Loader from "@/components/LoaderWhite";

export default {
    data: () => ({
        user: "",
        userID: "",
        code: "",
        password1: "",
        password2: "",
        step: 0,
        loading: false
    }),
    metaInfo: {
        title: "Восстановление пароля"
    },
    components: {
        Loader
    },
    methods: {
        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        },
        sendRecoveryCode() {
            this.loading = true;
            Auth.sendRecoveryCode(this.user)
                .then(res => {
                    this.$toast("Код был выслан на почту");
                    this.step = 1;
                    this.userID = res.data.user_id;
                    this.loading = false;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                    this.loading = false;
                });
        },
        checkRecoveryCode() {
            this.loading = true;
            Auth.checkRecoveryCode(this.code, this.userID)
                .then(() => {
                    this.step = 2;
                    this.loading = false;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                    this.loading = false;
                });
        },
        changePassword() {
            if (this.password1 !== this.password2) {
                this.$toast.error("Ваши пароли не совпадают");
                this.password2 = "";
            } else if (this.password1 == "") {
                this.$toast("Необходимо задать пароль");
            } else {
                this.loading = true;
                Auth.changePassword(this.password1, this.password2, this.userID)
                    .then(() => {
                        this.$toast("Ваш пароль успешно изменён");
                        this.$router.push({ path: "/auth" });
                    })
                    .catch(err => {
                        err.response.data.message
                            ? this.$toast.error(err.response.data.message)
                            : this.$toast.error("Произошла ошибка");
                        this.loading = false;
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

.password-recovery {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--main-color);
}

.password-recovery-text {
    color: white;
    font-size: 20px;
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

.dark-button:hover {
    transform: scale(1.05);
}

.recovery-input {
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.06);
    border-radius: 7px;
    box-sizing: border-box;
    font-size: 20px;
    height: 45px;
    background-color: white;
    padding: 0 10px;
    text-align: center;
    margin-bottom: 30px;
    width: 280px;
}

.password-recovery-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>