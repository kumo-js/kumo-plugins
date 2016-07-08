// 'use strict';
//
// class UndoTasks {
//
//     constructor(params) {
//         this._taskUndoer = params.taskUndoer;
//     }
//
//     execute(state) {
//         return state.tasks.reverse().reduce((promise, taskDef) => {
//             return promise.then(appResources => this._taskUndoer.execute(taskDef, appResources));
//         }, Promise.resolve(state.appResources));
//     }
// }
//
// module.exports = UndoTasks;