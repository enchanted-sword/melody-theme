const ownerBlog = JSON.parse($( "meta[name='ownerBlog']" ).attr("content"));
ownerBlog.name = ownerBlog.url.split("/")[2].split(".")[0];
const whenHeaderLoaded = (e, avatar, about) => {
  const headerHeight = Math.floor(e.target.height / (e.target.width / 256));
  avatar.css("top", `${headerHeight - 60}px`);
  about.css("top", `${headerHeight}px`)
}
const newPopover = (blog, id, wrapper) => {
  const popover = $( "<div>", {id: id, class: "popoverCustom"} );
  wrapper.append(popover);
  popover.css("background-color", blog.theme.background_color);
  const header = $( "<img>", {src: blog.theme.header_image, class: "popoverHeader"} );
  popover.append(header);
  const avatarSrc = blog.avatar ? blog.avatar[2].url : `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;
  const avatar = $( "<img>", {src: avatarSrc, class: "popoverAvatar"} );
  popover.append(avatar);
  if (blog.theme.avatar_shape === "circle") avatar.css("border-radius", "50%");
  const about = $( "<div>", {class: "popoverAbout"} );
  popover.append(about);
  about.css("color", blog.theme.link_color);
  const popoverUrl = $( "<b>", {class: "popoverUrl"} );
  about.append(popoverUrl);
  about.css("color", blog.theme.link_color);
  popoverUrl.text(blog.name);
  const title = $( "<p>", {class: "popoverTitle"} );
  about.append(title);
  title.text(blog.title);
  const description = $( "<p>", {class: "popoverDescription"} );
  about.append(description);
  description.html(blog.description);
  
  header.on("load", (e) => whenHeaderLoaded(e, avatar, about));
  popover.click(() => {window.open(blog.url)});
  popover.mouseleave(() => $( `#${id}` ).hide("slow"));

  return popover;
};
const attribute = (blog, id, wrapper) => {
  wrapper.addClass("blog");
  const attributionLink = $( "<a>", {class: "styleText attributionLink", href: blog.url} );
  wrapper.append(attributionLink);
  const avatarSrc = blog.avatar ? blog.avatar[2].url : `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;
  attributionLink.append($( "<img>", {class: "avatar", src: avatarSrc} ));
  wrapper.append(newPopover(blog, id, wrapper));

  wrapper.mouseenter(() => $( `#${id}` ).show("slow"));

  return attributionLink;
};
const deactivated = () => $( "<span class='deactivated'>deactivated</span>" );
const newHeader = (block, id, type, index) => {
  const header = $( "<header>", {class: "postHeader"} );
  const wrapper = $( "<span>" );
  header.append(wrapper);
  const attribution = $( "<b>", {class: "attribution"} );
  wrapper.append(attribution);
  let blog;
  let attributionLink;
  let idStr;
  if (type === "ask") {
    header.addClass("asker");
    if (block.layout[0]?.attribution?.blog) {
      blog = block.layout[0].attribution.blog;
      if (!("active" in blog) || blog.active) {
        idStr = `popover-ask-${id}`;
        attributionLink = attribute(blog, idStr, wrapper);
        attributionLink.append(attribution);
        attribution.text(`${blog.name} asked:`);
      } else {
        attribution.text(`${blog.name} asked:`);
        attribution.append(deactivated());
      }
    } else {
      wrapper.append(attribution);
      attribution.text("Anonymous asked:");
    }
  } else if (type === "original content") {
    idStr = `popover-${id}`;
    attributionLink = attribute(ownerBlog, idStr, wrapper);
    attributionLink.append(attribution);
    attribution.text(ownerBlog.name);
  } else {
    if (type === "answer") header.addClass("answerer");
    else header.addClass("reblogger");
    if (block.blog) {
      blog = block.blog;
      if (!("active" in blog) || blog.active) {
        idStr = `popover-${index}-${id}`;
        attributionLink = attribute(blog, idStr, wrapper);
        attributionLink.append(attribution);
        attribution.text(blog.name);
      } else {
        attribution.text(blog.name);
        attribution.append(deactivated());
      }
    } else if (block.broken_blog_name) {
      attribution.text(block.broken_blog_name);
    } else console.error("missing blog name");
  }

  return header;
};
const parseFormatting = block => {
  const textArray = [...block.text];
  const formattedArray = [];
  const formatKey = {
    bold: "b",
    italic: "i",
    strikethrough: "s",
    small: "small",
    color: "span"
  };
  block.formatting.forEach(formatting => {
    const type = formatting.type;
    const format = formatKey[type] || "a";
    switch (type) {
      case "link":
        formatting.startTag = `<a href="${formatting.url}">`
        break;
      case "mention":
        formatting.startTag = `<a href="${formatting.blog.url}">`
        break;
      case "color":
        formatting.startTag = `<span style="color: ${formatting.hex};">`;
        break;
      default: 
        formatting.startTag = `<${format}>`;
    }
    formatting.endTag = `</${format}>`;
  });
  textArray.forEach((char, index) => {
    block.formatting.forEach(formatting => {
      if (formatting.end === index) {
        formattedArray.push(formatting.endTag);
      } else if (formatting.start === index) {
        formattedArray.push(formatting.startTag);
      }
    });
    formattedArray.push(char);
  });

  return formattedArray.join("");
};
class ListMap {
  constructor(content, id) {
    let index = 0;
    const listType = ["unordered-list-item", "ordered-list-item"]
    this.map = [];
    this.id = `map-${id}`;
    content.forEach((block, n, content) => {
      if (block.subtype && listType.includes(block.subtype)) {
        if (!content[n - 1] || content[n - 1].subtype !== block.subtype) {
          this.map.push({start: n, end: n + 1, type: `${block.subtype.slice(0, 1)}l`, id: `${id}-${index}`});
        } else if (!content[n + 1] || content[n + 1].subtype !== block.subtype) {
          ++this.map[index].end;
          ++index;
        } else ++this.map[index].end;
      }
    });
  }
  index(n) {
    let list;
    for (const currentMap of this.map) {
      if (currentMap.start <= n && currentMap.end >= n) {
        list = currentMap;
        break;
      }
    }
    return list;
  }
};
class pollResults {
  constructor(json, poll) {
    this.answers = [];
    this.votes = 0;
    const results = json.response.results;
    for (const key in results) {
      this.votes += results[key];
    }
    poll.answers.forEach((answer) => {
      const count = results[answer.client_id];
      this.answers.push({
        text: answer.answer_text,
        votes: count,
        percent: count / this.votes * 100
      });
    });
  }
};
const parsePollResults = (json, poll, id) => {
  const answerWrapper = $( `#${id}` );
  const results = new pollResults(json, poll);
  for (const data of results.answers) {
    answerWrapper.append($( `
    <li class="pollAnswer">
      <span class="voteBar" style="width: ${data.percent}%"></span>
      <span class="pollAnswerText">${data.text}</span>
      <span class="votePercent">${data.percent.toString().match(/\d+\D\d/)}%</span>
      <span class="voteCount">${data.votes} votes</span>
    </li>
    ` ));
  }
  answerWrapper.append($( `<li class="totalVotes">${results.votes} votes</li>` ));
};
const constructContent = (content, id, postCard, layoutBlocks = [], ask = false,) => {
  content.forEach((block, index, parentContent) => {
    let contentWidth = 516;
    let card = postCard;
    if (ask && layoutBlocks[index] === index) {
      contentWidth = 500;
      card = ask;
    }
    switch (block.type) {
      case "text":
        const subtype = block.subtype || "";
        const textWrapper = $( "<div>", {class: `textWrapper ${subtype}`} );
        card.append(textWrapper);
        if (block.formatting) textWrapper.append(parseFormatting(block));
        else textWrapper.text(block.text);
        if (subtype === "unordered-list-item" || subtype === "ordered-list-item") {
          let map = new ListMap(parentContent, id);
          map = map.index(index);
          let list;
          if (index = map.start) {
            list = $( `<${map.type}>`, {class: "inlineList", id: map.id} );
            card.append(list);
          } else list = $( `#${map.id}` );
          const li = $( "<li>" );
          list.append(li);
          li.append(textWrapper);
        }
        if (block.indent_level) {
          textWrapper.css("margin-left", `${20 * block.indent_level}px`);
        }
        break;
      case "image":
        const imageWrapper = $( "<div>", {class: "imageWrapper"} );
        card.append(imageWrapper);
        //set position: relative in .imageWrapper css
        const media = block.media[0];
        const image = $( "<img>", {class: "image", height: media.height / (media.width / contentWidth), width: contentWidth, src: media.url} );
        imageWrapper.append(image);
        if (block.alt_text) {
          image.attr("alt", block.alt_text);
          const alt = $( "<span>", {id: `alt-${id}-${index}`, class: "alt"});
          imageWrapper.append(alt);
          alt.css("top", `${image.height() - 32}px`);
          alt.append("<b>ALT</b>");
          alt.click(() => {
            if ($( `#alt-${id}-${index}` ).text() === "ALT") {
              $( `#alt-${id}-${index}` ).text(`Image Description: ${block.alt_text}`)
            } else $( `#alt-${id}-${index}` ).text("ALT");
          });
        }
        break;
      case "link":
        const link = $( "<a>", {class: "link", target: "_blank", href: block.url} );
        let title;
        card.append(link);
        if (block.title) {
          title = $( `<div class="linkInfo"><b class="linkTitle">${block.title}</b></div>` );
          link.append(title);
          if (block.description) {
            title.append($( `<p>${block.description}</p>` ));
          }
          if (block.site_name) {
            title.append($( `<p class="linkSiteName">${block.site_name}</p>` ));
          }
        }
        if (block.poster) {
          const poster = $( "<div>", {class: "linkPoster"} );
          poster.append($( `<div class="imageWrapper"><img src="${block.poster[0].url}"><div>` ));
          link.append(poster);
          if (title) poster.append(title);
        }
        break;
      case "audio":
        const audioWrapper = $( "<div>", {class: "audioWrapper"} );
        card.append(audioWrapper);
        if (block.embed_html) {
          audioWrapper.append(block.embed_html);
          audioWrapper.css("background-color", "transparent");
        } else {
          block.title ??= "No Title Provided";
          block.artist ??= "No Artist Provided";
          block.title ??= "No Album Provided";
          const info = $( "<div>", {class: "audioInfo"} );
          audioWrapper.append(info);
          const audioPlayer = $( "<audio>", {class: "audioPlayer", controls: "", width: "100%"} );
          audioPlayer.append($( "<source>", {src: block.media ? block.media.url : block.url, type: block.media ? block.media.type : "audio/mpeg"} ));
          audioWrapper.append(audioPlayer);
          if (block.poster[0]) {
            info.append($( "<img>", {class: "audioPoster", src: block.poster[0].url} ));
          }
          info.append($( `
            <h2 class="trackTitle">
              <b>${block.title}</b>
            </h2>
            <p class="trackTitle">${block.artist}</p>
            <p class="trackTitle">${block.album}</p>
          ` ));
          }
        break;
      case "video":
        const videoWrapper = $( "<div>", {class: "videoWrapper"} );
        card.append(videoWrapper);
        if (block.embed_iframe) {
          videoWrapper.append($( "<iframe>", {class: "videoFrame", width: contentWidth, height: (contentWidth / block.embed_iframe.width) * block.embed_iframe.height, src: block.embed_iframe.url} ));
        } else {
          videoPlayer = $( `<video>`, {class: "videoPlayer", width: contentWidth, controls: ""} );
          videoPlayer.append($( `<source src="${block.media?.url || block.url}">` ));
          videoWrapper.append(videoPlayer);
        }
        break;
      case "poll":
        const pollWrapper = $( "<div>", {class: "pollWrapper"} );
        card.append(pollWrapper);
        const question = $( "<span>", {class: "pollQuestion"} );
        pollWrapper.append(question);
        question.text(block.question);
        const answerWrapper = $( "<ul>", {id: `poll-${id}`, class: "answerWrapper"} );
        pollWrapper.append(answerWrapper);
        $.ajax({
          url: `https://api.tumblr.com/v2/polls/${ownerBlog.name}/${id}/${block.client_id}/results`,
          method: "GET",
          dataType: "json",
          success: function (data) {parsePollResults(data, block, answerWrapper.attr("id"))}
        });
        break;
    }
  });
};
const renderPost = post => {
  post = $( post );
  const source = post.find("data");
  if (source.length === 0) return;
  const postId = source.attr("rootid");
  const npf = JSON.parse(source.text());
  console.info(npf);
  post.html("");
  npf.trail.forEach((block, index) => {
    const body = $( "<section>", {class: "postBlock"});
    post.append(body);
    const card = $( "<div>", {id: `post-${postId}-trail-${index}`, class: "postCard"});
    body.append(card);
    if (block.layout[0] && block.layout[0].type === "ask") {
      const ask = $( "<div>", {class: "ask"} );
      card.append(ask);
      ask.append(newHeader(block, postId, "ask", index));
      card.append(newHeader(block, postId, "answer", index));
      constructContent(block.content, postId, card, block.layout[0].blocks, ask);
    } else {
      body.prepend(newHeader(block, postId, "reblog", index));
      constructContent(block.content, postId, card);
    }
  });
  if (npf.content.length) {
    const body = $( "<section>", {class: "postBlock"});
    post.append(body);
    const card = $( "<div>", {id: `post-${postId}-content`, class: "postCard"});
    body.append(card);
    if (npf.layout[0] && npf.layout[0].type === "ask") {
      const ask = $( "<div>", {class: "ask"} );
      card.append(ask);
      ask.append(newHeader(npf, postId, "ask", 0));
      constructContent(npf.content, postId, card, npf.layout[0].blocks, ask);
    } else {
      if (npf.trail.length) body.prepend(newHeader(npf, postId, "original content", 0));
      constructContent(npf.content, postId, card);
    }
  }

  if (window.location.pathname === "/ask" || window.location.pathname === "/submit") {
    submit = $( "<iframe>", {id: "submit", frameborder: 0, src: `https://tumblr.com/${window.location.pathname.split("/")[1]}_form/${ownerBlog.name}.tumblr.com`} );
    post.find(".postCard").append(submit);
  }
};
const offset = element => {
  if (element.length) return element[0].getBoundingClientRect().top - $( window ).height();
  else return 1001;
}
const loadNextPage = data => {
  data = $( data );
  $( "#container" ).append(data.find("article"));
  $( "#container" ).append(data.find(".scrollMarker:not([active='false'])"));
  render();
};
const paginate = async function (next) {
  if (next === "") return;
  const fetchUrl = ownerBlog.url.replace(/\/$/, "").concat(next)
  console.info(`loading next page from ${fetchUrl}`);
  $.ajax({
    url: fetchUrl,
    method: "GET",
    dataType: "html",
    success: function (data) {loadNextPage(data)}
  });
};
const render = () => {
  for (const post of $( ".post figure" )) {
    try {
      renderPost(post);
    } catch (e) {
      console.error("An error occurred while rendering a post");
      console.error(e);
    }
  }
}

render();

$( window ).on("scroll", function () {
  if (offset($( ".scrollMarker:not([active='false'])" ).eq(-1)) <= 1000) {
    const marker = $( ".scrollMarker" ).eq(-1);
    marker.eq(-1).attr("active", "false");
    paginate(marker.text().replace(/\s/g, ""));
  }
});


