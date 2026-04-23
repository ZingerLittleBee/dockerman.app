// Live animated dashboard preview, injected into #live-dash
(function(){
  const host = document.getElementById('live-dash');
  if (!host) return;

  host.innerHTML = `
    <div class="app-frame" id="dm-frame">
      <div class="app-titlebar">
        <div class="traffic"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      </div>
      <div class="app-body">
        <aside class="app-sidebar">
          <div class="sidebar-header">
            <div class="host-avatar">L</div>
            <div class="sidebar-host">
              <span class="name">Localhost</span>
              <span class="sub">docker · 28.5.2</span>
            </div>
          </div>

          <div class="side-item active">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Container
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Image
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"/></svg>
            Build
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h6M15 12h6M12 3v6M12 15v6"/></svg>
            Network
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
            Volume
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            Events
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 18h4"/></svg>
            Templates
          </div>

          <div class="side-label">Actions</div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>
            Terminal
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>
            Process
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            Inspect
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 20V10M9 20V4M15 20v-8M21 20V14"/></svg>
            Stats
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
            Logs
          </div>
          <div class="side-item">
            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            File
          </div>

          <div class="side-label">Containers · 5</div>
          <div class="side-item" style="font-family:var(--font-mono);font-size:11.5px;">
            <span class="cl-dot running"></span> test-web-1
          </div>
          <div class="side-item" style="font-family:var(--font-mono);font-size:11.5px;">
            <span class="cl-dot running"></span> test-redis-1
          </div>
          <div class="side-item" style="font-family:var(--font-mono);font-size:11.5px;">
            <span class="cl-dot running"></span> exlo-web
          </div>
          <div class="side-item" style="font-family:var(--font-mono);font-size:11.5px;">
            <span class="cl-dot paused"></span> worker-batch
          </div>
          <div class="side-item" style="font-family:var(--font-mono);font-size:11.5px;">
            <span class="cl-dot stopped"></span> legacy-api
          </div>
        </aside>

        <main class="app-main">
          <div class="main-header">
            <div class="main-title">Dashboard</div>
            <div class="main-chips">
              <div class="main-chip">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                auto-refresh · 2s
              </div>
              <div class="main-chip"><span class="cl-dot running" style="width:6px;height:6px;"></span> connected</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <div class="label">Containers <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/></svg></div>
              <div class="value" id="kpi-containers">5</div>
              <div class="sub">6 of total containers</div>
            </div>
            <div class="kpi">
              <div class="label">Images <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>
              <div class="value">7</div>
              <div class="sub">Total images</div>
            </div>
            <div class="kpi">
              <div class="label">Total Image Size <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
              <div class="value">687.26<span class="u" style="font-size:13px;color:var(--ink-3);"> MB</span></div>
              <div class="sub">Total storage used by images</div>
            </div>
            <div class="kpi">
              <div class="label">Images In Use <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h12"/></svg></div>
              <div class="value">5</div>
              <div class="sub">Images used by containers</div>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <div class="label">Docker Version <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="1"/><rect x="6" y="6" width="5" height="5"/><rect x="13" y="6" width="5" height="5"/></svg></div>
              <div class="value" style="font-size:22px;">28.5.2</div>
              <div class="sub">API: linux/aarch64</div>
            </div>
            <div class="kpi">
              <div class="label">Storage Driver <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/></svg></div>
              <div class="value" style="font-size:22px;">overlay2</div>
              <div class="sub">Cgroup: cgroupfs</div>
            </div>
            <div class="kpi">
              <div class="label">System Resources <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg></div>
              <div class="value">10<span class="u" style="font-size:13px;color:var(--ink-3);"> CPUs</span></div>
              <div class="sub">Memory: 7.81 GB</div>
            </div>
            <div class="kpi">
              <div class="label">Operating System <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
              <div class="value" style="font-size:22px;">OrbStack</div>
              <div class="sub">Kernel: 6.17.8-orbstack</div>
            </div>
          </div>

          <div class="chart-grid">
            <div class="chart-card">
              <div class="c-head">
                <div>
                  <div class="c-title">CPU Usage</div>
                  <div class="c-value" id="cpu-val">0.3<span class="u">%</span></div>
                </div>
                <span class="viz-badge" style="font-size:10px;">1m</span>
              </div>
              <div class="chart-area">
                <svg viewBox="0 0 300 90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g-cpu" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stop-color="#6366f1" stop-opacity="0.2"/>
                      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <path id="cpu-area" fill="url(#g-cpu)"/>
                  <path id="cpu-line" fill="none" stroke="#6366f1" stroke-width="1.5"/>
                </svg>
              </div>
            </div>
            <div class="chart-card">
              <div class="c-head">
                <div>
                  <div class="c-title">Memory Usage</div>
                  <div class="c-value" id="mem-val">126<span class="u"> MB</span></div>
                </div>
                <span class="viz-badge" style="font-size:10px;">1m</span>
              </div>
              <div class="chart-area">
                <svg viewBox="0 0 300 90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g-mem" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stop-color="#10b981" stop-opacity="0.55"/>
                      <stop offset="1" stop-color="#10b981" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <path id="mem-area" fill="url(#g-mem)"/>
                  <path id="mem-line" fill="none" stroke="#10b981" stroke-width="1.5"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="io-row">
            <div class="chart-card" style="padding:10px 13px;">
              <div class="c-head">
                <div class="c-title" style="font-size:11px;">Network I/O</div>
                <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--ink-3);">↓ <span id="net-down">8.83 KB</span> · ↑ <span id="net-up">630 B</span></span>
              </div>
              <div class="chart-area" style="height:40px;">
                <svg viewBox="0 0 300 40" preserveAspectRatio="none">
                  <path id="net-line" fill="none" stroke="#a855f7" stroke-width="1.2" opacity="0.85"/>
                </svg>
              </div>
            </div>
            <div class="chart-card" style="padding:10px 13px;">
              <div class="c-head">
                <div class="c-title" style="font-size:11px;">Disk I/O</div>
                <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--ink-3);">R <span id="disk-r">188 MB</span> · W <span id="disk-w">1.21 MB</span></span>
              </div>
              <div class="chart-area" style="height:40px;">
                <svg viewBox="0 0 300 40" preserveAspectRatio="none">
                  <path id="disk-line" fill="none" stroke="#ec4899" stroke-width="1.2" opacity="0.85"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="cl-head">
            <span class="title">Running containers</span>
            <span class="title" style="font-family:var(--font-mono); text-transform:none; letter-spacing:0;">live</span>
          </div>

          <div id="cl-list"></div>
        </main>
      </div>
    </div>
  `;

  // -------- live data simulation --------
  const N = 60;
  const cpu = new Array(N).fill(0).map(()=>Math.random()*2 + 0.2);
  const mem = new Array(N).fill(0).map(()=>118 + Math.random()*12);
  const net = new Array(N).fill(0).map(()=>Math.random()*8);
  const disk = new Array(N).fill(0).map((_,i)=>i===45?35:(Math.random()*3));

  function buildPath(arr, w, h, smooth=true) {
    const step = w / (arr.length - 1);
    const max = Math.max(...arr, 1);
    const min = Math.min(...arr, 0);
    const range = Math.max(max - min, 0.5);
    const pts = arr.map((v, i) => [i * step, h - ((v - min)/range) * (h - 6) - 3]);
    if (!smooth) return 'M' + pts.map(p=>p.join(',')).join('L');
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i=1;i<pts.length;i++){
      const [x,y]=pts[i], [px,py]=pts[i-1];
      const cx1 = px + (x-px)/2, cx2 = px + (x-px)/2;
      d += ` C${cx1},${py} ${cx2},${y} ${x},${y}`;
    }
    return d;
  }
  function buildArea(arr, w, h) {
    const line = buildPath(arr, w, h);
    return line + ` L${w},${h} L0,${h} Z`;
  }

  function update(){
    // shift arrays, add new sample
    cpu.shift(); cpu.push(Math.max(0.1, cpu[cpu.length-1] + (Math.random()-0.5)*1.2));
    mem.shift(); mem.push(Math.max(100, mem[mem.length-1] + (Math.random()-0.5)*6));
    net.shift(); net.push(Math.max(0, Math.random()*(Math.random()>0.9?18:5)));
    disk.shift(); disk.push(Math.max(0, Math.random()<0.05 ? 30 : Math.random()*3));

    const $ = (id) => document.getElementById(id);
    $('cpu-line') && $('cpu-line').setAttribute('d', buildPath(cpu, 300, 90));
    $('cpu-area') && $('cpu-area').setAttribute('d', buildArea(cpu, 300, 90));
    $('mem-line') && $('mem-line').setAttribute('d', buildPath(mem, 300, 90));
    $('mem-area') && $('mem-area').setAttribute('d', buildArea(mem, 300, 90));
    $('net-line') && $('net-line').setAttribute('d', buildPath(net, 300, 40));
    $('disk-line') && $('disk-line').setAttribute('d', buildPath(disk, 300, 40));

    const cur = cpu[cpu.length-1];
    $('cpu-val').innerHTML = cur.toFixed(1) + '<span class="u">%</span>';
    $('mem-val').innerHTML = Math.round(mem[mem.length-1]) + '<span class="u"> MB</span>';
    $('net-down').textContent = (7 + Math.random()*4).toFixed(2) + ' KB';
    $('net-up').textContent = Math.round(400 + Math.random()*500) + ' B';
    $('disk-r').textContent = (180 + Math.random()*12).toFixed(1) + ' MB';
    $('disk-w').textContent = (1 + Math.random()*0.6).toFixed(2) + ' MB';
  }
  update();
  setInterval(update, 1500);

  // container list
  const containers = [
    { name: 'test-web-1', image: 'nginx:alpine', state: 'running', cpu: 0.4, port: ':8080' },
    { name: 'test-redis-1', image: 'redis:7.2', state: 'running', cpu: 0.1, port: ':6379' },
    { name: 'exlo-web', image: 'node:20-slim', state: 'running', cpu: 1.8, port: ':3000' },
    { name: 'worker-batch', image: 'python:3.12', state: 'paused', cpu: 0, port: '—' },
    { name: 'legacy-api', image: 'go:1.22', state: 'stopped', cpu: 0, port: '—' },
  ];
  function sparkline(n=20, amp=1) {
    const arr = new Array(n).fill(0).map(()=>Math.random()*amp);
    return buildPath(arr, 80, 22);
  }
  const clHost = document.getElementById('cl-list');
  clHost.innerHTML = containers.map((c,i) => `
    <div class="cl-row">
      <span class="cl-dot ${c.state}"></span>
      <span class="cl-name"><span class="ghost">$</span>${c.name}</span>
      <span class="cl-meta">${c.image}</span>
      <svg class="cl-spark" viewBox="0 0 80 22" preserveAspectRatio="none">
        <path d="${sparkline(24, c.state==='running' ? 18 : 1)}" stroke="${c.state==='running' ? '#10b981' : 'var(--ink-4)'}" fill="none" stroke-width="1.2"/>
      </svg>
      <span class="cl-meta">${c.port}</span>
    </div>
  `).join('');
})();
