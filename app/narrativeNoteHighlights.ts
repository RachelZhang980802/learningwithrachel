import { afterTwentyStoryParagraphs } from "./afterTwentyStoryText";
import { daysWaitStoryParagraphs } from "./daysWaitStoryText";
import { veryShortStoryParagraphs } from "./veryShortStoryText";
import { earlyAutumnStoryParagraphs } from "./earlyAutumnStoryText";

// Body-only annotations transcribed from Rachel's supplied reading-note PDFs.
// Quote guards protect annotations if the source story is edited later.
type NoteMark = {paragraph:number;start:number;end:number;bg?:string;red?:boolean;italic?:boolean;ink?:string;bold?:boolean;page:number;quote:string};
function exactMarks(paragraphs: readonly string[], entries: readonly {paragraph:number;quote:string;page:number;bg?:string;red?:boolean;italic?:boolean}[]): NoteMark[] {
 return entries.map(entry=>{
  const start=paragraphs[entry.paragraph]?.indexOf(entry.quote) ?? -1;
  if(start<0) throw new Error(`PDF highlight text not found in paragraph ${entry.paragraph}: ${entry.quote}`);
  return {...entry,start,end:start+entry.quote.length};
 });
}
const noteMarks: Record<string, NoteMark[]> = {
  "reading-after-twenty": exactMarks(afterTwentyStoryParagraphs, [
    {paragraph:0,quote:"chilly gusts of wind with a taste of rain in them",page:2,red:true},
    {paragraph:1,quote:"twirling his club with many intricate and artful movements",page:2,red:true},
    {paragraph:1,quote:"cast his watchful eye adown the pacific thoroughfare",page:2,red:true},
    {paragraph:1,quote:"stalwart form and slight swagger",page:2,red:true},
    {paragraph:1,quote:"made a fine picture of a guardian of the peace",page:2,red:true},
    {paragraph:2,quote:"suddenly slowed his walk",page:3,bg:"orange"},
    {paragraph:2,quote:"a man leaned",page:3,bg:"orange"},
    {paragraph:2,quote:"As the policeman walked up to him the man spoke up quickly",page:3,bg:"orange"},
    {paragraph:5,quote:"a pale, square-jawed face with keen eyes",page:3,red:true},
    {paragraph:5,quote:"a little white scar near his right eyebrow",page:3,bg:"orange"},
    {paragraph:5,quote:"a large diamond, oddly set",page:3,bg:"orange"},
    {paragraph:8,quote:"the West is a pretty big proposition",page:4,red:true},
    {paragraph:9,quote:"The waiting man pulled out a handsome watch, the lids of it set with small diamonds.",page:4,bg:"orange"},
    {paragraph:12,quote:"He was a kind of plodder, though, good fellow as he was.",page:4,bg:"orange"},
    {paragraph:12,quote:"It takes the West to put a razor-edge on him.",page:4,bg:"orange"},
    {paragraph:17,quote:"fine, cold drizzle falling, and the wind had risen from its uncertain puffs into a steady blow",page:5,red:true},
    {paragraph:17,quote:"coat collars turned high and pocketed hands",page:5,red:true},
    {paragraph:18,quote:"went directly to the waiting man",page:5,bg:"orange"},
    {paragraph:21,quote:"grasping both the other’s hands with his own",page:5,red:true},
    {paragraph:22,quote:"I never thought you were so tall by two or three inches.",page:5,bg:"orange"},
    {paragraph:26,quote:"his egotism enlarged by success",page:6,red:true},
    {paragraph:27,quote:"When they came into this glare each of them turned simultaneously to gaze upon the other’s face.",page:6,bg:"orange"},
    {paragraph:28,quote:"stopped suddenly and released his arm",page:6,bg:"orange"},
    {paragraph:31,quote:"His hand was steady when he began to read, but it trembled a little by the time he had finished.",page:7,red:true},
    {paragraph:32,quote:"I was at the appointed place on time.",page:7,italic:true},
    {paragraph:32,quote:"Somehow I couldn’t do it myself",page:7,italic:true},
  ]),
  "reading-days-wait": exactMarks(daysWaitStoryParagraphs, [
    {paragraph:0,quote:"I saw he looked ill. He was shivering, his face was white, and he walked slowly as though it ached to move.",page:1,red:true},
    {paragraph:2,quote:"“I’ve got a headache.”",page:1,bg:"sage"},
    {paragraph:4,quote:"“No. I’m all right.”",page:1,bg:"sage"},
    {paragraph:6,quote:"looking a very sick and miserable boy of nine years. When I put my hand on his forehead I knew he had a fever.",page:1,red:true},
    {paragraph:8,quote:"“I’m all right,” he said.",page:2,bg:"sage"},
    {paragraph:11,quote:"“One hundred and two.”",page:2,bg:"sage"},
    {paragraph:12,quote:"one hundred and four degrees",page:2,bg:"sage"},
    {paragraph:15,quote:"“All right. If you want to,” said the boy. His face was very white and there were dark areas under his eyes. He lay still in bed and seemed very detached from what was going on.",page:2,red:true},
    {paragraph:19,quote:"but when I looked up he was looking at the foot of the bed, looking very strangely.",page:3,red:true},
    {paragraph:22,quote:"After a while he said to me, “You don’t have to stay here with me, Papa, if it bothers you.”",page:3,bg:"sage"},
    {paragraph:24,quote:"“No, I mean you don’t have to stay if it’s going to bother you.”",page:3,bg:"sage"},
    {paragraph:30,quote:"found him in exactly the position I had left him, white-faced, but with the tops of his cheeks flushed by the fever, staring still, as he had stared, at the foot of the bed.",page:5,red:true},
    {paragraph:33,quote:"“Something like a hundred,” I said. It was one hundred and two and four tenths.",page:5,bg:"sage"},
    {paragraph:34,quote:"“It was a hundred and two,” he said.",page:5,bg:"sage"},
    {paragraph:45,quote:"“About what time do you think I’m going to die?” he asked.",page:6,bg:"sage"},
    {paragraph:47,quote:"“About how long will it be before I die?”",page:6,bg:"sage"},
    {paragraph:51,quote:"“I know they do. At school in France the boys told me you can’t live with forty-four degrees. I’ve got a hundred and two.”",page:6,bg:"sage"},
    {paragraph:52,quote:"He had been waiting to die all day, ever since nine o’clock in the morning.",page:6,red:true},
    {paragraph:40,quote:"He was evidently holding tight onto himself about something.",page:5,red:true},
    {paragraph:57,quote:"But his gaze at the foot of his bed relaxed slowly. The hold over himself relaxed too, finally, and the next day it was very slack and he cried very easily at little things that were of no importance.",page:6,red:true},
  ]),
  "reading-short-story": exactMarks(veryShortStoryParagraphs, [
    {paragraph:4,quote:"finally wrote to the States that theirs had only been a boy and girl affair.",page:5,bg:"orange"},
    {paragraph:4,quote:"she expected, absolutely unexpectedly, to be married in the spring.",page:5,bg:"orange"},
    {paragraph:4,quote:"but she realized now it was only a boy and girl love.",page:5,bg:"orange"},
  ]),
  "reading-early-autumn": exactMarks(earlyAutumnStoryParagraphs, [
    {paragraph:0,quote:"Then something not very important had come between them, and they didn't speak. Impulsively, she had married a man she thought she loved.",page:2,bg:"orange"},
    {paragraph:5,quote:"Unconsciously, she lifted her face as though wanting a kiss, but he held out his hand. She took it.",page:2,bg:"orange"},
    {paragraph:8,quote:"“Always wondered what happened to you, Bill.”",page:2,bg:"orange"},
    {paragraph:10,quote:"“Married yet?”",page:2,bg:"orange"},
    {paragraph:26,quote:"The lights on the avenue blurred, twinkled, blurred. And she was afraid to open her mouth as she entered the bus. Afraid it would be impossible to utter a word.",page:3,bg:"orange"},
    {paragraph:28,quote:"She lost sight of Bill. Then she remembered she had forgotten to give him her address--or to ask him for his--or tell him that her youngest boy was named Bill, too.",page:3,bg:"orange"},
  ]),
  "fat": [
    {
      "paragraph": 0,
      "start": 53,
      "end": 59,
      "bg": "gold",
      "page": 3,
      "quote": "Rita’s"
    },
    {
      "paragraph": 2,
      "start": 36,
      "end": 40,
      "bg": "orange",
      "page": 3,
      "quote": "Herb"
    },
    {
      "paragraph": 3,
      "start": 53,
      "end": 105,
      "red": true,
      "page": 3,
      "quote": "though he is neat-appearing and well dressed enough."
    },
    {
      "paragraph": 4,
      "start": 138,
      "end": 145,
      "bg": "teal",
      "page": 3,
      "quote": "Leander"
    },
    {
      "paragraph": 6,
      "start": 0,
      "end": 29,
      "bg": "yellow",
      "page": 4,
      "quote": "Rita, he was big, I mean big."
    },
    {
      "paragraph": 7,
      "start": 52,
      "end": 57,
      "red": true,
      "page": 4,
      "quote": "we’re"
    },
    {
      "paragraph": 8,
      "start": 0,
      "end": 54,
      "bg": "yellow",
      "page": 4,
      "quote": "He has this way of speaking – strange, don’t you know."
    },
    {
      "paragraph": 9,
      "start": 8,
      "end": 10,
      "red": true,
      "page": 4,
      "quote": "we"
    },
    {
      "paragraph": 9,
      "start": 110,
      "end": 124,
      "red": true,
      "page": 4,
      "quote": "if you please."
    },
    {
      "paragraph": 9,
      "start": 195,
      "end": 200,
      "red": true,
      "page": 4,
      "quote": "We’ll"
    },
    {
      "paragraph": 9,
      "start": 226,
      "end": 246,
      "red": true,
      "page": 4,
      "quote": "Thank you very much,"
    },
    {
      "paragraph": 10,
      "start": 0,
      "end": 34,
      "bg": "yellow",
      "page": 4,
      "quote": "God, Rita, but those were fingers."
    },
    {
      "paragraph": 11,
      "start": 53,
      "end": 58,
      "bg": "blue",
      "page": 4,
      "quote": "Rudy,"
    },
    {
      "paragraph": 11,
      "start": 72,
      "end": 84,
      "bg": "gray",
      "page": 4,
      "quote": "with a face."
    },
    {
      "paragraph": 11,
      "start": 85,
      "end": 131,
      "bg": "yellow",
      "page": 4,
      "quote": "You know Rudy. Rudy is that way when he works."
    },
    {
      "paragraph": 12,
      "start": 30,
      "end": 35,
      "bg": "purple",
      "page": 4,
      "quote": "Margo"
    },
    {
      "paragraph": 12,
      "start": 38,
      "end": 89,
      "bg": "yellow",
      "page": 4,
      "quote": "I’ve told you about Margo? The one who chases Rudy?"
    },
    {
      "paragraph": 12,
      "start": 108,
      "end": 151,
      "bg": "gray",
      "page": 4,
      "quote": "Who’s your fat friend? He’s really a fatty."
    },
    {
      "paragraph": 14,
      "start": 0,
      "end": 57,
      "bg": "yellow",
      "page": 6,
      "quote": "Now that’s part of it. I think that is really part of it."
    },
    {
      "paragraph": 15,
      "start": 44,
      "end": 71,
      "red": true,
      "page": 6,
      "quote": "him watching my every move,"
    },
    {
      "paragraph": 15,
      "start": 188,
      "end": 251,
      "italic": true,
      "page": 0,
      "quote": "I am so keyed up or something. I knock over his glass of water."
    },
    {
      "paragraph": 17,
      "start": 0,
      "end": 95,
      "red": true,
      "page": 6,
      "quote": "It’s nothing, he says. It’s all right, he says, and puffs. Don’t worry about it, we don’t mind,"
    },
    {
      "paragraph": 18,
      "start": 16,
      "end": 44,
      "italic": true,
      "page": 0,
      "quote": "when I bring him more bread,"
    },
    {
      "paragraph": 18,
      "start": 72,
      "end": 113,
      "bg": "yellow",
      "page": 6,
      "quote": "You know the size of those Caesar salads?"
    },
    {
      "paragraph": 19,
      "start": 0,
      "end": 17,
      "red": true,
      "page": 6,
      "quote": "You’re very kind,"
    },
    {
      "paragraph": 19,
      "start": 27,
      "end": 61,
      "red": true,
      "page": 6,
      "quote": "This bread is marvellous, he says."
    },
    {
      "paragraph": 21,
      "start": 0,
      "end": 96,
      "red": true,
      "page": 6,
      "quote": "Well, it is very good, he says, and we mean that. We don’t often enjoy bread like this, he says."
    },
    {
      "paragraph": 23,
      "start": 0,
      "end": 70,
      "bg": "yellow",
      "page": 7,
      "quote": "He’s not the kind of person you’d forget, Rita puts in with a snicker."
    },
    {
      "paragraph": 25,
      "start": 0,
      "end": 62,
      "italic": true,
      "page": 0,
      "quote": "I don’t say anything more on the subject, though I am curious."
    },
    {
      "paragraph": 28,
      "start": 0,
      "end": 66,
      "red": true,
      "page": 7,
      "quote": "Believe me, he says, we don’t eat like this all the time, he says."
    },
    {
      "paragraph": 28,
      "start": 78,
      "end": 112,
      "red": true,
      "page": 7,
      "quote": "You’ll have to excuse us, he says."
    },
    {
      "paragraph": 29,
      "start": 0,
      "end": 94,
      "italic": true,
      "page": 0,
      "quote": "Don’t think a thing about it, please, I say. I like to see a man eat and enjoy himself, I say."
    },
    {
      "paragraph": 31,
      "start": 0,
      "end": 28,
      "bg": "gray",
      "page": 9,
      "quote": "God, he’s fat! says Leander."
    },
    {
      "paragraph": 32,
      "start": 0,
      "end": 36,
      "italic": true,
      "page": 0,
      "quote": "He can’t help it, I say, so shut up."
    },
    {
      "paragraph": 33,
      "start": 0,
      "end": 51,
      "italic": true,
      "page": 0,
      "quote": "I put down another basket of bread and more butter."
    },
    {
      "paragraph": 34,
      "start": 0,
      "end": 10,
      "red": true,
      "page": 9,
      "quote": "Thank you."
    },
    {
      "paragraph": 34,
      "start": 26,
      "end": 36,
      "red": true,
      "page": 9,
      "quote": "Very good,"
    },
    {
      "paragraph": 34,
      "start": 46,
      "end": 132,
      "red": true,
      "page": 9,
      "quote": "He wipes his lips and dabs his chin. Do you think it’s warm in here, or is it just me?"
    },
    {
      "paragraph": 36,
      "start": 6,
      "end": 11,
      "red": true,
      "page": 9,
      "quote": "we’ll"
    },
    {
      "paragraph": 37,
      "start": 0,
      "end": 61,
      "italic": true,
      "page": 0,
      "quote": "Go right ahead, I say. A person has to be comfortable, I say."
    },
    {
      "paragraph": 40,
      "start": 142,
      "end": 175,
      "italic": true,
      "page": 0,
      "quote": "along with more bread and butter,"
    },
    {
      "paragraph": 41,
      "start": 92,
      "end": 126,
      "italic": true,
      "page": 0,
      "quote": "I bring him more bread and butter."
    },
    {
      "paragraph": 42,
      "start": 0,
      "end": 24,
      "italic": true,
      "page": 0,
      "quote": "Is everything all right?"
    },
    {
      "paragraph": 42,
      "start": 60,
      "end": 81,
      "red": true,
      "page": 9,
      "quote": "Excellent, thank you,"
    },
    {
      "paragraph": 43,
      "start": 26,
      "end": 72,
      "italic": true,
      "page": 0,
      "quote": "I raise the lid of his sugar bowl and look in."
    },
    {
      "paragraph": 43,
      "start": 73,
      "end": 123,
      "red": true,
      "page": 9,
      "quote": "He nods and keeps looking at me until I move away."
    },
    {
      "paragraph": 44,
      "start": 0,
      "end": 55,
      "bg": "pink",
      "italic": true,
      "page": 10,
      "quote": "I know now I was after something. But I don’t know what"
    },
    {
      "paragraph": 44,
      "start": 55,
      "end": 56,
      "italic": true,
      "page": 0,
      "quote": "."
    },
    {
      "paragraph": 45,
      "start": 7,
      "end": 22,
      "bg": "gray",
      "page": 10,
      "quote": "old tub-of-guts"
    },
    {
      "paragraph": 45,
      "start": 30,
      "end": 62,
      "bg": "gray",
      "page": 10,
      "quote": "He’s going to run your legs off,"
    },
    {
      "paragraph": 45,
      "start": 68,
      "end": 76,
      "bg": "rose",
      "page": 10,
      "quote": "Harriet."
    },
    {
      "paragraph": 45,
      "start": 77,
      "end": 94,
      "bg": "yellow",
      "page": 10,
      "quote": "You know Harriet."
    },
    {
      "paragraph": 47,
      "start": 0,
      "end": 34,
      "red": true,
      "page": 10,
      "quote": "We’re not making you late, are we?"
    },
    {
      "paragraph": 47,
      "start": 56,
      "end": 74,
      "red": true,
      "page": 10,
      "quote": "looking concerned."
    },
    {
      "paragraph": 48,
      "start": 0,
      "end": 119,
      "italic": true,
      "page": 0,
      "quote": "Not at all, I say. Of course not, I say. Take your time, I say. I’ll bring you more coffee while you make up your mind."
    },
    {
      "paragraph": 49,
      "start": 0,
      "end": 25,
      "red": true,
      "page": 10,
      "quote": "We’ll be honest with you,"
    },
    {
      "paragraph": 49,
      "start": 61,
      "end": 220,
      "red": true,
      "page": 10,
      "quote": "We would like the Special, but we may have a dish of vanilla ice cream as well. With just a drop of chocolate syrup, if you please. We told you we were hungry,"
    },
    {
      "paragraph": 50,
      "start": 61,
      "end": 65,
      "bg": "blue",
      "page": 10,
      "quote": "Rudy"
    },
    {
      "paragraph": 50,
      "start": 72,
      "end": 129,
      "bg": "gray",
      "page": 10,
      "quote": "Harriet says you got a fat man from the circus out there."
    },
    {
      "paragraph": 51,
      "start": 36,
      "end": 59,
      "bg": "yellow",
      "page": 10,
      "quote": "if you see what I mean."
    },
    {
      "paragraph": 52,
      "start": 0,
      "end": 56,
      "italic": true,
      "page": 0,
      "quote": "Rudy, he is fat, I say, but that is not the whole story."
    },
    {
      "paragraph": 54,
      "start": 0,
      "end": 43,
      "bg": "gray",
      "page": 10,
      "quote": "Sounds to me like she’s sweet on fat-stuff,"
    },
    {
      "paragraph": 55,
      "start": 0,
      "end": 23,
      "bg": "gray",
      "page": 10,
      "quote": "Better watch out, Rudy,"
    },
    {
      "paragraph": 55,
      "start": 29,
      "end": 36,
      "bg": "cream",
      "page": 10,
      "quote": "Joanne,"
    },
    {
      "paragraph": 56,
      "start": 0,
      "end": 20,
      "bg": "gray",
      "page": 10,
      "quote": "I’m getting jealous,"
    },
    {
      "paragraph": 58,
      "start": 0,
      "end": 10,
      "red": true,
      "page": 12,
      "quote": "Thank you,"
    },
    {
      "paragraph": 59,
      "start": 34,
      "end": 57,
      "bg": "pink",
      "italic": true,
      "page": 12,
      "quote": "a feeling comes over me"
    },
    {
      "paragraph": 59,
      "start": 57,
      "end": 58,
      "italic": true,
      "page": 0,
      "quote": "."
    },
    {
      "paragraph": 60,
      "start": 0,
      "end": 63,
      "red": true,
      "page": 12,
      "quote": "Believe it or not, he says, we have not always eaten like this."
    },
    {
      "paragraph": 61,
      "start": 0,
      "end": 67,
      "italic": true,
      "page": 0,
      "quote": "Me, I eat and eat and I can’t gain, I say. I’d like to gain, I say."
    },
    {
      "paragraph": 62,
      "start": 13,
      "end": 62,
      "red": true,
      "page": 12,
      "quote": "If we had our choice, no. But there is no choice."
    },
    {
      "paragraph": 64,
      "start": 0,
      "end": 143,
      "bg": "yellow",
      "page": 12,
      "quote": "What else? Rita says, lighting one of my cigarettes and pulling her chair closer to the table. This story’s getting interesting now, Rita says."
    },
    {
      "paragraph": 65,
      "start": 0,
      "end": 24,
      "bg": "yellow",
      "page": 12,
      "quote": "That’s it. Nothing else."
    },
    {
      "paragraph": 66,
      "start": 64,
      "end": 117,
      "bg": "gray",
      "page": 12,
      "quote": "Then he just laughs and goes back to watching the TV."
    },
    {
      "paragraph": 67,
      "start": 85,
      "end": 181,
      "italic": true,
      "page": 0,
      "quote": "wonder what would happen if I had children and one of them turned out to look like that, so fat."
    },
    {
      "paragraph": 68,
      "start": 164,
      "end": 574,
      "bg": "gray",
      "page": 13,
      "quote": "I knew a fat guy once, a couple of fat guys, really fat guys, when I was a kid. They were tubbies, my God. I don’t remember their names. Fat, that’s the only name this one kid had. We called him Fat, the kid who lived next door to me. He was a neighbour. The other kid came along later. His name was Wobbly. Everybody called him Wobbly except the teachers. Wobbly and Fat. Wish I had their pictures, Rudy says."
    },
    {
      "paragraph": 69,
      "start": 0,
      "end": 33,
      "bg": "pink",
      "italic": true,
      "page": 13,
      "quote": "I can’t think of anything to say,"
    },
    {
      "paragraph": 70,
      "start": 0,
      "end": 74,
      "bg": "pink",
      "italic": true,
      "page": 13,
      "quote": "I get into bed and move clear over to the edge and lie there on my stomach"
    },
    {
      "paragraph": 70,
      "start": 74,
      "end": 75,
      "italic": true,
      "page": 0,
      "quote": "."
    },
    {
      "paragraph": 70,
      "start": 191,
      "end": 220,
      "bg": "pink",
      "italic": true,
      "page": 13,
      "quote": "though it is against my will."
    },
    {
      "paragraph": 70,
      "start": 244,
      "end": 377,
      "bg": "pink",
      "page": 13,
      "quote": "When he gets on me, I suddenly feel I am fat. I feel I am terrifically fat, so fat that Rudy is a tiny thing and hardly there at all."
    },
    {
      "paragraph": 71,
      "start": 0,
      "end": 83,
      "bg": "yellow",
      "page": 13,
      "quote": "That’s a funny story, Rita says, but I can see she doesn’t know what to make of it."
    },
    {
      "paragraph": 72,
      "start": 0,
      "end": 16,
      "bg": "pink",
      "italic": true,
      "page": 13,
      "quote": "I feel depressed"
    },
    {
      "paragraph": 72,
      "start": 16,
      "end": 17,
      "italic": true,
      "page": 0,
      "quote": "."
    },
    {
      "paragraph": 75,
      "start": 0,
      "end": 12,
      "bg": "pink",
      "italic": true,
      "page": 13,
      "quote": "It is August"
    },
    {
      "paragraph": 75,
      "start": 12,
      "end": 13,
      "italic": true,
      "page": 0,
      "quote": "."
    },
    {
      "paragraph": 76,
      "start": 0,
      "end": 38,
      "bg": "pink",
      "page": 13,
      "quote": "My life is going to change. I feel it."
    }
  ],
  "necklace": [
    {
      "paragraph": 0,
      "start": 26,
      "end": 45,
      "bg": "green",
      "page": 2,
      "quote": "pretty and charming"
    },
    {
      "paragraph": 0,
      "start": 86,
      "end": 110,
      "red": true,
      "page": 2,
      "quote": "as if by a slip of fate,"
    },
    {
      "paragraph": 0,
      "start": 136,
      "end": 212,
      "bg": "green",
      "page": 2,
      "quote": "She had no dowry, no expectations, no way of being known, understood, loved,"
    },
    {
      "paragraph": 1,
      "start": 58,
      "end": 124,
      "bg": "green",
      "page": 3,
      "quote": "she was unhappy as if she had really fallen from a higher station;"
    },
    {
      "paragraph": 1,
      "start": 125,
      "end": 405,
      "red": true,
      "page": 3,
      "quote": "since with women there is neither caste nor rank, for beauty, grace and charm take the place of family and birth. Natural ingenuity, instinct for what is elegant, a supple mind are their sole hierarchy, and often make of women of the people the equals of the very greatest ladies."
    },
    {
      "paragraph": 2,
      "start": 9,
      "end": 30,
      "bg": "green",
      "page": 3,
      "quote": "suffered ceaselessly,"
    },
    {
      "paragraph": 2,
      "start": 102,
      "end": 112,
      "bg": "green",
      "page": 3,
      "quote": "distressed"
    },
    {
      "paragraph": 2,
      "start": 168,
      "end": 174,
      "red": true,
      "page": 3,
      "quote": "walls,"
    },
    {
      "paragraph": 2,
      "start": 189,
      "end": 196,
      "red": true,
      "page": 3,
      "quote": "chairs,"
    },
    {
      "paragraph": 2,
      "start": 217,
      "end": 226,
      "red": true,
      "page": 3,
      "quote": "curtains."
    },
    {
      "paragraph": 2,
      "start": 227,
      "end": 350,
      "bg": "green",
      "page": 3,
      "quote": "All those things, of which another woman of her rank would never even have been conscious, tortured her and made her angry."
    },
    {
      "paragraph": 2,
      "start": 434,
      "end": 476,
      "bg": "green",
      "page": 3,
      "quote": "despairing regrets and bewildering dreams."
    },
    {
      "paragraph": 2,
      "start": 499,
      "end": 511,
      "red": true,
      "page": 3,
      "quote": "antechambers"
    },
    {
      "paragraph": 2,
      "start": 522,
      "end": 540,
      "red": true,
      "page": 3,
      "quote": "Oriental tapestry,"
    },
    {
      "paragraph": 2,
      "start": 554,
      "end": 577,
      "red": true,
      "page": 3,
      "quote": "tall bronze candelabra,"
    },
    {
      "paragraph": 2,
      "start": 701,
      "end": 715,
      "bg": "green",
      "page": 3,
      "quote": "She thought of"
    },
    {
      "paragraph": 2,
      "start": 716,
      "end": 736,
      "bg": "green",
      "red": true,
      "page": 3,
      "quote": "long reception halls"
    },
    {
      "paragraph": 2,
      "start": 737,
      "end": 746,
      "bg": "green",
      "page": 3,
      "quote": "hung with"
    },
    {
      "paragraph": 2,
      "start": 747,
      "end": 760,
      "bg": "green",
      "red": true,
      "page": 3,
      "quote": "ancient silk,"
    },
    {
      "paragraph": 2,
      "start": 761,
      "end": 767,
      "bg": "green",
      "page": 3,
      "quote": "of the"
    },
    {
      "paragraph": 2,
      "start": 768,
      "end": 783,
      "bg": "green",
      "red": true,
      "page": 3,
      "quote": "dainty cabinets"
    },
    {
      "paragraph": 2,
      "start": 784,
      "end": 834,
      "bg": "green",
      "page": 3,
      "quote": "containing priceless curiosities and of the little"
    },
    {
      "paragraph": 2,
      "start": 835,
      "end": 870,
      "bg": "green",
      "red": true,
      "page": 3,
      "quote": "coquettish perfumed reception rooms"
    },
    {
      "paragraph": 2,
      "start": 871,
      "end": 1018,
      "bg": "green",
      "page": 3,
      "quote": "made for chatting at five o’clock with intimate friends, with men famous and sought after, whom all women envy and whose attention they all desire."
    },
    {
      "paragraph": 3,
      "start": 67,
      "end": 96,
      "red": true,
      "page": 3,
      "quote": "tablecloth in use three days,"
    },
    {
      "paragraph": 3,
      "start": 106,
      "end": 244,
      "bg": "yellow",
      "red": true,
      "page": 3,
      "quote": "her husband, who uncovered the soup tureen and declared with a delighted air, “Ah, the good soup! I don’t know anything better than that,”"
    },
    {
      "paragraph": 3,
      "start": 260,
      "end": 275,
      "red": true,
      "page": 3,
      "quote": "dainty dinners,"
    },
    {
      "paragraph": 3,
      "start": 287,
      "end": 298,
      "red": true,
      "page": 3,
      "quote": "silverware,"
    },
    {
      "paragraph": 3,
      "start": 302,
      "end": 310,
      "red": true,
      "page": 3,
      "quote": "tapestry"
    },
    {
      "paragraph": 3,
      "start": 406,
      "end": 419,
      "red": true,
      "page": 3,
      "quote": "fairy forest;"
    },
    {
      "paragraph": 3,
      "start": 491,
      "end": 516,
      "red": true,
      "page": 3,
      "quote": "the whispered gallantries"
    },
    {
      "paragraph": 4,
      "start": 0,
      "end": 183,
      "bg": "green",
      "page": 3,
      "quote": "She had no gowns, no jewels, nothing. And she loved nothing but that. She felt made for that. She would have liked so much to please, to be envied, to be charming, to be sought after."
    },
    {
      "paragraph": 5,
      "start": 72,
      "end": 159,
      "bg": "green",
      "page": 3,
      "quote": "whom she did not like to go to see any more because she felt so sad when she came home."
    },
    {
      "paragraph": 6,
      "start": 16,
      "end": 104,
      "bg": "yellow",
      "page": 4,
      "quote": "her husband reached home with a triumphant air and holding a large envelope in his hand."
    },
    {
      "paragraph": 10,
      "start": 58,
      "end": 63,
      "bg": "green",
      "red": true,
      "page": 4,
      "quote": "threw"
    },
    {
      "paragraph": 10,
      "start": 92,
      "end": 100,
      "bg": "green",
      "page": 4,
      "quote": "crossly,"
    },
    {
      "paragraph": 13,
      "start": 23,
      "end": 64,
      "bg": "green",
      "red": true,
      "page": 4,
      "quote": "an irritated glance and said impatiently:"
    },
    {
      "paragraph": 15,
      "start": 31,
      "end": 41,
      "red": true,
      "page": 5,
      "quote": "stammered:"
    },
    {
      "paragraph": 17,
      "start": 58,
      "end": 146,
      "bg": "green",
      "page": 5,
      "quote": "Two great tears ran slowly from the corners of her eyes toward the corners of her mouth."
    },
    {
      "paragraph": 19,
      "start": 0,
      "end": 23,
      "bg": "green",
      "page": 5,
      "quote": "By a violent effort she"
    },
    {
      "paragraph": 19,
      "start": 24,
      "end": 33,
      "bg": "green",
      "red": true,
      "page": 5,
      "quote": "conquered"
    },
    {
      "paragraph": 19,
      "start": 34,
      "end": 104,
      "bg": "green",
      "page": 5,
      "quote": "her grief and replied in a calm voice, while she wiped her wet cheeks:"
    },
    {
      "paragraph": 21,
      "start": 0,
      "end": 30,
      "bg": "yellow",
      "page": 5,
      "quote": "He was in despair. He resumed:"
    },
    {
      "paragraph": 23,
      "start": 0,
      "end": 200,
      "bg": "green",
      "page": 5,
      "quote": "She reflected several seconds, making her calculations and wondering also what sum she could ask without drawing on herself an immediate refusal and a frightened exclamation from the economical clerk."
    },
    {
      "paragraph": 26,
      "start": 3,
      "end": 22,
      "red": true,
      "page": 5,
      "quote": "grew a little pale,"
    },
    {
      "paragraph": 26,
      "start": 23,
      "end": 221,
      "bg": "yellow",
      "page": 5,
      "quote": "because he was laying aside just that amount to buy a gun and treat himself to a little shooting next summer on the plain of Nanterre, with several friends who went to shoot larks there of a Sunday."
    },
    {
      "paragraph": 29,
      "start": 48,
      "end": 76,
      "red": true,
      "page": 5,
      "quote": "seemed sad, uneasy, anxious."
    },
    {
      "paragraph": 32,
      "start": 1,
      "end": 163,
      "bg": "green",
      "page": 6,
      "quote": "It annoys me not to have a single piece of jewelry, not a single ornament, nothing to put on. I shall look poverty-stricken. I would almost rather not go at all.”"
    },
    {
      "paragraph": 35,
      "start": 1,
      "end": 88,
      "bg": "green",
      "page": 6,
      "quote": "No; there’s nothing more humiliating than to look poor among other women who are rich.”"
    },
    {
      "paragraph": 42,
      "start": 178,
      "end": 256,
      "bg": "green",
      "page": 7,
      "quote": "hesitated and could not make up her mind to part with them, to give them back."
    },
    {
      "paragraph": 42,
      "start": 261,
      "end": 273,
      "red": true,
      "page": 7,
      "quote": "kept asking:"
    },
    {
      "paragraph": 45,
      "start": 0,
      "end": 77,
      "bg": "green",
      "page": 7,
      "quote": "Suddenly she discovered, in a black satin box, a superb diamond necklace, and"
    },
    {
      "paragraph": 45,
      "start": 78,
      "end": 123,
      "bg": "green",
      "red": true,
      "page": 7,
      "quote": "her heart throbbed with an immoderate desire."
    },
    {
      "paragraph": 45,
      "start": 124,
      "end": 231,
      "bg": "green",
      "page": 7,
      "quote": "Her hands trembled as she took it. She fastened it round her throat, outside her high-necked waist, and was"
    },
    {
      "paragraph": 45,
      "start": 232,
      "end": 247,
      "bg": "green",
      "red": true,
      "page": 7,
      "quote": "lost in ecstasy"
    },
    {
      "paragraph": 45,
      "start": 248,
      "end": 280,
      "bg": "green",
      "page": 7,
      "quote": "at her reflection in the mirror."
    },
    {
      "paragraph": 46,
      "start": 9,
      "end": 54,
      "bg": "green",
      "red": true,
      "page": 7,
      "quote": "asked, hesitating, filled with anxious doubt:"
    },
    {
      "paragraph": 49,
      "start": 4,
      "end": 24,
      "red": true,
      "page": 7,
      "quote": "threw her arms round"
    },
    {
      "paragraph": 49,
      "start": 44,
      "end": 68,
      "red": true,
      "page": 7,
      "quote": "kissed her passionately,"
    },
    {
      "paragraph": 49,
      "start": 74,
      "end": 78,
      "red": true,
      "page": 7,
      "quote": "fled"
    },
    {
      "paragraph": 51,
      "start": 0,
      "end": 63,
      "bg": "green",
      "red": true,
      "page": 8,
      "quote": "She danced with rapture, with passion, intoxicated by pleasure,"
    },
    {
      "paragraph": 51,
      "start": 64,
      "end": 299,
      "bg": "green",
      "page": 8,
      "quote": "forgetting all in the triumph of her beauty, in the glory of her success, in a sort of cloud of happiness comprised of all this homage, admiration, these awakened desires and of that sense of triumph which is so sweet to woman’s heart."
    },
    {
      "paragraph": 52,
      "start": 53,
      "end": 154,
      "bg": "yellow",
      "page": 8,
      "quote": "Her husband had been sleeping since midnight in a little deserted anteroom with three other gentlemen"
    },
    {
      "paragraph": 53,
      "start": 0,
      "end": 53,
      "bg": "green",
      "page": 8,
      "quote": "He threw over her shoulders the wraps he had brought,"
    },
    {
      "paragraph": 53,
      "start": 54,
      "end": 155,
      "bg": "green",
      "red": true,
      "page": 8,
      "quote": "the modest wraps of common life, the poverty of which contrasted with the elegance of the ball dress."
    },
    {
      "paragraph": 53,
      "start": 156,
      "end": 269,
      "bg": "green",
      "page": 8,
      "quote": "She felt this and wished to escape so as not to be remarked by the other women, who were enveloping themselves in"
    },
    {
      "paragraph": 53,
      "start": 270,
      "end": 282,
      "bg": "green",
      "red": true,
      "page": 8,
      "quote": "costly furs."
    },
    {
      "paragraph": 54,
      "start": 0,
      "end": 91,
      "bg": "yellow",
      "page": 8,
      "quote": "Loisel held her back, saying: “Wait a bit. You will catch cold outside. I will call a cab.”"
    },
    {
      "paragraph": 56,
      "start": 60,
      "end": 243,
      "bg": "orange",
      "page": 8,
      "quote": "At last they found on the quay one of those ancient night cabs which, as though they were ashamed to show their shabbiness during the day, are never seen round Paris until after dark."
    },
    {
      "paragraph": 57,
      "start": 127,
      "end": 211,
      "bg": "yellow",
      "page": 8,
      "quote": "As to him, he reflected that he must be at the ministry at ten o’clock that morning."
    },
    {
      "paragraph": 58,
      "start": 0,
      "end": 167,
      "bg": "green",
      "page": 8,
      "quote": "She removed her wraps before the glass so as to see herself once more in all her glory. But suddenly she uttered a cry. She no longer had the necklace around her neck!"
    },
    {
      "paragraph": 71,
      "start": 43,
      "end": 77,
      "bg": "yellow",
      "page": 9,
      "quote": "At last Loisel put on his clothes."
    },
    {
      "paragraph": 73,
      "start": 59,
      "end": 139,
      "red": true,
      "page": 9,
      "quote": "without strength to go to bed, overwhelmed, without any fire, without a thought."
    },
    {
      "paragraph": 75,
      "start": 126,
      "end": 174,
      "bg": "yellow",
      "red": true,
      "page": 9,
      "quote": "whither he was urged by the least spark of hope."
    },
    {
      "paragraph": 76,
      "start": 0,
      "end": 44,
      "bg": "green",
      "page": 9,
      "quote": "She waited all day, in the same condition of"
    },
    {
      "paragraph": 76,
      "start": 45,
      "end": 84,
      "bg": "green",
      "red": true,
      "page": 9,
      "quote": "mad fear before this terrible calamity."
    },
    {
      "paragraph": 77,
      "start": 0,
      "end": 24,
      "bg": "yellow",
      "page": 9,
      "quote": "Loisel returned at night"
    },
    {
      "paragraph": 77,
      "start": 25,
      "end": 50,
      "bg": "yellow",
      "red": true,
      "page": 9,
      "quote": "with a hollow, pale face."
    },
    {
      "paragraph": 77,
      "start": 51,
      "end": 77,
      "bg": "yellow",
      "page": 9,
      "quote": "He had discovered nothing."
    },
    {
      "paragraph": 80,
      "start": 45,
      "end": 87,
      "bg": "yellow",
      "red": true,
      "page": 10,
      "quote": "Loisel, who had aged five years, declared:"
    },
    {
      "paragraph": 83,
      "start": 1,
      "end": 86,
      "red": true,
      "page": 10,
      "quote": "It was not I, madame, who sold that necklace; I must simply have furnished the case.”"
    },
    {
      "paragraph": 84,
      "start": 102,
      "end": 135,
      "red": true,
      "page": 10,
      "quote": "both sick with chagrin and grief."
    },
    {
      "paragraph": 85,
      "start": 120,
      "end": 190,
      "red": true,
      "page": 10,
      "quote": "It was worth forty thousand francs. They could have it for thirty-six."
    },
    {
      "paragraph": 86,
      "start": 117,
      "end": 145,
      "red": true,
      "page": 10,
      "quote": "thirty-four thousand francs,"
    },
    {
      "paragraph": 87,
      "start": 76,
      "end": 88,
      "red": true,
      "page": 10,
      "quote": "would borrow"
    },
    {
      "paragraph": 88,
      "start": 0,
      "end": 200,
      "bg": "yellow",
      "red": true,
      "page": 10,
      "quote": "He did borrow, asking a thousand francs of one, five hundred of another, five louis here, three louis there. He gave notes, took up ruinous obligations, dealt with usurers and all the race of lenders."
    },
    {
      "paragraph": 88,
      "start": 201,
      "end": 591,
      "bg": "yellow",
      "page": 10,
      "quote": "He compromised all the rest of his life, risked signing a note without even knowing whether he could meet it; and, frightened by the trouble yet to come, by the black misery that was about to fall upon him, by the prospect of all the physical privations and moral tortures that he was to suffer, he went to get the new necklace, laying upon the jeweler’s counter thirty-six thousand francs."
    },
    {
      "paragraph": 89,
      "start": 76,
      "end": 92,
      "red": true,
      "page": 11,
      "quote": "a chilly manner:"
    },
    {
      "paragraph": 91,
      "start": 0,
      "end": 205,
      "red": true,
      "page": 11,
      "quote": "She did not open the case, as her friend had so much feared. If she had detected the substitution, what would she have thought, what would she have said? Would she not have taken Madame Loisel for a thief?"
    },
    {
      "paragraph": 92,
      "start": 0,
      "end": 148,
      "bg": "green",
      "page": 11,
      "quote": "Thereafter Madame Loisel knew the horrible existence of the needy. She bore her part, however, with sudden heroism. That dreadful debt must be paid."
    },
    {
      "paragraph": 92,
      "start": 149,
      "end": 166,
      "bg": "green",
      "red": true,
      "page": 11,
      "quote": "She would pay it."
    },
    {
      "paragraph": 92,
      "start": 167,
      "end": 262,
      "bg": "green",
      "page": 11,
      "quote": "They dismissed their servant; they changed their lodgings; they rented a garret under the roof."
    },
    {
      "paragraph": 93,
      "start": 0,
      "end": 168,
      "red": true,
      "page": 11,
      "quote": "She came to know what heavy housework meant and the odious cares of the kitchen. She washed the dishes, using her dainty fingers and rosy nails on greasy pots and pans."
    },
    {
      "paragraph": 93,
      "start": 529,
      "end": 571,
      "red": true,
      "page": 11,
      "quote": "defending her miserable money, sou by sou."
    },
    {
      "paragraph": 95,
      "start": 0,
      "end": 129,
      "bg": "yellow",
      "page": 11,
      "quote": "Her husband worked evenings, making up a tradesman’s accounts, and late at night he often copied manuscript for five sous a page."
    },
    {
      "paragraph": 98,
      "start": 21,
      "end": 24,
      "red": true,
      "page": 12,
      "quote": "old"
    },
    {
      "paragraph": 98,
      "start": 30,
      "end": 223,
      "red": true,
      "page": 12,
      "quote": "She had become the woman of impoverished households—strong and hard and rough. With frowsy hair, skirts askew and red hands, she talked loud while washing the floor with great swishes of water."
    },
    {
      "paragraph": 104,
      "start": 11,
      "end": 21,
      "red": true,
      "page": 12,
      "quote": "astonished"
    }
  ],
  "reading-last-leaf": [
    {
      "paragraph": 0,
      "start": 22,
      "end": 27,
      "page": 2,
      "ink": "purple",
      "bold": true,
      "quote": "story"
    },
    {
      "paragraph": 0,
      "start": 59,
      "end": 62,
      "page": 2,
      "bold": true,
      "quote": "had"
    },
    {
      "paragraph": 0,
      "start": 69,
      "end": 76,
      "page": 2,
      "ink": "purple",
      "bold": true,
      "quote": "studio."
    },
    {
      "paragraph": 0,
      "start": 86,
      "end": 89,
      "page": 2,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 0,
      "start": 163,
      "end": 170,
      "page": 2,
      "bold": true,
      "quote": "had met"
    },
    {
      "paragraph": 0,
      "start": 202,
      "end": 207,
      "page": 2,
      "bold": true,
      "quote": "found"
    },
    {
      "paragraph": 0,
      "start": 214,
      "end": 220,
      "page": 2,
      "ink": "purple",
      "bold": true,
      "quote": "tastes"
    },
    {
      "paragraph": 0,
      "start": 229,
      "end": 236,
      "page": 2,
      "ink": "purple",
      "bold": true,
      "quote": "chicory"
    },
    {
      "paragraph": 0,
      "start": 247,
      "end": 261,
      "page": 3,
      "ink": "purple",
      "bold": true,
      "quote": "bishop sleeves"
    },
    {
      "paragraph": 0,
      "start": 270,
      "end": 277,
      "page": 3,
      "ink": "purple",
      "bold": true,
      "quote": "in tune"
    },
    {
      "paragraph": 0,
      "start": 300,
      "end": 309,
      "page": 3,
      "bold": true,
      "quote": "resulted."
    },
    {
      "paragraph": 1,
      "start": 5,
      "end": 8,
      "page": 5,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 1,
      "start": 17,
      "end": 70,
      "page": 5,
      "bg": "slate",
      "quote": "In November a cold, unseen stranger, whom the doctors"
    },
    {
      "paragraph": 1,
      "start": 71,
      "end": 77,
      "page": 5,
      "bg": "slate",
      "bold": true,
      "quote": "called"
    },
    {
      "paragraph": 1,
      "start": 78,
      "end": 88,
      "page": 5,
      "bg": "slate",
      "ink": "purple",
      "bold": true,
      "quote": "Pneumonia,"
    },
    {
      "paragraph": 1,
      "start": 89,
      "end": 96,
      "page": 5,
      "bg": "slate",
      "bold": true,
      "quote": "stalked"
    },
    {
      "paragraph": 1,
      "start": 97,
      "end": 166,
      "page": 5,
      "bg": "slate",
      "quote": "about the district, touching one here and there with his icy fingers."
    },
    {
      "paragraph": 1,
      "start": 174,
      "end": 177,
      "page": 5,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 1,
      "start": 188,
      "end": 196,
      "page": 6,
      "ink": "purple",
      "bold": true,
      "quote": "victims."
    },
    {
      "paragraph": 1,
      "start": 201,
      "end": 205,
      "page": 6,
      "bold": true,
      "quote": "lay,"
    },
    {
      "paragraph": 1,
      "start": 206,
      "end": 214,
      "page": 6,
      "ink": "purple",
      "bold": true,
      "quote": "scarcely"
    },
    {
      "paragraph": 1,
      "start": 274,
      "end": 279,
      "page": 6,
      "ink": "purple",
      "bold": true,
      "quote": "blank"
    },
    {
      "paragraph": 2,
      "start": 28,
      "end": 35,
      "page": 7,
      "bold": true,
      "quote": "invited"
    },
    {
      "paragraph": 2,
      "start": 64,
      "end": 70,
      "page": 7,
      "ink": "purple",
      "bold": true,
      "quote": "bushy,"
    },
    {
      "paragraph": 3,
      "start": 5,
      "end": 8,
      "page": 8,
      "bold": true,
      "quote": "has"
    },
    {
      "paragraph": 3,
      "start": 32,
      "end": 37,
      "page": 8,
      "bold": true,
      "quote": "said."
    },
    {
      "paragraph": 3,
      "start": 55,
      "end": 57,
      "page": 8,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 3,
      "start": 100,
      "end": 111,
      "page": 8,
      "bold": true,
      "quote": "has made up"
    },
    {
      "paragraph": 3,
      "start": 132,
      "end": 141,
      "page": 8,
      "bold": true,
      "quote": "not going"
    },
    {
      "paragraph": 3,
      "start": 155,
      "end": 158,
      "page": 8,
      "bold": true,
      "quote": "Has"
    },
    {
      "paragraph": 4,
      "start": 11,
      "end": 17,
      "page": 8,
      "bold": true,
      "quote": "wanted"
    },
    {
      "paragraph": 4,
      "start": 31,
      "end": 44,
      "page": 8,
      "ink": "purple",
      "bold": true,
      "quote": "Bay of Naples"
    },
    {
      "paragraph": 4,
      "start": 55,
      "end": 59,
      "page": 8,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 5,
      "start": 1,
      "end": 7,
      "page": 9,
      "bg": "green",
      "quote": "Paint?"
    },
    {
      "paragraph": 5,
      "start": 10,
      "end": 15,
      "page": 9,
      "bg": "green",
      "ink": "purple",
      "bold": true,
      "quote": "bosh!"
    },
    {
      "paragraph": 5,
      "start": 16,
      "end": 19,
      "page": 9,
      "bg": "green",
      "bold": true,
      "quote": "Has"
    },
    {
      "paragraph": 5,
      "start": 20,
      "end": 44,
      "page": 9,
      "bg": "green",
      "quote": "she anything on her mind"
    },
    {
      "paragraph": 5,
      "start": 45,
      "end": 59,
      "page": 9,
      "bg": "green",
      "ink": "purple",
      "bold": true,
      "quote": "worth thinking"
    },
    {
      "paragraph": 5,
      "start": 60,
      "end": 94,
      "page": 9,
      "bg": "green",
      "quote": "about twice — a man, for instance?"
    },
    {
      "paragraph": 6,
      "start": 9,
      "end": 13,
      "page": 9,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 6,
      "start": 20,
      "end": 22,
      "page": 9,
      "bold": true,
      "quote": "Is"
    },
    {
      "paragraph": 6,
      "start": 60,
      "end": 62,
      "page": 9,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 7,
      "start": 8,
      "end": 12,
      "page": 9,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 7,
      "start": 28,
      "end": 35,
      "page": 9,
      "bold": true,
      "quote": "will do"
    },
    {
      "paragraph": 7,
      "start": 53,
      "end": 56,
      "page": 10,
      "bold": true,
      "quote": "can"
    },
    {
      "paragraph": 7,
      "start": 57,
      "end": 68,
      "page": 10,
      "ink": "purple",
      "bold": true,
      "quote": "accomplish."
    },
    {
      "paragraph": 7,
      "start": 93,
      "end": 99,
      "page": 10,
      "bold": true,
      "quote": "begins"
    },
    {
      "paragraph": 7,
      "start": 113,
      "end": 122,
      "page": 10,
      "ink": "purple",
      "bold": true,
      "quote": "carriages"
    },
    {
      "paragraph": 7,
      "start": 138,
      "end": 148,
      "page": 10,
      "ink": "purple",
      "bold": true,
      "quote": "procession"
    },
    {
      "paragraph": 7,
      "start": 151,
      "end": 159,
      "page": 10,
      "bold": true,
      "quote": "subtract"
    },
    {
      "paragraph": 7,
      "start": 181,
      "end": 189,
      "page": 10,
      "ink": "purple",
      "bold": true,
      "quote": "curative"
    },
    {
      "paragraph": 7,
      "start": 228,
      "end": 236,
      "page": 10,
      "bold": true,
      "quote": "had gone"
    },
    {
      "paragraph": 7,
      "start": 241,
      "end": 245,
      "page": 10,
      "bold": true,
      "quote": "went"
    },
    {
      "paragraph": 7,
      "start": 268,
      "end": 274,
      "page": 10,
      "bold": true,
      "quote": "cried."
    },
    {
      "paragraph": 7,
      "start": 284,
      "end": 296,
      "page": 10,
      "bold": true,
      "quote": "marched into"
    },
    {
      "paragraph": 7,
      "start": 335,
      "end": 344,
      "page": 10,
      "ink": "purple",
      "bold": true,
      "quote": "whistling"
    },
    {
      "paragraph": 8,
      "start": 7,
      "end": 11,
      "page": 12,
      "bold": true,
      "quote": "lay,"
    },
    {
      "paragraph": 8,
      "start": 98,
      "end": 109,
      "page": 12,
      "bold": true,
      "quote": "was looking"
    },
    {
      "paragraph": 9,
      "start": 14,
      "end": 19,
      "page": 12,
      "bold": true,
      "quote": "said,"
    },
    {
      "paragraph": 10,
      "start": 4,
      "end": 10,
      "page": 13,
      "bold": true,
      "quote": "looked"
    },
    {
      "paragraph": 10,
      "start": 35,
      "end": 38,
      "page": 13,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 10,
      "start": 61,
      "end": 64,
      "page": 13,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 10,
      "start": 78,
      "end": 84,
      "page": 13,
      "ink": "purple",
      "bold": true,
      "quote": "dreary"
    },
    {
      "paragraph": 10,
      "start": 170,
      "end": 178,
      "page": 13,
      "ink": "purple",
      "bold": true,
      "quote": "ivy vine"
    },
    {
      "paragraph": 10,
      "start": 179,
      "end": 186,
      "page": 13,
      "bold": true,
      "quote": "climbed"
    },
    {
      "paragraph": 10,
      "start": 215,
      "end": 240,
      "page": 13,
      "bg": "slate",
      "quote": "The cold breath of autumn"
    },
    {
      "paragraph": 10,
      "start": 241,
      "end": 250,
      "page": 13,
      "bg": "slate",
      "bold": true,
      "quote": "had blown"
    },
    {
      "paragraph": 10,
      "start": 251,
      "end": 291,
      "page": 13,
      "bg": "slate",
      "quote": "away its leaves, leaving it almost bare."
    },
    {
      "paragraph": 11,
      "start": 7,
      "end": 11,
      "page": 13,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 11,
      "start": 50,
      "end": 57,
      "page": 13,
      "bold": true,
      "quote": "falling"
    },
    {
      "paragraph": 11,
      "start": 91,
      "end": 95,
      "page": 13,
      "bold": true,
      "quote": "were"
    },
    {
      "paragraph": 11,
      "start": 117,
      "end": 121,
      "page": 13,
      "bold": true,
      "quote": "made"
    },
    {
      "paragraph": 11,
      "start": 175,
      "end": 179,
      "page": 13,
      "bold": true,
      "quote": "goes"
    },
    {
      "paragraph": 11,
      "start": 199,
      "end": 202,
      "page": 13,
      "bold": true,
      "quote": "are"
    },
    {
      "paragraph": 13,
      "start": 44,
      "end": 49,
      "page": 14,
      "bold": true,
      "quote": "falls"
    },
    {
      "paragraph": 13,
      "start": 66,
      "end": 76,
      "page": 14,
      "bold": true,
      "quote": "I’ve known"
    },
    {
      "paragraph": 13,
      "start": 98,
      "end": 104,
      "page": 14,
      "bold": true,
      "quote": "Didn’t"
    },
    {
      "paragraph": 13,
      "start": 116,
      "end": 120,
      "page": 14,
      "bold": true,
      "quote": "tell"
    },
    {
      "paragraph": 14,
      "start": 13,
      "end": 18,
      "page": 14,
      "bold": true,
      "quote": "heard"
    },
    {
      "paragraph": 14,
      "start": 27,
      "end": 36,
      "page": 14,
      "ink": "purple",
      "bold": true,
      "quote": "nonsense."
    },
    {
      "paragraph": 14,
      "start": 42,
      "end": 46,
      "page": 14,
      "bold": true,
      "quote": "have"
    },
    {
      "paragraph": 14,
      "start": 92,
      "end": 100,
      "page": 14,
      "bold": true,
      "quote": "Don’t be"
    },
    {
      "paragraph": 14,
      "start": 127,
      "end": 131,
      "page": 14,
      "bold": true,
      "quote": "told"
    },
    {
      "paragraph": 14,
      "start": 193,
      "end": 197,
      "page": 14,
      "bold": true,
      "quote": "were"
    },
    {
      "paragraph": 14,
      "start": 198,
      "end": 209,
      "page": 14,
      "ink": "purple",
      "bold": true,
      "quote": "ten to one!"
    },
    {
      "paragraph": 14,
      "start": 210,
      "end": 213,
      "page": 14,
      "bold": true,
      "quote": "Try"
    },
    {
      "paragraph": 14,
      "start": 241,
      "end": 244,
      "page": 14,
      "bold": true,
      "quote": "let"
    },
    {
      "paragraph": 14,
      "start": 262,
      "end": 271,
      "page": 14,
      "ink": "purple",
      "bold": true,
      "quote": "port wine"
    },
    {
      "paragraph": 14,
      "start": 276,
      "end": 291,
      "page": 14,
      "ink": "purple",
      "bold": true,
      "quote": "her sick child."
    },
    {
      "paragraph": 15,
      "start": 5,
      "end": 16,
      "page": 16,
      "bold": true,
      "quote": "needn’t get"
    },
    {
      "paragraph": 15,
      "start": 46,
      "end": 68,
      "page": 16,
      "ink": "purple",
      "bold": true,
      "quote": "keeping her eyes fixed"
    },
    {
      "paragraph": 15,
      "start": 92,
      "end": 96,
      "page": 16,
      "bold": true,
      "quote": "goes"
    },
    {
      "paragraph": 15,
      "start": 112,
      "end": 122,
      "page": 16,
      "bold": true,
      "quote": "don’t want"
    },
    {
      "paragraph": 15,
      "start": 138,
      "end": 144,
      "page": 16,
      "bold": true,
      "quote": "leaves"
    },
    {
      "paragraph": 15,
      "start": 158,
      "end": 162,
      "page": 16,
      "bold": true,
      "quote": "want"
    },
    {
      "paragraph": 15,
      "start": 198,
      "end": 202,
      "page": 16,
      "bold": true,
      "quote": "gets"
    },
    {
      "paragraph": 15,
      "start": 214,
      "end": 218,
      "page": 16,
      "bold": true,
      "quote": "I’ll"
    },
    {
      "paragraph": 15,
      "start": 232,
      "end": 240,
      "page": 16,
      "ink": "purple",
      "bold": true,
      "quote": "tired of"
    },
    {
      "paragraph": 15,
      "start": 275,
      "end": 279,
      "page": 16,
      "bold": true,
      "quote": "want"
    },
    {
      "paragraph": 15,
      "start": 283,
      "end": 304,
      "page": 16,
      "ink": "purple",
      "bold": true,
      "quote": "turn loose my hold on"
    },
    {
      "paragraph": 15,
      "start": 321,
      "end": 323,
      "page": 16,
      "bg": "slate",
      "bold": true,
      "quote": "go"
    },
    {
      "paragraph": 15,
      "start": 324,
      "end": 386,
      "page": 16,
      "bg": "slate",
      "quote": "sailing down, down, just like one of those poor, tired leaves."
    },
    {
      "paragraph": 16,
      "start": 1,
      "end": 4,
      "page": 17,
      "bold": true,
      "quote": "Try"
    },
    {
      "paragraph": 16,
      "start": 29,
      "end": 38,
      "page": 17,
      "bold": true,
      "quote": "must call"
    },
    {
      "paragraph": 16,
      "start": 84,
      "end": 100,
      "page": 17,
      "bold": true,
      "quote": "I’ll not be gone"
    },
    {
      "paragraph": 17,
      "start": 12,
      "end": 15,
      "page": 18,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 17,
      "start": 30,
      "end": 35,
      "page": 18,
      "bold": true,
      "quote": "lived"
    },
    {
      "paragraph": 17,
      "start": 73,
      "end": 76,
      "page": 18,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 17,
      "start": 92,
      "end": 95,
      "page": 18,
      "bold": true,
      "quote": "had"
    },
    {
      "paragraph": 17,
      "start": 152,
      "end": 169,
      "page": 18,
      "ink": "purple",
      "bold": true,
      "quote": "looking the part,"
    },
    {
      "paragraph": 17,
      "start": 178,
      "end": 181,
      "page": 18,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 17,
      "start": 219,
      "end": 227,
      "page": 18,
      "bold": true,
      "quote": "had been"
    },
    {
      "paragraph": 17,
      "start": 269,
      "end": 288,
      "page": 18,
      "bold": true,
      "quote": "had never yet begun"
    },
    {
      "paragraph": 17,
      "start": 296,
      "end": 302,
      "page": 18,
      "bold": true,
      "quote": "earned"
    },
    {
      "paragraph": 17,
      "start": 407,
      "end": 412,
      "page": 18,
      "bold": true,
      "quote": "drank"
    },
    {
      "paragraph": 17,
      "start": 417,
      "end": 427,
      "page": 18,
      "ink": "purple",
      "bold": true,
      "quote": "to excess,"
    },
    {
      "paragraph": 17,
      "start": 438,
      "end": 444,
      "page": 18,
      "bold": true,
      "quote": "talked"
    },
    {
      "paragraph": 17,
      "start": 472,
      "end": 484,
      "page": 18,
      "ink": "purple",
      "bold": true,
      "quote": "For the rest"
    },
    {
      "paragraph": 17,
      "start": 488,
      "end": 491,
      "page": 18,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 17,
      "start": 494,
      "end": 500,
      "page": 18,
      "ink": "purple",
      "bold": true,
      "quote": "fierce"
    },
    {
      "paragraph": 17,
      "start": 521,
      "end": 527,
      "page": 18,
      "bold": true,
      "quote": "mocked"
    },
    {
      "paragraph": 17,
      "start": 540,
      "end": 548,
      "page": 18,
      "ink": "purple",
      "bold": true,
      "quote": "softness"
    },
    {
      "paragraph": 17,
      "start": 569,
      "end": 577,
      "page": 18,
      "bold": true,
      "quote": "regarded"
    },
    {
      "paragraph": 17,
      "start": 589,
      "end": 598,
      "page": 18,
      "ink": "purple",
      "bold": true,
      "quote": "guard dog"
    },
    {
      "paragraph": 18,
      "start": 4,
      "end": 9,
      "page": 20,
      "bold": true,
      "quote": "found"
    },
    {
      "paragraph": 18,
      "start": 50,
      "end": 55,
      "page": 20,
      "ink": "purple",
      "bold": true,
      "quote": "dimly"
    },
    {
      "paragraph": 18,
      "start": 92,
      "end": 95,
      "page": 20,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 18,
      "start": 104,
      "end": 110,
      "page": 20,
      "ink": "purple",
      "bold": true,
      "quote": "canvas"
    },
    {
      "paragraph": 18,
      "start": 117,
      "end": 122,
      "page": 20,
      "ink": "purple",
      "bold": true,
      "quote": "easel"
    },
    {
      "paragraph": 18,
      "start": 128,
      "end": 144,
      "page": 20,
      "bold": true,
      "quote": "had been waiting"
    },
    {
      "paragraph": 18,
      "start": 223,
      "end": 227,
      "page": 20,
      "bold": true,
      "quote": "told"
    },
    {
      "paragraph": 18,
      "start": 263,
      "end": 269,
      "page": 21,
      "bold": true,
      "quote": "feared"
    },
    {
      "paragraph": 18,
      "start": 274,
      "end": 280,
      "page": 21,
      "bold": true,
      "quote": "would,"
    },
    {
      "paragraph": 18,
      "start": 326,
      "end": 337,
      "page": 21,
      "bold": true,
      "quote": "float away,"
    },
    {
      "paragraph": 18,
      "start": 354,
      "end": 363,
      "page": 21,
      "ink": "purple",
      "bold": true,
      "quote": "hold upon"
    },
    {
      "paragraph": 18,
      "start": 374,
      "end": 378,
      "page": 21,
      "bold": true,
      "quote": "grew"
    },
    {
      "paragraph": 18,
      "start": 418,
      "end": 436,
      "page": 21,
      "ink": "purple",
      "bold": true,
      "quote": "plainly streaming,"
    },
    {
      "paragraph": 18,
      "start": 437,
      "end": 444,
      "page": 21,
      "bold": true,
      "quote": "shouted"
    },
    {
      "paragraph": 18,
      "start": 449,
      "end": 457,
      "page": 21,
      "ink": "purple",
      "bold": true,
      "quote": "contempt"
    },
    {
      "paragraph": 19,
      "start": 11,
      "end": 22,
      "page": 22,
      "bold": true,
      "quote": "cried. “Are"
    },
    {
      "paragraph": 19,
      "start": 85,
      "end": 93,
      "page": 22,
      "bold": true,
      "quote": "drop off"
    },
    {
      "paragraph": 19,
      "start": 109,
      "end": 125,
      "page": 22,
      "bold": true,
      "quote": "have never heard"
    },
    {
      "paragraph": 19,
      "start": 154,
      "end": 159,
      "page": 22,
      "bold": true,
      "quote": "allow"
    },
    {
      "paragraph": 19,
      "start": 219,
      "end": 221,
      "page": 22,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 19,
      "start": 270,
      "end": 276,
      "page": 22,
      "bold": true,
      "quote": "should"
    },
    {
      "paragraph": 19,
      "start": 298,
      "end": 308,
      "page": 22,
      "bold": true,
      "quote": "will paint"
    },
    {
      "paragraph": 19,
      "start": 331,
      "end": 349,
      "page": 22,
      "bold": true,
      "quote": "shall all go away."
    },
    {
      "paragraph": 20,
      "start": 7,
      "end": 19,
      "page": 22,
      "bold": true,
      "quote": "was sleeping"
    },
    {
      "paragraph": 20,
      "start": 30,
      "end": 34,
      "page": 22,
      "bold": true,
      "quote": "went"
    },
    {
      "paragraph": 20,
      "start": 49,
      "end": 55,
      "page": 22,
      "bold": true,
      "quote": "pulled"
    },
    {
      "paragraph": 20,
      "start": 60,
      "end": 65,
      "page": 22,
      "ink": "purple",
      "bold": true,
      "quote": "shade"
    },
    {
      "paragraph": 20,
      "start": 76,
      "end": 84,
      "page": 22,
      "bold": true,
      "quote": "motioned"
    },
    {
      "paragraph": 20,
      "start": 128,
      "end": 138,
      "page": 22,
      "bold": true,
      "quote": "peered out"
    },
    {
      "paragraph": 20,
      "start": 187,
      "end": 196,
      "page": 22,
      "bold": true,
      "quote": "looked at"
    },
    {
      "paragraph": 20,
      "start": 241,
      "end": 252,
      "page": 22,
      "ink": "purple",
      "bold": true,
      "quote": "persistent,"
    },
    {
      "paragraph": 20,
      "start": 263,
      "end": 266,
      "page": 22,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 20,
      "start": 276,
      "end": 283,
      "page": 22,
      "ink": "purple",
      "bold": true,
      "quote": "mingled"
    },
    {
      "paragraph": 20,
      "start": 327,
      "end": 331,
      "page": 22,
      "bold": true,
      "quote": "took"
    },
    {
      "paragraph": 20,
      "start": 360,
      "end": 375,
      "page": 22,
      "ink": "purple",
      "bold": true,
      "quote": "upturned kettle"
    },
    {
      "paragraph": 21,
      "start": 9,
      "end": 14,
      "page": 24,
      "bold": true,
      "quote": "awoke"
    },
    {
      "paragraph": 21,
      "start": 57,
      "end": 62,
      "page": 24,
      "bold": true,
      "quote": "found"
    },
    {
      "paragraph": 21,
      "start": 111,
      "end": 116,
      "page": 24,
      "ink": "purple",
      "bold": true,
      "quote": "drawn"
    },
    {
      "paragraph": 22,
      "start": 1,
      "end": 5,
      "page": 24,
      "bold": true,
      "quote": "Pull"
    },
    {
      "paragraph": 22,
      "start": 9,
      "end": 12,
      "page": 24,
      "bold": true,
      "quote": "up;"
    },
    {
      "paragraph": 22,
      "start": 15,
      "end": 19,
      "page": 24,
      "bold": true,
      "quote": "want"
    },
    {
      "paragraph": 22,
      "start": 33,
      "end": 41,
      "page": 24,
      "bold": true,
      "quote": "ordered,"
    },
    {
      "paragraph": 23,
      "start": 0,
      "end": 7,
      "page": 24,
      "ink": "purple",
      "bold": true,
      "quote": "Wearily"
    },
    {
      "paragraph": 23,
      "start": 12,
      "end": 19,
      "page": 24,
      "bold": true,
      "quote": "obeyed."
    },
    {
      "paragraph": 24,
      "start": 53,
      "end": 64,
      "page": 25,
      "bold": true,
      "quote": "had endured"
    },
    {
      "paragraph": 24,
      "start": 94,
      "end": 99,
      "page": 25,
      "bold": true,
      "quote": "stood"
    },
    {
      "paragraph": 24,
      "start": 144,
      "end": 147,
      "page": 25,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 24,
      "start": 196,
      "end": 201,
      "page": 25,
      "ink": "purple",
      "bold": true,
      "quote": "stem,"
    },
    {
      "paragraph": 24,
      "start": 240,
      "end": 244,
      "page": 25,
      "bold": true,
      "quote": "hung"
    },
    {
      "paragraph": 25,
      "start": 4,
      "end": 6,
      "page": 25,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 25,
      "start": 49,
      "end": 66,
      "page": 25,
      "bold": true,
      "quote": "would surely fall"
    },
    {
      "paragraph": 25,
      "start": 87,
      "end": 92,
      "page": 25,
      "bold": true,
      "quote": "heard"
    },
    {
      "paragraph": 25,
      "start": 106,
      "end": 115,
      "page": 25,
      "bold": true,
      "quote": "will fall"
    },
    {
      "paragraph": 25,
      "start": 129,
      "end": 138,
      "page": 25,
      "bold": true,
      "quote": "shall die"
    },
    {
      "paragraph": 26,
      "start": 8,
      "end": 12,
      "page": 26,
      "bold": true,
      "quote": "wore"
    },
    {
      "paragraph": 26,
      "start": 40,
      "end": 48,
      "page": 26,
      "ink": "purple",
      "bold": true,
      "quote": "twilight"
    },
    {
      "paragraph": 26,
      "start": 54,
      "end": 63,
      "page": 26,
      "bold": true,
      "quote": "could see"
    },
    {
      "paragraph": 26,
      "start": 82,
      "end": 90,
      "page": 26,
      "ink": "purple",
      "bold": true,
      "quote": "clinging"
    },
    {
      "paragraph": 26,
      "start": 175,
      "end": 178,
      "page": 26,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 26,
      "start": 185,
      "end": 192,
      "page": 26,
      "ink": "purple",
      "bold": true,
      "quote": "loosed."
    },
    {
      "paragraph": 27,
      "start": 8,
      "end": 11,
      "page": 26,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 27,
      "start": 33,
      "end": 47,
      "page": 26,
      "ink": "purple",
      "bold": true,
      "quote": "the merciless,"
    },
    {
      "paragraph": 27,
      "start": 48,
      "end": 57,
      "page": 26,
      "bold": true,
      "quote": "commanded"
    },
    {
      "paragraph": 27,
      "start": 73,
      "end": 75,
      "page": 26,
      "bold": true,
      "quote": "be"
    },
    {
      "paragraph": 28,
      "start": 13,
      "end": 16,
      "page": 27,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 29,
      "start": 7,
      "end": 10,
      "page": 27,
      "bold": true,
      "quote": "lay"
    },
    {
      "paragraph": 29,
      "start": 55,
      "end": 61,
      "page": 27,
      "bold": true,
      "quote": "called"
    },
    {
      "paragraph": 29,
      "start": 74,
      "end": 86,
      "page": 27,
      "bold": true,
      "quote": "was stirring"
    },
    {
      "paragraph": 30,
      "start": 1,
      "end": 10,
      "page": 27,
      "bold": true,
      "quote": "I’ve been"
    },
    {
      "paragraph": 30,
      "start": 31,
      "end": 35,
      "page": 27,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 30,
      "start": 55,
      "end": 63,
      "page": 27,
      "bold": true,
      "quote": "has made"
    },
    {
      "paragraph": 30,
      "start": 105,
      "end": 111,
      "page": 27,
      "ink": "purple",
      "bold": true,
      "quote": "wicked"
    },
    {
      "paragraph": 30,
      "start": 114,
      "end": 118,
      "page": 27,
      "bold": true,
      "quote": "was."
    },
    {
      "paragraph": 30,
      "start": 122,
      "end": 124,
      "page": 27,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 30,
      "start": 127,
      "end": 130,
      "page": 27,
      "ink": "purple",
      "bold": true,
      "quote": "sin"
    },
    {
      "paragraph": 30,
      "start": 151,
      "end": 160,
      "page": 27,
      "bold": true,
      "quote": "may bring"
    },
    {
      "paragraph": 30,
      "start": 232,
      "end": 237,
      "page": 27,
      "bold": true,
      "quote": "bring"
    },
    {
      "paragraph": 30,
      "start": 271,
      "end": 275,
      "page": 27,
      "bold": true,
      "quote": "pack"
    },
    {
      "paragraph": 30,
      "start": 281,
      "end": 298,
      "page": 27,
      "ink": "purple",
      "bold": true,
      "quote": "pillows about me,"
    },
    {
      "paragraph": 31,
      "start": 18,
      "end": 23,
      "page": 28,
      "bold": true,
      "quote": "said:"
    },
    {
      "paragraph": 32,
      "start": 19,
      "end": 23,
      "page": 28,
      "bold": true,
      "quote": "hope"
    },
    {
      "paragraph": 33,
      "start": 11,
      "end": 15,
      "page": 28,
      "bold": true,
      "quote": "came"
    },
    {
      "paragraph": 33,
      "start": 42,
      "end": 45,
      "page": 28,
      "bold": true,
      "quote": "had"
    },
    {
      "paragraph": 33,
      "start": 49,
      "end": 55,
      "page": 28,
      "ink": "purple",
      "bold": true,
      "quote": "excuse"
    },
    {
      "paragraph": 33,
      "start": 85,
      "end": 90,
      "page": 28,
      "bold": true,
      "quote": "left."
    },
    {
      "paragraph": 34,
      "start": 1,
      "end": 14,
      "page": 29,
      "ink": "purple",
      "bold": true,
      "quote": "Even chances,"
    },
    {
      "paragraph": 34,
      "start": 16,
      "end": 20,
      "page": 29,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 35,
      "start": 26,
      "end": 30,
      "page": 29,
      "bold": true,
      "quote": "win."
    },
    {
      "paragraph": 35,
      "start": 65,
      "end": 69,
      "page": 29,
      "bold": true,
      "quote": "have"
    },
    {
      "paragraph": 35,
      "start": 100,
      "end": 102,
      "page": 29,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 35,
      "start": 159,
      "end": 161,
      "page": 29,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 35,
      "start": 195,
      "end": 197,
      "page": 29,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 35,
      "start": 198,
      "end": 204,
      "page": 29,
      "ink": "purple",
      "bold": true,
      "quote": "acute."
    },
    {
      "paragraph": 35,
      "start": 211,
      "end": 213,
      "page": 29,
      "bold": true,
      "quote": "is"
    },
    {
      "paragraph": 35,
      "start": 238,
      "end": 242,
      "page": 29,
      "bold": true,
      "quote": "goes"
    },
    {
      "paragraph": 36,
      "start": 24,
      "end": 28,
      "page": 29,
      "bold": true,
      "quote": "said"
    },
    {
      "paragraph": 36,
      "start": 44,
      "end": 47,
      "page": 29,
      "bold": true,
      "quote": "out"
    },
    {
      "paragraph": 36,
      "start": 66,
      "end": 70,
      "page": 29,
      "bold": true,
      "quote": "won."
    },
    {
      "paragraph": 37,
      "start": 23,
      "end": 27,
      "page": 30,
      "bold": true,
      "quote": "came"
    },
    {
      "paragraph": 37,
      "start": 52,
      "end": 55,
      "page": 30,
      "bold": true,
      "quote": "lay"
    },
    {
      "paragraph": 37,
      "start": 60,
      "end": 63,
      "page": 30,
      "bold": true,
      "quote": "put"
    },
    {
      "paragraph": 38,
      "start": 3,
      "end": 7,
      "page": 30,
      "bold": true,
      "quote": "have"
    },
    {
      "paragraph": 38,
      "start": 68,
      "end": 75,
      "page": 30,
      "bold": true,
      "quote": "died of"
    },
    {
      "paragraph": 38,
      "start": 112,
      "end": 115,
      "page": 30,
      "bold": true,
      "quote": "was"
    },
    {
      "paragraph": 38,
      "start": 138,
      "end": 147,
      "page": 30,
      "bold": true,
      "quote": "was found"
    },
    {
      "paragraph": 38,
      "start": 203,
      "end": 211,
      "page": 30,
      "ink": "purple",
      "bold": true,
      "quote": "helpless"
    },
    {
      "paragraph": 38,
      "start": 246,
      "end": 250,
      "page": 30,
      "bold": true,
      "quote": "were"
    },
    {
      "paragraph": 38,
      "start": 251,
      "end": 262,
      "page": 30,
      "ink": "purple",
      "bold": true,
      "quote": "wet through"
    },
    {
      "paragraph": 38,
      "start": 282,
      "end": 298,
      "page": 30,
      "bold": true,
      "quote": "couldn’t imagine"
    },
    {
      "paragraph": 38,
      "start": 308,
      "end": 316,
      "page": 30,
      "bold": true,
      "quote": "had been"
    },
    {
      "paragraph": 38,
      "start": 357,
      "end": 362,
      "page": 30,
      "bold": true,
      "quote": "found"
    },
    {
      "paragraph": 38,
      "start": 365,
      "end": 373,
      "page": 30,
      "ink": "purple",
      "bold": true,
      "quote": "lantern,"
    },
    {
      "paragraph": 38,
      "start": 407,
      "end": 423,
      "page": 30,
      "bold": true,
      "quote": "had been dragged"
    },
    {
      "paragraph": 38,
      "start": 449,
      "end": 458,
      "page": 30,
      "ink": "purple",
      "bold": true,
      "quote": "scattered"
    },
    {
      "paragraph": 38,
      "start": 474,
      "end": 481,
      "page": 30,
      "ink": "purple",
      "bold": true,
      "quote": "palette"
    },
    {
      "paragraph": 38,
      "start": 530,
      "end": 534,
      "page": 30,
      "bold": true,
      "quote": "look"
    },
    {
      "paragraph": 38,
      "start": 591,
      "end": 608,
      "page": 30,
      "bold": true,
      "quote": "Didn’t you wonder"
    },
    {
      "paragraph": 38,
      "start": 622,
      "end": 631,
      "page": 30,
      "bold": true,
      "quote": "fluttered"
    },
    {
      "paragraph": 38,
      "start": 635,
      "end": 640,
      "page": 30,
      "bold": true,
      "quote": "moved"
    },
    {
      "paragraph": 38,
      "start": 655,
      "end": 660,
      "page": 30,
      "bold": true,
      "quote": "blew?"
    },
    {
      "paragraph": 38,
      "start": 706,
      "end": 713,
      "page": 30,
      "bold": true,
      "quote": "painted"
    },
    {
      "paragraph": 38,
      "start": 752,
      "end": 757,
      "page": 30,
      "bold": true,
      "quote": "fell."
    }
  ],
  "reading-egg": [
    {
      "paragraph": 0,
      "start": 53,
      "end": 69,
      "page": 1,
      "ink": "red",
      "quote": "cheerful, kindly"
    },
    {
      "paragraph": 0,
      "start": 88,
      "end": 99,
      "page": 1,
      "ink": "red",
      "quote": "thirty-four"
    },
    {
      "paragraph": 0,
      "start": 120,
      "end": 134,
      "page": 1,
      "ink": "red",
      "quote": "as a farm-hand"
    },
    {
      "paragraph": 0,
      "start": 221,
      "end": 237,
      "page": 2,
      "ink": "red",
      "quote": "had then a horse"
    },
    {
      "paragraph": 0,
      "start": 256,
      "end": 273,
      "page": 2,
      "ink": "red",
      "quote": "Saturday evenings"
    },
    {
      "paragraph": 0,
      "start": 665,
      "end": 763,
      "page": 2,
      "ink": "red",
      "quote": "quite happy in his position in life. He had at that time no notion of trying to rise in the world."
    },
    {
      "paragraph": 1,
      "start": 28,
      "end": 45,
      "page": 2,
      "ink": "red",
      "quote": "thirty-fifth year"
    },
    {
      "paragraph": 1,
      "start": 82,
      "end": 107,
      "page": 2,
      "ink": "orange",
      "bold": true,
      "quote": "a country school-teacher,"
    },
    {
      "paragraph": 1,
      "start": 108,
      "end": 114,
      "page": 2,
      "ink": "orange",
      "quote": "and in"
    },
    {
      "paragraph": 1,
      "start": 115,
      "end": 179,
      "page": 2,
      "ink": "blue",
      "bold": true,
      "quote": "the following spring I came wriggling and crying into the world."
    },
    {
      "paragraph": 1,
      "start": 230,
      "end": 240,
      "page": 2,
      "ink": "orange",
      "bold": true,
      "quote": "ambitious."
    },
    {
      "paragraph": 1,
      "start": 241,
      "end": 314,
      "page": 2,
      "bg": "green",
      "quote": "The American passion for getting up in the world took possession of them."
    },
    {
      "paragraph": 2,
      "start": 46,
      "end": 182,
      "page": 2,
      "ink": "orange",
      "bold": true,
      "quote": "Being a school-teacher she had no doubt read books and magazines. She had, I presume, read of how Garfield, Lincoln, and other Americans"
    },
    {
      "paragraph": 2,
      "start": 183,
      "end": 222,
      "page": 2,
      "bg": "green",
      "quote": "rose from poverty to fame and greatness"
    },
    {
      "paragraph": 2,
      "start": 275,
      "end": 338,
      "page": 2,
      "ink": "orange",
      "bold": true,
      "quote": "she may have dreamed that I would some day rule men and cities."
    },
    {
      "paragraph": 2,
      "start": 351,
      "end": 473,
      "page": 2,
      "ink": "orange",
      "bold": true,
      "quote": "she induced father to give up his place as a farm-hand, sell his horse and embark on an independent enterprise of his own."
    },
    {
      "paragraph": 2,
      "start": 484,
      "end": 625,
      "page": 2,
      "ink": "orange",
      "bold": true,
      "quote": "tall silent woman with a long nose and troubled grey eyes. For herself she wanted nothing. For father and myself she was incurably ambitious."
    },
    {
      "paragraph": 3,
      "start": 0,
      "end": 17,
      "page": 3,
      "ink": "teal",
      "bold": true,
      "quote": "The first venture"
    },
    {
      "paragraph": 3,
      "start": 60,
      "end": 66,
      "page": 3,
      "ink": "teal",
      "bold": true,
      "quote": "badly."
    },
    {
      "paragraph": 3,
      "start": 170,
      "end": 186,
      "page": 3,
      "ink": "teal",
      "bold": true,
      "quote": "chicken raising."
    },
    {
      "paragraph": 3,
      "start": 264,
      "end": 521,
      "page": 3,
      "ink": "blue",
      "bold": true,
      "quote": "From the beginning they were impressions of disaster and if, in my turn, I am a gloomy man inclined to see the darker side of life, I attribute it to the fact that what should have been for me the happy joyous days of childhood were spent on a chicken farm."
    },
    {
      "paragraph": 4,
      "start": 108,
      "end": 450,
      "page": 4,
      "ink": "teal",
      "quote": "It is born out of an egg, lives for a few weeks as a tiny fluffy thing such as you will see pictured on Easter cards, then becomes hideously naked, eats quantities of corn and meal bought by the sweat of your father’s brow, gets diseases called pip, cholera, and other names, stands looking with stupid eyes at the sun, becomes sick and dies."
    },
    {
      "paragraph": 4,
      "start": 748,
      "end": 1192,
      "page": 4,
      "ink": "teal",
      "bold": true,
      "quote": "One hopes for so much from a chicken and is so dreadfully disillusioned. Small chickens, just setting out on the journey of life, look so bright and alert and they are in fact so dreadfully stupid. They are so much like people they mix one up in one’s judgments of life. If disease does not kill them they wait until your expectations are thoroughly aroused and then walk under the wheels of a wagon—to go squashed and dead back to their maker."
    },
    {
      "paragraph": 4,
      "start": 1400,
      "end": 1504,
      "page": 4,
      "ink": "teal",
      "bold": true,
      "quote": "It is intended to be read by the gods who have just eaten of the tree of the knowledge of good and evil."
    },
    {
      "paragraph": 5,
      "start": 122,
      "end": 250,
      "page": 5,
      "ink": "teal",
      "bold": true,
      "quote": "For ten years my father and mother struggled to make our chicken farm pay and then they gave up that struggle and began another."
    },
    {
      "paragraph": 5,
      "start": 251,
      "end": 312,
      "page": 5,
      "bold": true,
      "quote": "They moved into the town of Bidwell, Ohio and embarked in the"
    },
    {
      "paragraph": 5,
      "start": 313,
      "end": 333,
      "page": 5,
      "ink": "red",
      "bold": true,
      "quote": "restaurant business."
    },
    {
      "paragraph": 6,
      "start": 598,
      "end": 720,
      "page": 6,
      "bg": "green",
      "quote": "People who have few possessions cling tightly to those they have. That is one of the facts that make life so discouraging."
    },
    {
      "paragraph": 7,
      "start": 33,
      "end": 194,
      "page": 6,
      "ink": "red",
      "quote": "He was then a bald-headed man of forty-five, a little fat and from long association with mother and the chickens he had become habitually silent and discouraged."
    },
    {
      "paragraph": 7,
      "start": 259,
      "end": 266,
      "page": 6,
      "ink": "red",
      "quote": "laborer"
    },
    {
      "paragraph": 7,
      "start": 530,
      "end": 605,
      "page": 6,
      "ink": "red",
      "quote": "There were two little patches of hair on father’s head just above his ears."
    },
    {
      "paragraph": 7,
      "start": 752,
      "end": 1226,
      "page": 6,
      "ink": "red",
      "quote": "I had at that time already begun to read books and have notions of my own and the bald path that led over the top of his head was, I fancied, something like a broad road, such a road as Caesar might have made on which to lead his legions out of Rome and into the wonders of an unknown world. The tufts of hair that grew above father’s ears were, I thought, like forests. I fell into a half-sleeping, half-waking state and dreamed I was a tiny thing going along the road into"
    },
    {
      "paragraph": 7,
      "start": 1227,
      "end": 1325,
      "page": 7,
      "bg": "green",
      "quote": "a far beautiful place where there were no chicken farms and where life was a happy eggless affair."
    },
    {
      "paragraph": 9,
      "start": 117,
      "end": 166,
      "page": 7,
      "bg": "green",
      "quote": "Grotesques are born out of eggs as out of people."
    },
    {
      "paragraph": 9,
      "start": 236,
      "end": 326,
      "page": 8,
      "bg": "green",
      "quote": "A chicken is, you see, born that has four legs, two pairs of wings, two heads or what not."
    },
    {
      "paragraph": 9,
      "start": 527,
      "end": 788,
      "page": 8,
      "ink": "red",
      "quote": "He had some sort of notion that if he could but bring into henhood or roosterhood a five-legged hen or a two-headed rooster his fortune would be made. He dreamed of taking the wonder about to county fairs and of growing rich by exhibiting it to other farmhands."
    },
    {
      "paragraph": 10,
      "start": 0,
      "end": 161,
      "page": 8,
      "bg": "green",
      "quote": "At any rate he saved all the little monstrous things that had been born on our chicken farm. They were preserved in alcohol and put each in its own glass bottle."
    },
    {
      "paragraph": 10,
      "start": 715,
      "end": 778,
      "page": 8,
      "ink": "red",
      "quote": "People, he said, liked to look at strange and wonderful things."
    },
    {
      "paragraph": 11,
      "start": 108,
      "end": 439,
      "page": 8,
      "ink": "teal",
      "bold": true,
      "quote": "The town itself lay at the foot of a low hill and on the shore of a small river. The railroad did not run through the town and the station was a mile away to the north at a place called Pickleville. There had been a cider mill and pickle factory at the station, but before the time of our coming they had both gone out of business."
    },
    {
      "paragraph": 11,
      "start": 586,
      "end": 1265,
      "page": 9,
      "ink": "orange",
      "bold": true,
      "quote": "Our going to the out of the way place to embark in the restaurant business was mother’s idea. She talked of it for a year and then one day went off and rented an empty store building opposite the railroad station. It was her idea that the restaurant would be profitable. Travelling men, she said, would be always waiting around to take trains out of town and town people would come to the station to await incoming trains. They would come to the restaurant to buy pieces of pie and drink coffee. Now that I am older I know that she had another motive in going. She was ambitious for me. She wanted me to rise in the world, to get into a town school and become a man of the towns."
    },
    {
      "paragraph": 12,
      "start": 483,
      "end": 642,
      "page": 9,
      "ink": "blue",
      "bold": true,
      "quote": "I went to school in the town and was glad to be away from the farm and from the presence of the discouraged, sad-looking chickens. Still I was not very joyous."
    },
    {
      "paragraph": 12,
      "start": 947,
      "end": 1216,
      "page": 9,
      "ink": "blue",
      "bold": true,
      "quote": "I sang shrilly. Then I stopped and looked doubtfully about. I was afraid of being seen in my gay mood. It must have seemed to me that I was doing a thing that should not be done by one who, like myself, had been raised on a chicken farm where death was a daily visitor."
    },
    {
      "paragraph": 13,
      "start": 0,
      "end": 63,
      "page": 10,
      "ink": "orange",
      "bold": true,
      "quote": "Mother decided that our restaurant should remain open at night."
    },
    {
      "paragraph": 13,
      "start": 437,
      "end": 499,
      "page": 11,
      "ink": "orange",
      "quote": "Mother slept at night and during the day tended the restaurant"
    },
    {
      "paragraph": 13,
      "start": 797,
      "end": 930,
      "page": 11,
      "ink": "red",
      "quote": "Then an idea in regard to getting up in the world came into his head. The American spirit took hold of him. He also became ambitious."
    },
    {
      "paragraph": 14,
      "start": 0,
      "end": 395,
      "page": 11,
      "ink": "red",
      "quote": "In the long nights when there was little to do father had time to think. That was his undoing. He decided that he had in the past been an unsuccessful man because he had not been cheerful enough and that in the future he would adopt a cheerful outlook on life. In the early morning he came upstairs and got into bed with mother. She woke and the two talked. From my bed in the corner I listened."
    },
    {
      "paragraph": 15,
      "start": 0,
      "end": 114,
      "page": 11,
      "ink": "red",
      "quote": "It was father’s idea that both he and mother should try to entertain the people who came to eat at our restaurant."
    },
    {
      "paragraph": 15,
      "start": 595,
      "end": 885,
      "page": 11,
      "ink": "red",
      "quote": "It was father’s notion that a passion for the company of himself and mother would spring up in the breasts of the younger people of the town of Bidwell. In the evening bright happy groups would come singing down Turner’s Pike. They would troop shouting with joy and laughter into our place."
    },
    {
      "paragraph": 15,
      "start": 1031,
      "end": 1046,
      "page": 12,
      "ink": "red",
      "quote": "uncommunicative"
    },
    {
      "paragraph": 15,
      "start": 1144,
      "end": 1215,
      "page": 12,
      "ink": "blue",
      "quote": "That was as far as he got. My own imagination has filled in the blanks."
    },
    {
      "paragraph": 16,
      "start": 172,
      "end": 393,
      "page": 12,
      "bg": "green",
      "quote": "Mother smiled at the boarders and I, catching the infection, smiled at our cat. Father became a little feverish in his anxiety to please. There was no doubt, lurking somewhere in him, a touch of the spirit of the showman."
    },
    {
      "paragraph": 16,
      "start": 394,
      "end": 1691,
      "page": 12,
      "ink": "red",
      "quote": "He did not waste much of his ammunition on the railroad men he served at night but seemed to be waiting for a young man or woman from Bidwell to come in to show what he could do. On the counter in the restaurant there was a wire basket kept always filled with eggs, and it must have been before his eyes when the idea of being entertaining was born in his brain. There was something pre-natal about the way eggs kept themselves connected with the development of his idea. At any rate an egg ruined his new impulse in life. Late one night I was awakened by a roar of anger coming from father’s throat. Both mother and I sat upright in our beds. With trembling hands she lighted a lamp that stood on a table by her head. Downstairs the front door of our restaurant went shut with a bang and in a few minutes father tramped up the stairs. He held an egg in his hand and his hand trembled as though he were having a chill. There was a half insane light in his eyes. As he stood glaring at us I was sure he intended throwing the egg at either mother or me. Then he laid it gently on the table beside the lamp and dropped on his knees beside mother’s bed. He began to cry like a boy and I, carried away by his grief, cried with him. The two of us filled the little upstairs room with our wailing voices."
    },
    {
      "paragraph": 17,
      "start": 199,
      "end": 366,
      "page": 14,
      "ink": "purple",
      "bold": true,
      "quote": "On that evening young Joe Kane, son of a merchant of Bidwell, came to Pickleville to meet his father, who was expected on the ten o’clock evening train from the South."
    },
    {
      "paragraph": 18,
      "start": 488,
      "end": 558,
      "page": 14,
      "ink": "purple",
      "bold": true,
      "quote": "I’m waiting for the evening train. It’s late,” he said apologetically."
    },
    {
      "paragraph": 19,
      "start": 102,
      "end": 310,
      "page": 14,
      "ink": "red",
      "quote": "He was no doubt suffering from an attack of stage fright. As so often happens in life he had thought so much and so often of the situation that now confronted him that he was somewhat nervous in its presence."
    },
    {
      "paragraph": 20,
      "start": 58,
      "end": 137,
      "page": 15,
      "ink": "red",
      "quote": "He thrust one of them nervously over the counter and shook hands with Joe Kane."
    },
    {
      "paragraph": 20,
      "start": 308,
      "end": 381,
      "page": 15,
      "ink": "red",
      "quote": "he began hesitatingly, “well, you have heard of Christopher Columbus, eh?"
    },
    {
      "paragraph": 20,
      "start": 474,
      "end": 584,
      "page": 15,
      "ink": "red",
      "quote": "He talked of making an egg stand on its end. He talked, he did, and then he went and broke the end of the egg."
    },
    {
      "paragraph": 21,
      "start": 476,
      "end": 927,
      "page": 16,
      "ink": "red",
      "quote": "He rolled the egg between the palms of his hands. He smiled genially. He began to mumble words regarding the effect to be produced on an egg by the electricity that comes out of the human body. He declared that without breaking its shell and by virtue of rolling it back and forth in his hands he could stand the egg on its end. He explained that the warmth of his hands and the gentle rolling movement he gave the egg created a new centre of gravity,"
    },
    {
      "paragraph": 22,
      "start": 233,
      "end": 378,
      "page": 16,
      "ink": "red",
      "quote": "When after a half hour’s effort he did succeed in making the egg stand for a moment he looked up to find that his visitor was no longer watching."
    },
    {
      "paragraph": 23,
      "start": 115,
      "end": 384,
      "page": 17,
      "ink": "red",
      "quote": "father now took the bottles containing the poultry monstrosities down from their place on the shelf and began to show them to his visitor. “How would you like to have seven legs and two heads like this fellow?” he asked, exhibiting the most remarkable of his treasures."
    },
    {
      "paragraph": 23,
      "start": 608,
      "end": 752,
      "page": 17,
      "ink": "purple",
      "bold": true,
      "quote": "His visitor was made a little ill by the sight of the body of the terribly deformed bird floating in the alcohol in the bottle and got up to go."
    },
    {
      "paragraph": 23,
      "start": 854,
      "end": 947,
      "page": 17,
      "ink": "red",
      "quote": "He grew a little angry and for a moment had to turn his face away and force himself to smile."
    },
    {
      "paragraph": 23,
      "start": 1253,
      "end": 1733,
      "page": 17,
      "ink": "red",
      "quote": "I will heat this egg in this pan of vinegar,” he said. “Then I will put it through the neck of a bottle without breaking the shell. When the egg is inside the bottle it will resume its normal shape and the shell will become hard again. Then I will give the bottle with the egg in it to you. You can take it about with you wherever you go. People will want to know how you got the egg in the bottle. Don’t tell them. Keep them guessing. That is the way to have fun with this trick."
    },
    {
      "paragraph": 24,
      "start": 42,
      "end": 122,
      "page": 18,
      "ink": "purple",
      "quote": "Joe Kane decided that the man who confronted him was mildly insane but harmless."
    },
    {
      "paragraph": 24,
      "start": 341,
      "end": 462,
      "page": 18,
      "ink": "red",
      "quote": "He was angry because his visitor did not watch him as he began to do his trick, but nevertheless went cheerfully to work."
    },
    {
      "paragraph": 24,
      "start": 788,
      "end": 872,
      "page": 18,
      "ink": "red",
      "quote": "He worked and worked and a spirit of desperate determination took possession of him."
    },
    {
      "paragraph": 24,
      "start": 989,
      "end": 1037,
      "page": 18,
      "ink": "purple",
      "quote": "Kane started to go nonchalantly out at the door."
    },
    {
      "paragraph": 24,
      "start": 1337,
      "end": 1410,
      "page": 18,
      "ink": "red",
      "quote": "The egg broke under his hand. When the contents spurted over his clothes,"
    },
    {
      "paragraph": 24,
      "start": 1411,
      "end": 1469,
      "page": 18,
      "ink": "purple",
      "quote": "Joe Kane, who had stopped at the door, turned and laughed."
    },
    {
      "paragraph": 25,
      "start": 0,
      "end": 99,
      "page": 20,
      "ink": "red",
      "quote": "A roar of anger rose from my father’s throat. He danced and shouted a string of inarticulate words."
    },
    {
      "paragraph": 26,
      "start": 666,
      "end": 1117,
      "page": 20,
      "ink": "blue",
      "bold": true,
      "quote": "I awoke at dawn and for a long time looked at the egg that lay on the table. I wondered why eggs had to be and why from the egg came the hen who again laid the egg. The question got into my blood. It has stayed there, I imagine, because I am the son of my father. At any rate, the problem remains unsolved in my mind. And that, I conclude, is but another evidence of the complete and final triumph of the egg—at least as far as my family is concerned."
    }
  ],
  "reading-cop-anthem": [
    {
      "paragraph": 0,
      "start": 37,
      "end": 52,
      "page": 3,
      "ink": "red",
      "quote": "moved uneasily."
    },
    {
      "paragraph": 0,
      "start": 172,
      "end": 186,
      "page": 3,
      "ink": "red",
      "quote": "moves uneasily"
    },
    {
      "paragraph": 2,
      "start": 76,
      "end": 91,
      "page": 4,
      "bg": "gray",
      "quote": "resolve himself"
    },
    {
      "paragraph": 2,
      "start": 190,
      "end": 204,
      "page": 4,
      "ink": "red",
      "quote": "moved uneasily"
    },
    {
      "paragraph": 3,
      "start": 4,
      "end": 17,
      "page": 4,
      "bg": "gray",
      "quote": "hibernatorial"
    },
    {
      "paragraph": 3,
      "start": 128,
      "end": 137,
      "page": 6,
      "bg": "gray",
      "quote": "soporific"
    },
    {
      "paragraph": 3,
      "start": 169,
      "end": 177,
      "page": 6,
      "bg": "gray",
      "quote": "Vesuvian"
    },
    {
      "paragraph": 3,
      "start": 183,
      "end": 235,
      "page": 6,
      "ink": "red",
      "quote": "Three months on the Island was what his soul craved."
    },
    {
      "paragraph": 4,
      "start": 0,
      "end": 70,
      "page": 6,
      "ink": "red",
      "quote": "Three months of assured board and bed and congenial company, safe from"
    },
    {
      "paragraph": 4,
      "start": 71,
      "end": 77,
      "page": 6,
      "bg": "gray",
      "quote": "Boreas"
    },
    {
      "paragraph": 4,
      "start": 82,
      "end": 92,
      "page": 6,
      "bg": "gray",
      "quote": "bluecoats,"
    },
    {
      "paragraph": 4,
      "start": 109,
      "end": 141,
      "page": 6,
      "ink": "red",
      "quote": "the essence of things desirable."
    },
    {
      "paragraph": 5,
      "start": 25,
      "end": 36,
      "page": 7,
      "bg": "gray",
      "quote": "Blackwell’s"
    },
    {
      "paragraph": 5,
      "start": 238,
      "end": 244,
      "page": 7,
      "bg": "gray",
      "quote": "hegira"
    },
    {
      "paragraph": 5,
      "start": 520,
      "end": 526,
      "page": 7,
      "bg": "gray",
      "quote": "loomed"
    },
    {
      "paragraph": 5,
      "start": 562,
      "end": 569,
      "page": 7,
      "ink": "red",
      "quote": "scorned"
    },
    {
      "paragraph": 5,
      "start": 574,
      "end": 584,
      "page": 7,
      "bg": "gray",
      "quote": "provisions"
    },
    {
      "paragraph": 5,
      "start": 640,
      "end": 701,
      "page": 7,
      "ink": "red",
      "quote": "In Soapy’s opinion the Law was more benign than Philanthropy."
    },
    {
      "paragraph": 5,
      "start": 760,
      "end": 773,
      "page": 8,
      "bg": "gray",
      "quote": "eleemosynary,"
    },
    {
      "paragraph": 5,
      "start": 861,
      "end": 1042,
      "page": 8,
      "ink": "red",
      "quote": "But to one of Soapy’s proud spirit the gifts of charity are encumbered. If not in coin you must pay in humiliation of spirit for every benefit received at the hands of philanthropy."
    },
    {
      "paragraph": 6,
      "start": 224,
      "end": 235,
      "page": 9,
      "bg": "gray",
      "quote": "insolvency,"
    },
    {
      "paragraph": 6,
      "start": 297,
      "end": 310,
      "page": 9,
      "bg": "gray",
      "quote": "accommodating"
    },
    {
      "paragraph": 7,
      "start": 80,
      "end": 88,
      "page": 11,
      "bg": "gray",
      "quote": "asphalt,"
    },
    {
      "paragraph": 7,
      "start": 282,
      "end": 297,
      "page": 11,
      "bg": "gray",
      "quote": "the protoplasm."
    },
    {
      "paragraph": 8,
      "start": 422,
      "end": 429,
      "page": 11,
      "ink": "red",
      "quote": "thought"
    },
    {
      "paragraph": 8,
      "start": 479,
      "end": 487,
      "page": 11,
      "bg": "gray",
      "quote": "Chablis,"
    },
    {
      "paragraph": 8,
      "start": 497,
      "end": 507,
      "page": 11,
      "bg": "gray",
      "quote": "Camembert,"
    },
    {
      "paragraph": 8,
      "start": 510,
      "end": 520,
      "page": 11,
      "bg": "gray",
      "quote": "demi-tasse"
    },
    {
      "paragraph": 9,
      "start": 101,
      "end": 113,
      "page": 11,
      "bg": "gray",
      "quote": "and decadent"
    },
    {
      "paragraph": 9,
      "start": 121,
      "end": 267,
      "page": 11,
      "bg": "teal",
      "quote": "Strong and ready hands turned him about and conveyed him in silence and haste to the sidewalk and averted the ignoble fate of the menaced mallard."
    },
    {
      "paragraph": 10,
      "start": 91,
      "end": 100,
      "page": 12,
      "bg": "gray",
      "quote": "epicurean"
    },
    {
      "paragraph": 10,
      "start": 133,
      "end": 138,
      "page": 12,
      "bg": "gray",
      "quote": "limbo"
    },
    {
      "paragraph": 14,
      "start": 100,
      "end": 111,
      "page": 13,
      "bg": "gray",
      "quote": "parley with"
    },
    {
      "paragraph": 14,
      "start": 122,
      "end": 130,
      "page": 13,
      "bg": "gray",
      "quote": "minions."
    },
    {
      "paragraph": 14,
      "start": 157,
      "end": 170,
      "page": 13,
      "bg": "purple",
      "quote": "The policeman"
    },
    {
      "paragraph": 14,
      "start": 171,
      "end": 269,
      "page": 13,
      "bg": "teal",
      "quote": "saw a man halfway down the block running to catch a car. With drawn club he joined in the pursuit."
    },
    {
      "paragraph": 14,
      "start": 270,
      "end": 337,
      "page": 13,
      "ink": "red",
      "quote": "Soapy, with disgust in his heart, loafed along, twice unsuccessful."
    },
    {
      "paragraph": 15,
      "start": 130,
      "end": 138,
      "page": 14,
      "bg": "gray",
      "quote": "crockery"
    },
    {
      "paragraph": 15,
      "start": 242,
      "end": 250,
      "page": 14,
      "bg": "gray",
      "quote": "telltale"
    },
    {
      "paragraph": 15,
      "start": 321,
      "end": 331,
      "page": 14,
      "bg": "gray",
      "quote": "flapjacks,"
    },
    {
      "paragraph": 18,
      "start": 0,
      "end": 75,
      "page": 15,
      "bg": "teal",
      "quote": "Neatly upon his left ear on the callous pavement two waiters pitched Soapy."
    },
    {
      "paragraph": 18,
      "start": 232,
      "end": 243,
      "page": 15,
      "bg": "purple",
      "quote": "A policeman"
    },
    {
      "paragraph": 18,
      "start": 244,
      "end": 324,
      "page": 15,
      "bg": "teal",
      "quote": "who stood before a drug store two doors away laughed and walked down the street."
    },
    {
      "paragraph": 19,
      "start": 158,
      "end": 164,
      "page": 16,
      "bg": "gray",
      "quote": "cinch."
    },
    {
      "paragraph": 19,
      "start": 205,
      "end": 210,
      "page": 16,
      "bg": "gray",
      "quote": "guise"
    },
    {
      "paragraph": 19,
      "start": 257,
      "end": 266,
      "page": 16,
      "bg": "gray",
      "quote": "sprightly"
    },
    {
      "paragraph": 19,
      "start": 352,
      "end": 379,
      "page": 16,
      "bg": "purple",
      "quote": "a large policeman of severe"
    },
    {
      "paragraph": 19,
      "start": 380,
      "end": 388,
      "page": 16,
      "bg": "gray",
      "quote": "demeanor"
    },
    {
      "paragraph": 19,
      "start": 389,
      "end": 417,
      "page": 16,
      "bg": "purple",
      "quote": "leaned against a water-plug."
    },
    {
      "paragraph": 20,
      "start": 48,
      "end": 58,
      "page": 16,
      "bg": "gray",
      "quote": "despicable"
    },
    {
      "paragraph": 20,
      "start": 63,
      "end": 81,
      "page": 16,
      "bg": "gray",
      "quote": "execrated “masher."
    },
    {
      "paragraph": 20,
      "start": 140,
      "end": 150,
      "page": 16,
      "bg": "gray",
      "quote": "contiguity"
    },
    {
      "paragraph": 21,
      "start": 79,
      "end": 84,
      "page": 16,
      "bg": "gray",
      "quote": "cuffs"
    },
    {
      "paragraph": 21,
      "start": 125,
      "end": 129,
      "page": 16,
      "bg": "gray",
      "quote": "cant"
    },
    {
      "paragraph": 21,
      "start": 134,
      "end": 140,
      "page": 16,
      "bg": "gray",
      "quote": "sidled"
    },
    {
      "paragraph": 21,
      "start": 252,
      "end": 260,
      "page": 17,
      "bg": "gray",
      "quote": "brazenly"
    },
    {
      "paragraph": 21,
      "start": 273,
      "end": 281,
      "page": 17,
      "bg": "gray",
      "quote": "impudent"
    },
    {
      "paragraph": 21,
      "start": 299,
      "end": 305,
      "page": 17,
      "bg": "gray",
      "quote": "litany"
    },
    {
      "paragraph": 21,
      "start": 350,
      "end": 394,
      "page": 17,
      "bg": "purple",
      "quote": "that the policeman was watching him fixedly."
    },
    {
      "paragraph": 23,
      "start": 0,
      "end": 32,
      "page": 17,
      "bg": "purple",
      "quote": "The policeman was still looking."
    },
    {
      "paragraph": 23,
      "start": 37,
      "end": 47,
      "page": 17,
      "bg": "gray",
      "quote": "persecuted"
    },
    {
      "paragraph": 23,
      "start": 222,
      "end": 303,
      "page": 17,
      "bg": "teal",
      "quote": "The young woman faced him and, stretching out a hand, caught Soapy’s coat sleeve."
    },
    {
      "paragraph": 24,
      "start": 1,
      "end": 126,
      "page": 17,
      "bg": "teal",
      "quote": "Sure, Mike,” she said joyfully, “if you’ll blow me to a pail of suds. I’d have spoke to you sooner, but the cop was watching."
    },
    {
      "paragraph": 25,
      "start": 0,
      "end": 56,
      "page": 17,
      "bg": "teal",
      "quote": "With the young woman playing the clinging ivy to his oak"
    },
    {
      "paragraph": 25,
      "start": 57,
      "end": 139,
      "page": 17,
      "ink": "red",
      "quote": "Soapy walked past the policeman, overcome with gloom. He seemed doomed to liberty."
    },
    {
      "paragraph": 26,
      "start": 385,
      "end": 455,
      "page": 18,
      "bg": "purple",
      "quote": "another policeman lounging grandly in front of a transplendent theatre"
    },
    {
      "paragraph": 27,
      "start": 139,
      "end": 146,
      "page": 18,
      "bg": "gray",
      "quote": "welkin."
    },
    {
      "paragraph": 28,
      "start": 0,
      "end": 83,
      "page": 18,
      "bg": "purple",
      "quote": "The policeman twirled his club, turned his back to Soapy and remarked to a citizen."
    },
    {
      "paragraph": 30,
      "start": 0,
      "end": 49,
      "page": 19,
      "ink": "red",
      "quote": "Disconsolate, Soapy ceased his unavailing racket."
    },
    {
      "paragraph": 31,
      "start": 182,
      "end": 195,
      "page": 20,
      "bg": "gray",
      "quote": "sauntered off"
    },
    {
      "paragraph": 33,
      "start": 51,
      "end": 59,
      "page": 20,
      "bg": "gray",
      "quote": "larceny."
    },
    {
      "paragraph": 34,
      "start": 64,
      "end": 76,
      "page": 20,
      "bg": "gray",
      "quote": "presentiment"
    },
    {
      "paragraph": 34,
      "start": 116,
      "end": 158,
      "page": 20,
      "bg": "purple",
      "quote": "The policeman looked at the two curiously."
    },
    {
      "paragraph": 36,
      "start": 35,
      "end": 45,
      "page": 21,
      "bg": "gray",
      "quote": "viciously."
    },
    {
      "paragraph": 37,
      "start": 31,
      "end": 175,
      "page": 21,
      "bg": "purple",
      "quote": "The policeman hurried to assist a tall blonde in an opera cloak across the street in front of a street car that was approaching two blocks away."
    },
    {
      "paragraph": 38,
      "start": 87,
      "end": 97,
      "page": 21,
      "ink": "red",
      "quote": "wrathfully"
    },
    {
      "paragraph": 38,
      "start": 121,
      "end": 137,
      "page": 21,
      "ink": "red",
      "quote": "muttered against"
    },
    {
      "paragraph": 38,
      "start": 180,
      "end": 285,
      "page": 21,
      "ink": "red",
      "quote": "Because he wanted to fall into their clutches, they seemed to regard him as a king who could do no wrong."
    },
    {
      "paragraph": 39,
      "start": 100,
      "end": 217,
      "page": 22,
      "ink": "red",
      "quote": "He set his face down this toward Madison Square, for the homing instinct survives even when the home is a park bench."
    },
    {
      "paragraph": 40,
      "start": 96,
      "end": 104,
      "page": 22,
      "bg": "gray",
      "quote": "rambling"
    },
    {
      "paragraph": 40,
      "start": 193,
      "end": 215,
      "page": 22,
      "bg": "gray",
      "quote": "organist loitered over"
    },
    {
      "paragraph": 40,
      "start": 358,
      "end": 368,
      "page": 22,
      "bg": "gray",
      "quote": "transfixed"
    },
    {
      "paragraph": 40,
      "start": 381,
      "end": 393,
      "page": 22,
      "bg": "gray",
      "quote": "convolutions"
    },
    {
      "paragraph": 41,
      "start": 0,
      "end": 414,
      "page": 22,
      "bg": "salmon",
      "quote": "The moon was above, lustrous and serene; vehicles and pedestrians were few; sparrows twittered sleepily in the eaves—for a little while the scene might have been a country churchyard. And the anthem that the organist played cemented Soapy to the iron fence, for he had known it well in the days when his life contained such things as mothers and roses and ambitions and friends and immaculate thoughts and collars."
    },
    {
      "paragraph": 42,
      "start": 0,
      "end": 316,
      "page": 24,
      "ink": "red",
      "quote": "The conjunction of Soapy’s receptive state of mind and the influences about the old church wrought a sudden and wonderful change in his soul. He viewed with swift horror the pit into which he had tumbled, the degraded days, unworthy desires, dead hopes, wrecked faculties and base motives that made up his existence."
    },
    {
      "paragraph": 43,
      "start": 0,
      "end": 153,
      "page": 24,
      "ink": "red",
      "quote": "And also in a moment his heart responded thrillingly to this novel mood. An instantaneous and strong impulse moved him to battle with his desperate fate."
    },
    {
      "paragraph": 43,
      "start": 154,
      "end": 290,
      "page": 24,
      "bg": "rose",
      "ink": "red",
      "quote": "He would pull himself out of the mire; he would make a man of himself again; he would conquer the evil that had taken possession of him."
    },
    {
      "paragraph": 43,
      "start": 291,
      "end": 709,
      "page": 24,
      "ink": "red",
      "quote": "There was time; he was comparatively young yet; he would resurrect his old eager ambitions and pursue them without faltering. Those solemn but sweet organ notes had set up a revolution in him. To-morrow he would go into the roaring down-town district and find work. A fur importer had once offered him a place as driver. He would find him to-morrow and ask for the position. He would be somebody in the world. He would"
    },
    {
      "paragraph": 44,
      "start": 0,
      "end": 95,
      "page": 24,
      "bg": "purple",
      "quote": "Soapy felt a hand laid on his arm. He looked quickly around into the broad face of a policeman."
    }
  ],
  "reading-story-hour": [
    {
      "paragraph": 0,
      "start": 13,
      "end": 61,
      "page": 3,
      "bg": "brown",
      "quote": "Mrs. Mallard was afflicted with a heart trouble,"
    },
    {
      "paragraph": 1,
      "start": 328,
      "end": 502,
      "page": 3,
      "ink": "red",
      "quote": "He had only taken the time to assure himself of its truth by a second telegram, and had hastened to forestall any less careful, less tender friend in bearing the sad message."
    },
    {
      "paragraph": 2,
      "start": 0,
      "end": 61,
      "page": 4,
      "bg": "brown",
      "quote": "She did not hear the story as many women have heard the same,"
    },
    {
      "paragraph": 2,
      "start": 188,
      "end": 211,
      "page": 4,
      "bg": "cream",
      "quote": "When the storm of grief"
    },
    {
      "paragraph": 2,
      "start": 262,
      "end": 295,
      "page": 4,
      "bg": "brown",
      "quote": "She would have no one follow her."
    },
    {
      "paragraph": 3,
      "start": 68,
      "end": 182,
      "page": 6,
      "bg": "sage",
      "quote": "Into this she sank, pressed down by a physical exhaustion that haunted her body and seemed to reach into her soul."
    },
    {
      "paragraph": 4,
      "start": 40,
      "end": 144,
      "page": 6,
      "bg": "brown",
      "quote": "her house the tops of trees that were all aquiver with the new spring life. The delicious breath of rain"
    },
    {
      "paragraph": 4,
      "start": 213,
      "end": 341,
      "page": 7,
      "bg": "cream",
      "quote": "The notes of a distant song which some one was singing reached her faintly, and countless sparrows were twittering in the eaves."
    },
    {
      "paragraph": 4,
      "start": 342,
      "end": 372,
      "page": 7,
      "bg": "blue",
      "quote": "There were patches of blue sky"
    },
    {
      "paragraph": 5,
      "start": 140,
      "end": 212,
      "page": 7,
      "bg": "gold",
      "quote": "as a child who has cried itself to sleep continues to sob in its dreams."
    },
    {
      "paragraph": 6,
      "start": 99,
      "end": 216,
      "page": 8,
      "bg": "blue",
      "quote": "But now there was a dull stare in her eyes, whose gaze was fixed away off yonder on one of those patches of blue sky."
    },
    {
      "paragraph": 6,
      "start": 289,
      "end": 300,
      "page": 8,
      "ink": "red",
      "quote": "intelligent"
    },
    {
      "paragraph": 7,
      "start": 0,
      "end": 267,
      "page": 8,
      "ink": "red",
      "quote": "There was something coming to her and she was waiting for it, fearfully. What was it? She did not know; it was too subtle and elusive to name. But she felt it, creeping out of the sky, reaching toward her through the sounds, the scents, the color that filled the air."
    },
    {
      "paragraph": 8,
      "start": 42,
      "end": 363,
      "page": 10,
      "ink": "red",
      "quote": "She was beginning to recognize this thing that was approaching to possess her, and she was striving to beat it back with her will — as powerless as her two white slender hands would have been. When she abandoned herself a little whispered word escaped her slightly parted lips. She said it over and over under her breath:"
    },
    {
      "paragraph": 8,
      "start": 365,
      "end": 382,
      "page": 10,
      "bg": "purple",
      "quote": "free, free, free!"
    },
    {
      "paragraph": 8,
      "start": 582,
      "end": 659,
      "page": 11,
      "bg": "gold",
      "quote": "She did not stop to ask if it were or were not a monstrous joy that held her."
    },
    {
      "paragraph": 9,
      "start": 0,
      "end": 278,
      "page": 11,
      "ink": "red",
      "quote": "She knew that she would weep again when she saw the kind, tender hands folded in death; the face that had never looked save with love upon her, fixed and gray and dead. But she saw beyond that bitter moment a long procession of years to come that would belong to her absolutely."
    },
    {
      "paragraph": 9,
      "start": 338,
      "end": 430,
      "page": 11,
      "ink": "red",
      "quote": "There would be no one to live for her during those coming years; she would live for herself."
    },
    {
      "paragraph": 9,
      "start": 668,
      "end": 673,
      "page": 11,
      "ink": "red",
      "quote": "crime"
    },
    {
      "paragraph": 10,
      "start": 0,
      "end": 57,
      "page": 11,
      "ink": "red",
      "quote": "And yet she had loved him — sometimes. Often she had not."
    },
    {
      "paragraph": 13,
      "start": 39,
      "end": 296,
      "page": 13,
      "ink": "red",
      "quote": "No; she was drinking in a very elixir of life through that open window. Her fancy was running riot along those days ahead of her. Spring days, and summer days, and all sorts of days that would be her own. She breathed a quick prayer that life might be long."
    },
    {
      "paragraph": 14,
      "start": 83,
      "end": 99,
      "page": 13,
      "ink": "red",
      "quote": "feverish triumph"
    },
    {
      "paragraph": 14,
      "start": 137,
      "end": 175,
      "page": 13,
      "bg": "sage",
      "quote": "unwittingly like a goddess of Victory."
    },
    {
      "paragraph": 15,
      "start": 296,
      "end": 362,
      "page": 14,
      "ink": "red",
      "quote": "at Richards' quick motion to screen him from the view of his wife."
    },
    {
      "paragraph": 17,
      "start": 0,
      "end": 86,
      "page": 14,
      "bg": "cream",
      "quote": "When the doctors came they said she had died of heart disease — of the joy that kills."
    }
  ],
  "reading-trifles": [
    {
      "paragraph": 2,
      "start": 47,
      "end": 59,
      "page": 3,
      "ink": "red",
      "quote": "JOHN WRIGHT,"
    },
    {
      "paragraph": 2,
      "start": 667,
      "end": 732,
      "page": 3,
      "bg": "yellow",
      "quote": "but she is disturbed now and looks fearfully about as she enters."
    },
    {
      "paragraph": 7,
      "start": 109,
      "end": 114,
      "page": 4,
      "ink": "red",
      "quote": "Frank"
    },
    {
      "paragraph": 9,
      "start": 69,
      "end": 92,
      "page": 4,
      "ink": "red",
      "quote": "that man\nwho went crazy"
    },
    {
      "paragraph": 11,
      "start": 6,
      "end": 11,
      "page": 5,
      "ink": "red",
      "quote": "Harry"
    },
    {
      "paragraph": 11,
      "start": 158,
      "end": 169,
      "page": 5,
      "ink": "red",
      "quote": "John Wright"
    },
    {
      "paragraph": 11,
      "start": 496,
      "end": 567,
      "page": 5,
      "bg": "yellow",
      "quote": "that I didn't know as what his wife wanted made much difference to John"
    },
    {
      "paragraph": 13,
      "start": 388,
      "end": 399,
      "page": 5,
      "ink": "red",
      "quote": "Mrs Wright."
    },
    {
      "paragraph": 16,
      "start": 6,
      "end": 37,
      "page": 6,
      "bg": "yellow",
      "quote": "She was rockin' back and forth."
    },
    {
      "paragraph": 18,
      "start": 12,
      "end": 29,
      "page": 6,
      "bg": "yellow",
      "quote": "she looked queer."
    },
    {
      "paragraph": 20,
      "start": 12,
      "end": 85,
      "page": 6,
      "bg": "yellow",
      "quote": "as if she didn't know what she was going to do next. And kind of done\nup."
    },
    {
      "paragraph": 22,
      "start": 6,
      "end": 84,
      "page": 6,
      "bg": "yellow",
      "quote": "Why, I don't think she minded—one way or other. She didn't pay much\nattention."
    },
    {
      "paragraph": 22,
      "start": 505,
      "end": 697,
      "page": 6,
      "bg": "yellow",
      "quote": "No', she says, kind o' dull like. 'Ain't he home?' says I. 'Yes', says she, 'he's home'. 'Then why can't I see him?' I asked her, out of patience. ''Cause he's dead', says she. 'Dead?' says I."
    },
    {
      "paragraph": 22,
      "start": 1016,
      "end": 1100,
      "page": 7,
      "bg": "yellow",
      "quote": "He died of a rope round his neck', says she, and just went on pleatin' at her apron."
    },
    {
      "paragraph": 22,
      "start": 1129,
      "end": 1135,
      "page": 7,
      "ink": "red",
      "quote": "Harry."
    },
    {
      "paragraph": 24,
      "start": 273,
      "end": 748,
      "page": 7,
      "bg": "yellow",
      "quote": "Has anybody been notified?' I asked. 'No', says she unconcerned. 'Who did this, Mrs Wright?' said Harry. He said it business-like—and she stopped pleatin' of her apron. 'I don't know', she says. 'You don't know?' says Harry. 'No', says she. 'Weren't you sleepin' in the bed with him?' says Harry. 'Yes', says she, 'but I was on the inside'. 'Somebody slipped a rope round his neck and strangled him and you didn't wake up?' says Harry. 'I didn't wake up', she said after him."
    },
    {
      "paragraph": 26,
      "start": 287,
      "end": 496,
      "page": 8,
      "bg": "yellow",
      "quote": "and at that she started to laugh, and then she stopped and looked at me—scared, (the COUNTY ATTORNEY, who has had his notebook out, makes a note) I dunno, maybe it wasn't scared. I wouldn't like to say it was."
    },
    {
      "paragraph": 26,
      "start": 527,
      "end": 535,
      "page": 8,
      "ink": "red",
      "quote": "Dr Lloyd"
    },
    {
      "paragraph": 31,
      "start": 1,
      "end": 23,
      "page": 8,
      "bg": "yellow",
      "quote": "The women draw nearer."
    },
    {
      "paragraph": 32,
      "start": 126,
      "end": 178,
      "page": 9,
      "ink": "red",
      "quote": "She said the fire'd go out and her jars would break."
    },
    {
      "paragraph": 33,
      "start": 9,
      "end": 88,
      "page": 9,
      "bg": "pink",
      "quote": "Well, can you beat the women! Held for murder and worryin' about her\npreserves."
    },
    {
      "paragraph": 35,
      "start": 0,
      "end": 52,
      "page": 9,
      "bg": "blush",
      "quote": "HALE: Well, women are used to worrying over trifles."
    },
    {
      "paragraph": 36,
      "start": 1,
      "end": 45,
      "page": 9,
      "bg": "yellow",
      "quote": "The two women move a little closer together."
    },
    {
      "paragraph": 37,
      "start": 130,
      "end": 154,
      "page": 10,
      "bg": "yellow",
      "quote": "the women do not unbend."
    },
    {
      "paragraph": 37,
      "start": 335,
      "end": 447,
      "page": 10,
      "ink": "red",
      "quote": "Dirty towels! (kicks his foot against the pans under the sink) Not much of a housekeeper, would you say, ladies?"
    },
    {
      "paragraph": 40,
      "start": 46,
      "end": 98,
      "page": 10,
      "ink": "red",
      "quote": "Men's hands aren't always as clean\nas they might be."
    },
    {
      "paragraph": 47,
      "start": 39,
      "end": 87,
      "page": 10,
      "ink": "red",
      "quote": "I shouldn't say she had the homemaking\ninstinct."
    },
    {
      "paragraph": 50,
      "start": 37,
      "end": 114,
      "page": 11,
      "ink": "red",
      "quote": "But I don't think a place'd be any cheerfuller\nfor John Wright's being in it."
    },
    {
      "paragraph": 55,
      "start": 1,
      "end": 80,
      "page": 11,
      "bg": "yellow",
      "quote": "The women listen to the men's steps on the stairs, then look about the\nkitchen."
    },
    {
      "paragraph": 59,
      "start": 192,
      "end": 296,
      "page": 12,
      "ink": "red",
      "quote": "Seems mean to talk about her for not having things slicked up when she had to come away in such a hurry."
    },
    {
      "paragraph": 61,
      "start": 11,
      "end": 140,
      "page": 12,
      "bg": "yellow",
      "quote": "eyes fixed on a loaf of bread beside the bread-box, which is on a low\nshelf at the other side of the room. Moves slowly toward it"
    },
    {
      "paragraph": 61,
      "start": 179,
      "end": 261,
      "page": 12,
      "bg": "yellow",
      "quote": "picks up loaf, then abruptly drops it. In a manner of returning to familiar things"
    },
    {
      "paragraph": 61,
      "start": 321,
      "end": 351,
      "page": 12,
      "bg": "yellow",
      "quote": "gets up on the chair and looks"
    },
    {
      "paragraph": 61,
      "start": 612,
      "end": 736,
      "page": 12,
      "ink": "red",
      "quote": "She'll feel awful bad after all her hard work in the hot weather. I remember the afternoon I put up my cherries last summer."
    },
    {
      "paragraph": 67,
      "start": 11,
      "end": 145,
      "page": 13,
      "bg": "ochre",
      "ink": "red",
      "quote": "examining the skirt) Wright was close. I think maybe that's why she\nkept so much to herself. She didn't even belong to the Ladies Aid."
    },
    {
      "paragraph": 67,
      "start": 146,
      "end": 304,
      "page": 13,
      "bg": "ochre",
      "quote": "I suppose she felt she couldn't do her part, and then you don't enjoy things when you feel shabby. She used to wear pretty clothes and be lively, when she was"
    },
    {
      "paragraph": 67,
      "start": 305,
      "end": 319,
      "page": 13,
      "bg": "ochre",
      "ink": "red",
      "quote": "Minnie Foster,"
    },
    {
      "paragraph": 67,
      "start": 320,
      "end": 432,
      "page": 13,
      "bg": "ochre",
      "quote": "one of the town girls singing in the choir. But that—oh, that was thirty years ago. This all you was to take in?"
    },
    {
      "paragraph": 68,
      "start": 126,
      "end": 175,
      "page": 13,
      "ink": "red",
      "quote": "But I suppose just to make her feel more natural."
    },
    {
      "paragraph": 69,
      "start": 1,
      "end": 37,
      "page": 13,
      "ink": "red",
      "quote": "Quickly shuts door leading upstairs."
    },
    {
      "paragraph": 74,
      "start": 0,
      "end": 106,
      "page": 13,
      "bg": "yellow",
      "quote": "MRS HALE: Well, I don't think she did. Asking for an apron and her little shawl.\nWorrying about her fruit."
    },
    {
      "paragraph": 75,
      "start": 13,
      "end": 101,
      "page": 13,
      "bg": "yellow",
      "quote": "starts to speak, glances up, where footsteps are heard in the room\nabove. In a low voice"
    },
    {
      "paragraph": 78,
      "start": 53,
      "end": 56,
      "page": 14,
      "ink": "red",
      "quote": "gun"
    },
    {
      "paragraph": 79,
      "start": 0,
      "end": 132,
      "page": 14,
      "bg": "yellow",
      "quote": "MRS PETERS: Mr Henderson said coming out that what was needed for the case\nwas a motive; something to show anger, or—sudden feeling."
    },
    {
      "paragraph": 80,
      "start": 543,
      "end": 643,
      "page": 14,
      "bg": "yellow",
      "ink": "red",
      "quote": "Locking her up in town and then coming out here and trying to get her own house to turn against her!"
    },
    {
      "paragraph": 84,
      "start": 20,
      "end": 36,
      "page": 14,
      "ink": "red",
      "quote": "piecing a quilt."
    },
    {
      "paragraph": 88,
      "start": 0,
      "end": 66,
      "page": 15,
      "ink": "red",
      "quote": "SHERIFF: They wonder if she was going to quilt it or just knot it!"
    },
    {
      "paragraph": 89,
      "start": 1,
      "end": 39,
      "page": 15,
      "ink": "red",
      "quote": "The men laugh, the women look abashed."
    },
    {
      "paragraph": 91,
      "start": 230,
      "end": 274,
      "page": 15,
      "ink": "red",
      "quote": "I don't see as it's anything to laugh about."
    },
    {
      "paragraph": 94,
      "start": 11,
      "end": 276,
      "page": 15,
      "ink": "red",
      "quote": "examining another block) Mrs Peters, look at this one. Here, this is the\none she was working on, and look at the sewing! All the rest of it has been so nice and even. And look at this! It's all over the place! Why, it looks as if she didn't know what she was about!"
    },
    {
      "paragraph": 102,
      "start": 272,
      "end": 311,
      "page": 16,
      "bg": "yellow",
      "quote": "putting apron and other things together"
    },
    {
      "paragraph": 104,
      "start": 39,
      "end": 103,
      "page": 16,
      "ink": "red",
      "quote": "here's a bird-cage, (holds it up) Did she\nhave a bird, Mrs Hale?"
    },
    {
      "paragraph": 105,
      "start": 189,
      "end": 226,
      "page": 16,
      "ink": "red",
      "quote": "She used to sing real pretty herself."
    },
    {
      "paragraph": 116,
      "start": 20,
      "end": 189,
      "page": 17,
      "ink": "red",
      "quote": "wouldn't it? (dropping her sewing) But I tell you what I do wish,\nMrs Peters. I wish I had come over sometimes when she was here. I—(looking around the room)—wish I had."
    },
    {
      "paragraph": 118,
      "start": 10,
      "end": 105,
      "page": 17,
      "ink": "red",
      "quote": "I could've come. I stayed away because it weren't cheerful—and that's\nwhy I ought to have come."
    },
    {
      "paragraph": 118,
      "start": 201,
      "end": 348,
      "page": 17,
      "ink": "red",
      "quote": "I dunno what it is, but it's a lonesome place and always was. I wish I had come over to see Minnie Foster sometimes. I can see now—(shakes her head"
    },
    {
      "paragraph": 122,
      "start": 101,
      "end": 341,
      "page": 18,
      "ink": "red",
      "quote": "But he was a hard man, Mrs Peters. Just to pass the time of day with him—(shivers) Like a raw wind that gets to the bone, (pauses, her eye falling on the cage) I should think she would 'a wanted a bird. But what do you suppose went with it?"
    },
    {
      "paragraph": 127,
      "start": 10,
      "end": 145,
      "page": 18,
      "ink": "red",
      "quote": "She—come to think of it, she was kind of like a bird herself—real sweet\nand pretty, but kind of timid and—fluttery. How—she—did—change."
    },
    {
      "paragraph": 135,
      "start": 0,
      "end": 103,
      "page": 19,
      "ink": "red",
      "quote": "MRS HALE: (jumping up) But, Mrs Peters—look at it! It's neck! Look at its neck! It's\nall—other side to."
    },
    {
      "paragraph": 136,
      "start": 0,
      "end": 36,
      "page": 19,
      "ink": "red",
      "quote": "MRS PETERS: Somebody—wrung—its—neck."
    },
    {
      "paragraph": 148,
      "start": 0,
      "end": 286,
      "page": 20,
      "bg": "yellow",
      "ink": "red",
      "quote": "MRS PETERS: (in a whisper) When I was a girl—my kitten—there was a boy took a\nhatchet, and before my eyes—and before I could get there—(covers her face an instant) If they hadn't held me back I would have—(catches herself, looks upstairs where steps are heard, falters weakly)—hurt him."
    },
    {
      "paragraph": 149,
      "start": 114,
      "end": 205,
      "page": 20,
      "ink": "red",
      "quote": "No, Wright wouldn't like the bird—a thing that sang. She used to sing. He killed that, too."
    },
    {
      "paragraph": 156,
      "start": 0,
      "end": 166,
      "page": 21,
      "bg": "yellow",
      "quote": "MRS HALE: (her own feeling not interrupted) If there'd been years and years of\nnothing, then a bird to sing to you, it would be awful—still, after the bird was still."
    },
    {
      "paragraph": 160,
      "start": 0,
      "end": 292,
      "page": 21,
      "ink": "red",
      "quote": "MRS HALE: (not as if answering that) I wish you'd seen Minnie Foster when she\nwore a white dress with blue ribbons and stood up there in the choir and sang. (a look around the room) Oh, I wish I'd come over here once in a while! That was a crime! That was a crime! Who's going to punish that?"
    },
    {
      "paragraph": 162,
      "start": 10,
      "end": 81,
      "page": 21,
      "ink": "red",
      "quote": "I might have known she needed help! I know how things can be—for\nwomen."
    },
    {
      "paragraph": 172,
      "start": 17,
      "end": 90,
      "page": 22,
      "ink": "red",
      "quote": "Oh, I guess they're not very dangerous things the ladies have\npicked out."
    },
    {
      "paragraph": 172,
      "start": 220,
      "end": 315,
      "page": 23,
      "ink": "red",
      "quote": "For that matter, a sheriff's wife is married to the law. Ever think of it that way, Mrs Peters?"
    },
    {
      "paragraph": 174,
      "start": 113,
      "end": 120,
      "page": 23,
      "ink": "red",
      "quote": "George."
    },
    {
      "paragraph": 177,
      "start": 1,
      "end": 660,
      "page": 23,
      "bg": "yellow",
      "quote": "HALE goes outside. The SHERIFF follows the COUNTY ATTORNEY\ninto the other room. Then MRS HALE rises, hands tight together, looking intensely at MRS PETERS, whose eyes make a slow turn, finally meeting MRS HALE's. A moment MRS HALE holds her, then her own eyes point the way to where the box is concealed. Suddenly MRS PETERS throws back quilt pieces and tries to put the box in the bag she is wearing. It is too big. She opens box, starts to take bird out, cannot touch it, goes to pieces, stands there helpless. Sound of a knob turning in the other room. MRS HALE snatches the box and puts it in the pocket of her big coat. Enter COUNTY ATTORNEY and SHERIFF."
    }
  ]
};
const noteDays: Record<string, number> = {"fat": 35, "necklace": 36, "reading-after-twenty": 41, "reading-last-leaf": 28, "reading-egg": 46, "reading-days-wait": 50, "reading-short-story": 52, "reading-early-autumn": 51, "reading-story-hour": 54, "reading-trifles": 64};
function escapeText(s:string){return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}
export function renderNoteHighlights(story:string,paragraph:number,text:string){
 const marks=(noteMarks[story]||[]).filter(m=>m.paragraph===paragraph && text.slice(m.start,m.end)===m.quote);
 let html="",cursor=0;
 for(const m of marks){
  html+=escapeText(text.slice(cursor,m.start));
  const classes=["reading-note-mark",m.bg?`note-${m.bg}`:"",m.red?"note-red":"",m.italic?"note-italic":"",m.ink?`note-ink-${m.ink}`:"",m.bold?"note-bold":""].filter(Boolean).join(" ");
  html+=`<mark class="${classes}" data-note-source="day-${noteDays[story]}" data-note-page="${m.page}">${escapeText(text.slice(m.start,m.end))}</mark>`;
  cursor=m.end;
 }
 return html+escapeText(text.slice(cursor));
}
