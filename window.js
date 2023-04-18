function resizeWindow() {
    let width = $(window).width();
    if (width < 1280) {
        let $sidebar = $("#sidebar");
        $("#following").hide();
        $sidebar.hide();
        let $button;
        if ($("#sidebar-button")[0]) {$button = $("#sidebar-button");}
        else {
            $button = $("<button>", {id: "sidebar-button", type: "button"});
            $button.click(function() {
                $sidebar.toggle("slow");
            });
        }
        $button.show();
        $("body").append($button);
        $("body").append($sidebar);
        $sidebar.css({"position": "fixed", "left": "32px"})
        $("#sidebar > *").addClass("toggle-sidebar")
    }
    else {
        if ($("#sidebar-button")) {
            $("#following").show();
            let $button = $("#sidebar-button");
            $button.hide();
            let $sidebar = $("#sidebar");
            $sidebar.show();
            $(".main-body").prepend($sidebar);
            $sidebar.css({"position": "sticky", "top": "0px", "left": "0px"});
        }
        else {return}
    }
}

$(document).ready(resizeWindow);
$(window).resize(resizeWindow);