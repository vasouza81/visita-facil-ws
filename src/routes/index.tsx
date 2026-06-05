import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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
  const [scheduled, setScheduled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const correctCount = useMemo(
    () => answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0), 0),
    [answers]
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
    if (answers.some((a) => a === null)) return;
  };

  const resetQuiz = () => {
    setAnswers([null, null, null]);
    setSubmittedQuiz(false);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduled(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-navy text-navy-foreground shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange font-bold text-orange-foreground">
              WS
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight sm:text-lg">Wilson Sons</h1>
              <p className="text-xs text-white/80">Agendamento de Visitas</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#processo" className="hover:text-orange">Processo</a>
            <a href="#epi" className="hover:text-orange">Segurança</a>
            <a href="#video" className="hover:text-orange">Vídeo</a>
            <a href="#quiz" className="hover:text-orange">Quiz</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-[#001a4d] text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-orange/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange">
              Bem-vindo
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              Agende sua visita com segurança em 3 passos
            </h2>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Para garantir uma visita tranquila aos nossos terminais e estaleiros, siga as orientações e conclua o processo de segurança abaixo.
            </p>
          </div>

          <div id="processo" className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { n: 1, t: "Leia as regras de EPI", d: "Conheça os equipamentos obrigatórios para acesso." },
              { n: 2, t: "Assista ao vídeo", d: "Orientações oficiais de segurança Wilson Sons." },
              { n: 3, t: "Faça o quiz e agende", d: "Acerte todas as perguntas para liberar o agendamento." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-orange/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-lg font-bold text-orange-foreground">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-white/75">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EPI rules */}
      <section id="epi" className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange">Segurança em primeiro lugar</span>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Regras de EPI obrigatórias</h2>
            <p className="mt-3 text-muted-foreground">
              Todo visitante deve utilizar os Equipamentos de Proteção Individual abaixo durante toda a permanência nas áreas operacionais.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: "🪖", t: "Capacete de segurança", d: "Obrigatório em todas as áreas operacionais e de movimentação de cargas." },
              { i: "🥽", t: "Óculos de proteção", d: "Proteção ocular contra partículas, respingos e poeira." },
              { i: "🦺", t: "Colete refletivo", d: "Visibilidade obrigatória junto a equipamentos e veículos em movimento." },
              { i: "🥾", t: "Calçado de segurança", d: "Botina com biqueira de aço para proteção dos pés." },
              { i: "🧤", t: "Luvas (quando exigido)", d: "Conforme orientação do anfitrião e área visitada." },
              { i: "🎧", t: "Protetor auricular", d: "Em áreas com ruído elevado sinalizadas." },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange hover:shadow-md"
              >
                <div className="text-3xl">{item.i}</div>
                <h3 className="mt-3 font-semibold text-navy">{item.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border-l-4 border-orange bg-card p-5 shadow-sm">
            <p className="text-sm text-foreground">
              <strong className="text-navy">Importante:</strong> não é permitido portar câmeras, isqueiros ou objetos pessoais não autorizados nas áreas restritas. Siga sempre as instruções do anfitrião.
            </p>
          </div>
        </div>
      </section>

      {/* Video */}
      <section id="video" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange">Orientação em vídeo</span>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Assista antes de agendar</h2>
            <p className="mt-3 text-muted-foreground">
              Vídeo de integração com as principais orientações de segurança para visitantes.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Vídeo de segurança Wilson Sons"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="bg-secondary">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange">Etapa final</span>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Quiz de segurança</h2>
            <p className="mt-3 text-muted-foreground">
              Responda corretamente as 3 perguntas para liberar o formulário de agendamento.
            </p>
          </div>

          <form onSubmit={handleQuizSubmit} className="mt-10 space-y-6">
            {QUESTIONS.map((q, qIdx) => {
              const selected = answers[qIdx];
              const isWrong = submittedQuiz && selected !== q.answer;
              return (
                <div
                  key={qIdx}
                  className={`rounded-xl border bg-card p-6 shadow-sm ${
                    submittedQuiz ? (isWrong ? "border-destructive" : "border-orange") : "border-border"
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
                </div>
              );
            })}

            {!approved && (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-orange px-6 py-3 font-semibold text-orange-foreground shadow-sm transition hover:opacity-90 sm:w-auto"
                >
                  Verificar respostas
                </button>
                {submittedQuiz && (
                  <p className="text-sm text-destructive">
                    Você acertou {correctCount} de {QUESTIONS.length}.{" "}
                    <button type="button" onClick={resetQuiz} className="underline">
                      Tentar novamente
                    </button>
                  </p>
                )}
              </div>
            )}

            {approved && (
              <div className="rounded-xl border border-orange bg-orange/10 p-5 text-center">
                <p className="font-semibold text-navy">✅ Aprovado! Você pode agendar sua visita abaixo.</p>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Scheduling form */}
      {approved && (
        <section id="agendar" className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange">Agendamento</span>
              <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">Solicite sua visita</h2>
              <p className="mt-3 text-muted-foreground">
                Preencha os dados abaixo. Confirmaremos seu agendamento por e-mail.
              </p>
            </div>

            {scheduled ? (
              <div className="mt-10 rounded-2xl border border-orange bg-card p-8 text-center shadow-md">
                <div className="text-4xl">🎉</div>
                <h3 className="mt-3 text-xl font-bold text-navy">Solicitação enviada!</h3>
                <p className="mt-2 text-muted-foreground">
                  Obrigado, <strong>{form.nome}</strong>. Você receberá a confirmação em <strong>{form.email}</strong>.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleScheduleSubmit}
                className="mt-10 grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
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
                  <Field label="Documento (RG/CPF)" required>
                    <input
                      required
                      value={form.documento}
                      onChange={(e) => setForm({ ...form, documento: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Empresa" required>
                    <input
                      required
                      value={form.empresa}
                      onChange={(e) => setForm({ ...form, empresa: e.target.value })}
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
                  <Field label="Data da visita" required>
                    <input
                      type="date"
                      required
                      value={form.data}
                      onChange={(e) => setForm({ ...form, data: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Unidade Wilson Sons" required>
                    <select
                      required
                      value={form.motivo}
                      onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Selecione...</option>
                      <option>Terminal Tecon Rio Grande</option>
                      <option>Terminal Tecon Salvador</option>
                      <option>Estaleiro Guarujá</option>
                      <option>Sede Rio de Janeiro</option>
                    </select>
                  </Field>
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-navy px-6 py-3 font-semibold text-navy-foreground transition hover:opacity-90 sm:w-auto sm:justify-self-end"
                >
                  Enviar solicitação
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-white/80">
          Projeto desenvolvido para fins educativos na KODIE Academy
        </div>
      </footer>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20";

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
      <span className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-orange">*</span>}
      </span>
      {children}
    </label>
  );
}
