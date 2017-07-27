'use strict';

class SanitizeOutputs {

    execute(state) {
        const taskIds = state.executedTaskIds;
        return state.outputsStore.removeAllExcept(taskIds).then(() => state);
    }
}

module.exports = SanitizeOutputs;
