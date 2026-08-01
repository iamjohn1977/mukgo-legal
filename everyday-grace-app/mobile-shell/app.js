(function () {
  "use strict";

  var SUPPORTED = {
    ko: { name: "한국어", short: "KO", tag: "ko-KR" },
    en: { name: "English", short: "EN", tag: "en-US" },
    ja: { name: "日本語", short: "JA", tag: "ja-JP" },
    zh: { name: "中文", short: "ZH", tag: "zh-CN" },
    hi: { name: "हिन्दी", short: "HI", tag: "hi-IN" },
    es: { name: "Español", short: "ES", tag: "es-ES" },
    fr: { name: "Français", short: "FR", tag: "fr-FR" }
  };

  var STORE = {
    locale: "grace-locale",
    dateFormat: "grace-date-format",
    notifyTime: "grace-notification-time",
    notifyMessage: "grace-notification-message",
    registration: "grace-registration",
    journal: "grace-journal-",
    channel: "grace-video-channel"
  };

  var DEFAULT_VIDEO_QUERY = "매일 새로운 은혜의 말씀";

  var state = {
    locale: null,
    ui: null,          // locales/<loc>.json
    scripture: null,   // data/scripture.<loc>.json
    daily: null,       // data/daily.<loc>.json
    people: null,      // lazy
    studies: null,     // lazy
    hymns: null,       // lazy (shared)
    today: null,
    view: "home"
  };

  // ---------------------------------------------------------------- helpers
  function el(id) { return document.getElementById(id); }
  function setText(id, value) { var n = el(id); if (n) n.textContent = value == null ? "" : value; }
  function get(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }
  function put(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function drop(key) { try { localStorage.removeItem(key); } catch (e) {} }

  var cache = {};
  function loadJSON(path) {
    if (cache[path]) return cache[path];
    cache[path] = fetch(path).then(function (r) {
      if (!r.ok) throw new Error(path + " -> " + r.status);
      return r.json();
    }).catch(function (err) {
      delete cache[path];
      throw err;
    });
    return cache[path];
  }

  function detectLocale() {
    var raw = (navigator.language || "ko").toLowerCase();
    if (raw.indexOf("zh") === 0) return "zh";
    var code = raw.slice(0, 2);
    return SUPPORTED[code] ? code : "ko";
  }

  function t(key, fallback) {
    return (state.ui && state.ui[key]) || fallback || key;
  }

  function verseFor(ref) {
    if (!state.scripture) return null;
    return state.scripture.verses[ref] || null;
  }

  function labelFor(ref) {
    if (state.scripture && state.scripture.labels && state.scripture.labels[ref]) {
      return state.scripture.labels[ref];
    }
    return ref;
  }

  function dayIndex(length) {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000) % length;
  }

  function formatDate() {
    var mode = get(STORE.dateFormat, "long");
    var tag = SUPPORTED[state.locale].tag;
    var now = new Date();
    try {
      if (mode === "numeric") return now.toLocaleDateString(tag, { year: "numeric", month: "2-digit", day: "2-digit" });
      if (mode === "iso") return now.toISOString().slice(0, 10);
      return now.toLocaleDateString(tag, { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    } catch (e) {
      return now.toISOString().slice(0, 10);
    }
  }

  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function showToast(message) {
    var toast = el("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 2400);
  }

  // ------------------------------------------------------------ hymn player
  // Look-ahead scheduler: notes are queued a short window in advance so the
  // audio clock (not setTimeout) controls timing, and every node is released
  // on 'ended' so nothing accumulates during long playback.
  var LOOKAHEAD_MS = 120;
  var SCHEDULE_WINDOW = 0.45;

  var player = {
    ctx: null, gain: null, hymn: null, playing: false,
    index: 0, nextTime: 0, timer: null, active: []
  };

  function ensureContext() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!player.ctx) {
      player.ctx = new Ctx();
      player.gain = player.ctx.createGain();
      player.gain.gain.value = 0.9;
      player.gain.connect(player.ctx.destination);
    }
    return player.ctx;
  }

  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function scheduleNote(midi, startAt, duration) {
    var ctx = player.ctx;
    var osc = ctx.createOscillator();
    var env = ctx.createGain();
    var peak = 0.11;
    osc.type = "triangle";
    osc.frequency.value = midiToFreq(midi);
    env.gain.setValueAtTime(0.0001, startAt);
    env.gain.exponentialRampToValueAtTime(peak, startAt + 0.035);
    env.gain.setValueAtTime(peak, startAt + Math.max(0.05, duration * 0.55));
    env.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.98);
    osc.connect(env).connect(player.gain);
    osc.start(startAt);
    osc.stop(startAt + duration);
    player.active.push(osc);
    osc.onended = function () {
      try { osc.disconnect(); env.disconnect(); } catch (e) {}
      var i = player.active.indexOf(osc);
      if (i >= 0) player.active.splice(i, 1);
    };
  }

  function pump() {
    if (!player.playing || !player.hymn) return;
    var ctx = player.ctx;
    var notes = player.hymn.notes;
    var spu = player.hymn.secondsPerUnit || 0.6;

    while (player.nextTime < ctx.currentTime + SCHEDULE_WINDOW) {
      if (player.index >= notes.length) {
        // finished one pass — let the tail ring out, then stop.
        var tail = player.nextTime - ctx.currentTime + 0.4;
        player.timer = setTimeout(stopHymn, Math.max(300, tail * 1000));
        return;
      }
      var note = notes[player.index++];
      var dur = note[1] * spu;
      scheduleNote(note[0], player.nextTime, Math.max(0.12, dur * 0.92));
      player.nextTime += dur;
    }
    player.timer = setTimeout(pump, LOOKAHEAD_MS);
  }

  function startHymn(hymn) {
    var ctx = ensureContext();
    if (!ctx) { showToast(t("audioUnsupported", "이 기기에서는 재생할 수 없습니다.")); return; }
    stopHymn(true);
    if (ctx.state === "suspended") ctx.resume();
    player.hymn = hymn;
    player.playing = true;
    player.index = 0;
    player.nextTime = ctx.currentTime + 0.12;
    el("hymnButton").classList.add("playing");
    setText("playIcon", "❚❚");
    setText("playStatus", t("nowPlaying", "재생 중") + " · " + hymn.title);
    pump();
  }

  function stopHymn(silent) {
    player.playing = false;
    clearTimeout(player.timer);
    player.timer = null;
    player.active.slice().forEach(function (osc) { try { osc.stop(); } catch (e) {} });
    player.active.length = 0;
    var card = el("hymnButton");
    if (card) card.classList.remove("playing");
    setText("playIcon", "▶");
    if (!silent) setText("playStatus", "");
    // Release the audio session so the OS does not keep it warm.
    if (player.ctx && player.ctx.state === "running") {
      setTimeout(function () {
        if (!player.playing && player.ctx && player.ctx.state === "running") player.ctx.suspend();
      }, 600);
    }
  }

  function hymnById(id) {
    if (!state.hymns) return null;
    for (var i = 0; i < state.hymns.hymns.length; i++) {
      if (state.hymns.hymns[i].id === id) return state.hymns.hymns[i];
    }
    return null;
  }

  function hymnTitle(h) {
    if (!h) return "";
    return h.title[state.locale] || h.title.en || h.title.ko;
  }

  function toggleHymn() {
    if (player.playing) { stopHymn(); return; }
    var id = state.today && state.today.hymn;
    if (!id) return;
    loadJSON("./data/hymns.json").then(function (data) {
      state.hymns = data;
      var h = hymnById(id);
      if (!h) { showToast(t("audioUnsupported", "찬송을 찾을 수 없습니다.")); return; }
      startHymn({ notes: h.notes, secondsPerUnit: h.secondsPerUnit, title: hymnTitle(h) });
    }).catch(function () { showToast(t("loadError", "불러오지 못했습니다.")); });
  }

  // ---------------------------------------------------------------- YouTube
  function videoQuery() {
    return get(STORE.channel, "") || t("videoQuery", DEFAULT_VIDEO_QUERY);
  }

  function openExternal(url) {
    // Capacitor routes off-origin http(s) URLs to the system browser / YouTube app.
    var w = window.open(url, "_blank");
    if (!w) {
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  function openVideo() {
    var q = videoQuery().trim();
    var url = /^https?:\/\//i.test(q)
      ? q
      : "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
    openExternal(url);
  }

  // ------------------------------------------------------------------ views
  function showView(name) {
    state.view = name;
    ["home", "people", "study"].forEach(function (v) {
      var node = el("view-" + v);
      if (node) node.hidden = v !== name;
    });
    document.querySelectorAll(".bottom-nav [data-view]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "people") renderPeople();
    if (name === "study") renderCourses();
  }

  function openSheet(id) { el(id).hidden = false; }
  function closeSheet(id) { el(id).hidden = true; }

  function scriptureBlock(ref) {
    var v = verseFor(ref);
    if (!v) return '<div class="scripture"><p class="s-ref">' + escapeHTML(labelFor(ref)) + "</p></div>";
    return '<div class="scripture"><p class="s-text">' + escapeHTML(v.t) +
           '</p><p class="s-ref">' + escapeHTML(v.r) + "</p></div>";
  }

  function fallbackNote(bundle) {
    if (!bundle || bundle.translated) return "";
    return '<p class="fallback-note">' + escapeHTML(t("fallbackNote",
      "이 섹션의 해설은 아직 이 언어로 번역되지 않아 영어로 표시됩니다. 성경 본문은 선택한 언어로 표시됩니다.")) + "</p>";
  }

  // -------------------------------------------------------------- people UI
  function renderPeople() {
    var list = el("personList");
    if (list.dataset.locale === state.locale) return;
    list.innerHTML = '<p class="commentary">' + escapeHTML(t("loading", "불러오는 중…")) + "</p>";
    loadJSON("./data/people." + state.locale + ".json").then(function (data) {
      state.people = data;
      list.dataset.locale = state.locale;
      list.innerHTML = fallbackNote(data) + data.people.map(function (p, i) {
        return '<button class="person-card" type="button" data-person="' + i + '">' +
               '<span class="p-epithet">' + escapeHTML(p.epithet) + "</span>" +
               '<span class="p-name">' + escapeHTML(p.name) + "</span>" +
               '<span class="p-hook">' + escapeHTML(p.hook) + "</span></button>";
      }).join("");
    }).catch(function () {
      list.innerHTML = '<p class="commentary">' + escapeHTML(t("loadError", "불러오지 못했습니다.")) + "</p>";
    });
  }

  function openPerson(i) {
    var p = state.people && state.people.people[i];
    if (!p) return;
    setText("detailTitle", p.name);
    var html = '<p class="pull">' + escapeHTML(p.hook) + "</p>";

    html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionRaw", "성경이 기록한 그대로")) + "</h3>";
    p.raw.forEach(function (item) {
      html += scriptureBlock(item.ref);
      html += '<p class="commentary">' + escapeHTML(item.say) + "</p>";
    });
    html += "</div>";

    if (p.turn) {
      html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionTurn", "전환점")) + "</h3>";
      html += scriptureBlock(p.turn.ref);
      html += '<p class="commentary">' + escapeHTML(p.turn.say) + "</p></div>";
    }
    if (p.grace) {
      html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionGrace", "은혜")) + "</h3>" +
              '<p class="commentary">' + escapeHTML(p.grace) + "</p></div>";
    }
    if (p.mirror) {
      html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionMirror", "우리와 다르지 않습니다")) + "</h3>" +
              '<p class="pull">' + escapeHTML(p.mirror) + "</p></div>";
    }
    if (p.ask && p.ask.length) {
      html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionAsk", "묵상 질문")) + "</h3><ul class=\"ask-list\">" +
              p.ask.map(function (q) { return "<li>" + escapeHTML(q) + "</li>"; }).join("") + "</ul></div>";
    }
    if (p.read && p.read.length) {
      html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionRead", "이어서 읽기")) + "</h3><div class=\"read-chips\">" +
              p.read.map(function (r) { return "<span>" + escapeHTML(labelFor(r)) + "</span>"; }).join("") + "</div></div>";
    }
    el("detailContent").innerHTML = html;
    el("detailContent").scrollTop = 0;
    openSheet("detailSheet");
  }

  // --------------------------------------------------------------- study UI
  function renderCourses() {
    var list = el("courseList");
    if (list.dataset.locale === state.locale) return;
    list.innerHTML = '<p class="commentary">' + escapeHTML(t("loading", "불러오는 중…")) + "</p>";
    loadJSON("./data/studies." + state.locale + ".json").then(function (data) {
      state.studies = data;
      list.dataset.locale = state.locale;
      list.innerHTML = fallbackNote(data) + data.courses.map(function (c, i) {
        return '<button class="course-card" type="button" data-course="' + i + '">' +
               '<span class="c-title">' + escapeHTML(c.title) + "</span>" +
               '<span class="c-blurb">' + escapeHTML(c.blurb) + "</span>" +
               '<span class="c-count">' + c.lessons.length + " " + escapeHTML(t("lessonsWord", "과")) + "</span></button>";
      }).join("");
    }).catch(function () {
      list.innerHTML = '<p class="commentary">' + escapeHTML(t("loadError", "불러오지 못했습니다.")) + "</p>";
    });
  }

  function openLesson(courseIndex, lessonIndex) {
    var course = state.studies && state.studies.courses[courseIndex];
    if (!course) return;
    var n = course.lessons.length;
    var i = Math.max(0, Math.min(n - 1, lessonIndex));
    var lesson = course.lessons[i];
    setText("detailTitle", course.title);

    var html = '<p class="c-count" style="color:var(--ink-faint);font-size:11px;margin:0 0 8px">' +
               (i + 1) + " / " + n + "</p>";
    html += '<h3 style="margin:0 0 12px;font-size:18px">' + escapeHTML(lesson.title) + "</h3>";
    html += scriptureBlock(lesson.ref);
    html += '<p class="commentary">' + escapeHTML(lesson.teach) + "</p>";
    if (lesson.ask && lesson.ask.length) {
      html += '<div class="detail-section"><h3>' + escapeHTML(t("sectionAsk", "묵상 질문")) + "</h3><ul class=\"ask-list\">" +
              lesson.ask.map(function (q) { return "<li>" + escapeHTML(q) + "</li>"; }).join("") + "</ul></div>";
    }
    html += '<div class="lesson-nav">';
    html += '<button class="outline-button" type="button" data-lesson="' + courseIndex + ":" + (i - 1) + '"' +
            (i === 0 ? " disabled" : "") + ">← " + escapeHTML(t("prev", "이전")) + "</button>";
    html += '<button class="outline-button" type="button" data-lesson="' + courseIndex + ":" + (i + 1) + '"' +
            (i === n - 1 ? " disabled" : "") + ">" + escapeHTML(t("next", "다음")) + " →</button>";
    html += "</div>";

    el("detailContent").innerHTML = html;
    el("detailContent").scrollTop = 0;
    openSheet("detailSheet");
  }

  // ------------------------------------------------------------- feature UI
  function openFeature(name) {
    if (name === "people") { showView("people"); return; }
    if (name === "study") { showView("study"); return; }
    if (name === "share") { shareVerse(); return; }
    if (name === "hymns") { openHymnList(); return; }
    if (name === "word") { openWord(); return; }
    if (name === "reflection") { openReflection(); return; }
  }

  function openWord() {
    setText("detailTitle", t("qWord", "매일의 말씀"));
    var d = state.today;
    var html = scriptureBlock(d.ref) +
               '<p class="commentary">' + escapeHTML(d.note) + "</p>" +
               '<p class="attribution">' + escapeHTML(state.scripture.translation + " · " + state.scripture.license) + "</p>";
    el("detailContent").innerHTML = html;
    openSheet("detailSheet");
  }

  function openReflection() {
    setText("detailTitle", t("qReflection", "묵상과 기도"));
    var key = STORE.journal + new Date().toDateString();
    var saved = get(key, "");
    var html = '<p class="pull">' + escapeHTML(state.today.prayer) + "</p>" +
               '<label class="field"><span>' + escapeHTML(t("journalPrompt", "오늘의 은혜를 한 줄로 기록해 보세요.")) + "</span>" +
               '<textarea id="journalInput"></textarea></label>' +
               '<button class="primary-button" id="saveJournal" type="button">' + escapeHTML(t("save", "저장")) + "</button>";
    el("detailContent").innerHTML = html;
    el("journalInput").value = saved;
    el("saveJournal").addEventListener("click", function () {
      put(key, el("journalInput").value);
      showToast(t("saved", "저장했습니다."));
    });
    openSheet("detailSheet");
  }

  function openHymnList() {
    setText("detailTitle", t("qHymns", "찬송가"));
    el("detailContent").innerHTML = '<p class="commentary">' + escapeHTML(t("loading", "불러오는 중…")) + "</p>";
    openSheet("detailSheet");
    loadJSON("./data/hymns.json").then(function (data) {
      state.hymns = data;
      var html = '<p class="fallback-note">' + escapeHTML(data.license) + "</p>";
      html += data.hymns.map(function (h) {
        return '<button class="course-card" type="button" data-hymn="' + escapeHTML(h.id) + '">' +
               '<span class="c-title">' + escapeHTML(hymnTitle(h)) + "</span>" +
               '<span class="c-blurb">' + escapeHTML(h.title.en) + "</span>" +
               '<span class="c-count">' + escapeHTML(h.credits[h.credits.length - 1] || "Public domain") + "</span></button>";
      }).join("");
      el("detailContent").innerHTML = html;
    }).catch(function () {
      el("detailContent").innerHTML = '<p class="commentary">' + escapeHTML(t("loadError", "불러오지 못했습니다.")) + "</p>";
    });
  }

  // -------------------------------------------------------------- settings
  function openSettings() {
    var time = get(STORE.notifyTime, "08:00");
    var message = get(STORE.notifyMessage, t("notifyDefault", "오늘도 새로운 은혜가 시작됩니다."));
    var mode = get(STORE.dateFormat, "long");
    var channel = get(STORE.channel, "");

    var html = "";
    html += '<div class="setting-block"><h3>' + escapeHTML(t("settingsNotify", "매일 알림")) + "</h3>";
    html += '<label class="field"><span>' + escapeHTML(t("notifyTime", "알림 시간")) + '</span><input type="time" id="notifyTime" value="' + escapeHTML(time) + '"></label>';
    html += '<label class="field"><span>' + escapeHTML(t("notifyMessage", "알림 문구")) + '</span><input id="notifyMessage" value="' + escapeHTML(message) + '"></label>';
    html += '<button class="primary-button" id="enableNotify" type="button">' + escapeHTML(t("enableNotify", "매일 알림 켜기")) + "</button></div>";

    html += '<div class="setting-block"><h3>' + escapeHTML(t("settingsVideo", "영상 말씀")) + "</h3>";
    html += '<label class="field"><span>' + escapeHTML(t("videoChannelLabel", "유튜브 채널 주소 또는 검색어")) + '</span>' +
            '<input id="videoChannel" placeholder="' + escapeHTML(DEFAULT_VIDEO_QUERY) + '" value="' + escapeHTML(channel) + '"></label>';
    html += '<button class="outline-button" id="saveChannel" type="button">' + escapeHTML(t("save", "저장")) + "</button></div>";

    html += '<div class="setting-block"><h3>' + escapeHTML(t("settingsDate", "날짜 형식")) + "</h3>";
    html += '<label class="field"><select id="dateFormat">' +
            '<option value="long"' + (mode === "long" ? " selected" : "") + ">" + escapeHTML(t("dateLong", "긴 형식")) + "</option>" +
            '<option value="numeric"' + (mode === "numeric" ? " selected" : "") + ">" + escapeHTML(t("dateNumeric", "숫자 형식")) + "</option>" +
            '<option value="iso"' + (mode === "iso" ? " selected" : "") + ">" + escapeHTML(t("dateIso", "연-월-일")) + "</option>" +
            "</select></label>";
    html += '<button class="outline-button" id="saveDateFormat" type="button">' + escapeHTML(t("save", "저장")) + "</button></div>";

    html += '<div class="setting-block"><h3>' + escapeHTML(t("settingsSources", "본문 출처")) + "</h3>" +
            '<p class="attribution">' + escapeHTML(state.scripture.translation) + "<br>" +
            escapeHTML(state.scripture.license) + "</p></div>";

    el("settingsContent").innerHTML = html;

    el("enableNotify").addEventListener("click", scheduleDailyNotification);
    el("saveChannel").addEventListener("click", function () {
      put(STORE.channel, el("videoChannel").value.trim());
      showToast(t("saved", "저장했습니다."));
    });
    el("saveDateFormat").addEventListener("click", function () {
      put(STORE.dateFormat, el("dateFormat").value);
      setText("date", formatDate());
      showToast(t("saved", "저장했습니다."));
    });
    openSheet("settingsSheet");
  }

  function scheduleDailyNotification() {
    var time = el("notifyTime").value || "08:00";
    var message = el("notifyMessage").value || t("notifyDefault", "오늘도 새로운 은혜가 시작됩니다.");
    put(STORE.notifyTime, time);
    put(STORE.notifyMessage, message);

    var plugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
    if (!plugin) { showToast(t("saved", "저장했습니다.")); return; }

    var parts = time.split(":");
    plugin.requestPermissions().then(function (permission) {
      if (permission.display !== "granted") { showToast(t("notifyDenied", "알림 권한이 필요합니다.")); return null; }
      return plugin.cancel({ notifications: [{ id: 1001 }] }).then(function () {
        return plugin.schedule({
          notifications: [{
            id: 1001,
            title: t("appName", "매일 새로운 은혜"),
            body: message,
            schedule: { on: { hour: Number(parts[0]), minute: Number(parts[1]) }, repeats: true, allowWhileIdle: true }
          }]
        });
      }).then(function () { showToast(t("notifyOn", "매일 알림을 예약했습니다.")); });
    }).catch(function () { showToast(t("notifyDenied", "알림 권한이 필요합니다.")); });
  }

  // ------------------------------------------------------------------ share
  function shareText() {
    var v = verseFor(state.today.ref);
    if (!v) return t("appName", "매일 새로운 은혜");
    return v.t + "\n" + v.r + "\n" + t("appName", "매일 새로운 은혜");
  }

  function shareVerse() {
    var text = shareText();
    if (navigator.share) {
      navigator.share({ title: t("appName", "매일 새로운 은혜"), text: text }).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { showToast(t("copied", "말씀을 복사했습니다.")); });
      return;
    }
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); showToast(t("copied", "말씀을 복사했습니다.")); } catch (e) {}
    area.remove();
  }

  // ----------------------------------------------------------- account UI
  function readAccount() {
    var raw = get(STORE.registration, null);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function updateAccountUi() {
    var account = readAccount();
    setText("accountLabel", account ? (account.name || account.email || t("signedIn", "로그인됨")) : t("signIn", "로그인"));
    setText("signOut", t("signOut", "로그아웃"));
    el("signOut").hidden = !account;
    el("accountState").hidden = !account;
    el("accountButton").classList.toggle("signed-in", !!account);
    if (account) setText("accountState", t("signedIn", "로그인됨") + " · " + (account.name || account.email));
  }

  // ----------------------------------------------------------------- render
  function renderLanguages() {
    var list = el("languageList");
    list.innerHTML = "";
    Object.keys(SUPPORTED).forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "language-option" + (code === state.locale ? " active" : "");
      b.dataset.lang = code;
      var name = document.createElement("span");
      name.textContent = SUPPORTED[code].name;
      var short = document.createElement("strong");
      short.textContent = SUPPORTED[code].short;
      b.appendChild(name);
      b.appendChild(short);
      list.appendChild(b);
    });
  }

  var UI_KEYS = ["appName", "newDay", "prayerTitle", "hymnLabel", "faithEyebrow", "faithTitle",
    "faithBody", "closing", "footNote", "languageTitle", "settingsTitle", "registerTitle",
    "registerIntro", "nameLabel", "emailLabel", "privacyNote", "peopleTitle", "peopleIntro",
    "studyTitle", "studyIntro", "videoEyebrow", "videoTitle", "videoSub",
    "qWord", "qPeople", "qStudy", "qReflection", "qHymns", "qShare",
    "navHome", "navPeople", "navStudy", "navPrayer"];

  function render() {
    var d = state.today;
    document.documentElement.lang = state.locale;
    document.title = t("appName", "매일 새로운 은혜");

    UI_KEYS.forEach(function (k) { if (state.ui[k]) setText(k, state.ui[k]); });
    setText("languageShort", SUPPORTED[state.locale].short);
    setText("date", formatDate());
    setText("saveRegistration", t("saveRegistration", "이 기기에서 로그인"));

    var v = verseFor(d.ref);
    setText("verse", v ? v.t : "");
    setText("reference", v ? v.r : labelFor(d.ref));
    setText("note", d.note);
    setText("prayer", d.prayer);
    setText("verseAttribution", state.scripture.translation + " · " + state.scripture.license);

    loadJSON("./data/hymns.json").then(function (data) {
      state.hymns = data;
      var h = hymnById(d.hymn);
      if (h) {
        setText("hymn", hymnTitle(h));
        setText("hymnSub", h.title.en + " · " + t("publicDomain", "퍼블릭 도메인"));
      }
    }).catch(function () {});

    renderLanguages();
    updateAccountUi();
  }

  function loadLocale(code) {
    stopHymn(true);
    var next = SUPPORTED[code] ? code : "ko";
    return Promise.all([
      loadJSON("./locales/" + next + ".json"),
      loadJSON("./data/scripture." + next + ".json"),
      loadJSON("./data/daily." + next + ".json")
    ]).then(function (res) {
      state.locale = next;
      state.ui = res[0];
      state.scripture = res[1];
      state.daily = res[2];
      state.today = state.daily.days[dayIndex(state.daily.days.length)];
      put(STORE.locale, next);
      el("personList").dataset.locale = "";
      el("courseList").dataset.locale = "";
      render();
      if (state.view !== "home") showView(state.view);
    }).catch(function (err) {
      if (next !== "ko") return loadLocale("ko");
      showToast("데이터를 불러오지 못했습니다.");
      throw err;
    });
  }

  // ------------------------------------------------------------------ wiring
  document.addEventListener("click", function (event) {
    var target = event.target;

    var lang = target.closest("[data-lang]");
    if (lang) { closeSheet("languageSheet"); loadLocale(lang.getAttribute("data-lang")); return; }

    var person = target.closest("[data-person]");
    if (person) { openPerson(Number(person.getAttribute("data-person"))); return; }

    var course = target.closest("[data-course]");
    if (course) { openLesson(Number(course.getAttribute("data-course")), 0); return; }

    var lessonBtn = target.closest("[data-lesson]");
    if (lessonBtn && !lessonBtn.disabled) {
      var parts = lessonBtn.getAttribute("data-lesson").split(":");
      openLesson(Number(parts[0]), Number(parts[1]));
      return;
    }

    var hymnBtn = target.closest("[data-hymn]");
    if (hymnBtn) {
      var h = hymnById(hymnBtn.getAttribute("data-hymn"));
      if (h) startHymn({ notes: h.notes, secondsPerUnit: h.secondsPerUnit, title: hymnTitle(h) });
      return;
    }

    var view = target.closest("[data-view]");
    if (view) { showView(view.getAttribute("data-view")); return; }

    var feature = target.closest("[data-feature]");
    if (feature) { event.preventDefault(); openFeature(feature.getAttribute("data-feature")); return; }

    var closer = target.closest("[data-close]");
    if (closer) { closeSheet(closer.getAttribute("data-close")); return; }

    if (target.classList && target.classList.contains("sheet-backdrop")) closeSheet(target.id);
  });

  el("hymnButton").addEventListener("click", toggleHymn);
  el("videoCard").addEventListener("click", openVideo);
  el("settingsButton").addEventListener("click", openSettings);
  el("languageButton").addEventListener("click", function () { openSheet("languageSheet"); });
  el("accountButton").addEventListener("click", function () { openSheet("registrationSheet"); });

  el("saveRegistration").addEventListener("click", function () {
    var data = {
      name: el("displayName").value.trim(),
      email: el("email").value.trim(),
      provider: "device",
      savedAt: new Date().toISOString()
    };
    if (!data.name && !data.email) { showToast(t("registerRequired", "이름 또는 이메일을 입력해 주세요.")); return; }
    put(STORE.registration, JSON.stringify(data));
    updateAccountUi();
    closeSheet("registrationSheet");
    showToast(t("registerSaved", "등록 정보를 이 기기에 저장했습니다."));
  });

  el("signOut").addEventListener("click", function () {
    drop(STORE.registration);
    el("displayName").value = "";
    el("email").value = "";
    updateAccountUi();
    closeSheet("registrationSheet");
    showToast(t("signedOut", "로그아웃했습니다."));
  });

  // Stop audio when the app goes to the background so it cannot drain battery.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && player.playing) stopHymn();
  });

  // Inspection hook for the playback regression test: the live oscillator count
  // must stay bounded no matter how long a hymn plays.
  window.__graceDebug = { activeNotes: function () { return player.active.length; } };

  var saved = readAccount();
  if (saved) {
    el("displayName").value = saved.name || "";
    el("email").value = saved.email || "";
  }

  loadLocale(get(STORE.locale, null) || detectLocale());
})();
