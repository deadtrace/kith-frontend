<template>
    <div class="services-card">
        <div class="services-title">Приобретенные услуги</div>
        <div class="services-list">
            <div class="services-list-item" v-for="(service, index) in services" :key="index">
                <div class="services-list-item-info">
                    <div class="services-list-item-info-top">
                        <div class="services-list-item-info-name">{{ service.serviceName }}</div>
                        <div class="services-list-item-info-board">{{ service.boardnName }}</div>
                    </div>
                    <div class="services-list-item-info-bottom">
                        <div class="services-list-item-info-timelimit">{{ service.dateToExpire }}</div>
                    </div>
                </div>
                <div class="services-list-item-options">
                    <button
                        class="services-list-item-option services-list-item-blue-option"
                    >Продлить</button>
                    <button
                        class="services-list-item-option services-list-item-gray-option"
                    >Отменить</button>
                </div>
            </div>
        </div>
        <div class="services-to-buy">
            <div class="service-to-buy" v-for="(service, index) in servicesToBuy" :key="index">
                <div class="service-to-buy-left">
                    <div class="service-to-buy-name">{{ service.serviceName }}</div>
                    <div class="service-to-buy-timeleft">{{ service.left }}</div>
                </div>
                <div class="service-to-buy-right">
                    <button class="buy-button">Купить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        services: [
            {
                serviceName: "Выделить объявление",
                boardnName: "Lorem lorem lorem lorem lorem",
                dateToExpire: "действует до 23.04.2020 15:44"
            },
            {
                serviceName: "Выделить объявление",
                boardnName: "Lorem lorem lorem lorem lorem",
                dateToExpire: "действует до 23.04.2020 15:44"
            },
            {
                serviceName: "Выделить объявление",
                boardnName: "Lorem lorem lorem lorem lorem",
                dateToExpire: "действует до 23.04.2020 15:44"
            }
        ],
        servicesToBuy: [
            {
                serviceName: "Размещение объявления",
                left: "осталось 8 штук"
            }
        ]
    })
};
</script>

<style scoped>
* {
    font-family: Intro;
}

.services-card {
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.1);
    border-radius: 13px;
    padding: 30px 25px 50px;
    box-sizing: border-box;
    margin-top: 50px;
    box-sizing: border-box;
    max-width: 607px;
}

.services-title {
    font-family: Intro;
    font-size: 24px;
    line-height: 32px;
    color: var(--main-color);
    margin-bottom: 40px;
}

.services-list-item {
    display: flex;
    align-items: center;
}

.services-list-item + .services-list-item {
    margin-top: 20px;
}

.services-list-item-info {
    margin-right: 25px;
}

.services-list-item-info-top {
    display: flex;
    align-items: center;
}

.services-list-item-info-name,
.service-to-buy-name {
    font-size: 14px;
    line-height: 27px;
    color: var(--main-color);
}

.services-list-item-info-board {
    font-size: 14px;
    line-height: 19px;
    color: var(--main-color);
    text-decoration: underline;
    margin-left: 16px;
}

.services-list-item-info-timelimit,
.service-to-buy-timeleft {
    margin-top: 6px;
    font-size: 12px;
    line-height: 27px;
    color: #9ba3a7;
}

.services-list-item-options {
    display: flex;
}

.services-list-item-blue-option {
    color: var(--main-color);
}

.services-list-item-gray-option {
    color: #9a9a9a;
}

.services-list-item-option {
    font-size: 12px;
    line-height: 14px;
}

.services-list-item-option + .services-list-item-option {
    margin-left: 19px;
}

.services-to-buy {
    margin-top: 20px;
}

.service-to-buy {
    display: flex;
    align-items: center;
}

.service-to-buy-left {
    margin-right: 30px;
}

.buy-button {
    background-color: var(--main-color);
    border-radius: 31px;
    color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    padding: 0px 20px;
    height: 28px;
}

@media (max-width: 768px) {
    .services-list-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .services-list-item-info-top {
        flex-direction: column-reverse;
        align-items: flex-start;
    }

    .services-list-item-info-board {
        font-size: 15px;
        line-height: 20px;
        margin-left: 5px;
    }

    .services-list-item-info-name {
        font-size: 12px;
        line-height: 12px;
        margin-top: 10px;
    }

    .services-list-item-info-timelimit {
        font-size: 10px;
        line-height: 20px;
        margin-top: 0px;
    }

    .services-list-item-option {
        font-size: 13px;
        line-height: 16px;
    }

    .services-list-item-info {
        margin-right: 0px;
    }

    .services-list-item-options {
        margin-top: 10px;
    }
}
</style>