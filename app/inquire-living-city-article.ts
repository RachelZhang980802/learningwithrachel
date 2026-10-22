import type { InquireFeatureArticle } from "./inquire-feature-articles";

export const livingCityArticle: InquireFeatureArticle = {
  title: "Living in a Big City: Advantages and Disadvantages (2025)",
  eyebrow: "EXTERNAL READING · RENOVATED",
  byline: "Evelyn Long · Renovated · Updated May 23, 2025",
  dek: "A reading guide to the practical trade-offs of urban life, based on the Renovated article.",
  sectionHeadings: ["Advantages of city life", "Disadvantages to weigh", "A personal decision"],
  paragraphs: [
    "City life is often portrayed as full of culture, activity, and opportunity. Whether it suits someone depends on practical matters such as housing and transportation, as well as personal priorities, including work, community, and family ties.",
    "Advantages of city life",
    "Large cities offer a wide range of entertainment, from museums, theaters, and historic places to parks, trails, clubs, and bookstores. A larger population can make it easier to find communities and people who share particular interests. Cities also tend to bring together a wider variety of jobs and career paths, especially in fields concentrated in business, technology, and financial centers.",
    "Public transportation can reduce the need to own a car and may make commuting more convenient. It can also help lower the environmental impact of travel, although service quality varies by city.",
    "Disadvantages to weigh",
    "Urban living often costs more. Rent, food, entertainment, parking, and move-in fees can take a substantial share of a household budget. Sharing a home may make housing more affordable, but it can also mean less privacy and personal space.",
    "Crowds bring other trade-offs: parking can be hard to find, lines and waits may be longer, and traffic or busy public spaces can add stress. A fast-paced work and commuting routine may also feel tiring for people who prefer quieter surroundings.",
    "A personal decision",
    "The article concludes that there is no single right answer. People drawn to urban jobs, activities, and communities may find the compromises worthwhile; those who value space, quiet, and a slower pace may prefer suburban or rural life. The best choice depends on which benefits matter most to the individual."
  ]
};

export const livingCityProsCons = [
  {
    topic: "Public Transportation",
    pros: ["It’s eco-friendly.", "You save on parking fees.", "You can catch up on work while being transported."],
    cons: ["It’s noisy.", "You have to travel according to the set times.", "It’s not always reliable."]
  },
  {
    topic: "Living Arrangements",
    pros: ["Your roommate could become a friend for life.", "It’s more affordable to share."],
    cons: ["There is less space because you have a roommate.", "Less privacy in a shared room.", "It’s more expensive if you live alone."]
  },
  {
    topic: "Large Population",
    pros: ["Better social life.", "Better entertainment options."],
    cons: ["Parking spots are harder to find.", "Waiting time in public spaces increases."]
  }
] as const;
