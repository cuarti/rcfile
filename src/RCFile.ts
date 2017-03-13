
import {dirname, join} from 'path';
// import {exists, readFile} from 'fs';
import {exists, readFile, existsSync} from 'fs';
import {EOL} from 'os';


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
     *
     * @param   {string}    path
     * @param   {string}    [encoding]
     * @return  {Promise<RCFile>}
     */
    public static resolve(path: string, encoding?: string): Promise<RCFile> {

        return new Promise((resolve, reject) => {

            this.resolvePath(path).then(path => {
                resolve(new RCFile(path, encoding));

            }).catch(reject);
        });
    }

    /**
     * Resolve absolute path of rcfile
     *
     * @param   {string}    path
     * @return  {Promise<string>}
     * @todo    If path is absolutePath, it have to check only filename
     */
    public static resolvePath(path: string): Promise<string> {

        return new Promise((resolve, reject) => {

            let p;
            let parent = dirname(process.argv[1]);

            if(existsSync(p = join(process.cwd(), path))) {
                return resolve(p);
            }

            while(!existsSync(p = join(parent, path)) && parent !== '/') {
                parent = join(parent, '..');
            }

            //TODO: Always exist or is '/'. Test with other conditions
            if(existsSync(p)) {
                return resolve(p);
            }

            //TODO: Throw an error
            // reject();
        });
    }

    /**
     * Parse text to object
     *
     * @param   {string}    text
     * @return  {T}
     * @private
     * @todo    Use RegExp to control lines format
     * @todo    If there are some incorrect line, throw an error
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
                //TODO: Throw an error
            }

            o[tokens[0]] = tokens[1];
        }

        return o as T;
    }

}
