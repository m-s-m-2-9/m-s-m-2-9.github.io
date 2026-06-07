/* ═══════════════════════════════════════════════════════════════════
   admin-control/pages/journey.js
   ───────────────────────────────────────────────────────────────────
   WHAT THIS FILE DOES:
   Controls the JOURNEY / TIMELINE page.
   Each year has a title and a body paragraph.

   HOW TO ADD A YEAR:
   Add a new object to the 'years' array following the pattern below.

   HOW IT WORKS:
   · Each year appears as a dot on the horizontal timeline.
   · Clicking a dot reveals the title + body text below.
   · Years with hasContent: false show a placeholder message.
   ───────────────────────────────────────────────────────────────────
   PRIVATE ENTRIES:
   Any entry with  private: true  is only shown after password unlock.
   Set its body text in the normal 'body' field — it is hidden by
   the password gate, not stored separately.
═══════════════════════════════════════════════════════════════════ */

window.ADMIN_JOURNEY = {

  sectionLabel      : '09 — Journey',
  heading           : '2008 to present.',
  subheading        : 'Click a year on the timeline to explore that chapter.',
  emptyPlaceholder  : 'Nothing recorded yet for this year.',

  /* ── Timeline Years ─────────────────────────────────────────────── */
  years: [

    {
      year      : 2008,
      title     : 'The Beginning.',
      body      : `I arrived in Mumbai before I even understood what a beginning meant. While most babies announced themselves to the world with tears and panic, I apparently decided to do the exact opposite. They say I smiled. Laughed, even. A strange little creature entering the world as if life was already some private joke only he understood. Ever since then, the nickname “Manu” stayed stitched to me like an old family tradition, surviving years, cities, and growing up.

I do not remember the house I lived in back then. I do not remember the walls, the streets, or the sound of that neighborhood. My memories begin much later, as if my mind took time to switch on properly. The year exists more through stories than recollection, through fragments told by others instead of scenes I can replay myself. Yet somewhere in Mumbai, in a room I no longer remember, the first page of my story quietly began.`,
      hasContent: true,
      private   : false,
    },

    {
      year      : 2009,
      title     : 'The Boy Made of Cardboard Worlds.',
      body      : `Mumbai was still home, though I remember it less as a place and more as a faded atmosphere that existed before memory fully learned how to hold shape. These years survive through stories told at family gatherings, through laughter in between conversations, through old boxes that probably still carry photographs no one has properly unpacked in years.

Apparently, I was not the quiet kind of child. I was sharp, curious, and just mischievous enough to keep everyone alert. The sort of kid who could turn ordinary afternoons into chaos without even trying. Yet there was something strangely simple about me too. While other children were surrounded by flashy toys, I found entire worlds inside empty cardboard boxes and used matchboxes. A small box could become a car, a building, a spaceship, or some mysterious machine only my imagination understood.

Even though I was born in 2008, there was something oddly old-school about the way I grew up. Before algorithms, before constant screens, before childhood became filtered through tablets and notifications, there were just random objects, imagination, and long hours of making stories out of nothing. I danced whenever music played, without caring who was watching. Somewhere in those tiny rented rooms and crowded Mumbai spaces, a loud little child was unknowingly building the first version of himself.`,
      hasContent: true,
      private   : false,
    },

    {
      year      : 2010,
      title     : 'Blurred Years & Packed Suitcases.',
      body      : `By 2010, life still felt like an unfinished sketch. The memories remain blurry, almost inaccessible, like trying to remember a dream after waking up too quickly. I cannot recall the streets of Mumbai clearly, nor the exact homes we lived in. What remains instead is a strange emotional texture — movement, packed belongings, old phones filled with forgotten pictures, cartons shifting from one city to another without ever being fully opened. My childhood did not revolve around expensive things. It revolved around curiosity. Empty boxes became treasures. Matchboxes became toys. Ordinary household objects became entire universes inside my head. Looking back now, it feels strangely beautiful. There was no pressure to be aesthetic, productive, or perfect. Childhood was simply lived. I have seen very few photographs from those years, and the funny part is that most of them apparently feature baby-me existing without a single concern in the world, proudly unaware of concepts like embarrassment or future dignity. Somewhere, hidden in old storage boxes or sleeping inside broken phones nobody charges anymore, those moments probably still exist. Tiny frozen fragments of a boy who knew nothing about the future waiting for him. The world around me was changing quickly, but my own little universe was still innocent, loud, playful, and wonderfully unaware. Those years may be difficult to remember clearly, yet they remain important because they built the foundations of everything that came later.`,
      hasContent: true,
      private   : false,
    },
{
  year      : 2011,
  title     : 'The Year My Mind Switched On.',
  body      : `By 2011, the fog had finally started clearing. This was the year my memories truly began to exist. At the end of 2010, we had moved from Mumbai to Jaipur, and somewhere between that shift, my mind slowly switched on like an old television warming up after being plugged in.

I started going to a preschool called Star Kids. Life was incredibly simple back then, almost suspiciously peaceful when I think about it now. Our house had a jail-bar styled window that should have looked restrictive, yet the entire atmosphere around it felt strangely comforting. There was no stress. No pressure. Mornings belonged to school uniforms and sleepy walks to class, afternoons belonged to old 90s songs playing softly on the radio, and evenings belonged to homework notebooks spread across the floor while daylight slowly disappeared outside.

Sometimes my father would drop me to school on his bike, and sometimes I walked there myself. I still remember going to D-Mart with him, sitting squeezed between grocery bags on that single bike while the city passed around us. At that age, nothing felt embarrassing, difficult, or complicated. Even ordinary moments carried a strange kind of warmth.

I was an extremely talkative child who could never sit still for more than two minutes. I danced to everything — party songs, sad songs, romantic songs — none of it mattered. If music existed, I was already moving. I asked endless questions about almost everything around me, as if the world was some giant mystery personally designed for me to investigate. Most of the children around me were older, so I grew up trying to keep up with them instead of staying inside my own age group. Somehow, the older didis around me absolutely adored me too. Maybe it was the nonstop talking, maybe the dancing, or maybe I was just a dangerously charming child with zero awareness of it.

Television became another small universe of its own. Doraemon and Shinchan practically ruled my afternoons, while shows like Ben 10, Dragon Ball Z, or Chhota Bheem never really interested me the way they did for everyone else. I remember doing mathematics homework seriously back then, which feels deeply ironic now considering how much I absolutely hate the subject today.

Looking back, 2011 feels calm. Safe. Warm. Even if life had difficulties hidden somewhere in the background, my family never allowed them to reach me. I was simply a curious, energetic, dreamy child searching for attention, dancing through rooms, talking endlessly, and unknowingly building the personality I would carry for years to come.`,
  hasContent: true,
  private   : false,
},

{
  year      : 2012,
  title     : 'A Tiny Crush & a Dusty Fall.',
  body      : `By 2012, Jaipur no longer felt unfamiliar. Life had settled into routines, and childhood had started becoming clearer, louder, and far more memorable. I was still studying at Star Kids, and strangely enough, mathematics had become my strongest subject. I used to score full marks constantly — 40 out of 40 almost every time — and the questions felt so easy that I genuinely started wondering whether I had accidentally been placed in the wrong class. Eventually, I was promoted directly from LKG to UKG, which, at age four, felt less like an academic achievement and more like proof that I was secretly some tiny genius wandering around in a school uniform.

I barely remember my teachers now except for faint flashes of the principal, but I definitely remember being known around school. I was energetic, loud, constantly involved in something, and weirdly popular for one very specific reason that shall remain classified forever. Dance performances, sports competitions, school activities — I jumped into everything with full confidence and somehow managed to conquer most of it. Sitting quietly was never really an option for me.

Fragments of old classmates still survive in my memory like scattered names written on the last pages of a forgotten notebook — Poorvi, Anjali, Ram, Saurabh, and many others I can no longer fully remember. Some faces faded with time, but the feeling of those school years never really disappeared.

And then there was my first crush, which still sounds absolutely ridiculous considering I was barely four or five years old. One day while walking back home from school with my mother, I randomly asked her, “Mummy, once I grow up, you’ll have to find a bride for me, right?” She casually said yes. With the confidence of a man who apparently had his entire future planned already, I proudly announced, “No need mummy, I already found her.” Immediately after delivering this historic statement, I ran away in embarrassment like my life depended on it. Unfortunately, destiny had other plans. Before reaching home, I fell straight onto the dusty road and earned the kind of scraped injury every child remembers — the burning, sandy pain where your skin feels completely shredded for days afterward. Childhood romance lasted approximately thirty seconds before gravity personally intervened.

Outside school, one of my favorite places in the world was Nehru Garden. To reach it, we crossed the sabji mandi and the railway crossing before finally arriving there. Even though it was close to home, visiting it only once a week somehow made it feel magical. That park felt enormous to me back then, almost like another universe hidden inside Jaipur.

Technology barely existed in my life during those years. No phones, no computers, no gaming obsession, nothing. I did not even know devices could be used for entertainment. My world was built from school corridors, dance stages, evening walks, playground dust, radio songs, and imagination. Looking back now, it feels beautifully untouched.`,
  hasContent: true, 
  private   : false,
},

    { 
        
        year        : 2013,
        title       : 'The Boy Who Kept Dancing.',
        body        : `2013 was my final year at Star Kids, and by then I had fully transformed into the child everyone in school seemed to recognize instantly. Studies still felt ridiculously easy to me. Mischief was practically part of my personality, yet somehow my talent constantly saved me from punishments. I talked too much, created chaos wherever I went, participated in almost everything possible, and still somehow remained a teacher’s favorite. Looking back now, I honestly have no idea how I managed that balance.

School events had slowly started becoming my territory. Fancy dress competitions turned into full performances rather than simple costumes. One day I became Gandhi, another day Krishna, and somehow at one point even a lotus flower. I danced everywhere I could. Annual functions, competitions, performances — if there was a stage, I wanted to be on it. Songs like Chammak Challo and Lungi Dance completely ruled that phase of my life, and apparently those performances became memorable enough for my family to still talk about them years later.

One particular moment stayed frozen in everyone’s memory. During a performance, my scarf suddenly fell off in the middle of the stage. Most children would have panicked or stopped dancing, but I simply ignored it and continued performing like nothing had happened. The audience erupted into cheers, and somehow that tiny moment accidentally became one of my earliest “main character” memories. I rarely remember standing anywhere except first place back then. Winning had quietly started feeling normal.

Outside school, life still carried that warm Jaipur atmosphere I had grown attached to. Frequent power cuts would throw the entire neighborhood into darkness, creating a strange mix of chaos and beauty at the same time. Those evenings felt alive in a way modern life rarely does now. I never properly learned how to fly kites myself, but I loved standing beside the older neighborhood boys while they controlled them in the sky. My job was usually holding the chakri while watching the battles happening far above the rooftops.

One of my most prized possessions was a huge pink water bottle shaped almost like a tank. That thing was practically indestructible. I desperately wanted one of the newer steel bottles everyone else carried, but my parents refused until the old one broke. Eventually, childhood logic took over and I decided to solve the problem personally by trying to destroy it myself.

That year also planted one of my earliest serious questions about faith. I remember my parents organizing a yagya after some strange-looking pandit insisted it was necessary. He demanded a large amount of money even though almost everything was arranged and handled by my own family while he mostly sat in one place reciting phrases I could not even understand properly. Somewhere during that experience, my tiny brain started questioning things for the first time. If God truly wanted people to work hard, do good karma, and live honestly, then why did devotion sometimes feel so dependent on expensive rituals, endless effort, and fear? It was probably the first moment in my life where blind belief stopped feeling automatic.

Looking back now, 2013 feels loud, dramatic, playful, and strangely important. It was the year I realized I loved attention, loved performing, loved making people react, and perhaps most importantly, loved asking questions even when adults did not always have answers.`,
        hasContent  : true,
        private     : false,
     
     },

{
  year      : 2014,
  title     : 'The Boy Who Looked at Stars.',
  body      : `2014 marked the beginning of my Kendriya Vidyalaya journey, a journey that would continue for years afterward. My first school there was Kendriya Vidyalaya Number 1 Jaipur, and even today my memories of those early KV years feel strangely blurred together. Sometimes I still get confused trying to remember which events belonged to which school or which year. It almost feels like my brain switched off again after the vivid memories of Star Kids.

The school itself felt enormous compared to everything I had experienced before. Yet I never really missed Star Kids. Kendriya Vidyalaya brought new opportunities, and I wanted to try everything it offered. This was the first time I started learning instruments properly. I learned harmonium, congo, ragas, school songs, and performances that slowly became part of my everyday life. Fancy dress competitions and playful chaos had now transformed into EVS projects, mathematics posters, assemblies, discipline, and structured activities. Childhood was slowly becoming more organized.

My uniform had changed too. Gone were the bib-like jumpsuits from preschool days. Now it was grey shorts, a red-white-blue checkered shirt, a KV logo belt, and polished black shoes that somehow made me feel older than I actually was. Every morning I waited for the school van to arrive, carrying me toward this giant new world that felt far more serious than the tiny comforting universe of Star Kids.

Academically, mathematics still felt unbelievably easy to me, almost like a game rather than a subject. But gradually my favorite subject shifted toward EVS because for the first time studies actually felt connected to the real world. Science, society, politics, nature — everything started making sense in a way I had never noticed before. It no longer felt like memorizing random things from textbooks. It felt useful. Real.

The teachers, however, were extremely strict. I could no longer behave like the endlessly chaotic child I had been earlier. Discipline became unavoidable. I sat on the front bench constantly because teachers were already annoyed enough by my nonstop energy. Still, even within those rules, I found ways to stay creative. I performed in choir groups, played congo during functions, and continued participating in anything involving music or performance.

Some of my strangest childhood habits also belonged to this year. For reasons even I cannot explain properly today, I absolutely loved eating chalk and licking the iron mesh on windows because of its metallic taste. Deeply unhygienic? Completely. But childhood logic rarely follows health guidelines.

At home, life still carried a comforting rhythm. I often sat in the kitchen while my mother cooked food, proudly reciting English poems and textbook stories to her as if I were performing inside some grand auditorium instead of a small kitchen. Cartoons still ruled my free time, and evenings remained simple in the best possible way.

But perhaps the most important memory from 2014 was my obsession with stars. Whenever I got time, I simply stared at the night sky wondering if one day I would somehow reach there myself. Later, I would learn how impossibly far stars actually are, millions of light years away from us. Yet even after understanding that distance, a strange part of me still believes I will reach them someday. Maybe not physically, maybe not scientifically, but somehow, in some form, I still will.`,
  hasContent: true,
  private   : false,
},

{
  year      : 2015,
  title     : 'When Applause Started Fading.',
  body      : `2015 was strange in ways I could not fully understand back then. I was still studying in Kendriya Vidyalaya Number 1 Jaipur, somewhere between the later half of second class and the beginning of growing up emotionally. Studies still felt easy to me, especially EVS, which remained my favorite subject because it connected school to the real world around me. But this was also the year I slowly realized something important — I was the main character of my own life, yet every single person around me felt the exact same way about theirs. For the first time, I understood that the world did not revolve around me alone.

Competition had started becoming serious now. There were many students better than me in academics, drawing, sketches, and other activities teachers valued more openly. I still loved singing, dancing, instruments, and performing, but slowly those things stopped feeling appreciated in the environment around me. Somewhere during that time, someone casually told me that dancing and singing were “for girls” and that I did not fit there. I do not know why those words affected me so much. I did not argue. I did not defend myself. I simply started accepting it quietly, and over time I slowly began losing interest in the things that once made me happiest. Even today, I regret that silence.

Despite that, performance and creativity still remained part of me. I sang, danced, acted in plays, and played instruments whenever I got opportunities. It was impossible to remove that side of me completely because it had already become part of my personality long before anyone tried labeling it.

That year also carried a softer loneliness at home because my father had been transferred to Maharashtra for work. During summer holidays, my mother enrolled me in skating classes near Nehru Garden. I learned skating there and eventually became surprisingly good at it. Every day while returning from classes, I crossed the same roads filled with familiar faces. I often saw people smoking nearby, and for some reason tiny-me took it upon himself to personally convince random adults to stop. I used to lecture them seriously about how bad smoking was, and somehow a few of them even claimed they had quit, or at least stopped smoking in front of me afterward.

Near our house there was also a huge sugarcane warehouse owned by some incredibly kind people. After skating classes, they often gave me free sugarcane while I walked back home. Those tiny moments carried a warmth difficult to explain now. I still remember sitting inside a tub eating sugarcane pieces before taking cold water baths afterward, the kind of small summer memory that somehow stays alive forever.

Emotionally, I had started changing too. I became more observant, quieter in certain ways, more emotional, and slightly insecure beneath the confident exterior people usually saw. Underconfidence had quietly entered places where endless energy once existed naturally. Phones were still mostly keypads back then, technology remained distant, and life still moved slowly enough for ordinary moments to feel complete on their own.

Looking back now, 2015 feels like the year childhood innocence collided with self-awareness for the first time. It was the year applause stopped feeling guaranteed, the year comparison entered my mind, and the year I slowly began learning how deeply words from others could shape the version of ourselves we choose to become.`,
  hasContent: true,
  private   : false,
},

     
{
  year      : 2016,
  title     : 'The Year I Became Quieter.',
  body      : `At the end of 2015, life shifted once again as we moved to Panvel, Maharashtra. That was when my journey at Kendriya Vidyalaya ONGC Panvel began, the school where I completed the remaining half of second class before continuing into third and fourth. Compared to my earlier years, something inside me had started changing quietly. I was still mischievous, still energetic in many ways, but I had become noticeably calmer and more mature. Somewhere along the way, the loud performer inside me slowly disappeared.

I had completely stopped singing, dancing, acting in plays, and performing on stage. In my previous school, I had slowly learned that teachers valued drawing, essays, projects, and academics far more than performances, so I unconsciously pushed myself toward those things instead. Ironically, that strategy worked. I started receiving certificates and awards again, but this time in completely different fields. Yet even while succeeding, I became quieter. Assemblies no longer excited me. Stages terrified me. A strange stage fear had grown inside a child who once danced fearlessly in front of entire auditoriums.

I also started changing socially. Instead of sitting proudly on the first bench all the time, I slowly shifted toward the middle rows with proper friend groups forming around me for the first time. Those years carried both warmth and absolute chaos. One day, my friend accidentally threw my pencil pouch out of the classroom window, and it landed on the small roof outside a lower floor window. Nearby, some eighth-class seniors noticed us panicking. One of them told me to climb out through the classroom window and retrieve it myself. The ledge outside was tiny, unsafe, and terrifying, with no proper fencing at all, but fear of getting scolded by my parents somehow felt stronger than fear of falling. So I climbed out there with my friend anyway.

I was already terrified while trying to grab the pouch, but things became even worse while returning. One senior started pretending he would push me off the edge as some kind of joke. Even though he probably never intended to actually do it, I still remember the fear rushing through my body. Thankfully, a teacher noticed everything and immediately helped us get back safely. That incident became the first time my parents were ever called to school because of me.

Around the same period, technology finally started entering my life properly. My father bought a smartphone, and I became completely fascinated by it. I could not understand how one tiny device could contain so many things inside it. Secretly, while everyone slept, I used to watch PorkModz GTA videos for hours because for some reason they felt incredibly entertaining to me at the time. It was probably one of my first experiences with discovering an online world hidden behind a screen.

Academically, mathematics had also started becoming harder for me. For the first time, I was no longer scoring perfect marks constantly. My grades remained above average, and I still performed well in other subjects, but the effortless “god mode” feeling I once had with maths had slowly started disappearing. Outside studies, football became a major part of my life, and my favorite thing to do was high kicks. Somehow I could kick the ball ridiculously high, often better than kids much older than me.

At that age, my biggest dream was becoming a space scientist. I remained obsessed with the sky, stars, and the idea of exploring beyond Earth someday. Maybe that is why one particular memory from school still feels cinematic even now. During a community lunch inside one of our large semi-outdoor school areas, everyone suddenly started screaming while staring directly at me. For a few terrifying seconds I had no idea what was happening. Then I realized there was a huge snake sitting only inches away from me. I ran for my life immediately. Looking back now, it still feels unreal how close it actually was.

2016 feels like a strange transition year in my memory — quieter, more observant, slightly lonelier, yet also more self-aware. It was the year I stopped being the fearless child who wanted every spotlight, and slowly became someone who started watching the world more carefully from the middle rows instead.`,
  hasContent: true,
  private   : false,
},
     


{
  year      : 2017,
  title     : 'The Year I Learned To Fight Back.',
  body      : `2017 continued inside the familiar corridors of Kendriya Vidyalaya ONGC Panvel, but by then I had changed a lot from the loud little child I once used to be. EVS still remained my favorite subject because it made the world feel understandable and connected instead of just memorized. Mathematics had settled into the “average but manageable” category for me now. One teacher I still clearly remember from those years was Penakin Sir, who somehow made EVS genuinely interesting instead of boring textbook reading. Anthony Sir taught us English, though my strongest memory involving him is probably not one I should be proud of.

Around that time I had become obsessed with collecting Pokémon cards. They felt precious to me, like tiny treasures carrying entire worlds inside them. One day Anthony Sir found them in my bag and confiscated them. I could not accept losing them. So nearly a week later, when he asked me to place some files on his table inside the staff room, I secretly stole them back. Technically it was wrong. I know that. But strangely, even today, I still do not regret it. He use to beat us boys very brutally with sticks and books whatever he got It was terrifying.

By then I finally had proper friend groups too, and with friendships came conflict for the first time. We were supposed to sit two students per bench, but one boy deliberately started sitting uncomfortably close to irritate me. He constantly flicked my ears knowing it annoyed me. At first I ignored it, then I warned him, complained to teachers, and even involved parents, but instead of stopping, things only escalated further. Eventually, after being scolded by adults because of his behavior, he slapped me in class. That became the moment something inside me snapped.

I punched him directly on the nose. He screamed loudly in pain, and before anyone could properly react, I slapped him again and kicked him in the groin. I was injured too — my eye turned blue afterward — but his nose started bleeding badly. It became the second time my parents were called to school. Surprisingly though, almost nobody actually scolded me except his parents because everyone already knew what had been happening for weeks. Looking back now, it was probably the first time I truly learned the difference between tolerating something and standing up for myself.

Socially, I had become a strange mix of disciplined and chaotic. I hated sharing food because I was vegetarian, extremely particular about cleanliness, and obsessed with eating properly using spoons while most other children happily attacked lunchboxes with their hands, mixing everything together without caring at all. Tiny-me looked at that entire situation with silent judgment every single lunch break.

By then, singing and dancing had almost disappeared completely from my life. I had become so disconnected from that version of myself that I genuinely forgot I once loved performing. The desire for recognition still existed somewhere deep inside me, but stage fear had taken over so strongly that I could no longer imagine myself confidently standing in front of crowds anymore.

Life outside school still carried familiar warmth though. We continued visiting D-Mart on our bike, and I still ended up squeezed awkwardly between grocery bags during rides exactly like old Jaipur days. Some things never changed.

And then there was my crush. I had started liking one of the girls from class, though by then crushes had become less imaginary and more emotional. Ironically, she was also our monitor, and I constantly annoyed her despite liking her. She complained about me so often that even her mother probably knew my name. But somewhere between classroom chaos, silly arguments, and growing friendships, I had unknowingly become deeply attached to the people around me.

Then came another transfer. I remember telling everyone confidently that I would return in two or three years even though somewhere inside I already knew I probably never would. What shocked me most was realizing how many people genuinely cared about me. Boys and girls from class were literally crying because I was leaving. Even now I barely remember most of their names, yet I still remember the feeling of that goodbye.

Looking back now, 2017 feels emotional, messy, and strangely human. It was the year friendships became real, fights became personal, crushes became confusing, and I slowly realized that even when memories fade, certain feelings somehow never completely disappear.`,
  hasContent: true,
  private   : false,
},


   
{
  year      : 2018,
  title     : 'Balconies, Bunked Classes & Goodbyes Again.',
  body      : `In the ending months of 2017, life shifted once again and we were transferred to Ahmedabad. I joined Kendriya Vidyalaya No. 1 Shahibaug, a school that immediately felt different from the others I had studied in before. The building itself carried an old colonial aesthetic, a huge red structure renovated into a school. It looked historic, serious, and strangely beautiful at the same time. I quickly developed a good bond with my HM there, and despite everything, the school itself felt welcoming.

Leaving Panvel had genuinely hurt me though, mostly because of the life we had built there. The house, the environment, the people — everything had carried a warm comfort I had become attached to. In Ahmedabad, the house provided through the branch felt older and more traditional in style, but I still liked it because of one important detail: balconies. For some reason balconies always made houses feel alive to me.

Unfortunately, those balconies also became victims of my dramatic hatred toward certain vegetables. To this day I still do not understand why my family had such an obsession with karela, tinda, pumpkin, and lauki. Tiny-me considered those combinations nothing less than psychological warfare. Whenever I got the chance, I secretly threw pieces of food from the balcony to avoid eating them. Morally questionable? Absolutely. But at that age I truly believed I was the victim in this situation.

School life settled in quickly. EVS still remained my favorite subject while mathematics continued existing in the “average but survivable” category. Around this time I also started learning Gujarati, though even now my half-knowledge of Marathi and Gujarati mixes together inside my brain like unfinished software updates.

This was also the phase where I started bunking classes occasionally. Our school had a tiny canteen, and somehow the temptation of snacks and freedom felt far more attractive than sitting inside classrooms all day. Slowly, I started becoming socially noticeable again too. Senior girls often seemed oddly fascinated by me whenever I talked to them, though at that age I barely understood what any of it actually meant.

One incident from that period still feels disturbing even now. One day while I was bunking class near the canteen area, a senior girl came to talk to me along with another older boy who might have been her friend or boyfriend — I honestly had no idea back then. Suddenly, for reasons I still do not fully understand, that boy grabbed me by the neck and lifted me into the air. I instantly started choking. I remember desperately trying to kick him while hanging there, but he was much stronger than me. Thankfully, the senior girl immediately slapped him and forced him to stop. The second he let go, I ran straight back toward my classroom. My eyes had turned red and I was almost crying. When my teacher asked what happened, I lied and said I had slipped and fallen somewhere. After that day, I never comfortably spoke to seniors again.

And just when life had started settling once more, another transfer arrived only a few months later in January. By then, moving from one city to another had almost started feeling like a permanent part of my childhood itself.

Looking back now, 2018 feels unfinished in a strange way. It was short, transitional, slightly lonely, occasionally funny, and quietly emotional beneath the surface. Like standing in a corridor with packed boxes nearby, knowing you would soon have to leave again before fully belonging anywhere.`,
  hasContent: true,
  private   : false,
},



 
{
  year      : 2019,
  title     : 'The City Which Never Stops Moving.',
  body      : `2019 marked the beginning of the longest stable chapter of my childhood. Because of my father’s frequent transfers, my mother and I eventually moved to Bangalore so my studies would not constantly keep getting interrupted. That was when I joined Kendriya Vidyalaya KR Puram from sixth class onward, a place that would quietly shape a huge part of the person I would eventually become.

My first impression of Bangalore felt both calm and overwhelming at the same time. The city was filled with huge buildings, endless traffic, unpredictable weather, and people from everywhere speaking languages I barely understood. Until then, I had shifted through multiple cities, but Bangalore felt different. It felt permanent in a strange way.

Kendriya Vidyalaya KR Puram itself was much simpler than people imagined when hearing the name. It was more like a shed-style school than some giant modern campus, but the people there slowly made it memorable. The first time I entered my classroom, I remember noticing someone instantly, though that memory belongs to another story hidden somewhere deeper. What mattered more immediately was survival. Most students comfortably spoke Tamil, Kannada, Telugu, Malayalam, or fluent English while I struggled to communicate properly at first. Slowly, I started improving my English just to fit in better, and during that process I unknowingly picked up Kannada too.

By then EVS had divided into Science and Social Science, and surprisingly I enjoyed both subjects equally throughout those years. Mathematics still remained something I survived rather than loved. I still remember teachers like Nidhi Ma’am, my SST teacher and class teacher, and Laxmi Ma’am, who had once taught my mother and uncles years before me. That strange generational connection made school feel smaller somehow.

Socially, I had become a complete ambivert — quiet in some moments, loud and attention-seeking in others. I could be funny, irritating, observant, emotional, and chaotic almost simultaneously. I became friends with people like Vasudev, Nived, Nikhil, Anurag, Dhanush and many others, while also constantly annoying classmates like Pankhuri, Sakshi, Gayatri, Ananya and more for absolutely no reason except entertainment. The friend who would later feel like a real brother had not entered my life yet, but the foundations of deeper friendships were slowly beginning.

Every morning I travelled to school by auto around seven o’clock while Bangalore’s weather played its usual unpredictable games. Unlike peaceful rain in movies, Bangalore rain felt chaotic. Clothes flew away from balconies, trees collapsed, potholes filled overnight, traffic froze completely, and the entire city somehow looked both beautiful and irritated at the same time.

Technology had quietly started becoming part of my life now too. I watched videos and played games using my mother’s phone, though social media still meant absolutely nothing to me. Instagram, Snapchat, Twitter, memes — none of those worlds had entered my life yet. Instead, I developed an almost obsessive fascination with cars. I collected pictures of every type of car I could find and pasted them carefully inside notebooks like some personal automobile archive. My sketching habit became even stranger too. I drew everything imaginable — bottles, bikes, lamps, posters, buildings, televisions, souvenirs, models, random objects — literally anything that looked interesting enough to exist on paper.

Outside school, home life carried its own warmth. I lived with my uncle’s pet dog Madee, who was simultaneously adorable and violently aggressive. That creature probably bit me hundreds of times, yet I still loved him anyway.

Looking back now, 2019 feels like the beginning of a completely new phase of life. A new city, new languages, new friendships, new insecurities, and new fascinations slowly started shaping me all at once. It was the year where childhood stopped feeling temporary and slowly started becoming an identity.`,
  hasContent: true,
  private   : false,
},

     

{
  year      : 2020,
  title     : 'The Year The World Went Silent.',
  body      : `2020 was the year the world suddenly stopped moving. I completed my seventh class, eighth class, and half of ninth almost entirely inside lockdown, staring at screens while reality outside slowly became stranger every day. At first, it honestly felt exciting. Schools had shut down, classes shifted online, and for the first time in my life I got proper access to a computer for studies. Of course, “studies” was a very flexible word in my case. Most of the time online classes simply ran quietly in the background while I played games, watched videos, explored random websites, or did literally anything except paying attention. Somehow I still managed to score above 85%, though everyone from that generation probably already understands exactly how online schooling worked without further explanation.

Initially, lockdown almost felt fun. Waking up late, avoiding uniforms, escaping school routines, sitting comfortably at home all day — it felt like an unexpected vacation gifted to students across the world. But slowly the atmosphere changed. The jokes stopped feeling funny once people around us actually started dying. I still remember the first time reality truly hit me emotionally: one of my friend’s fathers passed away due to COVID. Hearing my friend cry over a phone call for the first time shattered the strange illusion that lockdown was just some long holiday. Suddenly the ambulance sounds outside every thirty minutes no longer felt like background noise. They felt terrifyingly real.

Online classes themselves were complete chaos. Teachers constantly begged students to switch cameras on while everyone pretended their internet was not working. Sleeping during class became normal. Teachers struggled with the simplest technical tasks while simultaneously trying to teach concepts and maintain discipline through tiny digital boxes on screens. Yet despite all the confusion, there were moments when learning still felt genuinely interesting, especially while understanding completely new concepts online for the first time. Internet issues remained constant though, turning even basic classes into accidental survival missions.

Emotionally, lockdown changed me a lot. I became lonelier, lazier, quieter in certain ways, and far more attached to the internet than ever before. This was the phase where I first properly discovered Instagram, online communities, random websites, and eventually Discord. Discord in particular became an obsession. I loved exploring servers, customizing bots, understanding systems, and slowly becoming more “techy” without even realizing it. Looking back now, that period quietly planted the foundation for my later fascination with technology, aesthetics, design, and online identity.

Gaming became another escape route during those endless months. I played free PC games for hours while old songs slowly entered my life more deeply too. Those retro songs shaped the niche aesthetics I would later become obsessed with — the dreamy, cinematic, nostalgic atmosphere that still follows me even now. Somewhere during lockdown, I stopped consuming things casually and started emotionally attaching myself to moods, visuals, sounds, and feelings.

At the same time, I became more aware of the world itself. Politics, healthcare systems, global decisions, governments, doctors, public fear — suddenly all these things felt important instead of distant adult conversations. COVID forced everyone, even children, to realize how fragile normal life actually was.

School friendships slowly faded into online chats and occasional calls. My crush still existed somewhere emotionally, but it no longer felt the same because real conversations had almost disappeared. Everyone felt distant from everyone else. Yet despite the fear, boredom, and uncertainty, we still tried creating memories. We made school videos wearing masks, joked during online calls, and pretended life was normal even while the world outside felt frozen.

Looking back now, 2020 feels surreal. Silent roads, endless screens, ambulance sirens, old songs at night, Discord notifications, unfinished classes, masks hanging near doors — it all blends together into one strange memory. It was the year childhood quietly ended for many people, including me.`,
  hasContent: true,
  private   : false,
},




{
  year      : 2021,
  title     : 'The Year of Fear and Stillness.',
  body      : `2021 was one of the most intense and terrifying phases of my life. I contracted COVID along with my mother, and at that time I genuinely felt like surviving the situation itself was uncertain. We were home quarantined, isolated inside our own house, but emotionally it felt like being cut off from the entire world.

My mind exaggerated everything I saw online — rising case numbers, news reports, stories from everywhere — and it created a constant sense of fear. Even when the symptoms were not always at their peak, anxiety made everything feel worse. I experienced high fever, chills, body pain, severe headache, blocked nose, and a constant difficulty in breathing that made even simple moments feel heavy and exhausting.

Inside the house, life became extremely controlled. Food was placed outside the door. Medicines were left at a distance. We were physically in the same home but emotionally separated, communicating mostly through phone calls and short conversations. It felt strange — talking to family members through a phone while being just a few rooms away.

Hospitalization never happened, partly because the situation outside was even more overwhelming and frightening. But mentally, I was still panicking most of the time, even when symptoms were not at their worst. Fear filled the gaps between reality and imagination.

During this phase, I became heavily addicted to screens. My entire day revolved around watching videos, stand-up comedy, and anything that could distract my mind from overthinking. Online classes continued in full force, but my attention toward them had significantly dropped. Discord, which was once an active interest, slowly became less engaging compared to the constant need for distraction and escape.

Life at this point stopped feeling like normal “living” and started feeling like survival. Days were no longer structured around school or routines but around whether I was feeling slightly better or slightly worse. Even basic conversations with friends turned into occasional check-ins where they would ask how I was doing, and I would try to respond normally despite everything.

In the middle of this isolation, I started writing small poems and stories without even realizing why. It was not planned creativity — it was more like my mind trying to process fear, boredom, and silence through words. Writing became one of the few things that felt slightly stable during an unstable time.

Looking back now, 2021 feels heavy and unreal. It was not just a year of illness, but a year where fear became personal, silence became physical, and even time itself felt slower than normal. It marked a shift from simply observing the world to experiencing its fragility directly.`,
  hasContent: true,
  private   : false,
},




{
  year      : 2022,
  title     : 'When Normal Life Finally Returned.',
  body      : `2022 began in a strange in-between state, where school was still partially hybrid and everything felt half-real, half-digital. I used to go to school wearing a mask and stayed distant from almost everyone. Even though the world was slowly reopening, I remained cautious and observant, as if I had not fully re-entered normal life yet.

During this phase, my interest in technology grew stronger than ever before. I became more curious about how things worked, how systems functioned, and how digital spaces were built. School itself no longer felt completely normal. Studies were still relatively relaxed, but academically I started struggling more, especially with mathematics. The subject that once felt easy gradually turned into something I began to dislike deeply, mostly because of the increasing complexity and abstract patterns involving letters and numbers. Exams also returned in their traditional format, and writing again became a challenge after the long break from physical schooling.

Old friendships slowly returned, and at the same time, new people entered my life. One of them was Himanish, who did not know Hindi properly at first. I ended up helping him adjust, and over time he became part of my everyday school life. During this period, I also started cycling to school, and that small change unexpectedly became an important part of my routine and friendships.

As things moved into my ninth class, everything started becoming more normal again. Masks were eventually removed, and school life regained its usual structure. Around this time, I was appointed as the school Vice Captain, something I had not expected but quietly valued. I had decided I wanted to overcome my stage fear and finally face it properly. However, even after becoming Vice Captain, I rarely got opportunities to actually go on stage. Whenever I did, I often avoided it due to hesitation, despite being comfortable speaking to people individually.

My interest in drawing and art continued to remain strong throughout this phase. It became one of the few areas where I still felt confident and expressive without pressure.

One of the most significant changes during this time was reconnecting with my crush. We started talking again and even travelled in the same school van before I began cycling. Over time, what was once a simple crush slowly evolved into something deeper. That period marked the beginning of my first real emotional attachment, something I had never experienced in the same way before.

Looking back, 2022 feels like the year where life finally restarted after a long pause. Normalcy returned, but I had already changed internally. I was no longer the same child who entered lockdown — I was slowly becoming someone more aware, more emotional, and more connected to people in a way I had never been before.`,
  hasContent: true,
  private   : false,
},



   { 
       year : 2023, 
       title : 'Boards Began, Childhood Ended Slowly.', 
       body : `2023 marked the point where life stopped feeling like casual school days and started feeling like preparation for something heavier. I was in ninth class and slowly moving into half of tenth, and the most repeated thought around me became simple but powerful: next year is board exams instead of fun. That sentence alone changed the entire atmosphere of life.

Academically, pressure started becoming real. Teachers and parents both expected consistency now, not casual performance. I had to start studying properly instead of just getting by. My Class Teacher, Shantiniketan Ma’am, was extremely strict yet equally caring. She had a strong presence in class and used to discipline us boys very strictly, sometimes even with a bamboo stick. She taught Mathematics, and although that subject remained my weakest point, the discipline around it made me more serious. My Social Science became strong because of Meharan Ma’am, and Hindi improved significantly under Mastan Sir. Slowly, I started scoring above 90 in subjects like SST and Hindi, even while Mathematics continued to remain a struggle.

At this stage, I still had not properly thought about my career. It felt too far away to even imagine seriously. But pressure had definitely started building from both teachers and parents, and I could feel the expectation of “boards” quietly sitting behind every normal school day.

My personality during this time was stable but not extraordinary. I was not awkward in groups anymore, but I was also not the dominant or overly confident version of myself. I had become more socially balanced, sometimes too friendly with everyone, which slowly reduced that earlier “senior-type” presence I once carried. People still respected me, but I no longer maintained that strict image I had built in previous years.

Friendship-wise, Himanish became my closest friend and remained so. That bond became one of the most consistent parts of my school life during this phase.

The love story aspect of my life existed, but it is intentionally kept hidden here, belonging to a more private layer of memory rather than this timeline.

Technology and interests shifted heavily during this time. Instagram became active in my life, while Discord faded away almost completely. Artificial intelligence and online tools started becoming a major curiosity point for me. Gaming reduced drastically and became almost non-existent, except rare console moments.

My music taste remained mostly retro, which somehow matched my internal emotional state more than modern trends.

Creatively, I started writing more poems without fully understanding why. There was no structured intention behind it, but thoughts started forming in a cinematic way inside my mind. I do not even know when or how that shift happened, but suddenly I began seeing life as scenes, moments, and frames rather than just routine days.

My drawing skills also remained strong and expressive during this period, acting as one of the few consistent creative outlets I still fully trusted.

Looking back, 2023 feels like a quiet turning point. Not dramatic on the surface, but deeply structural underneath. It was the year where pressure entered life seriously, creativity became internal, and childhood slowly started transitioning into something more focused, more aware, and more defined.`, 
     hasContent: true,
     private : false,
    },

     
{
  year      : 2024,
  title     : 'Pressure, Performance & First Real Direction.',
  body      : `2024 entered with one clear atmosphere: full board exam pressure. Unlike earlier years where studies felt flexible or semi-relaxed, this time consistency was expected. I was somewhat consistent, but like always, the last-minute cycle still hit differently. Exams felt serious, and even though I knew I would pass, the real goal had shifted to getting good marks rather than just surviving.

My exam center itself felt relatively calm, which helped reduce external stress, but internally I had already started becoming more mature. Not extremely serious, not careless either — just neutral, balanced somewhere in between.

Himanish remained my closest friend through this phase, and that bond stayed stable even when everything else felt pressurized.

To force focus during this period, my tablet was taken away, and distractions were reduced significantly. In a way, it helped structure my attention more towards studies. At the same time, creative outlets like poetry and writing became stronger rather than weaker. I started writing more naturally, without forcing it.

During summer holidays, I worked on small teaching activities at an ISKCON center, helping small children with crafts and paper-based activities. I also managed small video and media work during a temple trip, where I edited footage I had personally shot and helped organize content with kids. This became one of my early experiences with creative management and visual storytelling.

Around this time, I also participated in EBSB (Ek Bharat Shreshtha Bharat) events. I cleared the school cluster level in first position and the regional level in second position. However, only the first position qualified for nationals. My topic was Indigenous Toy Making, where I created Bengal-inspired traditional toys under the guidance of Sylvia Ma’am, who herself was originally from Bengal.

Academically and structurally, this period also became a decision point for my future. After Class 10, I chose Commerce (SSE stream), since my school did not have Class 11 and 12. Instead of switching to a different board like PUC, I decided to continue schooling for two more years in another Kendriya Vidyalaya. This decision marked the beginning of a new academic phase beyond the world I had known until now.

Looking back, 2024 feels like a structured pressure year that slowly shaped direction. It was the year where performance mattered more, creativity became practical, and future decisions stopped being optional and started becoming necessary.`,
  hasContent: true,
  private   : false,
},



    
{
  year      : 2025,
  title     : 'New Command.',
  body      : `2025 began with a complete shift in environment as I joined PM SHRI Kendriya Vidyalaya MEG and Centre. The initial atmosphere felt unfamiliar and almost dark in comparison to my previous school life, as everything was new and unstructured at first. However, within the first few weeks, things changed rapidly. I adapted faster than expected, and within just a short period after joining, I became a candidate for Vice Captain. I saw potential in myself early in this environment, and the surroundings responded to it as well.

After the election process, I won and officially became School Vice Captain. With that position came respect, recognition, responsibility, and a completely different level of interaction with teachers and students. I also briefly became class monitor on the first day, but later had to leave that role due to the responsibilities of being Vice Captain. Despite this, my presence in school grew quickly, and I became known among both students and teachers within a very short time.

Academically, I chose Commerce with IP (Informatics Practices), which introduced me properly to Python, SQL, coding systems, and artificial intelligence concepts. This became one of the most interesting academic shifts in my life. For the first time, subjects like business and AI felt genuinely engaging instead of just theoretical study material. At the same time, I already had known weaknesses in mathematics, and now Accountancy became another challenging subject, making academics more demanding overall.

Friendship dynamics changed again as a new group formed around this phase. I started connecting with people like Suraj, Abhijeet, Dhruv, Aman, and Amay. Socially, I felt more confident and stable compared to previous years. However, emotional attachments still existed in the background, though those details remain part of a more private layer of memory.

Technology became a major part of my identity during this year. Instagram usage increased significantly, AI tools became heavily integrated into my daily routine, GitHub exploration started, and my interest in coding expanded further. Gaming, however, completely faded away. My music taste also evolved again, and my digital behavior became more structured and interest-driven rather than random entertainment.

I also participated again in Kala Utsav during 11th class, where I cleared school and cluster level in first position and regional level as well. This time I was selected for Nationals and travelled to Hyderabad via Garib Rath and returned through Vande Bharat Express. My topic was artifacts of Uttarakhand, and I participated as part of a team. This experience gave me exposure at a national-level platform and strengthened my confidence in creative and cultural expression.

Career thoughts also began to form more seriously during this phase, although clarity was still missing. I knew what kind of job environment I wanted, but not exactly what role I should pursue. The uncertainty remained, but direction had started taking shape.

Overall, 2025 became a defining transition year. In a new school, I quickly rose into leadership, developed stronger academic interests in technology and business, expanded my social circle, and began thinking more seriously about my future while still carrying emotional layers from the past. It was the year where identity, responsibility, and ambition started existing together in the same frame.`,
  hasContent: true,
  private   : false,
},


     
            {
      year      : 2026,
      title     : 'Becoming Real.',
      body      : `2026 marks the completion of my school journey as I finished Class 12th and stepped into a completely new phase of life. I chose BBA with Business Analytics and prepared to join Don Bosco College, entering an environment that felt unfamiliar yet full of possibility. This transition did not feel like a continuation of school anymore — it felt like the beginning of something independent.

Everything around me felt new again. New people, new structure, new expectations. I am still in the process of exploring this phase — building friendships, understanding social dynamics, and slowly shaping my identity in a more professional direction. Unlike earlier years, I am now actively working on myself beyond academics.

A major shift in this year has been the way I approach my future. I have started building my LinkedIn profile, collecting certifications, gaining exposure to tools, and participating in webinars and tech events. These experiences have made me more aware of how the real world functions outside classroom boundaries.

Confidence has also noticeably increased. I feel more comfortable interacting with people, attending professional events, and presenting myself in structured environments. There is a growing sense of direction in how I want to position myself in the future — especially around business, analytics, and technology-driven fields.

At the same time, this year is still ongoing. It is not a completed chapter yet, but a developing one. I am still learning, still adjusting, still observing. Friendships are forming gradually, and my professional identity is slowly taking shape through small consistent steps rather than sudden changes.

Looking at 2026 so far, it feels like the year where I stopped only being a student and started becoming something closer to a professional identity. Not fully defined yet, but clearly in progress — a transition from structured education into real-world exploration.`,
      hasContent: true,
      private   : false,
    },


       {
      year      : 2027,
      title     : 'Execution Phase Begins',
      body      : `2027 is the year where ambition stops being abstract and starts becoming structured execution.

I want to study BBA in Business Analytics while actively building real-world experience through internships. College is not just education anymore — it is a platform for exposure, skill-building, and early professional entry.

My focus is clear: I want strong command over SQL, Python, Tableau, and Excel. These are not optional skills anymore — they are core tools I want to be comfortable using in real scenarios, not just academic settings.

At the same time, I want to build a strong LinkedIn presence. Not for validation, but for visibility, networking, and long-term professional positioning. I want to be known through my work, projects, and consistency.

Corporate exposure is a major goal. I want internships in structured, high-salary-oriented environments where I can understand how real business systems operate. Learning through real work matters more than theory at this stage.

Instagram remains part of my identity, but more as a controlled personal presence rather than distraction. I want my online identity to feel intentional, not random.

My mindset is focused on growth, discipline, and independence. I want to operate in a system where learning, earning, and building happen together — not separately.

2027 is not about dreaming anymore. It is about building, testing, failing, learning, and slowly stepping into a real professional identity.`,
      hasContent: true,
      private   : false,
    },


    {
      year      : 2028,
      title     : '',
      body      : `This is where you are. Replace this with what is happening today.`,
      hasContent: false,
      private   : false,
    },

  ],

};
