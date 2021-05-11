<template>
    <div class="auth">
        <div class="auth__box">
            <div class="logo-link" @click="$router.push({path: '/'})">
                <img src="@/assets/logo.png" class="product_logo" alt />
                <div class="product__name">ЗНАКОМЫЕ</div>
            </div>
            <div class="auth__form">
                <span class="auth__enter-text">Вход</span>
                <input v-model="login" type="text" class="auth__input" placeholder="Логин" />
                <input
                    v-model="password"
                    type="password"
                    class="auth__input"
                    placeholder="Пароль"
                    @keyup.enter="authentificate"
                />
                <div
                    class="auth__password-forgotten"
                    @click="$router.push({name: 'recovery'})"
                >Забыли пароль?</div>
                <button class="auth__login-button" @click="authentificate">Войти</button>
                <button
                    class="auth__register-button"
                    @click="$router.push({name: 'registration'})"
                >Регистрация</button>
            </div>
        </div>
        <v-snackbar top color="red darken-1" v-model="snackbar">{{ snacktext }}</v-snackbar>
    </div>
</template>

<script>
import * as Auth from "@/services/auth";
import Cookie from "js-cookie";
import store from "@/store";
import { FETCH_USER_META } from "@/store/types";

export default {
    data: () => ({
        login: "",
        password: "",
        snackbar: false,
        snacktext: ""
    }),
    methods: {
        authentificate() {
            let { login, password } = this;
            if (login === "" || password === "") {
                this.$toast.error(`Заполните поля "Логин" и "Пароль"`);
            } else {
                Auth.authentificate(login, password)
                    .then(res => {
                        Cookie.set("user-token", res.data.token);
                        store.dispatch(FETCH_USER_META, res.data);
                        this.$router.push({ path: "/" });
                    })
                    .catch(err => {
                        if (
                            err.response.data.message ===
                            "Пользователь не активирован"
                        ) {
                            this.$toast.error(err.response.data.message);
                            this.$router.push({
                                path: `activation/${err.response.data.user_id}`
                            });
                        } else {
                            err.response.data.message
                                ? this.$toast.error(err.response.data.message)
                                : this.$toast.error("Произошла ошибка");
                            this.password = "";
                        }
                    });
            }
        },
        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        },
        goToRecovery() {
            this.$router.push({ name: "recovery" });
        }
    },
    metaInfo: {
        title: "Вход"
    }
};
</script>

<style scoped>
.auth {
    background: var(--main-color);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
}

.auth__box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 285px;
    margin: 15px;
}

.logo-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.product_logo {
    max-height: 155px;
}

.product__name {
    font-family: Intro;
    font-size: 41px;
    color: white;
    text-align: center;
    margin-top: 8px;
}

.auth__form {
    margin-top: 96px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.auth__enter-text {
    font-family: Intro;
    font-size: 23px;
    color: white;
    margin-bottom: 36px;
}

.auth__input {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 6px 6px #00000029;
    border-radius: 15px;
    padding: 13px 19px;
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
}

.auth__input::placeholder {
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
    color: #80898d;
}

.auth__password-forgotten {
    color: #83c0e1;
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    margin-right: 15px;
    cursor: pointer;
}

.auth__input + .auth__input {
    margin-top: 24px;
}

.auth__login-button {
    background: #006195 0% 0% no-repeat padding-box;
    box-shadow: 0px 6px 6px #00000029;
    border-radius: 54px;
    width: 100%;
    padding: 11px;
    font-family: Intro;
    font-size: 20px;
    line-height: 27px;
    color: white;
    margin-top: 30px;
    transition-duration: 500ms;
}

.auth__login-button:hover {
    transform: scale(1.05);
}

.auth__register-button {
    width: 100%;
    font-family: Intro;
    font-size: 20px;
    line-height: 27px;
    color: white;
    margin-top: 25px;
    transition-duration: 500ms;
}
</style>