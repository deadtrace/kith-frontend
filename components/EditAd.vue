<template>
    <div class="adding-ad">
        <div class="add-block">
            <div class="blue-header">Редактирование объявления</div>
            <input type="file" id="photos" accept="image/*" @change="addPhoto" />
            <div class="photos">
                <div
                    class="big-photo"
                    :style="photos[0] ? `background-image: url(${photos[0].src});` : ''"
                >
                    <div
                        v-if="photos[0]"
                        class="big-delete-container"
                        @click="removePhoto(photos[0], 0)"
                    >
                        <img src="@/assets/delete.svg" class="big-delete" />
                    </div>
                    <label v-if="!photos[0]" class="add-button-container" for="photos">
                        <img src="@/assets/plusWhite.svg" class="big-plus" />
                    </label>
                    <img v-if="!photos[0]" src="@/assets/newspaper.png" class="newspaper-icon" />
                </div>
                <div class="extra-photos-container">
                    <div
                        class="small-photo"
                        v-for="(photo,index) in photos.slice(1, photos.length)"
                        :key="index"
                        :style="`background-image: url(${photo.src});`"
                    >
                        <div
                            class="small-delete-container"
                            @click="removePhoto(photos[index + 1], index + 1)"
                        >
                            <img src="@/assets/delete.svg" class="small-delete" />
                        </div>
                    </div>
                    <label
                        v-if="photos.length < 3 && photos.length !== 0"
                        for="photos"
                        class="small-photo clickable"
                    >
                        <div class="small-photo-add-button-container">
                            <img src="@/assets/plusWhite.svg" class="big-plus" />
                        </div>
                    </label>
                </div>
            </div>
            <div class="price-block">
                <input
                    type="text"
                    v-model="price"
                    class="price-input"
                    placeholder="Цена"
                    @keypress="onlyNumber"
                />
                <span class="price-rouble">руб.</span>
            </div>
            <div class="name-block">
                <input type="text" v-model="name" class="name-input" placeholder="Заголовок" />
            </div>
            <div class="description-block">
                <textarea class="description" v-model="description" placeholder="Описание"></textarea>
            </div>
            <div class="category-block">
                <multiselect
                    v-model="category"
                    :options="categories"
                    :hideSelected="true"
                    :maxHeight="200"
                    :showLabels="false"
                    :searchable="false"
                    label="name_native"
                    track-by="id"
                    placeholder="Категория"
                ></multiselect>
            </div>
        </div>
        <div class="services-block">
            <div class="blue-header" style="margin-bottom: 30px;">Предпросмотр</div>
            <AdCard
                :photo="$store.getters.photoURL"
                :username="$store.getters.username"
                :category="category ? category.name_native : `Без категории`"
                location="Местоположение"
                :name="name"
                :description="description"
                :price="price"
                :photos="photoURLs"
                :date="new Date()"
                :highlight="false"
            ></AdCard>
            <div class="button-block">
                <div class="preview-buttons">
                    <button class="white-button" @click="deleteAd">Удалить</button>
                    <button class="save-button" @click="editAd">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as Categories from "@/services/categories";
import * as Boards from "@/services/boards";
import AdCard from "@/components/AdCard.vue";
import Multiselect from "vue-multiselect";

export default {
    components: {
        AdCard,
        Multiselect
    },
    data: () => ({
        photos: [],
        photoFiles: [],
        photosToDelete: [],
        categories: [],
        category: "",
        description: "",
        price: "",
        name: ""
    }),
    methods: {
        addPhoto(event) {
            let image = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                this.photos.push({ src: e.target.result });
                this.photoFiles.push({ image, src: e.target.result });
            };
        },
        removePhoto(photo, index) {
            if (!photo.id) {
                let file = this.photoFiles.find(file => file.src === photo.src);
                let indexOfFile = this.photoFiles.indexOf(file);
                this.photoFiles.splice(indexOfFile, 1);
            } else {
                this.photosToDelete.push(photo.id);
            }
            this.photos.splice(index, 1);
        },
        onlyNumber($event) {
            let keyCode = $event.keyCode ? $event.keyCode : $event.which;
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
                $event.preventDefault();
            }
        },
        loadCategories() {
            Categories.get("", 0, 100)
                .then(res => {
                    this.categories = res.data.categories;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        getAd() {
            Boards.getBoard(this.$route.params.board_id)
                .then(res => {
                    if (
                        res.data.board.board_user_id ===
                        this.$store.getters.userID
                    ) {
                        this.description = res.data.board.board_description;
                        this.name = res.data.board.board_title;
                        this.price = res.data.board.board_price;
                        this.category = res.data.board.category;
                        this.photos = res.data.board.board_photos;
                    } else {
                        this.$router.push({ path: "/" });
                    }
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        editAd() {
            if (!this.name || !this.description) {
                this.$toast(
                    "Пожалуйста, заполните название и описание объявления"
                );
            } else {
                let fd = new FormData();
                fd.append("board_id", this.$route.params.board_id);
                fd.append("board_title", this.name);
                fd.append("board_description", this.description);
                fd.append("board_price", this.price);
                if (this.category) {
                    fd.append("category", this.category.id);
                } else {
                    fd.append("category", "");
                }

                for (let i = 0; i < this.photosToDelete.length; i++) {
                    this.deletePhoto(this.photosToDelete[i]);
                }

                this.addPhotos(this.photoFiles);

                Boards.edit(fd)
                    .then(() => {
                        this.$toast("Объявление успешно изменено");
                        this.$router.push({
                            name: "ad",
                            params: {
                                board_id: `${this.$route.params.board_id}`
                            }
                        });
                    })
                    .catch(err => {
                        err.response.data.message
                            ? this.$toast.error(err.response.data.message)
                            : this.$toast.error("Произошла ошибка");
                    });
            }
        },
        addPhotos(photos) {
            let fd = new FormData();
            for (let i = 0; i < photos.length; i++) {
                fd.append("board_photo[]", photos[i].image);
            }
            Boards.addPhotos(this.$route.params.board_id, fd)
                .then(() => {})
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при добавлении фотографий"
                    );
                });
        },
        deletePhoto(photo_id) {
            Boards.deletePhoto(photo_id)
                .then(() => {})
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при удалении фотографии"
                    );
                });
        },
        deleteAd() {
            Boards.del(this.$route.params.board_id)
                .then(() => {
                    this.$toast("Объявление успешно удалено");
                    this.$router.push({name: 'ads'});
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        }
    },
    created() {
        this.loadCategories();
        this.getAd();
    },
    metaInfo: {
        title: "Редактирование объяления"
    },
    computed: {
        photoURLs() {
            let list = [];
            for (let i = 0; i < this.photos.length; i++) {
                list.push(this.photos[i].src);
            }
            return list;
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.adding-ad {
    display: flex;
    flex-direction: column;
    padding: 0px 22px;
    box-sizing: border-box;
    max-width: 1200px;
    width: 100%;
}

.blue-header {
    font-size: 20px;
    line-height: 27px;
    color: var(--main-color);
}

.photos {
    display: flex;
    flex-direction: column;
}

.big-photo {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    height: 50vw;
    position: relative;
    margin-top: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: cover;
}

.big-delete-container {
    height: 30px;
    width: 30px;
    position: absolute;
    right: 15px;
    top: 15px;
    background: white;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.small-delete-container {
    height: 24px;
    width: 24px;
    position: absolute;
    right: 8px;
    top: 8px;
    background: white;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.big-delete,
.big-plus,
.small-delete {
    height: 50%;
}

.add-button-container {
    height: 46px;
    width: 46px;
    position: absolute;
    background: var(--main-color);
    box-sizing: border-box;
    border-radius: 23px;
    bottom: 0px;
    left: 50%;
    border: 3px solid white;
    transform: translate(-50%, 50%);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.newspaper-icon {
    height: 86px;
}

.extra-photos-container {
    display: flex;
    margin-top: 30px;
}

.extra-photos-container .small-photo + .small-photo {
    margin-left: 15px;
}

.small-photo {
    width: 30vw;
    height: 15vw;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: cover;
    position: relative;
}

.small-photo-add-button-container {
    position: relative;
    height: 36px;
    width: 36px;
    border-radius: 18px;
    background: var(--main-color);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

input[type="file"] {
    display: none;
}

@media (min-width: 768px) {
    .adding-ad {
        padding: 0px 90px;
    }

    .blue-header {
        font-size: 24px;
        line-height: 32px;
        color: var(--main-color);
    }

    .photos {
        flex-direction: row;
        margin-top: 30px;
    }

    .big-photo {
        height: 240px;
        width: 400px;
        margin-top: 0px;
    }

    .small-photo {
        width: 160px;
        height: 104px;
    }

    .extra-photos-container {
        flex-direction: column;
        margin-top: 0px;
        margin-left: 26px;
    }

    .extra-photos-container .small-photo + .small-photo {
        margin-left: 0px;
        margin-top: 15px;
    }
}

.price-block {
    margin-top: 36px;
}

input[type="text"] {
    font-size: 14px;
    line-height: 19px;
    border-radius: 7px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
}

.description {
    font-size: 14px;
    line-height: 19px;
    border-radius: 13px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    height: 320px;
    resize: none;
    margin-top: 20px;
    width: 100%;
    padding: 18px;
}

.price-input {
    padding: 6px 16px;
    max-width: 94px;
}

.price-rouble {
    color: rgba(0, 0, 0, 0.5);
    margin-left: 10px;
    font-size: 14px;
    line-height: 19px;
}

.name-block {
    margin-top: 20px;
}

.name-input {
    padding: 13px 16px;
    max-width: 376px;
    width: 100%;
}

.services-block {
    margin-top: 50px;
}

.services-description {
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 13px;
}

.service-name {
    color: var(--main-color);
    font-size: 14px;
    line-height: 27px;
}

.highlight-service,
.top-service,
.placement-service {
    margin-top: 24px;
}

@media (min-width: 768px) {
    .price-block {
        margin-top: 50px;
    }

    .description {
        height: 236px;
    }

    .highlight-service {
        margin-top: 24px;
    }
}

.fake-radio {
    height: 16px;
    width: 16px;
    border-radius: 8px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
}

.fake-radio-dot {
    opacity: 0;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: var(--main-color);
    transition-duration: 0.3s;
}

input[type="radio"] {
    display: none;
}

input[type="radio"]:checked + .fake-radio .fake-radio-dot {
    opacity: 1;
}

.radio-buttons {
    border-radius: 18px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
    width: fit-content;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}

.radio-button {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 27px;
}

.radio-button + .radio-button {
    margin-top: 13px;
}

.radio-value {
    margin-left: 10px;
}

@media (min-width: 768px) {
    .radio-buttons {
        flex-direction: row;
    }

    .radio-button + .radio-button {
        margin-top: 0px;
        margin-left: 20px;
    }
}

.placement-service {
    padding-bottom: 25px;
}

.payment-block {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.payment-line {
    display: flex;
    justify-content: space-between;
    max-width: 300px;
    width: 300px;
    font-size: 12px;
    color: #989898;
    align-self: flex-end;
}

.payment-line + .payment-line {
    margin-top: 7px;
}

.payment-sum {
    font-size: 16px;
    line-height: 33px;
    color: var(--main-color);
    align-self: flex-end;
    display: flex;
}

.button-block {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.save-button {
    align-self: center;
    background-color: var(--main-color);
    color: white;
    font-size: 20px;
    box-sizing: border-box;
    height: 48px;
    padding: 0px 45px;
    border-radius: 54px;
}

.white-button {
    align-self: center;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    background-color: white;
    color: var(--main-color);
    font-size: 20px;
    box-sizing: border-box;
    height: 48px;
    padding: 0px 45px;
    border-radius: 54px;
}

.save-info {
    align-self: center;
    font-size: 12px;
    line-height: 27px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 8px;
}

@media (min-width: 768px) {
    .payment-block {
        margin-top: 40px;
    }

    .save-button {
        align-self: flex-end;
    }

    .save-info {
        align-self: flex-end;
    }
}

@media (min-width: 1200px) {
    .adding-ad {
        padding: 0px 22px;
        flex-direction: row;
    }

    .add-block {
        width: 50%;
        padding-right: 60px;
    }

    .services-block {
        width: 50%;
        border-left: 1px solid #b0b0b0;
        padding-left: 50px;
    }

    .services-block-upper {
        padding-left: 35px;
    }

    .services-block {
        margin-top: 0px;
    }
}

.category-block {
    margin-top: 20px;
}

.category-input-container {
    max-width: 180px;
    position: relative;
}

.category-input {
    padding: 13px 38px 13px 16px;
    box-sizing: border-box;
    width: 100%;
}

.arrow-icon {
    height: 9px;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
}

.categories {
    position: absolute;
    padding: 10px 0px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    bottom: -5px;
    transform: translateY(100%);
}

/* .category-input:focus + .categories {
    opacity: 0.95;
} */

.category {
    font-size: 14px;
    line-height: 19px;
    color: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    background: white;
    list-style-type: none;
}

.category:hover {
    background-color: rgba(6, 128, 194, 0.1);
    cursor: pointer;
}

.preview-buttons {
    display: flex;
    justify-content: center;
    flex-direction: column-reverse;
    margin-top: 30px;
}

.preview-pay-block {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (min-width: 768px) {
    .preview-buttons {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
}

@media (min-width: 1200px) {
    .preview-buttons {
        justify-content: space-between;
    }
}

.category-block .multiselect {
    border-radius: 7px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    max-width: 300px;
}
</style>