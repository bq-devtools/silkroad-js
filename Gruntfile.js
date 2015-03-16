'use strict';

module.exports = function(grunt) {

    var mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    var ports = {
        server: 9000,
        test: 8000,
        livereload: 35729,
        express: 3000
    };

    grunt.initConfig({

        pkg: grunt.file.readJSON('./package.json'),

        clean: {
            all: ['.tmp', 'dist']
        },

        copy: {
            coverage: {
                expand: true,
                src: [
                    'test/**'
                ],
                dest: '.tmp/coverage/'
            },
            'test-browser': {
                src: ['test/browser/index.html'],
                dest: '.tmp/',
            }
        },

        blanket: {
            coverage: {
                src: ['dist/'],
                dest: '.tmp/coverage/dist/'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'src/{,**/}*.js',
                '!src/cryptography.js', // vendor @todo remove or clean this dep
                'test/{,**/}*.js',
                'examples/{,**/}*.js'
            ]
        },
        execute: {
            nodeapp: {
                src: ['examples/nodeapp/main.js']
            }
        },
        open: {
            webapp: {
                path: 'http://localhost:' + ports.server,
                app: 'google-chrome'
            },
            test: {
                path: 'http://localhost:' + ports.test,
                app: 'google-chrome'
            }
        },
        'node-inspector': {
            options: {
                'web-port': 3001,
                'web-host': 'localhost',
                'debug-port': 5857,
                'node-debug': true,
                'save-live-edit': true,
                'no-preload': true,
                'stack-trace-limit': 4,
                'hidden': ['node_modules']
            }
        },
        connect: {
            options: {
                hostname: '0.0.0.0',
                livereload: ports.livereload
            },
            webserver: {
                options: {
                    port: ports.server,
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, 'examples/webapp/'),
                            mountFolder(connect, 'dist/'),
                            mountFolder(connect, 'bower_components/'),
                            mountFolder(connect, 'vendor/')
                        ];
                    },
                }
            },
            'test_webserver': {
                options: {
                    port: ports.test,
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.tmp/test/browser/'),
                            mountFolder(connect, 'dist/'),
                            mountFolder(connect, 'bower_components/'),
                            mountFolder(connect, 'vendor/')
                        ];
                    },
                }

            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: ports.livereload
            },
            corbel: {
                files: ['src/**/*']
            },
            webapp: {
                files: [
                    'examples/webapp/**/*',
                    'src/**/*'
                ],
                tasks: ['build']
            },
            nodeapp: {
                files: [
                    'examples/nodeapp/**'
                ]
            },
            test: {
                files: [
                    'test/browser/**',
                    'src/**/*'
                ],
                tasks: ['build', 'test:browser:reload']
            },
            'test-node': {
                files: [
                    'test/browser/**',
                    'src/**/*'
                ],
                tasks: ['build', 'test:node:reload']
            }
        },
        express: {
            options: {
                port: ports.express,
                server: path.resolve('./examples/express/app')
            },
            load: {}
        },
        mochaTest: { //test for nodejs app with mocha
            testCoverage: {
                options: {
                    reporter: 'spec',
                },
                src: ['.tmp/coverage/test/node/test-suite.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: '.tmp/coverage.html'
                },
                src: ['.tmp/coverage/test/node/test-suite.js']
            },
            coveralls: {
                options: {
                    reporter: 'mocha-lcov-reporter',
                    quiet: true,
                    captureFile: '.tmp/lcov.info'
                },
                src: ['.tmp/coverage/test/node/test-suite.js']
            },
            'travis-cov': {
                options: {
                    reporter: 'travis-cov'
                },
                src: ['.tmp/coverage/test/node/test-suite.js']
            },
            tap: {
                options: {
                    reporter: 'tap',
                    captureFile: 'target/node/test_results.dirty.tap', // Optionally capture the reporter output to a file
                    quiet: false // Optionally suppress output to standard out (defaults to false)
                },
                src: ['test/node/test-suite.js']
            },
            ci: {
                src: ['test/node/test-suite.js']
            }
        }, //test for browser app with mocha and phanthom
        'mocha_phantomjs': {
            options: {
                urls: [
                    'http://localhost:' + ports.test /*<%= connect.options.port %>*/
                ],
                setting: [
                    'webSecurityEnabled=false',
                    'remote-debugger-autorun=true',
                    'remote-debugger-port=9002',
                    'ignore-ssl-errors=true'
                ]
            },
            ci: {},
            tap: {
                options: {
                    reporter: 'tap',
                    output: 'target/browser/test_results.dirty.tap'
                }
            }
        },
        coveralls: {
            'default': {
                src: '.tmp/lcov.info'
            }
        },
        lineremover: {
            tap: {
                options: {
                    inclusionPattern: /^(((not )?ok \d)|# \w+ \d|\d..\d).*$/gm
                },
                files: [{
                    expand: true,
                    cwd: 'target',
                    src: [
                        '**/*.dirty.tap'
                    ],
                    dest: 'target/',
                    ext: '.tap'
                }]
            }
        },
        useminPrepare: {
            html: 'src/index.html',
            options: {
                flow: {
                    html: {
                        steps: {
                            js: ['concat']
                        },
                        post: {},
                        dest: 'dist/'
                    }
                }
            }
        },
        preprocess: {
            'default': {
                src: 'src/build/default.js',
                dest: 'dist/corbel.js'
            },
            'polyfills': {
                src: 'src/build/with-polyfills.js',
                dest: 'dist/corbel.with-polyfills.js'
            },
            'test-browser': {
                src: 'test/browser/test-suite.js',
                dest: '.tmp/test/browser/test-suite.js'
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('serve:webapp', [
        'build',
        'express:load',
        'execute:nodeapp',
        'connect:webserver',
        'open:webapp',
        'watch:webapp'
    ]);

    grunt.registerTask('serve:webapp:debug', [
        'build',
        'execute:nodeapp',
        'connect:webserver',
        'open:webapp',
        'watch:webapp'
    ]);

    grunt.registerTask('serve:nodeapp', [
        'express:load',
        'execute:nodeapp',
        'watch:nodeapp'
    ]);

    grunt.registerTask('test', [
        'test:browser',
        'test:node'
    ]);

    grunt.registerTask('test:browser', [
        'build',
        'copy:test-browser',
        'preprocess:test-browser',
        'express:load',
        'connect:test_webserver',
        'mocha_phantomjs:ci'
    ]);

    grunt.registerTask('test:node', [
        'build',
        'express:load',
        'mochaTest:ci'
    ]); //'mochaTest:tap', 'lineremover:tap'

    grunt.registerTask('test:browser:reload', [
        'copy:test-browser',
        'preprocess:test-browser',
        'express:load',
        'mocha_phantomjs:ci'
    ]); //mocha_phantomjs:tap, 'lineremover:tap'

    grunt.registerTask('test:node:reload', [
        'express:load',
        'mocha_phantomjs:ci'
    ]); //mocha_phantomjs:tap, 'lineremover:tap'


    grunt.registerTask('serve:test', [
        'test:browser',
        'open:test',
        'watch:test'
    ]);

    grunt.registerTask('serve:test:node', [
        'test:node',
        'open:test',
        'watch:test-node'
    ]);

    grunt.registerTask('test:tap', [
        'express:load',
        'connect:test_webserver',
        'mocha_phantomjs:ci',
        'mochaTest:ci',
        'lineremover:tap'
    ]);

    grunt.registerTask('coverage:node', [
        'clean',
        'jshint',
        'build',
        'blanket',
        'copy:coverage',
        'express:load',
        'mochaTest:testCoverage',
        'mochaTest:coverage',
        'mochaTest:coveralls',
        'mochaTest:travis-cov'
    ]);

    grunt.registerTask('build', ['preprocess:default', 'preprocess:polyfills']);

    grunt.registerTask('dist', ['jshint', 'test']);

};
