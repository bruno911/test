/*

003: Create a small gallery with some images of your choice. The images can be stored in a static list (so
you can just use Javascript & HTML, and if you want some CSS, but don’t worry about the look and

feel). Gallery doesn’t have to be of type “slider”, it should be possible to go to the next and previous
image (it doesn’t matter if it’s using arrows, clicking in a part of the image...), but Gallery MUST not
auto-advance.
    We’d like to track each image impression in our own or a third-party real-time analytics system (you can
use any invented url, just make sure that some url with at least an image identifier is called for each
    image impression).
That analytics system is sitting on a completely different domain (for example
    http://dev.test06/index.php) and for the purpose of that exercise is very basic:
        <?php
    $log = "GET:".print_r($_GET,1)."POST:".print_r($_POST,1);
error_log( $log, 3, 'log.log');
    ?>

*/


var Gallery = {

    wrapId: null,
    totalRecords: 0,
    iterator: 0,
    pictureStack: [],
    onNext: null,
    onBack: null,

    build: function (wrapId, pictureStack, onNext, onBack) {
        var buttonNext = '<button onclick="Gallery.next();">Next</button>',
            buttonBack = '<button onclick="Gallery.back();">Back</button>',
            html = '',
            wrapElement;

        if (this.wrapId !== null) {
            alert('Only one galley per page is allowed.');
            return false;
        }

        this.wrapId = wrapId;
        this.totalRecords = pictureStack.length;
        this.iterator = 0;
        this.pictureStack = pictureStack;
        this.onNext = onNext || null;
        this.onBack = onBack || null;

        html += '<table>';

        html += '<tr>';
        html += '<td>';
        html += '<img src="' + this.pictureStack[this.iterator] + '" id="gallery-item" />';
        html += '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<td>';
        html += buttonBack;
        html += buttonNext;
        html += '</td>';
        html += '</tr>';

        html += '</table>';

        wrapElement = document.getElementById(wrapId);

        wrapElement.innerHTML = html;
    },

    next: function () {
        var wrapElement = document.getElementById(this.wrapId),
            imageUrl;

        this.iterator++;

        imageUrl = this.pictureStack[this.iterator];

        if (typeof imageUrl == 'undefined') {
            this.iterator = 0;
            imageUrl = this.pictureStack[this.iterator];
        }

        wrapElement.getElementById('gallery-item').src = imageUrl;

        if (typeof this.onNext == 'function') {
            this.onNext(imageUrl);
        }
    },

    back: function () {
        var wrapElement = document.getElementById(this.wrapId),
            imageUrl;

        this.iterator--;

        imageUrl = this.pictureStack[this.iterator];

        if (typeof imageUrl == 'undefined') {
            this.iterator = this.totalRecords - 1;
            imageUrl = this.pictureStack[this.iterator];
        }

        wrapElement.getElementById('gallery-item').src = imageUrl;

        if (typeof this.onBack == 'function') {
            this.onBack(imageUrl);
        }
    }

};

//Usage
//Html:
//<div class="gallery"></div>
//JS:
Gallery.build(
    'gallery',
    [
        'https://anyurl.com/pic.png',
        'https://anyurl.com/pic1.png',
        'https://anyurl.com/pic2.png',
        'https://anyurl.com/pic3.png',
        'https://anyurl.com/pic4.png'
    ],
    function (imageIdentifier) {
        notifyImageApi('next', imageIdentifier);
    },
    function (imageIdentifier) {
        notifyImageApi('back', imageIdentifier);
    }
);

function notifyImageApi(eventName, imageIdentifier) {
    var formData = new FormData(), xmlHttp;

    formData.append('image', imageIdentifier);
    formData.append('event', eventName);

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("post", "http://dev.test06/index.php");
    xmlHttp.send(formData);
}
