import type { Tier } from "@/lib/onion-tiers";

const REACTIONS: Record<string, string[]> = {
  sprout: [
    "엥 뭐야",
    "헐 얘기해봐",
    "그래서 어떻게 됐는데",
    "와 벌써 빡치네",
    "일단 앉아봐",
    "내가 들어줄게",
  ],

  budding: [
    "아니 그건 좀;;",
    "와 벌써 싹수가 보이네",
    "그 인간 뭐임?",
    "아니 왜 저래 진짜",
    "야 그건 선 넘었지",
    "나였으면 벌써 화냄",
    "이건 좀 까도 인정",
    "계속 말해봐 나 지금 흥미진진함",
  ],

  growing: [
    "아 진짜 열받네ㅋㅋ",
    "그니까 내 말이!!!",
    "이쯤 되면 걔가 문제임",
    "야 너 보살이냐?",
    "내가 다 억울하네",
    "와 나까지 빡침",
    "잠깐만 더 까봐",
    "이건 양파도 화남",
    "지금 나도 편들었음",
  ],

  leafy: [
    "와 개어이없네ㅋㅋㅋ",
    "이건 손절각인데?",
    "너 아직도 거기 다녀?",
    "아니 어떻게 사람이 저럴 수가",
    "내 잎이 다 떨린다",
    "양파 입장에서 진짜 어이없음",
    "이 정도면 내가 대신 싸워줌",
    "야 더 없어? 더 털어봐",
    "오늘 양파 성장세 미쳤다",
  ],

  storm: [
    "와 상또라이네 진짜",
    "아니 이건 나라도 욕함",
    "잠깐만 나 지금 화났음",
    "그 사람 이름은 뭐냐",
    "이쯤 되면 나도 원한 생김",
    "야 이건 진짜 개빡치네",
    "양파도 이제 지쳤다",
    "계속 까. 내가 소화시킬게",
    "내가 왜 너보다 더 화났지?",
    "양파만도 못한놈이네",
  ],

  legend: [
    "와 오늘 진짜 제대로 털었네",
    "양파가 다 기억하고 있다",
    "오늘은 내가 인정한다",
    "이 정도면 뒷담이 아니라 서사다",
    "나 지금까지 들은 것 중 제일 셈",
    "양파 만렙 찍었네ㅋㅋ",
    "오늘 양파 영양상태 최상",
    "너 때문에 내가 자랐잖아",
    "이제 그만... 나도 지친다",
    "어우",
    "미친놈",
    "와 이건 레전드다",
    "나였으면 울었다",
  ],
};

export function getReaction(tier: Tier): string {
  const lines = REACTIONS[tier.key] ?? REACTIONS.sprout;

  return lines[Math.floor(Math.random() * lines.length)];
}

export function getToneExamples(tierKey: string, count = 4): string[] {
  const lines = REACTIONS[tierKey] ?? REACTIONS.sprout;

  return [...lines].sort(() => Math.random() - 0.5).slice(0, count);
}