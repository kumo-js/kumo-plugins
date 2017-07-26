'use strict';

class SanitizeOutputs {

    execute(state) {
        const taskIds = state.taskDefs.map(t => t.id);
        return state.outputsStore.removeAllExcept(taskIds).then(() => state);
    }
}

module.exports = SanitizeOutputs;
