/* ═══════════════════════════════════════════════════════════════════
   admin-control/other/images.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Every image path / URL used across the whole site lives here.
   Change a photo once here — it updates everywhere automatically.

   HOW TO REFERENCE IMAGES:
   · Local files: use the path relative to your index.html
     Example: 'assets/photos/my-photo.jpg'
   · External URLs: paste the full URL
     Example: 'https://i.imgur.com/abc123.jpg'
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_IMAGES = {

  /* ── Core Profile Photos ─────────────────────────────────────────── */
  hero : 'assets/photos/profilepic.jpeg', /* ← circular photo on homepage     */
  about: 'assets/photos/stagepic.jpeg',  /* ← portrait on Identity page       */

  /* ── Photo Albums — Public ──────────────────────────────────────── */
  /*
    Each album entry:
    {
      id       : 'unique-id',         ← used internally, don't duplicate
      title    : 'Album Name',        ← shown on hover
      desc     : 'Short caption',     ← shown on hover
      cover    : 'path/to/thumb.jpg', ← cover thumbnail (or '' for placeholder)
      count    : 12,                  ← number shown on album card
      photos   : [                    ← array of photos inside the album
        { src: 'path.jpg', title: 'Photo title', desc: 'Caption' },
      ]
    }
  */
  publicAlbums: [
    {
  id    : 'nationals',
  title : 'My Nationals Journey',
  desc  : 'My Nationals Journey REPACEEEE',
  cover : '',
  icon  : '🌆',
  count : 8,
  photos: [
    {src: 'assets/photos/NATIONALLEVELSCHOOLCERTIFICATE.jpeg', title: 'National Representation Certificate', desc: 'A proud moment receiving the certificate for national representation from the school management and dignitaries on stage during a school event.'},
    {src: 'assets/photos/NATIONALMAKING.jpeg',                   title: 'Collaborative Innovation in Progress', desc: 'Working closely with  volunteers and mentor to assemble and perfect our working model for the upcoming nationals presentation.'},
    {src: 'assets/photos/NLACNEWS.jpeg',                          title: 'Official Feature on KVS National Platform', desc: 'Proud to be featured on the official KVS social media handles while showcasing the vibrant cultural diversity of Uttarakhand during the national-level exhibition.'},
    {src: 'assets/photos/NationalsCertificateStage.jpeg',         title: 'The Winning Moment: Heading to Nationals', desc: 'Receiving the regional first-place award that earned us a spot in the national exhibition lineup.'},
    {src: 'assets/photos/REGIONALLEVEL .jpeg',                   title: 'Where It All Began: The Cluster Level Exhibition', desc: 'Standing proudly alongside our exhibition projects representing Uttarakhand during the initial cluster-level selection round, setting the stage for our journey ahead.'},
    {src: 'assets/photos/SCHOOLLEVELPPP.jpeg',                  title: 'Project Evaluation and Principal Review', desc: 'Receiving valuable feedback and strategic guidance from our school Principal and teachers during a mock presentation run-through for the national exhibition.'},
    {src: 'assets/photos/SCHOOLLEVEL.jpeg',                      title: 'The First Victory: Winning 1st Prize at School Level', desc: 'The initial competitive round where my individual project model and display charts won first prize, kicking off my path toward nationals.'},
    {src: 'assets/photos/SCHOOLLEVELPP.jpeg',                    title: 'Presenting My Project to the School Evaluators', desc: 'Presenting the individual project display on Uttarakhand that successfully cleared the school round and ultimately competed at the national level.'}

    /* Add photos here:
       { src: 'assets/photos/nationals/1.jpg', title: 'Day 1', desc: 'Caption' }, */
  ],
},
    {
      id    : 'captain',
      title : 'Captain Arc',
      desc  : 'My Captainship Journey',
      cover : '',
      icon  : '🎭',
      count : 8,
      photos: [],
    },
    {
      id    : 'farewell',
      title : 'Farewell',
      desc  : 'My Class X and XII Farewell',
      cover : '',
      icon  : '🌊',
      count : 20,
      photos: [],
    },
  ],

  /* ── Photo Albums — Private (password locked) ────────────────────── */
  privateAlbums: [
    {
      id    : 'me-us',
      title : 'Me/Us',
      desc  : 'Me With You ALL',
      cover : '',
      icon  : '💫',
      count : 15,
      photos: [],
    },
    {
      id    : 'secret',
      title : 'Secret',
      desc  : 'xyz description',
      cover : '',
      icon  : '🌹',
      count : 9,
      photos: [],
    },
  ],

};
