// 'use strict';
//
// class ExecuteTasks {
//
//     constructor(params) {
//         this._taskExecutor = params.taskExecutor;
//     }
//
//     execute(state) {
//         return state.tasks.reduce((promise, taskDef) => {
//             return promise.then(appResources => this._taskExecutor.execute(taskDef, appResources));
//         }, Promise.resolve(state.appResources));
//     }
// }
//
// module.exports = ExecuteTasks;