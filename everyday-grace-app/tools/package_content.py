#!/usr/bin/env python3
"""Split content/*.json into per-locale bundles so the app only downloads one language."""
import json, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.dirname(HERE)
CONTENT = os.path.join(BUILD, 'content')
DATA = os.path.join(BUILD, 'mobile-shell', 'data')
LOCALES = ['ko', 'en', 'zh', 'es', 'fr', 'ja', 'hi']
FULL = ['ko', 'en']          # locales with authored prose
FALLBACK = 'en'


def pick(node, loc):
    """Return the localized view of a content node, falling back to English."""
    if isinstance(node, dict):
        if any(k in node for k in LOCALES) and ('ko' in node or 'en' in node):
            chosen = node.get(loc) or node.get(FALLBACK) or node.get('ko')
            merged = {k: v for k, v in node.items() if k not in LOCALES}
            if isinstance(chosen, dict):
                merged.update(chosen)
            return {k: pick(v, loc) for k, v in merged.items()}
        return {k: pick(v, loc) for k, v in node.items() if not k.startswith('_')}
    if isinstance(node, list):
        return [pick(v, loc) for v in node]
    return node


def main():
    people = json.load(open(os.path.join(CONTENT, 'people.json'), encoding='utf-8'))
    daily = json.load(open(os.path.join(CONTENT, 'daily.json'), encoding='utf-8'))
    studies = json.load(open(os.path.join(CONTENT, 'studies.json'), encoding='utf-8'))
    os.makedirs(DATA, exist_ok=True)

    report = []
    for loc in LOCALES:
        bundles = {
            f'people.{loc}.json': {'people': pick(people['people'], loc),
                                   'translated': loc in FULL},
            f'daily.{loc}.json': {'days': pick(daily['days'], loc),
                                  'translated': loc in FULL},
            f'studies.{loc}.json': {'courses': pick(studies['courses'], loc),
                                    'translated': loc in FULL},
        }
        total = 0
        for name, payload in bundles.items():
            path = os.path.join(DATA, name)
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(payload, f, ensure_ascii=False, separators=(',', ':'))
            total += os.path.getsize(path)
        sc = os.path.join(DATA, f'scripture.{loc}.json')
        total += os.path.getsize(sc) if os.path.exists(sc) else 0
        report.append((loc, total, loc in FULL))

    print('per-locale payload (scripture + people + daily + studies):')
    for loc, total, full in sorted(report, key=lambda r: -r[1]):
        tag = 'authored' if full else f'prose falls back to {FALLBACK}'
        print(f'  {loc}: {total/1024:6.1f} KB   ({tag})')
    hym = os.path.join(DATA, 'hymns.json')
    if os.path.exists(hym):
        print(f'  shared hymns.json: {os.path.getsize(hym)/1024:.1f} KB')


if __name__ == '__main__':
    main()
