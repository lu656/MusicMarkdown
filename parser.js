var musicXML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">'

console.log(musicXML);

function isTitle(c) {
    return /title=[a-zA-Z0-9\- ]+/.test(c);
}

function isAuthor(c) {
    return /author=[a-zA-Z0-9\- ]+/.test(c);
}

function isInstrumentHeader(c) {
    return /[a-zA-Z0-9 \-]+\s*\{/.test(c);
}

function isInstrumentFooter(c) {
    return c == '}';
}

function isMeasure(c) {
    return c == '|';
}

function isMeasureMeta(c) {
    return /\$[TB]{1},\s*[0-9]{1}\/[0-9]{1},\s*[ABCDEF]{1}[b#]{0,1}[mM]{1}\$/.test(c);
}

function isNote(c) {
    return /\([ABCDEF]{1}[b#]{0,1},\s*[0-9]+,\s*[0-9]+\)/.test(c);
}

function isChordHeader(c) {
    return c == '[';
}

function isChordFooter(c) {
    return c == ']';
}

function isTie(c) {
    return c == '-';
}

function isWhitespace(c) {
    return /\s/.test(c);
}

function isNewline(c) {
    return c == "\n";
}

function lex(input) {
    var tokens = [];
    var c = 0;
    var i = 0;
    var advance = function() { 
        return c = input[++i];
    };

    var addToken = function (type, value) {
        tokens.push({
            type: type,
            value: value
        });
    };

    while (i < input.length) {
        c = input[i];
        if (isWhitespace(c)) {
            advance();
        } else if (isNewline(c)) {
            addToken("newline",c);
            advance();
        }else if (isTitle(c)) {
            addToken("title",c);
            advance();
        } else if (isAuthor(c)) {
            addToken("author",c);
            advance();
        } else if (isInstrumentHeader(c)) {
            addToken("instrumentHeader",c);
            advance();
        } else if (isInstrumentFooter(c)) {
            addToken("instrumentFooter",c);
            advance();
        } else if (isMeasure(c)) {
            addToken("measure",c);
            advance();
        } else if (isMeasureMeta(c)) {
            addToken("measureMeta",c);
            advance();
        } else if (isNote(c)) {
            addToken("note",c);
            advance();
        } else if (isChordHeader(c)) {
            addToken("chordHeader",c);
            advance();
        } else if (isChordFooter(c)) {
            addToken("chordFooter",c);
            advance();
        } else if (isTie(c)) {
            addToken("tie",c);
            advance();
        } else {
            throw "Syntax Error";
        }
    }

    addToken("(end)");
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
