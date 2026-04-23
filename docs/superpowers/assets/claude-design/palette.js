// Command palette visual inside the "command palette" feature card
(function(){
  const host = document.getElementById('palette-viz');
  if (!host) return;

  host.innerHTML = `
    <div style="border-radius:10px; border:1px solid var(--line-strong); background:var(--bg); overflow:hidden; box-shadow:0 20px 40px -20px rgba(0,0,0,0.35);">
      <div style="display:flex; align-items:center; gap:10px; padding:12px 14px; border-bottom:1px solid var(--line); background:var(--bg-soft);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--ink-3);"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <div id="palette-query" style="font-family:var(--font-mono); font-size:13px; color:var(--ink);"></div>
        <span style="margin-left:auto; font-family:var(--font-mono); font-size:10px; color:var(--ink-4); border:1px solid var(--line); padding:1px 5px; border-radius:4px;">⌘;</span>
      </div>
      <div id="palette-results" style="padding:6px;"></div>
    </div>
  `;

  const queries = [
    { q: 'redis', results: [
      { t:'container', n:'test-redis-1', s:'running · :6379', ico:'box' },
      { t:'image', n:'redis:7.2-alpine', s:'41 MB · 3 tags', ico:'layers' },
      { t:'action', n:'pull redis:latest', s:'upgrade available', ico:'arrow' },
    ]},
    { q: 'logs web', results: [
      { t:'container', n:'test-web-1 / logs', s:'follow · regex', ico:'logs' },
      { t:'container', n:'exlo-web / logs', s:'1.2k lines · paused', ico:'logs' },
      { t:'pod', n:'web-7d4f8b / logs', s:'k8s · default ns', ico:'k8s' },
    ]},
    { q: 'compose', results: [
      { t:'project', n:'monorepo-dev', s:'4 services · up', ico:'compose' },
      { t:'project', n:'staging-stack', s:'7 services · partial', ico:'compose' },
      { t:'action', n:'compose up -d', s:'current project', ico:'play' },
    ]},
  ];

  const ico = {
    box: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5M3 18l9 5 9-5"/>',
    arrow: '<path d="M12 4v12M7 9l5-5 5 5"/>',
    logs: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    k8s: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/>',
    compose: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    play: '<path d="M6 4l14 8-14 8V4z"/>',
  };

  function render(query, results) {
    const q = document.getElementById('palette-query');
    q.innerHTML = query + '<span style="display:inline-block; width:6px; height:14px; background:var(--accent); vertical-align:middle; margin-left:2px; animation:blink 1s steps(1) infinite;"></span>';
    const host = document.getElementById('palette-results');
    host.innerHTML = results.map((r,i) => `
      <div style="display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:6px; ${i===0?'background:color-mix(in srgb, var(--accent) 12%, transparent);':''} font-size:12px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${i===0?'var(--accent)':'var(--ink-3)'}" stroke-width="2">${ico[r.ico]||''}</svg>
        <span style="font-family:var(--font-mono); color:${i===0?'var(--ink)':'var(--ink-2)'}; font-weight:500;">${r.n}</span>
        <span style="font-family:var(--font-mono); font-size:10.5px; color:var(--ink-4); margin-left:auto;">${r.t} · ${r.s}</span>
      </div>
    `).join('');
  }

  let qi = 0, ci = 0, typing = true;
  const current = () => queries[qi];
  function tick(){
    if (typing) {
      ci++;
      if (ci > current().q.length) { typing = false; setTimeout(tick, 1800); return; }
      render(current().q.slice(0, ci), current().results);
      setTimeout(tick, 110);
    } else {
      ci--;
      if (ci <= 0) {
        typing = true;
        qi = (qi+1) % queries.length;
        render('', []);
        setTimeout(tick, 400);
        return;
      }
      render(current().q.slice(0, ci), current().results);
      setTimeout(tick, 40);
    }
  }
  render('', []);
  setTimeout(tick, 800);
})();
