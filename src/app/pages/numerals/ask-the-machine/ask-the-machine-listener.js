import throttle from "lodash.throttle";

const typingDelay = 250;

class AskTheMachineListener {

    constructor(browserEvent, machine, searchResultVisualizer) {

        this.throttledAskTheMachine = throttle((e) => {
            if(e.target.hasAttribute("data-ask-the-machine-input")) {
                let result = machine.ask(this.type, e.target.value);
                searchResultVisualizer.show(result);
            }
        }, typingDelay, { leading: false });

        browserEvent.on("keyup", this.throttledAskTheMachine);
    }

    setType(type) {
        this.type = type;
    }
}

export default AskTheMachineListener;