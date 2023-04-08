function blogObject (blog, id) {
    let $blogCard = $("<div>", {id: id, class: "blog-card"});
    $blogCard.css("background-color", blog.theme.background_color);
    let $blogHeader = $("<img>", {src: blog.theme.header_image, width: "256px", height: Math.floor(blog.theme.header_full_height / (blog.theme.header_full_width / 256)), class: "blog-header"});
    $blogCard.append($blogHeader);
    let blogAvatar = $("<img>", {src: blog.avatar[2].url, class: "blog-avatar"});
    if (blog.theme.avatar_shape === "circle") {$blogAvatar.css("border-radius", "50%")}
    $blogAvatar.css("top", $blogHeader.height() - 60 + "px");
    $blogCard.append($blogAvatar);
    let $blogDescription = $("<div>", {class: "blog-description"});
    $blogDescription.css({"top": $blogHeader.height() + "px", "color": blog.theme.title_color});
    let $a = $("<b>");
    $a.css({"color": blog.theme.link_color, "text-decoration": "none", "font-size": "24px"});
    $a.text(blog.name);
    $blogDescription.append($a);
    let $b = $("<p>");
    $b.css({"font-size": "20px", "margin": "8px 0px 8px 0px", "font-weight": "bold", "hyphens": "auto"});
    $b.text(blog.title);
    $blogDescription.append($b);
    let $c = $("<p>");
    $p.css("margin", "8px 0px 8px 0px");
    $p.text(blog.description);
    $blogDescription.append($p);
    $blogCard.append($blogDescription);
    $blogCard.click(function() {window.open(blog.url);});
    $blogCard.mouseleave(function() {
        $(id).css({"opacity": "0", "visibility": "hidden"});
    });
    return $blogCard
}

function formatEncode(content) {
    let obj = [];
    let string = "";
    for (let x of content.text) {
        obj.push(x);
    }
    for (n of content.formatting) {
        let start = 0;
        let end = 0;
        let formatting = content.formatting[n];
        let format = {
            bold: "b",
            italic: "i",
            strikethrough: "s",
            small: "small"
        }[formatting.type] || "a";
        let startTag = "";
        if (formatting.type === "link") {
            startTag = `<a href="${formatting.url}">`;
        }
        else if (formatting.type === "mention") {
            startTag = `<a href="${formatting.url}">`;
        }
        else {startTag = `<${format}>`;}
        let endTag = `<${format}>`;
        if (n ===0) {start = formatting.start}
        else {
            for (let i of content.formatting.length) {
                if (content.formatting[i].start < formatting.start) {++start;}
                if (content.formatting[i].end < formatting.start) {++start;}
            }
            start += formatting.start;
        }
        for (let k of content.formatting.length) {
            if (content.formatting[i].start < formatting.end) {++end;}
            if (content.formatting[i].end < formatting.end) {++end;}
        }
        end += formatting.end;
        obj.splice(start, 0, startTag);
        obj.splice(start, 0, endTag);
    }
    for (let z of obj) {string += obj[k];}
    return string
}

var $script = $("script").last();
var id = $script.attr("idf");
var sNum = $script.attr("id");
sNum = "c" + sNum.split("s")[1];
var npf = $(`#${sNum}`).text();
$(document).ready(function() {
    let $post = $(`#post${id}`);
    console.log(npf);
    if (npf.trail.length > 0) {
        for (let z of npf.trail) {
            let $body = $("<div>", {class: "post-body"});
            $post.append($body);
            if (npf.trail[z].layout[0] && npf.trail[z].layout[0].type === "ask") {
                var $ask = $("<div>", {class: "ask"});
                $askHeader = $("<div", {class: "post-header asker"});
                $ask.append($askHeader);
                var $c = $("<span>", {class: "post-avatar style-text tr"});
                $c.css("margin-left", "8px");
                $askHeader.append($c); 
                var $b = $("<b>");
                if (npf.trail[z].layout[0].attribution && npf.trail[z].layout[0].attribution.blog) {
                    $c.addClass("blog");
                    var blog = npf.trail[z].attribution.blog;
                    var idf = `askerBlog${id}`;
                    $c.append(blogObject(blog, idf));
                    $c.mouseenter(function() {
                        $(`#${idf}`).css({"visibility": "visible", "opacity": "1"});
                    });
                    var $portrait = $("<img>", {class: "portrait", src: blog.avatar[2].url});
                    $askHeader.prepend($portrait);
                    $b.text(`${blog.name} asked:`);
                }
                else {$b.text("Anonymus asked:");}
                $c.append($b);
                var $card = $("<div>", {id: `ct${z}${id}`, class: "post-card"});
                $body.append($card);
                $card.append($ask);
                var $header = $("<div>", {class: "post-header answerer"});
                $card.append($header);
                var $d = $("<span>", {class: "post-avatar style-text"});
                $header.append($d);
                var $e = $("<b>", {class: "reblog-root"});
                if (npf.trail[z].blog) {
                    $d.addClass("blog");
                    blog = npf.trail[z].blog;
                    idf = `answererBlog${id}`;
                    $d.append(blogObject(blog, idf));
                    $d.mouseenter(function() {
                        $(`#${idf}`).css({"visibility": "visible", "opacity": "1"});
                    });
                    var $portrait = $("<img>", {class: "portrait", src: blog.avatar[2].url});
                    $askHeader.prepend($portrait);
                    $e.text(blog.name);
                }
                else {console.log("Error: missing answerer blog object");}
                $d.append($e);
            }
            else {
                var $header = $("<div>", {class: "post-header"});
                $body.append($header);
                var $s = $("<span>");
                $header.append($s);
                var $b = $("<b>", {class: "reblog-root"});
                if (npf.trail[z].blog) {
                    var blog = npf.trail[z].blog;
                    if (npf.trail[z].blog.active) {
                        $s.addClass("blog");
                        var idf = `blog${z}${id}`;
                        var $a = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                        $s.append($a);
                        var $portrait = $("<img>", {class: "portrait", src: blog.avatar[2].url});
                        $a.append($portrait);
                        $b.text(blog.name);
                        $a.append($b);
                        $s.append(blogObject(blog, idf));
                        $s.mouseenter(function() {
                            $(`#${idf}`).css({"visibility": "visible", "opacity": "1"});
                        });
                    }
                    else {
                        $s.append($b);
                        $b.text(blog.name);
                        var $dc = $("<span>deactivated</span>");
                        $dc.css({"color": "#a0a0a0", "font-size": "12px", "margin-left": "8px", "line-height": "12px"});
                        $b.append($dc);
                    }
                }
                else if (npf.trail[z].broken_blog_name) {
                    $s.append($b)
                    $b.text(npf.trail[z].broken_blog_name);
                }
                else {console.log("Error: missing blog name")}
            }
            for (let i of npf.trail[z].content) {
                if (npf.trail[z].layout[0] && npf.trail[z].layout[0].type === "ask" && npf.trail[z].layout[0].blocks[i] === i) {
                    var $card = $ask;
                }
                else {var $card = $("<div>", {id: `ct${z}${id}`, class: "post-card"})}
                var content = npf.trail[z].content[i];
                var type = content.type;
                if (type === "text") {
                    var subtype = content.subtype;
                    var $p = $("<div>", {class: "text-wrapper"});
                    $card.append($p);
                    if (content.formatting) {
                        $p.append(formatEncode(content));
                    }
                    else {$p.text(content.text);}
                    if (subtype) {$p.addClass(subtype);}
                    if (subtype === "heading1") {$p.css("font-size", "28px");}
                    else if (subtype === "heading2") {$p.css("font-size", "20px");}
                    else if (subtype === "quote") {$p.addClass("serif-text");}
                    else if (subtype === "chat") {$p.addClass("style-text");}
                    else if (subtype === "indented") {$p.css("margin-left", "20px");}
                    else if (subtype === "unordered-list-item") {
                        $p.prepend("• ");
                        $p.css("margin-left", "20px");
                    }
                    if (content.indent_level) {
                        $p.css("margin-left", `${20 * content.indent_level}px`);
                    }
                }
                else if (type ==="image") {
                    var $div = $("<div>");
                    $div.css("position", "relative");
                    $card.append($div);
                    var media = content.media[0];
                    var $img = $("<img>", {class: "image", height: media.height / 516, width: 516, src: media.url});
                    if (content.alt_text) {
                        $img.attr("alt", content.alt_text);
                        var $alt = $("<span>", {id: `alt${i}${id}`, class: "alt"});
                        $alt.css("top", `${$img.height - 32}px`);
                        $alt.append("<b>ALT</b>");
                        $alt.click(function() {
                            if (event.target.text() === "ALT") {event.target.text(`Image Description: ${content.alt_text}`);}
                            else {event.target.text("ALT");}
                        });
                    }
                }
                else if (type === "link") {
                    var $link = $("<a>", {class: "link", target: "_blank", href: content.url});
                    $card.append($link);
                    if (content.poster) {
                        var $wrapper = $("<div>", {class: "wrapper"});
                        $wrapper.css("background-image", `url(${content.poster[0].url})`);
                        $link.append($wrapper);
                        var $span = $("<span>", {class: "poster"});
                        var $title = $(`<h2>${content.title}</h2>`);
                        $title.css({"margin": "8px 0px 8px 0px", "font-weight" : "bold"});
                        $span.append($title);
                        if (content.description) {
                            $span.append(`<span>${content.description}</span><br>`);
                        }
                        if (content.site_name) {
                            $span.append(`<span class="attr">${content.site_name}</span>`);
                        }
                    }
                    else if (content.title) {
                        var $div = $("<div>", {class: "link"});
                        var $title = $(`<h2>${content.title}</h2>`);
                        $title.css({"margin": "8px 0px 8px 0px", "font-weight" : "bold"});
                        $div.append($title);
                        if (content.description) {
                            $div.append(`<span>${content.description}</span><br>`);
                        }
                        if (content.site_name) {
                            $div.append(`<span class="attr">${content.site_name}</span>`);
                        }
                    }
                }
                else if (type === "audio") {
                    var $div = $("<div>", {class: "audio-wrapper"});
                    $card.append($div);
                    if (content.embed_html) {
                        $div.append(content.embed_html);
                    }
                    else {
                        var $info = $("<div>");
                        $info.css("padding", "4px");
                        $div.append($info);
                        var $audio = $("<audio>", {class: "audio-player", controls: ""});
                        $div.append($audio);
                        var $source = $("<source>", {src: content.url});
                        $audio.append($source);
                        if (content.poster) {
                            var $poster = $("<img>", {class: "poster", src: content.poster[0].url});
                            $info.append($poster);
                        }
                        if (content.title) {
                            $info.append(`<h2 style="padding-top 8px" class="track-title><b>${content.title}</b></h2>`);
                        }
                        else {
                            $info.append(`<h2 style="padding-top 8px" class="track-title><b>No Title Provided</b></h2>`);
                        }
                        if (content.artist) {
                            $info.append(`<p class="track-title">${content.artist}</p>`);
                        }
                        else {
                            $info.append(`<p class="track-title">No Artist Provided</p>`);
                        }
                        if (content.album) {
                            $info.append(`<p class="track-title">${content.album}</p>`);
                        }
                        else {
                            $info.append(`<p class="track-title">No Album Provided</p>`);
                        }
                    }
                }
                else if (type === "video") {
                    var $div = $("<div>");
                    $card.append($div);
                    if (content.embed_iframe) {
                        var $videoFrame = $("<iframe>", {width: 516, height: (516 / content.embed_iframe.width) * content.embed_iframe.height, src: content.embed_iframe.url});
                        $videoFrame.css({"border": "none", "border-radius": "8px"});
                        $div.append($videoFrame);
                    }
                    else {
                        var $video = $("<video>", {class: "video-player", width: 516, controls: ""});
                        $div.addClass("video-wrapper");
                        var $source = $("<source>", {src: content.url});
                        $video.append($source);
                    }
                }
                if (content.attribution) {
                    var data = content.attribution;
                    $attrb = $("<a>", {class: "attr", href: data.url});
                    if (data.type === "app") {$attrb.text(`Source: ${data.app_name}`);}
                    else {$attrb.text(`Source: ${data.url.split("/")[2]}`);}
                }
            }
        }
    }
    if (npf.content.length > 0) {
        var $body = $("<div>", {class: "post-body"});
        $post.append($body);
        if (npf.layout[0] && npf.layout[0].type === "ask") {
            var $ask = $("<div>", {class: "ask"});
            $askHeader = $("<div", {class: "post-header asker"});
            $ask.append($askHeader);
            var $c = $("<span>", {class: "post-avatar style-text tr"});
            $c.css("margin-left", "8px");
            $askHeader.append($c); 
            var $b = $("<b>");
            if (npf.trail[z].layout[0].attribution && npf.trail[z].layout[0].attribution.blog) {
                $c.addClass("blog");
                var blog = npf.trail[z].attribution.blog;
                var idf = `askerBlog${id}`;
                $c.append(blogObject(blog, idf));
                $c.mouseenter(function() {
                    $(`#${idf}`).css({"visibility": "visible", "opacity": "1"});
                });
                var $portrait = $("<img>", {class: "portrait", src: blog.avatar[2].url});
                $askHeader.prepend($portrait);
                $b.text(`${blog.name} asked:`);
            }
            else {$b.text("Anonymus asked:");}
            var $card = $("<div>", {id: `cc${id}`, class: "post-card"});
            $body.append($card);
            $card.append($ask);

        }
        for (let i of npf.content) {
            if (npf.layout[0] && npf.layout[0].type === "ask" && npf.layout[0].blocks[i] === i) {
                var $card = $ask;
            }
            else {var $card = $("<div>", {id: `cc${id}`, class: "post-card"})}
            var content = npf.trail[z].content[i];
            var type = content.type;
            if (type === "text") {
                var subtype = content.subtype;
                var $p = $("<div>", {class: "text-wrapper"});
                $card.append($p);
                if (content.formatting) {
                    $p.append(formatEncode(content));
                }
                else {$p.text(content.text);}
                if (subtype) {$p.addClass(subtype);}
                if (subtype === "heading1") {$p.css("font-size", "28px");}
                else if (subtype === "heading2") {$p.css("font-size", "20px");}
                else if (subtype === "quote") {$p.addClass("serif-text");}
                else if (subtype === "chat") {$p.addClass("style-text");}
                else if (subtype === "indented") {$p.css("margin-left", "20px");}
                else if (subtype === "unordered-list-item") {
                    $p.prepend("• ");
                    $p.css("margin-left", "20px");
                }
                if (content.indent_level) {
                    $p.css("margin-left", `${20 * content.indent_level}px`);
                }
            }
            else if (type ==="image") {
                var $div = $("<div>");
                $div.css("position", "relative");
                $card.append($div);
                var media = content.media[0];
                var $img = $("<img>", {class: "image", height: media.height / 516, width: 516, src: media.url});
                if (content.alt_text) {
                    $img.attr("alt", content.alt_text);
                    var $alt = $("<span>", {id: `alt${i}${id}`, class: "alt"});
                    $alt.css("top", `${$img.height - 32}px`);
                    $alt.append("<b>ALT</b>");
                    $alt.click(function() {
                        if (event.target.text() === "ALT") {event.target.text(`Image Description: ${content.alt_text}`);}
                        else {event.target.text("ALT");}
                    });
                }
            }
            else if (type === "link") {
                var $link = $("<a>", {class: "link", target: "_blank", href: content.url});
                $card.append($link);
                if (content.poster) {
                    var $wrapper = $("<div>", {class: "wrapper"});
                    $wrapper.css("background-image", `url(${content.poster[0].url})`);
                    $link.append($wrapper);
                    var $span = $("<span>", {class: "poster"});
                    var $title = $(`<h2>${content.title}</h2>`);
                    $title.css({"margin": "8px 0px 8px 0px", "font-weight" : "bold"});
                    $span.append($title);
                    if (content.description) {
                        $span.append(`<span>${content.description}</span><br>`);
                    }
                    if (content.site_name) {
                        $span.append(`<span class="attr">${content.site_name}</span>`);
                    }
                }
                else if (content.title) {
                    var $div = $("<div>", {class: "link"});
                    var $title = $(`<h2>${content.title}</h2>`);
                    $title.css({"margin": "8px 0px 8px 0px", "font-weight" : "bold"});
                    $div.append($title);
                    if (content.description) {
                        $div.append(`<span>${content.description}</span><br>`);
                    }
                    if (content.site_name) {
                        $div.append(`<span class="attr">${content.site_name}</span>`);
                    }
                }
            }
            else if (type === "audio") {
                var $div = $("<div>", {class: "audio-wrapper"});
                $card.append($div);
                if (content.embed_html) {
                    $div.append(content.embed_html);
                }
                else {
                    var $info = $("<div>");
                    $info.css("padding", "4px");
                    $div.append($info);
                    var $audio = $("<audio>", {class: "audio-player", controls: ""});
                    $div.append($audio);
                    var $source = $("<source>", {src: content.url});
                    $audio.append($source);
                    if (content.poster) {
                        var $poster = $("<img>", {class: "poster", src: content.poster[0].url});
                        $info.append($poster);
                    }
                    if (content.title) {
                        $info.append(`<h2 style="padding-top 8px" class="track-title><b>${content.title}</b></h2>`);
                    }
                    else {
                        $info.append(`<h2 style="padding-top 8px" class="track-title><b>No Title Provided</b></h2>`);
                    }
                    if (content.artist) {
                        $info.append(`<p class="track-title">${content.artist}</p>`);
                    }
                    else {
                        $info.append(`<p class="track-title">No Artist Provided</p>`);
                    }
                    if (content.album) {
                        $info.append(`<p class="track-title">${content.album}</p>`);
                    }
                    else {
                        $info.append(`<p class="track-title">No Album Provided</p>`);
                    }
                }
            }
            else if (type === "video") {
                var $div = $("<div>");
                $card.append($div);
                if (content.embed_iframe) {
                    var $videoFrame = $("<iframe>", {width: 516, height: (516 / content.embed_iframe.width) * content.embed_iframe.height, src: content.embed_iframe.url});
                    $videoFrame.css({"border": "none", "border-radius": "8px"});
                    $div.append($videoFrame);
                }
                else {
                    var $video = $("<video>", {class: "video-player", width: 516, controls: ""});
                    $div.addClass("video-wrapper");
                    var $source = $("<source>", {src: content.url});
                    $video.append($source);
                }
            }
            if (content.attribution) {
                var data = content.attribution;
                $attrb = $("<a>", {class: "attr", href: data.url});
                if (data.type === "app") {$attrb.text(`Source: ${data.app_name}`);}
                else {$attrb.text(`Source: ${data.url.split("/")[2]}`);}
            }
        }
    }
});
