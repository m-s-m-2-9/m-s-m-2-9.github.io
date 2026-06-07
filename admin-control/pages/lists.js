/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/lists.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the CURATIONS / LISTS page.
   Four tabs: Series · Books · Places · Movies

   HOW TO ADD AN ITEM:
   Add a new object to any category array below.

   STATUS OPTIONS (copy-paste exactly):
   'seen'    → watched / read / visited  (green)
   'want'    → want to watch/read/visit  (gold)
   'reading' → currently reading         (blue)
   'ongoing' → currently watching        (gold)

   STATUS LABEL:
   The text shown on the badge (you can write anything).
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_LISTS = {

  sectionLabel: '10 — Curations',
  heading     : 'Things worth\nexperiencing.',  /* \n = line break */

  /* ── Web Series ─────────────────────────────────────────────────── */
  series: [
    {
      title : 'Breaking Bad',
      meta  : 'Drama · 2008–2013',
      status: 'seen',
      label : 'Watched',
    },
    /* ── Add more ──
    {
      title : 'Series Name',
      meta  : 'Genre · Year',
      status: 'want',
      label : 'Want to watch',
    },
    ──────────────── */

     {
      title : 'Squid Game',
      meta  : 'Survival Thriller · 2021–2025',
      status: 'seen',
      label : 'Watched',
    },



     {
      title : 'Asur',
      meta  : 'Psychological Crime Thriller · 2020–2023',
      status: 'seen',
      label : 'Watched',
    },


     {
      title : 'Money Heist',
      meta  : 'Crime Drama, Heist Thriller, and Suspense  · 2017–2021',
      status: 'seen',
      label : 'Watched',
    },


     {
      title : 'Stranger Things',
      meta  : 'Science-Fiction, Horror, and Supernatural Drama · 2016–2025',
      status: 'seen',
      label : 'Watched',
    },


     {
      title : 'House M.D',
      meta  : 'Medical Drama, Mystery · 2004–2012',
      status: 'ongoing',
      label : 'Watching',
    },


     {
      title : 'Suits',
      meta  : 'Legal Drama, Comedy-Drama · 2011–2019',
      status: 'seen',
      label : 'Watched',
    },

 {
      title : 'The Rookie',
      meta  : 'Police Procedural, Crime Drama, Action · 2018–Present',
      status: 'ongoing',
      label : 'Watching',
    },


     
  ],

  /* ── Books ──────────────────────────────────────────────────────── */
  books: [
{
title : 'It Starts With Us',
meta  : 'Colleen Hoover · 2022',
status: 'seen',
label : 'Read',
},

{
title : 'It Ends With Us',
meta  : 'Colleen Hoover · 2016',
status: 'seen',
label : 'Read',
},

{
title : 'Twisted Love',
meta  : 'Ana Huang · 2021',
status: 'ongoing',
label : 'Currently Reading',
},

{
title : 'Ikigai',
meta  : 'Héctor García and Francesc Miralles · 2016',
status: 'seen',
label : 'Read',
},

{
title : 'To Kill a Mockingbird',
meta  : 'Harper Lee · 1960',
status: 'seen',
label : 'Read',
},

{
title : 'Rich Dad Poor Dad',
meta  : 'Robert T. Kiyosaki · 1997',
status: 'seen',
label : 'Read',
},

{
title : 'The Psychology of Money',
meta  : 'Morgan Housel · 2020',
status: 'ongoing',
label : 'Currently Reading',
},

{
title : 'A Man Called Ove',
meta  : 'Fredrik Backman · 2012',
status: 'seen',
label : 'Read',
},

{
title : 'The Subtle Art of Not Giving a F*ck',
meta  : 'Mark Manson · 2016',
status: 'seen',
label : 'Read',
},

{
title : 'Everything Is F*cked',
meta  : 'Mark Manson · 2019',
status: 'want',
label : 'Want To Read',
},

{
title : 'Without Merit',
meta  : 'Colleen Hoover · 2017',
status: 'want',
label : 'Want To Read',
},

{
title : 'Man Kya Hai',
meta  : 'J. Krishnamurti · 2015',
status: 'seen',
label : 'Read',
},


{
    title : 'The Long Game',
    meta  : 'Elena Armas · 2023',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'The Love Hypothesis',
    meta  : 'Ali Hazelwood · 2021',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'Love, Theoretically',
    meta  : 'Ali Hazelwood · 2023',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'The Girl on the Train',
    meta  : 'Paula Hawkins · 2015',
    status: 'want',
    label : 'Want To Read',
  },

  {
    title : 'Until I Find You',
    meta  : 'John Irving · 2005',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'The Hundred-Year-Old Man Who Climbed Out the Window and Disappeared',
    meta  : 'Jonas Jonasson · 2009',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'The Keeper of Desolation',
    meta  : 'Chandan Pandey · 2024',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'Haunting Adeline',
    meta  : 'H. D. Carlton · 2021',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'All He\'ll Ever Be',
    meta  : 'Winter Renshaw · 2020',
    status: 'seen',
    label : 'Read',
  },

  {
    title : 'King of Wrath',
    meta  : 'Ana Huang · 2022',
    status: 'ongoing',
    label : 'Currently Reading',
  },

  {
    title : 'The Power of Your Subconscious Mind',
    meta  : 'Joseph Murphy · 1963',
    status: 'want',
    label : 'Want To Read',
  },

  {
    title : 'Eat That Frog!',
    meta  : 'Brian Tracy · 2001',
    status: 'want',
    label : 'Want To Read',
  },

  {
    title : 'Corporate Chanakya',
    meta  : 'Radhakrishnan Pillai · 2010',
    status: 'want',
    label : 'Want To Read',
  },

  {
    title : 'Sapiens: A Brief History of Humankind',
    meta  : 'Yuval Noah Harari · 2011',
    status: 'want',
    label : 'Want To Read',
  },

  {
    title : 'The Choice: Embrace the Possible',
    meta  : 'Edith Eger · 2017',
    status: 'seen',
    label : 'Read',
  },
     
],
  /* ── Places ─────────────────────────────────────────────────────── */
  places: [
    {
      title : 'Tokyo, Japan',
      meta  : 'Asia · Someday',
      status: 'want',
      label : 'Bucket list',
    },



{
      title : 'Pennsylvania, United States of America ',
      meta  : 'North America · Someday',
      status: 'want',
      label : 'Bucket list',
    },



     {
      title : 'London, United Kingdom ',
      meta  : 'Europe · Someday',
      status: 'want',
      label : 'Bucket list',
    },




     {
      title : 'Jaipur, India',
      meta  : 'Asia · Pink Cty',
      status: 'seen',
      label : 'Visited',
    },





     {
      title : 'Kochi (Cochin), India',
      meta  : 'Asia · Fort Kochi',
      status: 'want',
      label : 'Bucket list',
    },

     
  ],

  /* ── Movies ─────────────────────────────────────────────────────── */
  movies: [
  {
    title : 'Dhurandhar',
    meta  : 'Aditya Dhar · 2025',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Beast',
    meta  : 'Nelson Dilipkumar · 2022',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Anand',
    meta  : 'Hrishikesh Mukherjee · 1971',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Laila Majnu',
    meta  : 'Sajid Ali · 2018',
    status: 'want',
    label : 'Want To Watch',
  },

  {
    title : 'F1',
    meta  : 'Joseph Kosinski · 2025',
    status: 'want',
    label : 'Want To Watch',
  },

  {
    title : 'Master',
    meta  : 'Lokesh Kanagaraj · 2021',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Tumbbad',
    meta  : 'Rahi Anil Barve · 2018',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'It',
    meta  : 'Andy Muschietti · 2017',
    status: 'want',
    label : 'Want To Watch',
  },

  {
    title : 'My Fault',
    meta  : 'Domingo González · 2023',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Lokah Chapter 1: Chandra',
    meta  : 'Dominic Arun · 2025',
    status: 'want',
    label : 'Want To Watch',
  },

  {
    title : 'Kora Kagaz',
    meta  : 'Anil Ganguly · 1974',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Zindagi Na Milegi Dobara',
    meta  : 'Zoya Akhtar · 2011',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Rockstar',
    meta  : 'Imtiaz Ali · 2011',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Ek Se Badhkar Ek',
    meta  : 'Brij · 1976',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Gol Maal',
    meta  : 'Hrishikesh Mukherjee · 1979',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Housefull',
    meta  : 'Sajid Khan · 2010',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Jodi No.1',
    meta  : 'David Dhawan · 2001',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Interstellar',
    meta  : 'Christopher Nolan · 2014',
    status: 'seen',
    label : 'Watched',
  },

  {
    title : 'Project Hail Mary',
    meta  : 'Phil Lord and Christopher Miller · 2026',
    status: 'want',
    label : 'Want To Watch',
  },
],
  

};
