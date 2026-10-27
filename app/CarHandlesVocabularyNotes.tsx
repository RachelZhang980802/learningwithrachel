"use client";

import { CarHandlesExercises } from "./CarHandlesExercises";
import { carHandlesArticle } from "./inquire-technology-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "cacophony", pattern: "cacophony", label: "cacophony", pos: "n.", ipa: "/kəˈkɑːfəni/", definition: "A mixture of loud, unpleasant sounds.", zh: "刺耳嘈杂的声音" },
  { key: "beep", pattern: "beeps?", label: "beep", pos: "n.", ipa: "/biːp/", definition: "A short, high sound made by a car horn or electronic device.", zh: "嘟嘟声；电子设备发出的短促高音" },
  { key: "blip", pattern: "blips?", label: "blip", pos: "n.", ipa: "/blɪp/", definition: "A small flashing point of light or a short, high sound; a small temporary change.", zh: "（雷达屏幕上的）光点；短促尖声；短暂变化" },
  { key: "bloop", pattern: "bloops?", label: "bloop", pos: "n.", ipa: "/bluːp/", definition: "A short, low sound made by an electronic device.", zh: "（非正式）电子设备发出的低沉声音" },
  { key: "blop", pattern: "blops?", label: "blop", pos: "n.", ipa: "/blɒp/", definition: "A sound like something liquid dropping into a liquid.", zh: "（拟声词）液体滴落的声音" },
  { key: "orifice", pattern: "orifices?", label: "orifice", pos: "n.", ipa: "/ˈɔːrɪfɪs/", definition: "An opening, especially one in the body or a machine.", zh: "孔口；开口" },
  { key: "whiz_bang", pattern: "whiz[-–]bang", label: "whiz-bang", pos: "adj.", ipa: "/ˈwɪz bæŋ/", definition: "Very impressive or technically advanced.", zh: "（非正式）极棒的；技术上先进的" },
  { key: "gizmo", pattern: "gizmos?", label: "gizmo", pos: "n.", ipa: "/ˈɡɪzmoʊ/", definition: "A small piece of equipment or a device, especially one whose name you do not know.", zh: "（非正式）小玩意儿；小装置" },
  { key: "foist", pattern: "foist(?:s|ed|ing)?", label: "foist", pos: "v.", ipa: "/fɔɪst/", definition: "To force something unwanted on someone.", zh: "强加；把不想要的东西给某人" },
  { key: "crank_up", pattern: "crank(?:s|ed|ing)?\\s+up", label: "crank up", pos: "v. phr.", ipa: "/kræŋk ʌp/", definition: "To increase the level or degree of something.", zh: "调高；增加" },
  { key: "poke_and_prod", pattern: "poke\\s+and\\s+prod", label: "poke and prod", pos: "v. phr.", ipa: "/poʊk ənd prɑːd/", definition: "To push or examine something with fingers or an object, especially repeatedly.", zh: "用手指或物体反复戳弄、检查" },
  { key: "mime", pattern: "mime", label: "mime", pos: "n.", ipa: "/maɪm/", definition: "A performer who communicates through exaggerated movements and expressions instead of words.", zh: "哑剧表演者" },
  { key: "cut_back", pattern: "cut\\s+back", label: "cut back", pos: "v. phr.", ipa: "/kʌt bæk/", definition: "To reduce something.", zh: "削减；减少" },
  { key: "clockwise", pattern: "clockwise", label: "clockwise", pos: "adj.", ipa: "/ˈklɑːkwaɪz/", definition: "Moving in the same direction as the hands of a clock.", zh: "顺时针方向" },
  { key: "digit", pattern: "digits?", label: "digit", pos: "n.", ipa: "/ˈdɪdʒɪt/", definition: "A finger or toe; any of the numbers from 0 to 9.", zh: "（手或脚的）指、趾；数字" },
  { key: "gruesome", pattern: "gruesome", label: "gruesome", pos: "adj.", ipa: "/ˈɡruːsəm/", definition: "Very unpleasant and shocking.", zh: "可怕的；令人毛骨悚然的" },
  { key: "lathe", pattern: "lathe", label: "lathe", pos: "n.", ipa: "/leɪð/", definition: "A machine for shaping wood or metal by turning it.", zh: "车床" },
  { key: "viable", pattern: "viable", label: "viable", pos: "adj.", ipa: "/ˈvaɪəbl/", definition: "Able to work as intended or to succeed.", zh: "可行的；能存活的" },
  { key: "realign", pattern: "realign(?:s|ed|ing)?", label: "realign", pos: "v.", ipa: "/ˌriːəˈlaɪn/", definition: "To change the position or direction of something slightly.", zh: "重新调整位置或方向" },
  { key: "hood", pattern: "hood", label: "hood", pos: "n.", ipa: "/hʊd/", definition: "The metal cover over the engine of a car.", zh: "（汽车的）引擎盖" },
  { key: "ennui", pattern: "ennui", label: "ennui", pos: "n.", ipa: "/ɑːnˈwiː/", definition: "A feeling of being bored and having no interest in anything.", zh: "倦怠感；无聊" },
  { key: "console", pattern: "console", label: "console", pos: "n.", ipa: "/ˈkɑːnsoʊl/", definition: "A panel with controls for electronic or mechanical equipment.", zh: "控制台；操纵台" },
  { key: "retractable", pattern: "retractable", label: "retractable", pos: "adj.", ipa: "/rɪˈtræktəbl/", definition: "Able to be pulled back or drawn in.", zh: "可缩回的；可收起的" },
  { key: "sensor", pattern: "sensors?", label: "sensor", pos: "n.", ipa: "/ˈsensər/", definition: "A device that detects or measures physical properties.", zh: "传感器" },
  { key: "flush", pattern: "flush", label: "flush", pos: "adj.", ipa: "/flʌʃ/", definition: "Exactly even or level with another surface.", zh: "齐平的；平齐的" },
  { key: "register", pattern: "register(?:s|ed|ing)?", label: "register", pos: "v.", ipa: "/ˈredʒɪstər/", definition: "To notice something or become aware of it.", zh: "意识到；记住" },
  { key: "corrode", pattern: "corrod(?:e|es|ed|ing)", label: "corrode", pos: "v.", ipa: "/kəˈroʊd/", definition: "To destroy something slowly, especially by chemical action.", zh: "腐蚀；侵蚀" },
  { key: "barrel_roll", pattern: "barrel[-–]roll", label: "barrel-roll", pos: "n.", ipa: "/ˈbærəl roʊl/", definition: "A rapid roll of an aircraft around its longitudinal axis.", zh: "横滚翻转（飞机的滚转动作）" },
  { key: "ambient_lighting", pattern: "ambient\\s+lighting", label: "ambient lighting", pos: "n.", ipa: "/ˈæmbiənt ˈlaɪtɪŋ/", definition: "Soft light that spreads in all directions in a room or space.", zh: "环境照明" },
  { key: "gridlock", pattern: "gridlock", label: "gridlock", pos: "n.", ipa: "/ˈɡrɪdlɑːk/", definition: "A situation in which roads are so blocked that traffic cannot move.", zh: "交通全面瘫痪" },
  { key: "tinker", pattern: "tinker(?:s|ed|ing)?", label: "tinker", pos: "v.", ipa: "/ˈtɪŋkər/", definition: "To make small changes to something in order to improve or repair it.", zh: "小修小补；摆弄" },
  { key: "gut", pattern: "gut(?:s|ted|ting)?", label: "gut", pos: "v.", ipa: "/ɡʌt/", definition: "To remove the inside parts of something or destroy its interior.", zh: "取出内脏；毁坏内部" },
  { key: "intertwine", pattern: "intertwin(?:e|es|ed|ing)", label: "intertwine", pos: "v.", ipa: "/ˌɪntərˈtwaɪn/", definition: "To twist or be twisted together; to be closely connected.", zh: "缠绕；紧密联系" },
  { key: "heaving", pattern: "heaving", label: "heaving", pos: "adj.", ipa: "/ˈhiːvɪŋ/", definition: "Extremely busy or full of people.", zh: "挤满人的；热闹的" },
  { key: "bureaucracy", pattern: "bureaucracy", label: "bureaucracy", pos: "n.", ipa: "/bjʊˈrɑːkrəsi/", definition: "A system with many complicated rules and processes; excessive administrative procedure.", zh: "官僚制度；繁文缛节" },
  { key: "water_dispenser", pattern: "water\\s+dispenser", label: "water dispenser", pos: "n.", ipa: "/ˈwɔːtər dɪˈspensər/", definition: "A machine that supplies water for drinking.", zh: "饮水机" },
  { key: "rejoice", pattern: "rejoic(?:e|es|ed|ing)", label: "rejoice", pos: "v.", ipa: "/rɪˈdʒɔɪs/", definition: "To feel or show great happiness.", zh: "欢欣鼓舞；非常高兴" },
  { key: "scourge", pattern: "scourge", label: "scourge", pos: "n.", ipa: "/skɜːrdʒ/", definition: "Something that causes great suffering or harm.", zh: "祸害；灾难" },
  { key: "contend", pattern: "contend(?:s|ed|ing)?", label: "contend", pos: "v.", ipa: "/kənˈtend/", definition: "To argue or state that something is true.", zh: "坚持认为；主张" },
  { key: "jack_up", pattern: "jack(?:s|ed|ing)?\\s+up", label: "jack up", pos: "v. phr.", ipa: "/dʒæk ʌp/", definition: "To increase something, especially a price, suddenly and by a large amount.", zh: "（价格等）抬高" },
  { key: "inconvenience", pattern: "inconvenienc(?:e|es|ed|ing)", label: "inconvenience", pos: "v.", ipa: "/ˌɪnkənˈviːniəns/", definition: "To cause problems or difficulty for someone.", zh: "造成不便" },
  { key: "harass", pattern: "harass(?:es|ed|ing)?", label: "harass", pos: "v.", ipa: "/həˈræs/", definition: "To annoy or trouble someone repeatedly.", zh: "骚扰；烦扰" },
  { key: "put_out", pattern: "put\\s+out", label: "put out", pos: "v. phr.", ipa: "/pʊt aʊt/", definition: "To annoy or upset someone.", zh: "使烦恼；使不悦" }
];

export function CarHandlesVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={carHandlesArticle.paragraphs} terms={terms} idPrefix="car-handles-note" sectionHeadings={carHandlesArticle.sectionHeadings} paragraphTranslations={carHandlesArticle.paragraphTranslations} /><CarHandlesExercises /></>;
}
