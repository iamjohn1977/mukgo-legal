#!/usr/bin/env python3
"""Build data/hymns.json from Open Hymnal ABC sources (all public domain)."""
import json, os, glob, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from abc2melody import extract

PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES_DIR = os.environ.get('GRACE_SOURCES', os.path.join(PROJECT, '.sources'))
ROOT = os.path.join(SOURCES_DIR, 'openhymnal', 'Complete')

# folder -> (id, Korean traditional title, English title, theme tag)
CURATED = [
    ('Amazing_Grace',                        'amazing-grace',    '나 같은 죄인 살리신',        'Amazing Grace',                     'grace'),
    ('What_A_Friend_We_Have_In_Jesus',       'what-a-friend',    '죄 짐 맡은 우리 구주',        'What a Friend We Have in Jesus',    'prayer'),
    ('Nearer_My_God_To_Thee',                'nearer-my-god',    '내 주를 가까이 하게 함은',     'Nearer, My God, to Thee',           'comfort'),
    ('Holy_Holy_Holy',                       'holy-holy-holy',   '거룩 거룩 거룩',             'Holy, Holy, Holy',                  'worship'),
    ('Rock_of_Ages',                         'rock-of-ages',     '만세 반석 열리니',            'Rock of Ages',                      'refuge'),
    ('It_Is_Well_With_My_Soul',              'it-is-well',       '내 평생에 가는 길',           'It Is Well with My Soul',           'peace'),
    ('Abide_With_Me',                        'abide-with-me',    '때 저물어서 날이 어두니',      'Abide with Me',                     'evening'),
    ('Blessed_Assurance',                    'blessed-assurance','예수로 나의 구주 삼고',        'Blessed Assurance',                 'assurance'),
    ('Come_Thou_Fount',                      'come-thou-fount',  '복의 근원 강림하사',          'Come, Thou Fount of Every Blessing','grace'),
    ('A_Mighty_Fortress_Is_Our_God',         'mighty-fortress',  '내 주는 강한 성이요',         'A Mighty Fortress Is Our God',      'strength'),
    ('The_Old_Rugged_Cross',                 'old-rugged-cross', '갈보리산 위에',              'The Old Rugged Cross',              'cross'),
    ('My_Hope_Is_Built',                     'my-hope-is-built', '이 몸의 소망 무엇인가',       'My Hope Is Built on Nothing Less',  'hope'),
    ('Praise_God_From_Whom_All_Blessings_Flow','doxology',       '만복의 근원 하나님',          'Doxology (Old Hundredth)',          'worship'),
    ('Jesus_Loves_Me',                       'jesus-loves-me',   '예수 사랑하심은',            'Jesus Loves Me',                    'love'),
    ('When_I_Survey_The_Wondrous_Cross',     'when-i-survey',    '주 달려 죽은 십자가',         'When I Survey the Wondrous Cross',  'cross'),
    ('O_Sacred_Head_Now_Wounded',            'o-sacred-head',    '오 거룩하신 주님',           'O Sacred Head, Now Wounded',        'cross'),
    ('Silent_Night',                         'silent-night',     '고요한 밤 거룩한 밤',         'Silent Night',                      'nativity'),
    ('Joy_To_The_World',                     'joy-to-the-world', '기쁘다 구주 오셨네',          'Joy to the World',                  'nativity'),
    ('Pass_Me_Not_O_Gentle_Savior',          'pass-me-not',      '인애하신 구세주여',           'Pass Me Not, O Gentle Savior',      'mercy'),
    ('Take_My_Life_And_Let_It_Be',           'take-my-life',     '내 생명 드리니',             'Take My Life and Let It Be',        'consecration'),
    ('Joyful_Joyful_We_Adore_Thee',          'joyful-joyful',    '기뻐하며 경배하세',           'Joyful, Joyful, We Adore Thee',     'joy'),
    ('To_God_Be_the_Glory',                  'to-god-be-glory',  '큰 영광 중에 계신 주',        'To God Be the Glory',               'worship'),
    ('Now_Thank_We_All_Our_God',             'now-thank-we-all', '다 감사드리세',              'Now Thank We All Our God',          'thanks'),
    ('Christ_Arose',                         'christ-arose',     '저 무덤에 머물러',           'Christ Arose (Low in the Grave)',   'resurrection'),
    ('Be_Thou_My_Vision',                    'be-thou-my-vision','내 맘의 주여 소망되소서',      'Be Thou My Vision',                 'devotion'),
    ('O_Come_All_Ye_Faithful',               'o-come-faithful',  '참 반가운 신도여',           'O Come, All Ye Faithful',           'nativity'),
    ('The_Lords_My_Shepherd',                'lords-my-shepherd','여호와는 나의 목자',          "The Lord's My Shepherd",            'shepherd'),
    ('Guide_Me_O_Thou_Great_Jehovah',        'guide-me',         '인도하소서 위대하신 여호와여',  'Guide Me, O Thou Great Jehovah',    'guidance'),
    ('He_Leadeth_Me',                        'he-leadeth-me',    '주 인도하시니',              'He Leadeth Me',                     'guidance'),
    ('Whiter_Than_Snow',                     'whiter-than-snow', '눈보다 더 희게',             'Whiter Than Snow',                  'cleansing'),
    ('Out_Of_The_Deep_I_Cry_To_Thee',        'out-of-the-deep',  '깊은 데서 주께 부르짖나이다',   'Out of the Deep I Cry to Thee',     'lament'),
    ('Today_Thy_Mercy_Calls_Me',             'today-thy-mercy',  '오늘도 주의 자비가 부르시네',   'Today Thy Mercy Calls Me',          'mercy'),
    ('I_Need_Thee_Every_Hour',               'i-need-thee',      '매 시간 주가 필요합니다',      'I Need Thee Every Hour',            'dependence'),
]


def trim(notes, max_units):
    """Keep the opening phrase(s) up to roughly max_units of musical time."""
    out, total = [], 0.0
    for n in notes:
        out.append(n)
        total += n[1]
        if total >= max_units:
            break
    return out


def main():
    hymns, problems = [], []
    for folder, hid, ko, en, theme in CURATED:
        paths = sorted(glob.glob(os.path.join(ROOT, folder, '*.abc')))
        if not paths:
            problems.append((hid, 'no abc file'))
            continue
        d = extract(paths[0])
        notes = [n for n in d['notes'] if n[0] is not None]
        if len(notes) < 8:
            problems.append((hid, f'too few notes: {len(notes)}'))
            continue
        pitches = [n[0] for n in notes]
        if min(pitches) < 48 or max(pitches) > 88:
            problems.append((hid, f'pitch out of vocal range: {min(pitches)}-{max(pitches)}'))
            continue
        # seconds per unit: tempo is in quarter notes per minute
        spu = (60.0 / d['tempoBPM']) * (d['unitNoteLength'] / 0.25)
        hymns.append({
            'id': hid,
            'title': {'ko': ko, 'en': en},
            'theme': theme,
            'key': d['key'],
            'meter': d['meter'],
            'secondsPerUnit': round(spu, 4),
            'source': 'Open Hymnal Project (public domain)',
            'credits': [c for c in d['credits'] if c],
            'notes': trim(notes, 48),
            'fullLength': len(notes),
        })
    out = {
        'license': 'Melodies transcribed from the Open Hymnal Project (openhymnal.org), '
                   'which distributes only public-domain or freely distributable scores. '
                   'Tunes and texts listed here are public domain.',
        'hymns': hymns,
    }
    dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mobile-shell', 'data', 'hymns.json')
    with open(dest, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'wrote {len(hymns)} hymns -> {dest}')
    NAMES = {0:'C',1:'C#',2:'D',3:'D#',4:'E',5:'F',6:'F#',7:'G',8:'G#',9:'A',10:'A#',11:'B'}
    for h in hymns:
        head = ' '.join(f"{NAMES[n%12]}{n//12-1}" for n, _ in h['notes'][:10])
        print(f"  {h['id']:<20} {h['key']:<6} {h['meter']:<5} n={len(h['notes']):<3} {head}")
    if problems:
        print('\nPROBLEMS:')
        for p in problems:
            print('  ', p)


if __name__ == '__main__':
    main()
