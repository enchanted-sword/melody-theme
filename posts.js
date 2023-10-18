const newPopover = (blog, id) => {
  const popover = $( "<div>", {id: id} );
  popover.css("background-color", blog.theme.background_color);
  popover.append($( "<img>", {src: blog.theme.header_image, width: "256px", height: Math.floor(blog.theme.header_full_height / (blog.theme.header_full_width / 256)), class: "popoverHeader"} ));
  const avatarSrc = blog.avatar[2].url || `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;
  const avatar = popover.append($( "<img>", {src: avatarSrc, class: "popoverAvatar"} ));
  if (blog.theme.avatar_shape === "circle") avatar.css("border-radius", "50%");
  const about = popover.append($( "<div>", {class: "popoverAbout"} ));
  about.css({"top": `${header.height() - 60}px`});
  const url = about.append($( "<b>", {class: "popoverUrl"} ));
  //add font-size: 20px; margin: 8px 0; hyphens: auto to .popoverUrl css
  url.css("color", blog.theme.link_color);
  url.text(blog.name);
  const title = about.append($( "<p>", {class: "popoverTitle"} ));
  //add font-size: 24px to .popoverTitle css
  title.text(blog.title);
  const description = about.append($( "<p>", {class: "popoverDescription"} ));
  //add margin: 8px 0 to .popoverDescription css
  description.text(blog.description);

  popover.click(() => {window.open(blog.url)});
  popover.mouseleave(() => $( `#${id}` ).hide("slow"));

  return popover;
};
const newHeader = (block, id, type, index) => {
  const header = $( "<header>", {class: "postHeader"} );
  const wrapper = header.append($( "<span>" ));
  const attribution = $( "<b>", {class: "attribution"} );
  let attributionLink;
  let idStr;
  if (type === "ask") {
    header.addClass("asker");
    if (block.layout[0]?.attribution?.blog) {
      blog = block.layout[0].attribution.blog;
      if (!("active" in blog) || blog.active) {
        wrapper.addClass("blog");
        idStr = `popover-ask-${id}`;
        attributionLink = wrapper.append($( "<a>", {class: "styleText attributionLink", href: blog.url} ));
        const avatarSrc = blog.avatar[2].url || `https://api.tumblr.com/v2/blog/${blog.name}/avatar/96`;
        attributionLink.append($( "<img>", {class: "avatar", src: avatarSrc} ));
        attribution.text(`${blog.name} asked:`);
        attributionLink.append(attribution);
        wrapper.append(newPopover(blog, idStr));
        wrapper.mouseenter(() => $( `#${idStr}` ).show("slow"));
      } else {
        wrapper.append(attribution);
        attribution.text(`${blog.name} asked:`);
        //deactivated string func
      }
    }
  }
  return header;
}
const renderPost = () => {
  const script = $( document.currentScript );
  const postId = script.attr("idf");
  const npf = JSON.parse(script.html());
  console.info(npf);
  const post = $( `#post-${id}` );
  npf.trail.forEach((block, index, trail) => {
    const body = post.append($( "<article>", {class: "postBlock"}));
    const card = post.append($( "<div>", {class: "postCard"}));
    if (block.layout[0] && block.layout[0] +++ "ask") {
      const askHeader = card.append($());
    }
  });
};