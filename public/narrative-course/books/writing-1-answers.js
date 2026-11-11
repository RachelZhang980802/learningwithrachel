import { supplementalAnswers } from './writing-1-supplemental-answers.js?v=20261111-inline-answers';

// Reference answers from the supplied Unit 1 key. Coordinates are percentages
// of the original scan. Each flag belongs to one question, blank, or table cell.
const unit1 = [
  {"page":21,"id":"u1-pre-1","label":"Unit 1 · Pre-class Exploration 1 · sample story","flag":[7.2,36.1],"answer":"When I was enjoying my apple pie in the park, I heard a cry for help. It looked like an angry alligator was going to attack a naughty boy who got too close, now frightened. The police and ambulance were called but fortunately the alligator swam away. The boy thanked everyone and apologized for his misbehavior. The ambulance left and the parents were still angry with the naughty boy who could have been killed by attacking the alligator with an apple core. The boy apologized to his parents that he would never do it again."},
  {"page":21,"id":"u1-pre-2-1","label":"Unit 1 · Pre-class Exploration 2 · 1","flag":[7.2,64.4],"answer":"Hare & Tortoise"},
  {"page":21,"id":"u1-pre-2-2","label":"Unit 1 · Pre-class Exploration 2 · 2","flag":[7.2,68.6],"answer":"Tortoise challenged Hare to have a race."},
  {"page":21,"id":"u1-pre-2-3","label":"Unit 1 · Pre-class Exploration 2 · 3","flag":[7.2,72.8],"answer":"Hare raced off while Tortoise crawled slowly behind."},
  {"page":21,"id":"u1-pre-2-4","label":"Unit 1 · Pre-class Exploration 2 · 4","flag":[7.2,76.7],"answer":"Hare stopped to take a nap while Tortoise kept going."},
  {"page":21,"id":"u1-pre-2-5","label":"Unit 1 · Pre-class Exploration 2 · 5","flag":[7.2,80.8],"answer":"When Hare woke up, he ran as fast as he could, but Tortoise passed the finishing line first."},
  {"page":21,"id":"u1-pre-2-6","label":"Unit 1 · Pre-class Exploration 2 · 6","flag":[7.2,84.9],"answer":"Perseverance is the key to success."},
  {"page":28,"id":"u1-a1-main","label":"Unit 1 · Activity 1 · main character","flag":[7.2,24.1],"answer":"Kiwi"},
  {"page":28,"id":"u1-a1-support","label":"Unit 1 · Activity 1 · supporting characters","flag":[7.2,27.2],"answer":"Tane-mahuta; birds"},
  {"page":28,"id":"u1-a1-setting","label":"Unit 1 · Activity 1 · setting","flag":[7.2,30],"answer":"Forest"},
  {"page":28,"id":"u1-a1-beginning","label":"Unit 1 · Activity 1 · plot beginning","flag":[7.2,36.7],"answer":"Tane-mahuta found the problem with the trees and asked the birds if someone would come down, live on the ground, eat the insects and save the trees."},
  {"page":28,"id":"u1-a1-middle","label":"Unit 1 · Activity 1 · plot middle","flag":[7.2,39.3],"answer":"After the birds refused the god’s request to rescue the roots of his trees, Kiwi stood out to help."},
  {"page":28,"id":"u1-a1-ending","label":"Unit 1 · Activity 1 · plot ending","flag":[7.2,42.4],"answer":"Tane-mahuta rewarded Kiwi by making him the most famous and most loved bird."},
  {"page":28,"id":"u1-a1-pov","label":"Unit 1 · Activity 1 · point of view","flag":[7.2,45.2],"answer":"The omniscient point of view"},
  {"page":28,"id":"u1-a1-theme","label":"Unit 1 · Activity 1 · theme","flag":[7.2,49.6],"answer":"Sacrifices made for others will be rewarded eventually."},
  {"page":29,"id":"u1-a3-t1-1","label":"Unit 1 · Activity 3 · Task 1 · 1","flag":[16.5,55.9],"answer":"F","blank":[19.2,55.9,4.1]},
  {"page":29,"id":"u1-a3-t1-2","label":"Unit 1 · Activity 3 · Task 1 · 2","flag":[16.5,58],"answer":"T","blank":[19.2,58,4.1]},
  {"page":29,"id":"u1-a3-t1-3","label":"Unit 1 · Activity 3 · Task 1 · 3","flag":[16.5,60],"answer":"F","blank":[19.2,60,4.1]},
  {"page":29,"id":"u1-a3-t1-4","label":"Unit 1 · Activity 3 · Task 1 · 4","flag":[16.5,62.1],"answer":"F","blank":[19.2,62.1,4.1]},
  {"page":29,"id":"u1-a3-t2-1","label":"Unit 1 · Activity 3 · Task 2 · 1","flag":[7.2,73],"answer":"It would protect his legs from the sticky poison."},
  {"page":29,"id":"u1-a3-t2-2","label":"Unit 1 · Activity 3 · Task 2 · 2","flag":[7.2,81.7],"answer":"It was very uncomfortable because the pants were sticky at first, hardened after a while and were covered with poison. He felt “terrible” to put them back on in the morning."},
  {"page":30,"id":"u1-a3-t2-3","label":"Unit 1 · Activity 3 · Task 2 · 3","flag":[7.2,9.6],"answer":"It was hard work, and he learned to deal with it from a young age."},
  {"page":34,"id":"u1-a4-t1-2a","label":"Unit 1 · Activity 4 · Task 1 · 2 doll","flag":[59,28.9],"answer":"a doll","blank":[61.4,29.4,26.8]},
  {"page":34,"id":"u1-a4-t1-2b","label":"Unit 1 · Activity 4 · Task 1 · 2 spelling","flag":[39.5,31.2],"answer":"d-o-l-l","blank":[42,31.4,23]},
  {"page":34,"id":"u1-a4-t1-3a","label":"Unit 1 · Activity 4 · Task 1 · 3 spout","flag":[49.6,33.5],"answer":"the spout","blank":[52,34,16.8]},
  {"page":34,"id":"u1-a4-t1-3b","label":"Unit 1 · Activity 4 · Task 1 · 3 spelling","flag":[20.2,35.85],"answer":"w-a-t-e-r","blank":[22.6,36.2,24]},
  {"page":34,"id":"u1-a4-t1-4a","label":"Unit 1 · Activity 4 · Task 1 · 4 awakened","flag":[67.3,38.2],"answer":"Helen’s soul","blank":[69.8,38.7,13.9]},
  {"page":34,"id":"u1-a4-t1-4c","label":"Unit 1 · Activity 4 · Task 1 · 4 set","flag":[43.1,40.6],"answer":"it free","blank":[45.6,41.1,17]},
  {"page":34,"id":"u1-a4-t1-4b","label":"Unit 1 · Activity 4 · Task 1 · 4 gave","flag":[18.2,40.65],"answer":"it light, hope, joy","blank":[22.5,41,12.5]},
  {"page":34,"id":"u1-a4-t2-1","label":"Unit 1 · Activity 4 · Task 2 · 1","flag":[7.2,54.5],"answer":"She could not see or hear anything."},
  {"page":34,"id":"u1-a4-t2-3","label":"Unit 1 · Activity 4 · Task 2 · 3","flag":[7.2,69.3],"answer":"She was interested in this finger play and imitated it."},
  {"page":34,"id":"u1-a4-t2-4","label":"Unit 1 · Activity 4 · Task 2 · 4","flag":[7.2,77.6],"answer":"It was the start of her education, a life-changing event."},
  {"page":41,"id":"u1-a5-t1-2","label":"Unit 1 · Activity 5 · Task 1 · 2","flag":[7.2,57],"answer":"a select invitation to a ball"},
  {"page":41,"id":"u1-a5-t1-3","label":"Unit 1 · Activity 5 · Task 1 · 3","flag":[7.2,59.6],"answer":"irritated"},
  {"page":41,"id":"u1-a5-t1-4","label":"Unit 1 · Activity 5 · Task 1 · 4","flag":[7.2,62.2],"answer":"400 francs to buy a suitable gown"},
  {"page":41,"id":"u1-a5-t1-5","label":"Unit 1 · Activity 5 · Task 1 · 5","flag":[7.2,64.8],"answer":"Mathilde borrowed a diamond necklace from her friend."},
  {"page":41,"id":"u1-a5-t1-7","label":"Unit 1 · Activity 5 · Task 1 · 7","flag":[7.2,69.8],"answer":"She left the ball about four o’clock in the morning."},
  {"page":41,"id":"u1-a5-t1-8","label":"Unit 1 · Activity 5 · Task 1 · 8","flag":[7.2,72.4],"answer":"the diamond necklace"},
  {"page":41,"id":"u1-a5-t1-9","label":"Unit 1 · Activity 5 · Task 1 · 9","flag":[7.2,75],"answer":"a diamond necklace and returned it to Madame Forestier"},
  {"page":41,"id":"u1-a5-t1-10","label":"Unit 1 · Activity 5 · Task 1 · 10","flag":[7.2,77.8],"answer":"Mathilde learned that the diamond necklace she had borrowed was not real."},
  {"page":41,"id":"u1-a5-t2-1","label":"Unit 1 · Activity 5 · Task 2 · 1","flag":[7.2,91],"answer":"Young and good-looking, Mathilde yearned for a luxurious life, but she was married to a government clerk with limited income. Her life was far from her expectations."},
  {"page":42,"id":"u1-a5-t2-2","label":"Unit 1 · Activity 5 · Task 2 · 2","flag":[7.2,9.4],"answer":"She was frustrated because she did not have a proper gown to wear to the ball."},
  {"page":42,"id":"u1-a5-t2-3","label":"Unit 1 · Activity 5 · Task 2 · 3","flag":[7.2,13.8],"answer":"She and her husband paid for a diamond necklace to return to Madame Forestier. They had to work very hard and lead a miserable life to pay off the debt."},
  {"page":42,"id":"u1-a5-t2-4","label":"Unit 1 · Activity 5 · Task 2 · 4","flag":[7.2,18],"answer":"Her vanity and desire for a luxurious life. Unsatisfied with her plain life as a clerk’s wife, she wanted to display her beauty at the grand ball and earn admiration."},
  {"page":42,"id":"u1-a5-t2-5","label":"Unit 1 · Activity 5 · Task 2 · 5","flag":[7.2,22.2],"answer":"Answers may vary. For example, Mathilde was honest: she replaced what she believed was a real diamond necklace and worked for ten years to pay off the debt. This shows courage, though she paid a high price for her vanity."},
  {"page":43,"id":"u1-a7-a","label":"Unit 1 · Activity 7 · Text A","flag":[22.6,82],"answer":"The most important day I remember in all my life; It was the third of March, 1887, three months before I was seven years old; On the afternoon of that eventful day; The morning after; When; In the days that followed; before; One day, while; Earlier in the day; As; first; then."},
  {"page":43,"id":"u1-a7-b","label":"Unit 1 · Activity 7 · Text B","flag":[60.4,82],"answer":"One evening; The day of the ball drew near; The next day; The night of the ball arrived; about four o’clock in the morning; about seven o’clock; all day; Loisel returned at night; At the end of a week; Then; Every month; At the end of ten years."},
  {"page":45,"id":"u1-a8","label":"Unit 1 · Activity 8 · example answers","flag":[7.2,64.7],"answer":"Example 1:General: Do you know what it feels like if you can’t see and hear? Specific: Have you ever been at sea in a dense fog, when it seemed as if a tangible white darkness shut you in, and the great ship, tense and anxious, groped her way toward the shore with plummet and sounding-line, and you waited with beating heart for something to happen? I was like that ship before my education began, only I was without compass or sounding-line, and had no way of knowing how near the harbour was.\n\nExample 2: General: I was so happy that day that I looked forward to the next day to come when I went to bed. Specific: It would have been difficult to find a happier child than I was as I lay in my crib at the close of the eventful day and lived over the joys it had brought me, and for the first time longed for a new day to come.\n\nExample 3: General: Madame Loisel was pretty and attracted lots of attention at the ball. Specific: The night of the ball arrived. Madame Loisel was a great success. She was prettier than any other woman present, elegant, graceful, smiling and wild with joy. All the men looked at her, asked her name, sought to be introduced. All the attaches of the Cabinet wished to waltz with her. She was remarked by the minister himself.\n\nExample 4: General: She had to do all the housework herself. Specific: She came to know what heavy housework meant and the odious cares of the kitchen. She washed the dishes, using her dainty fingers and rosy nails on greasy pots and pans. She washed the soiled linen, the shirts and the dishcloths, which she dried upon a line; she carried the slops down to the street every morning and carried up the water, stopping for breath at every landing."}
];

export const answersByPage = new Map();
for (const item of [...unit1, ...supplementalAnswers]) {
  const pageItems = answersByPage.get(item.page) ?? [];
  pageItems.push(item);
  answersByPage.set(item.page, pageItems);
}
