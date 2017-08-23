var _ = require('lodash')


$(function () {

    $('#suggestions').hide()

    $('div#froala-editor').froalaEditor({
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo'],
        pluginsEnabled: null,
        spellcheck: true,
        height: 300
        //toolbarInline: true,
    })
    var input = $("#froala-editor");
    input.on('keyup', function (e) {
        if (e.which <= 90 && e.which >= 48) {
            var html = $('div#froala-editor').froalaEditor('html.get');
            var text = extractContent(html)
            //console.log(text)
            var n = text.split(" ");
            word = n[n.length - 1];

            getSuggestions(word)
            //awesompleteInject(word)
            suggestionClick()

        }

    })

    /* $("#froala-editor" ).autocomplete({
      source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ]
    }); */


});

function getSuggestions(text) {
    var dataList = $('#suggestions')

    $.getJSON('https://api.datamuse.com/sug?s=' + text + '*&max=5', function (json) {
        json = _.sortBy(json, ['word'])
        //console.log(json)
        suggestions = []
        suggestionBox = '<ul id="suggestionList">'
        for (i = 0; i < json.length; i++) {
            suggestions.push(json[i].word)
            suggestionBox += '<button class="list-group-item list-group-item-action">' + json[i].word + '</button>'
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
    })
}

function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};

function suggestionClick() {
    $(document).click(function (event) {
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
/* var quill = new Quill('#quill-editor', {
    theme: 'snow'
}); */