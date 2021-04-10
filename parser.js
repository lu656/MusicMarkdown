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