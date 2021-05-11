<template>
    <v-row justify="center" class="px-5">
        <v-card outlined width="100%">
            <v-data-table
                :headers="headers"
                :items="users"
                :search="search"
                :mobile-breakpoint="960"
                disable-filtering
                disable-sort
                :loading="loading"
                :options.sync="options"
                :server-items-length="total"
                item-key="id"
                @update:options="filter"
                :footer-props="{
                        itemsPerPageText: 'Пользователей на странице',
                        itemsPerPageOptions: [10, 25, 50, 100]
                    }"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Поиск"
                            clearable
                            hide-details
                            @keyup.enter="filter({ ...options, page: 1 })"
                            @click:append="filter({ ...options, page: 1 })"
                            @click:clear="() => { search = ''; filter({ ...options, page: 1 }); }"
                        ></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="450px">
                            <template v-slot:activator="{ on }">
                                <v-btn color="default" dark depressed v-on="on">
                                    Добавить
                                    <v-icon right dark>mdi-account-plus</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="title">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row justify="center">
                                            <v-avatar
                                                v-if="editedIndex != -1"
                                                size="200"
                                                @click="photoDialog=true"
                                            >
                                                <v-img
                                                    v-if="editedItem.photo != null"
                                                    :src="editedItem.photo"
                                                    alt="Фотография пользователя"
                                                ></v-img>
                                                <v-img
                                                    v-else
                                                    src="@/assets/unknown.jpg"
                                                    alt="Фотография пользователя"
                                                ></v-img>
                                            </v-avatar>
                                            <v-col cols="10" v-if="editedIndex == -1">
                                                <v-file-input
                                                    v-model="changed_photo"
                                                    accept="image/*"
                                                    label="Выбрать фотографию"
                                                    outlined
                                                ></v-file-input>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.lastname"
                                                    label="Фамилия"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.firstname"
                                                    label="Имя"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.middlename"
                                                    label="Отчество"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.phone"
                                                    label="Телефон"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.email"
                                                    label="Почта"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.position"
                                                    label="Позиция"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea
                                                    v-model="editedItem.description"
                                                    label="Описание"
                                                    outlined
                                                ></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedItem.login"
                                                    label="Логин"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" v-if="editedIndex == -1">
                                                <v-text-field
                                                    v-model="editedItem.password"
                                                    label="Пароль"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-select
                                                    :items="countries"
                                                    label="Страна"
                                                    outlined
                                                    item-text="name_native"
                                                    item-value="id"
                                                    v-model="editedItem.country_id"
                                                    @change="updateCountry"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete
                                                    v-if="editedItem.country_id"
                                                    v-model="editedItem.region_id"
                                                    :items="regions"
                                                    flat
                                                    hide-no-data
                                                    hide-details
                                                    label="Регион"
                                                    :search-input.sync="searchRegion"
                                                    item-text="name_native"
                                                    item-value="id"
                                                    outlined
                                                    @change="updateRegion"
                                                ></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-autocomplete
                                                    v-if="editedItem.region_id"
                                                    v-model="editedItem.city_id"
                                                    :items="cities"
                                                    flat
                                                    hide-no-data
                                                    hide-details
                                                    label="Город"
                                                    :search-input.sync="searchCity"
                                                    item-text="name_native"
                                                    item-value="id"
                                                    outlined
                                                    class="mt-6"
                                                ></v-autocomplete>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        dark
                                        depressed
                                        color="default"
                                        class="mb-2"
                                        @click="close"
                                    >Отмена</v-btn>
                                    <v-btn
                                        dark
                                        depressed
                                        v-if="editedIndex == -1"
                                        class="mb-2 mr-2 success"
                                        @click="save"
                                    >Добавить</v-btn>
                                    <v-btn
                                        dark
                                        depressed
                                        v-else
                                        color="success"
                                        class="mb-2 mr-2"
                                        @click="save"
                                    >Сохранить</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteDialog = { show: true, user: item}">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="deleteDialog.show" width="510" @click:outside="closeDeleteDialog">
            <v-card>
                <v-card-title
                    class="title"
                >Вы уверены, что хотите удалить пользователя "{{deleteDialog.user.lastname + ' ' + deleteDialog.user.firstname}}"?</v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark color="red" @click="deleteUser(deleteDialog.user)" class="mb-1">Да</v-btn>
                    <v-btn dark color="default" @click="closeDeleteDialog" class="mr-1 mb-1">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="photoDialog" width="400">
            <v-card>
                <v-container>
                    <v-file-input
                        v-model="changed_photo"
                        accept="image/*"
                        label="Выбрать новую фотографию"
                        outlined
                    ></v-file-input>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-btn class="success mr-3" @click="changePhoto">Сохранить</v-btn>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
        <v-snackbar right color="default" v-model="snackbar">{{ snacktext }}</v-snackbar>
    </v-row>
</template>

<script>
import * as Users from "@/services/users";
import * as Countries from "@/services/countries";
import * as Regions from "@/services/regions";
import * as Cities from "@/services/cities";

export default {
    data: () => ({
        dialog: false,
        photoDialog: false,
        changed_photo: null,
        snackbar: false,
        snacktext: "",
        searchCity: null,
        searchRegion: null,
        cityName: '',
        regionName: '',
        deleteDialog: {
            show: false,
            user: {}
        },
        options: {
            page: 1,
            itemsPerPage: 10
        },
        total: 0,
        search: "",
        loading: false,
        headers: [
            { text: "Фамилия", value: "lastname" },
            { text: "Имя", value: "firstname" },
            { text: "Отчество", value: "middlename" },
            { text: "Телефон", value: "phone" },
            { text: "Почта", value: "email" },
            { text: "Реферальный код", value: "referral" },
            { text: "Действия", value: "actions" }
        ],
        users: [],
        editedIndex: -1,
        editedItem: {
            firstname: "",
            middlename: "",
            lastname: "",
            phone: "",
            email: "",
            photo: null,
            position: "",
            login: "",
            password: "",
            description: "",
            country_id: "",
            region_id: "",
            city_id: ""
        },
        defaultItem: {
            firstname: "",
            middlename: "",
            lastname: "",
            phone: "",
            email: "",
            photo: null,
            position: "",
            login: "",
            password: "",
            description: "",
            country_id: "",
            region_id: "",
            city_id: ""
        },
        countries: [],
        regions: [],
        cities: []
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1
                ? "Добавить нового пользователя"
                : "Изменить данные пользователя";
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        },

        searchCity: function(val) {
            val && this.getCities(val, this.editedItem.region_id);
        },

        searchRegion: function(val) {
            val && this.getRegions(val, this.editedItem.country_id);
        }
    },

    created() {
        this.filter(this.options);
        this.getCountries();
    },

    methods: {
        filter(options) {
            this.loading = true;
            let { search } = this;
            if (options.page != this.options.page)
                this.options.page = options.page;
            if (search == null) {
                search = "";
                this.search = "";
            }
            Users.search({
                search,
                page: options.page,
                size: options.itemsPerPage
            })
                .then(res => {
                    this.users = res.data.list;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        editItem(item) {
            let data = item;
            this.editedIndex = data.id;
            delete data["referral"];
            delete data["id"];
            this.editedItem = data;
            this.updateGeo();
            this.dialog = true;
        },

        deleteUser(user) {
            this.loading = true;
            Users.del(user.id)
                .then(() => {
                    this.filter(this.options);
                    this.showSnackbar("Пользователь успешно удалён");
                })
                .catch(() => {
                    this.loading = false;
                    this.showSnackbar("Что-то пошло не так");
                });
            this.closeDeleteDialog();
        },

        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
                this.changed_photo = null;
            }, 300);
        },

        save() {
            this.loading = true;
            if (this.editedIndex > -1) {
                if (typeof this.editedItem.country_id !== "undefined" && typeof this.editedItem.country_id.id !== "undefined")
                    this.editedItem.country_id = this.editedItem.country_id.id;
                if (typeof this.editedItem.region_id !== "undefined" && typeof this.editedItem.region_id.id !== "undefined")
                    this.editedItem.region_id = this.editedItem.region_id.id;
                if (typeof this.editedItem.city_id !== "undefined" && typeof this.editedItem.city_id.id !== "undefined")
                    this.editedItem.city_id = this.editedItem.city_id.id;
                Users.edit(this.editedIndex, {
                    lastname: this.editedItem.lastname,
                    firstname: this.editedItem.firstname,
                    middlename: this.editedItem.middlename,
                    email: this.editedItem.email,
                    phone: this.editedItem.phone,
                    position: this.editedItem.position,
                    description: this.editedItem.description,
                    login: this.editedItem.login,
                    country_id: this.editedItem.country_id,
                    region_id: this.editedItem.region_id,
                    city_id: this.editedItem.city_id
                })
                    .then(() => {
                        this.showSnackbar(
                            "Данные пользователя успешно изменены"
                        );
                        this.filter(this.options);
                    })
                    .catch(() => {
                        this.loading = false;
                        this.showSnackbar("Что-то пошло не так");
                    });
            } else {
                const fd = new FormData();
                if (this.changed_photo != null) {
                    fd.append(
                        "photo",
                        this.changed_photo,
                        this.changed_photo.name
                    );
                }
                fd.append("firstname", this.editedItem.firstname);
                fd.append("middlename", this.editedItem.middlename);
                fd.append("phone", this.editedItem.phone);
                fd.append("email", this.editedItem.email);
                fd.append("position", this.editedItem.position);
                fd.append("login", this.editedItem.login);
                fd.append("password", this.editedItem.password);
                fd.append("lastname", this.editedItem.lastname);
                fd.append("description", this.editedItem.description);
                fd.append("country_id", this.editedItem.country_id);
                fd.append("region_id", this.editedItem.region_id);
                fd.append("city_id", this.editedItem.city_id);

                Users.create(fd)
                    .then(() => {
                        this.showSnackbar("Пользователь успешно создан");
                        this.filter(this.options);
                    })
                    .catch(() => {
                        this.loading = false;
                        this.showSnackbar("Что-то пошло не так");
                    });
            }
            this.close();
        },

        closeDeleteDialog() {
            this.deleteDialog = {
                show: false,
                user: {}
            };
        },

        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        },

        changePhoto() {
            const fd = new FormData();
            fd.append("photo", this.changed_photo, this.changed_photo.name);

            Users.edit_mp(this.editedIndex, fd)
                .then(() => {
                    this.photoDialog = false;
                    this.showSnackbar("Данные пользователя успешно изменены");
                    this.dialog = false;
                    this.filter(this.options);
                })
                .catch(() => {
                    this.showSnackbar("Что-то пошло не так");
                });

            this.changed_photo = null;
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

        updateGeo() {
            if (this.editedItem.country_id) {
                if (this.editedItem.region_id) {
                    this.getRegionName();
                    this.getRegions(
                        this.regionName,
                        this.editedItem.country_id
                    );
                    if (this.editedItem.city_id) {
                        this.getCityName();
                        this.getCities(
                            this.cityName,
                            this.editedItem.region_id
                        );
                    } else {
                        this.getCities("", this.editedItem.region_id);
                    }
                } else {
                    this.cities = [];
                    this.getRegions("", this.editedItem.country_id);
                }
            }
        },

        getRegionName(regionID) {
            Regions.getByID(regionID)
                .then(res => {
                    this.regionName = res.data.name_native;
                })
                .catch(() => {});
        },

        getCityName(cityID) {
            Cities.getByID(cityID)
                .then(res => {
                    this.cityName = res.data.name_native;
                })
                .catch(() => {
                });
        },

        updateCountry() {
            this.getRegions("", this.editedItem.country_id);
            this.editedItem.region = null;
            this.editedItem.city = null;
        },

        updateRegion() {
            this.getCities("", this.editedItem.region_id);
            this.editedItem.city = null;
        }
    }
};
</script>