#!/usr/bin/env python3
"""Extract the melody (top voice) from Open Hymnal ABC files as MIDI note arrays.

Open Hymnal scores are public domain. Output is [[midiNote, durationInUnits], ...]
where a unit is the L: default note length.
"""
import re, json, sys, os, glob

STEP = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']
# major key -> number of sharps (+) or flats (-)
KEYSIG = {
    'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6, 'C#': 7,
    'F': -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7,
}
MODE_SHIFT = {  # relative-to-major offset in fifths
    'maj': 0, 'ion': 0, 'min': -3, 'aeo': -3, 'm': -3,
    'mix': -1, 'dor': -2, 'phr': -4, 'lyd': 1, 'loc': -5,
}


def key_accidentals(kstr):
    """Return {letter: semitone offset} implied by an ABC K: field."""
    kstr = (kstr or 'C').strip()
    m = re.match(r'^([A-G])([#b]?)\s*([A-Za-z]*)', kstr)
    if not m:
        return {}
    tonic, acc, mode = m.group(1), m.group(2), m.group(3).lower()[:3]
    base = tonic + ('#' if acc == '#' else 'b' if acc == 'b' else '')
    fifths = KEYSIG.get(base)
    if fifths is None:
        return {}
    fifths += MODE_SHIFT.get(mode, 0) if mode else 0
    out = {}
    if fifths > 0:
        for i in range(min(fifths, 7)):
            out[SHARP_ORDER[i]] = 1
    elif fifths < 0:
        for i in range(min(-fifths, 7)):
            out[FLAT_ORDER[i]] = -1
    return out


def strip_noise(body):
    """Remove things that must not be parsed as notes."""
    body = re.sub(r'%.*', '', body)              # comments
    body = re.sub(r'\{[^}]*\}', '', body)         # grace notes
    body = re.sub(r'"[^"]*"', '', body)           # chord symbols / annotations
    body = re.sub(r'![^!]*!', '', body)           # decorations !fermata!
    body = re.sub(r'\+[^+]*\+', '', body)         # legacy decorations
    body = re.sub(r'\[[A-Za-z]:[^\]]*\]', '', body)  # inline fields [Q:...]
    return body


NOTE_RE = re.compile(r"""
    (?P<acc>\^{1,2}|_{1,2}|=)?          # accidental
    (?P<letter>[A-Ga-gz])               # pitch or rest
    (?P<oct>[,']*)                      # octave marks
    (?P<num>\d*)                        # multiplier
    (?P<slash>/*)                       # halving slashes
    (?P<den>\d*)                        # denominator
""", re.X)


def parse_voice(body, keyacc):
    """Parse one voice's ABC body into [(midi_or_None, duration_units)]."""
    body = strip_noise(body)
    out = []
    bar_acc = {}
    i = 0
    pending_tie = False
    broken = 0  # >0 means previous note dotted, this one shortened
    while i < len(body):
        ch = body[i]
        if ch == '|' or ch == ':':
            bar_acc = {}
            i += 1
            continue
        if ch in '()\n\r\t ':
            i += 1
            continue
        if ch == '-':
            pending_tie = True
            i += 1
            continue
        if ch == '>':
            broken = 1
            i += 1
            continue
        if ch == '<':
            broken = -1
            i += 1
            continue
        if ch == '[':          # chord: take the top (last) note
            j = body.find(']', i)
            if j < 0:
                break
            inner = body[i + 1:j]
            notes = [m for m in NOTE_RE.finditer(inner) if m.group('letter')]
            if notes:
                m = notes[-1]
                pitch, dur = _resolve(m, keyacc, bar_acc)
                out.append([pitch, dur])
            i = j + 1
            continue
        m = NOTE_RE.match(body, i)
        if m and m.group('letter'):
            pitch, dur = _resolve(m, keyacc, bar_acc)
            if broken and out:
                if broken > 0:
                    out[-1][1] *= 1.5
                    dur *= 0.5
                else:
                    out[-1][1] *= 0.5
                    dur *= 1.5
                broken = 0
            if pending_tie and out and out[-1][0] == pitch and pitch is not None:
                out[-1][1] += dur
            else:
                out.append([pitch, dur])
            pending_tie = False
            i = m.end()
            continue
        i += 1
    return out


def _resolve(m, keyacc, bar_acc):
    letter = m.group('letter')
    if letter == 'z':
        return None, _dur(m)
    upper = letter.upper()
    octave = 4 if letter.isupper() else 5
    for c in m.group('oct'):
        octave += 1 if c == "'" else -1
    acc = m.group('acc')
    if acc:
        val = {'^': 1, '^^': 2, '_': -1, '__': -2, '=': 0}[acc]
        bar_acc[upper] = val
        offset = val
    elif upper in bar_acc:
        offset = bar_acc[upper]
    else:
        offset = keyacc.get(upper, 0)
    midi = (octave + 1) * 12 + STEP[upper] + offset
    return midi, _dur(m)


def _dur(m):
    num = int(m.group('num')) if m.group('num') else 1
    slashes = m.group('slash')
    den = int(m.group('den')) if m.group('den') else (2 ** len(slashes) if slashes else 1)
    return num / den


def extract(path):
    text = open(path, encoding='utf-8', errors='replace').read()
    lines = text.split('\n')
    header = {}
    for ln in lines:
        m = re.match(r'^([A-Za-z]):\s*(.*)', ln)
        if m and m.group(1) in 'XTCSMLKQ':
            k, v = m.group(1), re.sub(r'%.*', '', m.group(2)).strip()
            header.setdefault(k, []).append(v)

    keyacc = key_accidentals(header.get('K', ['C'])[0])
    meter = header.get('M', ['4/4'])[0]
    lstr = header.get('L', ['1/8'])[0]
    lm = re.match(r'(\d+)/(\d+)', lstr)
    unit = (int(lm.group(1)) / int(lm.group(2))) if lm else 0.125

    # tempo, e.g. "1/4=100"
    tempo = 100
    qsrc = ' '.join(header.get('Q', [])) + ' ' + text
    qm = re.search(r'Q:\s*(?:\d+/\d+=)?(\d+)', qsrc) or re.search(r'\[Q:\s*\d+/\d+=(\d+)\]', text)
    if qm:
        tempo = int(qm.group(1))

    # Collect the melody voice: prefer the first declared voice id.
    voice_ids = []
    for ln in lines:
        m = re.match(r'^V:\s*(\S+)', ln)
        if m and m.group(1) not in voice_ids:
            voice_ids.append(m.group(1))
    melody_id = voice_ids[0] if voice_ids else None

    chunks = []
    for ln in lines:
        if ln.startswith('w:') or ln.startswith('W:'):
            continue
        m = re.match(r'^\[V:\s*(\S+?)\s*\]\s*(.*)', ln)
        if m:
            if melody_id is None or m.group(1) == melody_id:
                chunks.append(m.group(2))
        elif re.match(r'^[A-Za-z]:', ln):
            continue
        elif melody_id is None:
            chunks.append(ln)

    notes = parse_voice(' '.join(chunks), keyacc)
    notes = [n for n in notes if n[1] > 0]
    return {
        'title': header.get('T', ['?'])[0],
        'credits': header.get('C', []),
        'source': header.get('S', []),
        'meter': meter,
        'unitNoteLength': unit,
        'tempoBPM': tempo,
        'key': header.get('K', ['C'])[0].split('%')[0].strip(),
        'notes': [[n[0], round(n[1], 4)] for n in notes],
    }


if __name__ == '__main__':
    for p in sys.argv[1:]:
        d = extract(p)
        print(json.dumps(d, ensure_ascii=False)[:1200])
