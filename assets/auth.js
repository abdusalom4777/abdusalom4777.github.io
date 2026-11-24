// ===== uzmould — общий вход и настройки =====
// Подключается в <head> каждой закрытой страницы:
//   <script src="/assets/auth.js" data-role="admin"></script>   — только админ
//   <script src="/assets/auth.js" data-role="any"></script>     — любой вошедший
// Сессия: sessionStorage 'tpa_session' {username, role}.
// URL Apps Script: ОДИН ключ 'tpa_gs_url' (старые dash_gs_url / kpi_gs_url — запасные).
(function () {
  var script = document.currentScript;
  var need = (script && script.getAttribute('data-role')) || 'any';

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem('tpa_session')); } catch (e) { return null; }
  }

  var s = getSession();
  var ok = s && s.role && (need === 'any' || s.role === need);
  if (!ok) {
    // Не пускаем: прячем страницу и уходим на вход, запомнив куда шли
    document.documentElement.style.display = 'none';
    var next = s ? '' : '?next=' + encodeURIComponent(location.pathname + location.search);
    location.replace(s && s.role === 'operator' ? '/tpa/index.html' : '/' + next);
    return;
  }

  function lsGet(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Логотип uzmould справа в шапке каждой страницы
  function addLogo() {
    if (document.querySelector('.uz-logo')) return;
    if (window.innerWidth < 760) return; // на телефоне шапка узкая — без логотипа
    var head = document.querySelector('header, .topbar, .header');
    var hs = head && getComputedStyle(head);
    var inBar = head && hs.display.indexOf('flex') >= 0 && head.getBoundingClientRect().top < 40;
    var a = document.createElement('a');
    a.className = 'uz-logo';
    a.href = s.role === 'admin' ? '/home.html' : '/tpa/index.html';
    a.title = 'uzmould';
    a.style.cssText = 'display:inline-flex;align-items:center;flex-shrink:0;margin-left:12px;text-decoration:none;line-height:0';
    var bg = ((inBar ? hs : getComputedStyle(document.body)).backgroundColor.match(/[\d.]+/g)) || [0, 0, 0, 0];
    var light = (bg.length > 3 && +bg[3] === 0) || (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) > 140;
    if (!inBar) a.style.cssText += ';position:fixed;top:14px;right:16px;z-index:50;margin:0';
    if (light) a.style.cssText += ';background:#111113;padding:5px 9px;border-radius:8px';
    var img = document.createElement('img');
    img.src = '/assets/logo.png';
    img.alt = 'UZMOULD';
    img.style.cssText = 'height:' + (light ? 16 : 22) + 'px;width:auto;display:block';
    a.appendChild(img);
    (inBar ? head : document.body).appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLogo);
  else addLogo();

  window.TPA = {
    session: s,
    isAdmin: s.role === 'admin',
    logout: function () {
      sessionStorage.removeItem('tpa_session');
      location.href = '/';
    },
    gsUrl: function () {
      return lsGet('tpa_gs_url') || lsGet('dash_gs_url') || lsGet('kpi_gs_url');
    },
    setGsUrl: function (url) {
      url = String(url || '').trim();
      if (url) lsSet('tpa_gs_url', url);
    }
  };
})();
