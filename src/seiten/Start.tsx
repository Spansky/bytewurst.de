import Einstieg from '../sections/start/Einstieg'
import Einwaende from '../sections/start/Einwaende'
import Frueher from '../sections/start/Frueher'
import Kassenzettel from '../sections/start/Kassenzettel'
import Nacht from '../sections/start/Nacht'
import Pinnwand from '../sections/start/Pinnwand'
import Planspiel from '../sections/start/Planspiel'
import PreisTeaser from '../sections/start/PreisTeaser'
import Schluss from '../sections/start/Schluss'
import Wahrheitstest from '../sections/start/Wahrheitstest'

export default function Start() {
  return (
    <>
      <Einstieg />
      <Pinnwand />
      <Planspiel />
      <Wahrheitstest />
      <Nacht />
      <Einwaende />
      <Frueher />
      <Kassenzettel />
      <PreisTeaser />
      <Schluss />
    </>
  )
}
