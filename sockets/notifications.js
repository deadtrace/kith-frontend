import store from "../store";

export default () => {
    var user_id = store.state.user.id;

    const secure = window.location.protocol === 'https:' ? 's' : '';
    const { host } = window.location;
    let ws = new WebSocket(`ws${secure}://${host}/ws/notifications/${user_id}/`);

    ws.onmessage = (e) => {
        var data = JSON.parse(e.data);
        store.dispatch('NOTIFICATIONS_LIST__ADD', data);
        store.dispatch('NOTIFICATIONS_COUNTER_INCREMENT');
    };

    ws.onopen = () => {
        // eslint-disable-next-line
        console.info("Notifications socket is opened.")
    };

    ws.onclose = () => {
        // eslint-disable-next-line
        console.error('Notifications socket closed unexpectedly. Reload page.')
    };
}