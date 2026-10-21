import "server-only";

/**
 * Checking an uploaded receipt.
 *
 * Shared by the registration form and the standalone receipt page, and kept
 * out of both "use server" files because those may only export async
 * functions — a plain constant or a synchronous helper in one of them is a
 * build error, not a style problem.
 */

export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;

/**
 * What the first bytes of each allowed format look like.
 *
 * The type is decided from the file's own contents, never from its name or
 * the type the browser claims, because this is reachable by anyone on the
 * internet. A shell script called receipt.jpg does not get written to disk.
 */
const SIGNATURES: Array<{ mime: string; ext: string; test: (b: Buffer) => boolean }> = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: "image/png",
    ext: "png",
    test: (b) =>
      b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) =>
      b.subarray(0, 4).toString("ascii") === "RIFF" &&
      b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  {
    mime: "image/heic",
    ext: "heic",
    test: (b) =>
      b.subarray(4, 8).toString("ascii") === "ftyp" &&
      ["heic", "heix", "hevc", "mif1", "heim"].includes(b.subarray(8, 12).toString("ascii")),
  },
  {
    mime: "application/pdf",
    ext: "pdf",
    test: (b) => b.subarray(0, 5).toString("ascii") === "%PDF-",
  },
];

export function identifyUpload(buffer: Buffer): { mime: string; ext: string } | null {
  return SIGNATURES.find((signature) => signature.test(buffer)) ?? null;
}
