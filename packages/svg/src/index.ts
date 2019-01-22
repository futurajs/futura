import { Content, Props, element as e, text, VNode } from "@futura/virtual-dom";

/**
 * SVG Elements
 * 
 * This module contains a set of pre-defined standard SVG element as
 * functions.
 * */

const NAMESPACE = "http://www.w3.org/2000/svg";


/** Plain text node */
export { text };

/** Generic element */
export const element: {
  (tagName: string): VNode;
  (tagName: string, props: Props): VNode;
  (tagName: string, content: Content): VNode;
  (tagName: string, props: Props, content: Content): VNode;
} = e.bind(null, NAMESPACE) as any;

/** Specific elements */

const el = (tagName: string): {
  (): VNode;
  (props: Props): VNode;
  (content: Content): VNode;
  (props: Props, content: Content): VNode;
} =>
  e.bind(null, NAMESPACE, tagName) as any;

// const empty = (tagName: string): {
//   (): VNode;
//   (props: Props): VNode;
// } =>
//   e.bind(null, undefined, tagName) as any;

export const svg = el("svg");

export const a = el("a");
export const altGlyph = el("altGlyph");
export const altGlyphDef = el("altGlyphDef");
export const altGlyphItem = el("altGlyphItem");
export const animate = el("animate");
export const animateColor = el("animateColor");
export const animateMotion = el("animateMotion");
export const animateTransform = el("animateTransform");
export const circle = el("circle");
export const clipPath = el("clipPath");
export const colorProfile = el("colorProfile");
export const cursor = el("cursor");
export const defs = el("defs");
export const desc = el("desc");
export const ellipse = el("ellipse");
export const feBlend = el("feBlend");
export const feColorMatrix = el("feColorMatrix");
export const feComponentTransfer = el("feComponentTransfer");
export const feComposite = el("feComposite");
export const feConvolveMatrix = el("feConvolveMatrix");
export const feDiffuseLighting = el("feDiffuseLighting");
export const feDisplacementMap = el("feDisplacementMap");
export const feDistantLight = el("feDistantLight");
export const feFlood = el("feFlood");
export const feFuncA = el("feFuncA");
export const feFuncB = el("feFuncB");
export const feFuncG = el("feFuncG");
export const feFuncR = el("feFuncR");
export const feGaussianBlur = el("feGaussianBlur");
export const feImage = el("feImage");
export const feMerge = el("feMerge");
export const feMergeNode = el("feMergeNode");
export const feMorphology = el("feMorphology");
export const feOffset = el("feOffset");
export const fePointLight = el("fePointLight");
export const feSpecularLighting = el("feSpecularLighting");
export const feSpotLight = el("feSpotLight");
export const feTile = el("feTile");
export const feTurbulence = el("feTurbulence");
export const filter = el("filter");
export const font = el("font");
export const foreignObject = el("foreignObject");
export const g = el("g");
export const glyph = el("glyph");
export const glyphRef = el("glyphRef");
export const image = el("image");
export const line = el("line");
export const linearGradient = el("linearGradient");
export const marker = el("marker");
export const mask = el("mask");
export const metadata = el("metadata");
export const mpath = el("mpath");
export const path = el("path");
export const pattern = el("pattern");
export const polygon = el("polygon");
export const polyline = el("polyline");
export const radialGradient = el("radialGradient");
export const rect = el("rect");
export const set = el("set");
export const stop = el("stop");
export const style = el("style");
export const switch_ = el("switch");
export const symbol = el("symbol");
export const text_ = el("text");
export const textPath = el("textPath");
export const title = el("title");
export const tref = el("tref");
export const tspan = el("tspan");
export const use = el("use");
export const view = el("view");


// /**
//  * SVG Attributes
//  * */

// export { attributes };

// /**
//  * SVG Events
//  * */

// export { events };
