<template>
    <div class="ad--card">
        <div class="card-header">
            <div class="card-header-left">
                <img class="user-photo" :style="`background-image: url(${photo});`" />
            </div>
            <div class="card-header-right">
                <div class="card-header-right-info">
                    <div class="username">{{username}}</div>
                    <div class="category">{{ category }}</div>
                    <div class="location">{{location}}</div>
                </div>
                <div class="card-header-buttons">
                    <button class="card-button">
                        <img src="@/assets/bluePhone.png" class="phone-icon" />
                        Позвонить
                    </button>
                    <button class="card-button">
                        <img src="@/assets/blueMail.png" class="mail-icon" />Написать
                    </button>
                </div>
            </div>
        </div>
        <div class="card-name">
            <div class="ad-name">{{ name ? `${name}` : 'Название'}}</div>
            <img src="@/assets/bookmark.png" class="bookmark-icon" />
        </div>
        <Slider
            animation="fade"
            v-model="sliderValue"
            :interval="6000"
            :speed="1000"
            :height="windowWidth > 768 ? '300px' : '150px'"
            class="slider"
            v-if="photos.length > 0"
        >
            <SliderItem v-for="(i, index) in photos" :key="index" @click="changeIndex(1);">
                <div class="slider-item" :style="`background-image: url(${i});`"></div>
            </SliderItem>
        </Slider>
        <div class="blue-photo" v-else>
        </div>
        <div class="dateprice">
            <div v-if="date" class="date">{{ currentDate(date) }}</div>
            <div v-else class="date"></div>
            <div class="price">{{ price ? `${parseInt(price, 10).toLocaleString('ru-RU')} руб.` : `Без цены` }}</div>
        </div>
        <div class="description">{{ description ? `${description}` : `Описание`}}</div>
    </div>
</template>

<script>
import { Slider, SliderItem } from "vue-easy-slider";

export default {
    components: {
        Slider,
        SliderItem
    },
    data: () => ({
        sliderValue: 2,
        month: [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря"
        ]
    }),
    methods: {
        changeIndex(index) {
            this.sliderValue = index;
        },
        currentDate(date) {
            let d = new Date(date);
            d = d.toLocaleDateString();
            d = `${parseInt(d.slice(0, 2))} ${
                this.month[parseInt(d.slice(3, 5)) - 1]
            } ${d.slice(6)}`;
            return d;
        }
    },
    props: [
        "photo",
        "username",
        "category",
        "location",
        "name",
        "price",
        "description",
        "photos",
        "date",
        "highlight"
    ],
    watch: {
        highlight: function(val) {
            let card = document.getElementsByClassName("ad--card")[0];
            if (val) {
                card.style.boxShadow = "0px 2px 9px rgba(166, 216, 143, 1)";
            } else {
                card.style.boxShadow = "0px 2px 9px rgba(0, 0, 0, 0.2)";
            }
        }
    },
    mounted() {
        if (this.highlight) {
            let card = document.getElementsByClassName("ad--card")[0];
            card.style.boxShadow = "0px 2px 9px rgba(166, 216, 143, 1)";
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

p {
    margin: 0;
}

.ad--card {
    border-radius: 10px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    padding: 11px 15px 16px;
    box-sizing: border-box;
    max-width: 600px;
    width: 100%;
}

.card-header {
    display: flex;
}

.user-photo {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    margin-right: 7px;
    background-size: cover;
    background-position: center;
}

.username {
    font-size: 9px;
}

.category,
.location {
    font-size: 8px;
    line-height: 11px;
}

.card-header-right {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.card-header-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.phone-icon {
    height: 8px;
    margin-right: 4px;
}

.mail-icon {
    height: 8px;
    margin-right: 6px;
}

.card-button {
    display: flex;
    align-items: center;
    border-radius: 4px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    color: var(--main-color);
    font-size: 8px;
    padding: 3px 6px;
}

.card-button + .card-button {
    margin-top: 3px;
}

.card-name {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-top: 5px;
}

.bookmark-icon {
    height: 13px;
}

.ad-name {
    font-size: 10px;
    line-height: 14px;
}

.slider {
    margin-top: 3px;
}

.slider-item {
    background-color: #98b9da;
    background-position: center;
    background-size: cover;
    height: 100%;
}

.dateprice {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid #4e5a5f;
}

.date {
    font-size: 10px;
    color: rgba(0, 0, 0, 0.5);
}

.price {
    font-family: Intro;
    font-size: 10px;
    line-height: 14px;
}

.description {
    margin-top: 20px;
    font-size: 10px;
    line-height: 15px;
}

@media (min-width: 768px) {
    .ad--card {
        padding: 20px 30px;
    }

    .user-photo {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        margin-right: 14px;
    }

    .username {
        font-size: 17px;
    }

    .category,
    .location {
        font-size: 10px;
        line-height: 14px;
    }

    .category {
        margin-top: 5px;
    }

    .phone-icon {
        height: 17px;
    }

    .mail-icon {
        height: 12px;
    }

    .card-button {
        font-size: 11px;
        padding: 7px 10px;
    }

    .card-button + .card-button {
        margin-top: 9px;
    }

    .bookmark-icon {
        height: 24px;
    }

    .card-name {
        margin-top: 10px;
    }

    .ad-name {
        font-size: 14px;
        line-height: 19px;
    }

    .slider {
        margin-top: 8px;
    }

    .dateprice {
        margin-top: 12px;
        padding-bottom: 11px;
    }

    .date {
        font-size: 14px;
        line-height: 19px;
    }

    .price {
        font-size: 14px;
        line-height: 19px;
    }

    .description {
        margin-top: 14px;
        font-size: 12px;
        line-height: 18px;
    }
}

.blue-photo {
    background-color: #98b9da;
    height: 150px;
    margin-top: 3px;
}

@media (min-width: 768px) {
    .blue-photo {
        height: 300px;
    }
}
</style>