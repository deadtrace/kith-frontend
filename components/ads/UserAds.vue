<template>
    <div class="ads-container">
        <div class="breadcrumbs">
            <template v-if="username">
                <div
                    class="breadcrumb-left"
                    @click="$router.push({path: `/user/${$route.params.user_id}`})"
                >{{ username}}</div>
            </template>
            <svg
                class="breadcrumb-separator"
                xmlns="http://www.w3.org/2000/svg"
                width="7.828"
                viewBox="0 0 7.828 12.828"
            >
                <g
                    id="Group_356"
                    data-name="Group 356"
                    transform="translate(-167.086 490.914) rotate(-90)"
                >
                    <line
                        id="Line_57"
                        data-name="Line 57"
                        x2="5"
                        y2="5"
                        transform="translate(479.5 168.5)"
                        fill="none"
                        stroke="#686868"
                        stroke-linecap="round"
                        stroke-width="2"
                    />
                    <line
                        id="Line_58"
                        data-name="Line 58"
                        x1="5"
                        y2="5"
                        transform="translate(484.5 168.5)"
                        fill="none"
                        stroke="#686868"
                        stroke-linecap="round"
                        stroke-width="2"
                    />
                </g>
            </svg>
            <div class="breadcrumb-right">Объявления</div>
        </div>
        <div class="ads">
        <!-- <div class="header">
            <div class="header-sm">
                <div class="input-container">
                    <input
                        type="text"
                        class="header-input category-input"
                        placeholder="Категория"
                        v-model="category"
                        disabled
                    />
                    <img src="@/assets/arrowWhite.svg" class="select-arrow" />
                </div>
                <div class="input-container">
                    <input
                        type="text"
                        class="header-input country-input"
                        placeholder="Страна"
                        v-model="countryName"
                    />
                    <img src="@/assets/arrowWhite.svg" class="select-arrow" />
                </div>
                <div class="input-container">
                    <input
                        type="text"
                        class="header-input region-input"
                        placeholder="Регион"
                        v-model="regionName"
                    />
                    <img src="@/assets/arrowWhite.svg" class="select-arrow" />
                </div>
                <div class="input-container">
                    <input
                        type="text"
                        class="header-input city-input"
                        placeholder="Город"
                        v-model="cityName"
                    />
                    <img src="@/assets/arrowWhite.svg" class="select-arrow" />
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
                    <span class="sort-name">Сортировка</span>
                    <div class="clickable">
                        <span class="sort-option">По дате</span>
                        <img src="@/assets/arrowWhite.svg" />
                    </div>
                </div>
            </div>
            <div class="header-md">
                <div class="header-upper-line">
                    <div class="header-upper-inputs">
                        <div class="input-container">
                            <input
                                type="text"
                                class="header-input category-input"
                                placeholder="Категория"
                                v-model="category"
                                disabled
                            />
                            <img src="@/assets/arrowWhite.svg" class="select-arrow" />
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
                        <span class="sort-name">Сортировка</span>
                        <div class="clickable">
                            <span class="sort-option">По дате</span>
                            <img src="@/assets/arrowWhite.svg" />
                        </div>
                    </div>
                </div>
                <div class="header-lower-line">
                    <div class="input-container">
                        <input
                            type="text"
                            class="header-input country-input"
                            placeholder="Страна"
                            v-model="countryName"
                            @change="getCountries"
                            @blur="checkCountry"
                        />
                        <img src="@/assets/arrowWhite.svg" class="select-arrow" />
                        <div class="input-select">
                            <div
                                class="input-select-item"
                                v-for="country in countries"
                                :key="country.id"
                                @click="setCountry(country)"
                            >{{ country.name_native }}</div>
                        </div>
                    </div>
                    <div class="input-container">
                        <input
                            type="text"
                            class="header-input region-input"
                            placeholder="Регион"
                            v-model="regionName"
                        />
                        <img src="@/assets/arrowWhite.svg" class="select-arrow" />
                    </div>
                    <div class="input-container">
                        <input
                            type="text"
                            class="header-input city-input"
                            placeholder="Город"
                            v-model="cityName"
                        />
                        <img src="@/assets/arrowWhite.svg" class="select-arrow" />
                    </div>
                </div>
            </div>
        </div>-->
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
import * as User from "@/services/users";

export default {
    data: () => ({
        category: "",
        search: "",
        status: "mine",
        boards: [],
        loading: true,
        currentPage: 1,
        total: 0,
        perPage: 12,
        countries: [],
        regions: [],
        cities: [],
        countryID: "",
        regionID: "",
        cityID: "",
        countryName: "",
        regionName: "",
        cityName: "",
        username: ""
    }),
    metaInfo: {
        title: "Объявления"
    },
    components: {
        Card,
        Loader,
        pagination
    },
    methods: {
        getBoards() {
            Boards.getUserBoardsById(
                this.perPage,
                (this.currentPage - 1) * this.perPage,
                this.search,
                this.$route.params.user_id
            )
                .then(res => {
                    this.boards = res.data.boards;
                    this.total = res.data.total;
                    this.loading = false;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error(
                              "Произошла ошибка при загрузке данных"
                          );
                });
        },
        filter() {
            this.loading = true;
            this.getBoards();
        },
        parsePageChange(page) {
            this.currentPage = page;
            this.filter();
        },
        getCities() {
            if (this.regionID) {
                Cities.get(this.cityName, this.regionID, 0, 10)
                    .then(res => {
                        this.cities = res.data.cities;
                    })
                    .catch(() => {
                        this.$toast.error(
                            "Произошла ошибка при загрузке городов"
                        );
                    });
            }
        },
        getRegions() {
            if (this.countryID) {
                Regions.get(this.regionName, this.countryID, 0, 10)
                    .then(res => {
                        this.regions = res.data.regions;
                    })
                    .catch(() => {
                        this.$toast.error(
                            "Произошла ошибка при загрузке регионов"
                        );
                    });
            }
        },
        getCountries() {
            Countries.get(this.countryName, 0, 10)
                .then(res => {
                    this.countries = res.data.countries;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке стран");
                });
        },
        setCountry(country) {
            this.countryID = country.id;
            this.countryName = country.name_native;
            this.getRegions();
            this.filter();
        },
        checkCountry() {
            setTimeout(() => {
                for (let i = 0; i < this.countries.length; i++) {
                    if (
                        this.countryName.toLowerCase() ===
                        this.countries[i].name_native.toLowerCase()
                    ) {
                        this.setCountry(this.countries[i]);
                        return;
                    }
                }
                this.countryName = "";
                this.countryID = "";
                this.regionName = "";
                this.regionID = "";
                this.cityName = "";
                this.cityID = "";
                this.filter();
            }, 100);
        },
        setRegion(region) {
            this.regionID = region.id;
            this.regionName = region.name_native;
            this.getCities();
            this.filter();
        },
        checkRegion() {
            setTimeout(() => {
                for (let i = 0; i < this.regions.length; i++) {
                    if (
                        this.regionName.toLowerCase() ===
                        this.regions[i].name_native.toLowerCase()
                    ) {
                        this.setRegion(this.regions[i]);
                        return;
                    }
                }
                this.regionName = "";
                this.regionID = "";
                this.cityName = "";
                this.cityID = "";
                this.filter();
            }, 100);
        },
        setCity(city) {
            this.cityID = city.id;
            this.cityName = city.name_native;
            this.filter();
        },
        checkCity() {
            setTimeout(() => {
                for (let i = 0; i < this.cities.length; i++) {
                    if (
                        this.cityName.toLowerCase() ===
                        this.cities[i].name_native.toLowerCase()
                    ) {
                        this.setCity(this.cities[i]);
                        return;
                    }
                }
                this.cityName = "";
                this.cityID = "";
                this.filter();
            }, 100);
        },
        getUserInfo() {
            User.get(this.$route.params.user_id)
                .then(res => {
                    this.username = `${res.data.firstname} ${res.data.lastname}`;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке данных пользователя"
                    );
                });
        }
    },
    created() {
        this.filter();
        this.getCountries();
        this.getUserInfo();
    },
    watch: {
        search: function() {
            this.currentPage = 1;
            this.filter();
        },
        countryName: function() {
            this.getCountries();
        },
        regionName: function() {
            this.getRegions();
        },
        cityName: function() {
            this.getCities();
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.ads-container {
    max-width: 1280px;
    width: 100%;
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
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-around;
        padding: 0px 50px;
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
    z-index: 10;
    width: 100%;
    background-color: #075e8d;
    color: white;
    visibility: hidden;
    opacity: 0;
    top: calc(100% + 2px);
}

.header-input:focus ~ .input-select {
    visibility: initial;
    opacity: 0.95;
}

/* BREADCRUMBS_START */

.breadcrumbs {
    display: flex;
    align-items: center;
    margin-left: 27px;
    margin-bottom: 12px;
}

@media (min-width: 768px) {
    .breadcrumbs {
        margin-left: 36px;
        margin-bottom: 15px;
    }
}

@media (min-width: 1280px) {
    .breadcrumbs {
        margin-left: 0px;
        margin-bottom: 0px;
    }
}

.breadcrumb-left {
    font-family: Intro;
    color: #b2b2b2;
    font-size: 15px;
    line-height: 20px;
    cursor: pointer;
    width: max-content;
}

.breadcrumb-right {
    font-size: 15px;
    line-height: 20px;
    color: #7a7a7a;
    font-family: Intro;
}

.breadcrumb-separator {
    margin-left: 14px;
    margin-right: 14px;
    height: 12px;
}

@media (min-width: 768px) {
    .breadcrumb-right,
    .breadcrumb-left {
        font-size: 20px;
        line-height: 27px;
    }

    .breadcrumb-separator {
        margin-left: 19px;
        margin-right: 19px;
        height: 20px;
    }
}

@media (min-width: 1280px) {
    .breadcrumb-right,
    .breadcrumb-left {
        font-size: 24px;
        line-height: 32px;
    }

    .breadcrumb-separator {
        margin-left: 21px;
        margin-right: 21px;
        height: 21px;
    }
}

/* BREADCRUMBS_END */
</style>