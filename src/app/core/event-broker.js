const events = {};

class EventBroker {

    static add(name, callback) {

        if(!events[name]) {

            events[name] = [];

            document.body.addEventListener(name, (e) => {
                events[name].forEach((callback) => {
                    callback(e);
                });
            }, true);
        }
            
        let listenerIndex = events[name].push(callback) -1;

        let removeListener = () => {
            events[name].splice(listenerIndex, 1);
        };

        return removeListener;
    }
}

export default EventBroker;
