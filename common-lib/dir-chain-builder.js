'use strict';

const path = require('path');
const Promise = require('bluebird');

class DirChainBuilder {

    constructor(params) {
        this._fileReader = Promise.promisifyAll(params.fileReader);
    }

    build(startDir, settingsFilename, options) {
        options = Object.assign(this._defaultOptions(), options);
        return this._getDirChain(startDir, settingsFilename).then(chain => {
            chain = options.reverse ? chain.reverse() : chain;
            return chain;
        });
    }

    _getDirChain(dir, settingsFilename) {
        const settingsFile = path.join(dir, settingsFilename);
        return this._readSettings(settingsFile)
            .then(settings => (settings.dependsOn || []).reverse())
            .then(relatedDirs => relatedDirs.map(relatedDir => path.resolve(dir, relatedDir)))
            .then(relatedDirs => this._getDirsChain(relatedDirs, settingsFilename))
            .then(chain => [path.resolve(dir)].concat(chain))
    }

    _getDirsChain(dirs, settingsFilename) {
        return dirs.reduce((promise, dir) => {
            return promise.then(chain =>
                this._getDirChain(dir, settingsFilename)
                    .then(dirChain => chain.concat(dirChain))
            );
        }, Promise.resolve([]));
    }

    _readSettings(settingsFilename) {
        return this._fileReader.readJson(settingsFilename);
    }

    _defaultOptions() {
        return {reverse: false};
    }
}

module.exports = DirChainBuilder;
