<template>
    <v-app>
        <nav>
            <v-app-bar elevate-on-scroll app dark color="default">
                <v-app-bar-nav-icon
                    @click="drawer = !drawer"
                    v-if="bp == 'xs' || bp == 'sm' || bp == 'md'"
                ></v-app-bar-nav-icon>
                <v-img class="mx-5" src="@/assets/logo.png" max-height="40" max-width="40" contain></v-img>
                <v-toolbar-title class="text-uppercase headline font-weight-medium">
                    <span class="productname">Знакомые</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu transition="slide-y-transition" bottom>
                    <template v-slot:activator="{ on }">
                        <div v-on="on" style="cursor: pointer">
                            <span v-if="bp != 'xs'" class="productname mr-2">{{ $store.getters.username }}</span>
                            <v-avatar size="40" @click="photoDialog=true">
                                <v-img v-if="$store.state.user.photo" :src="`${$store.state.user.photo}?timestamp=${$store.state.user.timestamp}`" alt="Аватар"></v-img>
                                <v-img v-else src="@/assets/unknown.jpg" alt="Аватар"></v-img>
                            </v-avatar>
                        </div>
                    </template>
                    <v-list>
                        <v-list-item @click="logout()">
                            <v-list-item-title>Выйти</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                app
                color="darkdefault"
                v-if="bp == 'xs' || bp == 'sm' || bp == 'md'"
            >
                <Navigation text-color="white--text"></Navigation>
            </v-navigation-drawer>
        </nav>
        <v-content class="ma-5" justify="center">
            <v-container class="my-4" fluid style="max-width: 1200px">
                <v-row justify="space-between">
                    <v-col v-if="bp !== 'xs' && bp !== 'sm' && bp != 'md'" lg="3">
                        <v-row justify="center">
                            <v-card outlined style="width: 100%">
                                <Navigation></Navigation>
                            </v-card>
                        </v-row>
                    </v-col>
                    <v-col lg="9">
                        <router-view></router-view>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Cookie from "js-cookie";
import Navigation from "@/components/Navigation.vue";

export default {
    name: "admin-layout",
    components: {
        Navigation
    },
    data: () => ({
        drawer: false,
        adminname: ''
    }),
    methods: {
        checkPermission(permission) {
            return this.$store.state.user.permissions.includes(permission);
        },
        logout() {
            Cookie.remove("user-token");
            this.$router.push("/auth");
        }
    },
    computed: {
        bp() {
            return this.$vuetify.breakpoint.name;
        }
    },
    metaInfo: {
        title: "Администрирование"
    }
};
</script>

<style scoped>
</style>