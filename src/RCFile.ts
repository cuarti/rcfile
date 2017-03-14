
import {parse, dirname, join} from 'path';
import {exists, readFile} from 'fs';
import {EOL} from 'os';


/**
 * Root path
 *
 * @type    {string}
 * @TODO    To abstract in @zenox/fs
 */
const ROOT = parse(__dirname).root;


/**
 * Run configuration file to load its content and return it
 */
export class RCFile {

    public path: string;
    public encoding?: string;

    /**
     * Constructor method
     *
     * @param   {string}    path
     * @param   {string}    [encoding = 'utf8']
     */
    public constructor(path: string, encoding: string = 'utf8') {
        this.path = path;
        this.encoding = encoding;
    }

    /**
     * Get if file exists
     *
     * @return  {Promise<boolean>}
     */
    public exists(): Promise<boolean> {

        return new Promise(resolve => {
            exists(this.path, exists => resolve(exists));
        });
    }

    /**
     * Load parsed data from file and returns it
     *
     * @return  {Promise<T>}
     */
    public load<T extends Object>(): Promise<T> {

        return new Promise((resolve, reject) => {

            readFile(this.path, this.encoding, (err, text) => {

                if(err) {
                    return reject(err);
                }
                resolve(RCFile.parse(text));
            });
        });

    }

    /**
     * Get existent file
     *
     * @param   {string}    filename
     * @param   {string}    [encoding]
     * @return  {Promise<RCFile>}
     */
    public static resolve(filename: string, encoding?: string): Promise<RCFile> {

        return new Promise((resolve, reject) => {

            this.resolvePath(filename).then(path => {
                resolve(new RCFile(path, encoding));

            }).catch(reject);
        });

    }

    /**
     * Resolve absolute path of rcfile
     *
     * @param   {string}    filename
     * @return  {Promise<string>}
     */
    public static resolvePath(filename: string): Promise<string> {

        return new Promise((resolve, reject) => {

            if(filename.startsWith(ROOT)) {

                return exists(filename, exists => {
                    if(exists) {
                        return resolve(filename);
                    }
                    return reject(new Error(`Path not exists: "${filename}"`));
                });
            }

            let paths = [join(process.cwd(), filename)];

            for(let parent = dirname(process.mainModule.filename); parent !== ROOT; parent = join(parent, '..')) {
                paths.push(join(parent, filename));
            }

            paths.push(join(ROOT, filename));

            return resolve(this.resolvePaths(paths, filename));
        });

    }

    /**
     * Parse text to object
     *
     * @param   {string}    text
     * @return  {T}
     * @private
     * @TODO    Use RegExp to control lines format
     * @TODO    If there are some incorrect line, throws an error
     * @TODO    Set it public and in other file to parse from string?
     */
    private static parse<T extends Object>(text: string): T {

        let lines = text.split(EOL);
        let o = {};

        for(let line of lines) {

            line = line.trim();

            if(line === '' || line.indexOf('#') === 0) {
                continue;
            }

            let tokens = line.split('=').map(l => l.trim());

            if(tokens.length !== 2) {
                //Here throws an error
            }

            o[tokens[0]] = tokens[1];
        }

        return o as T;
    }

    /**
     * Get first existing path of path list
     *
     * @param   {string[]}  paths
     * @param   {string}    filename
     * @param   {number}    [index = 0]
     * @return  {Promise<string>}
     * @TODO    To abstract in @zenox/fs
     */
    private static resolvePaths(paths: string[], filename: string, index: number = 0): Promise<string> {

        return new Promise((resolve, reject) => {

            if(index >= paths.length) {
                return reject(new Error(`No path exists for filename: "${filename}"`));
            }

            let path = paths[index];

            exists(path, exists => {
                return resolve(exists ? path : this.resolvePaths(paths, filename, ++index));
            });

        });

    }

}
