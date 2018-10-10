import { Content, Props, element as e, text } from "@futura/virtual-dom";

import * as attributes from "./attributes";
import * as events from "./events";

/**
 * HTML Elements
 * 
 * This module contains a set of pre-defined standard HTML element as
 * functions.
 * */


/** Plain text node */
export { text };

/** Generic element */
export const element = e(undefined);

/** Specific elements */

const el = (tag: string) => (props?: Props, content?: Content) =>
  element(tag, props, content);

const empty = (tag: string) => (props?: Props) =>
  element(tag, props);

export const a = el("a");
export const abbr = el("abbr");
export const address = el("address");
export const area = empty("area");
export const article = el("article");
export const aside = el("aside");
export const audio = el("audio");
export const b = el("b");
export const bdi = el("bdi");
export const bdo = el("bdo");
export const blockquote = el("blockquote");
export const br = empty("br");
export const button = el("button");
export const canvas = el("canvas");
export const caption = el("caption");
export const cite = el("cite");
export const code = el("code");
export const col = empty("col");
export const colgroup = el("colgroup");
export const data = el("data");
export const datalist = el("datalist");
export const dd = el("dd");
export const del = el("del");
export const details = el("details");
export const dfn = el("dfn");
export const dialog = el("dialog");
export const div = el("div");
export const dl = el("dl");
export const dt = el("dt");
export const em = el("em");
export const embed = empty("embed");
export const fieldset = el("fieldset");
export const figcaption = el("figcaption");
export const figure = el("figure");
export const footer = el("footer");
export const form = el("form");
export const h1 = el("h1");
export const h2 = el("h2");
export const h3 = el("h3");
export const h4 = el("h4");
export const h5 = el("h5");
export const h6 = el("h6");
export const header = el("header");
export const hgroup = el("hgroup");
export const hr = empty("hr");
export const i = el("i");
export const iframe = el("iframe");
export const img = empty("img");
export const input = empty("input");
export const ins = el("ins");
export const kbd = el("kbd");
export const label = el("label");
export const legend = el("legend");
export const li = el("li");
export const main = el("main");
export const map = el("map");
export const mark = el("mark");
export const menu = el("menu");
export const menuitem = el("menuitem");
export const meter = el("meter");
export const nav = el("nav");
export const object = el("object");
export const ol = el("ol");
export const optgroup = el("optgroup");
export const option = el("option");
export const output = el("output");
export const p = el("p");
export const param = empty("param");
export const picture = el("picture");
export const pre = el("pre");
export const progress = el("progress");
export const q = el("q");
export const rb = el("rb");
export const rp = el("rp");
export const rt = el("rt");
export const rtc = el("rtc");
export const ruby = el("ruby");
export const s = el("s");
export const samp = el("samp");
export const section = el("section");
export const select = el("select");
export const small = el("small");
export const source = empty("source");
export const span = el("span");
export const strong = el("strong");
export const sub = el("sub");
export const summary = el("summary");
export const sup = el("sup");
export const table = el("table");
export const tbody = el("tbody");
export const td = el("td");
export const textarea = el("textarea");
export const tfoot = el("tfoot");
export const th = el("th");
export const thead = el("thead");
export const time = el("time");
export const tr = el("tr");
export const track = empty("track");
export const u = el("u");
export const ul = el("ul");
export const var_ = el("var");
export const video = el("video");
export const wbr = empty("wbr");

/**
 * HTML Attributes
 * */

export { attributes };

/**
 * HTML Events
 * */

export { events };
