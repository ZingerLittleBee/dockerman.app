import type { HomeT } from './copy'
import s from './home.module.css'
import { cn, Ic, SectionTitle } from './primitives'

/** Agent Sandbox story told as a 12s CSS loop: copy in, run isolated, review the diff, apply. */
export function SandboxSection({ t }: { t: HomeT }) {
  const filtered = t('home.sandbox.filtered')
  const files = [
    { name: 'src/', ok: true, cue: s.q2 },
    { name: 'package.json', ok: true, cue: s.q6 },
    { name: 'README.md', ok: true, cue: s.q10 },
    { name: '.env', ok: false, cue: s.q14 },
    { name: '~/.ssh/id_ed25519', ok: false, cue: s.q18 }
  ]

  return (
    <section className={cn(s.wrap, s.sec)} id="sandbox">
      <SectionTitle lead={t('home.sandbox.titleLead')} trail={t('home.sandbox.titleTrail')} />
      <div aria-label={t('home.sandbox.aria')} className={cn(s.sbxG, s.rv)} role="img">
        <div className={s.pn}>
          <div className={s.pnH}>
            <Ic>
              <path d="M3 7h6l2 2h10v10H3Z" />
            </Ic>
            <b className={s.mono}>~/repo</b>
            <span>{t('home.sandbox.workspace')}</span>
          </div>
          <div className={cn(s.pnB, s.mono)}>
            {files.map((file) => (
              <div className={cn(s.fr, file.ok ? s.ok : s.x, file.cue)} key={file.name}>
                <span className={s.nm}>{file.name}</span>
                <span className={s.s2}>{file.ok ? '✓ copy-in' : `✕ ${filtered}`}</span>
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden="true" className={s.arw}>
          <i />
        </div>
        <div className={cn(s.pn, s.vmp)}>
          <span className={s.ring} />
          <span className={s.ring} />
          <div className={s.pnH}>
            <b className={cn(s.mono, s.acc)}>microVM</b>
            <span className={s.mono}>libkrun · zero-NIC</span>
          </div>
          <div className={cn(s.pnB, s.mono)}>
            <div className={cn(s.tln, s.q26)}>
              <span className={s.pr}>agent $</span>npm install
            </div>
            <div className={cn(s.tln, s.ok, s.q33)}>✓ {t('home.sandbox.added')}</div>
            <div className={cn(s.tln, s.q40)}>
              <span className={s.pr}>agent $</span>curl 169.254.169.254
            </div>
            <div className={cn(s.tln, s.bad, s.q46)}>✕ {t('home.sandbox.blocked')}</div>
            <div className={cn(s.tln, s.q52)}>
              <span className={s.pr}>agent $</span>npm test
            </div>
            <div className={cn(s.tln, s.ok, s.q58)}>✓ {t('home.sandbox.passed')}</div>
          </div>
        </div>
        <div aria-hidden="true" className={s.arw}>
          <i />
        </div>
        <div className={s.pn}>
          <div className={s.pnH}>
            <b>{t('home.sandbox.diff')}</b>
            <span>· {t('home.sandbox.files')}</span>
          </div>
          <div className={cn(s.pnB, s.mono)}>
            <div className={cn(s.df, s.q64)}>
              <span>src/api.ts</span>
              <span className={s.pl2}>+12</span>
              <span className={s.mi}>−3</span>
            </div>
            <div className={cn(s.dbar, s.q64)}>
              <i />
              <i />
              <i />
              <i />
              <i className={s.r} />
              <i className={s.n} />
            </div>
            <div className={cn(s.df, s.q68)}>
              <span>package.json</span>
              <span className={s.pl2}>+1</span>
              <span className={s.mi}>−0</span>
            </div>
            <div className={cn(s.dbar, s.q68)}>
              <i />
              <i className={s.n} />
              <i className={s.n} />
              <i className={s.n} />
              <i className={s.n} />
              <i className={s.n} />
            </div>
            <div className={s.apb}>
              <span className={s.a1}>{t('home.sandbox.apply')}</span>
              <span className={s.a2}>✓ {t('home.sandbox.applied')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={cn(s.sbxChips, s.mono, s.rv)}>
        <span>
          <b>libkrun</b> · Apple Silicon
        </span>
        <span>
          <b>Firecracker</b> · Linux KVM
        </span>
        <span>zero-NIC egress</span>
        <span>copy-in</span>
        <span>Diff &amp; Apply</span>
        <span>CLI · Skill · MCP</span>
      </div>
    </section>
  )
}
