'use strict';

class ResolveTaskDef {

    execute(state) {
        return state.taskSection.resolve(state.taskVars).then(
            taskDef => Object.assign({}, state, {taskDef})
        );
    }
}

module.exports = ResolveTaskDef;
