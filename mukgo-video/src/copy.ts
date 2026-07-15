export type Lang = "ko" | "en";

type SceneCopy = {
  drive: {
    eyebrow: string;
    h1: [string, string];
    fuel: string;
    hunger: string;
    kicker: string;
  };
  stop: {
    eyebrow: string;
    h1: string;
    items: [string, string][];
    stats: { value: string; caption: string }[];
    punchA: string;
    punchB: string;
  };
  demo: {
    h1: string;
    h1grad: string;
    subA: string;
    subB: string;
    navDir: string;
    route: string;
    aheadTitle: string;
    stations: string;
    sideR: string;
    sideL: string;
    topTitle: string;
    speak: string;
    picks: { name: string; meta: string }[];
  };
  pillars: {
    eyebrow: string;
    h1: string;
    items: { emoji: string; title: string; tag: string; desc: string }[];
    values: string[];
  };
  moat: {
    eyebrow: string;
    h1a: string;
    h1b: string;
    colOthers: string;
    colMukgo: string;
    rows: { feature: string; others: string; mukgo: string; highlight?: boolean }[];
    compound: string;
  };
  market: {
    eyebrow: string;
    h1: string;
    stats: { prefix?: string; target: number; suffix: string; caption: string }[];
    badges: string[];
  };
  modes: {
    eyebrow: string;
    h1a: string;
    h1b: string;
    sub: string;
    driveTitle: string;
    driveSub: string;
    meetupTitle: string;
    meetupSub: string;
    cta: string;
    cta2: string;
  };
};

export const COPY: Record<Lang, SceneCopy> = {
  ko: {
    drive: {
      eyebrow: "THE DRIVE",
      h1: ["여덟 시간째,", "핸들 앞."],
      fuel: "FUEL",
      hunger: "HUNGER",
      kicker: "다음 출구가, 반드시 되어야 한다.",
    },
    stop: {
      eyebrow: "THE STOP",
      h1: "겨우 들른 휴게소.",
      items: [
        ["🌭", "언제부터 돌던 건지 모를 핫도그"],
        ["🥪", "유리 안에서 말라가는 샌드위치"],
        ["🚻", "문을 여는 순간, 발길을 돌린다"],
      ],
      stats: [
        { value: "15%", caption: "주유소 화장실이 '괜찮다'는 응답" },
        { value: "80%", caption: "더러운 화장실 뒤 다시 오지 않는다" },
      ],
      punchA: "그런데 이 정보는 ",
      punchB: "어떤 지도에도 없었다.",
    },
    demo: {
      h1: "운전 중 한 눈에",
      h1grad: "찾는 맛집",
      subA: "진행 방향 앞 주유소만 필터링하고,",
      subB: "추천 맛집 5곳을 한눈에 보여줍니다.",
      navDir: "진행 방향 · 북동",
      route: "강남 → 성수",
      aheadTitle: "⛽ AHEAD · 진행 방향 앞",
      stations: "3 stations",
      sideR: "우측",
      sideL: "좌측",
      topTitle: "TOP 5 ON YOUR ROUTE",
      speak: '"1" ~ "5" 말하기',
      picks: [
        { name: "성수 감자탕", meta: "한식 · ★ 4.8" },
        { name: "라멘 부탄", meta: "일식 · ★ 4.6" },
        { name: "블루보틀", meta: "카페 · ★ 4.7" },
      ],
    },
    pillars: {
      eyebrow: "01 · THE PRODUCT",
      h1: "한 번의 정차, 세 가지를 한눈에",
      items: [
        {
          emoji: "🍔",
          title: "Food",
          tag: "DRIVE",
          desc: "경로 앞 5곳 추천 · 16개 국적 요리 · 평점/가격/거리, 원탭 길찾기",
        },
        {
          emoji: "⛽",
          title: "Gas",
          tag: "AHEAD",
          desc: "진행 방향 앞만 · 실시간 유가 · 없으면 반경 자동 확장",
        },
        {
          emoji: "🚻",
          title: "Clean Stops",
          tag: "RATINGS",
          desc: "운전자가 매기는 화장실·음식 청결도 — 들르기 전에 결정",
        },
      ],
      values: ["CLEAN", "SAFE", "FRESH", "TASTY"],
    },
    moat: {
      eyebrow: "02 · THE MOAT",
      h1a: "구글맵에도, 옐프에도 ",
      h1b: "없는 데이터",
      colOthers: "GOOGLE MAPS · YELP",
      colMukgo: "MUKGO",
      rows: [
        { feature: "진행 방향 기준", others: "전방위", mukgo: "전방만 (음식·주유)" },
        { feature: "실시간 유가", others: "제한적", mukgo: "전방 · 실시간" },
        {
          feature: "화장실·음식 청결도",
          others: "없음",
          mukgo: "운전자 평점 (독점)",
          highlight: true,
        },
        { feature: "다국어", others: "OS 의존", mukgo: "5개 언어 내장" },
      ],
      compound: "쓸수록 쌓이고, 쌓일수록 강해진다 — 시간이 만드는 해자",
    },
    market: {
      eyebrow: "03 · THE MARKET",
      h1: "자동차 — 마지막 남은 미개척 공간",
      stats: [
        { target: 240, suffix: "M", caption: "미국 운전면허 보유자" },
        { prefix: "$", target: 213, suffix: "B", caption: "미국 로드트립 관광 시장" },
        { target: 62, suffix: "%", caption: "화장실이 깨끗하면 더 쓴다 (Harris Poll)" },
      ],
      badges: [
        "Google Play 오픈 테스트 (US & KR)",
        "음식 + 주유 실데이터",
        "청결 평점 라이브 (독점)",
        "5개 언어 · 구독(RevenueCat)",
      ],
    },
    modes: {
      eyebrow: "04 · TWO MODES, ONE APP",
      h1a: "혼자든, ",
      h1b: "함께든",
      sub: "한 번의 탭으로 전환하세요",
      driveTitle: "운전 모드",
      driveSub: "혼자 · 경로 · 맛집",
      meetupTitle: "모임 모드",
      meetupSub: "함께 · 목적지 · ETA",
      cta: "운전 모드 시작",
      cta2: "LIVE PREVIEW · MEETUP →",
    },
  },
  en: {
    drive: {
      eyebrow: "THE DRIVE",
      h1: ["Eight hours", "behind the wheel."],
      fuel: "FUEL",
      hunger: "HUNGER",
      kicker: "The next exit has to work.",
    },
    stop: {
      eyebrow: "THE STOP",
      h1: "You finally pull in.",
      items: [
        ["🌭", "Hot dogs rolling since who-knows-when"],
        ["🥪", "Sandwiches drying out under glass"],
        ["🚻", "You open the restroom — and back right out"],
      ],
      stats: [
        { value: "15%", caption: "rate gas-station restrooms acceptable" },
        { value: "80%", caption: "won't return after a dirty restroom" },
      ],
      punchA: "And this exists on ",
      punchB: "no map. Nowhere.",
    },
    demo: {
      h1: "Great food,",
      h1grad: "while you drive",
      subA: "Filters only the gas stations ahead,",
      subB: "and surfaces 5 restaurant picks at a glance.",
      navDir: "HEADING · NE",
      route: "Gangnam → Seongsu",
      aheadTitle: "⛽ AHEAD · in your direction",
      stations: "3 stations",
      sideR: "R",
      sideL: "L",
      topTitle: "TOP 5 ON YOUR ROUTE",
      speak: 'say "1"–"5"',
      picks: [
        { name: "Seongsu Gamjatang", meta: "Korean · ★ 4.8" },
        { name: "Ramen Butan", meta: "Japanese · ★ 4.6" },
        { name: "Blue Bottle", meta: "Cafe · ★ 4.7" },
      ],
    },
    pillars: {
      eyebrow: "01 · THE PRODUCT",
      h1: "One stop. Three things. All ahead.",
      items: [
        {
          emoji: "🍔",
          title: "Food",
          tag: "DRIVE",
          desc: "5 picks ahead · 16 cuisines · rating, price, distance · one-tap maps",
        },
        {
          emoji: "⛽",
          title: "Gas",
          tag: "AHEAD",
          desc: "Ahead only · live fuel prices · radius auto-expands",
        },
        {
          emoji: "🚻",
          title: "Clean Stops",
          tag: "RATINGS",
          desc: "Driver-rated restroom & food hygiene — decide before you pull in",
        },
      ],
      values: ["CLEAN", "SAFE", "FRESH", "TASTY"],
    },
    moat: {
      eyebrow: "02 · THE MOAT",
      h1a: "Data that's on ",
      h1b: "no other map",
      colOthers: "GOOGLE MAPS · YELP",
      colMukgo: "MUKGO",
      rows: [
        { feature: "Direction-aware", others: "all directions", mukgo: "ahead only (food & gas)" },
        { feature: "Live fuel prices", others: "limited", mukgo: "ahead · live" },
        {
          feature: "Restroom / food hygiene",
          others: "none",
          mukgo: "driver ratings (exclusive)",
          highlight: true,
        },
        { feature: "Languages", others: "OS-dependent", mukgo: "5 built in" },
      ],
      compound: "More users → more data → more useful. A moat that time builds.",
    },
    market: {
      eyebrow: "03 · THE MARKET",
      h1: "The car — the last un-searched space",
      stats: [
        { target: 240, suffix: "M", caption: "US licensed drivers" },
        { prefix: "$", target: 213, suffix: "B", caption: "US road-trip tourism market" },
        { target: 62, suffix: "%", caption: "spend more where restrooms are clean (Harris Poll)" },
      ],
      badges: [
        "Google Play open testing (US & KR)",
        "Food + gas on real data",
        "Cleanliness ratings live (exclusive)",
        "5 languages · subscriptions (RevenueCat)",
      ],
    },
    modes: {
      eyebrow: "04 · TWO MODES, ONE APP",
      h1a: "Solo, ",
      h1b: "or together",
      sub: "Switch with a single tap",
      driveTitle: "Drive Mode",
      driveSub: "Solo · on-route · food",
      meetupTitle: "Meetup Mode",
      meetupSub: "Together · destination · ETA",
      cta: "Start driving mode",
      cta2: "LIVE PREVIEW · MEETUP →",
    },
  },
};
