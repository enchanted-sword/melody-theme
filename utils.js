function blogObject (blog, id) {
    let $blogCard = $("<div>", {id: id, class: "blog-card"});
    $blogCard.css("background-color", blog.theme.background_color);
    let $blogHeader = $("<img>", {src: blog.theme.header_image, width: "256px", height: Math.floor(blog.theme.header_full_height / (blog.theme.header_full_width / 256)), class: "blog-header"});
    $blogCard.append($blogHeader);
    let pSrc;
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

function headerObject (npf, id, context, z) {
    let $header = $("<div>", {class: "post-header"});
    let $wrapper = $("<span>");
    $header.append($wrapper);
    let $headerText = $("<b>", {class: "reblog-root"});
    let $headerLink = "";
    let $portrait = "";
    let blog = {};
    let pSrc = "";
    let idf = "";
    let $blogCard = "";
    if (context === "ask") {
        $header.addClass("asker");
        if (npf.layout[0].attribution && npf.layout[0].attribution.blog) {
            blog = npf.layout[0].attribution.blog;
            if ("active" in blog) {
                if (blog.active) {
                    $wrapper.addClass("blog");
                    idf = `askerBlog${id}`;
                    $headerLink = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                    $wrapper.append($headerLink)
                    if (blog.avatar) {pSrc = blog.avatar[2].url;}
                    else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                    $portrait = $("<img>", {class: "portrait", src: pSrc});
                    $headerLink.append($portrait);
                    $headerText.text(`${blog.name} asked:`);
                    $headerLink.append($headerText);
                    $blogCard = blogObject(blog, idf);
                    $wrapper.append($blogCard);
                    $wrapper.mouseenter(function() {
                        $blogCard.show("slow");
                    });
                }
                else {
                    $wrapper.append($headerText);
                    $headerText.text(`${blog.name} asked:`);
                    let $dc = $("<span>deactivated</span>");
                    $dc.css({"color": "#a0a0a0", "font-size": "12px", "margin-left": "8px", "line-height": "12px"});
                    $headerText.append($dc);
                }
            }
            else {
                $wrapper.addClass("blog");
                idf = `askerBlog${id}`;
                $headerLink = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                $wrapper.append($headerLink)
                if (blog.avatar) {pSrc = blog.avatar[2].url;}
                else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                $portrait = $("<img>", {class: "portrait", src: pSrc});
                $headerLink.append($portrait);
                $headerText.text(`${blog.name} asked:`);
                $headerLink.append($headerText);
                $blogCard = blogObject(blog, idf);
                $wrapper.append($blogCard);
                $wrapper.mouseenter(function() {
                    $blogCard.show("slow");
                });
            }
        }
        else {
            $headerText.text("Anonymous asked:");
            $wrapper.append($headerText);
        }
    }
    else if (context === "ans") {
        $header.addClass("answerer");
        if (npf.blog) {
            blog = npf.blog;
            if ("active" in blog) {
                if (blog.active) {
                    $wrapper.addClass("blog");
                    idf = `answererBlog${id}`;
                    $headerLink = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                    $wrapper.append($headerLink)
                    if (blog.avatar) {pSrc = blog.avatar[2].url;}
                    else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                    $portrait = $("<img>", {class: "portrait", src: pSrc});
                    $headerLink.append($portrait);
                    $headerText.text(blog.name);
                    $headerLink.append($headerText);
                    $blogCard = blogObject(blog, idf);
                    $wrapper.append($blogCard);
                    $wrapper.mouseenter(function() {
                        $blogCard.show("slow");
                    });
                }
                else {
                    $wrapper.append($headerText);
                    $headerText.text(blog.name);
                    let $dc = $("<span>deactivated</span>");
                    $dc.css({"color": "#a0a0a0", "font-size": "12px", "margin-left": "8px", "line-height": "12px"});
                    $headerText.append($dc);
                }
            }
            else {
                $wrapper.addClass("blog");
                idf = `answererBlog${id}`;
                $headerLink = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                $wrapper.append($headerLink)
                if (blog.avatar) {pSrc = blog.avatar[2].url;}
                else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                $portrait = $("<img>", {class: "portrait", src: pSrc});
                $headerLink.append($portrait);
                $headerText.text(blog.name);
                $headerLink.append($headerText);
                $blogCard = blogObject(blog, idf);
                $wrapper.append($blogCard);
                $wrapper.mouseenter(function() {
                    $blogCard.show("slow");
                });
            }
        }
        else if (npf.broken_blog_name) {
            $wrapper.append($headerText)
            $headerText.text(npf.broken_blog_name);
        }
        else throw "missing answerer blog name"
    }
    else if (context === "rb") {
        if (npf.blog) {
            blog = npf.blog;
            if ("active" in blog) {
                if (blog.active) {
                    $wrapper.addClass("blog");
                    idf = `blog${z}${id}`;
                    $headerLink = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                    $wrapper.append($headerLink)
                    if (blog.avatar) {pSrc = blog.avatar[2].url;}
                    else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                    $portrait = $("<img>", {class: "portrait", src: pSrc});
                    $headerLink.append($portrait);
                    $headerText.text(blog.name);
                    $headerLink.append($headerText);
                    $blogCard = blogObject(blog, idf);
                    $wrapper.append($blogCard);
                    $wrapper.mouseenter(function() {
                        $blogCard.show("slow");
                    });
                }
                else {
                    $wrapper.append($headerText);
                    $headerText.text(blog.name);
                    let $dc = $("<span>deactivated</span>");
                    $dc.css({"color": "#a0a0a0", "font-size": "12px", "margin-left": "8px", "line-height": "12px"});
                    $headerText.append($dc);
                }
            }
            else {
                $wrapper.addClass("blog");
                idf = `blog${z}${id}`;
                $headerLink = $("<a>", {class: "style-text header-link", href: `${blog.url}/post/${id}`});
                $wrapper.append($headerLink)
                if (blog.avatar) {pSrc = blog.avatar[2].url;}
                else {pSrc = `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;}
                $portrait = $("<img>", {class: "portrait", src: pSrc});
                $headerLink.append($portrait);
                $headerText.text(blog.name);
                $headerLink.append($headerText);
                $blogCard = blogObject(blog, idf);
                $wrapper.append($blogCard);
                $wrapper.mouseenter(function() {
                    $blogCard.show("slow");
                });
            }
        }
        else if (npf.broken_blog_name) {
            $wrapper.append($headerText)
            $headerText.text(npf.broken_blog_name);
        }
        else throw "missing blog name"
    }
    else if (context === "oc") {
        $wrapper.addClass("blog");
        idf = `ocBlog${id}`
        $headerLink = $("<a>", {class: "style-text header-link", href: `https://${blogName}/post/${id}`});
        $wrapper.append($headerLink);
        $portrait = $("<img>", {class: "portrait", src: `https://api.tumblr.com/v2/blog/${blogName}/avatar/96`});
        $headerLink.append($portrait);
        $headerText.text(blogName);
        $headerLink.append($headerText);
        $blogCard = ocBlog(idf);
        $wrapper.append($blogCard);
        $wrapper.mouseenter(function() {
            $blogCard.show("slow");
        });
    }
    else throw "invalid header context"
    return $header
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
            small: "small",
            color: "span"
        }[formatting.type] || "a";
        let startTag = "";
        if (formatting.type === "link" || formatting.type === "mention") {
            startTag = `<a href="${formatting.url}">`;
        }
        else if (formatting.type === "color") {
            startTag = `<span style="color: ${formatting.hex};">`;
        }
        else {startTag = `<${format}>`;}
        let endTag = `</${format}>`;
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
        obj.splice(end, 0, endTag);
    }
    for (let z of obj) {string += z;}
    return string
}

class SubtypeMap {
    constructor(baseContent, id) {
        let index = 0;
        this.map = [];
        for (let n = 0; n < baseContent.length; ++n) {
            if (baseContent[n].subtype && baseContent[n].subtype === "unordered-list-item") {
                if (!baseContent[n-1] || baseContent[n-1].subtype !== "unordered-list-item") {
                    let obj = {start: 0, end: 0, type: "ul", id: `${index}${id}`}
                    this.map.push(obj);
                    this.map[index].start = n;
                    this.map[index].end = n + 1;
                }
                else if (!baseContent[n+1] || baseContent[n+1].subtype !== "unordered-list-item") {
                    ++this.map[index].end;
                    ++index;
                }
                else {++this.map[index].end}
            }
            else if (baseContent[n].subtype && baseContent[n].subtype === "ordered-list-item") {
                if (!baseContent[n-1] || baseContent[n-1].subtype !== "ordered-list-item") {
                    let obj = {start: 0, end: 0, type: "ol", id: `${index}${id}`}
                    this.map.push(obj);
                    this.map[index].start = n;
                    this.map[index].end = n + 1;
                }
                else if (!baseContent[n+1] || baseContent[n+1].subtype !== "ordered-list-item") {
                    ++this.map[index].end;
                    ++index;
                }
                else {++this.map[index].end}
            }
            else continue
        }
    }
}

function constructPost(content, id, $card, i, z, contentWidth, baseContent) {
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
        else if (subtype === "unordered-list-item" || subtype === "ordered-list-item") {
            var idw = z + id;
            var SM = new SubtypeMap(baseContent, idw);
            console.log(SM);
            var map = SM.map
            for (let x = 0; x < map.length; ++x) {
                let m = map[x];
                if (m.start === i) {
                    $list = $(`<${m.type}>`, {class: "l-text", id: m.id});
                    $card.append($list);
                    $li = $("<li>", {class: "li-text"});
                    $list.append($li);
                    $li.append($textWrapper);
                }
                else if (m.start < i && m.end > i) {
                    $li = $("<li>", {class: "li-text"});
                    $(`#${x}${idw}`).append($li);
                    $li.append($textWrapper);
                }
            }
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
            var $source = "";
            $div.append($video);
            $div.addClass("video-wrapper");
            if (content.media) {$source = $("<source>", {src: content.media.url});}
            else {var $source = $("<source>", {src: content.url});}
            $video.append($source);
        }
    }
    else if (type === "poll") {
        var $question = $("<span style=\'font-size: 20px\'></span>");
        $card.append($question);
        $question.text(content.question);
        /* $.ajax({
            url: `https://tumblr.com/api/v2/polls/${e}/${i}/${s}/results`,
            method: 'GET',
        }).done(function (meta, response) {
            if (meta.msg === "ok") {
                var y = content.answers.length;
                var totalVotes = 0;
                for (let z = 0; z < y; ++z) {
                    totalVotes += response.results[z];
                }
                for (let x = 0; x < y; ++x) {
                    var $answer = $("<div>", {class: "poll-answer"});
                    var votes = response.results[x]
                    var pct = Math.round(votes * 1000 / totalVotes)/ 10;
                    $card.append($answer);
                    $answer.text(content.answers[x].answer_text);
                    var $bar = $("<div>", {class: "answer-bar", width: Math.round()});
                    $answer.append($bar);
                }
            }
            else return
        }); */
        $card.append("<p style=\'color: #ff1938;\'>whoops! the poll API isn't publically documented yet. come back later!</p>");
        $card.append(`<small>view this post in <a href="https://www.tumblr.com/blog/view/${blogName}/${id}">blog view</a> to see poll results</small>`);
    }
    if (content.attribution) {
        var data = content.attribution;
        $attrb = $("<a>", {class: "attr", href: data.url});
        if (data.type === "app") {$attrb.text(`Source: ${data.app_name}`);}
        else {$attrb.text(`Source: ${data.url.split("/")[2]}`);}
    }
}
