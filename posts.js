function blogObject (blog, id) {
    let $blogCard = $("<div>", {id: id, class: "blog-card"});
    $blogCard.css("background-color", blog.theme.background_color);
    let $blogHeader = $("<img>", {src: blog.theme.header_image, width: "256px", height: Math.floor(blog.theme.header_full_height / (blog.theme.header_full_width / 256)), class: "blog-header"});
    $blogCard.append($blogHeader);
    let pSrc
    if (blog.avatar) {pSrc = blog.avatar[2].url;}
    else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
    let $blogAvatar = $("<img>", {src: pSrc, class: "blog-avatar"});
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
    $c.css("margin", "8px 0px 8px 0px");
    $c.text(blog.description);
    $blogDescription.append($c);
    $blogCard.append($blogDescription);
    $blogCard.click(function() {window.open(blog.url);});
    $blogCard.mouseleave(function() {
        $(`#${id}`).hide("slow");
    });
    return $blogCard
}

function formatEncode(content) {
    let obj = [];
    let string = "";
    for (let x of content.text) {
        obj.push(x);
    }
    for (let n = 0; n < content.formatting.length; ++n) {
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
        if (n === 0) {start = formatting.start}
        else {
            for (let i of content.formatting) {
                if (i.start < formatting.start) {++start;}
                if (i.end < formatting.start) {++start;}
            }
            start += formatting.start;
        }
        for (let k of content.formatting) {
            if (k.start < formatting.end) {++end;}
            if (k.end < formatting.end) {++end;}
        }
        end += formatting.end;
        obj.splice(start, 0, startTag);
        obj.splice(start, 0, endTag);
    }
    for (let z of obj) {string += z;}
    return string
}

function constructPost(content, id, $card, i, contentWidth) {
    var type = content.type;
    if (type === "text") {
        var subtype = content.subtype;
        var $textWrapper = $("<div>", {class: "text-wrapper"});
        $card.append($textWrapper);
        if (content.formatting) {
            $textWrapper.append(formatEncode(content));
        }
        else {$textWrapper.text(content.text);}
        if (subtype) {$textWrapper.addClass(subtype);}
        if (subtype === "heading1") {$textWrapper.css("font-size", "28px");}
        else if (subtype === "heading2") {$textWrapper.css("font-size", "20px");}
        else if (subtype === "quote") {$textWrapper.addClass("serif-text");}
        else if (subtype === "chat") {$textWrapper.addClass("style-text");}
        else if (subtype === "indented") {$textWrapper.css("margin-left", "20px");}
        else if (subtype === "unordered-list-item") {
            $textWrapper.prepend("• ");
            $textWrapper.css("margin-left", "20px");
        }
        if (content.indent_level) {
            $textWrapper.css("margin-left", `${20 * content.indent_level}px`);
        }
    }
    else if (type ==="image") {
        var $div = $("<div>");
        $div.css("position", "relative");
        $card.append($div);
        var media = content.media[0];
        var $img = $("<img>", {class: "image", height: media.height / (media.width / contentWidth), width: contentWidth, src: media.url});
        $div.append($img);
        if (content.alt_text) {
            $img.attr("alt", content.alt_text);
            var $alt = $("<span>", {id: `alt${i}${id}`, class: "alt"});
            $div.append($alt);
            $alt.css("top", `${$img.height() - 32}px`);
            $alt.append("<b>ALT</b>");
            $alt.click(function() {
                if ($(`#alt${i}${id}`).text() === "ALT") {$(`#alt${i}${id}`).text(`Image Description: ${content.alt_text}`);}
                else {$(`#alt${i}${id}`).text("ALT");}
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
            $wrapper.append($span);
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
            $link.append($div);
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
            $div.css("background-color", "transparent");
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
                $info.append(`<h2 style="padding-top 8px" class="track-title"><b>${content.title}</b></h2>`);
            }
            else {
                $info.append(`<h2 style="padding-top 8px" class="track-title"><b>No Title Provided</b></h2>`);
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
            var $videoFrame = $("<iframe>", {width: contentWidth, height: (contentWidth / content.embed_iframe.width) * content.embed_iframe.height, src: content.embed_iframe.url});
            $videoFrame.css({"border": "none", "border-radius": "8px"});
            $div.append($videoFrame);
        }
        else {
            var $video = $("<video>", {class: "video-player", width: contentWidth, controls: ""});
            $div.append($video);
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
            if (npf.trail[z].layout[0] && npf.trail[z].layout[0].type === "ask") {
                var $ask = $("<div>", {class: "ask"});
                var $askHeader = $("<div>", {class: "post-header asker"});
                $ask.append($askHeader);
                var $c = $("<span>", {class: "post-avatar style-text tr"});
                $askHeader.append($c); 
                var $b = $("<b>");
                if (npf.trail[z].layout[0].attribution && npf.trail[z].layout[0].attribution.blog) {
                    $c.addClass("blog");
                    $c.css("margin-left", "8px");
                    var blog = npf.trail[z].layout[0].attribution.blog;
                    var idf = `askerBlog${id}`;
                    $c.append(blogObject(blog, idf));
                    $c.mouseenter(function() {
                        $(`#${idf}`).show("slow");
                    });
                    if (blog.avatar) {var pSrc = blog.avatar[2].url;}
                    else {var pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                    var $portrait = $("<img>", {class: "portrait", src: pSrc});
                    $askHeader.prepend($portrait);
                    $b.text(`${blog.name} asked:`);
                }
                else {$b.text("Anonymous asked:");}
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
                    var $a = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                    $d.append($a);
                    idf = `answererBlog${id}`;
                    if (blog.avatar) {var pSrc = blog.avatar[2].url;}
                    else {var pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                    var $portrait = $("<img>", {class: "portrait", src: pSrc});
                    $a.append($portrait);
                    $e.text(blog.name);
                    $a.append($e);
                    $d.append(blogObject(blog, idf));
                    $d.mouseenter(function() {
                        $(`#${idf}`).show("slow");
                    });
                }
                else {
                    console.log("Error: missing answerer blog object");
                }
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
                        if (blog.avatar) {var pSrc = blog.avatar[2].url;}
                        else {var pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                        var $portrait = $("<img>", {class: "portrait", src: pSrc});
                        $a.append($portrait);
                        $b.text(blog.name);
                        $a.append($b);
                        $s.append(blogObject(blog, idf));
                        $s.mouseenter(function() {
                            $(`#${idf}`).show("slow");
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
            for (let i = 0; i < npf.trail[z].content.length; ++i) {
                if (npf.trail[z].layout[0] && npf.trail[z].layout[0].type === "ask" && npf.trail[z].layout[0].blocks[i] === i) {
                    var $card = $ask;
                    var contentWidth = 500;
                }
                else {
                    var $card = $("<div>", {id: `ct${z}${id}`, class: "post-card"});
                    $body.append($card);
                    var contentWidth = 516;
                }
                var content = npf.trail[z].content[i];
                constructPost(content, id, $card, i, contentWidth);
            }
        }
    }
    if (npf.content.length > 0) {
        var $body = $("<div>", {class: "post-body"});
        $post.append($body);
        if (npf.trail.length > 0) {
            var $header = $("<div>", {class: "post-header"});
                $body.append($header);
                var $s = $("<span>");
                $header.append($s);
                var $b = $("<b>", {class: "reblog-root"});
                var $a = $("<a>", {class: "style-text header-link", href: `https://${blogName}/post/${id}`});
                $s.append($a);
                var $portrait = $("<img>", {class: "portrait", src: `https://api.tumblr.com/v2/blog/${blogName}/avatar/96`});
                $a.append($portrait);
                $b.text(blogName);
                $a.append($b);
        }
        if (npf.layout[0] && npf.layout[0].type === "ask") {
            var $ask = $("<div>", {class: "ask"});
            var $askHeader = $("<div>", {class: "post-header asker"});
            $ask.append($askHeader);
            var $c = $("<span>", {class: "post-avatar style-text tr"});
            $c.css("margin-left", "8px");
            $askHeader.append($c); 
            var $b = $("<b>");
            if (npf.layout[0].attribution && npf.layout[0].attribution.blog) {
                $c.addClass("blog");
                var blog = npf.layout[0].attribution.blog;
                var $a = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                var idf = `askerBlog${id}`;
                $c.append($a);
                $c.append(blogObject(blog, idf));
                $c.mouseenter(function() {
                    $(`#${idf}`).show("slow");
                });
                if (blog.avatar) {var pSrc = blog.avatar[2].url;}
                else {var pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                var $portrait = $("<img>", {class: "portrait", src: pSrc});
                $a.append($portrait);
                $b.text(`${blog.name} asked:`);
                $a.append($b);
            }
            else {
                $b.text("Anonymous asked:");
                $c.append($b);
            }
            var $card = $("<div>", {id: `cc${id}`, class: "post-card"});
            $body.append($card);
            $card.append($ask);
        }
        for (let i = 0; i < npf.content.length; ++i) {
            if (npf.layout[0] && npf.layout[0].type === "ask" && npf.layout[0].blocks[i] === i) {
                var $card = $ask;
                var contentWidth = 500;
            }
            else {
                var $card = $("<div>", {id: `cc${id}`, class: "post-card"});
                $body.append($card);
                var contentWidth = 516;
            }
            var content = npf.content[i];
            constructPost(content, id, $card, i, contentWidth);
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
