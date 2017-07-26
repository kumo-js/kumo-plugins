'use strict';

class CollectDeploymentOutputs {

    execute(state) {
        return state.outputsStore.collect().then(
            deploymentOutputs => Object.assign({}, state, {deploymentOutputs})
        );
    }
}

module.exports = CollectDeploymentOutputs;
