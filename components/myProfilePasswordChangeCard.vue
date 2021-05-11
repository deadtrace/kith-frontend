<template>
    <div class="settings-card">
        <div class="card-heading">Редактирование профиля</div>
        <div class="input-box">
            <div class="input-slot">
                <input type="password" v-model="$v.lastPassword.$model" placeholder="Старый пароль" />
                <img
                    v-if="$v.lastPassword.$error"
                    src="@/assets/incorrect.svg"
                    class="incorrect-icon"
                />
            </div>
        </div>
        <div class="input-box">
            <div class="input-slot">
                <input type="password" v-model="$v.password1.$model" placeholder="Новый пароль" />
                <img v-if="$v.password1.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
        </div>
        <div class="input-box">
            <div class="input-slot">
                <input
                    type="password"
                    v-model="$v.password2.$model"
                    placeholder="Новый пароль повторно"
                />
                <img v-if="$v.password2.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
        </div>
        <div class="card-bottom">
            <button class="save-button" @click="submitForm">Сохранить</button>
        </div>
    </div>
</template>

<script>
import * as Auth from "@/services/auth";
import * as Users from "@/services/users";

import { required, minLength, sameAs } from "vuelidate/lib/validators";
// import { bus } from "@/main";

export default {
    data: () => ({
        lastPassword: "",
        password1: "",
        password2: ""
    }),
    methods: {
        changePassword() {
            Users.get(this.$store.getters.userID)
                .then(res => {
                    let username = res.data.login;
                    Auth.authentificate(username, this.lastPassword)
                        .then(() => {
                            Users.edit(this.$store.getters.userID, {
                                password: this.password1
                            })
                                .then(() => {
                                    this.$toast("Пароль успешно изменён");
                                    this.$router.push({name: "profileSettings"});
                                })
                                .catch(err => {
                                    err.response.data.message
                                        ? this.$toast.error(
                                              err.response.data.message
                                          )
                                        : this.$toast.error("Произошла ошибка");
                                });
                        })
                        .catch(err => {
                            err.response.data.message
                                ? this.$toast.error(err.response.data.message)
                                : this.$toast.error("Произошла ошибка");
                        });
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        submitForm() {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.changePassword();
            } else {
                this.$toast.error("Введите корректные данные");
                this.lastPassword = "";
                this.password1 = "";
                this.password2 = "";
            }
        }
    },
    validations: {
        lastPassword: {
            required
        },
        password1: {
            required,
            minLength: minLength(6)
        },
        password2: {
            sameAsPassword: sameAs("password1"),
            required
        }
    },
    metaInfo: {
        title: "Настройки"
    }
};
</script>

<style scoped>
.settings-card {
    border-radius: 20px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    padding: 35px 23px 50px;
    max-width: 641px;
    box-sizing: border-box;
    transition-duration: 0.5s;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.card-heading {
    color: var(--main-color);
    font-size: 23px;
    line-height: 31px;
    font-family: Intro;
    text-align: left;
    margin-bottom: 50px;
}

.card-bottom {
    display: flex;
    justify-content: center;
}

input[type="text"],
input[type="password"] {
    border-radius: 7px;
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    height: 43px;
    padding: 0px 13px;
    font-family: Intro;
    font-size: 13px;
    line-height: 17px;
    width: 100%;
    max-width: 284px;
    font-weight: normal;
}

.input-box + .input-box {
    margin-top: 23px;
    width: 100%;
}

.password-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 284px;
}

.save-button {
    height: 48px;
    background: var(--main-color);
    border-radius: 54px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    color: white;
    box-sizing: border-box;
    padding: 0px 45px;
    font-family: Intro;
    font-size: 20px;
    line-height: 27px;
    margin-top: 75px;
}

.input-slot {
    position: relative;
    width: 100%;
    max-width: 284px;
}

.incorrect-icon {
    height: 20px;
    position: absolute;
    right: 6px;
    transition-duration: 0.5s;
    top: 50%;
    transform: translateY(-50%);
}

input::placeholder {
    color: rgba(3, 21, 28, 0.5);
}

@media (min-width: 768px) {
    .settings-card {
        padding: 35px 110px 50px;
        width: 641px;
    }

    .loader-container {
        width: 641px;
    }

    .card-bottom {
        justify-content: start;
    }

    .input-box-choice {
        flex-direction: row;
        align-items: center;
        margin-bottom: 24px;
    }

    .choice {
        margin-top: 0px;
        margin-left: 15px;
    }

    .login-box {
        margin-top: 16px;
    }

    .referral-box {
        margin-top: 60px;
    }
}
</style>