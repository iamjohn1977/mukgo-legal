# 콘텐츠 출처 및 저작권 (Content sources and licensing)

이 앱에 들어가는 **모든 성경 본문과 찬송가 선율은 외부의 검증된 퍼블릭 도메인 데이터셋에서 기계적으로 추출**했습니다.
사람이 기억으로 옮겨 적은 성경 구절은 한 절도 없습니다 (`tools/build_scripture.py`가 빌드할 때마다 참조를 원본 코퍼스에서 조회합니다).

---

## 1. 성경 본문

| 언어 | 사용 판본 | 저작권 상태 | 근거 |
|---|---|---|---|
| 한국어 | **성경전서 개역한글판** | ⚠️ 조건부 무료 — 아래 참고 | 대한성서공회 저작권 FAQ |
| English | **American Standard Version (1901)** | 퍼블릭 도메인 | 1901년 발행, 미국 저작권 만료 |
| 中文 | **和合본 Chinese Union Version (1919)** | 퍼블릭 도메인 | 1919년 발행 |
| Español | **Reina-Valera (1909)** | 퍼블릭 도메인 | 1909년 발행 |
| Français | **Bible Darby (1885)** | 퍼블릭 도메인 | 1885년 발행 |
| 日本語 | **電網聖書 / 文語訳聖書** | 퍼블릭 도메인 | 文語訳 1917, 電網 = PD 배포 |
| हिन्दी | **पवित्र बाइबल (Hindi)** | 퍼블릭 도메인으로 배포됨 | 아래 주의사항 참고 |

### ⚠️ 한국어 판본에 대한 중요한 사항

원래 요청은 "저작권 염려할 필요 없는 버전"이었습니다. 조사 결과는 이렇습니다.

**대한성서공회의 자체 저작권 FAQ**는 다음과 같이 밝히고 있습니다:

> 『성경전서 개역한글판』의 저작재산권 보호기간은 50년이 경과되어 **저작권료 지급없이 사용 가능**합니다.
> 다만, '동일성유지권'과 '성명표시권'의 **인격저작권을 준수**하셔서 사용하셔야 합니다.

즉 **저작권료 없이 사용할 수 있으나, 두 가지 의무가 따릅니다:**

1. **동일성유지권** — 본문을 임의로 수정·윤문·요약하면 안 됩니다.
   → 이 빌드는 원문을 그대로 출력하며 어떤 가공도 하지 않습니다. ✅
2. **성명표시권** — 출처를 표시해야 합니다.
   → 앱 홈 화면 하단과 설정 > 본문 출처에 `성경전서 개역한글판 © 대한성서공회`를 항상 노출합니다. ✅

**다만 상충하는 정보가 있습니다.** 일부 자료는 1952년 『개역』 초판만 만료되었고 1961년 『개역한글판』 보완판은
아직 공회가 권리를 보유한다고 봅니다. 또한 2013년 저작권법 개정으로 보호기간이 70년으로 연장된 점도 있습니다.

> **권장:** 스토어 출시 전에 대한성서공회(02-2103-8747, [bskorea.or.kr](https://www.bskorea.or.kr/bbs/content.php?co_id=subpage2_3_4_1))에
> 서면으로 사용 확인을 받으십시오. 공회는 비영리·앱 사용에 대해 실제로 허가를 잘 내주며, 확인서 한 장이면 이 회색지대가 사라집니다.
>
> 만약 확인이 어렵다면, `tools/build_scripture.py`의 `SOURCES['ko']`를 다른 코퍼스로 한 줄만 바꾸면 전체 한국어 본문이 교체됩니다.

**절대 사용하지 않은 것:** 개역개정, 새번역, 우리말성경, 현대인의 성경, 쉬운성경, 한글킹제임스 —
모두 명확히 저작권이 살아있고 유료 라이선스가 필요합니다.

### 힌디어 판본 주의

`godlytalias/Bible-Database`가 배포하는 힌디어 성경입니다. 저장소는 자유 배포를 표방하지만
개별 판본의 저작권 만료를 명시적으로 문서화하고 있지는 않습니다. 힌디어를 주력 시장으로 삼는다면
판본 출처를 한 번 더 확인하시기 바랍니다.

### 성경 본문 데이터 출처

- [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases) — MIT 라이선스 (ASV, ChiUn, SpaRV, FreJND, JapDenmo, JapBungo, KorRV)
- [godlytalias/Bible-Database](https://github.com/godlytalias/Bible-Database) — 힌디어

---

## 2. 찬송가 선율 (33곡)

전부 **[Open Hymnal Project](http://openhymnal.org/)** 의 ABC 악보에서 추출했습니다.
GitHub 미러: [mzealey/openhymnal](https://github.com/mzealey/openhymnal)

Open Hymnal의 수록 기준 1번은 다음과 같습니다:

> *"It must be in the public domain or freely distributable"*

수록된 곡은 모두 **가사·곡조 모두 퍼블릭 도메인**이며, 각 악보 파일에 `copyright: public domain`이 명시되어 있습니다.
`hymns.json`의 각 항목에 원 작사·작곡자와 연도가 `credits`로 보존되어 있습니다.

예: Amazing Grace — Words: John Newton, 1779 / Music: 'New Britain' James P. Carrell & David L. Clayton, 1831 / Setting: Edwin Othello Excell, 1900.

### 의도적으로 제외한 곡

한국 교회에서 자주 부르지만 **저작권이 살아있어 넣지 않은** 곡들입니다:

- *How Great Thou Art* (주 하나님 지으신 모든 세계) — Stuart Hine 1949 영역본, Capitol CMG 관리
- *Great Is Thy Faithfulness* (오 신실하신 주) — Chisholm/Runyan 1923, 1951 갱신, Hope Publishing
- 현대 CCM 및 새찬송가에 새로 편입된 창작곡 전반

### ⚠️ 새찬송가 장(章) 번호에 대해

`hymns.json`에는 **한국어 제목만 있고 새찬송가 장 번호는 넣지 않았습니다.**
장 번호를 잘못 넣으면 예배에서 실제로 혼선을 일으키기 때문에, 확인 없이 추측해 넣지 않았습니다.
필요하시면 각 항목에 `hymnalNo` 필드를 추가하시면 됩니다.

또한 **한국어 찬송가 가사 자체는 넣지 않았습니다.** 새찬송가/통일찬송가의 한국어 번역 가사는
한국찬송가공회가 저작권을 보유합니다. 이 앱은 **곡조(선율)만** 재생하고 제목만 표시합니다.

---

## 3. 앱이 직접 쓴 콘텐츠

다음은 전부 이 빌드에서 새로 작성한 창작물이며, 저작권은 앱 소유자에게 있습니다:

- 성경 인물 20명의 해설·묵상 질문 (`content/people.json`)
- 31일 묵상 노트와 기도문 (`content/daily.json`)
- 성경공부 5개 과정 31개 과 (`content/studies.json`)
- 7개 언어 UI 문자열 (`tools/build_locales.py`)

한국어·영어는 직접 작성했고, 나머지 5개 언어의 **해설 산문은 영어로 폴백**합니다
(성경 본문과 UI는 7개 언어 모두 완전 번역). 앱 안에 이 사실이 안내 문구로 표시됩니다.

---

## 4. 재현 방법

```bash
# 원본 데이터셋 확보
git clone --depth 1 https://github.com/scrollmapper/bible_databases.git
git clone --depth 1 https://github.com/godlytalias/Bible-Database.git
git clone --depth 1 https://github.com/mzealey/openhymnal.git

python3 build_hymns.py            # ABC 악보 -> hymns.json
python3 tools/build_scripture.py  # 참조 -> scripture.<locale>.json  (7개 언어)
python3 tools/build_locales.py    # UI 문자열
python3 tools/package_content.py  # 언어별 번들 분리
node    tools/smoke.js            # 브라우저 엔드투엔드 검증
```

`build_scripture.py`는 참조가 **하나라도** 해결되지 않으면 이를 보고합니다.
현재 상태: **169개 참조 × 7개 언어 = 전부 해결됨.**
