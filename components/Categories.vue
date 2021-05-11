<template>
    <v-row justify="center" class="px-5">
        <v-card outlined width="100%">
            <v-data-table
                :headers="headers"
                :items="categories"
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
                        itemsPerPageText: 'Категорий на странице',
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
                                                    v-model="editedCategory.name_en"
                                                    label="Category"
                                                    outlined
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="editedCategory.name_native"
                                                    label="Категория"
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
                    <v-icon small @click="deleteDialog = { show: true, category: item}">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="deleteDialog.show" width="510" @click:outside="closeDeleteDialog">
            <v-card>
                <v-card-title
                    class="title"
                >Вы уверены, что хотите удалить категорию {{`${deleteDialog.category.name_native} (${deleteDialog.category.name_en})`}}?</v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark color="red" @click="deleteCategory(deleteDialog.category)" class="mb-1">Да</v-btn>
                    <v-btn dark color="default" @click="closeDeleteDialog" class="mr-1 mb-1">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar right color="default" v-model="snackbar">{{ snacktext }}</v-snackbar>
    </v-row>
</template>

<script>
import * as Categories from "@/services/categories";
export default {
    data: () => ({
        dialog: false,
        snackbar: false,
        snacktext: "",
        deleteDialog: {
            show: false,
            category: {}
        },
        options: {
            page: 1,
            itemsPerPage: 10
        },
        total: 0,
        search: "",
        loading: false,
        headers: [
            { text: "Category", value: "name_en" },
            { text: "Категория", value: "name_native" },
            { text: "Действия", value: "actions" }
        ],
        categories: [],
        editedIndex: -1,
        editedCategory: {
            name_en: "",
            name_native: "",
        },
        defaultCategory: {
            name_en: "",
            name_native: "",
        }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1
                ? "Добавить новую категорию"
                : "Изменить категорию";
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
            Categories.get(
                search,
                (options.page - 1) * options.itemsPerPage,
                options.itemsPerPage
            )
                .then(res => {
                    this.categories = res.data.categories;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        editItem(item) {
            this.editedCategory = item;
            this.editedIndex = item.id;
            this.dialog = true;
        },

        deleteCategory(category) {
            this.loading = true;
            Categories.del(category.id)
                .then(() => {
                    this.filter(this.options);
                    this.showSnackbar("Категория успешно удалена");
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
                this.editedCategory = Object.assign({}, this.defaultCategory);
                this.editedIndex = -1;
            }, 300);
        },

        save() {
            this.loading = true;
            if (this.editedIndex > -1) {
                Categories.change({
                    id: this.editedCategory.id,
                    name_native: this.editedCategory.name_native,
                    name_en: this.editedCategory.name_en
                })
                    .then(() => {
                        this.showSnackbar("Категория успешно изменена");
                        this.filter(this.options);
                    })
                    .catch(() => {
                        this.loading = false;
                        this.showSnackbar("Что-то пошло не так");
                    });
            } else {
                Categories.add(
                    this.editedCategory.name_en,
                    this.editedCategory.name_native,
                )
                    .then(() => {
                        this.showSnackbar("Категория успешно добавлена");
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
                category: {}
            };
        },

        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        },
        
    }
};
</script>