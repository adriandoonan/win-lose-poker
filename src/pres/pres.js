import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import Notes from 'reveal.js/plugin/notes/notes.esm.js'
import RevealMermaid from 'reveal.js-mermaid-plugin/plugin/mermaid/mermaid.esm.js'


let deck = new Reveal({
   plugins: [ Markdown, Notes, Highlight, RevealMermaid ]
})
deck.initialize();