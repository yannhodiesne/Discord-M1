function updateTitle() {
    var x = document.querySelector('.scroller-1Bvpku').getElementsByClassName("numberBadge-2s8kKX");
    var i;
    var total = 0;
    for (i = 0; i < x.length; i++) {
        total = total + parseInt(x[i].innerHTML, 10);
    }
    if (total) {
        window.electron.setBadge(total);
    } else {
        var pills = document.querySelector('.scroller-1Bvpku')
            .getElementsByClassName("item-2hkk8m");
        
        var showDot = false;

        for (var j = 0; j < pills.length; j++) {
            if (pills[j].offsetHeight === 8) {
                showDot = true;
                break;
            }
        }

        if (showDot) {
            window.electron.setBadge('\u2022');
        } else {
            window.electron.setBadge('');
        }
    }
}

function periodicalCheck() {
    updateTitle();
    setTimeout(function () {
        periodicalCheck();
    }, 5000);
}

var mutationObserver = new MutationObserver(function (mutations) {
    updateTitle();
});
const regex = new RegExp('\([0-9]+\)');
var mutationObserver = new MutationObserver(function (mutations) {
    if (!regex.test(document.title)) {
        updateTitle();
    }
});

function onload() {
    x = document.querySelector(".scroller-1Bvpku")
    mutationObserver.observe(x, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
    mutationObserver.observe(x, {
        childList: true,
        subtree: true,
        characterData: false,
        attributes: false
    });

    var title = document.querySelector('title');
    mutationObserver.observe(title, {
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
    periodicalCheck();
}

function maybeLoad() {
    try {
        onload();
    } catch (error) {
        console.error('failed, trying again in 5')
        setTimeout(function () {
            maybeLoad();
        }, 1000);
    }
}

maybeLoad();
