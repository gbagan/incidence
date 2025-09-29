import katex, { type KatexOptions } from "katex";
export default function katexify(math: string, displayMode: boolean = false) {
  const options: KatexOptions = {
	  displayMode: displayMode,
	  throwOnError: false,
    output: "html"
  };
  return katex.renderToString(math, options);
}