
import {ok, equal, deepEqual} from 'assert';
import {join} from 'path';
import {RCFile} from '..';


describe('RCFile', () => {

    let existent = new RCFile(join(__dirname, '.rc'));
    let nonexistent = new RCFile(join(__dirname, '.example'));

    describe('#exists()', () => {

        it('existent file', done => {
            existent.exists().then(exists => {
                ok(exists);
                done();
            }).catch(done);
        });

        it('', done => {
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
                deepEqual(err, {errno: -2, code: 'ENOENT', syscall: 'open', path: join(__dirname, '.example')});
                done(!err);
            });

        });

    });

    describe('.resolve()', () => {

        it('project root path', done => {

            RCFile.resolve('test/.rc').then(file => {
                equal(file.path, join(__dirname, '.rc'));
                done();
            }).catch(done);

        });

    });

    describe('.resolvePath()', () => {

        it('project root path', done => {

            RCFile.resolvePath('test/.rc').then(path => {
                equal(path, join(__dirname, '.rc'));
                done();
            }).catch(done);

        });

        // TODO: process.cwd() is equals to mocha executable directory
        // it('parent path', done => {
        //
        //     RCFile.resolvePath('test/a/b/.rc').then(path => {
        //         equal(path, join(__dirname, '.rc'));
        //         done();
        //     }).catch(err => {
        //         console.error(err);
        //         done(err);
        //     });
        //
        // });

    });

});
