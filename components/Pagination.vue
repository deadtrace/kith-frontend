<template>
    <div class="pagination">
        <template v-if="total !== 0">
            <svg
                class="pagination-left-arrow"
                @click="current > 1 ? $emit('change-page', current - 1) : ''"
                xmlns="http://www.w3.org/2000/svg"
                width="26.197"
                height="26"
                viewBox="0 0 26.197 26"
            >
                <g id="Group_527" data-name="Group 527" transform="translate(-764.803 -1937.303)">
                    <g
                        id="Group_444"
                        data-name="Group 444"
                        transform="translate(1842.803 4282.606) rotate(180)"
                    >
                        <line
                            id="Line_78"
                            data-name="Line 78"
                            x1="7.673"
                            y2="7.673"
                            transform="translate(1061.303 2340.606) rotate(180)"
                            fill="none"
                            stroke="#03151c"
                            stroke-linecap="round"
                            stroke-width="2.4"
                        />
                        <line
                            id="Line_79"
                            data-name="Line 79"
                            x1="7.803"
                            y1="7.933"
                            transform="translate(1061.303 2332.933) rotate(180)"
                            fill="none"
                            stroke="#03151c"
                            stroke-linecap="round"
                            stroke-width="2.4"
                        />
                    </g>
                    <g
                        id="Group_445"
                        data-name="Group 445"
                        transform="translate(1831.303 4286.606) rotate(180)"
                    >
                        <line
                            id="Line_78-2"
                            data-name="Line 78"
                            x1="11.115"
                            y2="11.115"
                            transform="translate(1064.803 2347.606) rotate(180)"
                            fill="none"
                            stroke="#03151c"
                            stroke-linecap="round"
                            stroke-width="2.4"
                        />
                        <line
                            id="Line_79-2"
                            data-name="Line 79"
                            x1="11.303"
                            y1="11.492"
                            transform="translate(1064.803 2336.492) rotate(180)"
                            fill="none"
                            stroke="#03151c"
                            stroke-linecap="round"
                            stroke-width="2.4"
                        />
                    </g>
                </g>
            </svg>
            <template v-if="pages <= 5">
                <div
                    v-for="i in pages"
                    :key="i"
                    @click="$emit('change-page', i)"
                    class="pagination-item-box pagination-item pagination-item-clickable"
                    :class="{'pagination-item-selected' : i == current}"
                >{{ i }}</div>
            </template>
            <template v-else>
                <div
                    @click="$emit('change-page', 1)"
                    class="pagination-item-box pagination-item pagination-item-clickable"
                    :class="{'pagination-item-selected' : 1 == current}"
                >1</div>
                <div class="pagination-item-box pagination-item" v-if="current - 1> 2">..</div>
                <div
                    class="pagination-item-box pagination-item pagination-item-clickable"
                    v-if="current - 1 > 1"
                    @click="$emit('change-page', current - 1)"
                >{{ current - 1 }}</div>
                <div
                    class="pagination-item-box pagination-item pagination-item-clickable pagination-item-selected"
                    v-if="current != 1 && current != pages"
                >{{ current }}</div>
                <div
                    class="pagination-item-box pagination-item pagination-item-clickable"
                    v-if="current + 1 < pages"
                    @click="$emit('change-page', current + 1)"
                >{{ current + 1}}</div>
                <div class="pagination-item-box pagination-item" v-if="pages - current > 2">..</div>
                <div
                    @click="$emit('change-page', pages)"
                    class="pagination-item-box pagination-item pagination-item-clickable"
                    :class="{'pagination-item-selected' : pages == current}"
                >{{ pages }}</div>
            </template>
            <svg
                class="pagination-right-arrow"
                @click="current < pages ? $emit('change-page', current + 1) : ''"
                xmlns="http://www.w3.org/2000/svg"
                width="25.697"
                height="26"
                viewBox="0 0 25.697 26"
            >
                <g id="Group_526" data-name="Group 526" transform="translate(-1128.803 -1935.303)">
                    <g id="Group_443" data-name="Group 443" transform="translate(77 -384)">
                        <line
                            id="Line_78"
                            data-name="Line 78"
                            x1="7.673"
                            y2="7.673"
                            transform="translate(1061.303 2340.606) rotate(180)"
                            fill="none"
                            stroke="#03151c"
                            stroke-linecap="round"
                            stroke-width="2.4"
                        />
                    </g>
                    <g id="Group_525" data-name="Group 525">
                        <line
                            id="Line_79"
                            data-name="Line 79"
                            x1="7.803"
                            y1="7.933"
                            transform="translate(1138.303 1948.933) rotate(180)"
                            fill="none"
                            stroke="#03151c"
                            stroke-linecap="round"
                            stroke-width="2.4"
                        />
                        <g id="Group_446" data-name="Group 446" transform="translate(88 -388)">
                            <line
                                id="Line_78-2"
                                data-name="Line 78"
                                x1="11.115"
                                y2="11.115"
                                transform="translate(1064.803 2347.606) rotate(180)"
                                fill="none"
                                stroke="#03151c"
                                stroke-linecap="round"
                                stroke-width="2.4"
                            />
                            <line
                                id="Line_79-2"
                                data-name="Line 79"
                                x1="11.303"
                                y1="11.492"
                                transform="translate(1064.803 2336.492) rotate(180)"
                                fill="none"
                                stroke="#03151c"
                                stroke-linecap="round"
                                stroke-width="2.4"
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </template>
        <div v-else></div>
    </div>
</template>

<script>
export default {
    data: () => ({}),
    props: {
        current: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: false,
            default: 10
        },
        total: {
            type: Number,
            required: true
        }
    },
    computed: {
        pages() {
            return Math.ceil(this.total / this.perPage);
        }
    }
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.pagination {
    display: flex;
    align-items: center;
}

.pagination-item-box {
    box-sizing: border-box;
    height: 40px;
    width: 40px;
    border-radius: 11px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #03151c;
    transition-duration: 0.3s;
}

.pagination-item + .pagination-item {
    margin-left: 10px;
}

.pagination-item-clickable,
.pagination-right-arrow,
.pagination-left-arrow {
    cursor: pointer;
}

.pagination-right-arrow,
.pagination-left-arrow {
    height: 20px;
}

.pagination-item-clickable:hover,
.pagination-item-selected {
    background-color: var(--main-color);
    color: white;
}

.pagination-right-arrow {
    margin-left: 20px;
}

.pagination-left-arrow {
    margin-right: 20px;
}
</style>
