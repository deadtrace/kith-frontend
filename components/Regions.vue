<template>
    <div>
        <v-row class="px-5">
            <v-select
                :items="countries"
                label="Выберите страну"
                outlined
                item-text="name_native"
                item-value="id"
                v-model="select"
                @change="filter"
            ></v-select>
        </v-row>
        <v-row justify="center" class="px-5">
            <v-card outlined width="100%">
                <v-data-table
                    :headers="headers"
                    :items="regions"
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
                        itemsPerPageText: 'Регионов на странице',
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
                                                        v-model="editedRegion.name_en"
                                                        label="Region"
                                                        outlined
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="editedRegion.name_native"
                                                        label="Регион"
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
                        <v-icon
                            small
                            @click="deleteDialog = { show: true, region: item}"
                        >mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card>
            <v-dialog v-model="deleteDialog.show" width="510" @click:outside="closeDeleteDialog">
                <v-card>
                    <v-card-title
                        class="title"
                    >Вы уверены, что хотите удалить регион {{`${deleteDialog.region.name_native} (${deleteDialog.region.name_en})`}}?</v-card-title>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            dark
                            color="red"
                            @click="deleteRegion(deleteDialog.region)"
                            class="mb-1"
                        >Да</v-btn>
                        <v-btn dark color="default" @click="closeDeleteDialog" class="mr-1 mb-1">Нет</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar right color="default" v-model="snackbar">{{ snacktext }}</v-snackbar>
        </v-row>
    </div>
</template>

<script>
import * as Countries from "@/services/countries";
import * as Regions from "@/services/regions";

export default {
    data: () => ({
        dialog: false,
        snackbar: false,
        snacktext: "",
        deleteDialog: {
            show: false,
            region: {}
        },
        options: {
            page: 1,
            itemsPerPage: 10
        },
        total: 0,
        search: "",
        loading: false,
        headers: [
            { text: "Region", value: "name_en" },
            { text: "Регион", value: "name_native" },
            { text: "Действия", value: "actions" }
        ],
        countries: [],
        regions: [],
        select: 1,
        editedIndex: -1,
        editedRegion: {
            name_en: "",
            name_native: ""
        },
        defaultRegion: {
            name_en: "",
            name_native: ""
        }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1
                ? "Добавить новый регион"
                : "Изменить данные региона";
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    created() {
        this.getCountries();
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
            Regions.get(
                search,
                this.select,
                (options.page - 1) * options.itemsPerPage,
                options.itemsPerPage
            )
                .then(res => {
                    this.regions = res.data.regions;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        editItem(item) {
            this.editedRegion = item;
            this.editedIndex = item.id;
            this.dialog = true;
        },

        deleteRegion(region) {
            this.loading = true;
            Regions.del(region.id)
                .then(() => {
                    this.filter(this.options);
                    this.showSnackbar("Регион успешно удалён");
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
                this.editedRegion = Object.assign({}, this.defaultRegion);
                this.editedIndex = -1;
            }, 300);
        },

        save() {
            this.loading = true;
            if (this.editedIndex > -1) {
                Regions.change(this.editedRegion)
                    .then(() => {
                        this.showSnackbar("Данные региона успешно изменены");
                        this.filter(this.options);
                    })
                    .catch(() => {
                        this.loading = false;
                        this.showSnackbar("Что-то пошло не так");
                    });
            } else {
                Regions.add(
                    this.editedRegion.name_en,
                    this.editedRegion.name_native,
                    this.select
                )
                    .then(() => {
                        this.showSnackbar("Регион успешно добавлен");
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
                region: {}
            };
        },

        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        },

        getCountries() {
            Countries.get("", 0, 500)
                .then(res => {
                    this.countries = res.data.countries;
                })
                .catch(() => {
                    this.showSnackbar("Что-то пошло не так");
                });
        }
    }
};
</script>