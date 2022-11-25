import gfmPlugin from '@bytemd/plugin-gfm';
import highlightSsrPlugin from '@bytemd/plugin-highlight-ssr';
import mermaidPlugin from '@bytemd/plugin-mermaid';
import breaksPlugin from '@bytemd/plugin-breaks';
import gemojiPlugin from '@bytemd/plugin-gemoji';
import byteMDLocale from 'bytemd/locales/pt_BR.json';
import gfmLocale from '@bytemd/plugin-gfm/locales/pt_BR.json';
import mermaidLocale from '@bytemd/plugin-mermaid/locales/pt_BR.json';

const plugins = [
  gfmPlugin({ locale: gfmLocale }),
  highlightSsrPlugin(),
  mermaidPlugin({ locale: mermaidLocale }),
  breaksPlugin(),
  gemojiPlugin(),
];

export default plugins;
