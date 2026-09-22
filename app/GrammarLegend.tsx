export const grammarRoles = [
  ["subject", "Subject", "主语"], ["predicate", "Predicate / copular verb", "谓语／系动词"],
  ["object", "Object", "宾语"], ["complement", "Predicative / complement", "表语／补足语"],
  ["modifier", "Modifier", "定语／修饰语"], ["adverbial", "Adverbial", "状语"],
  ["clause", "Clause / combined unit", "分句／组合整体"], ["linker", "Linker / discourse marker", "连接／话语标记"],
] as const;

/** One function-to-colour contract for all ten articles, including nested clause roles. */
export function grammarRole(label: string) {
  const role = label.split("·")[0];
  if (/真正主语/.test(label)) return "subject";
  if (/真正宾语/.test(label)) return "object";
  if (/＋|\+|动词原形及宾语/.test(role)) return "clause";
  if (/连词|连接|引导词|转折|关联标记|小品词|否定词|否定标记|话语标记|礼貌标记|称呼|告别语|回应语|祝贺语|^介词$/.test(role)) return "linker";
  // Nested labels describe the local function: 定语从句主语 is a subject, not a modifier.
  if (/主语(?:[123一二三]|中心词?|（含定语从句）)?$/.test(role)) return "subject";
  if (/宾语(?:[123ab一二三]|中心词?)?$/.test(role)) return "object";
  if (/宾补|表语|补足|补语/.test(role)) return "complement";
  if (/助动词|情态动词|系动词|谓语|系表|动词原形|中心动词|^分词中心$/.test(role) && !/非谓语|状语/.test(role)) return "predicate";
  if (/定语|修饰|同位|限定语/.test(role)) return "modifier";
  if (/状语|条件|让步|伴随|独立主格|独立结构|插入|目的不定式|结果不定式/.test(role)) return "adverbial";
  if (/对象|接收者/.test(role)) return "object";
  if (/主语/.test(role)) return "subject";
  if (/宾语/.test(role)) return "object";
  if (/从句|引语|主句|存在结构/.test(role)) return "clause";
  if (/不定式|分词|非谓语/.test(role)) return "complement";
  return "adverbial";
}

export function GrammarLegend() {
  return <div className="grammar-colour-legend" aria-label="Grammar function legend">{grammarRoles.map(([role, english, chinese]) => <span key={role} className={role}><i aria-hidden="true"/><b lang="en">{english}</b><small lang="zh-CN">{chinese}</small></span>)}</div>;
}
