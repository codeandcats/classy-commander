# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.1.0](https://github.com/codeandcats/classy-commander/compare/v4.0.0...v4.1.0) (2024-04-06)


### Features

* remove lodash dependency ([2451321](https://github.com/codeandcats/classy-commander/commit/245132128b37ff1b3f9518a7dda0ed063a5a3265))

## [4.0.0](https://github.com/codeandcats/classy-commander/compare/v3.2.16...v4.0.0) (2023-11-12)


### ⚠ BREAKING CHANGES

* The execute function is now async and will resolve/reject
once the command finishes executing or errors.

This allows for performing global cleanup in your
application's entry point.

### Features

* execute is now async ([dcf648c](https://github.com/codeandcats/classy-commander/commit/dcf648cff5be8fe628cf022257d9dc7d5ebdeae8))


### Bug Fixes

* tsconfig for example app had incorrect files ([5390d29](https://github.com/codeandcats/classy-commander/commit/5390d29bf97d3159860ed8ec0122fc5b860d4d23))

### [3.2.17](https://github.com/codeandcats/classy-commander/compare/v3.2.16...v3.2.17) (2020-09-15)

### [3.2.16](https://github.com/codeandcats/classy-commander/compare/v3.2.15...v3.2.16) (2020-03-02)

<a name="3.2.15"></a>
## [3.2.15](https://github.com/codeandcats/classy-commander/compare/v3.2.14...v3.2.15) (2019-03-11)



<a name="3.2.14"></a>
## [3.2.14](https://github.com/codeandcats/classy-commander/compare/v3.2.13...v3.2.14) (2019-03-09)



<a name="3.2.13"></a>
## [3.2.13](https://github.com/codeandcats/classy-commander/compare/v3.2.12...v3.2.13) (2019-01-27)



<a name="3.2.12"></a>
## [3.2.12](https://github.com/codeandcats/classy-commander/compare/v3.2.11...v3.2.12) (2019-01-27)



<a name="3.2.11"></a>
## [3.2.11](https://github.com/codeandcats/classy-commander/compare/v3.2.10...v3.2.11) (2019-01-27)



<a name="3.2.10"></a>
## [3.2.10](https://github.com/codeandcats/classy-commander/compare/v3.2.9...v3.2.10) (2019-01-27)


### Bug Fixes

* **docs:** fix logo path ([7707315](https://github.com/codeandcats/classy-commander/commit/7707315))



<a name="3.2.9"></a>
## [3.2.9](https://github.com/codeandcats/classy-commander/compare/v3.2.8...v3.2.9) (2019-01-27)



<a name="3.2.8"></a>
## [3.2.8](https://github.com/codeandcats/classy-commander/compare/v3.2.7...v3.2.8) (2019-01-27)



<a name="3.2.7"></a>
## [3.2.7](https://github.com/codeandcats/classy-commander/compare/v3.2.6...v3.2.7) (2018-10-20)



<a name="3.2.6"></a>
## [3.2.6](https://github.com/codeandcats/classy-commander/compare/v3.2.5...v3.2.6) (2018-10-20)



<a name="3.2.5"></a>
## [3.2.5](https://github.com/codeandcats/classy-commander/compare/v3.2.4...v3.2.5) (2018-10-17)



<a name="3.2.4"></a>
## [3.2.4](https://github.com/codeandcats/classy-commander/compare/v3.2.3...v3.2.4) (2018-10-14)



<a name="3.2.3"></a>
## [3.2.3](https://github.com/codeandcats/classy-commander/compare/v3.2.2...v3.2.3) (2018-10-14)



<a name="3.2.2"></a>
## [3.2.2](https://github.com/codeandcats/classy-commander/compare/v3.2.1...v3.2.2) (2018-10-14)



<a name="3.2.1"></a>
## [3.2.1](https://github.com/codeandcats/classy-commander/compare/v3.2.0...v3.2.1) (2018-10-14)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/codeandcats/classy-commander/compare/v3.1.1...v3.2.0) (2018-09-22)


### Features

* **core:** show message when user tries to run command that does not exist ([ba8a840](https://github.com/codeandcats/classy-commander/commit/ba8a840))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/codeandcats/classy-commander/compare/v3.1.0...v3.1.1) (2018-09-18)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/codeandcats/classy-commander/compare/v3.0.0...v3.1.0) (2018-09-18)


### Features

* **core:** add support for variadic values ([340490d](https://github.com/codeandcats/classy-commander/commit/340490d))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/codeandcats/classy-commander/compare/v2.0.1...v3.0.0) (2018-09-16)


### Features

* **core:** will now coerce values to correct type ([1164430](https://github.com/codeandcats/classy-commander/commit/1164430))


### BREAKING CHANGES

* **core:** execute function no longer returns a promise



<a name="2.0.1"></a>
## [2.0.1](https://github.com/codeandcats/classy-commander/compare/v2.0.0...v2.0.1) (2018-09-16)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/codeandcats/classy-commander/compare/v1.2.5...v2.0.0) (2018-09-16)


### Features

* **core:** add commandsFromDirectory function ([1e0a584](https://github.com/codeandcats/classy-commander/commit/1e0a584))


### BREAKING CHANGES

* **core:** execute no longer returns a promise



<a name="1.2.5"></a>
## [1.2.5](https://github.com/codeandcats/classy-commander/compare/v1.2.4...v1.2.5) (2018-09-15)



<a name="1.2.4"></a>
## [1.2.4](https://github.com/codeandcats/classy-commander/compare/v1.2.3...v1.2.4) (2018-09-15)



<a name="1.2.3"></a>
## [1.2.3](https://github.com/codeandcats/classy-commander/compare/v1.2.2...v1.2.3) (2018-09-14)


### Bug Fixes

* **version:** fix bug where version function was not exported ([56bbd53](https://github.com/codeandcats/classy-commander/commit/56bbd53))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/codeandcats/classy-commander/compare/v1.2.1...v1.2.2) (2018-09-14)


### Bug Fixes

* **version:** fix bug from using app-root-path inside a node_module ([2aa7276](https://github.com/codeandcats/classy-commander/commit/2aa7276))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/codeandcats/classy-commander/compare/v1.2.0...v1.2.1) (2018-09-13)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/codeandcats/classy-commander/compare/v1.1.3...v1.2.0) (2018-09-12)


### Features

* **example:** add example code ([ac51bc9](https://github.com/codeandcats/classy-commander/commit/ac51bc9))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/codeandcats/classy-commander/compare/v1.1.2...v1.1.3) (2018-09-11)



<a name="1.1.2"></a>
## [1.1.2](https://github.com/codeandcats/classy-commander/compare/v1.1.1...v1.1.2) (2018-09-11)


### Bug Fixes

* **package:** add missing dependency ([59ce342](https://github.com/codeandcats/classy-commander/commit/59ce342))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/codeandcats/classy-commander/compare/v1.1.0...v1.1.1) (2018-09-11)



<a name="1.1.0"></a>
# 1.1.0 (2018-09-11)


### Features

* **core:** initial checkin of core code ([ada80b1](https://github.com/codeandcats/classy-commander/commit/ada80b1))
