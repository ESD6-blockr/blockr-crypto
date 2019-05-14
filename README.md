# blockr-crypto
>small library for cryptography operations

|**CI**|**SonarQube**|**Version**|
|:-:|:-:|:-:|
|[![Build Status](https://jenkins.naebers.me/buildStatus/icon?job=Blockr%2Fblockr-crypto%2Fmaster)](https://jenkins.naebers.me/job/Blockr/job/blockr-crypto/job/master/)|[![Quality Gate Status](https://sonarqube.naebers.me/api/project_badges/measure?project=blockr-crypto&metric=alert_status)](https://sonarqube.naebers.me/dashboard?id=blockr-crypto)|[![npm](https://img.shields.io/npm/v/@blockr/blockr-crypto.svg)](https://www.npmjs.com/package/@blockr/blockr-crypto)|

The utilities exposed by this library can be consumed either by `dependency injection` or normal construction.

## Importing

 **ES6**
 ```ts
 import { ObjectHasher } from "@blockr/blockr-crypto";
 ```

 **ES5**
 ```ts
 const ObjectHasher = require("@blockr/blockr-crypto");
 ```
 
## Dependency injection

This library uses `inversify-js` as its dependency injection library. This means the consuming project is required to do the same.

### Example:
>This example uses the `ObjectHasher` util.

*container*
```ts
DIContainer.bind<ObjectHasher>(ObjectHasher).toSelf().inTransientScope();
```

*consumer (typically a service)*
```ts
class MainService {
    private objectHasher: ObjectHasher;

    constructor(@inject(ObjectHasher) objectHasher: ObjectHasher) {
        this.objectHasher = objectHasher;
    }
}
```

## Normal construction

### Example:

*consumer (typically a service)*
```ts
class MainService {
    private objectHasher: ObjectHasher;

    constructor() {
        this.objectHasher = new ObjectHasher();
    }
}
```