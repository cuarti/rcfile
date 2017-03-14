
import {ok, equal, deepEqual} from 'assert';
import {join} from 'path';
import {RCFile} from '..';


describe('RCFile', () => {

    const EXISTENT_FILE_PATH = join(__dirname, '.rc');
    const NONEXISTENT_FILE_PATH = join(__dirname, '.example');

    let existent = new RCFile(EXISTENT_FILE_PATH);
    let nonexistent = new RCFile(NONEXISTENT_FILE_PATH);

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

            RCFile.resolve('test/.rc').then(file => {
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

            RCFile.resolvePath('test/.rc').then(path => {
                equal(path, EXISTENT_FILE_PATH);
                done();
            }).catch(done);

        });

        // TODO: process.cwd() is equals to mocha executable directory. Get some method to test it, with canonical path (..)?
        // it('parent path', done => {
        //
        //     RCFile.resolvePath('test/a/b/.rc').then(path => {
        //         equal(path, EXISTENT_FILE_PATH);
        //         done();
        //     }).catch(err => {
        //         console.error(err);
        //         done(err);
        //     });
        //
        // });

    });

});
