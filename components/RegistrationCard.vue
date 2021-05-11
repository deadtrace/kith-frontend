<template>
    <section class="registration">
        <div class="registration-card">
            <div class="card-heading">Регистрация</div>
            <div class="card-content">
                <div class="card-content-upper">
                    <div class="card-content-upper-photo-block">
                        <div
                            class="card-content-upper-photo"
                            :style="photoURL ? `background-image: url(${photoURL})` : '' "
                        >
                            <span v-if="!photoURL">Фото</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="photoInput"
                            autocomplete="off"
                            @change="addPhoto"
                        />
                        <label class="card-content-upper-photo-add" for="photoInput">
                            <img
                                src="@/assets/plusWhite.svg"
                                class="card-content-upper-photo-add-icon"
                            />
                        </label>
                    </div>
                    <div class="card-content-upper-name-block">
                        <div class="input-slot">
                            <input
                                type="text"
                                v-model="$v.lastname.$model"
                                autocomplete="off"
                                placeholder="Фамилия*"
                            />
                            <img
                                v-if="$v.lastname.$error"
                                src="@/assets/incorrect.svg"
                                class="incorrect-icon"
                            />
                        </div>
                        <div class="input-slot">
                            <input
                                type="text"
                                v-model="$v.firstname.$model"
                                autocomplete="off"
                                placeholder="Имя*"
                            />
                            <img
                                v-if="$v.firstname.$error"
                                src="@/assets/incorrect.svg"
                                class="incorrect-icon"
                            />
                        </div>
                        <div class="input-slot">
                            <input
                                type="text"
                                v-model="middlename"
                                autocomplete="off"
                                placeholder="Отчество"
                            />
                        </div>
                    </div>
                    <div class="card-content-upper-description-block">
                        <textarea placeholder="Описание" v-model="description"></textarea>
                    </div>
                </div>
                <div class="card-content-lower">
                    <div class="card-content-lower-inputs">
                        <div class="card-content-lower-login-block">
                            <div class="input-slot">
                                <input
                                    type="text"
                                    v-model="$v.login.$model"
                                    autocomplete="off"
                                    placeholder="Логин*"
                                />
                                <img
                                    v-if="$v.login.$error"
                                    src="@/assets/incorrect.svg"
                                    class="incorrect-icon"
                                />
                            </div>
                            <div class="input-slot">
                                <input
                                    type="password"
                                    v-model="$v.password1.$model"
                                    placeholder="Пароль*"
                                />
                                <img
                                    v-if="$v.password1.$error"
                                    src="@/assets/incorrect.svg"
                                    class="incorrect-icon"
                                />
                            </div>
                            <div class="input-slot">
                                <input
                                    type="password"
                                    v-model="$v.password2.$model"
                                    placeholder="Пароль повторно*"
                                />
                                <img
                                    v-if="$v.password2.$error"
                                    src="@/assets/incorrect.svg"
                                    class="incorrect-icon"
                                />
                            </div>
                        </div>
                        <div class="card-content-lower-location-block">
                            <div class="input-slot geography-registration">
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
                            <div class="input-slot geography-registration">
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
                            <div class="input-slot geography-registration">
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
                        <div class="card-content-lower-contacts-block">
                            <div class="input-slot">
                                <input type="text" v-model="$v.email.$model" placeholder="Email*" />
                                <img
                                    v-if="$v.email.$error"
                                    src="@/assets/incorrect.svg"
                                    class="incorrect-icon"
                                />
                            </div>
                            <div class="input-slot">
                                <input
                                    type="text"
                                    v-model="$v.phone.$model"
                                    placeholder="89192856006*"
                                />
                                <img
                                    v-if="$v.phone.$error"
                                    src="@/assets/incorrect.svg"
                                    class="incorrect-icon"
                                />
                            </div>
                            <div class="input-slot">
                                <input
                                    type="text"
                                    v-model="position"
                                    placeholder="Сфера деятельности"
                                />
                            </div>
                        </div>
                    </div>
                    <button class="register-button" @click="submitForm">Зарегистрироваться</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import * as Countries from "@/services/countries";
import * as Regions from "@/services/regions";
import * as Cities from "@/services/cities";
import * as Users from "@/services/users";
import {
    required,
    minLength,
    maxLength,
    email,
    sameAs
} from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
    data: () => ({
        photoURL: null,
        photoFile: null,
        firstname: "",
        lastname: "",
        middlename: "",
        login: "",
        password1: "",
        password2: "",
        country: "",
        region: "",
        city: "",
        email: "",
        phone: "",
        countries: [],
        regions: [],
        cities: [],
        position: "",
        description: ""
    }),
    components: {
        Multiselect
    },
    methods: {
        addPhoto(event) {
            let image = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                this.photoURL = e.target.result;
                this.photoFile = image;
            };
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
        register() {
            const fd = new FormData();
            fd.append("user_lastname", this.lastname);
            fd.append("user_firstname", this.firstname);
            fd.append("user_middlename", this.middlename);
            fd.append("user_phone", this.phone);
            fd.append("user_login", this.login);
            fd.append("user_position", this.position);
            fd.append("user_email", this.email);
            fd.append("user_password", this.password1);
            fd.append("user_description", this.description);
            fd.append("photo", this.photoFile);
            if (this.country) {
                fd.append("country_id", this.country.id);
            } else {
                fd.append("country_id", "");
            }
            if (this.region) {
                fd.append("region_id", this.region.id);
            } else {
                fd.append("region_id", "");
            }
            if (this.city) {
                fd.append("city_id", this.city.id);
            } else {
                fd.append("city_id", "");
            }
            fd.append("invitation_user_id", this.$route.query.friend_id);
            Users.register(fd)
                .then(() => {
                    this.$toast("Пользователь успешно создан");
                    this.$router.push({
                        path: "/activation/${res.data.user_id}"
                    });
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
                this.register();
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
    created() {
        this.filterCountries("");
    },
    watch: {
        country: function(val) {
            this.region = "";
            this.city = "";
            if (val) this.filterRegions("");
        },
        region: function(val) {
            this.city = "";
            if (val) this.filterCities("");
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
        password1: {
            required,
            minLength: minLength(6)
        },
        password2: {
            sameAsPassword: sameAs("password1"),
            required
        },
        phone: {
            required,
            minLength: minLength(6),
            maxLength: maxLength(12)
        }
    },
    metaInfo: {
        title: "Регистрация"
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.registration {
    padding: 40px 24px;
    width: 100%;
}

.registration-card {
    border-radius: 20px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
}

.card-heading {
    height: 38px;
    background-color: var(--main-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Intro;
    font-size: 15px;
    line-height: 20px;
    color: white;
    border-radius: 20px 20px 0px 0px;
}

.card-content-upper {
    border-bottom: 0.4px solid rgba(194, 194, 194, 1);
    display: flex;
    flex-direction: column;
}

.card-content-upper-photo-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    position: relative;
}

input[type="file"] {
    display: none;
}

.card-content-upper-photo {
    width: 110px;
    height: 110px;
    border-radius: 55px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Intro;
    font-size: 14px;
    line-height: 19px;
    color: rgba(3, 21, 28, 0.5);
    background-size: cover;
    background-position: center;
}

.card-content-upper-photo-add {
    position: absolute;
    background-color: var(--main-color);
    border: 2px solid white;
    height: 34px;
    width: 34px;
    border-radius: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: -17px;
    cursor: pointer;
}

.card-content-upper-photo-add-icon {
    width: 15px;
}

.card-content-upper-name-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 22px;
}

input[type="text"],
input[type="password"] {
    border-radius: 7px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.06);
    padding: 9px 25px 9px 15px;
    font-family: Intro;
    font-size: 9px;
    line-height: 12px;
    width: 200px;
    box-sizing: border-box;
}

.card-content-upper-name-block .input-slot + .input-slot {
    margin-top: 16px;
}

.card-content-upper-description-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 33px;
    margin-bottom: 26px;
}

textarea {
    resize: none;
    border-radius: 7px;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.06);
    padding: 9px 15px;
    font-family: Intro;
    font-size: 9px;
    line-height: 12px;
    width: 230px;
    height: 124px;
    box-sizing: border-box;
}

@media (min-width: 768px) {
    .card-content-upper {
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        padding-top: 33px;
        padding-bottom: 40px;
    }

    .card-content-upper-photo-block {
        margin-top: 0px;
    }

    .card-content-upper-name-block {
        margin-top: 0px;
        margin-left: 34px;
    }

    .card-content-upper-description-block {
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 34px;
    }
}

.card-content-lower {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-content-lower-inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-content-lower-login-block .input-slot + .input-slot,
.card-content-lower-location-block .input-slot + .input-slot,
.card-content-lower-contacts-block .input-slot + .input-slot {
    margin-top: 16px;
}

.card-content-lower-login-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 26px;
}

.card-content-lower-location-block,
.card-content-lower-contacts-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 32px;
}

.input-slot {
    position: relative;
    display: flex;
    align-items: center;
}

.incorrect-icon {
    height: 15px;
    position: absolute;
    right: 6px;
    transition-duration: 0.5s;
}

.register-button {
    background-color: var(--main-color);
    border-radius: 23px;
    color: white;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.06);
    padding: 7px 29px;
    font-family: Intro;
    font-size: 13px;
    line-height: 17px;
    margin-top: 42px;
    margin-bottom: 50px;
    box-sizing: border-box;
    transition-duration: 0.5s;
}

.register-button:hover {
    transform: scale(1.05);
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

@media (min-width: 768px) {
    .card-content-lower-inputs {
        flex-direction: row;
        padding-top: 34px;
    }

    .card-content-lower-login-block {
        margin-top: 0px;
    }

    .card-content-lower-location-block,
    .card-content-lower-contacts-block {
        margin-top: 0px;
        margin-left: 34px;
    }

    .register-button {
        margin-bottom: 40px;
    }
}

@media (min-width: 1200px) {
    .card-heading {
        height: 56px;
        font-size: 23px;
        line-height: 31px;
    }

    .registration-card {
        max-width: 1100px;
        margin: 0 auto;
    }

    .register-button {
        box-shadow: rgba(0, 0, 0, 0.06);
        padding: 10px 42px;
        font-size: 20px;
        line-height: 27px;
        margin-top: 70px;
        margin-bottom: 50px;
    }

    .card-content-upper-photo {
        width: 160px;
        height: 160px;
        border-radius: 80px;
        font-size: 22px;
        line-height: 30px;
    }

    .card-content-upper-photo-add {
        height: 50px;
        width: 50px;
        border-radius: 25px;
        bottom: -25px;
    }

    .card-content-upper-photo-add-icon {
        width: 22px;
    }

    input[type="text"],
    input[type="password"] {
        padding: 13px 35px 13px 23px;
        font-size: 14px;
        line-height: 19px;
        width: 284px;
    }

    textarea {
        padding: 13px 23px;
        font-size: 14px;
        line-height: 19px;
        width: 340px;
        height: 187px;
    }

    .card-content-upper-name-block,
    .card-content-upper-description-block {
        margin-left: 50px;
    }

    .card-content-lower-location-block,
    .card-content-lower-contacts-block {
        margin-left: 50px;
    }

    .incorrect-icon {
        height: 23px;
        position: absolute;
        right: 8px;
    }
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>