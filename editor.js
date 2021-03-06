var _ = require('lodash')

$(function () {
    suggestions = [];

    // Define data source for At.JS.
    datasource = suggestions; // suggestions; //["Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia"];

    // Build data to be used in At.JS config.
    words = $.map(datasource, function (value, i) {
        return {
            'id': i,
            'word': value,
        };
    });

    // Define config for At.JS.
    config = {
        at: '',
        editableAtwhoQueryAttrs: {"data-fr-verified": true},
        data: words,
        displayTpl: '<li>${word}</li>',
        limit: 200
    }

    $('#suggestions').hide()

    $('div#froala-editor')
        .on('froalaEditor.input', function (e, editor) {

            autocompletionTest()
            editor.$el.atwho(config);
            console.log(editor.$el.atwho(config))
            editor.events.on('keydown', function (e) {
                if (e.which == $.FroalaEditor.KEYCODE.ENTER && editor.$el.atwho('isSelecting')) {
                    return false;
                }
            }, true);
        })
        .froalaEditor({
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo'],
            pluginsEnabled: null,
            spellcheck: true,
            height: 300
            //toolbarInline: true,
        })
    /*     var input = $("#froala-editor");
        input.on('keyup', function (e) {
            if (e.which <= 90 && e.which >= 48) {
                var html = $('div#froala-editor').froalaEditor('html.get');
                var text = extractContent(html)
                //console.log(text)
                var n = text.split(" ");
                word = n[n.length - 1];


                //awesompleteInject(word)
                //suggestionClick()
                //console.log(window.getSelection().baseOffset)
                //html += '<div id="suggestions" class="list-group list-group-horizontal"></div>';
                //$('#froala-editor').froalaEditor('html.set', html, false)
                //$('#froala-editor').froalaEditor('html.insert', '', false)
                //console.log(text)
                //height = (html.match(/<p>/g) || []).length;
                //height += (html.match(/<br>/g) || []).length;
                //console.log(height)
                //placeDiv(window.getSelection().baseOffset, -250 + (height * 20))
                getSuggestions(word)
                datasource = suggestions; //["Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia"];

                // Build data to be used in At.JS config.
                words = $.map(datasource, function (value, i) {
                    return {
                        'id': i,
                        'word': value,
                    };
                });

                // Define config for At.JS.
                config = {
                    at: '',
                    data: words,
                    editableAtwhoQueryAttrs: {"data-fr-verified": true},
                    displayTpl: '<li>${word}</li>',
                    limit: 200
                }

            }

        }) */

    /* $("#froala-editor" ).autocomplete({
      source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ]
    }); */


});

function getSuggestions(text) {
    var dataList = $('#suggestions')
    //suggestions = []
    $.getJSON('https://api.datamuse.com/sug?s=' + text + '*&max=5', function (json) {
        json = _.sortBy(json, ['word'])
        //console.log(json)

        suggestionBox = '<ul id="suggestionList">'
        for (i = 0; i < json.length; i++) {
            suggestions[i] = json[i].word
            suggestionBox += '<button class="list-group-item list-group-item-action" onclick="wordhintOnClick(this)">' + json[i].word + '</button>'
            var option = document.createElement('option');
            dataList.append(option);
        }
        suggestionBox += '</ul>'
        //console.log((suggestions))
        if (suggestions.length > 0) {
            $('#suggestions').html(suggestionBox)
            $('#suggestions').show()
        } else {
            //$('#suggestions').hide()
        }

        /* var input = document.getElementById("froala-editor");
        var awesomplete = new Awesomplete(input);
        awesomplete.list = suggestions */

        //new Awesomplete(document.querySelector("div#froala-editor"),{ list: suggestions });
                datasource = suggestions; //["Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia"];

        // Build data to be used in At.JS config.
        words = $.map(datasource, function (value, i) {
            return {
                'id': i,
                'word': value,
            };
        });

        // Define config for At.JS.
        config = {
            at: '',
            //editableAtwhoQueryAttrs: {"data-fr-verified": true},
            data: words,
            displayTpl: '<li>${word}</li>',
            limit: 200
        }
    })
}

function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};

function suggestionClick() {
    $('#suggestionList').click(function (event) {
        if (event.target.parentElement.id = 'suggestionList') {
            var text = $(event.target).text();
            //console.log(event.target.parentElement.id)
            var html = $('div#froala-editor').froalaEditor('html.get');
            var content = extractContent(html)
            var n = content.split(" ");
            word = n[n.length - 1];
            //html.replace(/word/,'')
            /* $('#froala-editor').froalaEditor('html.cleanEmptyTags');
            $('#froala-editor').froalaEditor('html.set','', true);
            $('#froala-editor').froalaEditor('html.set', html, true); */
            for (i = 0; i < word.length; i++) {
                $('#froala-editor').froalaEditor('cursor.backspace');
            }
            //if(word!==text)
            $('#froala-editor').froalaEditor('html.insert', text + ' ', true);

            $('#suggestion').hide()
        }
    });
}

function wordhintOnClick(target) {
    text = $(target).text()
    var html = $('div#froala-editor').froalaEditor('html.get');
    var content = extractContent(html)
    var n = content.split(" ");
    word = n[n.length - 1];

    for (i = 0; i < word.length; i++) {
        $('#froala-editor').froalaEditor('cursor.backspace');
    }
    //if(word!==text)
    $('#froala-editor').froalaEditor('html.insert', text + ' ', true);
    $('suggestions').hide()
}
/* var quill = new Quill('#quill-editor', {
    theme: 'snow'
}); */
/* function doGetCaretPosition(oField) {

    // Initialize
    var iCaretPos = 0;

    // IE Support
    if (document.selection) {

        // Set focus on the element
        oField.focus();

        // To get cursor position, get empty selection range
        var oSel = document.selection.createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0')
        iCaretPos = oField.selectionStart;

    // Return results
    return iCaretPos;
} */

/* function placeDiv(x_pos, y_pos) {
    var d = document.getElementById('suggestions');
    d.style.position = "absolute";
    d.style.left = x_pos + 'px';
    d.style.top = y_pos + 'px';
    d.style.zIndex = 5;
} */

function autocompletionTest(e) {
    
        var html = $('div#froala-editor').froalaEditor('html.get');
        var text = extractContent(html)
        //console.log(text)
        var n = text.split(" ");
        word = n[n.length - 1];


        //awesompleteInject(word)
        //suggestionClick()
        //console.log(window.getSelection().baseOffset)
        //html += '<div id="suggestions" class="list-group list-group-horizontal"></div>';
        //$('#froala-editor').froalaEditor('html.set', html, false)
        //$('#froala-editor').froalaEditor('html.insert', '', false)
        //console.log(text)
        //height = (html.match(/<p>/g) || []).length;
        //height += (html.match(/<br>/g) || []).length;
        //console.log(height)
        //placeDiv(window.getSelection().baseOffset, -250 + (height * 20))
        getSuggestions(word)




    
}