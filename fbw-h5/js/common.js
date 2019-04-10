(function () {
    function w() {
        /*document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + "px";*/
        var r = document.documentElement; //根元素html
        var a = r.clientWidth;
        //按照750的设计稿换算
        if (a > 750) {
            a = 750;
        }
        rem = a / 7.5;
        r.style.fontSize = rem + "px";
    }
    var t;
    w();
    window.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(w, 300);
    }, false);
})();