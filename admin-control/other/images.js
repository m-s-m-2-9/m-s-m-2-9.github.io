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
  desc  : 'My complete National level exhibition journey—from the initial competitive rounds and rigorous model preparation to the travels, behind-the-scenes setup, and unforgettable camaraderie with fellow delegates.',
  cover : 'assets/photos/NATIONALMAKING.jpeg',
  icon  : '🌆',
  count : 14,
  photos: [
    
    {src: 'assets/photos/NATIONALMAKING.jpeg',                   title: 'Collaborative Innovation in Progress', desc: 'Working closely with  volunteers and mentor to assemble and perfect our working model for the upcoming nationals presentation.'},
    {src: 'assets/photos/NLACNEWS.jpeg',                         title: 'Official Feature on KVS National Platform', desc: 'Proud to be featured on the official KVS social media handles while showcasing the vibrant cultural diversity of Uttarakhand during the national-level exhibition.'},
    {src: 'assets/photos/NATIONALLEVELSCHOOLCERTIFICATE.jpeg',   title: 'National Representation Certificate', desc: 'A proud moment receiving the certificate for national representation from the school management and dignitaries on stage during a school event.'},
    {src: 'assets/photos/NationalsCertificateStage.jpeg',        title: 'The Winning Moment: Heading to Nationals', desc: 'Receiving the regional first-place award that earned us a spot in the national exhibition lineup.'},
    {src: 'assets/photos/REGIONALLEVEL .jpeg',                   title: 'Where It All Began: The Cluster Level Exhibition', desc: 'Standing proudly alongside our exhibition projects representing Uttarakhand during the initial cluster-level selection round, setting the stage for our journey ahead.'},
    {src: 'assets/photos/SCHOOLLEVELPPP.jpeg',                   title: 'Project Evaluation and Principal Review', desc: 'Receiving valuable feedback and strategic guidance from our school Principal and teachers during a mock presentation run-through for the national exhibition.'},
    {src: 'assets/photos/SCHOOLLEVEL.jpeg',                      title: 'The First Victory: Winning 1st Prize at School Level', desc: 'The initial competitive round where my individual project model and display charts won first prize, kicking off my path toward nationals.'},
    {src: 'assets/photos/SCHOOLLEVELPP.jpeg',                    title: 'Presenting My Project to the School Evaluators', desc: 'Presenting the individual project display on Uttarakhand that successfully cleared the school round and ultimately competed at the national level.'},
    {src: 'assets/photos/BangloreAfterEventPhoto.jpeg',          title: 'KV Tirumalagiri School Event, desc: Capturing a Last minute photo - Standing proudly with my Guides and Fellows after a successful event.'},
    {src: 'assets/photos/BangloreNationalsTeamPhoto.jpeg',       title: 'A late-night team cohort photograph capturing the entire Bangalore Nationals delegation together, marking a memorable moment of unity and collaboration during the campaign.'},
    {src: 'assets/photos/NationalsChaos.jpeg',                   title: 'Behind the Scenes: Exhibition Setup and Preparation',desc:'A glimpse into the chaotic yet exciting preparation phase inside the main pavilion, showing participants and organizers working hard to set up the regional state exhibits before the official opening of the National level exhibition.'},
    {src: 'assets/photos/NationalsTripcasualphoto.jpeg',         title: 'Pre-Departure Gathering: Journey to Hyderabad',desc:'A casual group selfie taken with fellow participants outside the venue, holding exhibition props and gears while waiting for transport before boarding the train to Hyderabad for the next phase of the campaign.'},
    {src: 'assets/photos/traintoschoolcentrenationals.jpeg',     title: 'En Route to the Nationals Venue',desc:'A group selfie captured alongside fellow delegates inside the transit bus, heading from the station toward the main school center hosting the national level exhibition events.'},
    {src: 'assets/photos/casualafterdinnerconversation.png',     title: 'Post-Dinner Downtime and Interaction',desc:'A casual moment captured sitting outdoors with fellow participants after dinner, enjoying informal conversations and winding down after a busy day of national exhibition events.'},
    /* Add photos here:
       { src: 'assets/photos/nationals/1.jpg', title: 'Day 1', desc: 'Caption' }, */
  ],
},
    {
      id    : 'captain',
      title : 'Captain Arc',
      desc  : 'My Captainship Journey',
      cover : 'assets/photos/BadgeCloseUp.jpeg',
      icon  : '🎭',
      count : 8,
      photos: [
         {src: 'assets/photos/BadgeCloseUp.jpeg',                   title: 'The Investiture: Receiving the Captainship Badge', desc:'A close-up moment during the Official Investiture ceremony, capturing the pinning of the School Captain Badge, marking the formal commencement of my leadership responsibilities.'},
         {src: 'assets/photos/BadgePrincipal.jpeg',                   title: 'Investiture Ceremony: Presentation of the Badge', desc:'A formal moment on stage during the Official Investiture Ceremony as a school Principal pins the Captainship Badge, initiating my tenure as a Member of the Student Council.'},
         {src: 'assets/photos/DEBATE COMPETION.jpeg',                   title: 'Debate Competition Certificate Presentation', desc:'Standing on stage with school administrators, teachers, and fellow student achievers, celebrating a first-prize victory in the School-Level Debate Competition alongside winners of various other co-curricular events.'},
         {src: 'assets/photos/InformalGroupPhoto.jpeg',                   title: 'Informal Student Council Gathering', desc:'A Casual Group photograph with fellow newly appointed student Council Leaders, wearing our Official Leadership Sashes outside the Main Stage.'},
         {src: 'assets/photos/InvestitureCollage.jpeg',                     title: 'Investiture Ceremony Collage: 2025-26', desc:'A commemorative photo collage capturing key highlights from the official Investiture Ceremony, including the flag-bearing march, the pinning of leadership badges, and the formal introduction of the student council panel on stage.'},
         {src: 'assets/photos/SPEECH.jpeg',                                   title: 'The Dual Nature of Artificial Intelligence Speech', desc:'Addressing the student body from the stage, delivering a keynote speech on the opportunities and ethical challenges presented by modern AI technologies.'},
         {src: 'assets/photos/TEACHING MY FELOWS.jpeg',                         title: 'Peer-to-Peer Academic Leadership: Leading the Economics Session', desc:'Taking the initiative to conduct a classroom session on Economics, stepping forward to share my independent study notes with classmates during a temporary gap in our regular Economics faculty schedule.'},
         {src: 'assets/photos/USHABYEBYE.jpeg',                                   title: 'Farewell and Gratitude: Honoring Our Art Mentor', desc:'Presenting a token of appreciation on stage alongside the core student volunteers and helpers who supported my National level exhibition project, honoring our school Art Teacher during her official retirement ceremony for her invaluable guidance and mentorship.'},
         {src: 'assets/photos/VICE C GP.jpeg',                                      title: 'Casual Group Photo with the Student Council Panel', desc:'A casual group photograph standing alongside fellow newly appointed captains and vice-captains in our official leadership sashes following a Formal Investiture Ceremony, Commemorating our roles for the Academic Session.'},
         {src: 'assets/photos/VICE CAPTAIN GP.jpeg',                                  title: 'REPLACE', desc:'REPLACE'},
         {src: 'jpeg',                   title: 'REPLACE', desc:'REPLACE'},


         
      ],
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

     
   {
      id    : 'kvkrp',
      title : 'KV Krp',
      desc  : 'My Previous School\'s Highlights',
      cover : '',
      icon  : '✨',
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
