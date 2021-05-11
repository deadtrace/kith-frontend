<template>
    <div class="auth">
        <div class="auth__box">
            <div class="logo-link" @click="$router.push({path: '/'})">
                <img src="@/assets/logo.png" class="product_logo" alt />
                <div class="product__name">ЗНАКОМЫЕ</div>
            </div>
            <div v-if="!user_id" class="referral-box">
                <span class="referral-text">Реферальный код</span>
                <input
                    type="text"
                    class="referral-input"
                    v-model="user_referral"
                    @keyup.enter="checkReferral"
                />
                <button class="referral-button" @click="checkReferral">Далее</button>
            </div>
            <div v-else class="referral-box">
                <div
                    v-if="user.photo"
                    class="friend-photo"
                    :style="`background-image: url(${user.photo});`"
                ></div>
                <span class="friend-text">{{ `${user.firstname} ${user.lastname}` }}</span>
                <span class="friend-small-text">Это ваш знакомый?</span>
                <button
                    class="yes-button"
                    @click="$router.push({name: 'register', query: {friend_id: user_id}})"
                >Да</button>
                <button class="no-button" @click="clearUserInfo">Нет</button>
            </div>
        </div>
    </div>
</template>

<script>
import * as Auth from "@/services/auth";

export default {
    data: () => ({
        user_referral: "",
        user_id: null,
        user: null
    }),
    methods: {
        checkReferral() {
            if (this.user_referral === "") {
                this.$toast.error("Введите, пожалуйста, реферальный код");
            } else {
                Auth.checkReferral(this.user_referral)
                    .then(res => {
                        this.user_id = res.data.user_id;
                        this.user = res.data.user;
                    })
                    .catch(err => {
                        err.response.data.message
                            ? this.$toast.error(err.response.data.message)
                            : this.$toast.error("Произошла ошибка");
                    });
            }
        }
    },
    metaInfo: {
        title: "Регистрация"
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

.referral-box {
    margin-top: 95px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.referral-text {
    font-family: Intro;
    font-size: 28px;
    line-height: 37px;
    color: white;
}

.referral-input {
    background: white;
    border: none;
    border-radius: 15px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    width: 270px;
    height: 45px;
    box-sizing: border-box;
    margin-top: 27px;
    font-family: Intro;
    font-size: 20px;
    padding: 0 15px;
}

.referral-button {
    width: 142px;
    height: 47px;
    color: white;
    font-family: Intro;
    font-size: 20px;
    background: #006195;
    margin-top: 28px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    border-radius: 54px;
    box-sizing: border-box;
    transition-duration: 0.3s;
}

.yes-button {
    width: 142px;
    height: 47px;
    color: white;
    font-family: Intro;
    font-size: 20px;
    background: #006195;
    margin-top: 22px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    border-radius: 54px;
    box-sizing: border-box;
    transition-duration: 0.3s;
}

.no-button {
    font-family: Intro;
    font-size: 17px;
    line-height: 22px;
    color: white;
    margin-top: 9px;
}

.friend-text {
    font-family: Intro;
    font-size: 24px;
    line-height: 32px;
    margin-top: 10px;
    color: white;
}

.friend-small-text {
    font-family: Intro;
    font-size: 16px;
    line-height: 21px;
    color: white;
}

.friend-photo {
    width: 124px;
    height: 124px;
    border-radius: 62px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    background-position: center;
    background-size: cover;
}

.referral-button:hover,
.yes-button:hover {
    transform: scale(1.05);
}
</style>