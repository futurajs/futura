import { VElement, attr as vattr, prop } from "@futura/virtual-dom";

/* Custom Attributes */

/** Generic Attribute */
export const attr = vattr(undefined);

/** Generic Property */
export { prop };


/* Styling Attributes */

/**
 * Classes of the element. This function doesn't return any attribute if
 * the `enabled` parameter is set to `false`.
 * 
 * Multiple classes can be applied by using this attribute multiple times:
 * 
```
  p([
    class_("message"),
    class_("message-info"),
    class_("not-applied", false),
  ], "Hello Future")
```
 * 
 * Which will result in the following tag:
 * 
```
  <p class="message message-info">Hello Future</p>
```
 * 
 * Another option would be to use the {@link classes} attribute, which allows
 * for setting multiple classes.
 * 
 * @param name - The class name
 * @param enabled - Whether to apply the class name or not
 */
export const class_ = (name: string, enabled: boolean = true) =>
  enabled
    ? attr("class", name)
    : undefined;

/** Build a set of classes given a mapping from class names to a boolean value.
 * 
```
  p([
    classes({
      "message": true,
      "message-info": true,
      "not-applied": false
    }),
  ], "Hello Future")
```
 * 
 * Which will result in the following tag:
 * 
```
  <p class="message message-info">Hello Future</p>
```
*/
export const classes = (classes: Record<string, boolean> | ReadonlyArray<string>) => {
  const values = Array.isArray(classes)
    ? classes
    : Object.keys(classes).filter((class_) => (classes as Record<string, boolean> )[class_]);

  return values.length > 0 ? attr("class", values.join(" ")) : undefined;
}


/* Other Attributes */

const attribute = <V extends string>(key: string) => (value: V | undefined) =>
  attr(key, value);

const property = <K extends string, V>(key: K) => (value: V | undefined) =>
  prop(key, value);


export const accept = (types: ReadonlyArray<string>) => prop("accept", types.join(","));
export const acceptCharset = (types: ReadonlyArray<string>) => prop("acceptCharset", types.join(" "));
export const accessKey = property<"accessKey", string>("accessKey");
export const action = property<"action", string>("action");
export const alt = property<"alt", string>("alt");
export const autoCapitalize = attribute<"off" | "none" | "on" | "sentences" | "words" | "characters">("autocapitalize");
export const autoComplete = property<"autocomplete", string>("autocomplete");
export const autoFocus = property<"autofocus", boolean>("autofocus");
export const autoPlay = property<"autoplay", boolean>("autoplay");
export const capture = (value: boolean | undefined) => !!value ? attr("capture", "") : undefined;
export const checked = property<"checked", boolean>("checked");
export const cite = property<"cite", string>("cite");
export const cols = property<"cols", number>("cols");
export const colspan = (value: number | undefined) => typeof value !== "undefined" ? attr("colspan", value.toString()) : undefined;
export const contentEditable = (value: boolean) => prop("contentEditable", value ? "true" : "false");
export const controls = property<"controls", boolean>("controls");
export const datetime = (value: Date | string | undefined) => typeof value !== "undefined" ? attr("datetime", value instanceof Date ? value.toISOString() : value) : undefined;
export const default_ = property<"default", boolean>("default");
export const dir = property<"dir", "ltr" | "rtl" | "auto">("dir");
export const disabled = property<"disabled", boolean>("disabled");
export const download = property<"download", string>("download");
export const draggable = property<"draggable", boolean>("draggable");
export const dropzone = property<"dropzone", "copy" | "move" | "link">("dropzone");
export const enctype = property<"enctype", string>("enctype");
export const files = property<"files", FileList>("files");
export const for_ = property<"htmlFor", number>("htmlFor");
export const form = attribute("form");
export const height = (value: number | undefined) => typeof value !== "undefined" ? attr("height", value.toString()) : undefined;
export const hidden = property<"hidden", boolean>("hidden");
export const href = property<"href", string>("href");
export const hreflang = property<"hreflang", string>("hreflang");
export const id = property<"id", string>("id");
export const indeterminate = property<"indeterminate", boolean>("indeterminate");
export const inputmode = attribute<"none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url">("inputmode");
export const integrity = property<"integrity", string>("integrity");
export const isMap = property<"isMap", boolean>("isMap");
export const kind = property<"kind", "subtitles" | "captions" | "descriptions" | "chapters" | "metadata">("kind");
export const label = property<"label", string>("label");
export const lang = property<"lang", string>("lang");
export const list = attribute("list");
export const loop = property<"loop", boolean>("loop");
export const manifest = attribute("manifest");
export const maxLength = property<"maxLength", number>("maxLength");
export const media = attribute("media");
export const method = property<"method", string>("method");
export const minLength = property<"minLength", number>("minLength");
export const multiple = property<"multiple", boolean>("multiple");
export const name = property<"name", string>("name");
export const noValidate = property<"noValidate", boolean>("noValidate");
export const pattern = property<"pattern", string>("pattern");
export const ping = (value: ReadonlyArray<string>) => attr("ping", value.join(" "));
export const placeholder = property<"placeholder", string>("placeholder");
export const poster = property<"poster", string>("poster");
export const preload = property<"preload", boolean>("preload");
export const pubdate = (value: Date | string | undefined) => typeof value !== "undefined" ? attr("pubdate", value instanceof Date ? value.toISOString() : value) : undefined;
export const readOnly = property<"readOnly", boolean>("readOnly");
export const rel = (value: ReadonlyArray<string>) => prop<"rel", string>("rel", value.join(" "));
export const required = property<"required", boolean>("required");
export const reversed = property<"reversed", boolean>("reversed");
export const rows = property<"rows", number>("rows");
export const rowspan = (value: number | undefined) => typeof value !== "undefined" ? attr("rowspan", value.toString()) : undefined;
export const sandbox = property<"sandbox", string>("sandbox");
export const scope = property<"scope", string>("scope");
export const selected = property<"selected", boolean>("selected");
export const shape = property<"shape", "rect" | "circle" | "poly" | "default">("shape");
export const size = property<"size", number>("size");
export const span = property<"span", number>("span");
export const spellcheck = property<"spellcheck", boolean>("spellcheck");
export const src = property<"src", string>("src");
export const srcdoc = property<"srcdoc", string>("srcdoc");
export const srclang = property<"srclang", string>("srclang");
export const step = (value: number | undefined) => typeof value !== "undefined" ? prop("step", value.toString()) : prop("step", "any");
export const tabindex = (value: number | undefined) => typeof value !== "undefined" ? attr("tabindex", value.toString()) : undefined;
export const target = property<"target", string>("target");
export const title = property<"title", string>("title");
export const translate = (value: boolean) => typeof value !== "undefined" ? attr("translate", value ? "yes" : "no") : undefined;
export const type_ = property<"type", string>("type");
export const usemap = property<"usemap", string>("usemap");
export const width = (value: number | undefined) => typeof value !== "undefined" ? attr("width", value.toString()) : undefined;
export const wrap = property<"wrap", "hard" | "soft">("wrap");


export function min(v: Date): VElement.Prop<"min", string>;
export function min(v: number | undefined): VElement.Attr | undefined;
export function min(v: Date | number | undefined): VElement.Prop<"min", string> | VElement.Attr | undefined {
  if (typeof v === "number") {
    return attr("min", v.toString())
  } else if (typeof v === "undefined") {
    return undefined;
  } else {
    return prop("min", v.toISOString());
  }
}

export function max(v: Date): VElement.Prop<"max", string>;
export function max(v: number | undefined): VElement.Attr | undefined;
export function max(v: Date | number | undefined): VElement.Prop<"max", any> | VElement.Attr | undefined {
  if (typeof v === "number") {
    return attr("max", v.toString())
  } else if (typeof v === "undefined") {
    return undefined;
  } else {
    return prop("max", v.toISOString());
  }
}

export function value(v: string): VElement.Prop<"value", string>;
export function value(v: number): VElement.Prop<"value", number>;
export function value(v: any): VElement.Prop<"value", any> {
  return new VElement.Prop("value", v);
}
