<template>
    <div v-if="loaded" class="settings-card">
        <div class="card-heading">Редактирование профиля</div>
        <div class="input-box">
            <div class="input-slot">
                <input type="text" v-model="$v.firstname.$model" placeholder="Имя" />
                <img v-if="$v.firstname.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
        </div>
        <div class="input-box">
            <div class="input-slot">
                <input type="text" v-model="$v.lastname.$model" placeholder="Фамилия" />
                <img v-if="$v.lastname.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
        </div>
        <div class="input-box">
            <input type="text" v-model="middlename" placeholder="Отчество" />
        </div>
        <div class="input-box geography">
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
        <div class="input-box geography">
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
        <div class="input-box geography">
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
        <div class="position-input-box">
            <input type="text" v-model="position" placeholder="Сфера деятельности" />
        </div>
        <div class="input-box-choice">
            <div class="input-slot">
                <input type="text" v-model="$v.phone.$model" placeholder="Телефон" />
                <img v-if="$v.phone.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
            <div class="choice">
                Показывать:
                <span class="choice-select">Всем</span>
            </div>
        </div>
        <div class="input-box-choice">
            <div class="input-slot">
                <input type="text" v-model="$v.email.$model" placeholder="Электронная почта" />
                <img v-if="$v.email.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
            <div class="choice">
                Показывать:
                <span class="choice-select">Всем</span>
            </div>
        </div>
        <div class="input-box login-box">
            <div class="input-slot">
                <input type="text" v-model="$v.login.$model" placeholder="Логин" />
                <img v-if="$v.login.$error" src="@/assets/incorrect.svg" class="incorrect-icon" />
            </div>
        </div>
        <div class="input-box">
            <div class="password-box">
                <input type="text" disabled v-model="password" />
                <img
                    class="edit-icon"
                    src="@/assets/pencil.png"
                    @click="$router.push({ name: 'passwordChange' })"
                    alt
                />
            </div>
        </div>
        <div class="referral-box">
            <div class="referral-name">Ваш реферальный код</div>
            <div class="password-box">
                <input type="text" v-model="referral" disabled />
                <img src="@/assets/dollarPencil.png" class="edit-paying-icon" />
            </div>
        </div>
        <div class="card-bottom">
            <button class="save-button" @click="submitForm">Сохранить</button>
        </div>
    </div>
    <div v-else class="loader-container">
        <Loader></Loader>
    </div>
</template>

<script>
import * as Users from "@/services/users";
import * as Countries from "@/services/countries";
import * as Regions from "@/services/regions";
import * as Cities from "@/services/cities";
import {
    required,
    minLength,
    maxLength,
    email
} from "vuelidate/lib/validators";
import Loader from "@/components/Loader.vue";
import Multiselect from "vue-multiselect";

export default {
    data: () => ({
        initial: {
            country: "",
            region: "",
            city: ""
        },
        position: "",
        phone: "",
        email: "",
        login: "",
        referral: "",
        password: "********",
        countryID: null,
        regionID: null,
        cityID: null,
        countries: [],
        regions: [],
        cities: [],
        country: "",
        region: "",
        city: "",
        loaded: false
    }),
    components: {
        Loader,
        Multiselect
    },
    watch: {
        country: function(val) {
            if (this.initial.country !== val) {
                this.region = "";
                this.city = "";
                if (val) this.filterRegions("");
            } else {
                this.initial.country = 'done';
            }
        },
        region: function(val) {
            if (this.initial.region !== val) {
                this.city = "";
                if (val) this.filterCities("");
            } else {
                this.initial.region = 'done';
            }
        }
    },
    methods: {
        getUserInfo() {
            Users.get(this.$store.getters.userID)
                .then(res => {
                    this.firstname = res.data.firstname;
                    this.lastname = res.data.lastname;
                    this.middlename = res.data.middlename;
                    this.position = res.data.position;
                    this.phone = res.data.phone;
                    this.email = res.data.email;
                    this.login = res.data.login;
                    this.referral = res.data.referral;
                    this.initial.country = res.data.location.country;
                    this.initial.region = res.data.location.region;
                    this.initial.city = res.data.location.city;
                    this.filterCountries('');
                    if (res.data.location.country) {
                        this.country = res.data.location.country;
                        this.filterRegions('');
                    }
                    if (res.data.location.region) {
                        this.region = res.data.location.region;
                        this.filterCities('');
                    }
                    if (res.data.location.city)
                        this.city = res.data.location.city;
                    this.loaded = true;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        filterCountries(search) {
            Countries.get(search, 0, 5)
                .then(res => {
                    this.countries = res.data.countries;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        filterRegions(search) {
            Regions.get(search, this.country.id, 0, 5)
                .then(res => {
                    this.regions = res.data.regions;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        filterCities(search) {
            Cities.get(search, this.region.id, 0, 5)
                .then(res => {
                    this.cities = res.data.cities;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        saveUser() {
            Users.edit(this.$store.getters.userID, {
                firstname: this.firstname,
                lastname: this.lastname,
                middlename: this.middlename,
                country_id: this.country ? this.country.id : "",
                region_id: this.region ? this.region.id : "",
                city_id: this.city ? this.city.id : "",
                position: this.position,
                phone: this.phone,
                email: this.email,
                login: this.login
            })
                .then(() => {
                    this.$toast("Данные пользователя успешно сохранены");
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        },
        submitForm() {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.saveUser();
            }
        },
        parseCountryInput(value) {
            this.filterCountries(value);
        },
        parseRegionInput(value) {
            this.filterRegions(value);
        },
        parseCityInput(value) {
            this.filterCities(value);
        }
    },
    validations: {
        firstname: {
            required
        },
        lastname: {
            required
        },
        email: {
            required,
            email
        },
        login: {
            required,
            minLength: minLength(3)
        },
        phone: {
            required,
            minLength: minLength(6),
            maxLength: maxLength(12)
        }
    },
    created() {
        this.getUserInfo();
    },
    metaInfo: {
        title: "Настройки"
    }
};
</script>

<style scoped>
.settings-card {
    border-radius: 20px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    padding: 35px 23px 50px;
    max-width: 641px;
    box-sizing: border-box;
    transition-duration: 0.5s;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.card-heading {
    color: var(--main-color);
    font-size: 23px;
    line-height: 31px;
    font-family: Intro;
    text-align: left;
    margin-bottom: 50px;
}

.card-bottom {
    display: flex;
    justify-content: center;
}

input[type="text"],
input[type="password"] {
    border-radius: 7px;
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    height: 43px;
    padding: 0px 13px;
    font-family: Intro;
    font-size: 13px;
    line-height: 17px;
    width: 100%;
    max-width: 284px;
    font-weight: normal;
}

.input-box + .input-box {
    margin-top: 23px;
    width: 100%;
}

.position-input-box {
    margin-top: 35px;
    margin-bottom: 41px;
    width: 100%;
}

.input-box-choice {
    margin-bottom: 13px;
    display: flex;
    flex-direction: column;
}

.choice {
    font-family: Intro;
    font-size: 13px;
    line-height: 17px;
    font-weight: lighter;
    color: #808080;
    margin-top: 4px;
}

.choice-select {
    text-decoration: underline;
    color: var(--main-color);
    cursor: pointer;
}

.geography {
    position: relative;
}

.autocomplete {
    background: white;
    position: absolute;
    list-style-type: none;
    bottom: -5px;
    transform: translateY(100%);
    opacity: 0;
    transition: 0.3s;
    border-radius: 16px;
    box-sizing: border-box;
    padding: 16px 0px;
    font-family: Intro;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    z-index: 2;
    visibility: hidden;
    opacity: 0;
}

#country-input:focus + .autocomplete,
#region-input:focus + .autocomplete,
#city-input:focus + .autocomplete {
    visibility: initial;
    opacity: 0.95;
}

.autocomplete li {
    padding: 5px;
    cursor: pointer;
    font-size: 14px;
    line-height: 19px;
    color: #7a7a7a;
    padding: 4px 25px;
}

.autocomplete li:hover {
    background-color: rgba(6, 128, 194, 0.1);
}

.referral-box {
    margin-top: 45px;
}

.referral-name {
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 9px;
}

input:disabled {
    color: black;
}

.password-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 284px;
}

.edit-icon {
    height: 14px;
    position: absolute;
    right: 17px;
    cursor: pointer;
}

.edit-paying-icon {
    height: 21px;
    position: absolute;
    right: 17px;
    cursor: pointer;
}

.save-button {
    height: 48px;
    background: var(--main-color);
    border-radius: 54px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    color: white;
    box-sizing: border-box;
    padding: 0px 45px;
    font-family: Intro;
    font-size: 20px;
    line-height: 27px;
    margin-top: 75px;
}

.input-slot {
    position: relative;
    width: 100%;
    max-width: 284px;
}

.incorrect-icon {
    height: 20px;
    position: absolute;
    right: 6px;
    transition-duration: 0.5s;
    top: 50%;
    transform: translateY(-50%);
}

input::placeholder {
    color: rgba(3, 21, 28, 0.5);
}

@media (min-width: 768px) {
    .settings-card {
        padding: 35px 110px 50px;
        width: 641px;
    }

    .loader-container {
        width: 641px;
    }

    .card-bottom {
        justify-content: start;
    }

    .input-box-choice {
        flex-direction: row;
        align-items: center;
        margin-bottom: 24px;
    }

    .choice {
        margin-top: 0px;
        margin-left: 15px;
    }

    .login-box {
        margin-top: 16px;
    }

    .referral-box {
        margin-top: 60px;
    }
}

.geography .multiselect {
    border-radius: 7px;
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.1);
    max-width: 284px;
    min-height: 43px;
}


</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>