import React, { useMemo, useState } from 'react';
import { DB, GEJALA_DB } from './data';
import type { DiagnosisItem, Symptom, KelompokGejala } from './data';

// =============================================================
// Types
// =============================================================
type Step = 1 | 2 | 3;
type PhaseId = 'semai' | 'vegetatif' | 'bunting' | 'generatif';

interface Phase {
  id: PhaseId;
  label: string;
  sub: string;
}

interface ScoredResult extends DiagnosisItem {
  match: { score: number; pct: number; phaseOk: boolean };
}

const PHASES: Phase[] = [
  { id: 'semai', label: 'Persemaian', sub: '0–21 HST' },
  { id: 'vegetatif', label: 'Vegetatif', sub: '21–60 HST' },
  { id: 'bunting', label: 'Bunting', sub: '60–80 HST' },
  { id: 'generatif', label: 'Generatif', sub: '80–120 HST' },
];

const KELOMPOK_INFO: Record<KelompokGejala, string> = {
  daun: 'Daun',
  batang: 'Batang',
  akar: 'Akar',
  tanaman: 'Tanaman',
  malai: 'Malai',
};

function severityKey(pct: number): 'high' | 'med' | 'low' {
  if (pct >= 60) return 'high';
  if (pct >= 30) return 'med';
  return 'low';
}
function severityLabel(sev: 'high' | 'med' | 'low'): string {
  if (sev === 'high') return 'Sangat mungkin';
  if (sev === 'med') return 'Mungkin';
  return 'Kemungkinan rendah';
}

// =============================================================
// Icons
// =============================================================
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 2 7 L 12 7 M 8 3 L 12 7 L 8 11" />
  </svg>
);
const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 12 7 L 2 7 M 6 3 L 2 7 L 6 11" />
  </svg>
);
const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 3 4.5 L 6 7.5 L 9 4.5" />
  </svg>
);
const Restart = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 11.5 5 A 4.5 4.5 0 1 0 12 8.5 M 11.5 2 L 11.5 5 L 8.5 5" />
  </svg>
);
const Info = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M 8 7 L 8 11.5 M 8 4.5 L 8 5" strokeLinecap="round" />
  </svg>
);
const Warn = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
    <path d="M 6 1.5 L 11 10.5 L 1 10.5 Z" />
    <path d="M 6 5 L 6 7.5 M 6 8.7 L 6 9.1" strokeLinecap="round" />
  </svg>
);
const Search = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M 10.5 10.5 L 13.5 13.5" strokeLinecap="round" />
  </svg>
);
const BrandMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <ellipse cx="8" cy="8" rx="2.5" ry="5.5" fill="currentColor" transform="rotate(-30 8 8)" />
    <path d="M 8 14 L 8 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// =============================================================
// Phase glyphs
// =============================================================
function PhaseGlyph({ phase }: { phase: PhaseId }) {
  const glyphs: Record<PhaseId, React.ReactNode> = {
    semai: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 14 24 L 14 8" />
        <path d="M 14 16 Q 9 14 6 9" />
        <path d="M 14 16 Q 19 14 22 9" />
        <line x1="6" y1="25" x2="22" y2="25" strokeWidth="1.4" />
      </g>
    ),
    vegetatif: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 14 25 L 14 4" />
        <path d="M 14 18 Q 8 14 4 9" />
        <path d="M 14 18 Q 20 14 24 9" />
        <path d="M 14 12 Q 9 8 6 4" />
        <path d="M 14 12 Q 19 8 22 4" />
      </g>
    ),
    bunting: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 14 26 L 14 6" />
        <ellipse cx="14" cy="9" rx="3.5" ry="6" fill="currentColor" fillOpacity="0.18" stroke="currentColor" />
        <path d="M 14 18 Q 8 16 5 12" />
        <path d="M 14 18 Q 20 16 23 12" />
      </g>
    ),
    generatif: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 14 26 Q 14 18 11 6" />
        <path d="M 12 14 Q 8 12 4 8" />
        <path d="M 13 10 Q 17 7 21 4" />
        {[0, 1, 2, 3, 4].map(i => {
          const t = i / 4;
          const x = 11 - t * 4;
          const y = 6 + t * 12;
          return <ellipse key={i} cx={x} cy={y} rx="1.6" ry="0.8" fill="currentColor" fillOpacity="0.85" transform={`rotate(${-35 + t * 10} ${x} ${y})`} />;
        })}
      </g>
    ),
  };
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="phase-icon" aria-hidden="true">
      {glyphs[phase]}
    </svg>
  );
}

// =============================================================
// Main App
// =============================================================
const App: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [phase, setPhase] = useState<PhaseId | null>(null);
  const [symptoms, setSymptoms] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleSym = (id: string): void => {
    const next = new Set(symptoms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSymptoms(next);
  };

  const reset = (): void => {
    setStep(1);
    setPhase(null);
    setSymptoms(new Set());
    setOpenId(null);
  };

  const results = useMemo<ScoredResult[]>(() => {
    if (!phase || symptoms.size === 0) return [];
    const all: DiagnosisItem[] = [...DB.hama, ...DB.penyakit, ...DB.defisiensi];
    return all
      .map((item): ScoredResult => {
        const kunci = item.gejalaKunci || [];
        const semua = item.semua_gejala || [];
        let score = 0;
        symptoms.forEach(s => {
          if (kunci.includes(s)) score += 3;
          else if (semua.includes(s)) score += 1;
        });
        const phaseOk = item.fase.includes(phase);
        if (!phaseOk) score *= 0.4;
        const max = kunci.length * 3 + (semua.length - kunci.length);
        const pct = Math.min(100, Math.round((score / Math.max(max, 1)) * 100));
        return { ...item, match: { score, pct, phaseOk } };
      })
      .filter(r => r.match.score > 0)
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 6);
  }, [phase, symptoms]);

  const currentPhase = PHASES.find(p => p.id === phase) || null;
  const symList: Symptom[] = phase ? (GEJALA_DB[phase] || []) : [];

  return (
    <div className="app">
      <TopBar />
      <main className="shell">
        {step === 1 && <Masthead />}
        <Steps step={step} />

        {step === 1 && (
          <Step1 onPick={(id: PhaseId) => { setPhase(id); setSymptoms(new Set()); setStep(2); }} />
        )}
        {step === 2 && currentPhase && (
          <Step2
            phase={currentPhase}
            symList={symList}
            symptoms={symptoms}
            toggleSym={toggleSym}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && currentPhase && (
          <Step3
            results={results}
            phase={currentPhase}
            symptoms={symptoms}
            openId={openId}
            setOpenId={setOpenId}
            onBack={() => setStep(2)}
            onReset={reset}
          />
        )}

        <Footer />
      </main>
    </div>
  );
};

// =============================================================
// Sub-components
// =============================================================

const TopBar: React.FC = () => (
  <header className="topbar">
    <div className="topbar-brand">
      <div className="brand-mark"><BrandMark /></div>
      <div className="brand-text">
        <div className="brand-text-1">Sistem Pakar Padi</div>
        <div className="brand-text-2">BRMP Kalimantan Barat</div>
      </div>
    </div>
    <div className="topbar-meta">Edisi 2026</div>
  </header>
);

const Masthead: React.FC = () => (
  <section className="masthead fade-in">
    <div className="masthead-tag">Panduan lapangan</div>
    <h1>Diagnosa cepat hama, penyakit &amp; defisiensi padi</h1>
    <p className="masthead-sub">
      Bantuan diagnosa lapangan untuk lahan pasang surut Kalimantan Barat — Kubu Raya, Pontianak &amp; Mempawah.
    </p>
  </section>
);

const Steps: React.FC<{ step: Step }> = ({ step }) => {
  const items = ['Fase tumbuh', 'Tandai gejala', 'Hasil'];
  return (
    <nav className="steps" aria-label="Langkah">
      {items.map((label, i) => {
        const n = (i + 1) as Step;
        const cls = step > n ? 'done' : step === n ? 'active' : '';
        return (
          <React.Fragment key={i}>
            <div className={`step ${cls}`}>
              <span className="step-num">{step > n ? '✓' : n}</span>
              <span className="step-label">{label}</span>
            </div>
            {i < items.length - 1 && <div className="step-sep" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

const Step1: React.FC<{ onPick: (id: PhaseId) => void }> = ({ onPick }) => (
  <section className="fade-in">
    <div className="section-h">
      <h2>Mulai dari fase tumbuh padi</h2>
      <p>Pilih fase pertumbuhan di lahan Anda. Sistem akan menyaring gejala yang relevan dengan fase tersebut.</p>
    </div>

    <div className="phases">
      {PHASES.map(p => (
        <button key={p.id} className="phase" onClick={() => onPick(p.id)} aria-label={`Pilih ${p.label}`}>
          <PhaseGlyph phase={p.id} />
          <div className="phase-name">{p.label}</div>
          <div className="phase-time">{p.sub}</div>
          <span className="phase-arrow"><Arrow /></span>
        </button>
      ))}
    </div>

    <div className="tip">
      <span className="tip-mark"><Info /></span>
      <div>
        <b>Petunjuk.</b> Bila lebih dari satu masalah terlihat, mulai dari yang paling dominan. Minimal 2 gejala untuk hasil terbaik.
      </div>
    </div>
  </section>
);

const Step2: React.FC<{
  phase: Phase;
  symList: Symptom[];
  symptoms: Set<string>;
  toggleSym: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ phase, symList, symptoms, toggleSym, onNext, onBack }) => {
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    symList.forEach(s => { counts[s.kelompok] = (counts[s.kelompok] || 0) + 1; });
    return counts;
  }, [symList]);

  const availableAreas = useMemo<KelompokGejala[]>(
    () => [...new Set(symList.map(s => s.kelompok))],
    [symList]
  );

  const [areas, setAreas] = useState<Set<KelompokGejala>>(() => {
    if (symptoms.size === 0) return new Set();
    const pre = new Set<KelompokGejala>();
    symptoms.forEach(id => {
      const s = symList.find(x => x.id === id);
      if (s) pre.add(s.kelompok);
    });
    return pre;
  });
  const [showAll, setShowAll] = useState(false);

  const toggleArea = (k: KelompokGejala) => {
    setAreas(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
    setShowAll(false);
  };

  const displayList = useMemo(
    () => showAll ? symList : areas.size === 0 ? [] : symList.filter(s => areas.has(s.kelompok)),
    [symList, areas, showAll]
  );

  const showGrid = showAll || areas.size > 0;

  return (
    <section className="fade-in">
      <div className="section-h">
        <h2>Bagian mana yang bermasalah?</h2>
        <p>Pilih satu atau lebih bagian tanaman, lalu centang gejala yang Anda lihat.</p>
      </div>

      <div className="context-bar">
        <div className="context-bar-left">
          <span className="context-pill">{phase.label}</span>
          <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-sm)' }}>{phase.sub}</span>
        </div>
        <div className="context-count">
          <b>{symptoms.size}</b> / {symList.length} gejala
        </div>
      </div>

      <div className="area-label">Bagian tanaman</div>
      <div className="area-row">
        {availableAreas.map(k => (
          <button
            key={k}
            className={`area-chip ${areas.has(k) ? 'on' : ''}`}
            onClick={() => toggleArea(k)}
            aria-pressed={areas.has(k)}
          >
            {KELOMPOK_INFO[k]}
            <span className="area-chip-count">{areaCounts[k]}</span>
          </button>
        ))}
        <button
          className={`area-chip ${showAll ? 'on' : ''}`}
          onClick={() => { setShowAll(true); setAreas(new Set()); }}
          aria-pressed={showAll}
        >
          Semua
          <span className="area-chip-count">{symList.length}</span>
        </button>
      </div>

      {showGrid ? (
        <div className="symptoms">
          {displayList.map(g => (
            <button
              key={g.id}
              className={`sym ${symptoms.has(g.id) ? 'on' : ''}`}
              onClick={() => toggleSym(g.id)}
              aria-pressed={symptoms.has(g.id)}
            >
              <span className="sym-check" aria-hidden="true" />
              <span className="sym-body">
                <span className="sym-label">{g.label}</span>
                <span className="sym-desc">{g.desc}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">Pilih bagian tanaman di atas untuk melihat daftar gejala</div>
      )}

      <div className="controls">
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft /> Ganti fase</button>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={onNext} disabled={symptoms.size === 0}>
          Lihat hasil <Arrow />
        </button>
      </div>
    </section>
  );
};

const Step3: React.FC<{
  results: ScoredResult[];
  phase: Phase;
  symptoms: Set<string>;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onBack: () => void;
  onReset: () => void;
}> = ({ results, phase, symptoms, openId, setOpenId, onBack, onReset }) => {
  const symptomLabels = useMemo<string[]>(() => {
    const all = Object.values(GEJALA_DB).flat();
    return [...symptoms].map(id => all.find(s => s.id === id)?.label || id);
  }, [symptoms]);

  return (
    <section className="fade-in">
      <div className="section-h">
        <h2>Kemungkinan diagnosa</h2>
        <p>Daftar diurutkan dari kecocokan tertinggi. Konfirmasi temuan dengan petugas POPT sebelum tindakan.</p>
      </div>

      <div className="context-bar" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div className="context-bar-left">
          <span className="context-pill">{phase.label}</span>
          <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-sm)' }}>{phase.sub}</span>
        </div>
        <div className="chips">
          {symptomLabels.slice(0, 6).map((l, i) => (
            <span key={i} className="chip">{l}</span>
          ))}
          {symptomLabels.length > 6 && (
            <span className="chip chip-more">+{symptomLabels.length - 6}</span>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon"><Search /></div>
          <h3>Tidak ada kecocokan</h3>
          <p>Coba tambahkan gejala lain atau hubungi petugas POPT setempat.</p>
        </div>
      ) : (
        <div className="results">
          {results.map((item, idx) => (
            <ResultCard
              key={item.id}
              item={item}
              idx={idx + 1}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
          <div className="disclaimer">
            <b>Catatan.</b> Hasil ini adalah panduan lapangan berbasis aturan, bukan diagnosis definitif. Konfirmasi dengan petugas POPT atau laboratorium sebelum aplikasi pestisida.
          </div>
        </div>
      )}

      <div className="controls">
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft /> Ubah gejala</button>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={onReset}>
          Mulai ulang <Restart />
        </button>
      </div>
    </section>
  );
};

const ResultCard: React.FC<{
  item: ScoredResult;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, idx, isOpen, onToggle }) => {
  const sev = severityKey(item.match.pct);
  const sevLbl = severityLabel(sev);

  return (
    <article className={`result sev-${sev}`}>
      <div className="result-head">
        <div className="result-rank">{idx}</div>
        <div className="result-title-wrap">
          <div className="result-tipe">{item.tipe} · {item.lokasi.split(',')[0]}</div>
          <div className="result-title">{item.nama}</div>
          <div className="result-sci">{item.ilmiah}</div>
        </div>
      </div>

      <div className="match">
        <div>
          <div className="match-head">
            <span>Kecocokan</span>
            <b>{sevLbl}</b>
          </div>
          <div className="match-bar">
            <div className="match-bar-fill" style={{ width: `${item.match.pct}%` }} />
          </div>
          {!item.match.phaseOk && (
            <div className="match-warn"><Warn /> Tidak khas pada fase ini</div>
          )}
        </div>
        <div className="match-pct">
          {item.match.pct}<span className="pct-unit">%</span>
        </div>
      </div>

      <div className="facts">
        {item.ciri_khas.slice(0, 4).map((f, i) => (
          <div key={i}>
            <div className="fact-label">{f.label}</div>
            <div className="fact-val">{f.val}</div>
          </div>
        ))}
      </div>

      <button className={`acc-toggle ${isOpen ? 'open' : ''}`} onClick={onToggle} aria-expanded={isOpen}>
        <span>{isOpen ? 'Sembunyikan' : 'Lihat'} pengendalian &amp; rekomendasi</span>
        <span className="acc-chev"><Chevron /></span>
      </button>

      {isOpen && (
        <div className="acc-body">
          <h4>Rekomendasi pengendalian</h4>
          <p>{item.pengendalian}</p>
          {item.catatan_kalbar && (
            <div className="kalbar-note">
              <div className="kalbar-note-label">Catatan Kalbar</div>
              {item.catatan_kalbar}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

const Footer: React.FC = () => (
  <footer className="footer">
    <p>Disusun untuk petani lahan pasang surut Kubu Raya, Pontianak &amp; Mempawah.</p>
    <p style={{ marginTop: 4 }}>Berdasarkan basis data BPTP Kalbar &amp; pengalaman lapangan POPT · 2026</p>
  </footer>
);

export default App;
