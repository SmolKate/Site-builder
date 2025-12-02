interface IHtmlChildElement {
  tag: string;
  id: string;
  styles: Partial<CSSStyleDeclaration>
  content?: string;
}

interface ILayoutObj {
  tag: string;
  id: string;
  styles: Partial<CSSStyleDeclaration>
  childNodes?: IHtmlChildElement[];
}

export type {
  IHtmlChildElement,
  ILayoutObj
};