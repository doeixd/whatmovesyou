import { For, Show, createEffect, createMemo, flush } from "solid-js";
import { RESPONSE_SCALES, type Item, type ItemId } from "../data/bank";
import type { AnswerValue } from "../lib/scoring";
import { advanceAfter } from "./advance";

interface ItemCardProps {
  item: Item;
  index: number;
  value: AnswerValue | undefined;
  flagged: boolean;
  onAnswer: (id: ItemId, value: AnswerValue) => void;
  onFlag: (id: ItemId) => void;
}

/**
 * One item with a real radiogroup. Not styled divs: screen readers and keyboard
 * users get the native semantics, and 1–5 keys work because the inputs are real.
 */
function ItemCard(props: ItemCardProps) {
  const scale = createMemo(() => RESPONSE_SCALES[props.item.responseScaleId]);

  return (
    <fieldset class="item" data-item={props.item.id}>
      <legend class="item-text">
        <span class="item-number" aria-hidden="true">
          {props.index + 1}
        </span>
        {props.item.text}
      </legend>

      <div class="options" role="radiogroup" aria-label={props.item.text}>
        <For each={scale().options} keyed={false}>
          {option => {
            const id = () => `${props.item.id}-${option().value}`;
            return (
              <label class={["option", props.value === option().value && "selected"]}>
                <input
                  type="radio"
                  id={id()}
                  name={props.item.id}
                  value={option().value}
                  checked={props.value === option().value}
                  onChange={() => props.onAnswer(props.item.id, option().value)}
                />
                <span class="option-label">{option().label}</span>
              </label>
            );
          }}
        </For>

        <Show when={scale().allowNotApplicable}>
          <label class={["option", "option-na", props.value === "na" && "selected"]}>
            <input
              type="radio"
              name={props.item.id}
              checked={props.value === "na"}
              onChange={() => props.onAnswer(props.item.id, "na")}
            />
            <span class="option-label">{scale().notApplicableLabel}</span>
          </label>
        </Show>
      </div>

      <div class="item-foot">
        <Show
          when={!props.flagged}
          fallback={<span class="flagged">Noted — thanks.</span>}
        >
          <button type="button" class="flag" onClick={() => props.onFlag(props.item.id)}>
            This question is unclear
          </button>
        </Show>
      </div>
    </fieldset>
  );
}

interface ItemScreenProps {
  items: readonly Item[];
  answers: Partial<Record<ItemId, AnswerValue>>;
  flagged: Partial<Record<ItemId, true>>;
  page: number;
  totalPages: number;
  remainingSeconds: number;
  canContinue: boolean;
  isLast: boolean;
  onAnswer: (id: ItemId, value: AnswerValue) => void;
  onFlag: (id: ItemId) => void;
  onNext: () => void;
  onBack: () => void;
}

const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ItemScreen(props: ItemScreenProps) {
  const minutes = createMemo(() => Math.max(1, Math.round(props.remainingSeconds / 60)));
  const timeframe = createMemo(() => props.items[0]?.timeframe);

  /**
   * Position the view whenever the page changes.
   *
   * A fresh page starts at the top. A partly-answered one — which is what you
   * get when resuming a saved draft — jumps to the first question still
   * waiting, so you pick up exactly where you stopped rather than hunting for
   * it. Instant in both cases: animating a page change just delays reading.
   *
   * The compute half tracks only `page`, so answering a question doesn't
   * re-run this; the reads inside the apply half are deliberately untracked.
   */
  createEffect(
    () => props.page,
    () => {
      const firstUnanswered = props.items.find(i => props.answers[i.id] == null);
      const anyAnswered = props.items.some(i => props.answers[i.id] != null);

      if (firstUnanswered && anyAnswered) {
        document
          .querySelector(`[data-item="${firstUnanswered.id}"]`)
          ?.scrollIntoView({ behavior: "instant", block: "center" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  );

  /**
   * After answering, move the view on — one step only, and only when the
   * question after this one is the one still waiting. Correcting an earlier
   * answer never scrolls. Nothing auto-advances between pages — APP-PLAN.md §6.
   */
  const answerAndAdvance = (id: ItemId, value: AnswerValue) => {
    const wasUnanswered = props.answers[id] == null;
    props.onAnswer(id, value);
    if (!wasUnanswered) return;

    const behavior = prefersReducedMotion() ? "instant" : "smooth";

    // Solid batches writes to a microtask, so the answered option hasn't been
    // marked in the DOM yet. flush() settles it synchronously — rAF would also
    // work in a focused tab, but it never fires in a background one, which made
    // this look broken under test.
    flush();

    const advance = advanceAfter(id, props.items, props.answers);
    const target =
      advance.kind === "nav"
        ? document.querySelector(".page-nav")
        : advance.kind === "item"
          ? document.querySelector(`[data-item="${advance.id}"]`)
          : null;
    target?.scrollIntoView({ behavior, block: "center" });
  };

  return (
    <section class="screen" aria-labelledby="page-heading">
      <header class="page-head">
        <p class="progress" id="page-heading">
          <span>
            Page {props.page + 1} of {props.totalPages}
          </span>
          <span class="dot" aria-hidden="true">
            ·
          </span>
          <span>about {minutes()} min left</span>
        </p>
        <div
          class="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={props.totalPages}
          aria-valuenow={props.page + 1}
        >
          <div class="progress-fill" style={{ width: `${((props.page + 1) / props.totalPages) * 100}%` }} />
        </div>
        <Show when={timeframe() === "past-2-weeks"}>
          <p class="timeframe-note">
            These last few are about <strong>the past two weeks</strong>, not how you generally are.
          </p>
        </Show>
      </header>

      <div class="items">
        <For each={props.items} keyed={false}>
          {(item, i) => (
            <ItemCard
              item={item()}
              index={props.page * 6 + i}
              value={props.answers[item().id]}
              flagged={Boolean(props.flagged[item().id])}
              onAnswer={answerAndAdvance}
              onFlag={props.onFlag}
            />
          )}
        </For>
      </div>

      <nav class="page-nav">
        <button type="button" class="btn" onClick={props.onBack}>
          Back
        </button>
        <button
          type="button"
          class="btn btn-primary"
          disabled={!props.canContinue}
          onClick={props.onNext}
        >
          {props.isLast ? "See results" : "Continue"}
        </button>
      </nav>
      <Show when={!props.canContinue}>
        <p class="nav-hint">Answer all six to continue. There are no wrong answers.</p>
      </Show>
    </section>
  );
}
