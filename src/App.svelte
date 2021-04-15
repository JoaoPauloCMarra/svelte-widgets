<script lang="typescript">
  import { onDestroy } from 'svelte';
  import Store from './Store';
  import ListWidget from './widgets/ListWidget.svelte';
  import EmptyWidget from './widgets/EmptyWidget.svelte';
  import FormWidget from './widgets/FormWidget.svelte';
  import Error from './shared/Error.svelte';
  import Loading from './shared/Loading.svelte';

  export let rootEl: HTMLElement;
  export let token: string;
  export let widget: string;
  export let language: string;

  const store = new Store(token, widget, language);
  store.setup();

  const { loading, errorMsg, clientSettings } = store;
  if (clientSettings) {
    const settingsUnsub = clientSettings.subscribe(({ theme }) => {
      if (!rootEl) return;
      rootEl.className = `svelte-widgets ${theme ? theme : ''}`;
    });

    onDestroy(() => {
      settingsUnsub();
    });
  }

  const widgetList = {
    default: EmptyWidget,
    list: ListWidget,
    form: FormWidget,
  };
  const WidgetRenderer = widgetList[widget] || widgetList.default;
</script>

{#if $loading}
  <Loading />
{:else if $errorMsg.length > 0}
  <div class="center">
    <Error text={$errorMsg} />
  </div>
{:else}
  <div class="widget-wrapper center">
    <WidgetRenderer />
  </div>
{/if}
