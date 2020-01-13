import { attr as vAttr } from "@futura/virtual-dom";


const attr = vAttr(undefined);
const xmlAttr = vAttr("http://www.w3.org/XML/1998/namespace");
const xlinkAttr = vAttr("http://www.w3.org/1999/xlink");

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

const attributeTyped = <V>(key: string, cast: (v: V) => string) => (value: V | undefined) =>
  typeof value === "undefined"
    ? undefined
    : attr(key, cast(value));

const castNumber = (value: number) =>
  value.toString(10);

const castNumberOrString = (value: number | string) =>
  typeof value === "string" ? value : value.toString(10);

const castBoolean = (value: boolean) =>
  value ? "true" : "false";

/* Core */
export const lang = attribute("lang");
export const baseProfile = attribute<"none" | "full" | "basic" | "tiny">("baseProfile");
export const xmlBase = (value: string | undefined) => xmlAttr("xml:base", value);
export const xmlLang = (value: string | undefined) => xmlAttr("xml:lang", value);
export const xmlSpace = (value: string | undefined) => xmlAttr("xml:space", value);


/* XLink */
export const xlinkHref = (value: string | undefined) => xlinkAttr("xlink:href", value);
export const xlinkTitle = (value: string | undefined) => xlinkAttr("xlink:title", value);


export const accentHeight = attributeTyped("accent-height", castNumber);
export const accumulate = attribute<"none" | "sum">("accumulate");
export const additive = attribute<"replace" | "sum">("additive");
export const alignmentBaseline = attribute<"auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit">("alignment-baseline");
export const ascent = attributeTyped("ascent", castNumber);
export const attributeName = attribute("attributeName");
export const attributeType = attribute<"auto" | "XML" | "CSS">("attributeType");
export const azimuth = attributeTyped("azimuth", castNumber);
export const baseFrequency = (x: number, y?: number) => attr("baseFrequency", typeof y === "undefined" ? x.toString(10) : `${x.toString(10)}, ${y.toString(10)}`);
export const baselineShift = attribute<"auto" | "baseline" | "super" | "sub" | "inherit" | string>("baseline-shift");
export const begin = attribute("begin");
export const bias = attributeTyped("bias", castNumber);
export const calcMode = attribute<"discrete" | "linear" | "paced" | "spline">("calcMode");
export const clipPath = attribute("clip-path");
export const clipPathUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("clipPathUnits");
export const clipRule = attribute("clip-rule");
export const color = attribute("color");
export const colorInterpolation = attribute("color-interpolation");
export const colorInterpolationFilters = attribute("color-interpolation-filters");
export const colorProfile = attribute("color-profile");
export const colorRendering = attribute("color-rendering");
export const cursor = attribute("cursor");
export const cx = attributeTyped("cx", castNumberOrString);
export const cy = attributeTyped("cy", castNumberOrString);
export const d = attribute("d");
export const diffuseConstant = attributeTyped("diffuseConstant", castNumber);
export const direction = attribute<"ltr" | "rtl" | "inherit">("direction");
export const display = attribute<"inline" | "block" | "list-item" | "run-in" | "compact" | "marker" | "table" | "inline-table" | "table-row-group" | "table-header-group" | "table-footer-group" | "table-row" | "table-column-group" | "table-column" | "table-cell" | "table-caption" | "none" | "inherit" | "flex" | "grid">("display");
export const divisor = attributeTyped("divisor", castNumber);
export const dominantBaseline = attribute<"auto" | "use-script" | "no-change" | "reset-size" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "central" | "middle" | "text-after-edge" | "text-before-edge" | "inherit">("dominant-baseline");
export const dur = attribute("dur");
export const dx = attributeTyped("dx", castNumberOrString);
export const dy = attributeTyped("dy", castNumberOrString);
export const edgeMode = attribute<"duplicate" | "wrap" | "none">("edgeMode");
export const elevation = attributeTyped("elevation", castNumber);
export const end = attribute("end");
export const externalResourcesRequired = attributeTyped("externalResourcesRequired", castBoolean);
export const enableBackground = attribute("enable-background");
export const fill = attribute("fill");
export const fillOpacity = attributeTyped("fill-opacity", castNumber);
export const fillRule = attribute<"nonzero" | "evenodd">("fill-rule");
export const filter = attribute("filter");
export const filterUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("filterUnits");
export const floodColor = attribute("flood-color");
export const floodOpacity = attributeTyped<"inherit" | number>("flood-opacity", castNumberOrString);
export const fontFamily = attribute("font-family");
export const fontSize = attribute("font-size");
export const fontSizeAdjust = attributeTyped<"none" | "inherit" | number>("font-size-adjust", castNumberOrString);
export const fontStretch = attribute<"normal" | "wider" | "narrower" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded" | "inherit">("font-stretch");
export const fontStyle = attribute<"normal" | "italic" | "oblique" | "inherit">("font-style");
export const fontVariant = attribute<"normal" | "small-caps" | "inherit">("font-variant");
export const fontWeight = attributeTyped<"normal" | "bold" | "bolder" | "lighter" | "inherit" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>("font-weight", castNumberOrString);
export const from = attribute("from");
export const fr = attribute("fr");
export const fx = attribute("fx");
export const fy = attribute("fy");
export const glyphOrientationHorizontal = attribute("glyph-orientation-horizontal");
export const glyphOrientationVertical = attribute("glyph-orientation-vertical");
export const gradientTransform = attribute("gradientTransform");
export const gradientUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("gradientUnits");
export const height = attributeTyped("height", castNumberOrString);
export const href = attribute("href");
export const imageRendering = attribute<"auto" | "optimizeSpeed" | "optimizeQuality" | "inherit">("image-rendering");
export const in_ = attribute("in");
export const in2 = attribute("in2");
export const k1 = attributeTyped("k1", castNumber);
export const k2 = attributeTyped("k2", castNumber);
export const k3 = attributeTyped("k3", castNumber);
export const k4 = attributeTyped("k4", castNumber);
export const kernelMatrix = (xs: ReadonlyArray<number>) => attr("kernelMatrix", xs.map(x => x.toString(10)).join(" "));
export const kernelUnitLength = (x: number, y?: number) => attr("kernelUnitLength", typeof y === "undefined" ? x.toString(10) : `${x.toString(10)}, ${y.toString(10)}`);
export const kerning = attribute("kerning");
export const keySplines = attribute("keySplines");
export const keyTimes = attribute("keyTimes");
export const lengthAdjust = attribute<"spacing" | "spacingAndGlyphs">("lengthAdjust");
export const letterSpacing = attribute("letter-spacing");
export const lightingColor = attribute("lighting-color");
export const limitingConeAngle = attributeTyped("limitingConeAngle", castNumber);
export const markerEnd = attribute("marker-end");
export const markerMid = attribute("marker-mid");
export const markerStart = attribute("marker-start");
export const markerHeight = attribute("markerHeight");
export const markerUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("markerUnits");
export const markerWidth = attribute("markerWidth");
export const mask = attribute("mask");
export const maskContentUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("maskContentUnits");
export const maskUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("maskUnits");
export const max = attribute("max");
export const min = attribute("min");
export const mode = attribute<"normal" | "multiply" | "screen" | "darken" | "lighten">("mode");
export const numOctaves = attributeTyped("numOctaves", castNumber);
export const opacity = attributeTyped<number | "inherit">("opacity", castNumberOrString);
export const operator = attribute<"over" | "in" | "out" | "atop" | "xor" | "arithmetic">("operator");
export const order = (x: number, y?: number) => attr("order", typeof y === "undefined" ? x.toString(10) : `${x.toString(10)}, ${y.toString(10)}`);
export const overflow = attribute<"visible" | "hidden" | "scroll" | "auto" | "inherit">("overflow");
export const overlinePosition = attributeTyped("overline-position", castNumber);
export const overlineThickness = attributeTyped("overline-thickness", castNumber);
export const pathLength = attributeTyped("pathLength", castNumber);
export const patternContentUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("patternContentUnits");
export const patternTransform = attribute("patternTransform");
export const patternUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("patternUnits");
export const pointerEvents = attribute<"bounding-box" | "visiblePainted" | "visibleFill" | "visibleStroke" | "visible" | "painted" | "fill" | "stroke" | "all" | "none">("pointer-events");
export const points = (ps: ReadonlyArray<[number, number]>) => attr("order", ps.map(([x, y]) => `${x},${y}`).join(" "));
export const pointsAtX = attributeTyped("pointsAtX", castNumber);
export const pointsAtY = attributeTyped("pointsAtY", castNumber);
export const pointsAtZ = attributeTyped("pointsAtZ", castNumber);
export const preserveAlpha = attributeTyped("preserveAlpha", castBoolean);
export const preserveAspectRatio = (align: "none" | "xMinYMin" | "xMidYMin" | "xMaxYMin" | "xMinYMid" | "xMidYMid" | "xMaxYMid" | "xMinYMax" | "xMidYMax" | "xMaxYMax", meetOrSlice?: "meet" | "slice") => attr("preserveAspectRatio", typeof meetOrSlice === "undefined" ? align : `${align} ${meetOrSlice}`);
export const primitiveUnits = attribute<"userSpaceOnUse" | "objectBoundingBox">("primitiveUnits");
export const r = attributeTyped("r", castNumberOrString);
export const radius = (x: number, y?: number) => attr("radius", typeof y === "undefined" ? x.toString(10) : `${x.toString(10)}, ${y.toString(10)}`);
export const repeatCount = attributeTyped<number | "indefinite">("repeatCount", castNumberOrString);
export const repeatDur = attributeTyped<string | "indefinite">("repeatDur", castNumberOrString);
export const restart = attribute<"always" | "whenNotActive" | "never">("restart");
export const result = attribute("result");
export const rx = attributeTyped("rx", castNumberOrString);
export const ry = attributeTyped("ry", castNumberOrString);
export const scale = attributeTyped("scale", castNumber);
export const seed = attributeTyped("seed", castNumber);
export const shapeRendering = attribute<"auto" | "optimizeSpeed" | "crispEdges" | "geometricPrecision" | "inherit">("shape-rendering");
export const specularConstant = attributeTyped("specularConstant", castNumber);
export const specularExponent = attributeTyped("specularExponent", castNumber);
export const spreadMethod = attribute<"pad" | "reflect" | "repeat">("spreadMethod");
export const stdDeviation = (x: number, y?: number) => attr("stdDeviation", typeof y === "undefined" ? x.toString(10) : `${x.toString(10)}, ${y.toString(10)}`);
export const stitchTiles = attribute<"noStitch" | "stitch">("stitchTiles");
export const stopColor = attribute("stop-color");
export const stopOpacity = attributeTyped("stop-opacity", castNumber);
export const strikethroughPosition = attributeTyped("strikethrough-position", castNumber);
export const strikethroughThickness = attributeTyped("strikethrough-thickness", castNumber);
export const stroke = attribute("stroke");
export const strokeDasharray = (ps: ReadonlyArray<number | string>) => attr("stroke-dasharray", ps.join(" "));
export const strokeDashoffset = attributeTyped("stroke-dashoffset", castNumberOrString);
export const strokeLinecap = attribute<"butt" | "round" | "square">("stroke-linecap");
export const strokeLinejoin = attribute<"arcs" | "bevel" | "miter" | "miter-clip" | "round">("stroke-linejoin");
export const strokeMiterlimit = attributeTyped("stroke-miterlimit", castNumber);
export const strokeOpacity = attributeTyped("stroke-opacity", castNumber);
export const strokeWidth = attributeTyped("stroke-width", castNumberOrString);
export const surfaceScale = attributeTyped("surfaceScale", castNumber);
export const tabIndex = attributeTyped("tabIndex", castNumber);
export const targetX = attributeTyped("targetX", castNumber);
export const targetY = attributeTyped("targetY", castNumber);
export const textAnchor = attribute<"start" | "middle" | "end" | "inherit">("text-anchor");
export const textDecoration = attribute<"none" | "underline" | "overline" | "line-through" | "blink" | "inherit">("text-decoration");
export const textRendering = attribute<"auto" | "optimizeSpeed" | "optimizeLegibility" | "geometricPrecision" | "inherit">("text-rendering");
export const textLength = attributeTyped("textLength", castNumber);
export const to = attribute("to");
export const transform = attribute("transform");
export const type = attribute("type");
export const underlinePosition = attributeTyped("underline-position", castNumber);
export const underlineThickness = attributeTyped("underline-thickness", castNumber);
export const values = attribute("values");
export const vectorEffect = attribute("vector-effect");
export const version = attribute("version");
export const viewBox = (minX: number, minY: number, width: number, height: number) => attr("viewBox", `${minX} ${minY} ${width} ${height}`);
export const visibility = attribute<"visible" | "hidden" | "collapse" | "inherit">("visibility");
export const width = attributeTyped("width", castNumberOrString);
export const wordSpacing = attribute("word-spacing");
export const writingMode = attribute<"lr-tb" | "rl-tb" | "tb-rl" | "lr" | "rl" | "tb" | "inherit">("writing-mode");
export const x = attributeTyped("x", castNumberOrString);
export const x1 = attributeTyped("x1", castNumberOrString);
export const x2 = attributeTyped("x2", castNumberOrString);
export const xChannelSelector = attribute<"R" | "G" | "B" | "A">("xChannelSelector");
export const y = attributeTyped("y", castNumberOrString);
export const y1 = attributeTyped("y1", castNumberOrString);
export const y2 = attributeTyped("y2", castNumberOrString);
export const yChannelSelector = attribute<"R" | "G" | "B" | "A">("yChannelSelector");
export const z = attributeTyped("z", castNumber);
