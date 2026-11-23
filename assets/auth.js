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
