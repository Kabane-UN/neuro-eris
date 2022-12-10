$(document).ready(function () {
    let code = 65;
    let canvasSelector = $('#panel');
    canvasSelector.on('button1', function () {
        code--;
        if (code < 65){
            code += 90 - 64;
        }
        $('#selectedLetter').text(String.fromCharCode(code));
    });
    canvasSelector.on('button2', function () {
        let inputSelector = $('#input')
        let text = inputSelector.text();
        inputSelector.text(text+String.fromCharCode(code));
    });
    canvasSelector.on('button3', function () {
        code++;
        if (code > 90){
            code += 65 - 91;
        }
        $('#selectedLetter').text(String.fromCharCode(code));
    });
});