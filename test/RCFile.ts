
import {ok, equal, deepEqual} from 'assert';
import {join} from 'path';
import {RCFile} from '..';


describe('RCFile', () => {

    const EXISTENT_FILE_PATH = join(__dirname, '.examplerc');
    const NONEXISTENT_FILE_PATH = join(__dirname, 'file');

    let existent = new RCFile(EXISTENT_FILE_PATH);
    let nonexistent = new RCFile(NONEXISTENT_FILE_PATH);

    it('constructor', () => {
        ok(RCFile instanceof Function);
    });

    describe('#exists()', () => {

        it('existent file', done => {
            existent.exists().then(exists => {
                ok(exists);
                done();
            }).catch(done);
        });

        it('nonexistent file', done => {
            nonexistent.exists().then(exists => {
                ok(!exists);
                done();
            }).catch(done);
        });

    });

    describe('#load()', () => {

        it('same as file', done => {
            existent.load().then(data => {
                deepEqual(data, {NAME: 'rcfile', VERSION: '1', WORKS: 'true'});
                done();
            }).catch(done);
        });

        it('nonExistentFile file', done => {
            nonexistent.load().then(() => {
                ok(false);
                done();
            }).catch(err => {
                deepEqual(err, {errno: -2, code: 'ENOENT', syscall: 'open', path: NONEXISTENT_FILE_PATH});
                done(!err);
            });
        });

    });

    describe('.resolve()', () => {

        it('absolute path', done => {
            RCFile.resolve(EXISTENT_FILE_PATH).then(file => {
                equal(file.path, EXISTENT_FILE_PATH);
                done();
            }).catch(done);
        });

        it('project root path', done => {
            RCFile.resolve('test/.examplerc').then(file => {
                equal(file.path, EXISTENT_FILE_PATH);
                done();
            }).catch(done);
        });

    });

    describe('.resolvePath()', () => {

        it('absolute path', done => {
            RCFile.resolvePath(EXISTENT_FILE_PATH).then(path => {
                equal(path, EXISTENT_FILE_PATH);
                done();
            }).catch(done);
        });

        it('project root path', done => {
            RCFile.resolvePath('test/.examplerc').then(path => {
                equal(path, EXISTENT_FILE_PATH);
                done();
            }).catch(done);
        });

        it('current working path', done => {
            RCFile.resolvePath('../../test/.examplerc').then(data => {
                equal(data, EXISTENT_FILE_PATH);
                done();
            }).catch(done);
        });

    });

});
