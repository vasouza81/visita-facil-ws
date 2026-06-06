import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wilson Sons — Agendamento de Visitas" },
      {
        name: "description",
        content:
          "Agende sua visita à Wilson Sons com segurança. Conheça as regras de EPI, assista ao vídeo de orientação e realize o quiz de segurança.",
      },
      { property: "og:title", content: "Wilson Sons — Agendamento de Visitas" },
      {
        property: "og:description",
        content:
          "Plataforma de agendamento de visitas com etapas de segurança e EPI.",
      },
    ],
  }),
  component: Index,
});

type Question = {
  q: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    q: "Qual EPI é obrigatório ao entrar na área operacional?",
    options: [
      "Apenas crachá de visitante",
      "Capacete, óculos de proteção, colete refletivo e calçado de segurança",
      "Somente boné e tênis",
    ],
    answer: 1,
  },
  {
    q: "Ao ouvir o alarme de emergência, o visitante deve:",
    options: [
      "Continuar a visita normalmente",
      "Sair correndo em qualquer direção",
      "Seguir o anfitrião até o ponto de encontro indicado",
    ],
    answer: 2,
  },
  {
    q: "É permitido circular sozinho pelo terminal portuário?",
    options: [
      "Sim, desde que com crachá",
      "Não, sempre acompanhado por um colaborador autorizado",
      "Sim, se já tiver visitado antes",
    ],
    answer: 1,
  },
];

const toBase64 = (file: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
  });

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Index() {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    instituicao: "",
    numeroVisitantes: "",
    data: "",
    horario: "",
    motivo: "",
    hostNome: "",
    hostEmail: "",
  });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [scheduled, setScheduled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const correctCount = useMemo(
    () => answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0), 0),
    [answers],
  );
  const approved = submittedQuiz && correctCount === QUESTIONS.length;

  const handleSelect = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuiz(true);
  };

  const resetQuiz = () => {
    setAnswers([null, null, null]);
    setSubmittedQuiz(false);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fotoFile) {
      alert("Por favor, selecione uma foto da vestimenta completa.");
      return;
    }

    setSubmitting(true);

    try {
      const fotoBase64 = await toBase64(fotoFile);

      await fetch(
        "https://script.google.com/macros/s/AKfycbzEpkXO2fMAiOagdoqCjGtFZD5900lPCDLcePy0JgQ7YAKYS41BgedFPqDuuRFIMJHXzw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, fotoVestimenta: fotoBase64 }),
        },
      );
      setScheduled(true);
    } catch (err) {
      console.error(err);
      setScheduled(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-navy bg-navy text-navy-foreground shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange font-bold text-orange-foreground">
              WS
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-white sm:text-lg">Wilson Sons</h1>
              <p className="text-xs text-white/80">Agendamento de Visitas</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm text-white md:flex">
            <a href="#processo" className="transition hover:text-orange">Processo</a>
            <a href="#epi" className="transition hover:text-orange">Segurança</a>
            <a href="#video" className="transition hover:text-orange">Vídeo</a>
            <a href="#quiz" className="transition hover:text-orange">Quiz</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-[#001a4d] text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Reveal className="max-w-3xl">
            <span className="inline-block rounded-full bg-orange/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange">
              Bem-vindo
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              Agende sua visita com <span className="text-orange">segurança</span> em 3 passos
            </h2>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Para garantir uma visita tranquila aos nossos terminais e estaleiros, siga as orientações e conclua o processo de segurança abaixo.
            </p>
          </Reveal>

          <div id="processo" className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { n: 1, t: "Leia as regras de EPI", d: "Conheça os equipamentos obrigatórios para acesso." },
              { n: 2, t: "Assista ao vídeo", d: "Orientações oficiais de segurança Wilson Sons." },
              { n: 3, t: "Faça o quiz e agende", d: "Acerte todas as perguntas para liberar o agendamento." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-orange">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-lg font-bold text-orange-foreground">
                    {s.n}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
                  <p className="mt-2 text-sm text-white/75">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EPI rules */}
      <section id="epi" className="bg-graylight">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange">Segurança em primeiro lugar</span>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Regras de EPI</h2>
            <p className="mt-3 text-muted-foreground">
              Todo visitante deve utilizar os Equipamentos de Proteção Individual obrigatórios e evitar itens proibidos durante toda a permanência nas áreas operacionais.
            </p>
          </Reveal>

          {/* Obrigatórios */}
          <Reveal className="mt-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">✓</span>
              <h3 className="text-lg font-bold text-success">EPIs obrigatórios</h3>
            </div>
          </Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: "🪖", t: "Capacete de segurança", d: "Obrigatório em todas as áreas operacionais e de movimentação de cargas." },
              { i: "🥽", t: "Óculos de proteção", d: "Proteção ocular contra partículas, respingos e poeira." },
              { i: "🦺", t: "Colete refletivo", d: "Visibilidade obrigatória junto a equipamentos e veículos em movimento." },
              { i: "🥾", t: "Calçado de segurança", d: "Botina com biqueira de aço para proteção dos pés." },
              { i: "🧤", t: "Luvas (quando exigido)", d: "Conforme orientação do anfitrião e área visitada." },
              { i: "🎧", t: "Protetor auricular", d: "Em áreas com ruído elevado sinalizadas." },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 80}>
                <div className="h-full rounded-xl border-2 border-success/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-success hover:shadow-md">
                  <div className="text-3xl text-success">{item.i}</div>
                  <h3 className="mt-3 font-semibold text-navy">{item.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Proibidos */}
          <Reveal className="mt-12">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-danger text-danger-foreground">✕</span>
              <h3 className="text-lg font-bold text-danger">Itens proibidos</h3>
            </div>
          </Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: "📷", t: "Câmeras e celulares", d: "Não é permitido fotografar ou filmar dentro das áreas restritas." },
              { i: "🔥", t: "Isqueiros e fósforos", d: "Fontes de ignição são proibidas em áreas operacionais." },
              { i: "👡", t: "Calçado aberto", d: "Sandálias, chinelos e sapatos abertos não são permitidos." },
              { i: "🍺", t: "Bebidas alcoólicas", d: "Proibido o consumo ou porte de bebidas alcoólicas." },
              { i: "🚬", t: "Cigarros", d: "Fumar é proibido em todas as áreas internas do terminal." },
              { i: "👤", t: "Circulação sozinho", d: "Visitantes não podem circular sem o anfitrião autorizado." },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 80}>
                <div className="h-full rounded-xl border-2 border-danger/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-danger hover:shadow-md">
                  <div className="text-3xl text-danger">{item.i}</div>
                  <h3 className="mt-3 font-semibold text-navy">{item.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="rounded-xl border-l-4 border-orange bg-white p-5 shadow-sm">
              <p className="text-sm text-foreground">
                <strong className="text-navy">Importante:</strong> siga sempre as instruções do anfitrião e respeite a sinalização das áreas restritas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Video */}
      <section id="video" className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange">Orientação em vídeo</span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Assista antes de agendar</h2>
            <p className="mt-3 text-white/80">
              Vídeo de integração com as principais orientações de segurança para visitantes.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <div className="overflow-hidden rounded-2xl border-4 border-orange bg-black shadow-2xl">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/kZGNypHb0nw"
                  title="Vídeo de segurança Wilson Sons"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="bg-graylight">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Reveal className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange">Etapa final</span>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Quiz de segurança</h2>
            <p className="mt-3 text-muted-foreground">
              Responda corretamente as 3 perguntas para liberar o formulário de agendamento.
            </p>
          </Reveal>

          <form onSubmit={handleQuizSubmit} className="mt-10 space-y-6">
            {QUESTIONS.map((q, qIdx) => {
              const selected = answers[qIdx];
              const isWrong = submittedQuiz && selected !== q.answer;
              const isCorrect = submittedQuiz && selected === q.answer;
              return (
                <Reveal key={qIdx} delay={qIdx * 100}>
                  <div
                    className={`rounded-xl border-2 bg-white p-6 shadow-sm transition ${
                      submittedQuiz
                        ? isWrong
                          ? "border-danger"
                          : "border-success"
                        : "border-orange"
                    }`}
                  >
                    <p className="font-semibold text-navy">
                      {qIdx + 1}. {q.q}
                    </p>
                    <div className="mt-4 space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                            selected === optIdx
                              ? "border-navy bg-navy/5"
                              : "border-border hover:border-navy/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${qIdx}`}
                            className="mt-0.5 accent-[#003087]"
                            checked={selected === optIdx}
                            onChange={() => handleSelect(qIdx, optIdx)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {submittedQuiz && (
                      <p
                        className={`mt-3 text-sm font-semibold ${
                          isCorrect ? "text-success" : "text-danger"
                        }`}
                      >
                        {isCorrect ? "✓ Resposta correta" : "✕ Resposta incorreta"}
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}

            {!approved && (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-navy px-6 py-3 font-semibold text-navy-foreground shadow-sm transition hover:bg-orange hover:text-orange-foreground sm:w-auto"
                >
                  Verificar respostas
                </button>
                {submittedQuiz && (
                  <p className="text-sm text-danger">
                    Você acertou {correctCount} de {QUESTIONS.length}.{" "}
                    <button type="button" onClick={resetQuiz} className="underline">
                      Tentar novamente
                    </button>
                  </p>
                )}
              </div>
            )}

            {approved && (
              <div className="rounded-xl border-2 border-success bg-success/10 p-5 text-center">
                <p className="font-semibold text-success">✅ Aprovado! Você pode agendar sua visita abaixo.</p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Scheduling form */}
      {approved && (
        <section id="agendar" className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <Reveal className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange">Agendamento</span>
              <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Solicite sua visita</h2>
              <p className="mt-3 text-muted-foreground">
                Preencha os dados abaixo. Confirmaremos seu agendamento por e-mail.
              </p>
            </Reveal>

            {scheduled ? (
              <Reveal>
                <div className="mt-10 rounded-2xl border-2 border-success bg-white p-8 text-center shadow-md">
                  <div className="text-4xl">🎉</div>
                  <h3 className="mt-3 text-xl font-bold text-navy">Solicitação enviada!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Aguarde a confirmação por e-mail.
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <form
                  onSubmit={handleScheduleSubmit}
                  className="mt-10 grid gap-5 rounded-2xl border border-border bg-white p-6 shadow-lg sm:p-8"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nome completo" required>
                      <input
                        required
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="E-mail" required>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Telefone" required>
                      <input
                        required
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Instituição" required>
                      <input
                        required
                        value={form.instituicao}
                        onChange={(e) => setForm({ ...form, instituicao: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Número de visitantes" required>
                      <input
                        type="number"
                        min={1}
                        required
                        value={form.numeroVisitantes}
                        onChange={(e) => setForm({ ...form, numeroVisitantes: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Data da visita" required>
                      <input
                        type="date"
                        required
                        value={form.data}
                        onChange={(e) => setForm({ ...form, data: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Horário" required>
                      <input
                        type="time"
                        required
                        value={form.horario}
                        onChange={(e) => setForm({ ...form, horario: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Motivo da visita" required>
                      <input
                        required
                        value={form.motivo}
                        onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Nome do anfitrião (host)" required>
                      <input
                        required
                        value={form.hostNome}
                        onChange={(e) => setForm({ ...form, hostNome: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="E-mail do anfitrião" required>
                      <input
                        type="email"
                        required
                        value={form.hostEmail}
                        onChange={(e) => setForm({ ...form, hostEmail: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <Field label="Foto da vestimenta completa" required>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Tire uma foto mostrando sua roupa completa para validação de segurança
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      required
                      onChange={handleFotoChange}
                      className="block w-full text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navy-foreground hover:file:bg-orange hover:file:text-orange-foreground"
                    />
                    {fotoPreview && (
                      <img
                        src={fotoPreview}
                        alt="Pré-visualização da vestimenta"
                        className="mt-3 max-h-64 rounded-lg border-2 border-orange object-contain"
                      />
                    )}
                  </Field>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-lg bg-navy px-6 py-3 font-semibold text-navy-foreground transition hover:bg-orange hover:text-orange-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:justify-self-end"
                  >
                    {submitting ? "Analisando vestimenta com IA..." : "Enviar solicitação"}
                  </button>
                </form>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-navy bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-white">
          Projeto desenvolvido para fins educativos na KODIE Academy
        </div>
      </footer>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy">
        {label} {required && <span className="text-orange">*</span>}
      </span>
      {children}
    </label>
  );
}
