'use strict';

class CollectDeploymentOutputs {

    constructor(params) {
        this._context = params.context;
    }

    execute(state) {
        return state.outputsStore.collect().then(deploymentOutputs => {
            this._context.settings.addRefData({deploymentOutputs});
            return Object.assign({}, state, {deploymentOutputs});
        });
    }
}

module.exports = CollectDeploymentOutputs;
