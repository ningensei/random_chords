
var app = {};

app.start_btn = $('#start_btn');
app.stop_btn = $('#stop_btn');
app.bpm_input = $('#bpm');
app.chord_container = $('#chord_container');
app.chord = $('#chord');
app.chord_p = $('#chord p');
app.ms = 1000;
app.interval = false;
app.filter_chords = [];
app.last_chord = null;
app.measure = 4;
app.count_measure = 1;
app.high_tick = new Audio('sounds/high.wav');
app.low_tick = new Audio('sounds/low.wav');
app.sound = $('#sound');
app.loop = 1;

app.measures = [$('#measure1'), $('#measure2'), $('#measure3'), $('#measure4')];

app.types = [ [$('#maj7'), 1], [$('#dom7'), 2], [$('#m7'), 3], [$('#mmaj7'), 4]];

app.keys = [ [$('#C'), 1], [$('#Csharp'), 2], [$('#D'), 3], [$('#Dsharp'), 4], [$('#E'), 5], [$('#F'), 6], 
    [$('#Fsharp'), 7], [$('#G'), 8], [$('#Gsharp'), 9], [$('#A'), 10], [$('#Asharp'), 11], [$('#B'), 12] ];

app.start_btn.addEventListener('click', function()
{
    if(app.interval) {
        return;
    }

    if(app.bpm_input.value != '') {
        app.ms = parseInt(60000 / app.bpm_input.value);
    }

    // filter by chord type
    app.filters(app.chords, app.types, 3);

    // filter by key type
    app.filters(app.filter_chords, app.keys, 2);
    
    // set measure if defined
    app.set_measure(app.measures);

    app.play();
    
});

app.play = function()
{
    app.interval = setInterval(function(){ 

        count = app.count_measure;
        
        if(app.measure > 1) {
            app.generate_dots();
            app.activate_dot(count-1);
        } else {
            app.kill_dots();
        }

        if(count == 1) {
            if(app.sound.checked) {
                switch(app.measure) {
                    case 1: 
                        app.low_tick.play();
                        break;
                    default: 
                        app.high_tick.play();
                }
            }
            app.set_random_chord();
        } else {

            if(app.sound.checked) {
                app.low_tick.play();
            }
        }

        app.count_measure ++;

        if(app.measure == count) {
            app.count_measure = 1;
        }
        
    }, app.ms);

}

app.disable_inputs = function()
{

}

app.generate_dots = function()
{
    if(app.measure > 1) {
        dots = '';
        for(var i = 0; i < app.measure; i++) {
            dots += "<img/>";
        }
        $('#dots').innerHTML = dots;
    }
}

app.activate_dot = function(number)
{
    dots = $('#dots').getElementsByTagName('img');
    for(var i = 0; i < dots.length; i++) {
        dots[i].src = 'img/dot.png';
    }
    dots[number].src = 'img/dot_active.png';
}

app.kill_dots = function()
{
    $('#dots').innerHTML = '';
}

app.set_measure = function(measures)
{
    for (var i = measures.length - 1; i >= 0; i--) {
        if(measures[i].checked) {
            app.measure = parseInt(measures[i].value);
        }
    }
}

app.set_random_chord = function()
{
    var random = Math.floor((Math.random() * app.filter_chords.length));
    if(random == app.last_chord && app.filter_chords.length > 1) {
        app.set_random_chord();

    } else {
        app.last_chord = random;
        app.chord_p.innerHTML = app.filter_chords[random][0];
        app.chord.style.backgroundColor = app.filter_chords[random][1]; 
    }
    
    
}

app.filters = function(chords_array, inputs, filter_type)
{
    // filter_type: 3 = chord (m7, maj7, etc) // 2 = key (C, C#, D, etc)

    var filters = [];

    var input_selected = false;
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i][0].checked) {
            input_selected = true;
        }
    }

    if(!input_selected) {
        filters = chords_array;
    } else {
        for(var i = 0; i < chords_array.length; i++) {
            for(var j = 0; j < inputs.length; j++) {
                if(inputs[j][0].checked && chords_array[i][filter_type] == inputs[j][1]) {
                    filters.push(chords_array[i]); 
                }
            }
        }

    }
    
    app.filter_chords = filters;
};



app.stop_btn.addEventListener('click', function()
{
    clearInterval(app.interval);
    app.interval = false;
    app.kill_dots();
    app.count_measure = 1;
    app.chord.style.backgroundColor = 'initial';
    app.chord_p.innerHTML = 'Press start to begin';
});

app.chords = [
    // name, color, key, chord_type 
    // (black piano keys are considered the same key. Eg: C# == Db)
    ['C maj7', '#F5BCA9', 1, 1],
    ['C7', '#F5BCA9', 1, 2],
    ['Cm 7', '#F5BCA9', 1, 3],
    ['Cm maj7', '#F5BCA9', 1, 4],

    ['C# maj7', '#F5BCA9', 2, 1],
    ['C#7', '#F5BCA9', 2, 2],
    ['C#m 7', '#F5BCA9', 2, 3],
    ['C#m maj7', '#F5BCA9', 2, 4],

    ['Db maj7', '#CEE3F6', 2, 1],
    ['Db7', '#CEE3F6', 2, 2],
    ['Dbm 7', '#CEE3F6', 2, 3],
    ['Dbm maj7', '#CEE3F6', 2, 4],

    ['D maj7', '#CEE3F6', 3, 1],
    ['D7', '#CEE3F6', 3, 2],
    ['Dm 7', '#CEE3F6', 3, 3],
    ['Dm maj7', '#CEE3F6', 3, 4],

    ['D# maj7', '#CEE3F6', 4 ,1],
    ['D#7', '#CEE3F6', 4, 2],
    ['D#m 7', '#CEE3F6', 4 ,3],
    ['D#m maj7', '#CEE3F6', 4, 4],

    ['Eb maj7', '#E2A9F3', 4, 1],
    ['Eb7', '#E2A9F3', 4, 2],
    ['Ebm 7', '#E2A9F3', 4, 3],
    ['Ebm maj7', '#E2A9F3', 4, 4],

    ['E maj7', '#E2A9F3', 5, 1],
    ['E7', '#E2A9F3', 5, 2],
    ['Em 7', '#E2A9F3', 5, 3],
    ['Em maj7', '#E2A9F3', 5, 4],

    ['F maj7', '#A9F5F2', 6, 1],
    ['F7', '#A9F5F2', 6, 2],
    ['Fm 7', '#A9F5F2', 6, 3],
    ['Fm maj7', '#A9F5F2', 6, 4],

    ['F# maj7', '#A9F5F2', 7, 1],
    ['F#7', '#A9F5F2', 7, 2],
    ['F#m 7', '#A9F5F2', 7, 3],
    ['F#m maj7', '#A9F5F2', 7, 4],

    ['Gb maj7', '#F3F781', 7, 1],
    ['Gb7', '#F3F781', 7, 2],
    ['Gbm 7', '#F3F781', 7, 3],
    ['Gbm maj7', '#F3F781', 7, 4],

    ['G maj7', '#F3F781', 8, 1],
    ['G7', '#F3F781', 8, 2],
    ['Gm 7', '#F3F781', 8, 3],
    ['Gm maj7', '#F3F781', 8, 4],

    ['G# maj7', '#F3F781', 9, 1],
    ['G#7', '#F3F781', 9, 2],
    ['G#m 7', '#F3F781', 9, 3],
    ['G#m maj7', '#F3F781', 9, 4],

    ['Ab maj7', '#A9F5A9', 9, 1],
    ['Ab7', '#A9F5A9', 9, 2],
    ['Abm 7', '#A9F5A9', 9, 3],
    ['Abm maj7', '#A9F5A9', 9, 4],

    ['A maj7', '#A9F5A9', 10, 1],
    ['A7', '#A9F5A9', 10, 2],
    ['Am 7', '#A9F5A9', 10, 3],
    ['Am maj7', '#A9F5A9', 10, 4],

    ['A# maj7', '#A9F5A9', 11, 1],
    ['A#7', '#A9F5A9', 11, 2],
    ['A#m 7', '#A9F5A9', 11, 3],
    ['A#m maj7', '#A9F5A9', 11, 4],

    ['Bb maj7', '#819FF7', 11, 1],
    ['Bb7', '#819FF7', 11, 2],
    ['Bbm 7', '#819FF7', 11, 3],
    ['Bbm maj7', '#819FF7', 11, 4],

    ['B maj7', '#819FF7', 12, 1],
    ['B7', '#819FF7', 12, 2],
    ['Bm 7', '#819FF7', 12, 3],
    ['Bm maj7', '#819FF7', 12, 4]
];


/**
 * Wrapper de document.querySelector().
 * @return HTMLElement
 */
function $(str) {
    return document.querySelector(str);
}
