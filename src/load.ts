
import {RCFile} from './RCFile';


/**
 * Load rcfile data and returns it
 *
 * @param   {string}    path
 * @param   {string}    [encoding]
 * @return  {Promise<T>}
 */
export function load<T extends Object>(path: string, encoding?: string): Promise<T> {

    return new Promise((resolve, reject) => {

        RCFile.resolve(path, encoding).then(file => {
            file.load().then(data => resolve(data)).catch(reject);

        }).catch(reject);
    });

}
