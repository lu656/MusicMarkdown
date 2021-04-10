var getSharps = {
    "CM": 0,
    "Am": 0,
    "GM": 1,
    "Em": 1,
    "DM": 2,
    "Bm": 2,
    "AM": 3,
    "F#m": 3,
    "EM": 4,
    "C#M": 4,
    "BM": 5,
    "G#m": 5,
    "F#M": 6,
    "D#m": 6,
    "C#M": 7,
    "A#m": 7,
    "FM": -1,
    "Dm": -1,
    "BbM": -2,
    "Gm": -2,
    "EbM": -3,
    "Cm": -3,
    "AbM": -4,
    "Fm": -4,
    "DbM": -5,
    "Bbm": -5,
    "GbM": -6,
    "Ebm": -6,
    "CbM": -7,
    "Abm": -7
};

function evaluate(lexedInfo) {
    function handleNote(note, staffNo) {
        staffNo = "<staff>" + staffNo + "</staff>";
        note = note.substring(1, note.length - 1);
        note = note.split(' ');
        let step = "<step>" + note[0].trim() +"</step>";
        let octave = "<octave>" + note[1].trim() + "</octave>";
        let duration = "<duration>" + note[2].trim() + "</duration>";
        let noteType = "<type>" + note[3].trim() + "</type>";
        return "<note><pitch>" + step + octave + "</pitch>" + duration + noteType + staffNo + "</note>";
    }
    function handleChord (chord, staffNo) {
        let tempString = "";
        for (let i = 0; i < chord.length; i++) {
            let type = chord.type;
            let note = chord.note;
            tempString += handleNote(note, staffNo); 
        }
        return tempString;
    }
    function handleMeasure (measure, isPiano) {
        let tempString = "";
        for (let i = 0; i < measure.length; i++) {
            let metadata = measure.measureMeta;
            if (metadata.length) {
                metadata = metadata.substring(1, metadata.length - 1);
                metadata = metadata.split(",")
                let clef = "<clef><sign>" + metadata[0].trim() + "</sign></clef>";
                let timeSig = metadata[1].trim();
                let keySig = "<key><fifths>" + getSharps[metadata[2].trim()] + "</fifths></key>";
                tempString += "<attributes><divisions>1</divisions>";
                timeSig = "<time><beats>" + timeSig.split("/")[0] + "</beats><beat-type>" + timeSig.split("/")[1] + "</beat-type>";
                if (isPiano) {
                    let temp = "";
                    temp = "<clef><sign>G</sign><line>2</line><clef><sign>F</sign><line>2</line>";
                    tempString += keySig + timeSig + tempString + "</attributes>";
                } else {
                    tempString += keySig + timeSig + clef + "</attributes>";
                }
            }
            // let tie = measure.tie;
            let chords = measure.chords;
            let notes = measure.notes;
            let staffNo = measure.staffNo;
            if (chords.length) {
                for (let j = 0; j < chords.length; j++) {
                    tempString += handleChord(chords[j], staffNo);
                }
            }
            if (notes.length) {
                for (let j = 0; j < notes.length; j++) {
                    tempString += handleNotes(notes[j], staffNo);
                }
            }
            // if (tie.length) {
            //     tempString += handleTie(tie)
            // }
        }

    }
    function handleInstrument (instrument) {
        let tempString = "";
        let type = instrument.instrument;
        let measures = instrument.measures;
        for (let i = 0; i < instrument.length; i++) {
            if (type === "piano"){
                tempString += (handleMeasure(measures[i], true));
            } else {
                tempString += (handleMeasure(measures[i], false));
            }
        }
    }
    var curString = "<work>";
    for (var i = 0; i < lexedInfo.length; i++) {
        if (lexedInfo[i].type === "author") {
            curString += "<work-number>" + lexedInfo[i].value + "</work-title>";
        } else if (lexedInfo[i].type === "title") {
            curString += "<work-title>" + lexedInfo[i].value + "</work-title>"; 
        } else {
            // type is instrument
            if (curString === "<work>") {
                // no title/author provided
                curString += "<work-title>New Song</work-title></work>";
            }
            for (let j = 0; j < lexedInfo[i].length; j++) {
                curString += handleInstrument(lexedInfo[i][j]);
            }
        }
    }
}