<template>
    <div class="ads">
        <div class="header">
            <div class="header-sm">
                <div class="input-container category-input-container">
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
                <div class="input-container geography geography-country">
                    <multiselect
                        v-model="country"
                        :options="countries"
                        :maxHeight="200"
                        :showLabels="false"
                        :internal-search="false"
                        :showNoResults="false"
                        label="name_native"
                        track-by="id"
                        placeholder="Страна"
                        @search-change="parseCountryInput"
                    ></multiselect>
                </div>
                <div class="input-container geography geography-region">
                    <multiselect
                        v-model="region"
                        :options="regions"
                        :maxHeight="200"
                        :showLabels="false"
                        :internal-search="false"
                        :showNoResults="false"
                        label="name_native"
                        track-by="id"
                        placeholder="Регион"
                        :disabled="!country"
                        @search-change="parseRegionInput"
                    ></multiselect>
                </div>
                <div class="input-container geography geography-city">
                    <multiselect
                        v-model="city"
                        :options="cities"
                        :maxHeight="200"
                        :showLabels="false"
                        :internal-search="false"
                        :showNoResults="false"
                        label="name_native"
                        track-by="id"
                        placeholder="Город"
                        :disabled="!region"
                        @search-change="parseCityInput"
                    ></multiselect>
                </div>
                <div class="input-container search-container">
                    <input
                        type="text"
                        class="header-input search-input"
                        placeholder="Поиск"
                        v-model="search"
                    />
                    <img src="@/assets/search.svg" class="select-arrow" />
                </div>
                <div class="sort-line">
                    <!-- <span class="sort-name">Сортировка</span>
                    <div class="clickable">
                        <span class="sort-option">По дате</span>
                        <img src="@/assets/arrowWhite.svg" />
                    </div>-->
                </div>
            </div>
            <div class="header-md">
                <div class="header-upper-line">
                    <div class="header-upper-inputs">
                        <div class="input-container category-input-container">
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
                        <div class="input-container search-container">
                            <input
                                type="text"
                                class="header-input search-input"
                                placeholder="Поиск"
                                v-model="search"
                            />
                            <img src="@/assets/search.svg" class="select-arrow" />
                        </div>
                    </div>
                    <div class="sort-line">
                        <!-- <span class="sort-name">Сортировка</span>
                        <div class="clickable">
                            <span class="sort-option">По дате</span>
                            <img src="@/assets/arrowWhite.svg" />
                        </div>-->
                    </div>
                </div>
                <div class="header-lower-line">
                    <div class="input-container input-container-country">
                        <multiselect
                            v-model="country"
                            :options="countries"
                            :maxHeight="200"
                            :showLabels="false"
                            :internal-search="false"
                            :showNoResults="false"
                            label="name_native"
                            track-by="id"
                            placeholder="Страна"
                            @search-change="parseCountryInput"
                        ></multiselect>
                    </div>
                    <div class="input-container input-container-region">
                        <multiselect
                            v-model="region"
                            :options="regions"
                            :maxHeight="200"
                            :showLabels="false"
                            :internal-search="false"
                            :showNoResults="false"
                            label="name_native"
                            track-by="id"
                            placeholder="Регион"
                            :disabled="!country"
                            @search-change="parseRegionInput"
                        ></multiselect>
                    </div>
                    <div class="input-container input-container-city">
                        <multiselect
                            v-model="city"
                            :options="cities"
                            :maxHeight="200"
                            :showLabels="false"
                            :internal-search="false"
                            :showNoResults="false"
                            label="name_native"
                            track-by="id"
                            placeholder="Город"
                            :disabled="!region"
                            @search-change="parseCityInput"
                        ></multiselect>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!loading" class="cards">
            <Card
                v-for="board in boards"
                :key="board.board_id"
                class="card"
                :board="board"
                :status="status"
                @needToUpdate="filter"
            ></Card>
            <template v-if="boards.length % 4 !== 0">
                <div v-for="i in (4 - (boards.length % 4))" :key="i" style="width: 280px;"></div>
            </template>
        </div>
        <div v-else style="height: 300px;" class="center">
            <Loader></Loader>
        </div>
        <div v-if="boards.length === 0 && !loading" class="no-ads-info">Объявлений не найдено</div>
        <pagination
            @change-page="parsePageChange"
            :current="currentPage"
            :total="total"
            :perPage="perPage"
            style="margin-top: 50px;"
        ></pagination>
    </div>
</template>

<script>
import Card from "@/components/ads/SmallAd";
import * as Boards from "@/services/boards";
import Loader from "@/components/Loader";
import pagination from "@/components/Pagination";
import * as Cities from "@/services/cities";
import * as Regions from "@/services/regions";
import * as Countries from "@/services/countries";
import * as Categories from "@/services/categories";
import Multiselect from "vue-multiselect";

export default {
    data: () => ({
        initial: {
            country: false,
            region: false,
            city: false
        },
        status: "mine",
        category: "",
        country: "",
        region: "",
        city: "",
        search: "",
        boards: [],
        loading: true,
        currentPage: 1,
        total: 0,
        perPage: 12,
        countries: [],
        regions: [],
        cities: [],
        categories: []
    }),
    metaInfo: {
        title: "Главная"
    },
    components: {
        Card,
        Loader,
        pagination,
        Multiselect
    },
    methods: {
        getBoards() {
            if (this.$store.getters.userID) {
                Boards.getMainBoards(
                this.perPage,
                (this.currentPage - 1) * this.perPage,
                this.search,
                this.country ? this.country.id : "",
                this.region ? this.region.id : "",
                this.city ? this.city.id : "",
                this.category ? this.category.id : ""
            )
                .then(res => {
                    this.boards = res.data.boards;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке объявлений"
                    );
                });
            } else {
                Boards.getMainBoardsWithoutToken(
                this.perPage,
                (this.currentPage - 1) * this.perPage,
                this.search,
                this.country ? this.country.id : "",
                this.region ? this.region.id : "",
                this.city ? this.city.id : "",
                this.category ? this.category.id : ""
            )
                .then(res => {
                    this.boards = res.data.boards;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке объявлений"
                    );
                });
            }
        },
        filter() {
            this.loading = true;
            this.getBoards();
        },
        parsePageChange(page) {
            this.currentPage = page;
            this.filter();
        },
        getCities(search) {
            Cities.get(search, this.region.id, 0, 5)
                .then(res => {
                    this.cities = res.data.cities;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке городов");
                });
        },
        getRegions(search) {
            Regions.get(search, this.country.id, 0, 5)
                .then(res => {
                    this.regions = res.data.regions;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке регионов");
                });
        },
        getCountries(search) {
            Countries.get(search, 0, 5)
                .then(res => {
                    this.countries = res.data.countries;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке стран");
                });
        },
        getCategories() {
            Categories.get("", 0, 100)
                .then(res => {
                    this.categories = res.data.categories;
                    if (this.$route.query.category) {
                        let current = this.categories.find(
                            category =>
                                category.id == this.$route.query.category
                        );
                        this.category = current;
                    }
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке категорий"
                    );
                });
        },
        setQueryCountry() {
            Countries.getByID(this.queryCountry)
                .then(res => {
                    this.initial.country = true;
                    this.country = res.data;
                    this.getRegions('');
                })
                .catch(() => {
                    this.$error("Произошла ошибка при подгрузке страны");
                });
        },
        setQueryRegion() {
            Regions.getByID(this.queryRegion)
                .then(res => {
                    this.initial.region = true;
                    this.region = res.data;
                    this.getCities('');
                })
                .catch(() => {
                    this.$error("Произошла ошибка при подгрузке региона");
                });
        },
        setQueryCity() {
            Cities.getByID(this.queryCity)
                .then(res => {
                    this.city = res.data;
                })
                .catch(() => {
                    this.$error("Произошла ошибка при подгрузке города");
                });
        },
        parseCountryInput(value) {
            this.getCountries(value);
        },
        parseRegionInput(value) {
            this.getRegions(value);
        },
        parseCityInput(value) {
            this.getCities(value);
        }
    },
    created() {
        if (!this.querySearch && !this.queryCategory && !this.queryCountry) {
            this.filter();
        }
        this.getCountries("");
        this.getCategories();
        if (this.querySearch) {
            this.search = this.querySearch;
        }
        if (this.queryCountry) {
            this.setQueryCountry();
        }
        if (this.queryRegion) {
            this.setQueryRegion();
        }
        if (this.queryCity) {
            this.setQueryCity();
        }
    },
    watch: {
        search: function() {
            this.currentPage = 1;
            this.filter();
        },
        queryCategory: function() {
            if (this.$route.query.category) {
                let current = this.categories.find(
                    category => category.id == this.$route.query.category
                );
                this.setCategory(current);
                this.category = current;
            }
        },
        category: function() {
            this.filter();
        },
        country: function(val) {
            if (!this.initial.country) {
                this.region = "";
                this.city = "";
                if (val) this.getRegions("");
            } else {
                this.initial.country = false;
            }
            this.filter();
        },
        region: function(val) {
            if (!this.initial.region) {
                this.city = "";
                if (val) this.getCities("");
            } else {
                this.initial.region = false;
            }
            this.filter();
        },
        city: function() {
            this.filter();
        }
    },
    computed: {
        queryCategory() {
            return this.$route.query.category;
        },
        querySearch() {
            return this.$route.query.search;
        },
        queryCountry() {
            return this.$route.query.country;
        },
        queryRegion() {
            return this.$route.query.region;
        },
        queryCity() {
            return this.$route.query.city;
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.ads {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 1280px;
}

.header {
    background-color: var(--main-color);
    padding: 15px;
    box-sizing: border-box;
    width: 100%;
}

.input-container {
    position: relative;
    width: fit-content;
}

.header-input {
    background-color: #075e8d;
    padding: 8px 40px 8px 20px;
    color: white;
    height: 36px;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 16px;
}

.input-container + .input-container {
    margin-top: 13px;
}

.select-arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
}

input::placeholder {
    color: white;
    opacity: 0.5;
}

.category-input {
    width: 160px;
}

.country-input {
    width: 140px;
}

.region-input {
    width: 220px;
}

.city-input {
    width: 200px;
}

.search-container,
.search-input {
    width: 100%;
}

.sort-line {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: white;
    margin-top: 14px;
}

.sort-name {
    font-family: Intro Light;
    margin-right: 19px;
}

.sort-option {
    margin-right: 12px;
}

.header-md {
    display: none;
    padding: 0px 20px;
    box-sizing: border-box;
}

@media (min-width: 768px) {
    .header-sm {
        display: none;
    }

    .header-md {
        display: block;
    }

    .header-input {
        border-radius: 0px;
    }

    .category-input {
        border-radius: 10px 0px 0px 10px;
    }

    .header-upper-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-upper-inputs {
        display: flex;
    }

    .search-container {
        width: 313px;
        border-left: 1px solid var(--main-color);
    }

    .input-container + .input-container {
        margin-top: 0px;
    }

    .sort-line {
        margin-top: 0px;
    }

    .search-input {
        border-radius: 0px 10px 10px 0px;
    }

    .header-lower-line {
        display: flex;
        margin-top: 10px;
    }

    .country-input {
        border-radius: 10px 0px 0px 10px;
        border-right: 1px solid var(--main-color);
    }

    .city-input {
        border-radius: 0px 10px 10px 0px;
        border-left: 1px solid var(--main-color);
    }
}

@media (min-width: 1280px) {
    .header {
        border-radius: 6px;
    }
}

.button {
    padding: 8px 23px;
    font-size: 18px;
    color: var(--main-color);
    border-radius: 31px;
    border: none;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
    background-color: white;
    transition-duration: 0.5s;
    margin-top: 15px;
}

.button:hover {
    background-color: var(--main-color);
    color: white;
}

.clicked {
    background-color: var(--main-color);
    color: white;
}

.buttons {
    margin-top: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0px 10px;
}

.button + .button {
    margin-left: 25px;
}

@media (min-width: 768px) {
    .buttons {
        justify-content: flex-start;
        padding: 0px 35px;
    }
}

@media (min-width: 1280px) {
    .buttons {
        padding: 0px;
    }
}

.cards {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
    margin-top: 30px;
}

@media (min-width: 768px) {
    .cards {
        margin-top: 60px;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-around;
        flex-wrap: wrap;
        padding: 0px 10px;
        gap: 10px;
        margin-top: 17px;
    }

    .card {
        margin-top: 13px;
    }
}

@media (min-width: 1280px) {
    .cards {
        max-width: 1280px;
        padding: 0px;
        justify-content: space-between;
    }
}

.no-ads-info {
    color: var(--main-color);
    font-size: 20px;
    margin-top: 30px;
}

.input-select {
    position: absolute;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 18px 0px;
    width: 100%;
    background-color: #075e8d;
    color: white;
    top: calc(100% + 2px);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition-duration: 0.5s;
}

/* #country--input:focus + .input-select,
#region--input:focus + .input-select,
#city--input:focus + .input-select,
#category--input:focus + .input-select {
    opacity: 1;
    visibility: initial;
} */

.header-input:focus + .input-select {
    opacity: 1;
    visibility: visible;
}

.input-select-item {
    padding: 5px 10px;
    cursor: pointer;
}

.input-select-item:hover {
    background-color: white;
    color: var(--main-color);
}

.category-select {
    max-height: 200px;
    overflow-y: scroll;
}

.search-button {
    background-color: #075e8d;
    padding: 8px 20px;
    color: white;
    height: 36px;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 16px;
    justify-content: center;
}

.category-input-container {
    min-width: 220px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>