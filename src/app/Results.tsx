import { For, Show, createMemo, createSignal } from "solid-js";
import { CITATIONS, SCALES_BY_ID, type ScaleId } from "../data/bank";
import { BANDS, ENTRIES, FRAMING, SAFETY } from "../data/copy";
import type { Result, ScaleScore } from "../lib/scoring";

const GRID_COPY: Record<Result["grid"], { title: string; body: string }> = {
  "elevated-low-impairment": {
    title: "A description, not a problem",
    body: "Some of your scores stand out, and you've reported little disruption. That combination reads as a description of how you're built — worth knowing, not worth fixing."
  },
  "elevated-high-impairment": {
    title: "Something here is costing you",
    body: "Some scores stand out and you've reported real disruption. That pairing is the one worth taking to someone — a GP or a therapist can work out whether the two are connected."
  },
  "typical-high-impairment": {
    title: FRAMING.unexplained_impairment.title,
    body: FRAMING.unexplained_impairment.body
  },
  "typical-low-impairment": {
    title: "An even profile",
    body: "Nothing stands out sharply and you've reported little disruption. A flat profile is a real result, not a failed one — it means no single trait dominates how you operate."
  }
};

const GRADE_LABEL: Record<string, string> = {
  strong: "Strong evidence",
  moderate: "Moderate evidence",
  preliminary: "Preliminary evidence",
  genetic: "Heritable, no chemical account",
  none: "No biological claim"
};

function EvidencePanel(props: { scaleId: ScaleId }) {
  const [open, setOpen] = createSignal(false);
  const scale = () => SCALES_BY_ID[props.scaleId];

  return (
    <div class="evidence">
      <button
        type="button"
        class="evidence-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open() ? "true" : "false"}
      >
        {open() ? "Hide" : "What research links this to"}
      </button>
      <Show when={open()}>
        <div class="evidence-body">
          <For each={scale().bodyLinks} keyed={false}>
            {link => (
              <div class="body-link">
                <p class="link-head">
                  <span class="system">{link().system}</span>
                  <span class={["grade", `grade-${link().grade}`]}>{GRADE_LABEL[link().grade]}</span>
                </p>
                <p class="mechanism">{link().mechanism}</p>
                <Show when={link().verification}>
                  {v => <p class="verification">{v()}</p>}
                </Show>
                <ul class="citations">
                  <For each={link().citations} keyed={false}>
                    {id => {
                      const c = () => CITATIONS[id()];
                      return (
                        <Show when={c()}>
                          {cite => (
                            <li>
                              <a href={cite().url} target="_blank" rel="noreferrer noopener">
                                {cite().title}
                              </a>
                              <span class="claim">{cite().claim}</span>
                            </li>
                          )}
                        </Show>
                      );
                    }}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

function ScaleCard(props: { score: ScaleScore }) {
  const scale = () => SCALES_BY_ID[props.score.scaleId];
  const cost = () => ENTRIES[scale().costId as keyof typeof ENTRIES];
  const upside = () => ENTRIES[scale().upsideId as keyof typeof ENTRIES];

  return (
    <article class="scale-card">
      <header>
        <h3>{props.score.name}</h3>
        <p class="poles">
          {scale().poles.low} <span aria-hidden="true">↔</span> {scale().poles.high}
        </p>
      </header>

      <Show
        when={props.score.reportable}
        fallback={<p class="band">{BANDS.insufficient}</p>}
      >
        <p class="band">{BANDS[props.score.band]}</p>

        {/* A dot on a centred track, never a filled bar: the centre tick is this
            person's own profile mean, so there is no reading of it as a
            percentile. `relative` is in their own SD units; ±2.5 covers the
            realistic range and is clamped so an outlier can't leave the track. */}
        <div
          class="track"
          role="img"
          aria-label={`${props.score.name}: ${BANDS[props.score.band].toLowerCase()}`}
        >
          <div class="track-line" />
          <div class="track-centre" />
          <div
            class="track-dot"
            style={{
              left: `${Math.min(96, Math.max(4, 50 + props.score.relative * 18))}%`
            }}
          />
        </div>
        <p class="track-ends" aria-hidden="true">
          <span>lower for you</span>
          <span>higher for you</span>
        </p>

        <Show when={props.score.caveats.includes("state-sensitive")}>
          <p class="caveat">
            This one moves with how your last few weeks have gone. Given the disruption you
            reported, it may be reading higher than usual — worth retaking in a couple of months.
          </p>
        </Show>

        <div class="cost-upside">
          <section>
            <h4>{cost().title}</h4>
            <p>{cost().body}</p>
          </section>
          <section>
            <h4>{upside().title}</h4>
            <p>{upside().body}</p>
          </section>
        </div>

        <EvidencePanel scaleId={props.score.scaleId} />
      </Show>
    </article>
  );
}

export function Results(props: { result: Result; onRestart: () => void }) {
  const grid = createMemo(() => GRID_COPY[props.result.grid]);
  const severe = createMemo(() => props.result.impairment.level === "severe");

  return (
    <section class="screen results">
      <header class="results-head">
        <h1>Your profile</h1>
        <p class="lede">{FRAMING.no_norms_notice.body}</p>
      </header>

      <Show when={severe()}>
        <aside class="severe">
          <h2>{SAFETY.severe_impairment.title}</h2>
          <p>{SAFETY.severe_impairment.body}</p>
        </aside>
      </Show>

      <section class="grid-cell">
        <h2>{grid().title}</h2>
        <p>{grid().body}</p>
      </section>

      <section class="profile">
        <h2>Where your scores sit relative to each other</h2>
        <For each={props.result.scales} keyed={false}>
          {score => <ScaleCard score={score()} />}
        </For>
      </section>

      <section class="what-this-isnt">
        <h2>{FRAMING.what_this_isnt.title}</h2>
        <For each={FRAMING.what_this_isnt.body} keyed={false}>
          {line => <p innerHTML={markdownBold(line())} />}
        </For>
      </section>

      <nav class="results-nav">
        <a class="btn" href="/about/braverman">
          How this compares to the Braverman test
        </a>
        <button type="button" class="btn" onClick={props.onRestart}>
          Start again
        </button>
      </nav>
    </section>
  );
}

/** The deck uses **bold** in a few places; nothing else is interpreted. */
function markdownBold(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
