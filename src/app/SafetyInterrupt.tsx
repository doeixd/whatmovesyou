import { For, Show } from "solid-js";
import { SAFETY } from "../data/copy";

interface Props {
  resourceSet: string;
  onContinue: () => void;
  onExit: () => void;
}

/**
 * Fires the moment a risk item is answered above its threshold — never deferred
 * to the results page, never dismissible by clicking outside. See
 * research/SPEC-v1.md §8; this is the one non-negotiable in the product.
 */
export function SafetyInterrupt(props: Props) {
  const block = () => SAFETY[props.resourceSet];

  return (
    <div class="safety-backdrop" role="dialog" aria-modal="true" aria-labelledby="safety-title">
      <div class="safety">
        <h2 id="safety-title">{block().trigger_title}</h2>
        <p class="safety-body">{block().trigger_body}</p>

        <ul class="resources">
          <For each={block().resources ?? []} keyed={false}>
            {r => (
              <li>
                <a href={r().url} target="_blank" rel="noreferrer noopener">
                  {r().name}
                </a>
                <span class="resource-contact">{r().contact}</span>
                <span class="resource-region">{r().region}</span>
              </li>
            )}
          </For>
        </ul>

        <Show when={block().footer}>
          <p class="safety-footer">{block().footer}</p>
        </Show>

        <div class="safety-actions">
          <button type="button" class="btn" onClick={props.onExit}>
            {block().exit_label ?? "Stop here"}
          </button>
          <button type="button" class="btn btn-primary" onClick={props.onContinue}>
            {block().continue_label ?? "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
