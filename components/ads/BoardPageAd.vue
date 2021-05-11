<template>
    <div class="card">
        <div class="card-header">
            <div
                class="card-user-photo clickable"
                :style="board.owner_photo ? `background-image: url(${board.owner_photo});` : ''"
                @click="$router.push({path: `/user/${board.board_user_id}`})"
            ></div>
            <div class="card-header-info">
                <div class="card-header-strings">
                    <div
                        class="card-username clickable"
                        @click="$router.push({path: `/user/${board.board_user_id}`})"
                    >{{ board.owner_firstname ? `${board.owner_firstname} ${board.owner_lastname}` : '' }}</div>
                    <div
                        class="card-category"
                    >{{ board.category ? `${board.category.name_native}` : 'Без категории' }}</div>
                    <div class="card-geo">{{ geo(board.country, board.region, board.city) }}</div>
                </div>
                <div v-if="board.board_user_id && board.board_user_id !== $store.getters.userID" class="card-header-buttons">
                    <button class="card-button" @click="copyPhone">
                        <img src="@/assets/bluePhone.png" class="phone-icon" />
                        Позвонить
                    </button>
                    <button class="card-button" @click="$router.push({path: `/conversation/${board.board_user_id}`})">
                        <img src="@/assets/blueMail.png" class="mail-icon" />
                        Написать
                    </button>
                </div>
                <img v-if="board.board_user_id && board.board_user_id === $store.getters.userID" src="@/assets/pencil.png" class="edit-button" @click="$router.push({name: 'editAd', params: { board_id: `${$route.params.board_id}` }})">
            </div>
        </div>
        <div class="card-name-fav">
            <div class="card-title">{{ board.board_title }}</div>
            <div class="card-fav" v-if="$store.getters.userID">
                <img
                    v-if="board.subscription_on_board"
                    src="@/assets/bookmarkActivated.png"
                    class="fav-icon clickable"
                    @click="removeFromFavourite(board.board_id, board.board_title)"
                />
                <img
                    v-else
                    src="@/assets/bookmark.png"
                    class="fav-icon clickable"
                    @click="addToFavourite(board.board_id, board.board_title)"
                />
            </div>
            <div class="card-fav" v-else></div>
        </div>
        <div class="card-photos">
            <template v-if="board.board_photos && board.board_photos.length !== 0">
                <Slider
                    animation="fade"
                    v-model="sliderValue"
                    :interval="6000"
                    :speed="1000"
                    class="slider"
                >
                    <SliderItem
                        v-for="(photo, index) in board.board_photos"
                        :key="index"
                        @click="changeIndex(1);"
                    >
                        <div class="slider-item" :style="`background-image: url(${photo.src});`"></div>
                    </SliderItem>
                </Slider>
            </template>
            <div v-else class="slider slider-item-empty"></div>
        </div>
        <div class="card-date-price space-between">
            <div class="card-date">{{ $moment(board.board_date_create).format('LL') }}</div>
            <div
                v-if="board.board_price"
                class="card-price"
            >{{ board.board_price.toLocaleString('ru-RU') }} руб.</div>
            <div v-else></div>
        </div>
        <div class="card-desc">{{ board.board_description }}</div>
    </div>
</template>

<script>
import { Slider, SliderItem } from "vue-easy-slider";
import * as Boards from "@/services/boards";
import { bus } from "@/main";

export default {
    components: {
        Slider,
        SliderItem
    },
    props: ["board", "phone"],
    data: () => ({
        sliderValue: 1
    }),
    methods: {
        geo(country, region, city) {
            let geo = "";
            if (country) {
                geo += country.name_native;
                if (region) {
                    geo += `, ${region.name_native}`;
                    if (city) {
                        geo += `, ${city.name_native}`;
                    }
                }
            }
            return geo ? geo : "Без местоположения";
        },
        addToFavourite(id, name) {
            Boards.addToFavourite(id)
                .then(() => {
                    this.board.subscription_on_board = true;
                    this.$toast(
                        `Объявление "${name}" успешно добавлено в избранное`
                    );
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error(
                              `Произошла ошибка при добавлении объявления ${name} в избранное`
                          );
                });
        },
        removeFromFavourite(id, name) {
            Boards.removeFromFavourite(id)
                .then(() => {
                    this.board.subscription_on_board = false;
                    this.$toast(
                        `Объявление "${name}" успешно удалено из избранного`
                    );
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error(
                              `Произошла ошибка при удалении объявления ${name} из изранного`
                          );
                });
        },
        copyPhone() {
            this.$clipboard(this.phone);
            bus.$emit("showMessage", {
                referral: this.phone,
                message: "Номер телефона скопирован",
                notToHide: true
            });
        },
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.card {
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 11px 15px 12px;
    width: 100%;
    box-sizing: border-box;
    max-width: 860px;
}

.card-header {
    display: flex;
}

.card-user-photo {
    height: 40px;
    width: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 20px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    background-position: center;
    background-size: cover;
}

.card-header-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-left: 10px;
    align-items: center;
    position: relative;
}

.card-username {
    font-size: 12px;
    line-height: 14px;
    margin-bottom: 2px;
}

.card-category,
.card-geo {
    font-size: 9px;
    line-height: 12px;
    color: #5a5a5a;
}

.card-header-buttons {
    display: flex;
    flex-direction: column;
}

.card-button {
    font-size: 10px;
    line-height: 13px;
    color: var(--main-color);
    border-radius: 4px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    padding: 2px 5px 3px;
    display: flex;
    align-items: center;
}

.card-button + .card-button {
    margin-top: 5px;
}

.phone-icon {
    height: 10px;
}

.mail-icon {
    height: 8px;
}

.phone-icon,
.mail-icon {
    margin-right: 4px;
}

@media (min-width: 768px) {
    .card {
        padding: 18px 24px 30px;
    }

    .card-user-photo {
        height: 76px;
        width: 76px;
        min-height: 76px;
        min-width: 76px;
        border-radius: 38px;
    }

    .card-username {
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 3px;
    }

    .card-header-info {
        margin-left: 16px;
    }

    .card-category,
    .card-geo {
        font-size: 14px;
        line-height: 19px;
    }

    .card-button {
        font-size: 13px;
        line-height: 17px;
        padding: 7px 12px 9px;
        border-radius: 10px;
    }

    .card-button + .card-button {
        margin-top: 13px;
    }

    .phone-icon {
        height: 25px;
    }

    .mail-icon {
        height: 18px;
    }

    .phone-icon,
    .mail-icon {
        margin-right: 13px;
    }
}

@media (min-width: 1280px) {
    .card-user-photo {
        height: 90px;
        width: 90px;
        min-height: 90px;
        min-width: 90px;
        border-radius: 45px;
    }

    .card-username {
        font-size: 29px;
        line-height: 38px;
        margin-bottom: 5px;
    }

    .card-header-info {
        margin-left: 18px;
    }

    .card-category,
    .card-geo {
        font-size: 16px;
        line-height: 21px;
    }

    .card-button {
        font-size: 16px;
        line-height: 21px;
        padding: 12px 14px;
        border-radius: 13px;
    }
}

.card-name-fav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
}

.card-title {
    font-size: 10px;
    line-height: 12px;
}

.fav-icon {
    height: 15px;
}

@media (min-width: 768px) {
    .card-name-fav {
        margin-top: 12px;
    }

    .card-title {
        font-size: 20px;
        line-height: 27px;
    }

    .fav-icon {
        height: 30px;
    }
}

@media (min-width: 1280px) {
    .card-name-fav {
        margin-top: 13px;
    }

    .card-title {
        font-size: 24px;
        line-height: 32px;
    }

    .fav-icon {
        height: 36px;
    }
}

.slider {
    margin-top: 3px;
    max-height: 140px;
}

.slider-item {
    background-color: #98b9da;
    background-position: center;
    background-size: cover;
    height: 100%;
}

.slider-item-empty {
    background-color: #98b9da;
    height: 140px;
    width: 100%;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
}

@media (min-width: 768px) {
    .slider {
        margin-top: 10px;
        min-height: 370px;
        max-height: 370px;
    }
}

@media (min-width: 1280px) {
    .slider {
        margin-top: 13px;
        min-height: 430px;
        max-height: 430px;
    }
}

.card-date-price {
    padding-top: 6px;
    padding-bottom: 4px;
    border-bottom: 0.4px solid rgba(0, 0, 0, 0.7);
}

.card-date {
    font-size: 10px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.5);
}

.card-price {
    font-size: 10px;
    line-height: 14px;
    font-family: Intro Caps;
}

@media (min-width: 768px) {
    .card-date-price {
        padding-top: 16px;
        padding-bottom: 13px;
    }

    .card-date,
    .card-price {
        font-size: 20px;
        line-height: 27px;
    }
}

@media (min-width: 1280px) {
    .card-date-price {
        padding-top: 19px;
        padding-bottom: 15px;
    }

    .card-date,
    .card-price {
        font-size: 24px;
        line-height: 32px;
    }
}

.card-desc {
    margin-top: 8px;
    font-size: 10px;
    line-height: 15px;
}

@media (min-width: 768px) {
    .card-desc {
        margin-top: 17px;
        font-size: 16px;
        line-height: 24px;
    }
}

@media (min-width: 1280px) {
    .card-desc {
        margin-top: 22px;
    }
}

.edit-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0px;
    height: 12px;
    cursor: pointer;
}

@media (min-width: 768px) {
    .edit-button {
        height: 20px;
    }
}

@media (min-width: 1280px) {
    .edit-button {
        height: 26px;
    }
}

#phone-number {
    position: absolute;
    opacity: 0;
    z-index: -1;
}
</style>