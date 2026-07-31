"""
Pulls the instructor portrait out of the Edufulness curriculum PDF.

The photo sits on page 2 as an embedded raster image, so this extracts the
original bitmap rather than re-rendering the page — you keep full resolution and
avoid the text/JPEG artefacts you'd get from a screenshot.

Usage:
    pip install pymupdf
    python scripts/extract-instructor-photo.py path/to/Edufulness_Azure_DataEngineering_Curriculum.pdf

Writes public/instructor.jpg. If several images are found on the page it keeps
the largest, which is the portrait — the other one is the small header logo.
"""

import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is not installed. Run:  pip install pymupdf")

PAGE_INDEX = 1  # page 2, zero-based
OUT = Path(__file__).resolve().parent.parent / "public" / "instructor.jpg"


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("Usage: python scripts/extract-instructor-photo.py <curriculum.pdf>")

    pdf_path = Path(sys.argv[1]).expanduser()
    if not pdf_path.exists():
        sys.exit(f"Not found: {pdf_path}")

    doc = fitz.open(pdf_path)
    images = doc[PAGE_INDEX].get_images(full=True)

    if not images:
        sys.exit(f"No embedded images found on page {PAGE_INDEX + 1}.")

    # Largest by pixel area = the portrait; the small one is the EDUFULNESS logo.
    best = None
    for img in images:
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n - pix.alpha >= 4:  # CMYK → convert before saving
            pix = fitz.Pixmap(fitz.csRGB, pix)
        area = pix.width * pix.height
        if best is None or area > best[0]:
            best = (area, pix)

    assert best is not None
    _, pix = best

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pix.save(OUT)
    print(f"Wrote {OUT}  ({pix.width}×{pix.height})")


if __name__ == "__main__":
    main()
