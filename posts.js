function renderPost() {
    let $script = $("script").last();
    let id = $script.attr("idf");
    let npf = JSON.parse($script.html());
    console.log(npf);
    let $post = $(`#post${id}`);
    if (npf.trail.length > 0) {
        for (let z = 0; z < npf.trail.length; ++z) {
            let $body = $("<div>", {class: "post-body"});
            $post.append($body);
            var $card = $("<div>", {id: `ct${z}${id}`, class: "post-card"});
            $body.append($card);
            if (npf.trail[z].layout[0] && npf.trail[z].layout[0].type === "ask") {
                var $ask = $("<div>", {class: "ask"});
                var $askHeader = headerObject(npf.trail[z], id, "ask", z);
                $ask.append($askHeader);
                $card.append($ask);
                var $header = headerObject(npf.trail[z], id, "ans", z);
                $card.append($header);
            }
            else {
                var $header = headerObject(npf.trail[z], id, "rb", z);
                $body.prepend($header);
            }
            $body.append($card);
            for (let i = 0; i < npf.trail[z].content.length; ++i) {
                if (npf.trail[z].layout[0] && npf.trail[z].layout[0].type === "ask" && npf.trail[z].layout[0].blocks[i] === i) {
                    var $card = $ask;
                    var contentWidth = 500;
                }
                else {
                    var $card = $(`#ct${z}${id}`);
                    var contentWidth = 516;
                }
                var baseContent = npf.trail[z].content;
                var content = baseContent[i];
                constructPost(content, id, $card, i, z, contentWidth, baseContent);
            }
        }
    }
    if (npf.content.length > 0) {
        var $body = $("<div>", {class: "post-body"});
        $post.append($body);
        var $card = $("<div>", {id: `cc${id}`, class: "post-card"});
        $body.append($card);
        if (npf.layout[0] && npf.layout[0].type === "ask") {
            var $ask = $("<div>", {class: "ask"});
            var $askHeader = headerObject(npf, id, "ask", 0);
            $ask.append($askHeader);
            $card.append($ask);
        }
        if (npf.trail.length > 0) {
            var $header = headerObject("npf", id, "oc", 0);
            $body.prepend($header);
        }
        for (let i = 0; i < npf.content.length; ++i) {
            if (npf.layout[0] && npf.layout[0].type === "ask" && npf.layout[0].blocks[i] === i) {
                var $card = $ask;
                var contentWidth = 500;
            }
            else {
                var $card = $(`#cc${id}`);
                var contentWidth = 516;
            }
            var baseContent = npf.content;
                var content = baseContent[i];
                constructPost(content, id, $card, i, "og", contentWidth, baseContent);
        }
    }
    if (window.location.href.split("/")[3] === "submit") {
        $submitFrame = $("<iframe>", {id: "submit-frame", frameborder: 0, src: `https://tumblr.com/submit_form/${blogName}.tumblr.com`})
        $card.append($submitFrame);
    }
    else if (window.location.href.split("/")[3] === "ask") {
        $submitFrame = $("<iframe>", {id: "submit-frame", frameborder: 0, src: `https://tumblr.com/ask_form/${blogName}.tumblr.com`})
        $card.append($submitFrame);
    }
}

renderPost();
