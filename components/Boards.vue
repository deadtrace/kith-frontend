<template>
    <div style="width: 100%;" class="px-5">
        <v-row justify="space-between" align="center">
            <v-text-field
                outlined
                label="Поиск"
                v-model="searchText"
                append-icon="mdi-magnify"
                hide-details
                height="40px"
                @keyup.enter="newSearch"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="default" height="40px" dark depressed large @click="addDialog=true">
                Добавить
                <v-icon right dark>mdi-plus</v-icon>
            </v-btn>
        </v-row>
        <v-row justify="center" class="mt-5">
            <v-card
                dark
                width="400"
                height="250"
                class="board"
                v-for="board in boards"
                :key="board.board_id"
                :style=" getBackground(board.board_photos) "
            >
                <v-card-title>
                    <v-list-item class="grow px-0">
                        <v-list-item-avatar class="mr-3">
                            <v-img
                                v-if="board.owner_photo"
                                class="elevation-6"
                                :src="board.owner_photo"
                            ></v-img>
                            <v-img v-else class="elevation-6" src="@/assets/unknown.jpg"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{board.owner_firstname + ' ' + board.owner_lastname}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-title>

                <v-card-text class="card-text">
                    <span
                        v-if="board.board_title.length < 82"
                        class="headline font-weight-bold white--text"
                    >{{board.board_title}}</span>
                    <span v-else class="font-weight-bold white--text">{{board.board_title}}</span>
                </v-card-text>

                <v-card-actions>
                    <v-list-item class="px-2">
                        <span class="subheading">{{datePublished(board.board_date_create)}}</span>

                        <v-row align="center" justify="end">
                            <v-btn icon>
                                <v-icon class="mr-1" @click="openEditDialog(board)">mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn icon>
                                <v-icon
                                    class="mr-1"
                                    @click="deleteDialog = {show: true, board}"
                                >mdi-delete</v-icon>
                            </v-btn>
                        </v-row>
                    </v-list-item>
                </v-card-actions>
            </v-card>
        </v-row>
        <div class="text-center mt-5">
            <v-pagination v-model="page" :length="Math.ceil(total/perPage)" @input="getBoards"></v-pagination>
        </div>

        <v-dialog v-model="deleteDialog.show" width="500" @click:outside="closeDeleteDialog">
            <v-card>
                <v-card-title
                    class="title"
                >Вы уверены, что хотите удалить объявление "{{deleteDialog.board.board_title}}"?</v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        dark
                        color="red"
                        @click="deleteBoard(deleteDialog.board.board_id)"
                        class="mb-1"
                    >Да</v-btn>
                    <v-btn dark color="default" @click="closeDeleteDialog" class="mr-1 mb-1">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="editDialog.show" width="500" @click:outside="closeEditDialog">
            <v-card>
                <v-carousel v-if="photosToChange.length == 0" cycle height="300">
                    <v-carousel-item
                        v-for="(photo,i) in editDialog.board.board_photos"
                        :key="i"
                        :src="photo.src"
                        contain
                    ></v-carousel-item>
                </v-carousel>

                <v-container mt-4 pb-0>
                    <v-file-input
                        multiple
                        v-model="photosToChange"
                        accept="image/*"
                        label="Выбрать другие фотографии"
                        outlined
                    ></v-file-input>
                    <v-textarea
                        v-model="editDialog.board.board_title"
                        label="Название"
                        outlined
                        counter="255"
                        no-resize
                        rows="3"
                    ></v-textarea>
                </v-container>

                <v-container pb-0>
                    <v-row>
                        <v-col class="pb-0">
                            <v-text-field
                                v-model="editDialog.board.board_price"
                                label="Цена"
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container pb-0>
                    <v-row>
                        <v-col class="pb-0">
                            <v-select
                                :items="categories"
                                label="Категория"
                                outlined
                                item-text="name_native"
                                item-value="id"
                                v-model="editDialog.board.category"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container pb-0>
                    <v-row>
                        <v-col class="pb-0">
                            <v-select
                                :items="countries"
                                label="Страна"
                                outlined
                                item-text="name_native"
                                item-value="id"
                                v-model="editDialog.board.country"
                                @change="updateCountry(false)"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container pb-0>
                    <v-row>
                        <v-col class="pb-0">
                            <v-autocomplete
                                v-if="editDialog.board.country"
                                v-model="editDialog.board.region"
                                :items="regions"
                                flat
                                hide-no-data
                                hide-details
                                label="Регион"
                                item-text="name_native"
                                item-value="id"
                                outlined
                                @change="updateRegion(false)"
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container pb-0>
                    <v-row>
                        <v-col class="pb-0">
                            <v-autocomplete
                                v-if="editDialog.board.region"
                                v-model="editDialog.board.city"
                                :items="cities"
                                flat
                                hide-no-data
                                hide-details
                                label="Город"
                                item-text="name_native"
                                item-value="id"
                                outlined
                                class="mt-6 mb-6"
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container pb-0>
                    <v-textarea
                        v-model="editDialog.board.board_description"
                        label="Описание"
                        outlined
                        no-resize
                        hide-details
                    ></v-textarea>
                    <v-switch v-model="editDialog.board.board_enabled" label="Активно"></v-switch>
                </v-container>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        dark
                        color="success"
                        class="mb-1"
                        @click="editBoard(editDialog.board)"
                    >Сохранить</v-btn>
                    <v-btn dark color="default" @click="closeEditDialog" class="mr-1 mb-1">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="addDialog" width="500" @click:outside="closeAddDialog">
            <v-card>
                <v-container mt-4 pb-0>
                    <v-file-input
                        multiple
                        v-model="boardToAdd.board_photos"
                        accept="image/*"
                        label="Выбрать фотографии"
                        outlined
                    ></v-file-input>
                    <v-textarea
                        v-model="boardToAdd.board_title"
                        label="Название"
                        no-resize
                        outlined
                        counter="255"
                        rows="3"
                    ></v-textarea>
                </v-container>

                <v-container pb-0>
                    <v-row>
                        <v-col class="pb-0">
                            <v-text-field v-model="boardToAdd.board_price" label="Цена" outlined></v-text-field>
                        </v-col>
                    </v-row>
                    <v-textarea
                        v-model="boardToAdd.board_description"
                        no-resize
                        label="Описание"
                        outlined
                    ></v-textarea>
                    <v-select
                        :items="categories"
                        label="Категория"
                        outlined
                        item-text="name_native"
                        item-value="id"
                        v-model="boardToAdd.category"
                    ></v-select>
                    <v-select
                        :items="countries"
                        label="Страна"
                        outlined
                        item-text="name_native"
                        item-value="id"
                        v-model="boardToAdd.country"
                        @change="updateCountry(true)"
                    ></v-select>
                    <v-autocomplete
                        v-if="boardToAdd.country"
                        v-model="boardToAdd.region"
                        :items="regions"
                        flat
                        :search-input.sync="searchRegion"
                        hide-no-data
                        hide-details
                        label="Регион"
                        item-text="name_native"
                        item-value="id"
                        outlined
                        @change="updateRegion(true)"
                    ></v-autocomplete>
                    <v-autocomplete
                        v-if="boardToAdd.region"
                        v-model="boardToAdd.city"
                        :items="cities"
                        flat
                        :search-input.sync="searchCity"
                        hide-no-data
                        hide-details
                        label="Город"
                        item-text="name_native"
                        item-value="id"
                        outlined
                        class="mt-6"
                    ></v-autocomplete>
                    <v-row>
                        <v-col>
                            <v-switch v-model="boardToAdd.board_enabled" label="Активно"></v-switch>
                        </v-col>
                    </v-row>
                    <v-divider v-if="switchFromAnotherResource"></v-divider>
                    <v-switch
                        v-model="switchFromAnotherResource"
                        label="Добавлено со стороннего ресурса"
                    ></v-switch>
                    <v-row v-if="switchFromAnotherResource" justify="center">
                        <v-col cols="10">
                            <v-file-input
                                v-model="userFromAnotherResource.photo"
                                accept="image/*"
                                label="Выбрать фото пользователя"
                                outlined
                            ></v-file-input>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="userFromAnotherResource.firstname"
                                label="Имя"
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                v-model="userFromAnotherResource.phone"
                                label="Телефон"
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        dark
                        color="success"
                        class="mb-1"
                        @click="createBoard(boardToAdd)"
                    >Добавить</v-btn>
                    <v-btn dark color="default" @click="closeAddDialog" class="mr-1 mb-1">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar right color="default" v-model="snackbar">{{ snacktext }}</v-snackbar>
    </div>
</template>

<script>
import * as Boards from "@/services/boards";
import * as Categories from "@/services/categories";
import * as Countries from "@/services/countries";
import * as Regions from "@/services/regions";
import * as Cities from "@/services/cities";

export default {
    data: () => ({
        page: 1,
        perPage: 10,
        searchText: "",
        total: 0,
        snackbar: false,
        snacktext: "",
        addDialog: false,
        searchCity: null,
        searchRegion: null,
        switchFromAnotherResource: false,
        userFromAnotherResource: {
            firstname: "",
            phone: "",
            photo: null
        },
        defaultUser: {
            firstname: "",
            phone: "",
            photo: null
        },
        boardToAdd: {
            board_title: "",
            board_description: "",
            board_price: 0,
            board_photos: [],
            category: null,
            country: null,
            region: null,
            city: null,
            board_enabled: false
        },
        defaultBoard: {
            board_title: "",
            board_description: "",
            board_price: 0,
            board_photos: [],
            category: null,
            country: null,
            region: null,
            city: null,
            board_enabled: false
        },
        deleteDialog: { show: false, board: {} },
        editDialog: { show: false, board: {} },
        boards: [],
        categories: [],
        countries: [],
        regions: [],
        cities: [],
        photosToChange: []
    }),
    created() {
        this.getBoards();
        this.getCategories();
        this.getCountries();
    },
    watch: {
        searchCity: function(val) {
            val && this.getCities(val, this.boardToAdd.region);
        },
        searchRegion: function(val) {
            val && this.getRegions(val, this.boardToAdd.country);
        }
    },
    methods: {
        closeDeleteDialog() {
            this.deleteDialog = { show: false, board: {} };
        },

        closeEditDialog() {
            this.editDialog = { show: false, board: {} };
            this.getBoards();
        },

        closeAddDialog() {
            this.boardToAdd = Object.assign({}, this.defaultBoard);
            this.addDialog = false;
        },

        editBoard(board) {
            const fd = new FormData();
            fd.append("board_id", board.board_id);
            fd.append("board_title", board.board_title);
            fd.append("board_price", board.board_price);
            fd.append("board_description", board.board_description);
            if (typeof board.category === 'undefined' || board.category === null) {
                fd.append("category", null)
            } else if (typeof board.category.id !== 'undefined') {
                fd.append("category", board.category.id)
            } else {
                fd.append("category", board.category)
            }
            if (typeof board.country === 'undefined' || board.country === null) {
                fd.append("country", null)
            } else if (typeof board.country.id !== 'undefined') {
                fd.append("country", board.country.id)
            } else {
                fd.append("country", board.country)
            }
            if (typeof board.region === 'undefined' || board.region === null) {
                fd.append("region", null)
            } else if (typeof board.region.id !== 'undefined') {
                fd.append("region", board.region.id)
            } else {
                fd.append("region", board.region)
            }
            if (typeof board.city === 'undefined' || board.city === null) {
                fd.append("city", null)
            } else if (typeof board.city.id !== 'undefined') {
                fd.append("city", board.city.id)
            } else {
                fd.append("city", board.city)
            }
            board.board_enabled
                ? fd.append("board_enabled", 1)
                : fd.append("board_enabled", 0);
            for (var i = 0; i < this.photosToChange.length; i++) {
                fd.append(
                    "board_photo[]",
                    this.photosToChange[i],
                    this.photosToChange[i].name
                );
            }

            Boards.edit(fd)
                .then(() => {
                    this.showSnackbar("Объявление успешно изменено");
                    this.getBoards();
                })
                .catch(() => {
                    this.showSnackbar("Что-то пошло не так");
                });
            this.photosToChange = [];
            this.closeEditDialog();
        },

        getBoards() {
            Boards.get_boards(
                this.perPage,
                (this.page - 1) * this.perPage,
                this.searchText
            )
                .then(res => {
                    this.boards = res.data.boards;
                    this.total = res.data.total;
                })
                .catch(() => {
                    this.showSnackbar("Что-то пошло не так");
                });
        },

        datePublished(date) {
            return (
                date.slice(8, 10) +
                "." +
                date.slice(5, 7) +
                "." +
                date.slice(0, 4)
            );
        },

        getBackground(photos) {
            if (photos.length != 0) {
                return {
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(" +
                        photos[0].src +
                        ")"
                };
            } else {
                return { backgroundColor: "#0680C2" };
            }
        },

        deleteBoard(board_id) {
            Boards.del(board_id)
                .then(() => {
                    this.showSnackbar("Объявление успешно удалено");
                    this.getBoards();
                    this.closeDeleteDialog();
                })
                .catch(() => {
                    this.showSnackbar("Что-то пошло не так");
                });
        },

        createBoard(board) {
            const fd = new FormData();
            fd.append("board_title", board.board_title);
            fd.append("board_description", board.board_description);
            fd.append("board_price", board.board_price);
            if (board.board_enabled) fd.append("board_enabled", 1);
            fd.append("category", board.category);
            fd.append("country", board.country);
            fd.append("region", board.region);
            fd.append("city", board.city);
            for (var i = 0; i < board.board_photos.length; i++) {
                fd.append(
                    "board_photo[]",
                    board.board_photos[i],
                    board.board_photos[i].name
                );
            }
            if (this.switchFromAnotherResource) {
                fd.append("board_external", 1);
                fd.append(
                    "user_firstname",
                    this.userFromAnotherResource.firstname
                );
                fd.append("user_phone", this.userFromAnotherResource.phone);
                if (this.userFromAnotherResource.photo != null) {
                    fd.append(
                        "user_photo",
                        this.userFromAnotherResource.photo,
                        this.userFromAnotherResource.photo.name
                    );
                }
            }

            Boards.create(fd)
                .then(() => {
                    this.showSnackbar("Объявление успешно создано");
                    this.getBoards();
                })
                .catch(() => {
                    this.showSnackbar("Что-то пошло не так");
                });

            this.addDialog = false;
            this.boardToAdd = Object.assign({}, this.defaultBoard);
            this.switchFromAnotherResource = false;
            this.userFromAnotherResource = this.defaultUser;
        },

        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        },

        newSearch() {
            this.page = 1;
            this.getBoards();
        },

        getCategories() {
            Categories.get("", 0, 1000)
                .then(res => {
                    this.categories = res.data.categories;
                })
                .catch(() => {
                    this.showSnackbar("Не удалось загрузить категории");
                });
        },

        getCountries() {
            Countries.get("", 0, 1000)
                .then(res => {
                    this.countries = res.data.countries;
                })
                .catch(() => {
                    this.showSnackbar("Не удалось загрузить страны");
                });
        },

        getRegions(search, countryID) {
            Regions.get(search, countryID, 0, 20)
                .then(res => {
                    this.regions = res.data.regions;
                })
                .catch(() => {});
        },

        getCities(search, regionID) {
            Cities.get(search, regionID, 0, 20)
                .then(res => {
                    this.cities = res.data.cities;
                })
                .catch(() => {});
        },

        updateCountry(editOrAdd) {
            if (editOrAdd) {
                this.getRegions("", this.boardToAdd.country);
                this.boardToAdd.region = null;
                this.boardToAdd.city = null;
            } else {
                this.getRegions("", this.editDialog.board.country);
                this.editDialog.board.region = null;
                this.editDialog.board.city = null;
            }
        },

        updateRegion(editOrAdd) {
            if (editOrAdd) {
                this.getCities("", this.boardToAdd.region);
                this.boardToAdd.city = null;
            } else {
                this.editDialog.board.city = null;
                this.getCities("", this.editDialog.board.region);
            }
        },

        openEditDialog(board) {
            this.editDialog = { show: true, board };
            if (board.country) {
                if (board.region) {
                    this.getRegions(board.region.name_native, board.country.id);
                    if (board.city) {
                        this.getCities(board.city.name_native, board.region.id);
                    } else {
                        this.getCities("", board.region.id);
                    }
                } else {
                    this.getRegions("", board.country.id);
                }
            }
        }
    }
};
</script>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
    background-position: center;
    background-size: cover;
    margin: 0 10px 20px 10px;
}

.card-text {
    margin-top: auto;
}
</style>