import React, { useMemo, useState } from 'react';
import { DB, GEJALA_DB } from './data';
import type { DiagnosisItem } from './data';
import {
  PadiStalk,
  BatikBackground,
  TampukDivider,
  PhaseIllustration,
  CornerHook,
  CorakInsang,
  KelawitDayak,
} from './Ornaments';

// =============================================================
// Types
// =============================================================
type Step = 1 | 2 | 3;
type PhaseId = 'semai' | 'vegetatif' | 'bunting' | 'generatif';

interface Phase {
  id: PhaseId;
  label: string;
  sub: string;
  num: string;
}

interface ScoredResult extends DiagnosisItem {
  match: { score: number; pct: number; phaseOk: boolean };
}

const PHASES: Phase[] = [
  { id: 'semai', label: 'Persemaian', sub: '0–21 HST', num: 'I' },
  { id: 'vegetatif', label: 'Vegetatif', sub: '21–60 HST', num: 'II' },
  { id: 'bunting', label: 'Bunting', sub: '60–80 HST', num: 'III' },
  { id: 'generatif', label: 'Generatif', sub: '80–120 HST', num: 'IV' },
];

function tipeClass(tipe: string): string {
  const t = tipe.toLowerCase();
  if (t.includes('hama')) return 'tipe-hama';
  if (t.includes('jamur')) return 'tipe-jamur';
  if (t.includes('bakteri')) return 'tipe-bakteri';
  if (t.includes('virus')) return 'tipe-virus';
  if (t.includes('keracunan')) return 'tipe-keracunan';
  return 'tipe-defisiensi';
}

function severityKey(pct: number): 'high' | 'med' | 'low' {
  if (pct >= 60) return 'high';
  if (pct >= 30) return 'med';
  return 'low';
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
  const symList = phase ? GEJALA_DB[phase] || [] : [];

  return (
    <div className="page">
      <div className="bg-pattern-wrap">
        <BatikBackground variant="rebung" opacity={0.05} />
      </div>
      <TopBand />
      <div className="shell">
        <Masthead />
        <StepRail step={step} />

        {step === 1 && (
          <Step1
            onPick={(id: PhaseId) => {
              setPhase(id);
              setSymptoms(new Set());
              setStep(2);
            }}
          />
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
            onBack={() => setStep(2)}
            onReset={reset}
            openId={openId}
            setOpenId={setOpenId}
          />
        )}

        <Footer />
      </div>
    </div>
  );
};

// =============================================================
// Sub-components
// =============================================================

const TopBand: React.FC = () => (
  <div className="top-band">
    <span>BRMP</span>
    <b>Kalimantan Barat</b>
    <span>Kementerian Pertanian</span>
  </div>
);

const Masthead: React.FC = () => (
  <div className="masthead">
    <div className="padi-flank left">
      <PadiStalk side="left" size={88} opacity={0.6} />
    </div>
    <div className="padi-flank right">
      <PadiStalk side="right" size={88} opacity={0.6} />
    </div>
    <div className="masthead-eyebrow">Panduan Lapangan</div>
    <h1>
      Diagnosa <em>Padi</em> Kalbar
    </h1>
    <div className="masthead-sub">
      Identifikasi hama, penyakit, &amp; defisiensi hara di lahan pasang surut
    </div>
    <div className="masthead-meta">
      <span>
        34 <b>Penyakit</b>
      </span>
      <span className="dot"></span>
      <span>
        4 <b>Fase Tumbuh</b>
      </span>
      <span className="dot"></span>
      <span>
        Edisi <b>2026</b>
      </span>
    </div>
    <div className="masthead-divider">
      <TampukDivider width={280} />
    </div>
  </div>
);

const StepRail: React.FC<{ step: Step }> = ({ step }) => {
  const items = ['Pilih Fase', 'Tandai Gejala', 'Hasil Diagnosa'];
  return (
    <div className="steprail">
      {items.map((label, i) => {
        const n = i + 1;
        const cls = step > n ? 'done' : step === n ? 'active' : '';
        return (
          <React.Fragment key={i}>
            {i > 0 && <div className="steprail-link" />}
            <div className={`steprail-step ${cls}`}>
              <div className="steprail-num">{step > n ? '✓' : n}</div>
              <div className="steprail-label">{label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Step1: React.FC<{ onPick: (id: PhaseId) => void }> = ({ onPick }) => (
  <section className="fade-up">
    <div className="section-heading">
      <div>
        <div className="kicker">Langkah 01</div>
        <h2>
          Mulai dari <em>fase tumbuh</em>
        </h2>
      </div>
      <p>
        Pilih fase pertumbuhan padi di lahan Anda. Sistem akan menyaring gejala
        yang khas untuk fase tersebut.
      </p>
    </div>

    <div className="phase-row">
      {PHASES.map(p => (
        <button key={p.id} className="phase-card" onClick={() => onPick(p.id)}>
          <span className="corner-tl"><CornerHook size={20} position="tl" /></span>
          <span className="corner-tr"><CornerHook size={20} position="tr" /></span>
          <span className="corner-bl"><CornerHook size={20} position="bl" /></span>
          <span className="corner-br"><CornerHook size={20} position="br" /></span>
          <div className="phase-illus">
            <PhaseIllustration phase={p.id} size={64} />
          </div>
          <div className="phase-num">FASE — {p.num}</div>
          <div className="phase-name">
            <em>{p.label}</em>
          </div>
          <div className="phase-time">{p.sub}</div>
        </button>
      ))}
    </div>

    <div className="tip">
      <span className="tip-mark">¶</span>
      <div>
        <b>Petunjuk lapangan.</b> Bila Anda melihat lebih dari satu masalah,
        mulailah dari yang paling dominan. Sistem ini menggabungkan gejala kunci
        &amp; gejala umum untuk menghitung kecocokan; minimal 2 gejala
        dianjurkan untuk hasil terbaik.
      </div>
    </div>
  </section>
);

interface SymptomItem {
  id: string;
  label: string;
  desc: string;
}

const Step2: React.FC<{
  phase: Phase;
  symList: SymptomItem[];
  symptoms: Set<string>;
  toggleSym: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ phase, symList, symptoms, toggleSym, onNext, onBack }) => (
  <section className="fade-up">
    <div className="section-heading">
      <div>
        <div className="kicker">Langkah 02</div>
        <h2>
          Tandai <em>gejala</em> yang terlihat
        </h2>
      </div>
      <p>
        Centang gejala yang Anda amati di lapangan untuk fase{' '}
        {phase.label.toLowerCase()}. Bisa lebih dari satu.
      </p>
    </div>

    <div className="symptom-bar">
      <div className="symptom-bar-left">
        <span>Fase aktif</span>
        <span className="symptom-bar-chip">
          {phase.label} · {phase.sub}
        </span>
      </div>
      <div className="symptom-bar-count">
        {symptoms.size.toString().padStart(2, '0')} /{' '}
        {symList.length.toString().padStart(2, '0')} gejala terpilih
      </div>
    </div>

    <div className="symptom-grid">
      {symList.map(g => (
        <button
          key={g.id}
          className={`sym ${symptoms.has(g.id) ? 'on' : ''}`}
          onClick={() => toggleSym(g.id)}
        >
          <span className="sym-check"></span>
          <div className="sym-label">{g.label}</div>
          <div className="sym-desc">{g.desc}</div>
        </button>
      ))}
    </div>

    <div className="controls">
      <button className="btn-ghost" onClick={onBack}>
        ← Ganti fase
      </button>
      <button className="btn" onClick={onNext} disabled={symptoms.size === 0}>
        Lihat hasil diagnosa <span className="arrow">→</span>
      </button>
    </div>
  </section>
);

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
    <section className="fade-up">
      <div className="section-heading">
        <div>
          <div className="kicker">Langkah 03 — Hasil</div>
          <h2>
            Kemungkinan <em>diagnosa</em>
          </h2>
        </div>
        <p>
          Daftar diurutkan dari kecocokan tertinggi. Konfirmasi temuan dengan
          petugas POPT.
        </p>
      </div>

      <div className="symptom-bar">
        <div className="symptom-bar-left">
          <span>
            {phase.label} · {phase.sub}
          </span>
        </div>
        <div className="selected-summary">
          {symptomLabels.slice(0, 4).map((l, i) => (
            <span key={i} className="selected-chip">
              {l}
            </span>
          ))}
          {symptomLabels.length > 4 && (
            <span className="selected-chip">+{symptomLabels.length - 4}</span>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <KelawitDayak size={48} />
          <h3>Tidak ada kecocokan</h3>
          <p>Coba tambahkan gejala lain, atau hubungi petugas POPT setempat.</p>
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
            <span className="disclaimer-mark">Catatan</span>
            Hasil ini adalah panduan lapangan berbasis aturan; bukan diagnosis
            definitif. Konfirmasi dengan petugas POPT atau laboratorium sebelum
            aplikasi pestisida.
          </div>
        </div>
      )}

      <div className="controls">
        <button className="btn-ghost" onClick={onBack}>
          ← Ubah gejala
        </button>
        <button className="btn" onClick={onReset}>
          Mulai ulang <span className="arrow">↻</span>
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
  const sevLabel =
    sev === 'high'
      ? 'Sangat mungkin'
      : sev === 'med'
        ? 'Mungkin'
        : 'Kemungkinan rendah';

  return (
    <article className={`result severity-${sev} fade-up`}>
      <div className="ornament-band">
        <CorakInsang width={520} height={20} count={26} />
      </div>
      <div className="result-body">
        <div className="result-rank">
          <div className="result-rank-circle">
            <span className="result-rank-num">{idx}</span>
          </div>
        </div>

        <div className="result-eyebrow">
          <span>{item.tipe}</span>
          <span className="sep"></span>
          <span>Lokasi · {item.lokasi.split(',')[0]}</span>
        </div>
        <h3>{item.nama}</h3>
        <div className="result-sci">{item.ilmiah}</div>

        <div className="result-meta">
          <span className={`meta-pill ${tipeClass(item.tipe)}`}>
            {item.tipe}
          </span>
          <span className="meta-pill severity">
            Keparahan · {item.keparahan}
          </span>
          <span className="meta-pill location">{item.lokasi}</span>
        </div>

        <div className="match">
          <div className="match-bar-wrap">
            <div className="match-bar-head">
              <span>Kecocokan Gejala</span>
              <b>{sevLabel}</b>
            </div>
            <div className="match-bar">
              <div
                className="match-bar-fill"
                style={{ width: `${item.match.pct}%` }}
              />
            </div>
            {!item.match.phaseOk && (
              <div className="match-warn">⚠ Tidak khas pada fase ini</div>
            )}
          </div>
          <div className="match-pct">
            {item.match.pct}
            <span className="small">%</span>
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

        <button className="acc-toggle" onClick={onToggle}>
          <span>Pengendalian &amp; rekomendasi lapangan</span>
          <span className="acc-icon">{isOpen ? '−' : '+'}</span>
        </button>

        {isOpen && (
          <div className="acc-body">
            <h4>Rekomendasi pengendalian</h4>
            <p>{item.pengendalian}</p>
            {item.catatan_kalbar && (
              <div className="kalbar-note">
                <div className="kalbar-note-label">◆ Catatan Kalbar</div>
                {item.catatan_kalbar}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const Footer: React.FC = () => (
  <div className="footer">
    <div className="footer-rosette">
      <TampukDivider width={240} />
    </div>
    <p>
      Disusun untuk petani lahan pasang surut Kubu Raya, Pontianak, &amp;
      Mempawah.
    </p>
    <p style={{ fontSize: 13 }}>
      Berdasarkan basis data BPTP Kalbar &amp; pengalaman lapangan POPT.
    </p>
    <div className="footer-tag">Sistem Pakar Padi · Kalbar 2026</div>
  </div>
);

export default App;
