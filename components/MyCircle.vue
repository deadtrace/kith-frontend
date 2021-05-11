<template>
    <div class="my-circle-main">
        <div class="breadcrumbs">
            <div
                class="breadcrumb-left"
                @click="$router.push({path: `/user/${$store.getters.userID}`})"
            >Мой профиль</div>
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
            <div class="breadcrumb-right">Мой круг</div>
        </div>
        <div class="circle-container">
            <div class="circle-card">
                <div class="circle-card-left">
                    <div class="buttons">
                        <button
                            :disabled="status === 'friends'"
                            :class="['button', status === 'friends' ? 'active' : '']"
                            @click="status = 'friends'"
                        >Мои друзья</button>
                        <button
                            :disabled="status === 'fams'"
                            :class="['button', status === 'fams' ? 'active' : '']"
                            @click="status = 'fams'"
                        >Знакомые</button>
                        <button
                            :disabled="status === 'requests'"
                            :class="['button', 'requests-button-1', status === 'requests' ? 'active' : '']"
                            @click="status = 'requests'"
                        >Заявки</button>
                        <button
                            v-if="status === 'requests'"
                            disabled
                            :class="['button', 'requests-button-2', status === 'requests' ? 'active' : '']"
                            @click="status = 'requests'"
                        >Заявки</button>
                    </div>
                    <div class="search-line">
                        <div class="input-box">
                            <input
                                class="search-input"
                                type="text"
                                v-model="search"
                                placeholder="Поиск"
                            />
                            <img src="@/assets/search.svg" class="search-icon" />
                            <img
                                src="@/assets/filters.svg"
                                class="filter-icon"
                                v-if="status !== 'requests'"
                                @click="showFilters = !showFilters"
                            />
                        </div>
                    </div>
                    <div class="users-block">
                        <div class="users-block-list">
                            <div v-if="status === 'requests'" class="friend-requests-container">
                                <div
                                    class="friend-requests-name"
                                >Заявок в друзья: {{ requestsCount }}</div>
                            </div>
                            <div
                                v-if="status === 'friends' && !loading && users.length === 0"
                                class="friend-requests-container"
                            >
                                <div class="friend-requests-name">Найдено 0 друзей</div>
                            </div>
                            <div
                                v-if="status === 'fams' && !loading && users.length === 0"
                                class="friend-requests-container"
                            >
                                <div class="friend-requests-name">Найдено 0 знакомых</div>
                            </div>
                            <template v-if="!loading">
                                <div class="user" v-for="user in users" :key="user.id">
                                    <div
                                        class="user-photo clickable"
                                        :style="`background-image: url(${user.photo});`"
                                        @click="$router.push({path: `/user/${user.id}`})"
                                    ></div>
                                    <div class="user-info">
                                        <div class="user-info-upper">
                                            <div
                                                class="user-info-name clickable"
                                                @click="$router.push({path: `/user/${user.id}`})"
                                            >{{ `${user.firstname} ${user.lastname}` }}</div>
                                        </div>
                                        <div class="user-info-lower">
                                            <div class="user-info-position">{{ user.position }}</div>
                                        </div>
                                    </div>
                                    <img
                                        v-if="status === 'friends' "
                                        src="@/assets/deleteUser.svg"
                                        class="delete-button-icon"
                                    />
                                    <button
                                        v-if="status === 'friends' "
                                        class="delete-button white-button"
                                        @click="removeFromFriends(user.id)"
                                    >Убрать из друзей</button>
                                    <div v-if="status === 'requests' " class="request-buttons">
                                        <button
                                            class="white-button"
                                            @click="acceptRequest(index, user.id)"
                                        >Добавить в друзья</button>
                                        <button
                                            class="white-button"
                                            @click="hideRequest(index, user.id)"
                                        >Скрыть</button>
                                    </div>
                                    <div v-if="status === 'requests' " class="request-button-icons">
                                        <img src="@/assets/addUser.svg" class="add-button-icon" />
                                        <img src="@/assets/deleteUser.svg" class="add-button-icon" />
                                    </div>
                                </div>
                                <div
                                    class="users-divider"
                                    v-if="status === 'friends' && search !== ``"
                                ></div>
                                <template v-if="status === 'friends' && search !== ``">
                                    <div class="user" v-for="user in globalUsers" :key="user.id">
                                        <div
                                            class="user-photo clickable"
                                            :style="`background-image: url(${user.photo});`"
                                            @click="$router.push({path: `/user/${user.id}`})"
                                        ></div>
                                        <div class="user-info">
                                            <div class="user-info-upper">
                                                <div
                                                    class="user-info-name clickable"
                                                    @click="$router.push({path: `/user/${user.id}`})"
                                                >{{ `${user.firstname} ${user.lastname}` }}</div>
                                            </div>
                                            <div class="user-info-lower">
                                                <div class="user-info-position">{{ user.position }}</div>
                                            </div>
                                        </div>

                                        <button
                                            v-if="!user.friendship && user.friendship !== 'request' && $store.getters.userID !== user.id"
                                            class="delete-button white-button"
                                            @click="addToFriends(user)"
                                        >Добавить в друзья</button>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <div class="center">
                                    <Loader></Loader>
                                </div>
                            </template>
                        </div>
                        <div class="users-block-requests" v-if="status !== 'requests'">
                            <div class="filter-circle-name">Фильтры поиска</div>
                            <div class="filter-circle-input-slot">
                                <div class="filter-circle-input-slot-label">Страна</div>
                                <multiselect
                                    v-model="country"
                                    :options="countries"
                                    :maxHeight="200"
                                    :showLabels="false"
                                    :internal-search="false"
                                    :showNoResults="false"
                                    label="name_native"
                                    placeholder=""
                                    track-by="id"
                                    @search-change="parseCountryInput"
                                ></multiselect>
                            </div>
                            <div class="filter-circle-input-slot">
                                <div class="filter-circle-input-slot-label">Регион</div>
                                <multiselect
                                    v-model="region"
                                    :options="regions"
                                    :maxHeight="200"
                                    :showLabels="false"
                                    :internal-search="false"
                                    :showNoResults="false"
                                    label="name_native"
                                    track-by="id"
                                    placeholder=""
                                    :disabled="!country"
                                    @search-change="parseRegionInput"
                                ></multiselect>
                            </div>
                            <div class="filter-circle-input-slot">
                                <div class="filter-circle-input-slot-label">Город</div>
                                <multiselect
                                    v-model="city"
                                    :options="cities"
                                    :maxHeight="200"
                                    :showLabels="false"
                                    :internal-search="false"
                                    :showNoResults="false"
                                    label="name_native"
                                    track-by="id"
                                    placeholder=""
                                    :disabled="!region"
                                    @search-change="parseCityInput"
                                ></multiselect>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="circle-card-right">
                    <div class="circle-card-right-button">
                        <button
                            v-if="status !== 'requests'"
                            class="button"
                            @click="status = 'requests'"
                        >Заявки</button>
                    </div>
                    <div class="circle-card-right-search">
                        <span v-if="status !== 'requests'">{{ `Заявок в друзья: ${requestsCount}` }}</span>
                    </div>
                    <div class="circle-card-right-content">
                        <div
                            class="no-requests-container"
                            v-if="status !== 'requests' && !requests"
                        >
                            <img src="@/assets/noRequests.png" class="no-requests" />
                        </div>
                        <template v-if="status !== 'requests'">
                            <template v-if="!requestsLoading">
                                <div
                                    class="request"
                                    v-for="(request, index) in requests"
                                    :key="index"
                                >
                                    <div class="request-user">
                                        <div
                                            class="user-photo"
                                            :style="`background-image: url(${request.photo});`"
                                        ></div>
                                        <div class="user-info">
                                            <div class="user-info-upper">
                                                <div
                                                    class="user-info-name"
                                                >{{ `${request.firstname} ${request.lastname}` }}</div>
                                            </div>
                                            <div class="user-info-lower">
                                                <div
                                                    class="user-info-position"
                                                >{{ request.position }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="new-request-buttons">
                                        <button
                                            class="white-button"
                                            @click="acceptRequest(index, request.id)"
                                        >Добавить в друзья</button>
                                        <button
                                            class="white-button"
                                            @click="hideRequest(index, request.id)"
                                        >Скрыть</button>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="center">
                                    <Loader></Loader>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <transition name="filters">
                <div v-if="showFilters" class="filter-circle">
                    <div class="filter-circle-name">Фильтры поиска</div>
                    <!-- <div class="filter-circle-input-slot">
                        <div class="filter-circle-input-slot-label">Сфера деятельности</div>
                        <input type="text" placeholder="Должность" class="filter-circle-input" />
                    </div>-->
                    <div class="filter-circle-input-slot">
                        <div class="filter-circle-input-slot-label">Страна</div>
                        <multiselect
                                    v-model="country"
                                    :options="countries"
                                    :maxHeight="200"
                                    :showLabels="false"
                                    :internal-search="false"
                                    :showNoResults="false"
                                    label="name_native"
                                    placeholder=""
                                    track-by="id"
                                    @search-change="parseCountryInput"
                                ></multiselect>
                    </div>
                    <div class="filter-circle-input-slot">
                        <div class="filter-circle-input-slot-label">Регион</div>
                        <multiselect
                                    v-model="region"
                                    :options="regions"
                                    :maxHeight="200"
                                    :showLabels="false"
                                    :internal-search="false"
                                    :showNoResults="false"
                                    label="name_native"
                                    track-by="id"
                                    placeholder=""
                                    :disabled="!country"
                                    @search-change="parseRegionInput"
                                ></multiselect>
                    </div>
                    <div class="filter-circle-input-slot">
                        <div class="filter-circle-input-slot-label">Город</div>
                        <multiselect
                                    v-model="city"
                                    :options="cities"
                                    :maxHeight="200"
                                    :showLabels="false"
                                    :internal-search="false"
                                    :showNoResults="false"
                                    label="name_native"
                                    track-by="id"
                                    placeholder=""
                                    :disabled="!region"
                                    @search-change="parseCityInput"
                                ></multiselect>
                    </div>
                    <button class="filter-circle-button" @click="showFilters = !showFilters">Готово</button>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import * as Friends from "@/services/friends";
import Loader from "@/components/Loader";
import * as Cities from "@/services/cities";
import * as Regions from "@/services/regions";
import * as Countries from "@/services/countries";
import * as Users from "@/services/users";
import Multiselect from "vue-multiselect";

export default {
    components: {
        Loader,
        Multiselect
    },
    data: () => ({
        status: "",
        search: "",
        showFilters: false,
        requests: [],
        requestsCount: 0,
        users: [],
        loading: true,
        requestsLoading: true,
        countries: [],
        regions: [],
        cities: [],
        globalUsers: [],
        country: "",
        region: "",
        city: ""
    }),
    methods: {
        getUsers() {
            Users.search({ search: this.search, page: 1, size: 5 })
                .then(res => {
                    this.globalUsers = res.data.list;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при поиске пользователей"
                    );
                });
        },
        getRequests() {
            this.requestsLoading = true;
            Friends.getRequests()
                .then(res => {
                    this.requests = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        this.requests.push(res.data.list[i].user_from);
                    }
                    this.requestsCount = res.data.total;
                    this.requestsLoading = false;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        getFams() {
            this.loading = true;
            Friends.getFams(
                this.search,
                this.country ? this.country.id : '',
                this.region ? this.region.id : '',
                this.city ? this.city.id : ''
            )
                .then(res => {
                    this.users = res.data.list;
                    this.loading = false;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        getFriends() {
            this.loading = true;
            Friends.getFriends(
                this.search,
                this.country ? this.country.id : '',
                this.region ? this.region.id : '',
                this.city ? this.city.id : ''
            )
                .then(res => {
                    this.users = res.data.list;
                    this.loading = false;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        addToFriends(user) {
            Friends.add(user.id)
                .then(() => {
                    // user.friendship = 'request';
                    this.$toast("Заявка успешно отправлена");
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при отправке заявки");
                });
        },
        acceptRequest(index, id) {
            Friends.acceptRequest(id)
                .then(() => {
                    this.$toast("Пользователь успешно добавлен в друзья!");
                    this.status = "friends";
                    this.requests.splice(index);
                    this.requestsCount -= 1;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при добавлении пользователя"
                    );
                });
        },
        hideRequest(index, id) {
            Friends.hideRequest(id)
                .then(() => {
                    this.$toast("Заявка успешно скрыта!");
                    this.requests.splice(index);
                    this.requestsCount -= 1;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при скрытии заявки");
                });
        },
        removeFromFriends(id) {
            Friends.removeFromFriends(id)
                .then(() => {
                    this.$toast("Пользователь успешно удалён!");
                    this.status === "friends"
                        ? this.getFriends()
                        : (this.status = "friends");
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при удалении пользователя из друзей"
                    );
                });
        },
        filterUsers() {
            if (this.status === "friends") {
                this.getFriends();
            } else if (this.status === "fams") {
                this.getFams();
            } else if (this.status === "requests") {
                this.users = this.requests;
            }
        },
        getCities(search) {
            Cities.get(search, this.region.id, 0, 10)
                .then(res => {
                    this.cities = res.data.cities;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке городов");
                });
        },
        getRegions(search) {
            Regions.get(search, this.country.id, 0, 10)
                .then(res => {
                    this.regions = res.data.regions;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке регионов");
                });
        },
        getCountries(search) {
            Countries.get(search, 0, 10)
                .then(res => {
                    this.countries = res.data.countries;
                })
                .catch(() => {
                    this.$toast.error("Произошла ошибка при загрузке стран");
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
    metaInfo: {
        title: "Мой круг"
    },
    created() {
        this.getRequests();
        this.status = "fams";
        this.getCountries("");
    },
    watch: {
        status: function(val) {
            if (val === "friends") {
                this.getFriends();
            } else if (val === "fams") {
                this.getFams();
            } else if (val === "requests") {
                this.users = this.requests;
            }
        },
        search: function(val) {
            this.filterUsers();
            if (val) {
                this.getUsers();
            }
        },
        country: function(val) {
            this.region = "";
            this.city = "";
            if (val) this.getRegions("");
            this.filterUsers();
        },
        region: function(val) {
            this.city = "";
            if (val) this.getCities("");
            this.filterUsers();
        },
        city: function() {
            this.filterUsers();
        }
    }
};
</script>

<style scoped>
.my-circle-main {
    width: 100%;
    max-width: 1280px;
}

.tabber-container {
    padding: 25px;
    display: flex;
    justify-content: center;
}

.tabber {
    max-width: 1280px;
    width: 100%;
}

@media (min-width: 768px) {
    .tabber-container {
        padding: 30px;
    }
}

.circle-container {
    position: relative;
    box-sizing: border-box;
}

.circle-card {
    border-radius: 13px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    max-width: 1280px;
    width: 100%;
    z-index: 1;
    background: white;
}

.circle-card-right {
    display: none;
}

.circle-card-left {
    padding-bottom: 30px;
}

@media (min-width: 1200px) {
    .circle-card {
        display: flex;
        width: 100%;
    }

    .circle-card-right {
        min-width: 388px;
        width: 388px;
        display: initial;
    }

    .circle-card-left {
        width: 100%;
    }
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 9px;
    padding-bottom: 16px;
}

@media (min-width: 768px) {
    .buttons {
        justify-content: flex-start;
        margin-left: 25px;
    }
}

@media (min-width: 1200px) {
    .buttons {
        padding-top: 31px;
        padding-bottom: 31px;
    }
}

.button {
    border-radius: 21px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.1);
    padding: 0px 22px;
    box-sizing: border-box;
    height: 32px;
    color: var(--main-color);
    font-family: Intro;
    font-size: 15px;
    transition-duration: 0.5s;
    margin-top: 9px;
    margin-right: 7px;
}

.button:hover {
    background: var(--main-color);
    color: white;
}

.active {
    background: var(--main-color);
    color: white;
}

.search-line {
    background: var(--main-color);
    padding: 15px 28px;
    box-sizing: border-box;
}

.input-box {
    position: relative;
}

.search-input {
    background: #075e8d;
    width: 100%;
    height: 36px;
    box-sizing: border-box;
    border-radius: 13px;
    padding-left: 40px;
    color: white;
    font-family: Intro;
    font-size: 12px;
}

.search-input::placeholder {
    color: white;
}

.search-icon {
    height: 14px;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: default;
}

.filter-icon {
    height: 18px;
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

@media (min-width: 768px) {
    .filter-icon {
        display: none;
    }

    .circle-container {
        padding: 0px 30px;
        display: flex;
        justify-content: center;
    }

    .buttons-section {
        justify-content: flex-start;
        margin-left: 25px;
    }

    .button {
        margin-top: 0px;
        margin-right: 0px;
        font-size: 18px;
        line-height: 18px;
        height: 39px;
    }

    .button + .button {
        margin-left: 27px;
    }

    .search-input {
        font-weight: 14px;
    }
}

@media (min-width: 1280px) {
    .circle-container {
        padding: 0px;
    }
}

.users-block {
    margin-top: 14px;
    padding: 0px 20px;
}

.users-block-requests {
    display: none;
}

.user {
    border-radius: 6px;
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.1);
    padding: 8px 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    transition-duration: 0.5s;
}

.user + .user {
    margin-top: 12px;
}

.user-photo {
    height: 38px;
    width: 38px;
    border-radius: 19px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    background-size: cover;
    background-position: center;
}

.user-info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.user-info-name {
    font-family: Intro;
    font-size: 12px;
    line-height: 16px;
}

.user-info-position {
    font-family: Intro;
    font-size: 10px;
    line-height: 14px;
}

.user-info-lower {
    margin-top: 2px;
}

@media (min-width: 768px) {
    .user {
        padding: 15px 17px;
    }

    .users-block {
        display: flex;
        width: 100%;
    }

    .users-block-list {
        flex-basis: 75%;
    }

    .users-block-requests {
        display: initial;
        flex-basis: 25%;
        margin-left: 30px;
    }

    .user-photo {
        height: 66px;
        width: 66px;
        border-radius: 33px;
    }

    .user + .user {
        margin-top: 20px;
    }

    .user-info-name {
        font-size: 18px;
        line-height: 24px;
    }

    .user-info-position {
        font-family: Intro;
        font-size: 15px;
        line-height: 20px;
    }

    .user-info-lower {
        margin-top: 5px;
    }
}

.white-button {
    border-radius: 17px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    padding: 0px 18px;
    height: 26px;
    color: var(--main-color);
    font-family: Intro;
    font-size: 11px;
    transition-duration: 0.5s;
}

.white-button:hover {
    background: var(--main-color);
    color: white;
}

.delete-button {
    display: none;
    position: absolute;
    right: 16px;
    bottom: 16px;
}

.delete-button-icon {
    position: absolute;
    height: 15px;
    top: 7px;
    right: 7px;
}

.add-button-icon {
    height: 15px;
}

.request-buttons {
    display: none;
    right: 16px;
    bottom: 16px;
    position: absolute;
}

.request-button-icons {
    right: 9px;
    bottom: 9px;
    position: absolute;
    display: flex;
}

.request-button-icons img + img {
    margin-left: 8px;
}

.request-buttons button + button {
    margin-left: 10px;
}

@media (min-width: 768px) {
    .delete-button-icon {
        display: none;
    }

    .delete-button {
        display: inline;
    }

    .request-buttons {
        display: flex;
    }

    .request-button-icons {
        display: none;
    }
}

.filter-circle {
    position: absolute;
    left: 0px;
    top: 0px;
    background: white;
    width: 100%;
    min-height: 100%;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    border-radius: 13px;
    transition-duration: 1s;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    z-index: 10;
}

@media (min-width: 768px) {
    .filter-circle {
        display: none;
    }
}

.filter-circle-name {
    font-family: Intro;
    font-size: 20px;
    line-height: 27px;
}

.filter-circle-input-slot {
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
    margin-top: 20px;
    position: relative;
}

.filter-circle-input-slot-label {
    font-family: Intro;
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 4px;
}

.filter-circle-input {
    border-radius: 7px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
    height: 45px;
    padding: 0px 20px;
    width: 100%;
}

.filter-circle-button {
    border-radius: 54px;
    box-sizing: border-box;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    background: var(--main-color);
    color: white;
    font-family: Intro;
    font-size: 15px;
    line-height: 20px;
    width: 185px;
    height: 38px;
    margin: 33px auto 0px;
}

@media (min-width: 768px) {
    .filter-circle-name {
        font-size: 16px;
        line-height: 21px;
        margin-bottom: 19px;
    }

    .filter-circle-input-slot {
        margin-top: 10px;
    }

    .filter-circle-input-slot-label {
        font-size: 13px;
        line-height: 17px;
        margin-bottom: 8px;
    }
}

.filters-enter-active,
.filters-leave-active {
    transition: opacity 0.5s;
}

.filters-enter,
.filters-leave-to {
    opacity: 0;
}

.circle-card-right-button {
    height: 101px;
    border-left: 1px solid #c7c7c7;
    display: flex;
    justify-content: center;
    align-items: center;
}

.circle-card-right-search {
    background-color: var(--main-color);
    height: 66px;
    font-family: Intro;
    font-size: 15px;
    line-height: 20px;
    color: #75c2eb;
    display: flex;
    justify-content: center;
    align-items: center;
}

.circle-card-right-content {
    border-left: 1px solid #c7c7c7;
    min-height: calc(100% - 167px);
    padding: 30px;
}

.requests-button-2 {
    display: none;
}

@media (min-width: 1200px) {
    .requests-button-1 {
        display: none;
    }

    .requests-button-2 {
        display: initial;
    }
}

.no-requests-container {
    display: flex;
    justify-content: center;
    padding-top: 45px;
}

.no-requests {
    height: 93px;
}

.request-user {
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.request + .request {
    margin-top: 20px;
}

.request {
    border-radius: 6px;
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.1);
    padding: 14px 16px;
    transition-duration: 0.5s;
}

.new-request-buttons button + button {
    margin-left: 11px;
}

.new-request-buttons {
    margin-top: 18px;
}

.friend-requests-container {
    display: flex;
    justify-content: center;
}

.friend-requests-name {
    font-family: Intro;
    font-size: 12px;
    line-height: 16px;
    color: #75c2eb;
    margin-bottom: 12px;
}

@media (min-width: 768px) {
    .friend-requests-container {
        display: flex;
        justify-content: flex-start;
    }

    .friend-requests-name {
        font-size: 15px;
        line-height: 20px;
        color: #75c2eb;
        margin-bottom: 16px;
    }
}

.filter-circle-input-slot-list {
    position: absolute;
    background: white;
    z-index: 2;
    width: 100%;
    border-radius: 7px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    padding: 10px 0px;
    opacity: 0;
    visibility: hidden;
    transition-duration: 0.1s;
}

.filter-circle-input:focus + .filter-circle-input-slot-list {
    opacity: 1;
    visibility: initial;
}

.filter-circle-input-slot-list-item {
    padding: 5px 20px;
}

.filter-circle-input-slot-list-item:hover {
    cursor: pointer;
    background: var(--main-color);
    color: white;
}

/* BREADCRUMBS_START */

.breadcrumbs {
    display: flex;
    align-items: center;
    margin-left: 0px;
    margin-bottom: 12px;
    margin-left: 27px;
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
        margin-bottom: 20px;
    }
}

.breadcrumb-left {
    font-family: Intro;
    color: #b2b2b2;
    font-size: 15px;
    line-height: 20px;
    cursor: pointer;
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

.users-divider {
    border-bottom: 1px solid #75c2eb;
    margin-bottom: 10px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>