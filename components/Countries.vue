<template>
    <v-row justify="center" class="px-5">
        <v-card outlined width="100%">
            <v-data-table
                :headers="headers"
                :items="countries"
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
                        itemsPerPageText: 'Стран на странице',
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
                                    <v-icon right dark>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="title">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row justify="center">
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedCountry.name_en"
                                                    label="Country name"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedCountry.name_native"
                                                    label="Страна"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedCountry.phone_code"
                                                    label="Телефонный код"
                                                    outlined
                                                ></v-text-field>
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
                    <v-icon small @click="deleteDialog = { show: true, country: item}">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="deleteDialog.show" width="510" @click:outside="closeDeleteDialog">
            <v-card>
                <v-card-title
                    class="title"
                >Вы уверены, что хотите удалить страну {{`${deleteDialog.country.name_native} (${deleteDialog.country.name_en})`}}?</v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark color="red" @click="deleteCountry(deleteDialog.country)" class="mb-1">Да</v-btn>
                    <v-btn dark color="default" @click="closeDeleteDialog" class="mr-1 mb-1">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar right color="default" v-model="snackbar">{{ snacktext }}</v-snackbar>
    </v-row>
</template>

<script>
import * as Countries from "@/services/countries";
export default {
    data: () => ({
        dialog: false,
        snackbar: false,
        snacktext: "",
        deleteDialog: {
            show: false,
            country: {}
        },
        options: {
            page: 1,
            itemsPerPage: 10
        },
        total: 0,
        search: "",
        loading: false,
        headers: [
            { text: "Country", value: "name_en" },
            { text: "Страна", value: "name_native" },
            { text: "Телефонный код", value: "phone_code" },
            { text: "Действия", value: "actions" }
        ],
        countries: [],
        editedIndex: -1,
        editedCountry: {
            name_en: "",
            name_native: "",
            phone_code: ""
        },
        defaultCountry: {
            name_en: "",
            name_native: "",
            phone_code: ""
        }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1
                ? "Добавить новую страну"
                : "Изменить данные страны";
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    created() {
        this.filter(this.options);
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
            Countries.get(
                search,
                (options.page - 1) * options.itemsPerPage,
                options.itemsPerPage
            )
                .then(res => {
                    this.countries = res.data.countries;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        editItem(item) {
            this.editedCountry = item;
            this.editedIndex = item.id;
            this.dialog = true;
        },

        deleteCountry(country) {
            this.loading = true;
            Countries.del(country.id)
                .then(() => {
                    this.filter(this.options);
                    this.showSnackbar("Страна успешно удалена");
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
                this.editedCountry = Object.assign({}, this.defaultCountry);
                this.editedIndex = -1;
            }, 300);
        },

        save() {
            this.loading = true;
            if (this.editedIndex > -1) {
                Countries.change(this.editedCountry)
                    .then(() => {
                        this.showSnackbar("Данные страны успешно изменены");
                        this.filter(this.options);
                    })
                    .catch(() => {
                        this.loading = false;
                        this.showSnackbar("Что-то пошло не так");
                    });
            } else {
                Countries.add(
                    this.editedCountry.name_en,
                    this.editedCountry.name_native,
                    this.editedCountry.phone_code
                )
                    .then(() => {
                        this.showSnackbar("Страна успешно создана");
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
                country: {}
            };
        },

        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        }
    }
};
</script>