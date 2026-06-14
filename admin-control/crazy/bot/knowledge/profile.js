/* ═══════════════════════════════════════════════════════════════
   admin-control/crazy/bot/knowledge/projects.js
   ─────────────────────────────────────────────────────────────
   MASTER FACTS FILE — PART 3 of 3 (projects)

   Every project Manomay has built \u2014 facts only, no pre-written
   answer paragraphs.

   Read by:
     · profile.js buildFactString()    — feeds the AI's FACTS block
     · ai-fallback.js basicAnswer()    — zero-AI offline navigator
                                          (Tier 5 of the cascade)
     · (future) WebsiteSearch index    — local retrieval/ranking

   TO ADD A NEW PROJECT: copy the TEMPLATE block at the bottom,
   fill it in, paste above the template. Nothing else changes —
   every consumer above picks it up automatically.
   ─────────────────────────────────────────────────────────────
   SAVE AS: admin-control/crazy/bot/knowledge/projects.js
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.RORO_KNOWLEDGE = window.RORO_KNOWLEDGE || {};
  const K = window.RORO_KNOWLEDGE;

  K.projects = [

    {
      id: 'msm-website',
      title: 'MSM Personal Website',
      status: 'Ongoing',
      year: '2025\u2013Present',
      type: 'Web / Design',
      highlights: [
        'Built entirely from scratch \u2014 pure vanilla HTML, CSS, JavaScript',
        'Zero frameworks, zero templates',
        'Four colour themes: Noir, Ivory, Slate, Forest',
        'Custom CMS via admin-control files',
        'Desktop sidebar navigation system',
        'Five mini-games (Snake, 2048, Memory Match, Word Scramble, Reaction Time)',
        'Photo albums (public + private)',
        'Thoughts/blog with six categories',
        'RoRo AI assistant layer',
        'Custom animated cursor, GSAP splash animation',
        'Built-in music player with easter-egg song',
      ],
      keywords: ['website','portfolio','msm','msm website','msm personal website','this website','your site','his website','his portfolio','manomays website'],
      /* NOTE: removed overly-generic single-word keywords that used to
         live here: 'this','site','built','html','css','javascript','vanilla'.
         Each of those matches lower.includes(keyword) against the ENTIRE
         user message -- 'this' alone matched any sentence containing the
         word "this" anywhere (e.g. "why did you hardcode THIS response"),
         dumping the full website project description. Now only specific
         multi-word phrases that genuinely refer to the site match here;
         general "what is HTML/CSS/JS" questions go to the AI instead. */
      description: 'This website. Pure HTML, CSS, and JavaScript \u2014 zero frameworks, zero templates. Cinematic splash, custom CMS, sidebar system, five mini-games, photo albums, thoughts blog, RoRo AI, and four colour themes.',
    },

    {
      id: 'kvs-nationals',
      title: 'KVS National Science Exhibition',
      status: 'Completed',
      year: '2024',
      type: 'Academic Competition',
      highlights: [
        'Won at school level, then cluster level, then regional level',
        'Reached the KVS National Science Exhibition',
        'Benchmark achievement \u2014 everything else is measured against it',
      ],
      keywords: ['nationals','national','kvs','competition','exhibition','achievement','win','science','kvs nationals'],
      description: 'A competition-level initiative representing the school at the KVS National Science Exhibition. Reached the national stage after winning at school, cluster, and regional levels.',
    },

    {
      id: 'iskcon-camp',
      title: 'ISKCON Summer Camp',
      status: 'Completed',
      year: '2024',
      type: 'Education / Media',
      highlights: [
        'Creative Educator and Media Lead for 40+ students',
        'Origami, paper engineering, cardboard sculpting workshops',
        'Camp photographer, videographer, and vlog producer',
      ],
      keywords: ['iskcon','iskon','isckon','krishna','hare krishna','temple','camp','summer','educator','media','photography','workshop','iskcon camp'],
      description: 'Creative Educator and Media Lead for a 40+ student summer programme at ISKCON Centre. Ran workshops in origami, paper engineering, and cardboard sculpting, and served as camp photographer, videographer, and vlog producer.',
    },

    {
      id: 'ecommerce',
      title: 'E-commerce Prototype',
      status: 'Completed',
      year: '2024',
      type: 'Web / Development',
      highlights: [
        'Full e-commerce prototype built from scratch',
        'Product listings, cart, and checkout flow',
        'No frameworks \u2014 handcrafted',
        'Demonstrates real-world product thinking',
      ],
      keywords: ['ecommerce','ecom','shop','store','shopping','cart','commerce','online store','prototype'],
      description: 'A full e-commerce prototype built from scratch \u2014 product listings, cart, and checkout flow. Handcrafted, no frameworks. Demonstrates real-world product thinking and frontend capability.',
    },

    {
      id: 'writing',
      title: 'Until The Bullet Woke Me',
      status: 'Completed',
      year: '2024',
      type: 'Creative Writing',
      highlights: [
        'A creative writing project composed with deliberate craft',
        'The title carries the weight of the content',
      ],
      keywords: ['writing','story','bullet','creative','fiction','until the bullet','bullet woke me','short story','prose'],
      description: 'A creative writing project. A story composed with deliberate craft. The title carries the weight of the content.',
    },

    /* ── TEMPLATE: copy this block to add a new project ─────────
    {
      id: 'unique-id',
      title: 'Project Title',
      status: 'Completed' | 'Ongoing' | 'Abandoned',
      year: '2026',
      type: 'Category / Type',
      highlights: [ 'Point 1', 'Point 2' ],
      keywords: [ 'keyword1', 'keyword2' ],
      description: 'Full description \u2014 used by offline fallback and AI facts.',
    },
    ──────────────────────────────────────────────────────────── */

  ];

})();
