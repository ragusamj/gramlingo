const listeners = {};

class ApplicationEvent {

    on(eventName, callback) {
        listeners[eventName] = listeners[eventName] || [];
        let listenerIndex = listeners[eventName].push(callback) -1;
        let removeListener = () => {
            listeners[name].splice(listenerIndex, 1);
        };
        return removeListener;
    }

    emit(eventName, ...data) {
        setTimeout(() => {
            let callbacks = listeners[eventName];
            if (callbacks) {
                callbacks.forEach((callback) => {
                    if (callback) {
                        callback(...data);
                    }
                });
            }
        }, 0);
    }
}

export default ApplicationEvent;
