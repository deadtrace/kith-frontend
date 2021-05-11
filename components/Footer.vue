<template>
    <div class="footer">
        <div class="footer-container">
            <div class="footer-section categories">
                <div
                    class="category clickable"
                    v-for="(category, index) in categories"
                    :key="index"
                    @click="$router.push({path: `/?category=${category.id}`})"
                >{{ category.name_native }}</div>
            </div>
            <div class="footer-section main-links">
                <div class="main-links-container">
                    <a class="main-link clickable" @click="$router.push({ name: `profileSettings` })">Личный кабинет</a>
                    <a class="main-link clickable" @click="$router.push({ name: `ads` })">Объявления</a>
                    <!-- <a class="main-link">Правила использования</a> -->
                </div>
            </div>
            <div class="footer-section download-links">
                <span class="gray-18">Доступно на смартфонах</span>
                <a href="https://apps.apple.com/us/app/%D0%B7%D0%BD%D0%B0%D0%BA%D0%BE%D0%BC%D1%8B%D0%B5/id1458376061?l=lt" target="_blank">
                    <img
                        src="@/assets/appStoreDownload.png"
                        alt="Загрузить в App Store"
                        class="store-link"
                    />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.project.scratchstudio.kith&hl=ru" target="_blank">
                    <img
                        src="@/assets/googlePlayDownload.png"
                        alt="Загрузить в Google Play"
                        class="store-link"
                    />
                </a>
            </div>
            <div class="footer-section social-links-section">
                <span class="gray-18">Мы в соц. сетях</span>
                <div class="social-links">
                    <img src="@/assets/social/instagram.png" alt="Instagram" class="social-link" />
                    <img src="@/assets/social/facebook.png" alt="Facebook" class="social-link" />
                    <img src="@/assets/social/youtube.png" alt="Youtube" class="social-link" />
                    <img src="@/assets/social/vk.png" alt="Vk" class="social-link" />
                </div>
            </div>
            <div class="footer-section footer-bottom">
                <div>© 2019-2020 «Знакомые»</div>
                <div style="cursor: pointer;">Пользовательское соглашение</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as Categories from "@/services/categories";

export default {
    data: () => ({
        categories: []
    }),
    methods: {
        getCategories() {
            Categories.get("", 0, 12)
                .then(res => {
                    this.categories = res.data.categories;
                })
                .catch(() => {
                    this.$toast.error(
                        "Произошла ошибка при загрузке категорий"
                    );
                });
        }
    },
    created() {
        this.getCategories();
    }
};
</script>

<style scoped>
.footer {
    background: #f9f9f9;
    padding-top: 34px;
    padding-bottom: 28px;
}

.footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
    width: 240px;
}

.categories {
    display: none;
}

.main-links {
    order: 1;
    flex-basis: 100%;
}

.main-links-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    justify-content: center;
    height: 100%;
}

.main-link {
    color: var(--main-color);
    text-decoration: none;
    font-size: 18px;
    line-height: 24px;
    font-family: Intro Book;
}

.main-link + .main-link {
    margin-top: 10px;
}

.download-links {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: fit-content;
    align-items: center;
    order: 2;
    flex-basis: 100%;
    margin-top: 40px;
}

.social-links-section {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: fit-content;
    align-items: center;
    order: 3;
    flex-basis: 100%;
    margin-top: 36px;
}

.social-links {
    margin-top: 10px;
}

.social-link {
    width: 42px;
    cursor: pointer;
}

.social-link + .social-link {
    margin-left: 10px;
}

.gray-18 {
    color: var(--gray);
    font-family: Intro Book;
    font-size: 18px;
    line-height: 24px;
}

.store-link {
    width: 138px;
    margin-top: 8px;
    cursor: pointer;
}

.footer-bottom {
    text-align: center;
    font-family: Intro Light;
    font-size: 16px;
    line-height: 21px;
    font-weight: 100;
    order: 4;
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 34px;
}

@media (min-width: 768px) {
    .footer {
        padding-bottom: 18px;
    }

    .footer-container {
        width: 488px;
    }

    .categories {
        margin-bottom: 45px;
        display: flex;
        flex-basis: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .category {
        font-family: Intro Book;
        font-size: 16px;
        color: var(--gray);
        flex-basis: calc(100% / 3);
    }

    .main-links-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        padding: 0 80px;
    }

    .main-link + .main-link {
        margin-top: 0px;
    }

    .main-links {
        order: 3;
    }

    .download-links {
        order: 2;
        flex-basis: 45%;
        margin-top: 0px;
    }

    .social-links-section {
        order: 1;
        flex-basis: 45%;
        margin-top: 0px;
    }

    .footer-bottom {
        justify-content: space-evenly;
        flex-direction: row;
        margin-top: 40px;
    }
}

@media (min-width: 1280px) {
    .footer-container {
        width: 1280px;
    }

    .categories {
        margin-bottom: 0px;
        order: 1;
        flex-basis: 800px;
        padding: 0px 50px;
        box-sizing: border-box;
        margin-bottom: 0px;
    }

    .category {
        flex-basis: calc(100% / 4);
    }

    .main-links-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        max-width: 300px;
        margin: 0 auto;
        padding: 0px;
    }

    .main-links {
        order: 3;
    }

    .download-links {
        order: 2;
        flex-basis: 220px;
        margin-top: 0px;
    }

    .social-links-section {
        order: 0;
        flex-basis: 220px;
        margin-top: 0px;
    }

    .footer-bottom {
        justify-content: space-between;
        flex-direction: row;
        max-width: 450px;
        margin: 45px auto 0;
    }
}

.invisible-link {
    opacity: 0;
    cursor: default;
}
</style>