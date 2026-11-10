import { supplementalAnswers } from './writing-1-supplemental-answers.js';

// Transcribed from the supplied unit answer PDFs and matched to the printed page images.
// Coordinates are percentages of each original page. Open-ended prompts without a supplied
// answer are intentionally not given an invented answer.
const unit1 = [
  {page:21,id:'u1-pre-1',label:'Pre-class Exploration 1 · sample story',box:[20,39,69,5],answer:'When I was enjoying my apple pie in the park, I heard a cry for help. It looked like an angry alligator was going to attack a naughty boy who got too close, now frightened. The police and ambulance were called but fortunately the alligator swam away. The boy thanked everyone and apologized for his misbehavior. The ambulance left and the parents were still angry with the naughty boy who could have been killed by attacking the alligator with an apple core. The boy apologized to his parents that he would never do it again.',long:true},
  {page:21,id:'u1-pre-2-1',label:'Pre-class Exploration 2 · 1',box:[22,66.1,66,2.3],answer:'Hare & Tortoise'},
  {page:21,id:'u1-pre-2-2',label:'Pre-class Exploration 2 · 2',box:[22,70.2,66,2.3],answer:'Tortoise challenged Hare to have a race.'},
  {page:21,id:'u1-pre-2-3',label:'Pre-class Exploration 2 · 3',box:[22,74.4,66,2.3],answer:'Hare raced off while Tortoise crawled slowly behind.'},
  {page:21,id:'u1-pre-2-4',label:'Pre-class Exploration 2 · 4',box:[22,78.6,66,2.3],answer:'Hare stopped to take a nap while Tortoise kept going.'},
  {page:21,id:'u1-pre-2-5',label:'Pre-class Exploration 2 · 5',box:[22,82.7,66,2.3],answer:'When Hare woke up, he ran as fast as he could, but Tortoise passed the finishing line first.'},
  {page:21,id:'u1-pre-2-6',label:'Pre-class Exploration 2 · 6',box:[22,86.8,66,2.3],answer:'Perseverance is the key to success.'},

  {page:28,id:'u1-a1-main',label:'Activity 1 · main character',box:[31,23.5,56,2.3],answer:'Kiwi'},
  {page:28,id:'u1-a1-support',label:'Activity 1 · supporting characters',box:[34,26.6,54,2.3],answer:'Tane-mahuta; birds'},
  {page:28,id:'u1-a1-setting',label:'Activity 1 · setting',box:[16,32.7,72,2.3],answer:'Forest'},
  {page:28,id:'u1-a1-beginning',label:'Activity 1 · plot beginning',box:[25,36.4,63,2.3],answer:'Tane-mahuta found the problem with the trees and asked the birds if someone would come down, live on the ground, eat the insects and save the trees.',long:true},
  {page:28,id:'u1-a1-middle',label:'Activity 1 · plot middle',box:[23,39.2,65,2.3],answer:'After the birds refused the god’s request to rescue the roots of his trees, Kiwi stood out to help.',long:true},
  {page:28,id:'u1-a1-ending',label:'Activity 1 · plot ending',box:[23,42.3,65,2.3],answer:'Tane-mahuta rewarded Kiwi by making him the most famous and most loved bird.',long:true},
  {page:28,id:'u1-a1-pov',label:'Activity 1 · point of view',box:[16,47.1,72,2.3],answer:'The omniscient point of view'},
  {page:28,id:'u1-a1-theme',label:'Activity 1 · theme',box:[16,51.5,72,2.3],answer:'Sacrifices made for others will be rewarded eventually.'},

  {page:29,id:'u1-a3-t1-1',label:'Activity 3 · Task 1 · 1',box:[19.2,55.2,4.6,2.1],answer:'F'},
  {page:29,id:'u1-a3-t1-2',label:'Activity 3 · Task 1 · 2',box:[19.2,57.3,4.6,2.1],answer:'T'},
  {page:29,id:'u1-a3-t1-3',label:'Activity 3 · Task 1 · 3',box:[19.2,59.4,4.6,2.1],answer:'F'},
  {page:29,id:'u1-a3-t1-4',label:'Activity 3 · Task 1 · 4',box:[19.2,61.3,4.6,2.1],answer:'F'},
  {page:29,id:'u1-a3-t2-1',label:'Activity 3 · Task 2 · 1',box:[22,75.4,73,4.5],answer:'It would protect his legs from the sticky poison.',long:true},
  {page:29,id:'u1-a3-t2-2',label:'Activity 3 · Task 2 · 2',box:[22,86.5,73,5.3],answer:'It was very uncomfortable because the pants were sticky at first, hardened after a while and were covered with poison. He felt “terrible” to put them back on in the morning.',long:true},
  {page:30,id:'u1-a3-t2-3',label:'Activity 3 · Task 2 · 3',box:[17,11,72,6],answer:'It was hard work, and he learned to deal with it from a young age.',long:true},

  {page:34,id:'u1-a4-t1-2a',label:'Activity 4 · Task 1 · 2 doll',box:[54,28.3,37,2],answer:'a doll'},
  {page:34,id:'u1-a4-t1-2b',label:'Activity 4 · Task 1 · 2 spelling',box:[37,30.3,28,2],answer:'d-o-l-l'},
  {page:34,id:'u1-a4-t1-3a',label:'Activity 4 · Task 1 · 3 spout',box:[48,33.1,24,2],answer:'the spout'},
  {page:34,id:'u1-a4-t1-3b',label:'Activity 4 · Task 1 · 3 spelling',box:[18,35.6,28,2],answer:'w-a-t-e-r'},
  {page:34,id:'u1-a4-t1-4a',label:'Activity 4 · Task 1 · 4 awakened',box:[62,38.3,23,2],answer:'Helen’s soul'},
  {page:34,id:'u1-a4-t1-4b',label:'Activity 4 · Task 1 · 4 gave',box:[18,40.6,20,2],answer:'it light, hope, joy'},
  {page:34,id:'u1-a4-t1-4c',label:'Activity 4 · Task 1 · 4 set',box:[42,40.6,19,2],answer:'it free'},
  {page:34,id:'u1-a4-t2-1',label:'Activity 4 · Task 2 · 1',box:[17,56.8,73,4.1],answer:'She could not see or hear anything.',long:true},
  {page:34,id:'u1-a4-t2-3',label:'Activity 4 · Task 2 · 3',box:[17,74.2,73,4.5],answer:'She was interested in this finger play and imitated it.',long:true},
  {page:34,id:'u1-a4-t2-4',label:'Activity 4 · Task 2 · 4',box:[17,82.4,73,4.1],answer:'It was the start of her education, a life-changing event.',long:true},

  {page:41,id:'u1-a5-t1-2',label:'Activity 5 · Task 1 · 2',box:[41,57.5,30,2.1],answer:'a select invitation to a ball'},
  {page:41,id:'u1-a5-t1-3',label:'Activity 5 · Task 1 · 3',box:[33,60.0,19,2.1],answer:'irritated'},
  {page:41,id:'u1-a5-t1-4',label:'Activity 5 · Task 1 · 4',box:[51,62.8,25,2.1],answer:'400 francs to buy a suitable gown'},
  {page:41,id:'u1-a5-t1-5',label:'Activity 5 · Task 1 · 5',box:[23,65.1,52,2.1],answer:'Mathilde borrowed a diamond necklace from her friend.'},
  {page:41,id:'u1-a5-t1-7',label:'Activity 5 · Task 1 · 7',box:[23,69.3,52,2.1],answer:'She left the ball about four o’clock in the morning.'},
  {page:41,id:'u1-a5-t1-8',label:'Activity 5 · Task 1 · 8',box:[44,72.0,29,2.1],answer:'the diamond necklace'},
  {page:41,id:'u1-a5-t1-9',label:'Activity 5 · Task 1 · 9',box:[43,74.4,25,2.1],answer:'a diamond necklace and returned it to Madame Forestier',long:true},
  {page:41,id:'u1-a5-t1-10',label:'Activity 5 · Task 1 · 10',box:[35,77.2,47,2.1],answer:'Mathilde learned that the diamond necklace she had borrowed was not real.',long:true},
  {page:41,id:'u1-a5-t2-1',label:'Activity 5 · Task 2 · 1',box:[22,92.8,73,5],answer:'Young and good-looking, Mathilde yearned for a luxurious life, but she was married to a government clerk with limited income. Her life was far from her expectations.',long:true},
  {page:42,id:'u1-a5-t2-2',label:'Activity 5 · Task 2 · 2',box:[18,12,72,4.2],answer:'She was frustrated because she did not have a proper gown to wear to the ball.',long:true},
  {page:42,id:'u1-a5-t2-3',label:'Activity 5 · Task 2 · 3',box:[18,16.2,72,4.2],answer:'She and her husband paid for a diamond necklace to return to Madame Forestier. They had to work very hard and lead a miserable life to pay off the debt.',long:true},
  {page:42,id:'u1-a5-t2-4',label:'Activity 5 · Task 2 · 4',box:[18,20.4,72,4.2],answer:'Her vanity and desire for a luxurious life. Unsatisfied with her plain life as a clerk’s wife, she wanted to display her beauty at the grand ball and earn admiration.',long:true},
  {page:42,id:'u1-a5-t2-5',label:'Activity 5 · Task 2 · 5',box:[18,24.6,72,5.5],answer:'Answers may vary. For example, Mathilde was honest: she replaced what she believed was a real diamond necklace and worked for ten years to pay off the debt. This shows courage, though she paid a high price for her vanity.',long:true},

  {page:43,id:'u1-a7-a',label:'Activity 7 · Text A',box:[23,82.0,33,10],answer:'The most important day I remember in all my life; It was the third of March, 1887, three months before I was seven years old; On the afternoon of that eventful day; The morning after; When; In the days that followed; before; One day, while; Earlier in the day; As; first; then.',long:true},
  {page:43,id:'u1-a7-b',label:'Activity 7 · Text B',box:[58,82.0,33,10],answer:'One evening; The day of the ball drew near; The next day; The night of the ball arrived; about four o’clock in the morning; about seven o’clock; all day; Loisel returned at night; At the end of a week; Then; Every month; At the end of ten years.',long:true},
  {page:45,id:'u1-a8',label:'Activity 8 · example answers',box:[20,64.5,68,4.5],answer:"Example 1:General: Do you know what it feels like if you can’t see and hear? Specific: Have you ever been at sea in a dense fog, when it seemed as if a tangible white darkness shut you in, and the great ship, tense and anxious, groped her way toward the shore with plummet and sounding-line, and you waited with beating heart for something to happen? I was like that ship before my education began, only I was without compass or sounding-line, and had no way of knowing how near the harbour was. Example 2: General: I was so happy that day that I looked forward to the next day to come when I went to bed. Specific: It would have been difficult to find a happier child than I was as I lay in my crib at the close of the eventful day and lived over the joys it had brought me, and for the first time longed for a new day to come. Example 3: General: Madame Loisel was pretty and attracted lots of attention at the ball. Specific: The night of the ball arrived. Madame Loisel was a great success. She was prettier than any other woman present, elegant, graceful, smiling and wild with joy. All the men looked at her, asked her name, sought to be introduced. All the attaches of the Cabinet wished to waltz with her. She was remarked by the minister himself. Example 4: General: She had to do all the housework herself. Specific: She came to know what heavy housework meant and the odious cares of the kitchen. She washed the dishes, using her dainty fingers and rosy nails on greasy pots and pans. She washed the soiled linen, the shirts and the dishcloths, which she dried upon a line; she carried the slops down to the street every morning and carried up the water, stopping for breath at every landing.",long:true},
];

export const answersByPage = new Map();
for (const item of [...unit1, ...supplementalAnswers]) {
  const pageItems = answersByPage.get(item.page) ?? [];
  pageItems.push(item);
  answersByPage.set(item.page, pageItems);
}
