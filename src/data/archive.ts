import type { ArchiveEntry, Artifact, Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    kind: 'character',
    id: 'lian-qiaoyue',
    name: 'Lian Qiaoyue',
    title: 'The Mist Cartographer',
    realm: 'cloudsea',
    provenance: 'original',
    spoiler: 1,
    blurb: 'Redraws the sky every season, and trusts no map she has not corrected herself.',
    story: [
      'Qiaoyue keeps the ledger on the Terrace and draws its maps. Her charts of the cloud line are the only ones that stay accurate for more than a month, which is why three different courts have tried to hire her and she has politely declined all of them.',
      'She is dry, exact and difficult to read. The visitors who remember her best are the ones she corrected, kindly, about where they actually were.',
    ],
    secret:
      'Her maps do not only chart the Terrace. Buried in the contour lines is a single route home to the fallen Moon Court, whose last heir she is. She has never walked it.',
    relations: [
      { id: 'yun-zhe', kind: 'Mentor' },
      { id: 'ye-xuanlin', kind: 'Rival' },
      { id: 'mistveil-fan', kind: 'Bears' },
    ],
    artifact: 'mistveil-fan',
  },
  {
    kind: 'character',
    id: 'yun-zhe',
    name: 'Elder Yun Zhe',
    title: 'The Tea-Pavilion Hermit',
    realm: 'cloudsea',
    provenance: 'original',
    spoiler: 1,
    blurb: 'Once a sword immortal. Now pours tea for challengers and never lets one finish a bow.',
    story: [
      'The pavilion keeper has outlasted four tournaments and refuses all talk of a fifth. He pours for everyone who climbs, in the same order, with the same slight tilt of the pot. Those who ask about the sword get a second cup.',
      'He is the reason nobody draws steel on the Terrace. The rule is not written anywhere; he simply looks at the weapon, then at its owner, and the weapon goes back into its sheath.',
    ],
    secret:
      'Dawnsunder is sealed under the pavilion floor, below the third board from the door. He has not touched it in thirty years, and walks around that board every morning.',
    relations: [
      { id: 'lian-qiaoyue', kind: 'Student' },
      { id: 'gu-heng', kind: 'Old friend' },
      { id: 'dawnsunder', kind: 'Guards' },
    ],
    artifact: 'dawnsunder',
  },
  {
    kind: 'character',
    id: 'fei-lan',
    name: 'Fei Lan',
    title: 'The Stormcourier',
    realm: 'jade',
    provenance: 'original',
    spoiler: 0,
    blurb: 'Carries letters between realms that are officially not speaking to each other.',
    story: [
      'Fei Lan rides the high wind lanes on a board of stormglass and delivers what nobody else will carry: apologies, proposals, warnings, one very long recipe.',
      'She is in the Hollow more than anywhere, because the jade hums her messages back to her and she likes to check her own diction.',
    ],
    secret: 'She reads every letter. She has never lied to a sender about it, and nobody has ever asked.',
    relations: [
      { id: 'bai-ruoshui', kind: 'Confidante' },
      { id: 'lian-qiaoyue', kind: 'Regular client' },
    ],
  },
  {
    kind: 'character',
    id: 'bai-ruoshui',
    name: 'Bai Ruoshui',
    title: 'Herbalist of the Hollow',
    realm: 'jade',
    provenance: 'original',
    spoiler: 1,
    blurb: 'Keeps cures as songs, and has never written down a single one.',
    story: [
      'Ruoshui hums to the walls of the Hollow every morning, and every morning the Hollow hums back a little better than she gave it. She is the closest thing the valley has to a record keeper.',
      'Patients leave with a tune. The ones who forget it come back, and are never charged twice.',
    ],
    secret:
      'One of her songs has no cure attached at all. It is a warning, and she hums it only when she is alone, in a key that makes the stone go quiet.',
    relations: [
      { id: 'fei-lan', kind: 'Confidante' },
      { id: 'lantern-of-return', kind: 'Bears' },
    ],
    artifact: 'lantern-of-return',
  },
  {
    kind: 'character',
    id: 'gu-heng',
    name: 'Gu Heng',
    title: 'The Ashen Smith',
    realm: 'ember',
    provenance: 'original',
    spoiler: 2,
    blurb: 'Speaks only through the weight of a hammer. Has never needed another language.',
    story: [
      'Gu Heng has not spoken in the Crater for as long as anyone there can recall. He answers questions by forging, and the customers who understand him are the ones who return.',
      'His apprentices say he can hear whether a blade will break before the fire finishes with it.',
    ],
    secret:
      'He forged Dawnsunder, and its twin, and sealed the twin inside the Emberheart Seal because he did not trust what he had made.',
    relations: [
      { id: 'yun-zhe', kind: 'Old friend' },
      { id: 'ye-xuanlin', kind: 'Patron, grudgingly' },
      { id: 'emberheart-seal', kind: 'Made' },
    ],
    artifact: 'emberheart-seal',
  },
  {
    kind: 'character',
    id: 'ye-xuanlin',
    name: 'Ye Xuanlin',
    title: 'Heir of the Ember Court',
    realm: 'ember',
    provenance: 'original',
    spoiler: 1,
    blurb: 'Proud, precise, and quietly afraid of being only as good as the forge that made him.',
    story: [
      'Xuanlin has been told since childhood that he is the Court’s best blade, and he has believed it so completely that he is quite unprepared for the day someone proves otherwise.',
      'He carries the Ashfall Spear everywhere, even to tea.',
    ],
    secret:
      'He has twice lost a duel in private and told no one. He trains harder after each, and the Court has taken the improvement for natural talent.',
    relations: [
      { id: 'lian-qiaoyue', kind: 'Rival' },
      { id: 'gu-heng', kind: 'Smith' },
      { id: 'ashfall-spear', kind: 'Bears' },
    ],
    artifact: 'ashfall-spear',
  },
];

export const ARTIFACTS: Artifact[] = [
  {
    kind: 'artifact',
    id: 'dawnsunder',
    name: 'Dawnsunder',
    title: 'The Sealed Skyward Sword',
    realm: 'cloudsea',
    provenance: 'original',
    spoiler: 1,
    affinity: 'wind',
    shape: 'sword',
    blurb: 'A blade that has not seen daylight in thirty years, and misses it.',
    story: [
      'Dawnsunder was forged to cut the horizon in two, a boast that turned out to be nearly literal. It is quiet now, wrapped and sealed, but the pavilion’s tea goes cold whenever someone walks too near the third board.',
    ],
    secret: 'Its twin is not lost. It is merely sleeping inside something else.',
    bearer: 'yun-zhe',
  },
  {
    kind: 'artifact',
    id: 'mistveil-fan',
    name: 'Mistveil Fan',
    title: 'The Cartographer’s Fan',
    realm: 'cloudsea',
    provenance: 'original',
    spoiler: 0,
    affinity: 'ice',
    shape: 'fan',
    blurb: 'Drawn and closed in one motion. It has never been seen fully open.',
    story: [
      'Each rib carries a single line of a map, and the lines only join when the fan is opened at the right angle in the right light. Qiaoyue has only ever shown it half-open.',
    ],
    secret: 'Opened fully under moonlight, the ribs form the route to the Moon Court.',
    bearer: 'lian-qiaoyue',
  },
  {
    kind: 'artifact',
    id: 'lantern-of-return',
    name: 'Lantern of Return',
    title: 'The Hollow’s Light',
    realm: 'jade',
    provenance: 'original',
    spoiler: 0,
    affinity: 'wind',
    shape: 'lantern',
    blurb: 'Lights only for the people who intend to come back.',
    story: [
      'Hung at the Hollow’s mouth, the lantern burns pale green when a traveller means to return and goes dark when they do not. The healers have long since stopped arguing with it.',
    ],
    secret: 'It has gone dark exactly once for someone who did return. Nobody has been able to explain why.',
    bearer: 'bai-ruoshui',
  },
  {
    kind: 'artifact',
    id: 'ashfall-spear',
    name: 'Ashfall Spear',
    title: 'The Court’s Cloudpiercer',
    realm: 'ember',
    provenance: 'original',
    spoiler: 0,
    affinity: 'flame',
    shape: 'spear',
    blurb: 'The head glows faintly even when cold, like something remembering a fire.',
    story: [
      'Forged for the Court’s heir from the first coal of a decade, the Ashfall Spear is said to find its mark in the dark. Xuanlin insists that it is simply well balanced.',
    ],
    secret: 'It has never been tested against a weapon forged by the same hand. It might not survive the experience.',
    bearer: 'ye-xuanlin',
  },
  {
    kind: 'artifact',
    id: 'emberheart-seal',
    name: 'Emberheart Seal',
    title: 'The Smith’s Silence',
    realm: 'ember',
    provenance: 'original',
    spoiler: 2,
    affinity: 'flame',
    shape: 'seal',
    blurb: 'A small black seal, warm to the touch at midnight.',
    story: [
      'The seal sits on Gu Heng’s bench between a pair of tongs and a cup of cold tea. He has never explained it, and the Court has learned not to ask.',
    ],
    secret: 'Break it, and what is inside will have been waiting to be asked a very particular question.',
    bearer: 'gu-heng',
  },
];

export const ARCHIVE: ArchiveEntry[] = [...CHARACTERS, ...ARTIFACTS];

export const ARCHIVE_BY_ID: Record<string, ArchiveEntry> = Object.fromEntries(ARCHIVE.map((e) => [e.id, e]));
