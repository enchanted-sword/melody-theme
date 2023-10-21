const ownerBlog = JSON.parse($( "meta[name='ownerBlog']" ).attr("content"));
ownerBlog.name = ownerBlog.url.split("/")[2].split(".")[0];
const whenLoaded = (blog, popover, header) => {
  const headerHeight = Math.floor(header[0].height / (header[0].width / 256));
  const avatarSrc = blog.avatar ? blog.avatar[2].url : `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;
  const avatar = $( "<img>", {src: avatarSrc, class: "popoverAvatar"} );
  popover.append(avatar);
  avatar.css({"top": `${headerHeight - 60}px`});
  if (blog.theme.avatar_shape === "circle") avatar.css("border-radius", "50%");
  const about = $( "<div>", {class: "popoverAbout"} );
  popover.append(about);
  about.css({"top": `${headerHeight}px`, "color": blog.theme.link_color});
  const popoverUrl = $( "<b>", {class: "popoverUrl"} );
  about.append(popoverUrl);
  about.css("color", blog.theme.link_color);
  popoverUrl.text(blog.name);
  const title = $( "<p>", {class: "popoverTitle"} );
  about.append(title);
  title.text(blog.title);
  const description = $( "<p>", {class: "popoverDescription"} );
  about.append(description);
  description.text(blog.description);
};
const newPopover = (blog, id) => {
  const popover = $( "<div>", {id: id, class: "popoverCustom"} );
  popover.css("background-color", blog.theme.background_color);
  const header = $( "<img>", {src: blog.theme.header_image, class: "popoverHeader"} );
  popover.append(header);
  header.on("load", whenLoaded(blog, popover, header));

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
  wrapper.append(newPopover(blog, id));
  wrapper.mouseenter(() => $( `#${id}` ).show("slow"));
  return attributionLink;
};
const deactivated = () => $( "<span>deactivated</span>", {class: "deactivated"} );
//add color: #a0a0a0; font-size: 12px; margin-left: 8px; line-height: 12px to .deactivated css
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
  const arr = [...block.text];
  const formatKey = {
    bold: "b",
    italic: "i",
    strikethrough: "s",
    small: "small",
    color: "span"
  };
  block.formatting.forEach((formatting, index, formattingArray) => {
    let start = formatting.start;
    let end = formatting.end;
    let startTag;
    const type = formatting.type;
    const format = formatKey[type] || "a";
    const endTag = `</${format}>`;
    switch (type) {
      case "link" || "mention":
        startTag = `<a href="${formatting.url}">`
        break;
      case "color":
        startTag = `<span style="color: ${formatting.hex};">`;
        break;
      default: 
        startTag = `<${format}>`;
    }
    formattingArray.forEach((obj, superIndex) => {
      if (index === 0) start = formatting.start;
      else {
        if (obj.start < formatting.start) ++start;
        if (obj.end < formatting.start) ++start;
        if (obj.type === type && obj.end === formatting.start) ++start
      }
      if (obj.start < formatting.end && index >= superIndex) ++end;
      if (obj.end < formatting.end) ++end;
    });
    console.log(start, end, startTag);
    arr.splice(start, 0, startTag);
    arr.splice(end, 0, endTag);
  });

  return arr.join("");
};
class ListMap {
  constructor(content, id) {
    let index = 0;
    this.map = [];
    this.id = `map-${id}`;
    content.forEach((block, n, content) => {
      if (block.subtype) {
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
const constructContent = (content, id, card, isAsk = false) => {
  content.forEach((block, index, parentContent) => {
    let contentWidth = 516;
    if (index === 0 && isAsk) {
      contentWidth = 500;
    }
    switch (block.type) {
      case "text":
        const subtype = block.subtype || "";
        const textWrapper = $( "<div>", {class: `textWrapper ${subtype}`} );
        card.append(textWrapper);
        if (block.formatting) textWrapper.append(parseFormatting(block));
        else textWrapper.text(block.text);
        //handle general subtypes through css
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
        card.append(link);
        if (block.title) {
          const title = $( `<span><b class="linkTitle">${block.title}</b></span>`, {class: "linkInfo"} );
          link.append(title);
          //set margin: 8px 0; font-size: 20px? in .linkTitle css
          if (block.description) {
            title.append($( `<span>${block.description}</span><br>` ));
          }
          if (block.site_name) {
            title.append($( `<span>${block.site_name}</span>`, {class: "linkAttribution"} ));
          }
        }
        if (block.poster) {
          const poster = $( "<div>", {class: "linkPoster"} );
          link.append(poster);
          poster.css("background-image", `url(${block.poster[0].url})`);
          if (title) {
            poster.append(title);
          }
        } else 
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
          //set padding: 4px in .audioInfo css
          audioWrapper.append($( `<audio><source src="${block.url}"></audio>`, {class: "audioPlayer", controls: ""} ));
          if (block.poster) {
            info.append($( "<img>", {class: "audioPoster", src: content.poster[0].url} ));
          }
          info.append($( `
            <b class="trackTitle">${block.title}</b>
            <p>${block.artist}</p>
            <p>${block.album}</p>
          ` ));
          //set padding-top: 8px; font-size: 20?px in trackTitle.css
          }
        break;
      case "video":
        const videoWrapper = $( "<div>" );
        card.append(videoWrapper);
        if (block.embed_iframe) {
          videoWrapper.append($( "<iframe>", {class: "videoFrame", width: contentWidth, height: (contentWidth / block.embed_iframe.width) * block.embed_iframe.height, src: block.embed_iframe.url} ));
        } else {
          videoWrapper.append($( `<video><source src="${block.media?.url || block.url}"></video>`, {class: "videoPlayer", width: contentWidth, controls: ""} ));
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
          success: function (json) {parsePollResults(json, block, answerWrapper.attr("id"))}
        });
        break;
    }
  });
};
const renderPost = post => {
  post = $( post );
  const source = post.find("script");
  const postId = source.attr("rootid");
  const npf = JSON.parse(source.html());
  console.info(npf);
  post.html("");
  npf.trail.forEach((block, index) => {
    const body = $( "<section>", {class: "postBlock"});
    post.append(body);
    const card = $( "<div>", {id: `post-${postId}-trail-${index}`, class: "postCard"});
    body.append(card);
    if (block.layout[0] === "ask") {
      const ask = $( "<div>", {class: "ask"} );
      card.append(ask);
      ask.append(newHeader(block, postId, "asker", index));
      card.append(newHeader(block, postId, "answer", index));
      constructContent(block.content, postId, ask, true);
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
    if (npf.layout[0] === "ask") {
      const ask = $( "<div>", {class: "ask"} );
      card.append(ask);
      ask.append(newHeader(npf, postId, "asker", 0));
      constructContent(npf.content, postId, ask, true);
    } else {
      if (npf.trail.length) body.prepend(newHeader(npf, postId, "original content", 0));
      constructContent(npf.content, postId, card);
    }
  }
};

for (const post of $( ".post figure" )) renderPost(post);