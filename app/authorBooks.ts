export type AuthorBook = {
  title: string;
  image: string;
  source: string;
};

// Cover editions and source URLs are recorded in public/media/authors/books/sources.json.
export const authorBooks: Record<string, AuthorBook[]> = {
  "03": [
    {
      "title": "Roommates: My Grandfather’s Story",
      "image": "/media/authors/books/roommates.jpg",
      "source": "https://www.publishersweekly.com/9780446518260"
    },
    {
      "title": "I Love Gootie: My Grandmother’s Story",
      "image": "/media/authors/books/i-love-gootie.webp",
      "source": "https://www.kirkusreviews.com/book-reviews/max-apple/i-love-gootie/"
    }
  ],
  "05": [
    {
      "title": "Talking to High Monks in the Snow",
      "image": "/media/authors/books/talking-to-high-monks.jpg",
      "source": "https://www.publishersweekly.com/9780060168094"
    },
    {
      "title": "The Strangeness of Beauty",
      "image": "/media/authors/books/strangeness-of-beauty.webp",
      "source": "https://www.kirkusreviews.com/book-reviews/lydia-minatoya/the-strangeness-of-beauty/"
    }
  ],
  "06": [
    {
      "title": "The Autobiography of Benjamin Franklin",
      "image": "/media/authors/books/franklin-autobiography.jpg",
      "source": "https://www.simonandschuster.com/books/The-Autobiography-of-Benjamin-Franklin/Benjamin-Franklin/9780743255066"
    },
    {
      "title": "Poor Richard’s Almanack",
      "image": "/media/authors/books/poor-richards-almanack.jpg",
      "source": "https://www.skyhorsepublishing.com/9781602391178/poor-richards-almanack/"
    }
  ],
  "07": [
    {
      "title": "Guns, Germs, and Steel",
      "image": "/media/authors/books/guns-germs-and-steel.jpg",
      "source": "https://wwnorton.co.uk/books/9780393354324-guns-germs-and-steel"
    },
    {
      "title": "Collapse",
      "image": "/media/authors/books/collapse.jpg",
      "source": "https://www.penguinrandomhouse.com/books/288954/collapse-by-jared-diamond/"
    }
  ],
  "08": [
    {
      "title": "Movement Media",
      "image": "/media/authors/books/movement-media.jpg",
      "source": "https://www.rachelkuo.com/movement-media-book"
    },
    {
      "title": "We Are Each Other’s Liberation",
      "image": "/media/authors/books/each-others-liberation.jpg",
      "source": "https://www.haymarketbooks.org/books/2519-we-are-each-other-s-liberation"
    }
  ],
  "10": [
    {
      "title": "Life on the Mississippi",
      "image": "/media/authors/books/life-on-the-mississippi.jpg",
      "source": "https://penguinrandomhousesecondaryeducation.com/book/?isbn=9780140390506"
    },
    {
      "title": "The Adventures of Tom Sawyer",
      "image": "/media/authors/books/tom-sawyer.jpg",
      "source": "https://penguinrandomhousesecondaryeducation.com/book/?isbn=9780143107330"
    },
    {
      "title": "Adventures of Huckleberry Finn",
      "image": "/media/authors/books/huckleberry-finn.jpg",
      "source": "https://penguinrandomhousesecondaryeducation.com/book/?isbn=9780143107323"
    }
  ]
};
