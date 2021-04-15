import { get, writable, Writable } from 'svelte/store';
import { logError } from './utils/logger';

class Store {
  public token: Writable<string> = writable('');
  public widget: Writable<string> = writable('');
  public language: Writable<string> = writable('');
  public loading: Writable<boolean> = writable(true);
  public errorMsg: Writable<string> = writable('');
  public clientSettings: Writable<ClientSettings> = writable({});
  public locales: Writable<Locales> = writable({});

  constructor(token: string, widget: string, language: string) {
    this.token.set(token);
    this.widget.set(widget);
    this.language.set(language);
  }

  async fetchSettings(token: string): Promise<void> {
    let theme = 'theme-default';
    switch (token) {
      case 'demotoken1':
        theme = 'theme1';
        break;
      case 'demotoken2':
        theme = 'theme2';
        break;
      case 'demotoken3':
        theme = 'theme3';
        break;
      default:
        break;
    }
    await new Promise((r) => setTimeout(r, 1000));
    this.clientSettings.set({ theme });
  }

  async fetchLocales(language: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 1000));
    const allLocales = { en: { LIST: 'List', FORM: 'Form' } };
    const locales = allLocales[language] || allLocales.en;
    this.locales.set(locales);
  }

  translate(path: string, replaceKeys?: string[], replaceWith?: { [key: string]: string }): string {
    const locales = get(this.locales);
    if (!locales || locales) return '';

    let result = '';
    try {
      result = locales[path] || '';
      if (replaceKeys && replaceWith) {
        result = result.replace(
          new RegExp(`\\$${replaceKeys.join('\\$|\\$')}\\$`),
          (key: string): string => replaceWith[key] || '',
        );
      }
    } catch (error) {
      result = '';
    }
    return result;
  }

  async setup(): Promise<void> {
    this.loading.set(true);
    const token = get(this.token);
    const widget = get(this.widget);
    const language = get(this.language);

    if (!token || !widget) {
      const msg = `Invalid Token(${String(token)}) or Widget(${String(widget)})`;
      this.loading.set(false);
      this.errorMsg.set(msg);
      logError('Data setup error', msg);
      return;
    }

    await this.fetchSettings(token);
    await this.fetchLocales(language);

    this.loading.set(false);
  }
}

export const defaultStore = new Store('', '', '');

export default Store;
