class ExerciseAreaListener {

    constructor(browserEvent, exerciseArea) {
        this.browserEvent = browserEvent;
        this.exerciseArea = exerciseArea;
    }

    attach() {
        this.removeListeners = [
            this.browserEvent.on("blur", this.exerciseArea.onBlur.bind(this.exerciseArea)),
            this.browserEvent.on("keydown", this.exerciseArea.onKeydown.bind(this.exerciseArea)),
            this.browserEvent.on("mouseout", this.exerciseArea.onMouseout.bind(this.exerciseArea)),
            this.browserEvent.on("mouseover", this.exerciseArea.onMouseover.bind(this.exerciseArea)),
            this.browserEvent.on("toggle-success", this.exerciseArea.onToggleSuccess.bind(this.exerciseArea))
        ];
    }

    detach() {
        for(let removeListener of this.removeListeners) {
            removeListener();
        }
    }
}

export default ExerciseAreaListener;
