
@zenox/rcfile
==

[![Build Status](https://travis-ci.org/cuarti/zenox-rcfile.svg?branch=master)](https://travis-ci.org/cuarti/zenox-rcfile)
[![npm (scoped)](https://img.shields.io/npm/v/@zenox/rcfile.svg)](https://www.npmjs.com/package/@zenox/rcfile)
[![license](https://img.shields.io/github/license/cuarti/rcfile.svg)](https://github.com/cuarti/zenox-rcfile/blob/master/LICENSE)


## Description

NodeJS library builded in typescript to load data from file in bash format. It is part of Zenox Framework.

#### File example

```bash
# Comment
NAME=rcfile
VERSION=1
WORKS=true
```


## Installation
The usage of the module not depend of Zenox framework and can use it in your NodeJS program.

```bash
npm install --save @zenox/rcfile
```


## Documentation

*All the examples are in ES6/ES2015 of Javascript and Typescript.
To use all the features of Typescript, you can use the generic param
on load function.*

### load

Parse and load data from file.

#### Typescript definition
```typescript
declare function load<T extends Object>(path: string, encoding: string = 'utf8'): Promise<T>
```

#### Example
```typescript
import {load} from '@zenox/rcfile';

load('.examplerc').then(data => {
    // ...
});
```

### RCFile

Object representation of file to load.

When resolve or resolvePath functions are called, it gets the real path of given 
canonical path. It checks in order from:
- Absolute path.
- Current working directory path.
- Parents of current working directory path until file system root.

#### Typescript definition
```typescript
declare class RCFile {
    public constructor(path: string, encoding: string = 'utf8');
    public exists(): Promise<boolean>;
    public load<T extends Object>(): Promise<T>;
    public static resolve(filename: string, encoding?: string): Promise<RCFile>;
    public static resolvePath(filename: string): Promise<string>;
}
```

#### RCFile#exists
Check if file exists.

#### RCFile#load
Parse and load data from file.

#### RCFile.resolve
Get existent RCFile object from canonical path

#### RCFile.resolvePath
Get existent path from canonical path

#### Example
```typescript
import {RCFile} from '@zenox/rcfile';

let file = new RCFile('.examplerc');

file.exists().then(exists => {
    // ...
});

file.load().then(data => {
   // ...
});

RCFile.resolve('.examplerc').then(file => {
    // ...
});

RCFile.resolvePath('.examplerc').then(path => {
    // ...
});
```


## License

The source code of the current repository are launched with MIT License.
