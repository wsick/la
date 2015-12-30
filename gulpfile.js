var fs = require('fs'),
    typings = require('bower-typings'),
    allTypings = typings(),
    name = 'la',
    meta = {
        name: name,
        src: [
            'typings/*.d.ts',
            'src/_version.ts',
            'src/**/*.ts'
        ].concat(typings({includeSelf: false})),
        scaffolds: [
            {
                name: 'test',
                symdirs: ['dist', 'src'],
                src: [
                    'typings/*.d.ts',
                    'test/**/*.ts',
                    '!test/lib/**/*.ts',
                    'dist/' + name + '.d.ts'
                ].concat(allTypings)
            }
        ]
    };

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
