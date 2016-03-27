# AFL Season 2016 Tracker

An example [Angular 2](https://angular.io/) app to track the 2016 [AFL](http://afl.com.au) Season.

## Status

Alpha (as of 27/3/2016)

## Why?

As with a lot of developers in the Angular family at the moment, we're developing little apps with the intention of playing with the new toy that is Angular 2. I've taken this opportunity to play with a number of technologies I don't necessarily play with during my day to day development. Top of this list is of cause Angular 2.0 but this project is also using [systemjs](https://github.com/systemjs/systemjs) and [RxJS](http://reactivex.io/rxjs/).

## Instructions

This repo is design to be cloned to an [Apache](https://httpd.apache.org/) (v2.4) web server. I may open this up in the future but for now this choice fits my needs and at the end of the day this app is for me. Sorry. I wouldn't be hard to adapt for [nginx](http://nginx.org/en/) if desired.

## Installation

1. Clone the repo
```
git clone xxx
```

2. Install dependencies
```
npm install
```

3. Deploy a new Apache server or virtual host to use the [/public](public) dir as the document root. You'll also want to ensure that `mod_rewrite` is enabled and that `.htaccess` files are allowed. That or use the [/public/.htaccess](public/.htaccess) file to update your core Apache config.

## Updates

Match (and other) data is bundled in the repo at [/src/cmds/data](src/cmds/data).

To populate the webapp with the latest data, either perform a `git pull` or update the data files manually.

After data files, be sure to run `npm run data`. This will update the data available to the webapp.

## Development

### Automation

I've opted not to use any workflow enhancers such as [Gulp](http://gulpjs.com/), [Grunt](http://gruntjs.com/) or [Webpack](https://webpack.github.io/). Instead I've come up with custom nodejs scripts usable via `npm scripts`.

By default /public only contains a couple files, however after running `npm install` webapp assets should be generated. Should you wish to re-generate these assets run:
```
npm start
```

Tests can be run via:
```
npm test
```

When developing the webapp, you can startup a [browsersync](https://www.browsersync.io/) instance which will automatically compile typescript upon changes via:
```
npm run dev
```

If you're developing tests, you can automatically run tests upon file changes via:
```
npm run dev-tests
```

### Vagrant

If you're like me and you use [Vagrant](https://www.vagrantup.com/) to perform your dev, simply run good old `vagrant up`.

As always, there are some possible gotchas:

- I use [VMWare Fusion](http://www.vmware.com/au/products/fusion), so if you're wanting to use an other provider, be sure to update `config.vm.provider` in the Vagrantfile.
- The static IP `192.168.10.12` has been assigned to the VM. If you're wanting to use a custom hostname, be sure to update your hosts file. You can always alter this IP by updating the `config.vm.network` setting in the Vagrantfile.

## TODO's

This is not a complete project. Here's my (very) rough TODO's.

- ~~Initial Refactor~~
- ~~Git~~
- ~~Interfaces & Comment~~
- ~~Linting~~
- ~~Data Objects~~
- ~~Automation & Packaging & JS mapping~~
- ~~Testing Framework~~
- ~~Initial Readme Page~~
- ~~Initial Readme~~
- Github repo
- Remote testing framework (travis-ci)
- Deploy
- Many more tests
- UI Improvements
- More Stats
