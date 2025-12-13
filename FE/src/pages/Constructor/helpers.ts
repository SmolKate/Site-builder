/* eslint-disable max-len */
import { InterBase64 } from "@/assets/InterBase64";
import { GRID_COLUMN_NUMBER, ROW_HEIGHT, TOTAL_WIDTH } from "@/utils/constants";
import type { IBlock, ILayoutItem } from "@/store/builder/types";
import type { IHtmlChildElement } from "./types";

interface IExtendedHtmlElement extends Omit<IHtmlChildElement, "childNodes" | "styles"> {
  styles?: Record<string, string | number>; 
  attributes?: Record<string, string>;
  childNodes?: IExtendedHtmlElement[];
}

const uploadHtmlFile = (content: string, siteTitle?: string) => {
  const filename = `${siteTitle || "my_generated_site"}.html`;
  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const insertHtmlIntoTemplate = (body: string, siteTitle?: string, siteDescription?: string, bgColor: string = "transparent") => `
  <!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${siteTitle || "My Site"}</title>
      <meta name="description" content="${siteDescription || ""}">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @font-face {
          font-family: 'Inter';
          src: url("data:font/woff2;charset=utf-8;base64,${InterBase64}");
        }
        body { font-family: 'Inter', sans-serif; }
        ul, ol { list-style-position: inside; }
        .page-layout { display: flex; flex-direction: column; min-height: 100%; }
        iframe { border: 0; }
      </style>
    </head>
    <body style="background-color:${bgColor};min-height:100vh;width:100%;display:flex;align-items:flex-start;justify-content:center;padding:0px;">
      <div style="position:relative;height:100%;width:100%;max-width:${TOTAL_WIDTH}px;min-height:100vh;">
        ${body}
      </div>
    </body>
  </html>`;

const cleanPageStyles = (styles: Record<string, unknown>): Record<string, string | number> => {
  const cleaned: Record<string, string | number> = {};
  
  const allowedProperties = [
    "backgroundColor", "backgroundImage", "backgroundSize", "backgroundPosition",
    "border", "borderRadius", "boxShadow", "opacity", "position", "zIndex",
    "width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight"
  ];
  
  allowedProperties.forEach(prop => {
    if (styles[prop] !== undefined) {
      cleaned[prop] = String(styles[prop]);
    }
  });
  
  return cleaned;
};

const processPageBlock = (
  blockId: string, 
  block: IBlock, 
  components: {[key: string]: IBlock}
): IExtendedHtmlElement => {
  const tag = "div";
  const attributes = { class: "page-layout" };
  
  const hasSidebar = block.props.hasSidebar === "1";
  const sidebarWidth = (block.style.sidebarWidth as string) || "250px";
  const headerText = (block.props.headerText as string) || "Header";
  const footerText = (block.props.footerText as string) || "Footer";

  const cleanedStyles = cleanPageStyles(block.style);
  
  const headerNode: IExtendedHtmlElement = {
    tag: "header",
    id: `${blockId}-header`,
    styles: { 
      padding: "20px", 
      backgroundColor: block.style.headerBg as string, 
      color: block.style.headerColor as string, 
      width: "100%" 
    },
    content: `<h3>${headerText}</h3>`
  };

  const sidebarNode: IExtendedHtmlElement | null = hasSidebar ? {
    tag: "aside",
    id: `${blockId}-sidebar`,
    styles: { 
      width: sidebarWidth, 
      backgroundColor: block.style.sidebarBg as string, 
      padding: "10px", 
      flexShrink: 0 
    },
    content: "Sidebar Content"
  } : null;

  const mainChildren = block.childrenIds.map(childId => processBlock(childId, components));
  
  let innerWrapperStyles: Record<string, string | number> = {};
  
  if (block.variant === "two-columns") {
    innerWrapperStyles = { 
      display: "grid", 
      gridTemplateColumns: "repeat(2, 1fr)", 
      gap: "15px", 
      width: "100%", 
      alignItems: "center",  
      justifyContent: "center"
    };
  } else if (block.variant === "three-columns") {
    innerWrapperStyles = { 
      display: "grid", 
      gridTemplateColumns: "repeat(3, 1fr)", 
      gap: "15px", 
      width: "100%", 
      alignItems: "center",  
      justifyContent: "center"
    };
  } else {
    innerWrapperStyles = { 
      display: "flex", 
      flexDirection: "column", 
      gap: "10px", 
      width: "100%",
      alignItems: "center",  
      justifyContent: "center"
    };
  }

  const innerWrapper: IExtendedHtmlElement = {
    tag: "div",
    id: `${blockId}-main-inner`,
    styles: innerWrapperStyles,
    childNodes: mainChildren
  };

  const mainNode: IExtendedHtmlElement = {
    tag: "main",
    id: `${blockId}-main`,
    styles: { 
      flex: 1, 
      padding: "20px", 
      backgroundColor: block.style.backgroundColor as string,
      width: "100%" 
    },
    childNodes: [innerWrapper]
  };

  const footerNode: IExtendedHtmlElement = {
    tag: "footer",
    id: `${blockId}-footer`,
    styles: { 
      padding: "20px", 
      backgroundColor: block.style.footerBg as string, 
      color: block.style.footerColor as string, 
      textAlign: "center", 
      marginTop: "auto", 
      width: "100%" 
    },
    content: `<p>${footerText}</p>`
  };

  const bodyNode: IExtendedHtmlElement = {
    tag: "div",
    id: `${blockId}-body`,
    styles: { display: "flex", flex: 1, width: "100%" },
    childNodes: sidebarNode ? [sidebarNode, mainNode] : [mainNode]
  };

  const childNodes = [headerNode, bodyNode, footerNode];
  
  return {
    tag,
    id: blockId,
    styles: {
      ...cleanedStyles,
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      padding: "0"
    },
    attributes,
    childNodes
  };
};

const processBlock = (blockId: string, components: {[key: string]: IBlock}): IExtendedHtmlElement => {
  const block = components[blockId];
  if (!block) return { tag: "div", id: blockId, styles: {}, content: "Error: Block not found" };

  let tag = "div";
  let content = block.content;
  let attributes: Record<string, string> = {};
  let childNodes: IExtendedHtmlElement[] | undefined = undefined;

  let finalStyles: Record<string, string | number> = { ...block.style };

  switch (block.type) {
  case "container": {
    tag = "div";
    childNodes = block.childrenIds.map(childId => processBlock(childId, components));
      
    let layoutStyles: Record<string, string | number> = {};
      
    if (block.variant === "two-columns") {
      layoutStyles = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", width: "100%", alignItems: "start" };
    } else if (block.variant === "three-columns") {
      layoutStyles = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", width: "100%", alignItems: "start" };
    } else {
      layoutStyles = { display: "flex", flexDirection: "column", gap: "10px", width: "100%" };
      if (!finalStyles.alignItems) layoutStyles.alignItems = "stretch"; 
    }
      
    finalStyles = { ...layoutStyles, ...finalStyles };
    break;
  }

  case "page":
    return processPageBlock(blockId, block, components);

  case "text":
    tag = "div";
    break;

  case "heading":
    tag = `h${block.props.level || 2}`;
    break;

  case "button":
    if (!finalStyles.width) finalStyles.width = "auto";
    if (!finalStyles.display) finalStyles.display = "inline-block";
    if (!finalStyles.cursor) finalStyles.cursor = "pointer";
    if (!finalStyles.textDecoration) finalStyles.textDecoration = "none";
    if (!finalStyles.border) finalStyles.border = "none";

    content = block.props.text as string;

    if (["link", "anchor", "email"].includes(block.props.actionType as string)) {
      tag = "a";
      let href = "#";
      const val = (block.props.actionValue as string) || "";
      const actionType = block.props.actionType as string;

      if (actionType === "link") {
        
        if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/")) {
          href = val;
        } else {
          href = `https://${val}`;
        }
      } else if (actionType === "email") {
        href = `mailto:${val}`;
      } else if (actionType === "anchor") {
        if (val === "top") {
          href = "#";
        } else {
          href = val.startsWith("#") ? val : `#${val}`;
        }
      }

      attributes = { href };

      if (actionType === "link" && block.props.openInNewTab === "1") {
        attributes.target = "_blank";
        attributes.rel = "noopener noreferrer";
      }
    } else {
      tag = "button";
      attributes = { type: "button" };
    }
    break;

  case "image":
    tag = "img";
    attributes = {
      src: (block.props.src as string) || "",
      alt: (block.props.alt as string) || "image",
    };
    content = undefined; 
    break;

  case "video": {
    tag = "iframe";
    let src = (block.props.src as string) || "";
    const videoIdMatch = src.match(/(?:v=|youtu\.be\/|\/embed\/)([^&?/]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      src = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    attributes = {
      src: src,
      frameborder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: "true"
    };
    content = undefined;
    break;
  }

  case "divider":
    tag = "hr";
    content = undefined;
    break;

  case "input":
    tag = "input";
    attributes = {
      type: "text",
      placeholder: (block.props.placeholder as string) || "",
    };
    content = undefined; 
    break;

  case "link":
    tag = "a";
    content = (block.props.text as string) || "Link";
    attributes = {
      href: (block.props.href as string) || "#",
    };
    break;

  case "quote": {
    tag = "blockquote";
    content = undefined; 
    const qText = (block.props.text as string) || "";
    const qAuth = (block.props.author as string) || "";
      
    childNodes = [
      { tag: "p", id: `${blockId}-text`, styles: { margin: "0 0 10px 0" }, content: qText }
    ];
      
    if (qAuth) {
      childNodes.push({
        tag: "footer", id: `${blockId}-author`, styles: { fontSize: "0.8em", opacity: "0.8" }, content: `— ${qAuth}`
      });
    }
    break;
  }

  case "list": {
    tag = "div"; 
    break;
  }

  default:
    tag = "div";
    content = undefined;
  }

  return {
    tag,
    id: blockId,
    styles: finalStyles,
    content,
    attributes,
    childNodes
  };
};

const createLayoutObj = (layout: ILayoutItem[], components: {[key: string]: IBlock}) => {
  const layoutObj: IExtendedHtmlElement = {
    tag: "div",
    id: "site-root",
    styles: {
      position: "relative",
      height: "100%",
      width: "100%",
      maxWidth: `${TOTAL_WIDTH}px`,
      margin: "0 auto",
    },
    childNodes: [],
  };

  for (let i = 0; i < layout.length; i++) {
    const elem = layout[i];
    const elementNode = processBlock(elem.i, components);
    
    const wrapperNode: IExtendedHtmlElement = {
      tag: "div",
      id: `wrapper-${elem.i}`,
      styles: {
        position: "absolute",
        left: `${elem.x * TOTAL_WIDTH / GRID_COLUMN_NUMBER}px`,
        top: `${elem.y * ROW_HEIGHT}px`,
        width: `${elem.w * TOTAL_WIDTH / GRID_COLUMN_NUMBER}px`,
        height: `${elem.h * ROW_HEIGHT}px`,
      },
      childNodes: [{
        ...elementNode,
        styles: {
          ...elementNode.styles,
          width: "100%",
          height: "100%",
          boxSizing: "border-box"
        }
      }],
    };

    if (layoutObj.childNodes) {
      layoutObj.childNodes.push(wrapperNode);
    } else {
      layoutObj.childNodes = [wrapperNode];
    }
  }
  return layoutObj;
};

function createHtmlElement(obj: IExtendedHtmlElement) {
  const element = document.createElement(obj.tag);
  element.setAttribute("data-block-type", obj.tag === "div" ? "page-container" : obj.tag);
  
  if (obj.id) element.id = obj.id;

  if (obj.attributes) {
    Object.entries(obj.attributes).forEach(([key, value]) => {
      if (value) element.setAttribute(key, value);
    });
  }

  if (obj.content) {
    if (["div", "header", "footer", "main", "aside"].includes(obj.tag) || obj.tag.startsWith("h")) {
      element.innerHTML = obj.content;
    } else {
      element.textContent = obj.content;
    }
  }

  if (obj.styles) {
    for (const prop in obj.styles) {
      const value = obj.styles[prop];
      if (value !== undefined && value !== "") {
        const cssProperty = prop.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        element.style.setProperty(cssProperty, String(value));
      }
    }
  }

  if (obj.childNodes) {
    obj.childNodes.forEach((child) => {
      element.appendChild(createHtmlElement(child));
    });
  }
  
  return element;
}

export {
  uploadHtmlFile,
  insertHtmlIntoTemplate,
  createLayoutObj,
  createHtmlElement,
};