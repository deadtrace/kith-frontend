<template>
    <div v-if="loaded" class="my-card">
        <div class="my-card-top">
            <div class="image-box">
                <div class="image" :style="`background-image: url('${photo}');`"></div>
                <img src="@/assets/delete.svg" class="delete-icon" @click="deletePhoto" />
                <label class="photo-add">
                    <input type="file" accept="image/*" @change="editPhoto" />
                    <img src="@/assets/plusWhite.svg" class="photo-add-icon" />
                </label>
            </div>
            <div class="profile-buttons">
                <button class="profile-button" @click="$router.push({name: 'circle'})">Мой круг</button>
                <button
                    class="profile-button"
                    @click="$router.push({name: 'messagesList'})"
                >Сообщения</button>
            </div>
            <!-- <button class="edit-button" @click="$router.push({name: 'profileSettings'})">Редактировать</button> -->
        </div>
        <div class="user-info">
            <div class="user-info-name">{{ `${firstname} ${lastname}` }}</div>
            <div class="user-info-location">
                {{ locationString }}
                <!-- <span class="user-info-location-age">, 20 годиков</span> -->
            </div>
            <!-- <div class="user-info-age">20 годиков</div> -->
            <div class="user-info-position">{{ position }}</div>
            <button class="copy-referral-button" @click="copyReferral">
                <img src="@/assets/copyIconWhite.png" class="copy-icon" />
                <span>Скопировать код</span>
            </button>
            <input type="text" id="referral-code" v-model="referral" />
        </div>
        <div class="user-about">
            <div class="user-about-header">
                <span>Чем я занимаюсь?</span>
                <img
                    src="@/assets/pencil.png"
                    class="edit-icon"
                    v-if="!descriptionEditing"
                    @click="editDescription"
                />
                <img src="@/assets/save.png" class="save-icon" v-else @click="editDescription" />
            </div>
            <autosize-textarea
                id="description"
                v-model="description"
                :disabled="!descriptionEditing"
            />
        </div>
    </div>
    <div v-else class="loader-card center">
        <Loader></Loader>
    </div>
</template>


<script>
import { bus } from "@/main";
import * as Users from "@/services/users";
import Loader from "@/components/Loader";
import { AutosizeTextarea } from "vue-autosizer";

export default {
    data: () => ({
        city_id: null,
        country_id: null,
        description: "",
        email: "",
        firstname: "",
        lastname: "",
        login: "",
        middlename: "",
        phone: "",
        photo: "",
        position: "",
        referral: "",
        region_id: null,
        loaded: false,
        descriptionEditing: false,
        location: null
    }),
    components: {
        Loader,
        AutosizeTextarea
    },
    methods: {
        copyReferral() {
            let copyText = document.getElementById("referral-code");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            bus.$emit("showMessage", {
                referral: this.referral,
                message: "Реферальный код скопирован"
            });
        },
        getUserInfo() {
            Users.get(this.$store.getters.userID)
                .then(res => {
                    this.city_id = res.data.city_id;
                    this.description = res.data.description;
                    this.country_id = res.data.country_id;
                    this.email = res.data.email;
                    this.firstname = res.data.firstname;
                    this.lastname = res.data.lastname;
                    this.login = res.data.login;
                    this.middlename = res.data.middlename;
                    this.phone = res.data.phone;
                    this.photo = res.data.photo;
                    this.position = res.data.position;
                    this.referral = res.data.referral;
                    this.region_id = res.data.region_id;
                    this.location = res.data.location;
                    this.loaded = true;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        editPhoto(event) {
            let fd = new FormData();
            let image = event.target.files[0];
            fd.append("photo", image);
            Users.edit_mp(this.$store.getters.userID, fd)
                .then(() => {
                    this.getUserInfo();
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        deletePhoto() {
            let fd = new FormData();
            fd.append("photo", null);
            Users.edit_mp(this.$store.getters.userID, fd)
                .then(() => {
                    this.getUserInfo();
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        saveDescription() {
            let fd = new FormData();
            fd.append("description", this.description);
            Users.edit_mp(this.$store.getters.userID, fd)
                .then(() => {
                    this.getUserInfo();
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка при сохранении описания");
                });
        },
        editDescription() {
            let card = document.getElementsByClassName("user-about")[0];
            if (!this.descriptionEditing) {
                this.descriptionEditing = true;
                card.style.boxShadow = "0px 3px 6px rgba(0, 0, 0, 0.2)";
            } else {
                this.descriptionEditing = false;
                card.style.boxShadow = "0px 3px 6px rgba(0, 0, 0, 0.06)";
                this.saveDescription();
            }
        }
    },
    computed: {
        locationString() {
            let res = "";
            if (this.location.country) res += this.location.country.name_native;
            if (this.location.region) res += `, ${this.location.region.name_native}`;
            if (this.location.city) res += `, ${this.location.city.name_native}`;
            return res;
        }
    },
    created() {
        this.getUserInfo();
    }
};
</script>

<style scoped>
.my-card {
    border-radius: 13px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    padding: 18px 25px 50px;
    width: 100%;
    box-sizing: border-box;
    transition-duration: 0.5s;
}

.loader-card {
    border-radius: 13px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    width: 100%;
    box-sizing: border-box;
    min-height: 500px;
    padding: 0px 25px;
}

.my-card-top {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}

.edit-button {
    color: #5a5a5a;
    font-family: Intro;
    font-size: 16px;
    line-height: 21px;
}

.profile-buttons {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Intro;
    color: #4d595e;
    font-size: 20px;
    line-height: 27px;
}

.profile-button {
    border-radius: 18px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    height: 38px;
    padding: 0px 24px;
    transition-duration: 0.5s;
}

.profile-button:hover {
    background: var(--main-color);
    color: white;
}

.profile-button + .profile-button {
    margin-top: 14px;
}

.image-box {
    width: 140px;
    height: 140px;
    margin-top: 32px;
    position: relative;
}

.image {
    border-radius: 70px;
    width: 100%;
    height: 100%;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    background-size: cover;
    background-position: center;
}

.delete-icon {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
}

input[type="file"] {
    display: none;
}

.photo-add {
    box-sizing: border-box;
    background: var(--main-color);
    border: 2px solid white;
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
}

.photo-add-icon {
    height: 13px;
}

@media (min-width: 768px) {
    .my-card-top {
        flex-direction: row;
        justify-content: flex-start;
        position: relative;
        padding-left: 34px;
        padding-right: 34px;
    }

    .my-card {
        padding: 18px 29px 50px;
        width: 607px;
    }

    .loader-card {
        width: 607px;
    }

    .profile-buttons {
        margin-top: 0px;
        align-items: flex-start;
        font-family: Intro;
        margin-left: 25px;
    }

    .image-box {
        margin-top: 0px;
    }

    .edit-button {
        font-size: 20px;
        line-height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
    }
}

.user-info {
    text-align: center;
    margin-top: 20px;
    font-family: Intro;
}

.user-info-name {
    font-size: 29px;
    line-height: 38px;
}

.user-info-location {
    margin-top: 15px;
    font-size: 20px;
    line-height: 30px;
    color: rgba(0, 0, 0, 0.75);
}

.user-info-location-age {
    display: none;
}

.user-info-age {
    font-size: 20px;
    line-height: 30px;
    color: rgba(0, 0, 0, 0.75);
}

.user-info-position {
    margin-top: 15px;
    font-size: 18px;
    line-height: 24px;
}

.copy-referral-button {
    background: var(--main-color);
    border-radius: 13px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
    color: white;
    font-family: Intro;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 56px;
    width: 234px;
    align-items: center;
    padding: 0px 18px;
    margin: 39px auto 0px;
}

.copy-icon {
    height: 34px;
}

#referral-code {
    position: absolute;
    opacity: 0;
    z-index: -1;
}

@media (min-width: 768px) {
    .user-info-name {
        font-size: 36px;
        line-height: 48px;
    }

    .user-info-location {
        margin-top: 7px;
        font-size: 24px;
        line-height: 50px;
        color: rgba(0, 0, 0, 0.75);
        display: flex;
    }

    .user-info-age {
        display: none;
    }

    .user-info-position {
        margin-top: 7px;
        font-size: 24px;
        line-height: 32px;
    }

    .user-info {
        text-align: initial;
        margin-top: 14px;
        padding-left: 34px;
        padding-right: 34px;
    }

    .user-info-location-age {
        display: initial;
    }

    .copy-referral-button {
        margin: 27px 0px 0px;
    }
}

.user-about {
    border-radius: 13px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    padding: 17px 12px;
    box-sizing: border-box;
    font-family: Intro;
    font-size: 18px;
    line-height: 30px;
    margin-top: 20px;
    position: relative;
}

.user-about-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    line-height: 32px;
    font-weight: bold;
    margin-bottom: 12px;
}

.description-edit-box {
    font-size: 24px;
    line-height: 32px;
    font-weight: bold;
}

.description-edit-box-upper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

textarea {
    resize: none;
    width: 100%;
    font-family: Intro;
    font-size: 18px;
    line-height: 30px;
    font-weight: normal;
    height: fit-content;
    outline: none;
    overflow: hidden;
}

textarea:disabled {
    color: black;
}

.edit-icon {
    height: 14px;
    cursor: pointer;
}

.save-icon {
    height: 17px;
    cursor: pointer;
}
</style>