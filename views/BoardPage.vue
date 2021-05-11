<template>
    <div class="board-page-container">
        <div class="breadcrumbs" v-if="board">
            <div
                class="breadcrumb-left"
                v-if="board.board_user_id === $store.getters.userID"
                @click="$router.push({path: '/ads'})"
            >Мои объявления</div>
            <div class="breadcrumb-left" v-else @click="$router.push({path: '/'})">Список объявлений</div>
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
            <template v-if="board.board_title">
                <div
                    class="breadcrumb-right"
                    v-if="board.board_title.length <= 50"
                >{{ board.board_title }}</div>
                <div class="breadcrumb-right" v-else>{{ `${board.board_title.slice(0,50)}...` }}</div>
            </template>
        </div>
        <boards-filter
            style="margin-bottom: 20px;"
            @search-boards="$router.push({name: 'main', query: { category: $event.categoryID, country: $event.countryID, region: $event.regionID, city: $event.cityID, search: $event.search}})"
        ></boards-filter>
        <div class="board-page">
            <div class="board-container">
                <Board :board="board" :phone="board.owner_phone"></Board>
            </div>
            <div class="comments" v-if="$store.getters.userID">
                <div class="comments-header">Все комментарии ({{ commentsCount }})</div>
                <div class="add-comment">
                    <autosize-textarea
                        id="description"
                        v-model="message"
                        placeholder="Написать комментарий..."
                    />
                    <button class="send-button" @click="addComment">Отправить</button>
                </div>
                <Comment
                    v-for="comment in comments"
                    :key="comment.id"
                    class="board-comment"
                    :comment="comment"
                ></Comment>
                <button
                    v-if="(page - 1) * size < commentsCount"
                    class="comments-header"
                    style="margin-top: 20px;"
                    @click="getComments"
                >Загрузить ещё</button>
            </div>
            <div class="comments" v-else>
                <div class="no-auth-comments">
                    Для просмотра комментариев<br />авторизуйтесь в системе
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Board from "@/components/ads/BoardPageAd";
import Comment from "@/components/ads/Comment";
import { AutosizeTextarea } from "vue-autosizer";
import * as Boards from "@/services/boards";
import * as Comments from "@/services/comments";
import boardsFilter from "@/components/Filter";

export default {
    data: () => ({
        message: "",
        commentsCount: "",
        comments: [],
        page: 1,
        size: 20,
        board: {},
        title: "Объявление"
    }),
    metaInfo() {
        const title = this.title;
        return {
            title: `${title}`
        };
    },
    components: {
        Board,
        Comment,
        AutosizeTextarea,
        boardsFilter
    },
    methods: {
        getBoard(id) {
            if (this.$store.getters.userID) {
                Boards.getBoard(id)
                .then(res => {
                    this.board = res.data.board;
                    this.commentsCount = res.data.board.comments;
                    if (this.$store.getters.userID) {
                        this.getComments();
                    }
                    this.title = res.data.board.board_title;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                    this.$router.push({ path: "/" });
                });
            } else {
                Boards.getBoardWithoutToken(id)
                .then(res => {
                    this.board = res.data.board;
                    this.commentsCount = res.data.board.comments;
                    if (this.$store.getters.userID) {
                        this.getComments();
                    }
                    this.title = res.data.board.board_title;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                    this.$router.push({ path: "/" });
                });
            }
        },
        getComments() {
            Comments.getComments(
                this.$route.params.board_id,
                this.size,
                this.page
            )
                .then(res => {
                    this.comments = this.comments.concat(res.data);
                    this.page += 1;
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error(
                              "Произошла ошибка при загрузке комментариев"
                          );
                });
        },
        addComment() {
            Comments.addComment(this.$route.params.board_id, this.message)
                .then(() => {
                    this.$toast("Комментарий успешно оставлен");
                    this.message = "";
                    this.commentsCount += 1;
                    this.getComments();
                })
                .catch(err => {
                    err.response.data.message
                        ? this.$toast.error(err.response.data.message)
                        : this.$toast.error("Произошла ошибка");
                });
        }
    },
    created() {
        this.getBoard(this.$route.params.board_id);
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.board-page {
    width: 100%;
}

.board-page-container {
    width: 100%;
    max-width: 1280px;
    padding: 0px 17px;
}

.comments {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (min-width: 1280px) {
    .board-page {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .board-page-container {
        padding: 0px;
    }
}

.board-comment {
    margin-top: 17px;
}

@media (min-width: 768px) {
    .board-comment {
        margin-top: 25px;
    }
}

.comments-header {
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    color: #8e8e8e;
    margin-top: 22px;
}

@media (min-width: 768px) {
    .comments-header {
        font-size: 18px;
        line-height: 24px;
    }
}

@media (min-width: 1280px) {
    .comments-header {
        margin-top: 0px;
    }
}

.add-comment {
    width: 100%;
    max-width: 250px;
    border-radius: 6px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    margin-top: 18px;
    padding: 7px 13px 50px;
    position: relative;
}

@media (min-width: 768px) {
    .add-comment {
        min-width: 360px;
        max-width: 360px;
        border-radius: 13px;
        margin-top: 25px;
    }
}

#description {
    width: 100%;
    resize: none;
    font-size: 14px;
    line-height: 19px;
    min-height: 60px;
}

.send-button {
    color: white;
    background-color: var(--main-color);
    font-size: 14px;
    box-sizing: border-box;
    height: 28px;
    position: absolute;
    padding: 0px 14px;
    border-radius: 18px;
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.06);
    right: 13px;
    bottom: 14px;
}

.board-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

@media (min-width: 1280px) {
    .board-container {
        justify-content: flex-start;
    }
}

/* BREADCRUMBS_START */

.breadcrumbs {
    display: flex;
    align-items: center;
    margin-left: 0px;
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
        margin-bottom: 20px;
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

.no-auth-comments {
    text-align: center;
    font-size: 16px;
    line-height: 16px;
    color: #8e8e8e;
    width: 100%;
    max-width: 250px;
    margin-top: 20px;
}

@media (min-width: 768px) {
    .no-auth-comments {
        max-width: 360px;
        min-width: 360px;
        margin-top: 0px;
    }
}
</style>