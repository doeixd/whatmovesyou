import { For, Match, Show, Switch, onSettled } from "solid-js";
import { FRAMING } from "../data/copy";
import { TOTAL_ITEMS } from "../data/bank";
import { ItemScreen } from "./ItemScreen";
import { Results } from "./Results";
import { SafetyInterrupt } from "./SafetyInterrupt";
import { createSession } from "./session";

export function Assessment() {
  const s = createSession();

  // onSettled, not onMount: restore a saved draft once the view has settled.
  onSettled(() => {
    s.restore();
  });

  const exitToSafety = () => {
    s.dismissSafety();
    window.location.href = "/";
  };

  return (
    <main class="app">
      <Show when={s.safetyPrompt()}>
        {resourceSet => (
          <SafetyInterrupt
            resourceSet={resourceSet()}
            onContinue={s.dismissSafety}
            onExit={exitToSafety}
          />
        )}
      </Show>

      <Switch>
        <Match when={s.view() === "intro"}>
          <section class="screen intro">
            <h1>Before you start</h1>
            <For each={FRAMING.before_start.body} keyed={false}>
              {line => <p>{line()}</p>}
            </For>

            <p class="count">
              {TOTAL_ITEMS} questions, 11 pages. Nothing is sent anywhere — your answers stay on
              this device.
            </p>

            <Show when={s.resumed() && s.answeredCount() > 0}>
              <p class="resumed">
                {s.complete()
                  ? "You finished this last time. Your answers are still on this device."
                  : `You have ${s.answeredCount()} answers saved from last time.`}
              </p>
            </Show>

            <div class="intro-actions">
              {/* A finished run leads with its results — there is nothing left to
                  continue, and re-answering 65 questions to see them again would
                  be a strange thing to ask. */}
              <Show
                when={s.complete()}
                fallback={
                  <button type="button" class="btn btn-primary" onClick={() => s.start()}>
                    {s.answeredCount() > 0 ? "Continue where you left off" : "Start"}
                  </button>
                }
              >
                <button type="button" class="btn btn-primary" onClick={s.showResults}>
                  Show my results
                </button>
                <button type="button" class="btn" onClick={() => s.start()}>
                  Review my answers
                </button>
              </Show>
              <Show when={s.answeredCount() > 0}>
                <button type="button" class="btn" onClick={() => s.start(true)}>
                  Start over
                </button>
              </Show>
            </div>

            <details class="what-isnt-fold">
              <summary>{FRAMING.what_this_isnt.title}</summary>
              <For each={FRAMING.what_this_isnt.body} keyed={false}>
                {line => <p>{stripBold(line())}</p>}
              </For>
            </details>
          </section>
        </Match>

        <Match when={s.view() === "items"}>
          <ItemScreen
            items={s.currentItems()}
            answers={s.answers}
            flagged={s.flagged}
            page={s.page()}
            totalPages={s.totalPages}
            remainingSeconds={s.remainingSeconds()}
            canContinue={s.pageComplete()}
            isLast={s.isLastPage()}
            onAnswer={s.answer}
            onFlag={s.flagItem}
            onNext={s.next}
            onBack={s.back}
          />
        </Match>

        <Match when={s.view() === "results"}>
          <Results result={s.result()} onRestart={s.restart} />
        </Match>
      </Switch>
    </main>
  );
}

function stripBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}
