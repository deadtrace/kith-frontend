import Vue from 'vue'
import VueRouterMultiguard from 'vue-router-multiguard'
import Router from 'vue-router'

import Profile from '@/components/Profile.vue'
import Boards from '@/components/Boards.vue'
import Users from '@/components/Users.vue'
import Auth from '@/components/Authentication.vue'
import Recovery from '@/views/PasswordRecovery.vue'
import Activation from '@/views/ActivationPage.vue'
import Countries from '@/components/Countries.vue'
import Regions from '@/components/Regions.vue'
import Cities from '@/components/Cities.vue'
import Categories from '@/components/Categories.vue'

import RegistrationCard from '@/components/RegistrationCard.vue'
import PreRegistration from '@/components/PreRegistration.vue'
import MyProfileSettingsCard from '@/components/myProfileSettingsCard.vue'
import MyProfilePasswordChangeCard from '@/components/myProfilePasswordChangeCard.vue'
import MessagesList from '@/components/messages/MessagesList.vue'
import Dialog from '@/views/DialogPage.vue'
import MyCircle from '@/components/MyCircle.vue'
import AddAd from '@/components/AddAd.vue'
import EditAd from '@/components/EditAd.vue'
// import AdCard from '@/components/AdCard.vue'
import Ads from '@/components/ads/Ads.vue'
import Ad from '@/views/BoardPage.vue'

import guards from '@/guards'

import Main from '@/views/MainPage.vue'
import UserPage from '@/views/UserPage.vue'
import UserAds from "@/components/ads/UserAds.vue"

import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ClientLayout from "@/layouts/ClientLayout"
import ProfileLayout from "@/layouts/ProfileLayout"

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/registration',
            name: 'registration',
            component: PreRegistration
        },
        {
            path: '/recovery',
            name: 'recovery',
            component: Recovery
        },
        {
            path: '/activation/:user_id',
            name: 'activation',
            component: Activation
        },
        {
            path: '',
            component: ClientLayout,
            beforeEnter: VueRouterMultiguard([guards.updateStore]),
            children: [{
                    path: '',
                    name: 'main',
                    component: Main
                },
                {
                    path: 'ad/:board_id',
                    name: 'ad',
                    component: Ad
                },
            ]
        },
        {
            path: '',
            component: ClientLayout,
            beforeEnter: VueRouterMultiguard([guards.isAuthentificated]),
            children: [{
                    path: 'profile',
                    component: ProfileLayout,
                    children: [{
                            path: 'settings',
                            name: 'profileSettings',
                            component: MyProfileSettingsCard
                        },
                        {
                            path: 'password',
                            name: 'passwordChange',
                            component: MyProfilePasswordChangeCard
                        },
                        {
                            path: 'messages',
                            name: 'messagesList',
                            component: MessagesList
                        }
                    ]
                },
                {
                    path: 'conversation/:user_id',
                    name: 'dialog',
                    component: Dialog
                },
                {
                    path: 'circle',
                    name: 'circle',
                    component: MyCircle
                },
                {
                    path: 'add',
                    name: 'addAd',
                    component: AddAd
                },
                {
                    path: 'ads',
                    name: 'ads',
                    component: Ads
                },
                {
                    path: 'ad/:board_id/edit',
                    name: 'editAd',
                    component: EditAd
                },
                {
                    path: 'user/:user_id',
                    name: 'userPage',
                    component: UserPage
                },
                {
                    path: 'user/:user_id/ads',
                    name: 'userAds',
                    component: UserAds
                }
            ]
        },
        {
            path: '',
            component: ClientLayout,
            beforeEnter: VueRouterMultiguard([guards.updateStore]),
            children: [
                {
                    path: 'register',
                    name: 'register',
                    component: RegistrationCard
                }
            ]
        },
        {
            path: '/admin',
            component: AdminLayout,
            beforeEnter: VueRouterMultiguard([guards.isAuthentificated]),
            children: [{
                    path: '',
                    name: 'profile',
                    component: Profile,
                },
                {
                    path: 'boards',
                    name: 'boards',
                    component: Boards
                },
                {
                    path: 'users',
                    name: 'users',
                    component: Users
                },
                {
                    path: 'countries',
                    name: 'countries',
                    component: Countries
                },
                {
                    path: 'regions',
                    name: 'regions',
                    component: Regions
                },
                {
                    path: 'cities',
                    name: 'cities',
                    component: Cities
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: Categories
                }
            ]
        },
        {
            path: '/auth',
            component: AuthLayout,
            children: [{
                path: '',
                name: 'auth',
                component: Auth
            }]
        },
        {
            path: '*',
            redirect: '/admin'
        },
    ]
})