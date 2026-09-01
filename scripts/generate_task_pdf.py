from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Tasks_Document.pdf"
ROOT_COPY = ROOT / "Tasks_Document.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#0B1220")
NAVY_2 = colors.HexColor("#111B30")
BLUE = colors.HexColor("#3658F5")
BLUE_DARK = colors.HexColor("#243DB6")
BLUE_SOFT = colors.HexColor("#E8EDFF")
TEAL = colors.HexColor("#18A982")
TEAL_SOFT = colors.HexColor("#E2F7F0")
AMBER = colors.HexColor("#DF8A2F")
AMBER_SOFT = colors.HexColor("#FFF3DF")
RED = colors.HexColor("#CF5660")
RED_SOFT = colors.HexColor("#FDEBED")
INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#5F6879")
DIM = colors.HexColor("#7D8798")
LINE = colors.HexColor("#DDE2EB")
PAPER = colors.HexColor("#F3F5F9")
WHITE = colors.white

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
TOP = 20 * mm
BOTTOM = 17 * mm


def register_fonts():
    candidates = [
        (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ),
        (
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
        ),
    ]
    for regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont("VXRegular", regular))
            pdfmetrics.registerFont(TTFont("VXBold", bold))
            return "VXRegular", "VXBold"
    return "Helvetica", "Helvetica-Bold"


REGULAR, BOLD = register_fonts()

styles = getSampleStyleSheet()
BODY = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName=REGULAR,
    fontSize=9.4,
    leading=14,
    textColor=INK,
    spaceAfter=7,
)
BODY_MUTED = ParagraphStyle(
    "BodyMuted",
    parent=BODY,
    textColor=MUTED,
)
SMALL = ParagraphStyle(
    "Small",
    parent=BODY,
    fontSize=7.8,
    leading=11,
    textColor=MUTED,
)
TINY = ParagraphStyle(
    "Tiny",
    parent=SMALL,
    fontSize=6.8,
    leading=9,
)
H1 = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontName=BOLD,
    fontSize=26,
    leading=29,
    textColor=INK,
    spaceAfter=10,
)
H2 = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontName=BOLD,
    fontSize=17,
    leading=21,
    textColor=INK,
    spaceBefore=4,
    spaceAfter=9,
)
H3 = ParagraphStyle(
    "H3",
    parent=styles["Heading3"],
    fontName=BOLD,
    fontSize=11.5,
    leading=14,
    textColor=INK,
    spaceBefore=5,
    spaceAfter=5,
)
KICKER = ParagraphStyle(
    "Kicker",
    parent=SMALL,
    fontName=BOLD,
    fontSize=7,
    leading=9,
    textColor=BLUE_DARK,
    spaceAfter=4,
)
COVER_TITLE = ParagraphStyle(
    "CoverTitle",
    parent=H1,
    fontSize=31,
    leading=35,
    textColor=WHITE,
    spaceAfter=9,
)
COVER_SUB = ParagraphStyle(
    "CoverSub",
    parent=BODY,
    fontSize=11,
    leading=16,
    textColor=colors.HexColor("#C7D0E2"),
)
TABLE_HEAD = ParagraphStyle(
    "TableHead",
    parent=SMALL,
    fontName=BOLD,
    fontSize=7,
    leading=9,
    textColor=WHITE,
)
TABLE_CELL = ParagraphStyle(
    "TableCell",
    parent=SMALL,
    fontSize=7.6,
    leading=10.2,
    textColor=INK,
)
TABLE_CELL_BOLD = ParagraphStyle(
    "TableCellBold",
    parent=TABLE_CELL,
    fontName=BOLD,
)
CHECK = ParagraphStyle(
    "Check",
    parent=SMALL,
    leftIndent=12,
    firstLineIndent=-12,
    bulletIndent=0,
    spaceAfter=4,
)


def p(text, style=BODY):
    return Paragraph(escape(str(text)).replace("\n", "<br/>"), style)


def rich(text, style=BODY):
    return Paragraph(text, style)


def bullet(text):
    return Paragraph("&#9633;&nbsp;&nbsp;" + escape(text), CHECK)


def status_badge(text, tone="blue"):
    palette = {
        "blue": (BLUE_SOFT, BLUE_DARK),
        "green": (TEAL_SOFT, colors.HexColor("#0B7658")),
        "amber": (AMBER_SOFT, colors.HexColor("#8A5B1E")),
        "red": (RED_SOFT, colors.HexColor("#8E3841")),
    }
    bg, fg = palette[tone]
    table = Table([[p(text.upper(), ParagraphStyle("Badge", parent=TINY, fontName=BOLD, textColor=fg, alignment=TA_CENTER))]], colWidths=[36 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.6, fg),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return table


def data_table(rows, widths, header=True, font_size=7.6):
    converted = []
    for row_index, row in enumerate(rows):
        converted.append([
            cell if hasattr(cell, "wrap") else p(
                cell,
                TABLE_HEAD if header and row_index == 0 else (
                    TABLE_CELL_BOLD if (not header or row_index > 0) and col_index == 0 else TABLE_CELL
                ),
            )
            for col_index, cell in enumerate(row)
        ])
    table = Table(converted, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
    ]
    if header:
        commands += [
            ("BACKGROUND", (0, 0), (-1, 0), NAVY),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ]
        if len(rows) > 1:
            commands.append(("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, colors.HexColor("#F8F9FC")]))
    else:
        commands.append(("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, colors.HexColor("#F8F9FC")]))
    table.setStyle(TableStyle(commands))
    return table


def callout(title, text, tone="blue"):
    palette = {
        "blue": (BLUE_SOFT, BLUE_DARK),
        "green": (TEAL_SOFT, colors.HexColor("#0B7658")),
        "amber": (AMBER_SOFT, colors.HexColor("#8A5B1E")),
        "red": (RED_SOFT, colors.HexColor("#8E3841")),
    }
    bg, fg = palette[tone]
    content = [
        p(title.upper(), ParagraphStyle("CalloutTitle", parent=KICKER, textColor=fg)),
        p(text, ParagraphStyle("CalloutBody", parent=SMALL, textColor=INK)),
    ]
    table = Table([[content]], colWidths=[PAGE_W - (2 * MARGIN_X)])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.7, fg),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def section_heading(number, title, subtitle=None):
    content = [
        p(number, ParagraphStyle("SectionNumber", parent=KICKER, textColor=BLUE_DARK)),
        p(title, H1),
    ]
    if subtitle:
        content.append(p(subtitle, BODY_MUTED))
    content.append(Spacer(1, 3 * mm))
    return content


def task_header(code, domain, timebox, mode, title):
    meta = data_table(
        [
            ["Task ref.", "Domain", "Timebox", "Implementation mode"],
            [code, domain, timebox, mode],
        ],
        [30 * mm, 35 * mm, 35 * mm, 58 * mm],
    )
    return [
        p(f"{code} - {title}", H2),
        meta,
        Spacer(1, 4 * mm),
    ]


def requirements(rows):
    return data_table(
        [["Work area", "Required work"]] + rows,
        [46 * mm, 112 * mm],
    )


def acceptance(items):
    return KeepTogether([
        p("Expected deliverable", H3),
        *[bullet(item) for item in items],
    ])


def draw_brand_mark(canvas, x, y, size):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.roundRect(x, y, size, size, size * 0.22, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#8EA0FF"))
    canvas.setLineWidth(size * 0.09)
    canvas.setLineCap(1)
    canvas.line(x + size * 0.25, y + size * 0.72, x + size * 0.5, y + size * 0.28)
    canvas.line(x + size * 0.5, y + size * 0.28, x + size * 0.75, y + size * 0.72)
    canvas.setStrokeColor(TEAL)
    canvas.line(x + size * 0.5, y + size * 0.28, x + size * 0.5, y + size * 0.14)
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 119 * mm, PAGE_W, 119 * mm, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.rect(0, PAGE_H - 4 * mm, PAGE_W * 0.68, 4 * mm, fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.rect(PAGE_W * 0.68, PAGE_H - 4 * mm, PAGE_W * 0.32, 4 * mm, fill=1, stroke=0)
    draw_brand_mark(canvas, MARGIN_X, PAGE_H - 31 * mm, 14 * mm)
    canvas.setFont(BOLD, 12)
    canvas.setFillColor(WHITE)
    canvas.drawString(MARGIN_X + 18 * mm, PAGE_H - 23 * mm, "VaultX")
    canvas.setFont(REGULAR, 6.8)
    canvas.setFillColor(colors.HexColor("#9DA9BF"))
    canvas.drawString(MARGIN_X + 18 * mm, PAGE_H - 27.5 * mm, "REAL ASSET CAPITAL WORKSPACE")
    canvas.setFont(BOLD, 6.7)
    canvas.setFillColor(colors.HexColor("#C7D0E2"))
    canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 22 * mm, "CONFIDENTIAL - INTERNAL REVIEW")
    canvas.setFont(REGULAR, 6.7)
    canvas.setFillColor(DIM)
    canvas.drawString(MARGIN_X, 9 * mm, "VX-V3-TASK-SPEC-AUG2026")
    canvas.drawRightString(PAGE_W - MARGIN_X, 9 * mm, "Page 1")
    canvas.restoreState()


def standard_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN_X, PAGE_H - 13 * mm, PAGE_W - MARGIN_X, PAGE_H - 13 * mm)
    draw_brand_mark(canvas, MARGIN_X, PAGE_H - 10.5 * mm, 6 * mm)
    canvas.setFont(BOLD, 6.7)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN_X + 8 * mm, PAGE_H - 8.7 * mm, "VAULTX V3 PRODUCT AND ENGINEERING TASK SPECIFICATION")
    canvas.setFillColor(RED)
    canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 8.7 * mm, "CONFIDENTIAL - INTERNAL REVIEW")
    canvas.setStrokeColor(LINE)
    canvas.line(MARGIN_X, 13 * mm, PAGE_W - MARGIN_X, 13 * mm)
    canvas.setFont(REGULAR, 6.7)
    canvas.setFillColor(DIM)
    canvas.drawString(MARGIN_X, 8.5 * mm, "VX-V3-TASK-SPEC-AUG2026 | v3.0")
    canvas.drawRightString(PAGE_W - MARGIN_X, 8.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=MARGIN_X,
    rightMargin=MARGIN_X,
    topMargin=TOP,
    bottomMargin=BOTTOM,
    title="VaultX v3 Product and Engineering Task Specification",
    author="VaultX Protocol",
    subject="Product baseline, engineering tasks, acceptance criteria, and QA gates",
)

cover_frame = Frame(MARGIN_X, BOTTOM, PAGE_W - 2 * MARGIN_X, PAGE_H - BOTTOM - 30 * mm, id="cover")
body_frame = Frame(MARGIN_X, BOTTOM, PAGE_W - 2 * MARGIN_X, PAGE_H - TOP - BOTTOM, id="body")
doc.addPageTemplates([
    PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_page),
    PageTemplate(id="Body", frames=[body_frame], onPage=standard_page),
])

story = []

# Cover
story += [
    Spacer(1, 36 * mm),
    p("VAULTX V3", ParagraphStyle("CoverKicker", parent=KICKER, textColor=colors.HexColor("#9DAEFF"), fontSize=8)),
    rich("Product and Engineering<br/>Task Specification", COVER_TITLE),
    p("Updated workspace baseline, delivery tasks, acceptance criteria, security gates, and handoff record.", COVER_SUB),
    Spacer(1, 18 * mm),
]

cover_meta = Table(
    [
        [status_badge("V3 workspace baseline", "green"), status_badge("Testnet proof of concept", "amber")],
    ],
    colWidths=[79 * mm, 79 * mm],
)
cover_meta.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
]))
story += [cover_meta, Spacer(1, 8 * mm)]

story += [
    p("Document purpose", H2),
    p(
        "Define the delivered VaultX v3 frontend baseline and the next independent engineering tasks required to replace illustrative data with verified APIs, indexed wallet positions, and on-chain document and treasury controls.",
        BODY,
    ),
    Spacer(1, 2 * mm),
    data_table(
        [
            ["Field", "Value", "Field", "Value"],
            ["Project", "VaultX RWA PoC", "Document version", "3.0"],
            ["Release baseline", "Frontend v3.0.0", "Prepared date", "5 August 2026"],
            ["Review status", "Engineering review", "Execution model", "Independent task groups"],
            ["Primary audience", "Product, frontend, API, Solidity, QA", "Classification", "Internal review"],
        ],
        [29 * mm, 50 * mm, 31 * mm, 48 * mm],
    ),
    Spacer(1, 6 * mm),
    callout(
        "Production boundary",
        "This document describes a proof of concept. It is not an audit report, legal opinion, offering document, custody specification, or deployment approval.",
        "amber",
    ),
    NextPageTemplate("Body"),
    PageBreak(),
]

# Page 2
story += section_heading(
    "1.0",
    "Executive context",
    "The v3 release replaces the previous dark green marketing layout with an institutional capital-workspace system and adds functional investor workflows.",
)
story += [
    p("What changed", H2),
    data_table(
        [
            ["Area", "Previous baseline", "V3 baseline"],
            ["Visual system", "Dark green and gold template styling", "Light editorial workspace, midnight navigation, cobalt actions, explicit status tones"],
            ["Asset discovery", "Static cards and category filter", "Search, sort, local watchlist, compare up to three assets, detail drawer, allocation model"],
            ["Investor operations", "No portfolio workspace", "Modeled holdings, allocation, distributions, activity, privacy control, CSV export"],
            ["Compliance", "Task-only concept", "Jurisdiction context, local checklist, readiness gates, document register"],
            ["Execution", "Presale, staking, and swap screens", "Clear wallet, network, address, API, and contract gating with preview-only calculators"],
            ["Resilience", "Single large application bundle", "Lazy routes, vendor chunking, error boundary, 404 route, reduced-motion support"],
        ],
        [34 * mm, 58 * mm, 66 * mm],
    ),
    Spacer(1, 5 * mm),
    p("Design principles", H2),
    data_table(
        [
            ["Principle", "Required product behavior"],
            ["Asset context first", "Show opportunity structure and disclosures before transaction controls."],
            ["Truthful states", "Label modeled data, missing integrations, disabled actions, and configuration gaps directly."],
            ["Compliance is visible", "Expose identity, jurisdiction, agreement, document, and contract readiness as product state."],
            ["No false execution", "Never enable a transaction from preview data or inferred deployment status."],
            ["Modular evolution", "Keep discovery, portfolio, compliance, presale, swap, staking, and registry routes independently deployable."],
        ],
        [45 * mm, 113 * mm],
    ),
    Spacer(1, 5 * mm),
    callout(
        "Release decision",
        "The v3 interface is suitable for product demonstration and engineering review. It is not suitable for production capital until the integration and assurance tasks in this document are complete.",
        "blue",
    ),
    PageBreak(),
]

# Page 3
story += section_heading("2.0", "Implemented v3 baseline", "These capabilities are present in the supplied project and define the starting point for all further work.")
story += [
    data_table(
        [
            ["Route", "Capability", "Data / action state"],
            ["/", "Platform overview and architecture narrative", "Illustrative product content"],
            ["/gallery", "Search, filter, sort, watchlist, compare, drawer, allocation model", "Illustrative asset dataset; local preferences"],
            ["/portfolio", "Holdings, allocation, projected distributions, activity, CSV export", "Illustrative positions; wallet state visible"],
            ["/compliance", "Jurisdiction context, readiness checklist, gates, document register", "Local checklist; demo hashes"],
            ["/presale", "Contribution planner and contract-aware deposit/claim/refund console", "Planner is illustrative; actions use configured contract"],
            ["/stake", "Term and reward model with explicit unavailable contract state", "No staking transaction is sent"],
            ["/swap", "1inch token selection, quote, gas, and execution flow", "Wallet, supported network, and API key required"],
            ["/transactions", "Connected-wallet ERC-20 activity", "Explorer API required"],
            ["/nfts", "Connected-wallet asset-token holdings", "Wallet and metadata provider required"],
        ],
        [26 * mm, 75 * mm, 57 * mm],
    ),
    Spacer(1, 5 * mm),
    p("Delivered product controls", H2),
    data_table(
        [
            ["Control", "Implementation"],
            ["Persistent watchlist", "Browser-local vaultx_watchlist store; portfolio reads the saved count."],
            ["Compliance checklist", "Browser-local vaultx_compliance_checklist store; clear/reset control provided."],
            ["Comparison limit", "Maximum of three assets with an explicit user notice."],
            ["CSV export", "Client-side portfolio-preview export; no server transmission."],
            ["Value privacy", "Portfolio values can be masked without changing data."],
            ["Error recovery", "Application error boundary states that no transaction was submitted and offers reload."],
            ["Route recovery", "Dedicated 404 route with safe navigation."],
            ["Accessibility", "Skip link, focus-visible treatment, reduced-motion behavior, labels, pressed states, and mobile drawer."],
        ],
        [44 * mm, 114 * mm],
    ),
    PageBreak(),
]

# Page 4
story += section_heading("3.0", "Acceptance evidence and known boundaries", "The handoff includes a successful production build and a dependency review, with remaining major-version migrations explicitly deferred.")
story += [
    p("Verified in this update", H2),
    data_table(
        [
            ["Gate", "Evidence", "Result"],
            ["Production build", "Vite transformed 893 modules and emitted route-level chunks.", "PASS"],
            ["Chunk strategy", "React, UI, Web3, and general vendor dependencies are separated.", "PASS"],
            ["High-severity dependency gate", "Unused request and axios packages removed; high/critical production audit gate passes.", "PASS"],
            ["PDF layout", "Generated with ReportLab, rendered through Poppler, and visually reviewed page by page.", "PASS after final render"],
            ["Transaction defaults", "Missing wallet, network, contract, or API configuration keeps relevant actions unavailable.", "PASS"],
        ],
        [43 * mm, 83 * mm, 32 * mm],
    ),
    Spacer(1, 5 * mm),
    p("Known boundaries", H2),
    data_table(
        [
            ["Boundary", "Current state", "Required resolution"],
            ["Asset dataset", "Static illustrative JavaScript records", "FE-31 canonical schema and API adapter"],
            ["Portfolio positions", "Static preview holdings", "FE-32 indexed on-chain and servicing data"],
            ["Compliance", "Self-assessment only", "Identity / KYC provider, policy engine, manual review workflow"],
            ["Document hashes", "Demo strings", "BE-22 metadata API plus SC-23 anchor contract"],
            ["Staking", "Calculator only", "Verified staking contract, ABI, chain config, and tests"],
            ["Dependency advisories", "Low/moderate advisories remain in ethers v5 and router v6 trees", "SEC-31 React 18, Router 7, and ethers 6 migration"],
            ["Remote imagery", "Unsplash URLs for presentation", "Licensed and versioned production asset library"],
        ],
        [42 * mm, 55 * mm, 61 * mm],
    ),
    Spacer(1, 5 * mm),
    callout(
        "No silent substitution",
        "Do not replace missing production data with the current preview values. Loading, empty, unavailable, and error states are required acceptance behaviors.",
        "red",
    ),
    PageBreak(),
]

# Page 5
story += section_heading("4.0", "Task Group 1 - 1 business day", "Short, independent tasks that improve integration readiness without requiring the three-day backend and contract work.")
story += [
    data_table(
        [
            ["Ref.", "Domain", "Task", "Dependency", "Primary result"],
            ["FE-31", "Frontend", "Canonical asset schema and deep-linked drawer", "None", "Asset UI can consume API-shaped data"],
            ["BE-12", "Express", "Public platform status API", "None", "Stable readiness response"],
            ["SC-13", "Solidity", "VaultXTreasuryLedger contract", "None", "Auditable allocation categories"],
            ["QA-11", "Frontend QA", "Route and state smoke suite", "None", "Automated critical-flow coverage"],
        ],
        [20 * mm, 25 * mm, 47 * mm, 25 * mm, 41 * mm],
    ),
    Spacer(1, 7 * mm),
    p("Delivery control matrix", H2),
    data_table(
        [
            ["Task", "Start condition", "Completion evidence"],
            ["FE-31", "V3 gallery is available", "Schema fixture, deep-link behavior, error/empty/loading states, build passes"],
            ["BE-12", "Express shell can run locally", "Endpoint tests and stable response contract"],
            ["SC-13", "Solidity compiler and deployment project available", "Contract compiles, tests pass, events verified"],
            ["QA-11", "V3 routes build successfully", "Headless route smoke and local-state tests"],
        ],
        [27 * mm, 58 * mm, 73 * mm],
    ),
    Spacer(1, 7 * mm),
    callout(
        "Independence rule",
        "Each task must be reviewable on its own branch. No Task Group 1 item may depend on completion of another item.",
        "green",
    ),
    PageBreak(),
]

# Page 6 FE-31
story += task_header("FE-31", "FRONTEND", "1 business day", "Independent", "Add canonical asset schema and deep-linked opportunity drawer")
story += [
    p("Technical target", H3),
    p("Move opportunity records behind one canonical adapter and allow direct opening of an opportunity with /gallery?asset=VX-101 while preserving search, filters, watchlist, compare, and drawer behavior."),
    p("Required work", H3),
    requirements([
        ["Schema", "Create src/data/assets.js and export a normalized asset model with identifiers, financial fields, operating metrics, documents, and disclosure state."],
        ["Adapter", "Create an asset data adapter that accepts local fixtures now and an API response later without changing component props."],
        ["Deep link", "Read the asset query parameter, validate the identifier, open the correct drawer, and remove invalid parameters safely."],
        ["States", "Add skeleton, empty, unavailable, malformed-data, and retry states. Never substitute another asset when the identifier is invalid."],
        ["Persistence", "Version the watchlist storage payload and migrate the current array shape without losing saved identifiers."],
        ["Accessibility", "Return focus to the triggering card after drawer close and announce compare-limit notices."],
    ]),
    Spacer(1, 5 * mm),
    p("Main files", H3),
    data_table(
        [
            ["Path", "Review purpose"],
            ["src/data/assets.js", "Canonical schema and local fixture"],
            ["src/services/assets.js", "Adapter and response validation"],
            ["src/features/marketplace/GalleryItems.jsx", "Loading, error, filter, watchlist, compare, and detail integration"],
        ],
        [78 * mm, 80 * mm],
    ),
    Spacer(1, 4 * mm),
    acceptance([
        "Direct asset URL opens the matching opportunity.",
        "Invalid asset ID shows a clear unavailable state.",
        "Search, filters, sort, watchlist, and compare continue to work.",
        "Local storage migration preserves current watchlist IDs.",
        "Production build completes with no console error.",
    ]),
    PageBreak(),
]

# Page 7 BE-12 and QA-11
story += task_header("BE-12", "EXPRESS", "1 business day", "Independent", "Add public platform status API")
story += [
    p("Technical target", H3),
    p("Provide a stable, non-RPC status endpoint for the frontend to display environment, configured networks, contract readiness, and integration readiness."),
    requirements([
        ["Endpoint", "GET /api/platform/status"],
        ["Response", "Return success, data.environment, data.networks, data.contracts, data.integrations, and data.checkedAt."],
        ["Safety", "Never return API keys, private URLs, deployment credentials, or privileged addresses."],
        ["Caching", "Set a short public cache policy and expose a deterministic response when optional services are not configured."],
        ["Tests", "Cover 200 response, missing configuration, invalid environment, and stable response keys."],
    ]),
    Spacer(1, 4 * mm),
    acceptance([
        "Endpoint runs without blockchain RPC.",
        "Response shape is stable across configured and missing states.",
        "No secret values appear in the payload.",
        "Endpoint tests pass locally.",
    ]),
    Spacer(1, 7 * mm),
    p("QA-11 - Route and state smoke suite", H2),
    requirements([
        ["Route coverage", "Load home, gallery, portfolio, compliance, presale, stake, swap, about, contact, and the 404 route."],
        ["Local state", "Test watchlist save/remove, compare max three, compliance save/reset, privacy toggle, and CSV action."],
        ["Execution gates", "Assert that presale, staking, swap, NFT, and transaction actions remain unavailable without required context."],
        ["Accessibility", "Assert unique landmarks, keyboard-reachable controls, drawer close behavior, and visible focus."],
    ]),
    PageBreak(),
]

# Page 8 SC-13
story += task_header("SC-13", "SOLIDITY", "1 business day", "Standalone", "Add VaultXTreasuryLedger contract")
story += [
    p("Technical target", H3),
    p("Add an independent owner-controlled ledger for recording treasury allocation categories, reference hashes, release amounts, and active state without modifying presale behavior."),
    requirements([
        ["Contract", "Create contracts/VaultXTreasuryLedger.sol."],
        ["Category model", "Store categoryId, label, allocatedAmount, releasedAmount, referenceHash, createdAt, and active."],
        ["Functions", "createCategory, updateReferenceHash, releaseAllocation, deactivateCategory, and getCategory."],
        ["Validation", "Reject empty identifiers, zero allocation, zero hash, duplicate category, over-release, and updates to inactive categories."],
        ["Access", "Only the owner can create, update, release, or deactivate."],
        ["Events", "TreasuryCategoryCreated, TreasuryReferenceUpdated, TreasuryAllocationReleased, and TreasuryCategoryDeactivated."],
        ["Isolation", "Do not import or call VaultXPresale. No ETH or token custody is required in this task."],
    ]),
    Spacer(1, 5 * mm),
    p("Test matrix", H3),
    data_table(
        [
            ["Scenario", "Expected result"],
            ["Owner creates valid category", "State stored and event emitted"],
            ["Duplicate identifier", "Transaction reverts"],
            ["Non-owner mutation", "Transaction reverts"],
            ["Release below remaining amount", "releasedAmount increases and event emitted"],
            ["Release above remaining amount", "Transaction reverts"],
            ["Deactivate category", "Further mutation reverts"],
        ],
        [70 * mm, 88 * mm],
    ),
    Spacer(1, 5 * mm),
    acceptance([
        "Contract compiles under the project compiler.",
        "Unit tests cover every validation and owner gate.",
        "Ledger remains independent from presale and token custody.",
        "Deployment migration is included.",
    ]),
    PageBreak(),
]

# Page 9 Task Group 2 + FE-32
story += section_heading("5.0", "Task Group 2 - 3 business days", "Integration tasks that replace major preview-only surfaces with verified services and contract records.")
story += [
    data_table(
        [
            ["Ref.", "Domain", "Task", "Primary dependency"],
            ["FE-32", "Frontend", "Bind portfolio to indexed wallet positions and servicing data", "Portfolio API contract"],
            ["BE-22", "Express", "Asset and document metadata API", "Database or stable fixture repository"],
            ["SC-23", "Solidity", "VaultXDocumentAnchor contract", "None"],
            ["SEC-31", "Platform", "React 18, Router 7, ethers 6 modernization", "Automated smoke suite"],
        ],
        [22 * mm, 28 * mm, 66 * mm, 42 * mm],
    ),
    Spacer(1, 6 * mm),
]
story += task_header("FE-32", "FRONTEND", "3 business days", "Integration", "Bind portfolio to verified wallet and servicing data")
story += [
    p("Technical target", H3),
    p("Replace the static portfolio dataset with an explicit multi-source model that distinguishes on-chain token balances, indexed transactions, asset-servicing values, and projected cash flows."),
    requirements([
        ["Data layer", "Create portfolio service hooks with loading, partial, stale, empty, unsupported-chain, and error states."],
        ["Wallet changes", "Cancel stale requests and reload the portfolio when account or chain changes."],
        ["Source labels", "Label every metric as on-chain, indexed, serviced, modeled, or unavailable."],
        ["Export", "Export the currently displayed verified dataset and include as-of timestamps and source labels."],
        ["Privacy", "Keep the value mask state local and never include masked placeholders in exports."],
        ["Resilience", "Allow partial portfolio rendering when one upstream source is unavailable."],
    ]),
    Spacer(1, 4 * mm),
    acceptance([
        "No static holding appears after the API adapter is enabled.",
        "Account and chain changes cannot show stale positions.",
        "Partial and stale data are clearly labeled.",
        "CSV export includes source and as-of metadata.",
        "Empty wallets receive a useful discovery action.",
    ]),
    PageBreak(),
]

# Page 10 BE-22
story += task_header("BE-22", "EXPRESS", "3 business days", "Independent API", "Add asset and document metadata API")
story += [
    p("Technical target", H3),
    p("Expose stable asset, opportunity, disclosure, and document records for marketplace and compliance routes without requiring Solidity or RPC access."),
    requirements([
        ["Endpoints", "GET /api/assets, GET /api/assets/:assetId, GET /api/assets/:assetId/documents, and GET /api/documents/:documentId."],
        ["Asset response", "Include assetId, name, type, location, operating metrics, modeled financial fields, status, risk label, updatedAt, and disclosureSummary."],
        ["Document response", "Include documentId, assetId, documentType, version, status, metadataURI, documentHash, source, issuedAt, and updatedAt."],
        ["Validation", "Validate path parameters, pagination, sort fields, status filters, and response schemas."],
        ["Error shape", "Return success:false with error.code, error.message, and requestId. Do not expose stack traces."],
        ["Caching", "Support ETag or last-modified behavior for stable public records."],
        ["Tests", "Cover list, detail, not found, malformed ID, filter, pagination, and stale-record behavior."],
    ]),
    Spacer(1, 5 * mm),
    p("Stable response contract", H3),
    data_table(
        [
            ["Response", "Required keys"],
            ["List success", "success, data.items, data.page, data.pageSize, data.total, data.asOf"],
            ["Detail success", "success, data.asset, data.documents, data.asOf"],
            ["Failure", "success:false, error.code, error.message, requestId"],
        ],
        [45 * mm, 113 * mm],
    ),
    Spacer(1, 5 * mm),
    acceptance([
        "Frontend can populate gallery and document register from the API.",
        "Missing records return deterministic not-found responses.",
        "Every response includes an as-of or updated timestamp.",
        "No privileged or personal identity data appears in public endpoints.",
        "API tests pass without RPC access.",
    ]),
    PageBreak(),
]

# Page 11 SC-23
story += task_header("SC-23", "SOLIDITY", "3 business days", "Standalone", "Add VaultXDocumentAnchor contract")
story += [
    p("Technical target", H3),
    p("Record immutable document keys and mutable active state for asset disclosure references while keeping document bytes and personal data off-chain."),
    requirements([
        ["Contract", "Create contracts/VaultXDocumentAnchor.sol."],
        ["Record", "Store assetId, documentType, metadataURI, documentHash, createdAt, createdBy, and active."],
        ["Key", "Generate keccak256(abi.encode(assetId, documentType, documentHash)). Do not use abi.encodePacked for dynamic strings."],
        ["Functions", "anchorDocument, deactivateDocument, getDocument, and documentExists."],
        ["Validation", "Reject empty assetId, empty documentType, empty metadataURI, zero hash, and duplicate key."],
        ["Access", "Use role-based anchoring and deactivation, with an admin-controlled issuer role."],
        ["Privacy", "Never write identity documents, names, addresses, or personal metadata to chain."],
        ["Events", "DocumentAnchored and DocumentDeactivated with indexed document key and hash."],
    ]),
    Spacer(1, 5 * mm),
    p("Security review focus", H3),
    data_table(
        [
            ["Area", "Review gate"],
            ["Key collisions", "Canonical abi.encode input and duplicate-key rejection"],
            ["Authorization", "Admin and issuer roles covered by positive and negative tests"],
            ["Mutability", "Only active state changes; original record fields remain unchanged"],
            ["Privacy", "No personal or confidential document contents stored"],
            ["Observability", "Events include enough identifiers for indexer reconciliation"],
        ],
        [45 * mm, 113 * mm],
    ),
    Spacer(1, 5 * mm),
    acceptance([
        "Contract compiles and unit tests pass.",
        "Duplicate anchors and zero hashes revert.",
        "Unauthorized anchoring and deactivation revert.",
        "Deactivated records remain readable and auditable.",
        "Deployment migration and ABI update are included.",
    ]),
    PageBreak(),
]

# Page 12 SEC and signoff
story += task_header("SEC-31", "PLATFORM", "3 business days", "Breaking migration", "Modernize React, Router, and ethers dependencies")
story += [
    p("Technical target", H3),
    p("Remove the remaining low/moderate production dependency advisories by migrating the application from React 17, React Router 6, and ethers 5 to supported major versions behind an automated route and wallet smoke suite."),
    requirements([
        ["Foundation", "Upgrade to React 18 and createRoot before changing Router or ethers."],
        ["Routing", "Upgrade to React Router 7, verify all programmatic navigation, deep links, 404 behavior, and Vercel rewrites."],
        ["Web3", "Migrate ethers v5 providers, contracts, units, and BigNumber usage to ethers v6 equivalents."],
        ["Compatibility layer", "Update Web3ReactCompat and ReactMoralisCompat without weakening wallet or network gates."],
        ["Tests", "Run QA-11 before and after each major migration. Add contract read/write mocks."],
        ["Audit", "Run production dependency audit and record remaining advisories with owners and due dates."],
    ]),
    Spacer(1, 5 * mm),
    callout(
        "Migration control",
        "Do not use forced audit fixes on the current branch. The proposed upgrades are breaking and require isolated commits, smoke tests, and explicit wallet regression review.",
        "red",
    ),
    Spacer(1, 6 * mm),
    p("Senior review checklist", H2),
    data_table(
        [
            ["Area", "Review gate", "Sign-off"],
            ["Frontend", "All routes, local-state features, responsive layouts, and preview labels remain correct.", "[ ] Approved"],
            ["API", "Status, asset, document, and portfolio response shapes are stable and tested.", "[ ] Approved"],
            ["Solidity", "Treasury ledger and document anchor compile, validate, emit, and remain independent.", "[ ] Approved"],
            ["Security", "No forced migration, no secret exposure, and dependency audit is recorded.", "[ ] Approved"],
            ["QA", "Build, route smoke, wallet gates, accessibility checks, and PDF render review pass.", "[ ] Approved"],
        ],
        [31 * mm, 98 * mm, 29 * mm],
    ),
    PageBreak(),
]
story += section_heading(
    "6.0",
    "Handoff and approval",
    "The release package must remain reproducible, reviewable, and explicit about preview-only behavior.",
)
story += [
    p("Release package", H2),
    data_table(
        [
            ["Artifact", "Expected content", "Review result"],
            ["Source project", "VaultX frontend, Solidity sources, Truffle files, environment template, and Vercel configuration", "[ ] Received"],
            ["Task document", "Tasks_Document.pdf plus scripts/generate_task_pdf.py", "[ ] Received"],
            ["Build evidence", "Successful npm run build output and emitted chunk inventory", "[ ] Reviewed"],
            ["Dependency record", "Production audit result, deferred migration task, and no forced audit fix", "[ ] Reviewed"],
            ["Preview boundaries", "Illustrative data labels, unavailable integration states, and testnet notice", "[ ] Reviewed"],
        ],
        [37 * mm, 91 * mm, 30 * mm],
    ),
    Spacer(1, 5 * mm),
    p("Final handoff checklist", H2),
    data_table(
        [
            ["Check", "Owner confirmation"],
            ["Updated project builds from a clean dependency install.", "[ ] Confirmed"],
            ["Opportunity watchlist, comparison, drawer, and calculator behave as specified.", "[ ] Confirmed"],
            ["Portfolio export and compliance checklist remain local to the browser.", "[ ] Confirmed"],
            ["Missing wallet, network, API, and contract states keep execution unavailable.", "[ ] Confirmed"],
            ["PDF pages render without clipping, overlap, unreadable text, or empty spill pages.", "[ ] Confirmed"],
        ],
        [118 * mm, 40 * mm],
    ),
    Spacer(1, 6 * mm),
    p("Approval record", H2),
    data_table(
        [
            ["Name", "Role / title", "Signature", "Date"],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
        ],
        [42 * mm, 46 * mm, 42 * mm, 28 * mm],
    ),
    Spacer(1, 5 * mm),
    callout(
        "Handoff statement",
        "Prepared for internal VaultX product and engineering review. Production deployment requires separate security, legal, compliance, operational, and change-management approvals.",
        "blue",
    ),
]

doc.build(story)
copyfile(OUTPUT, ROOT_COPY)
print(f"Generated {OUTPUT}")
print(f"Copied {ROOT_COPY}")
