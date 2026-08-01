# 매일 새로운 은혜 — 재빌드 (com.newgrace.everyday)

업로드된 1.0 APK를 분석한 뒤 새로 만든 웹 셸과 릴리스 빌드 설정입니다.

> **주의:** 이 폴더는 `mukgo-legal` 저장소에 **임시로** 보관된 것입니다.
> `mukgo-legal`은 MukGo의 법적 고지 페이지 저장소이고, 이 앱(`com.newgrace.everyday`)과는 무관합니다.
> 앱 전용 저장소가 만들어지면 이 디렉터리를 통째로 옮기십시오.

## 무엇이 바뀌었나

### 원래 요청한 4가지

| # | 요청 | 결과 |
|---|---|---|
| 1 | 저작권 없는 구 찬송가 미디로 교체 | **33곡** — Open Hymnal Project ABC 악보에서 실제 선율 추출. 추측한 음표 없음 |
| 2 | 저작권 걱정 없는 성경 판본으로 교체 | **7개 언어** 퍼블릭 도메인 판본. 169개 참조 전부 원본 코퍼스에서 조회 |
| 3 | 날짜 형식 박스 → 유튜브 영상 말씀 | 홈에 영상 카드 추가, 날짜 형식은 설정으로 이동. 채널/검색어 사용자 지정 가능 |
| 4 | 성경공부 + 인물공부 (날것 그대로) | **인물 20명** + **성경공부 5과정 31과**. 모든 주장에 성경 참조 첨부 |

### 효율성 (이전 리뷰 반영)

| 항목 | 이전 | 지금 |
|---|---|---|
| `app-icon.png` | 1.43 MB (WebView가 읽지도 않는 favicon) | 삭제 |
| 오디오 노드 | 8.3초마다 32개씩 무한 증가 | 상시 1–3개, 정지 시 0 (테스트로 검증) |
| AudioContext | 정지 후에도 계속 열림 | 정지 0.6초 뒤 `suspend()`, 백그라운드 진입 시 자동 정지 |
| 다국어 데이터 | 7개 언어 전부를 app.js에 하드코딩 | 선택한 언어만 fetch |
| 성경공부/인물 | 없음 | 열 때만 lazy load |
| `debuggable` | `true` (Play 업로드 거부) | 릴리스에서 false |
| R8 | 꺼짐 (5,304 클래스) | `minifyEnabled true` + Capacitor 리플렉션 keep 룰 |
| `allowBackup` | true, 규칙 없음 (이름·이메일 클라우드 백업) | false + 추출 규칙 명시 |
| emoji2 | 매 콜드스타트 자동 초기화 | 매니페스트에서 제거 |
| Cordova 호환 레이어 | 102개 클래스, 0바이트 JS | `settings.gradle`에서 제외 |

## 구조

```
mobile-shell/            ← Capacitor webDir (이 폴더가 앱 안으로 들어감)
  index.html  app.js  styles.css
  locales/<7개 언어>.json        UI 문자열
  data/
    hymns.json                   33곡 선율 (공용, 60 KB)
    scripture.<locale>.json      성경 본문 (언어별)
    daily.<locale>.json          31일 묵상
    people.<locale>.json         인물 20명
    studies.<locale>.json        성경공부 5과정
android/app/
  build.gradle                   릴리스 서명·R8·AAB 분할
  proguard-rules.pro             Capacitor 리플렉션 보존 룰
  src/main/AndroidManifest.xml   백업 차단, emoji2 제거, localeConfig
content/                 ← 원본 콘텐츠 (참조만, 본문 텍스트 없음)
tools/                   ← 빌드 + 검증 스크립트
CONTENT-LICENSES.md      ← ★ 배포 전 반드시 읽으십시오
```

## 콘텐츠 설계에서 가장 중요한 점

`content/*.json`에는 **성경 본문이 한 글자도 들어있지 않습니다.** 참조(`"II Samuel 11:2-4"`)만 있습니다.
`tools/build_scripture.py`가 빌드할 때마다 검증된 퍼블릭 도메인 코퍼스에서 실제 본문을 조회해 넣습니다.

덕분에:
- 성경 구절이 기억이나 추측으로 들어갈 수 없습니다
- 판본을 바꾸려면 설정 한 줄만 고치면 7개 언어 전체가 교체됩니다
- 참조 오타는 빌드가 즉시 잡아냅니다

## 빌드

```bash
# 1) 콘텐츠 (원본 데이터셋 clone은 CONTENT-LICENSES.md 참고)
python3 build_hymns.py
python3 tools/build_scripture.py
python3 tools/build_locales.py
python3 tools/package_content.py

# 2) 검증 — Chromium으로 앱을 실제 구동
node tools/smoke.js

# 3) Capacitor + 릴리스 AAB
npx cap sync android
cd android && ./gradlew bundleRelease \
  -PversionCode=2 -PversionName=1.1.0
```

릴리스 서명은 환경변수로 주입합니다: `KEYSTORE_PATH`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.
**키스토어와 비밀번호는 저장소에 커밋하지 마십시오.**

## 검증 상태

`node tools/smoke.js` — Chromium에서 앱을 실제로 띄우고 조작합니다. 전부 통과:

- 홈 렌더링, 한국어 성경 본문·장절 표기·출처 표시
- 영상 카드가 YouTube URL을 여는지 / 날짜 형식 타일이 제거됐는지
- 인물 20명 목록 → 다윗 상세에 성경 본문 3개 이상 + 묵상 질문
- 성경공부 5과정 → 과 이동
- **찬송 재생 중 오디오 노드가 6초 넘게 1–3개로 유지, 정지 시 0** (누수 회귀 테스트)
- 날짜 형식 설정이 실제로 적용
- 언어 전환 시 본문·출처가 함께 바뀜 (한→영→일)
- 페이지 에러 0, 리소스 404 0

## 남은 일

1. **대한성서공회 사용 확인** — `CONTENT-LICENSES.md` 참고. 출시 전 처리 권장
2. **런처 아이콘 재생성** — 기존 mipmap은 그대로 두었습니다
3. **베이스라인 프로파일 생성** — `profileinstaller`는 들어있지만 프로파일이 없어 현재는 효과 없음
4. **ja/zh/hi/es/fr 해설 번역** — 현재 영어 폴백 (앱에 안내 표시됨)
5. **앱 전용 저장소로 이동**
