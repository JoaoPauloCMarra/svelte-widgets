!(function (win, doc) {
  const assetServer = "http://localhost:5000";
  let clientParams =
    win.SvelteWidgets && win.SvelteWidgets.params
      ? win.SvelteWidgets.params
      : {};

  const onInitialized = () => {
    try {
      const locationSearch = location.search.substring(1);
      let query = {};
      if (locationSearch) {
        query = JSON.parse(
          `{"${locationSearch.replace(/&/g, '","').replace(/=/g, '":"')}"}`,
          (key, value) => (key === "" ? value : decodeURIComponent(value))
        );
      }

      if (!Array.isArray(clientParams)) {
        clientParams = [clientParams];
      }

      for (let i = 0; i < clientParams.length; i++) {
        const params = clientParams[i];
        const widgetParams = {
          id: query.id || params.id,
          token: query.token || params.token,
          widget: query.widget || params.widget,
          language: query.language || params.language || "en",
        };
        win.SvelteWidgets.initiate(widgetParams);
      }
    } catch (error) {
      console.log("Svelte-Widgets Loader Error:");
      console.log(error);
    }
  };

  const onCssLoaded = () => {
    if (!doc.getElementById(scriptId)) {
      script = doc.createElement("script");
      script.id = scriptId;
      script.crossOrigin = true;
      script.type = "text/javascript";
      script.onload = onInitialized;
      script.src = `${assetServer}/build/bundle.js`;
      doc.body.appendChild(script);
    }
  };

  let id = "svelte-widgets-asset";
  let script,
    style,
    scriptId = `${id}-js`,
    styleId = `${id}-css`;
  if (!doc.getElementById(styleId)) {
    style = doc.createElement("link");
    style.id = styleId;
    style.crossOrigin = true;
    style.onload = onCssLoaded;
    style.rel = "stylesheet";
    style.href = `${assetServer}/build/bundle.css`;
    doc.body.appendChild(style);
  }
})(window, document);
