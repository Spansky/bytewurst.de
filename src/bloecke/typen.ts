import type { BlockComponentProps } from 'emdash/ui'
import type { PageInhaltBlock } from '../../emdash-env'

/*
  Jeder Abschnitt einer CMS-Seite ist ein EmDash-Block. Die Felder je Typ
  stehen in seed/seed.json (blockTypes), die Typen erzeugt EmDash beim
  Start des Entwicklungsservers in emdash-env.d.ts.
*/
export type BlockTyp = PageInhaltBlock['_type']
export type BlockProps<T extends BlockTyp> = BlockComponentProps<Extract<PageInhaltBlock, { _type: T }>>
