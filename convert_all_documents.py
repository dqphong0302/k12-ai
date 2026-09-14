import os
import sys
import time
import io
from concurrent.futures import ThreadPoolExecutor
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import docx
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph

DOC_DIR = '/Volumes/DATA/workspace/k12-ai/document'

def ocr_single_page(pdf_path, page_num, dpi=180, lang='vie+eng'):
    try:
        doc = fitz.open(pdf_path)
        page = doc[page_num]
        pix = page.get_pixmap(dpi=dpi)
        img = Image.open(io.BytesIO(pix.tobytes('png')))
        txt = pytesseract.image_to_string(img, lang=lang)
        doc.close()
        return page_num, txt.strip()
    except Exception as e:
        print(f"Error OCRing {pdf_path} page {page_num}: {e}")
        return page_num, f"[Lỗi OCR trang {page_num+1}: {e}]"

def ocr_scanned_pdf(pdf_path, out_md_path, dpi=180, max_workers=8):
    print(f"\n[OCR] Processing scanned PDF: {os.path.basename(pdf_path)}...")
    t0 = time.time()
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    doc.close()

    results = [None] * total_pages
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(ocr_single_page, pdf_path, p, dpi): p for p in range(total_pages)}
        completed = 0
        for fut in futures:
            pno, text = fut.result()
            results[pno] = text
            completed += 1
            if completed % 10 == 0 or completed == total_pages:
                print(f"  Processed {completed}/{total_pages} pages ({time.time()-t0:.1f}s)")

    md_content = []
    base_title = os.path.splitext(os.path.basename(pdf_path))[0]
    md_content.append(f"# {base_title}\n\n")
    md_content.append(f"> Tài liệu chuyển đổi OCR từ `{os.path.basename(pdf_path)}` ({total_pages} trang)\n\n---\n\n")

    for i, page_text in enumerate(results):
        md_content.append(f"<!-- Page {i+1} -->\n## Trang {i+1}\n\n{page_text}\n\n---\n\n")

    with open(out_md_path, 'w', encoding='utf-8') as f:
        f.write("".join(md_content))
    print(f"✓ Hoàn thành: {os.path.basename(out_md_path)} ({time.time()-t0:.1f}s, {len(''.join(md_content))} ký tự)")

def is_valid_table(table):
    rows = table.extract()
    if not rows or len(rows) < 1:
        return False
    # If too many columns with mostly blank cells (decorative vector grids)
    cols = len(rows[0])
    total_cells = sum(len(r) for r in rows)
    if total_cells == 0:
        return False
    non_empty = sum(1 for r in rows for c in r if (c or '').strip())
    density = non_empty / total_cells
    if cols > 10 and density < 0.4:
        return False
    if density < 0.2:
        return False
    return True

def extract_digital_pdf(pdf_path, out_md_path):
    print(f"\n[Digital PDF] Processing: {os.path.basename(pdf_path)}...")
    t0 = time.time()
    doc = fitz.open(pdf_path)
    total_pages = len(doc)

    md_content = []
    base_title = os.path.splitext(os.path.basename(pdf_path))[0]
    md_content.append(f"# {base_title}\n\n")
    md_content.append(f"> Tài liệu chuyển đổi từ PDF kỹ thuật số `{os.path.basename(pdf_path)}` ({total_pages} trang)\n\n---\n\n")

    for pno in range(total_pages):
        page = doc[pno]
        tabs = page.find_tables()

        # Filter valid tables
        valid_tabs = [t for t in tabs.tables if is_valid_table(t)]

        elements = []
        text_blocks = page.get_text('blocks')

        if valid_tabs:
            for b in text_blocks:
                bx0, by0, bx1, by1, btext, bno, btype = b
                overlap = False
                for t in valid_tabs:
                    tx0, ty0, tx1, ty1 = t.bbox
                    if not (bx1 <= tx0 + 2 or bx0 >= tx1 - 2 or by1 <= ty0 + 2 or by0 >= ty1 - 2):
                        overlap = True
                        break
                if not overlap and btext.strip():
                    elements.append((by0, 'text', btext.strip()))

            for t in valid_tabs:
                rows = t.extract()
                if not rows:
                    continue
                header = rows[0]
                cols = len(header)
                if cols == 0:
                    continue
                md_t = '| ' + ' | '.join([(c or '').replace('\n', ' ').strip() for c in header]) + ' |\n'
                md_t += '| ' + ' | '.join(['---'] * cols) + ' |\n'
                for r in rows[1:]:
                    row_cells = [(c or '').replace('\n', ' ').strip() for c in r]
                    if len(row_cells) < cols:
                        row_cells += [''] * (cols - len(row_cells))
                    elif len(row_cells) > cols:
                        row_cells = row_cells[:cols]
                    md_t += '| ' + ' | '.join(row_cells) + ' |\n'
                elements.append((t.bbox[1], 'table', md_t))

            elements.sort(key=lambda x: x[0])
            page_text = '\n\n'.join([e[2] for e in elements])
        else:
            page_text = page.get_text('text').strip()

        md_content.append(f"<!-- Page {pno+1} -->\n## Trang {pno+1}\n\n{page_text}\n\n---\n\n")

    doc.close()
    with open(out_md_path, 'w', encoding='utf-8') as f:
        f.write("".join(md_content))
    print(f"✓ Hoàn thành: {os.path.basename(out_md_path)} ({time.time()-t0:.1f}s, {len(''.join(md_content))} ký tự)")

def main():
    start_all = time.time()
    print("=== CẬP NHẬT CHUYỂN ĐỔI CÁC FILE DIGITAL VỚI BỘ LỌC BẢNG NÂNG CAO ===")

    extract_digital_pdf(
        os.path.join(DOC_DIR, "2422_PL.pdf"),
        os.path.join(DOC_DIR, "2422_PL.md")
    )

    extract_digital_pdf(
        os.path.join(DOC_DIR, "Hướng dẫn giáo dục AI cho THPT.pdf"),
        os.path.join(DOC_DIR, "Hướng dẫn giáo dục AI cho THPT.md")
    )

    extract_digital_pdf(
        os.path.join(DOC_DIR, "Hướng dẫn giáo dục AI cho tiểu học.pdf"),
        os.path.join(DOC_DIR, "Hướng dẫn giáo dục AI cho tiểu học.md")
    )

    print(f"Hoàn thành cập nhật digital PDFs trong {time.time()-start_all:.1f}s")

if __name__ == '__main__':
    main()
