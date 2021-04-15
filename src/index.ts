import './styles/global.scss';

import App from './App.svelte';

const renderWidget = ({ id, ...props }: WidgetParams) => {
  const rootEl = document.getElementById(id);

  if (!rootEl) {
    console.error('Error: ', `element with id '${id}' not found`);
    return;
  }

  const { token, widget, language } = props;

  new App({
    target: rootEl,
    props: {
      rootEl,
      token,
      widget,
      language,
    },
  });
};

const initiate = (params: WidgetParams | WidgetParams[]) => {
  if (Array.isArray(params)) {
    params.forEach((item): void => {
      void renderWidget(item);
    });
  } else {
    void renderWidget(params);
  }
};

window.SvelteWidgets = { initiate };

export default {};
