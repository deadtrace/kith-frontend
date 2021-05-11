import store from "../store";

export default (user_from) => {
    var user_to = store.state.user.id;

    const secure = window.location.protocol === 'https:' ? 's' : '';
    const { host } = window.location;
    let ws = new WebSocket(`ws${secure}://${host}/ws/chat/${user_to}/${user_from}/`);

    ws.onmessage = (e) => {
        var data = JSON.parse(e.data);
        store.dispatch('ADD_MESSAGE_TO_QUERY', data.meta);
    };

    ws.onopen = () => {
        // eslint-disable-next-line
        console.info("Chat socket is opened.")
        // store.dispatch('NOTIFICATIONS_SOCKET_OPEN')
    };

    ws.onclose = () => {
        // eslint-disable-next-line
        console.error('Notifications socket closed unexpectedly. Reload page.')
        // store.dispatch('NOTIFICATIONS_SOCKET_CLOSE')
    };
}