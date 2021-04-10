var musicXML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">'

console.log(musicXML);

function isTitle(c) {
    const reg = new RegExp('title=[a-zA-Z0-9\- ]+','g');
    console.log(reg.test(c));
    return reg.test(c);
}

function isAuthor(c) {
    const reg = new RegExp('author=[a-zA-Z0-9\- ]+','g');
    console.log(reg.test(c));
    return reg.test(c);
}

function lex(input) {
    var tokens = [];

    return tokens;
}



var parse = function(tokens) {
    var parseTree = [];
    var types = ['title', 'author', 'instrumentHeader', 'instrumentFooter', 'measure', 'measureMeta', 'note', 'tie', 'chord', 'newline'];
    
    var symbols = {};
    var symbol = function (id, type, val) {
        var sym = symbols[id] || {};
        symbols[id] = {
            type: sym.type || type,
            val: sym.value || val
        };
    };
    var getToken = function (token) {
        var sym = Object.create(symbols[token.type]);
        sym.type = token.type;
        sym.value = token.value;
        return sym;
    }

    var i = 0;
    var token = function () {
        return getToken(tokens[i]);
    }
    
    var advance = function () {
        i++;
        return token();
    }
    while (token().type !== "(end)") {

        advance()
    }
    
    return parseTree;
}