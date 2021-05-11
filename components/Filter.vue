<template>
    <div id="filter">
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
            <div class="center" style="margin-top: 14px;">
                <button class="search-button" @click="$emit('search-boards')">Найти</button>
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
                <div style="width: 100%;"></div>
                <button
                    class="search-button"
                    @click="$emit('search-boards', {search, countryID: country ? country.id : '', regionID: region ? region.id : '', cityID: city ? city.id : '', categoryID: category ? category.id : '' })"
                >Найти</button>
            </div>
        </div>
    </div>
</template>

<script>
import * as Cities from "@/services/cities";
import * as Regions from "@/services/regions";
import * as Countries from "@/services/countries";
import * as Categories from "@/services/categories";
import Multiselect from "vue-multiselect";

export default {
    data: () => ({
        category: "",
        search: "",
        countries: [],
        regions: [],
        cities: [],
        categories: [],
        country: "",
        region: "",
        city: ""
    }),
    components: {
        Multiselect
    },
    watch: {
        country: function(val) {
            this.region = "";
            this.city = "";
            if (val) this.getRegions("");
        },
        region: function(val) {
            this.city = "";
            if (val) this.getCities("");
        }
    },
    methods: {
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
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке категорий"
                    );
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
        this.getCountries("");
        this.getCategories();
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

#filter {
    background-color: var(--main-color);
    padding: 15px;
    box-sizing: border-box;
    width: 100%;
    border-radius: 6px;
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

/* @media (min-width: 1280px) {
    #filter {
        border-radius: 6px;
    }
} */

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
    transition-duration: 0.5s;
    visibility: hidden;
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
    z-index: 1000;
    position: relative;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>