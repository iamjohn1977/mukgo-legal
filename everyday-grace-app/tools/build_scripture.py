#!/usr/bin/env python3
"""Resolve every scripture reference in content/*.json against public-domain Bibles.

Verse text is NEVER authored by hand — it is looked up from the source corpora so
the shipped app always quotes a real, license-cleared translation.
"""
import csv, json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
SOURCES_DIR = os.environ.get('GRACE_SOURCES', os.path.join(BUILD, '.sources'))
CSV_DIR = os.path.join(SOURCES_DIR, 'bible_databases', 'formats', 'csv')
HINDI_JSON = os.path.join(SOURCES_DIR, 'Bible-Database', 'Hindi', 'bible.json')

# locale -> (primary corpus, fallback corpus, translation label, license note)
SOURCES = {
    'ko': ('KorRV', None,
           '성경전서 개역한글판',
           '© 대한성서공회. 저작재산권 보호기간 경과로 저작권료 없이 사용, 동일성유지권·성명표시권 준수.'),
    'en': ('ASV', None,
           'American Standard Version (1901)',
           'Public domain.'),
    'zh': ('ChiUn', None,
           '和合本 (Chinese Union Version, 1919)',
           'Public domain.'),
    'es': ('SpaRV', None,
           'Reina-Valera (1909)',
           'Public domain.'),
    'fr': ('FreJND', None,
           'Bible Darby (1885)',
           'Public domain.'),
    'ja': ('JapDenmo', 'JapBungo',
           '電網聖書 / 文語訳聖書',
           'Public domain.'),
}

BOOKS_EN = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges',
    'Ruth', 'I Samuel', 'II Samuel', 'I Kings', 'II Kings', 'I Chronicles',
    'II Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
    'Mark', 'Luke', 'John', 'Acts', 'Romans', 'I Corinthians', 'II Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', 'I Thessalonians',
    'II Thessalonians', 'I Timothy', 'II Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', 'I Peter', 'II Peter', 'I John', 'II John', 'III John', 'Jude',
    'Revelation of John',
]

BOOKS_KO = [
    '창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기',
    '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대상', '역대하', '에스라',
    '느헤미야', '에스더', '욥기', '시편', '잠언', '전도서', '아가', '이사야',
    '예레미야', '예레미야애가', '에스겔', '다니엘', '호세아', '요엘', '아모스',
    '오바댜', '요나', '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기',
    '마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서',
    '고린도전서', '고린도후서', '갈라디아서', '에베소서', '빌립보서', '골로새서',
    '데살로니가전서', '데살로니가후서', '디모데전서', '디모데후서', '디도서',
    '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한일서',
    '요한이서', '요한삼서', '유다서', '요한계시록',
]

BOOK_NAMES = {'en': dict(zip(BOOKS_EN, BOOKS_EN)), 'ko': dict(zip(BOOKS_EN, BOOKS_KO))}

REF_RE = re.compile(r'^(?P<book>(?:[IV]+\s)?[A-Za-z][A-Za-z ]*?)\s+(?P<ch>\d+)'
                    r'(?::(?P<v1>\d+)(?:-(?P<v2>\d+))?)?$')


def load_csv(name):
    path = os.path.join(CSV_DIR, name + '.csv')
    table = {}
    with open(path, encoding='utf-8') as f:
        for row in csv.DictReader(f):
            txt = (row['Text'] or '').strip()
            if txt:
                table[(row['Book'], int(row['Chapter']), int(row['Verse']))] = txt
    return table


def load_hindi():
    """godlytalias Bible-Database Hindi: nested Book/Chapter/Verse with 00BBCCVV ids."""
    if not os.path.exists(HINDI_JSON):
        return {}
    raw = json.load(open(HINDI_JSON, encoding='utf-8-sig'))
    books = raw['Book']
    table = {}
    for bi, book in enumerate(books):
        if bi >= len(BOOKS_EN):
            break
        name = BOOKS_EN[bi]
        for ci, chap in enumerate(book.get('Chapter', []), start=1):
            for vi, verse in enumerate(chap.get('Verse', []), start=1):
                t = (verse.get('Verse') or '').strip()
                if t:
                    table[(name, ci, vi)] = t
    return table


def parse_ref(ref):
    m = REF_RE.match(ref.strip())
    if not m:
        return None
    book = m.group('book').strip()
    if book not in BOOK_NAMES['en']:
        return None
    ch = int(m.group('ch'))
    v1 = int(m.group('v1')) if m.group('v1') else None
    v2 = int(m.group('v2')) if m.group('v2') else v1
    return book, ch, v1, v2


def alt_versification(book, ch, v):
    """Corpora that follow Hebrew versification number some passages differently.

    Numbers 16:36-50 (English) == Numbers 17:1-15 (Hebrew), and Hebrew Psalms
    count the superscription as verse 1.
    """
    alts = []
    if book == 'Numbers' and ch == 16 and v >= 36:
        alts.append((book, 17, v - 35))
    if book == 'Psalms':
        alts.append((book, ch, v + 1))
    return alts


def lookup(tables, locale, book, ch, v1, v2):
    primary, fallback, _, _ = SOURCES[locale] if locale in SOURCES else (None, None, None, None)
    for corpus in (primary, fallback):
        if not corpus:
            continue
        t = tables.get(corpus)
        if not t:
            continue
        parts = []
        for v in range(v1, v2 + 1):
            hit = t.get((book, ch, v))
            if hit is None:
                for ab, ac, av in alt_versification(book, ch, v):
                    hit = t.get((ab, ac, av))
                    if hit:
                        break
            if hit:
                parts.append(hit)
        if parts:
            return ' '.join(parts), corpus
    return None, None


def label(ref, locale):
    p = parse_ref(ref)
    if not p:
        return ref
    book, ch, v1, v2 = p
    name = BOOK_NAMES.get(locale, BOOK_NAMES['en']).get(book, book)
    if v1 is None:
        return f'{name} {ch}'
    if v2 != v1:
        return f'{name} {ch}:{v1}-{v2}'
    return f'{name} {ch}:{v1}'


def collect_refs(node, out):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == 'ref' and isinstance(v, str):
                out.add(v)
            elif k == 'read' and isinstance(v, list):
                for r in v:
                    out.add(r)
            elif k == 'refs' and isinstance(v, list):
                for r in v:
                    out.add(r)
            else:
                collect_refs(v, out)
    elif isinstance(node, list):
        for v in node:
            collect_refs(v, out)


def main():
    contents = {}
    for fn in sorted(os.listdir(os.path.join(BUILD, 'content'))):
        if fn.endswith('.json'):
            contents[fn] = json.load(open(os.path.join(BUILD, 'content', fn), encoding='utf-8'))

    refs = set()
    collect_refs(contents, refs)
    print(f'{len(refs)} unique references found')

    bad = sorted(r for r in refs if not parse_ref(r))
    if bad:
        print('\nUNPARSEABLE REFERENCES:')
        for r in bad:
            print('  ', r)
        sys.exit(1)

    needed = sorted(r for r in refs if parse_ref(r)[2] is not None)
    print(f'{len(needed)} of them cite specific verses and need text')

    corpora = set()
    for primary, fallback, _, _ in SOURCES.values():
        corpora.add(primary)
        if fallback:
            corpora.add(fallback)
    tables = {}
    for c in sorted(corpora):
        tables[c] = load_csv(c)
        print(f'  loaded {c}: {len(tables[c])} verses')
    hindi = load_hindi()
    if hindi:
        tables['Hindi'] = hindi
        SOURCES['hi'] = ('Hindi', None, 'पवित्र बाइबल (Hindi)', 'Public domain.')
        print(f'  loaded Hindi: {len(hindi)} verses')

    out_dir = os.path.join(BUILD, 'mobile-shell', 'data')
    os.makedirs(out_dir, exist_ok=True)

    missing = collections.defaultdict(list)
    for locale in SOURCES:
        verses = {}
        for ref in needed:
            book, ch, v1, v2 = parse_ref(ref)
            text, corpus = lookup(tables, locale, book, ch, v1, v2)
            if text is None:
                missing[locale].append(ref)
                continue
            verses[ref] = {'t': text, 'r': label(ref, locale)}
        # chapter-only references still need a display label
        labels = {r: label(r, locale) for r in refs}
        primary, fallback, name, lic = SOURCES[locale]
        payload = {
            'locale': locale,
            'translation': name,
            'license': lic,
            'verses': verses,
            'labels': labels,
        }
        dest = os.path.join(out_dir, f'scripture.{locale}.json')
        with open(dest, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, separators=(',', ':'))
        size = os.path.getsize(dest)
        print(f'  {locale}: {len(verses)}/{len(needed)} verses  ({size/1024:.1f} KB)  {name}')

    if missing:
        print('\nMISSING VERSES:')
        for loc, refs_ in missing.items():
            print(f'  {loc}: {len(refs_)} missing -> {refs_[:6]}{" ..." if len(refs_) > 6 else ""}')


if __name__ == '__main__':
    main()
