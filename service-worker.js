import { API } from '@/services/api';

function checkWorkerAndPushManager() {
    if (!('serviceWorker' in navigator)) {
        console.log('Workers are not supported.');
        return false;
    }
    if (!('PushManager' in window)) {
        console.log('Push notifications are not supported.');
        return false;
    }
    return true;
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4)
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    var rawData = window.atob(base64)
    var outputArray = new Uint8Array(rawData.length)

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray;
}

function loadVersionBrowser(userAgent) {
    var ua = userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE', version: (tem[1] || '')};
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) {
            return {name: 'Opera', version: tem[1]};
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1]
    };
};
var applicationServerKey = "BFwHvbAIhN5LAWkDzQfMV51NyUmrT3H8A3vw5xHBq-OPjGNOz49mP07tAPG_8HRCSuQABei91CCU2kTQgsozSYQ";

function registerWorker() {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/static/js/navigatorPush.service.js').then(function (reg) {
            console.log('ServiceWorker registration successful');
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
            }).then(function (sub) {
                var endpointParts = sub.endpoint.split('/');
                var registration_id = endpointParts[endpointParts.length - 1];
                var data = {
                    'browser': getBrowserName().toUpperCase(),
                    'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
                    'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
                    'name': 'XXXXX',
                    'registration_id': registration_id
                };
                API().post('device/wp', data).then(res => {
                    console.log(res.data);
                })
                console.log('request post data');
                console.log(data);
            })
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
            return;
        });
    });
    return true;
}

var supported = checkWorkerAndPushManager();

if (supported) {
    var worker = registerWorker();
    requestPermission();
}

function requestPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            // Поддержка устаревшей версии с функцией обратного вызова.
            resolve(result);
        });
        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                console.log(permissionResult);
                throw new Error('Permission not granted.');
            }
        });
    return true;
}

function getBrowserName() {
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var nameOffset, verOffset;

    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
    }
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
    }
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
    }
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
    }
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
    }
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
    }
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }

    return browserName;
}