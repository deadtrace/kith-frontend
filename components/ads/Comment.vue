<template>
    <div class="comment">
        <div class="comment-header">
            <div
                class="comment-user-photo clickable"
                :style="comment.user.photo ? `background-image: url(${comment.user.photo});` : ''"
                @click="$router.push({path: `/user/${comment.user.id}`})"
            ></div>
            <div
                class="comment-username clickable"
                @click="$router.push({path: `/user/${comment.user.id}`})"
            >{{ `${comment.user.firstname} ${comment.user.lastname}` }}</div>
        </div>
        <div class="comment-text">{{ comment.message }}</div>
        <div class="comment-timestamp">{{ $moment(comment.timestamp).format('LL в LT') }}</div>
    </div>
</template>

<script>
export default {
    data: () => ({}),
    props: ["comment"]
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.comment {
    border-radius: 6px;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.2);
    padding: 8px 13px 12px;
    box-sizing: border-box;
    max-width: 250px;
    width: 100%;
}

.comment-header {
    display: flex;
    align-items: center;
}

.comment-user-photo {
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
    min-height: 20px;
    min-width: 20px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
}

.comment-username {
    font-size: 8px;
    line-height: 11px;
    margin-left: 8px;
}

.comment-text {
    margin-top: 5px;
    font-size: 10px;
    line-height: 15px;
}

.comment-timestamp {
    font-size: 7px;
    line-height: 10px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 5px;
}

@media (min-width: 768px) {
    .comment {
        min-width: 360px;
        max-width: 360px;
        border-radius: 13px;
    }

    .comment-user-photo {
        min-height: 30px;
        min-width: 30px;
        height: 30px;
        width: 30px;
    }

    .comment-username {
        font-size: 12px;
        line-height: 16px;
        margin-left: 11px;
    }

    .comment-text {
        margin-top: 7px;
        font-size: 12px;
        line-height: 18px;
    }

    .comment-timestamp {
        font-size: 10px;
        line-height: 14px;
        margin-top: 7px;
    }
}
</style>