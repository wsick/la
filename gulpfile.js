var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    typings = require('bower-typings'),
    allTypings = typings(),
    name = 'la',
    meta = {
        name: name,
        src: rel([
            'typings/*.d.ts',
            'src/_version.ts',
            'src/**/*.ts'
        ].concat(typings({includeSelf: false}))),
        scaffolds: [{
            name: 'test',
            symdirs: ['dist', 'src'],
            src: [
                'typings/*.d.ts',
                'test/**/*.ts',
                '!test/lib/**/*.ts',
                'dist/' + name + '.d.ts'
            ].concat(allTypings)
        }]
    };

function rel(patterns) {
    return patterns
        .reduce((prev, cur) => prev.concat(glob.sync(cur)), [])
        .map(file => path.resolve(file));
}

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
