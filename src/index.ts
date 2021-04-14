import App from './App.svelte'

import './styles/global.scss'

const initiate = (props: WidgetParams) => {
  const { id, token } = props
  const rootEl = document.getElementById(id)

  if (!rootEl) {
    console.error('Error: ', `element with id '${id}' not found`)
    return
  }

  new App({
    target: rootEl,
    props,
  })

  let theme = 'theme-default'
  switch (token) {
    case 'demotoken1':
      theme = 'theme1'
      break
    case 'demotoken2':
      theme = 'theme2'
      break
    case 'demotoken3':
      theme = 'theme3'
      break
    default:
      break
  }

  rootEl.className = `svelte-widgets ${theme}`
}

window.SvelteWidgets = { initiate }

export default {}
