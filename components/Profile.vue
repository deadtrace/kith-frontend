<template>
    <v-row justify="center">
        <v-card outlined :loading="loading" width="100%" class="mx-5">
            <form>
                <v-card-text>
                    <v-container>
                        <v-row justify="space-around">
                            <v-col align-self="center" cols="12" sm="5" md="4">
                                <v-row justify="center">
                                    <v-avatar size="200" @click="photoDialog=true">
                                        <v-img
                                            v-if="photo != null"
                                            :src="photo"
                                            alt="Фотография пользователя"
                                        ></v-img>
                                        <v-img
                                            v-else
                                            src="@/assets/unknown.jpg"
                                            alt="Фотография пользователя"
                                        ></v-img>
                                    </v-avatar>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="5" md="4">
                                <v-row>
                                    <v-text-field
                                        label="Фамилия"
                                        v-model="lastname"
                                        outlined
                                        :error-messages="lastnameErrors"
                                        @blur="$v.lastname.$touch()"
                                        @input="$v.lastname.$touch()"
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field
                                        label="Имя"
                                        v-model="firstname"
                                        outlined
                                        :error-messages="firstnameErrors"
                                        @blur="$v.firstname.$touch()"
                                        @input="$v.firstname.$touch()"
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field label="Отчество" v-model="middlename" outlined></v-text-field>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container pb-0>
                        <v-row justify="space-around">
                            <v-col cols="12" sm="5" md="4">
                                <v-row>
                                    <v-text-field
                                        label="Адрес электронной почты"
                                        v-model="email"
                                        outlined
                                        :error-messages="emailErrors"
                                        @blur="$v.email.$touch()"
                                        @input="$v.email.$touch()"
                                    ></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-text-field
                                        label="Номер телефона"
                                        v-model="phone"
                                        outlined
                                        :error-messages="phoneErrors"
                                        @blur="$v.phone.$touch()"
                                        @input="$v.phone.$touch()"
                                    ></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                                <v-row>
                                    <v-text-field label="Позиция" v-model="position" outlined></v-text-field>
                                </v-row>
                                <v-row>
                                    <v-textarea label="Описание" v-model="description" outlined></v-textarea>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row justify="end">
                            <v-btn
                                dark
                                depressed
                                class="my-5 mr-5 success"
                                @click="submit"
                            >Сохранить</v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </form>
        </v-card>
        <v-dialog v-model="photoDialog" width="400">
            <v-card>
                <v-container>
                    <v-file-input v-model="changed_photo" accept="image/*" label="Выбрать новую фотографию" outlined></v-file-input>
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
import * as Profile from "@/services/profile";
import * as Users from "@/services/users";
import { validationMixin } from "vuelidate";
import {
    required,
    email,
    numeric,
    maxLength,
    minLength
} from "vuelidate/lib/validators";
import { UPDATE_USER_PHOTO } from "@/store/types";

export default {
    name: "Profile",
    data: () => ({
        lastname: "",
        firstname: "",
        middlename: "",
        position: "",
        email: "",
        phone: "",
        photo: "",
        changed_photo: null,
        description: "",
        profile: {},
        loading: false,
        photoDialog: false,
        snackbar: false,
        snacktext: ""
    }),
    mixins: [validationMixin],
    computed: {
        emailErrors() {
            const errors = [];
            if (!this.$v.email.$dirty) return errors;
            !this.$v.email.email &&
                errors.push("Укажите корректный адрес электронной почты");
            !this.$v.email.required &&
                errors.push("Необходимо указать адрес электронной почты");
            return errors;
        },
        firstnameErrors() {
            const errors = [];
            if (!this.$v.firstname.$dirty) return errors;
            !this.$v.firstname.required &&
                errors.push("Необходимо указать Ваше имя");
            return errors;
        },
        lastnameErrors() {
            const errors = [];
            if (!this.$v.lastname.$dirty) return errors;
            !this.$v.lastname.required &&
                errors.push("Необходимо указать Вашу фамилию");
            return errors;
        },
        phoneErrors() {
            const errors = [];
            if (!this.$v.phone.$dirty) return errors;
            !this.$v.phone.numeric &&
                errors.push("Пожалуйста, используйте только цифры");
            !this.$v.phone.maxLength && errors.push("Максимум 11 цифр");
            !this.$v.phone.minLength && errors.push("Минимум 6 цифр");
            return errors;
        },
        bp() {
            return this.$vuetify.breakpoint.name;
        }
    },
    validations: {
        email: {
            required,
            email
        },
        firstname: {
            required
        },
        lastname: {
            required
        },
        phone: {
            numeric,
            minLength: minLength(6),
            maxLength: maxLength(11)
        }
    },
    created() {
        this.loading = true;
        this.get_profile_info();
    },
    methods: {
        get_profile_info() {
            Profile.get_profile_info(this.$store.state.user.id)
                .then(res => {
                    this.lastname = res.data.lastname;
                    this.firstname = res.data.firstname;
                    this.middlename = res.data.middlename;
                    this.email = res.data.email;
                    this.phone = res.data.phone;
                    this.position = res.data.position;
                    this.description = res.data.description;
                    this.photo = res.data.photo;
                    this.loading = false;
                    this.$store.dispatch(UPDATE_USER_PHOTO, res.data.photo );
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        submit() {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                Users.edit(this.$store.state.user.id, {
                    lastname: this.lastname,
                    firstname: this.firstname,
                    middlename: this.middlename,
                    email: this.email,
                    phone: this.phone,
                    position: this.position,
                    description: this.description
                })
                    .then(() => {
                        this.showSnackbar(
                            "Данные пользователя успешно изменены"
                        );
                    })
                    .catch(() => {
                        this.loading = false;
                        this.showSnackbar("Что-то пошло не так");
                    });
            } else {
                this.showSnackbar(
                    "Пожалуйста, введите корректные данные пользователя"
                );
            }
        },
        changePhoto() {
            const fd = new FormData();
            let { changed_photo } = this;
            fd.append('photo', changed_photo, changed_photo.name);

            Users.edit_mp(this.$store.state.user.id, fd)
                .then(() => {
                    this.get_profile_info();
                    this.photoDialog = false;
                    this.showSnackbar(
                        "Данные пользователя успешно изменены"
                    );
                })
                .catch(() => {
                    this.loading = false;
                    this.showSnackbar("Что-то пошло не так");
                });
        },
        showSnackbar(text) {
            this.snacktext = text;
            this.snackbar = true;
        }
    }
};
</script>

<style scoped>
</style>