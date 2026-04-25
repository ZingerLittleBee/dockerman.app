// Theme toggle + Tweaks panel wiring
(function(){
  const root = document.documentElement;

  // theme toggle
  const tt = document.getElementById('theme-toggle');
  function setTheme(t) {
    root.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem('dm-theme', t); } catch(e){}
    // sync tweak UI
    document.querySelectorAll('#tweaks .tw-opts[data-key="theme"] .tw-opt').forEach(o => {
      o.classList.toggle('active', o.dataset.value === t);
    });
  }
  tt && tt.addEventListener('click', () => {
    setTheme(root.classList.contains('dark') ? 'light' : 'dark');
  });

  // accent map
  const ACCENTS = {
    teal:   { a: '#14b8a6', b: '#6366f1', w: '#f97316' },
    indigo: { a: '#6366f1', b: '#8b5cf6', w: '#f97316' },
    amber:  { a: '#f59e0b', b: '#ef4444', w: '#ec4899' },
    rose:   { a: '#f43f5e', b: '#8b5cf6', w: '#f59e0b' },
  };
  function applyAccent(name){
    const p = ACCENTS[name] || ACCENTS.teal;
    root.style.setProperty('--accent', p.a);
    root.style.setProperty('--accent-2', p.b);
    root.style.setProperty('--accent-warm', p.w);
    root.style.setProperty('--chip', 'color-mix(in srgb, ' + p.a + ' 14%, transparent)');
  }

  function applyStyle(s){
    document.body.classList.remove('v-industrial','v-editorial');
    if (s === 'industrial') document.body.classList.add('v-industrial');
    else if (s === 'editorial') document.body.classList.add('v-editorial');
  }
  function applyGrid(g){
    const el = document.querySelector('.grid-bg');
    if (el) el.style.display = g === 'off' ? 'none' : '';
  }

  // initial tweak values
  const state = Object.assign({}, window.TWEAK_DEFAULTS || { style:'default', accent:'teal', theme:'dark', grid:'on' });

  function apply(){
    setTheme(state.theme);
    applyAccent(state.accent);
    applyStyle(state.style);
    applyGrid(state.grid);
    // reflect in tweak UI
    document.querySelectorAll('#tweaks .tw-opts').forEach(group => {
      const key = group.dataset.key;
      group.querySelectorAll('.tw-opt').forEach(o => {
        o.classList.toggle('active', o.dataset.value === state[key]);
      });
    });
  }
  apply();

  // wire tweaks UI
  document.querySelectorAll('#tweaks .tw-opts').forEach(group => {
    const key = group.dataset.key;
    group.querySelectorAll('.tw-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        state[key] = opt.dataset.value;
        apply();
        // persist
        try {
          window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: state[key] } }, '*');
        } catch(e){}
      });
    });
  });

  // edit mode protocol
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') {
      document.getElementById('tweaks').classList.add('visible');
    } else if (e.data.type === '__deactivate_edit_mode') {
      document.getElementById('tweaks').classList.remove('visible');
    }
  });
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch(e){}

  // copy install
  window.copyInstall = function(el){
    try { navigator.clipboard.writeText('brew install --cask dockerman'); } catch(e){}
    const original = el.innerHTML;
    el.innerHTML = '<span style="color:var(--accent);">✓ copied</span>';
    setTimeout(() => { el.innerHTML = original; }, 1200);
  };
})();
