export const SOURCE_POT_PX = 252;

export type Tier = {
  key: string;
  label: string;
  min: number;
  image: string;
  width: number;
  height: number;
};

export const TIERS: Tier[] = [
  {
    key: "sprout",
    label: "순진양파",
    min: 0,
    image: "/onion/stage-1.png",
    width: 586,
    height: 562,
  },
  {
    key: "budding",
    label: "삐죽양파",
    min: 20,
    image: "/onion/stage-2.png",
    width: 586,
    height: 562,
  },
  {
    key: "growing",
    label: "삐딱양파",
    min: 50,
    image: "/onion/stage-3.png",
    width: 586,
    height: 562,
  },
  {
    key: "leafy",
    label: "건방진양파",
    min: 90,
    image: "/onion/stage-4.png",
    width: 586,
    height: 562,
  },
  {
    key: "storm",
    label: "양아치양파",
    min: 140,
    image: "/onion/stage-5.png",
    width: 586,
    height: 562,
  },
  {
    key: "legend",
    label: "전설의 뒷담양파",
    min: 200,
    image: "/onion/stage-6.png",
    width: 586,
    height: 562,
  },
];

export function getTier(count: number): Tier {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (count >= tier.min) current = tier;
  }
  return current;
}
