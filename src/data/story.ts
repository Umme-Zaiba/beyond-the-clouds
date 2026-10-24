/**
 * The scroll-first journey. Each chapter is one scene, and every fact in `story` is fair game for
 * the lore trials that come after it, so reading is rewarded.
 */
export interface Chapter {
  id: 'ascent' | 'whale' | 'isle' | 'crescent' | 'arch' | 'court' | 'gate';
  kicker: string;
  title: string;
  story: string[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'ascent',
    kicker: 'Prologue',
    title: 'Beyond the Clouds',
    story: ['Below the cloud line there is only the ordinary world. Above it, there is everything else. Take up your sword and rise.'],
  },
  {
    id: 'whale',
    kicker: 'I · The Sea of Clouds',
    title: 'A whale of white mist',
    story: [
      'At dawn the clouds become a sea, and in that sea swims a whale made of white mist. It has been travelling toward the sunrise for a thousand years.',
      'Travellers who catch sight of it say they are going the right way. Nobody has ever seen it turn back.',
    ],
  },
  {
    id: 'isle',
    kicker: 'II · The Floating Isle',
    title: 'The maple that never fades',
    story: [
      'One small isle drifts alone through the sky, carrying a single maple tree. Its leaves are red in every season.',
      'The keeper, a retired sword-saint, sweeps up the fallen leaves each evening. He never finishes, and he has stopped minding.',
    ],
  },
  {
    id: 'crescent',
    kicker: 'III · The Crescent Gate',
    title: 'A moon that does not set',
    story: [
      'A crescent moon hangs over the road and never sets. Orchids wind along its horn.',
      'Anyone who passes beneath it must set down every grudge they carry, because the moon weighs them all, and it is quite honest about the total.',
    ],
  },
  {
    id: 'arch',
    kicker: 'IV · The Flower Arch',
    title: 'Tea instead of steel',
    story: [
      'Past the moon, an arch of roses opens into a garden where white silk hangs without any wind.',
      'The sects settle their disputes here over tea. The rule is simple: the first to put down their cup has lost, and nobody has ever lost loudly.',
    ],
  },
  {
    id: 'court',
    kicker: 'V · The Golden Court',
    title: 'Lanterns lit by hand',
    story: [
      'Across the last bank of cloud stands the golden court, built on a floating plateau of pale stone.',
      'Its lanterns are lit by hand each dusk by apprentices who are not allowed to hurry. The oldest lantern has been lit by sixty different hands.',
    ],
  },
  {
    id: 'gate',
    kicker: 'VI · The Trial Gate',
    title: 'One sword, planted',
    story: [
      'At the end of the road stands a gate, and in front of it a single sword planted in the stone. It is not a weapon. It is a question.',
      'The question is: who are you when nobody is watching? The trials begin here.',
    ],
  },
];
