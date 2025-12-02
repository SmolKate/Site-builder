/* eslint-disable max-len */
import { InterBase64 } from "@/assets/InterBase64";
import { GRID_COLUMN_NUMBER, ROW_HEIGHT, TOTAL_WIDTH } from "../../utils/constants";
import type { IBlock, ILayoutItem } from "@/store/builder/types";
import type { IHtmlChildElement, ILayoutObj } from "./types";

const uploadHtmlFile = (content: string, siteTitle?: string) => {
  const filename = `${siteTitle ?? "my_generated_file"}.html`;
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

const insertHtmlIntoTemplate = (body: string, siteTitle?: string, siteDescription?: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${siteTitle}</title>
      <meta name="description" content="${siteDescription}">
      <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
        @font-face {
          font-family: 'Inter';
          src: url("data:font/woff2;charset=utf-8;base64,${InterBase64}");
        }
        body {
          font-family: 'Inter';
        }
      </style>
    </head>
    <body
      style="background-color:lightblue;padding:10px;height:100vh;width:100%;display:flex;align-items:center;justify-content:center"
    >
      <div style="position:relative;height:100%;width:100%;max-width:${TOTAL_WIDTH}px;">
        ${body}
      </div>
    </body
  </html>`;


const createLayoutObj = (layout: ILayoutItem[], components: {[key: string]: IBlock}) => {
  const layoutObj = {
    tag: "div",
    id: "div-body",
    styles: {
      position: "relative",
      height: "100%",
      width: "100%",
      maxWidth: `${TOTAL_WIDTH}px`,
    },
  } as ILayoutObj;

  for (let i = 0; i < layout.length; i++) {
    const elem = layout[i];
    const container = components[elem.i];
    const childNodes = [] as IHtmlChildElement[];
    container.childrenIds.forEach((childId: string) => {
      const childData = components[childId];
      let tag = "p";
      if (childData.type === "button") tag = "button";
      if (childData.type === "heading") tag = `h${childData.props.level}`;
      const childObj = {
        tag,
        id: childId,
        styles: {
          ...childData.style,
        },
        content: childData.content ?? childData.props.text,
      };
      childNodes.push(childObj);
    });

    const newElem = {
      tag: "div",
      id: elem.i,
      styles: {
        backgroundColor: "lightblue",
        padding: "10px",
        position: "absolute",
        left: `${elem.x * TOTAL_WIDTH / GRID_COLUMN_NUMBER}px`,
        top: `${elem.y * ROW_HEIGHT}px`,
        ...container.style,
        width: `${elem.w * TOTAL_WIDTH / GRID_COLUMN_NUMBER}px`,
        height: `${elem.h * ROW_HEIGHT}px`,

      },
      childNodes,
    };
    if (layoutObj.childNodes) {
      layoutObj.childNodes.push(newElem);
    } else {
      layoutObj.childNodes = [newElem];
    }
  }
  return layoutObj;
};

function createHtmlElement(obj: ILayoutObj & IHtmlChildElement) {
  const element = document.createElement(obj.tag);
  if (obj.id) {
    element.id = obj.id;
  }
  if (obj.content) {
    element.textContent = obj.content;
  }
  if (obj.styles) {
    for (const prop in obj.styles) {
      if (obj.styles[prop]) element.style[prop] = obj.styles[prop];
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