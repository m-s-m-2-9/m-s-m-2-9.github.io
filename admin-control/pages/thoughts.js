/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/thoughts.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the THOUGHTS & BELIEFS page.
   Organised into categories. Each category has posts inside it.

   HOW TO ADD A CATEGORY:
   Add a new object to the 'categories' array.

   HOW TO ADD A POST to an existing category:
   Find the category by its id, then add to its 'posts' array.

   POST FORMAT:
   {
     date  : 'Month YYYY',
     title : 'Post Title',
     body  : 'Your thoughts here.',
   }
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_THOUGHTS = {

  sectionLabel: '11 — Thoughts',
  heading     : 'On everything that matters.',

  /* ── Belief Categories ──────────────────────────────────────────── */
  categories: [

    {
      id     : 'politics',
      icon   : `<svg xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20M4 22V10h16v12M2 10l10-8 10 8M6 14v4M10 14v4M14 14v4M18 14v4"/></svg>`,
      title  : 'Politics',
      preview: 'Power, governance, and what it means to be Indian.',
      posts  : [
        {
          date : 'May 2026',
          title: 'The Convenience of Corruption',
          body : 'We love to blame the system for corruption, but the truth is, we’ve made it a mutual agreement. It’s a two-way street. On one side, you have people with money who just want their work done fast; they don\'t have the time or patience to file complaints, so they pay their way out. On the other side, you have the poor who are actively forced into it—the system is so fundamentally broken that they have no choice but to hand over bribe money just to get basic, essential things done. When bribery becomes the only functional shortcut for the rich and the only survival mechanism for the poor, corruption stops being a crime and just becomes the daily cost of living.',
        },


{
          date : 'April 2026',
          title: 'The Stage-Managed Politician',
          body : 'Ever wonder why so many politicians run away from an unscripted, open-microphone session? It’s simple: they don\'t even know what their own policies are. If you ask them a genuine, spontaneous question about their own schemes, they physically cannot answer because they don\'t understand the details themselves. They are entirely dependent on their hired crowds, PR handlers, and pre-written scripts. Strip away the security, the screaming supporters, and the teleprompter, and they aren\'t capable of making a single, ordinary citizen understand their actual vision for the country. They don\'t fear the mic; they fear their own lack of substance being exposed.',
        },


{
          date : 'March 2026',
          title: 'Leaders, Not Rulers',
          body : 'Look at the hierarchy: it goes from Panchayat to MP, to CM, to PM, and to the President. But we constantly forget who sits at the very top of that pyramid: the citizens. Right now, we have politicians who can’t analyze a statistical report, sign their own papers smoothly, or even fluently communicate in the official languages used in Parliament to reply to common queries. The bureaucrats do the actual planning anyway, so why are the politicians acting like monarchs? We aren’t asking to hand over absolute rule to the public, but a democracy demands that our suggestions and feedbacks are actually listened to. They are supposed to be leaders doing good for us, not rulers reigning over us. Otherwise, why do we even call India a democracy?',
        },


{
          date : 'January 2026',
          title: 'The 90s Tech Time Capsule',
          body : 'It’s 2026, we are living in the age of AI and instant connectivity, yet trying to use a government website feels like traveling back to 1995. Let’s be real: it’s not that older politicians just "don\'t understand" technology. It’s that they are too corrupt to care. They refuse to invest the actual budget into hiring proper developers to upgrade the infrastructure. Instead, the mindset is a lazy, careless shrug: "Well, the website is built, it\'s running." Sometimes it loads, sometimes it crashes, but to them, what difference does it make? Digital progress stops the moment it requires transparency and effort.',
        },
         
         
      ],
    },

    {
      id     : 'god',
      icon   : `<svg xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.886L4.2 10.8l5.888 1.914L12 21l1.912-5.886 5.888-1.914-5.888-1.914Z"/></svg>`,
      title  : 'God & Faith',
      preview: 'Questions I sit with. Answers I\'m still finding.',
      posts  : [
        {
          date : 'April 2026',
          title: 'Replace — Post Title',
          body : 'Replace this with your thoughts on faith, religion, or the absence of it.',
        },
      ],
    },

    {
      id     : 'science',
      icon   : `<svg xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h12M14 22H10M8 2v3M16 2v3M9 11h6M12 5v6M5 18l4-7h6l4 7Z"/></svg>`,
      title  : 'Science',
      preview: 'The universe doesn\'t care. And somehow that\'s beautiful.',
      posts  : [
        {
          date : 'March 2026',
          title: 'Replace — Post Title',
          body : 'Replace this with your thoughts on science, the cosmos, or discovery.',
        },
      ],
    },

    {
      id     : 'life',
      icon   : `<svg xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
      title  : 'Life & Philosophy',
      preview: 'Why we\'re here, how to live well, and the rest of it.',
      posts  : [
        {
          date : 'February 2026',
          title: 'Replace — Post Title',
          body : 'Replace this with your thoughts on how to live.',
        },
      ],
    },

    {
      id     : 'society',
      icon   : `<svg xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>`,
      title  : 'Society & Culture',
      preview: 'Patterns in people. What we celebrate. What we should question.',
      posts  : [
        {
          date : 'January 2026',
          title: 'Replace — Post Title',
          body : 'Replace with your observations about society.',
        },
      ],
    },

    {
      id     : 'tech',
      icon   : `<svg xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>`,
      title  : 'Technology',
      preview: 'AI, the internet, attention — and what it\'s doing to us.',
      posts  : [
        {
          date : 'December 2025',
          title: 'Replace — Post Title',
          body : 'Replace with your thoughts on technology.',
        },
      ],
    },

  ],

};
