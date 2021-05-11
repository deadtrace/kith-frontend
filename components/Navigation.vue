<template>
    <v-list nav>
        <v-list-item v-for="link in links" :key=link.text router exact :to="link.route">
            <v-list-item-icon class="mx-2">
                <v-icon :class="textColor">{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="mx-2">
                <v-list-item-title :class="textColor">{{ link.text }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>
export default {
    data () {
        return {
            links: [
                { icon: 'mdi-account', text: 'Профиль', route: '/admin'},
                { icon: 'mdi-account-group', text: 'Пользователи', route: '/admin/users'},
                { icon: 'mdi-message', text: 'Объявления', route: '/admin/boards'},
                { icon: 'mdi-flag', text: 'Страны', route: '/admin/countries'},
                { icon: 'mdi-map-marker-multiple', text: 'Регионы', route: '/admin/regions' },
                { icon: 'mdi-city', text: 'Города', route: '/admin/cities' },
                { icon: 'mdi-folder', text: 'Категории', route: '/admin/categories' }

            ]
        }
    },
    props: {
        textColor: {
            type: String,
            required: false,
            default: 'black--text'
        }
    }    
}
</script>