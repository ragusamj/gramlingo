import throttle from "lodash.throttle";

const typingDelay = 250;

class AskTheMachineListener {

    constructor(browserEvent, machine, searchResultVisualizer) {
        this.browserEvent = browserEvent;
        this.machine = machine;
        this.searchResultVisualizer = searchResultVisualizer;
    }

    attach() {
        this.throttledAskTheMachine = throttle((e) => {
            if(e.target.hasAttribute("data-ask-the-machine-input")) {
                let result = this.machine.ask(this.type, e.target.value);
                this.searchResultVisualizer.show(result);
            }
        }, typingDelay, { leading: false });

        this.removeListener = this.browserEvent.on("keyup", this.throttledAskTheMachine);
    }

    detach() {
        this.removeListener();
    }

    setType(type) {
        this.type = type;
    }
}

export default AskTheMachineListener;