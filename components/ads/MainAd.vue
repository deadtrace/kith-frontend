<template>
    <div class="card">
        <div v-if="board.category" class="category">{{ board.category.name_native }}</div>
        <div v-else class="category">Без категории</div>
        <div class="space-between name-and-button">
            <div
                class="card-name clickable"
                @click="$router.push({path: `/ad/${board.board_id}`})"
            >{{ board.board_title }}</div>
            <div class="card-button">
                <template v-if="status !== 'archive' ">
                    <img
                        v-if="board.subscription_on_board"
                        src="@/assets/bookmarkActivated.png"
                        style="height: 20px;"
                        class="clickable"
                        @click="removeFromFavourite(board.board_id, board.board_title)"
                    />
                    <img
                        v-else
                        src="@/assets/bookmark.png"
                        style="height: 20px;"
                        class="clickable"
                        @click="addToFavourite(board.board_id, board.board_title)"
                    />
                </template>
                <img
                    v-else
                    src="@/assets/publishBoard.png"
                    style="height: 22px;"
                    class="clickable"
                    @click="removeFromArchive(board.board_id, board.board_title)"
                />
            </div>
        </div>
        <template v-if="board.board_photos.length !== 0">
            <Slider
                animation="fade"
                v-model="sliderValue"
                :interval="6000"
                :speed="1000"
                :height="'140px'"
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
        <div class="date-and-price space-between">
            <div class="card-date">{{ $moment(board.board_date_create).format('LL') }}</div>
            <div
                v-if="board.board_price"
                class="card-price"
            >{{ board.board_price.toLocaleString('ru-RU') }} руб.</div>
            <div v-else class="card-price">Без цены</div>
        </div>
        <div class="comments-and-geo space-between">
            <div
                class="card-comments clickable"
                @click="$router.push({path: `/ad/${board.board_id}`})"
            >
                <img src="@/assets/comments.png" style="height: 14px;" />
                <span class="card-comments-counter">{{ board.comments }}</span>
            </div>
            <div class="card-geo">{{ geo(board.country, board.region, board.city) }}</div>
        </div>
    </div>
</template>

<script>
import { Slider, SliderItem } from "vue-easy-slider";
import * as Boards from "@/services/boards";

export default {
    data: () => ({
        sliderValue: 1,
        photos: []
    }),
    components: {
        Slider,
        SliderItem
    },
    props: ["board", "status"],
    methods: {
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
        removeFromArchive(id, name) {
            Boards.removeFromArchive(id)
                .then(() => {
                    this.$emit("needToUpdate");
                    this.$toast(
                        `Объявление "${name}" успешно убрано из архива`
                    );
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error(
                              `Произошла ошибка при убирании объявления ${name} из архива`
                          );
                });
        },
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
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.card {
    border-radius: 6px;
    background: white;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    padding: 10px 13px 15px;
    box-sizing: border-box;
    width: 280px;
    min-width: 280px;
}

.category {
    font-size: 11px;
    line-height: 15px;
    color: #acacac;
    margin-bottom: 17px;
}

.card-name {
    font-size: 11px;
    line-height: 15px;
}

.slider {
    margin-top: 5px;
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

.card-date {
    font-size: 10px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.5);
}

.card-price {
    font-size: 14px;
    line-height: 19px;
}

.date-and-price {
    margin-top: 7px;
    padding-bottom: 7px;
    border-bottom: 0.4px solid rgba(0, 0, 0, 0.7);
}

.comments-and-geo {
    margin-top: 6px;
}

.card-geo {
    color: #707070;
    font-size: 10px;
    line-height: 14px;
}

.card-comments {
    display: flex;
    align-items: flex-start;
}

.card-comments-counter {
    font-size: 12px;
    position: relative;
    margin-left: 6px;
}
</style>