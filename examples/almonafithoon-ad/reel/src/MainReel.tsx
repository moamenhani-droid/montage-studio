// Generated first cut (main). Safe to edit here or in Remotion Studio.
import {Audio, Video} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, Track, useCurrentFrame} from 'remotion';
import {StudioBackground} from './components/StudioBackground';
import {KineticCaptions} from './components/KineticCaptions';
import {AllInOne, AudienceSplit, CtaChip, GoalCompare, HookTitle, IdeaToLaunch, LogoReveal, OnePlace, ProcessSteps, Watermark} from './components/Overlays';
import {AiBroll, AppsBroll, AutomationBroll, CustomBroll, GraphicsBackdrop, IdentityBroll, ProblemBroll, StoresBroll, SystemsBroll, WebsitesBroll} from './components/Broll';
import {EndScreen, SloganReveal} from './components/Brand';

export const MainReel: React.FC<{showCaptions: boolean; background: 'studio' | 'original'}> = ({showCaptions, background}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#08131F'}}>
      {background === 'studio' ? (
        <StudioBackground
          name="Studio background"
          durationInFrames={2232}
          base="#0E1F33"
          glow="#2E4A6B"
          lines="rgba(201, 211, 222, 0.22)"
          image="backgrounds/office.png"
          imageBlur={3}
        />
      ) : null}
      <TransitionSeries name="A-roll">
        <TransitionSeries.Sequence
          name="Hook"
          trimBefore={20}
          durationInFrames={153}
        >
          {background === 'original' ? (
            <Video
              name="Hook footage"
              src={staticFile('footage/master_sdr_1440.mp4')}
              muted
              objectFit="cover"
              style={{
                width: '100%',
                height: '100%',
                transformOrigin: '50% 38%',
                scale: interpolate(frame, [58, 153], [1.12, 1.18], {easing: Easing.inOut(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
                filter: 'contrast(1.04) saturate(1.04) brightness(1.01)',
              }}
            />
          ) : (
            <OffthreadVideo
              name="Hook cut-out"
              src={staticFile('footage/person_alpha.webm')}
              transparent
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                translate: '65px 0px',
                transformOrigin: '50% 38%',
                scale: interpolate(frame, [58, 153], [1.12, 1.18], {easing: Easing.inOut(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
                filter: 'brightness(0.93) contrast(1.06) saturate(1.04) sepia(0.07)',
              }}
            />
          )}
        
          <Audio name="Hook voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Problem"
          trimBefore={186}
          durationInFrames={130}
        >
        
          <Audio name="Problem voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Question"
          trimBefore={328}
          durationInFrames={159}
        >
        
          <Audio name="Question voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Solution"
          trimBefore={499}
          durationInFrames={229}
        >
        
          <Audio name="Solution voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Partnership"
          trimBefore={748}
          durationInFrames={165}
        >
        
          <Audio name="Partnership voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Services"
          trimBefore={923}
          durationInFrames={413}
        >
        
          <Audio name="Services voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="All in one place"
          trimBefore={1349}
          durationInFrames={103}
        >
        
          <Audio name="All in one place voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Differentiator"
          trimBefore={1462}
          durationInFrames={39}
        >
        
          <Audio name="Differentiator voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Process"
          trimBefore={1513}
          durationInFrames={240}
        >
        
          <Audio name="Process voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Goal A"
          trimBefore={1766}
          durationInFrames={69}
        >
        
          <Audio name="Goal A voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Goal B"
          trimBefore={1836}
          durationInFrames={126}
        >
        
          <Audio name="Goal B voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Audience"
          trimBefore={1971}
          durationInFrames={133}
        >
        
          <Audio name="Audience voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Slogan"
          trimBefore={2227}
          durationInFrames={79}
        >
        
          <Audio name="Slogan voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="CTA"
          trimBefore={2324}
          durationInFrames={119}
        >
          {background === 'original' ? (
            <Video
              name="CTA footage"
              src={staticFile('footage/master_sdr_1440.mp4')}
              muted
              objectFit="cover"
              style={{
                width: '100%',
                height: '100%',
                transformOrigin: '50% 38%',
                scale: 1.06,
                filter: 'contrast(1.04) saturate(1.04) brightness(1.01)',
              }}
            />
          ) : (
            <OffthreadVideo
              name="CTA cut-out"
              src={staticFile('footage/person_alpha.webm')}
              transparent
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                translate: '65px 0px',
                transformOrigin: '50% 38%',
                scale: 1.06,
                filter: 'brightness(0.93) contrast(1.06) saturate(1.04) sepia(0.07)',
              }}
            />
          )}
        
          <Audio name="CTA voice" src={staticFile('footage/voice_clean.wav')} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 75% at 50% 42%, transparent 55%, rgba(4, 12, 22, 0.42) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Track name="Backdrop">
        <GraphicsBackdrop name="Graphics backdrop" from={153} durationInFrames={1885} fadeIn={true} fadeOut={true} />
      </Track>
      <Track name="Voice tail">
        <Audio name="Last word tail" src={staticFile('footage/voice_clean.wav')} from={2157} trimBefore={2443} durationInFrames={4} />
      </Track>
      <Track name="B-roll">
        <ProblemBroll
          name="Problem B-roll"
          from={153}
          durationInFrames={129}
          a="مبرمج"
          b="مصمّم"
          c="شركات متفرقة"
          cost="كوست أضعاف الطبيعي"
          atA={0}
          atB={7}
          atC={26}
          atCost={69}
        />
        <WebsitesBroll
          name="Websites"
          from={836}
          durationInFrames={38}
          title="مواقع إلكترونية"
          front="projects/venda-desktop.webp"
          back="projects/mandi-menu-desktop.webp"
          fadeIn={true}
          fadeOut={false}
        />
        <AppsBroll
          name="Mobile apps"
          from={874}
          durationInFrames={38}
          title="تطبيقات موبايل"
          left="projects/venda-mobile.webp"
          center="projects/mandi-menu-mobile.webp"
          right="projects/alsaad-mobile.webp"
          fadeIn={false}
          fadeOut={false}
        />
        <StoresBroll
          name="E-commerce"
          from={912}
          durationInFrames={46}
          title="متاجر إلكترونية"
          desktop="projects/alsaad-desktop.webp"
          mobile="projects/mrayco-mobile.webp"
          fadeIn={false}
          fadeOut={false}
        />
        <SystemsBroll
          name="Management systems"
          from={958}
          durationInFrames={39}
          title="أنظمة متكاملة"
          a="projects/inventory.svg"
          b="projects/pos.svg"
          c="projects/hr-payroll-light.svg"
          fadeIn={false}
          fadeOut={false}
        />
        <AiBroll
          name="AI"
          from={997}
          durationInFrames={37}
          title="ذكاء اصطناعي"
          screen="projects/hr-ai.svg"
          fadeIn={false}
          fadeOut={false}
        />
        <AutomationBroll
          name="Automation"
          from={1034}
          durationInFrames={36}
          title="أتمتة"
          screen="projects/whatsapp-bot.svg"
          n1="رسالة"
          n2="رد آلي"
          n3="تم"
          fadeIn={false}
          fadeOut={false}
        />
        <CustomBroll
          name="Custom software"
          from={1070}
          durationInFrames={69}
          title="حلول برمجية خاصة"
          a="projects/clinic.svg"
          b="projects/schools.svg"
          c="projects/menu.svg"
          d="projects/clinic-booking-light.svg"
          fadeIn={false}
          fadeOut={false}
        />
        <IdentityBroll
          name="Brand identity"
          from={1139}
          durationInFrames={110}
          title="تصاميم وهويات بصرية"
          logo="brand/lockup.png"
          fadeIn={false}
          fadeOut={true}
        />
        <SloganReveal
          name="Slogan reveal"
          from={1959}
          durationInFrames={79}
          first="فكرتك،"
          second="تنفيذنا"
          sloganAt={25}
        />
        <EndScreen
          name="End screen"
          from={2157}
          durationInFrames={75}
          slogan="فكرتك، تنفيذنا"
          cta="راسلنا بكلمة «فكرة»"
          website="tech.monafithoon.com"
        />
      </Track>
      <Track name="Graphics">
        <HookTitle
          name="Hook title"
          from={0}
          durationInFrames={73}
          line="عندك فكرة مشروع؟"
          accent="فكرة مشروع؟"
        />
        <OnePlace
          name="One place"
          from={283}
          durationInFrames={155}
          a="مبرمج"
          b="مصمّم"
          c="شركات"
          result="الحل بمكان واحد"
          mergeAt={113}
          style={{translate: '0px 406px', scale: 1.15}}
        />
        <HookTitle
          name="Any idea"
          from={439}
          durationInFrames={96}
          line="مهما كانت فكرتك"
          accent="فكرتك"
          style={{translate: '0px 681px', scale: 1.4}}
        />
        <LogoReveal
          name="First logo reveal"
          from={537}
          durationInFrames={74}
          logo="brand/horizontal.png"
          logoWidth={680}
          style={{translate: '0px 520px', scale: 1.25}}
        />
        <IdeaToLaunch
          name="Idea to launch"
          from={612}
          durationInFrames={59}
          s1="فكرة"
          s2="تصميم"
          s3="تطوير"
          s4="إطلاق"
          activateAt={[7, 16, 25, 36]}
          style={{translate: '0px 365px', scale: 1.0}}
        />
        <GoalCompare
          name="We work with you"
          from={671}
          durationInFrames={165}
          before="مو بس ننفّذ طلبك"
          after="نشتغل وياك للحل الأنسب"
          afterAt={34}
          style={{translate: '0px 475px', scale: 1.12}}
        />
        <AllInOne
          name="All in one place"
          from={1249}
          durationInFrames={102}
          label=""
          mergeAt={28}
          style={{translate: '0px 432px', scale: 1.2}}
        />
        <HookTitle
          name="What sets us apart"
          from={1352}
          durationInFrames={39}
          line="شنو اللي يميّزنا؟"
          accent="يميّزنا؟"
          style={{translate: '0px 681px', scale: 1.4}}
        />
        <ProcessSteps
          name="Our process"
          from={1391}
          durationInFrames={238}
          s1="نفهم"
          s2="نخطّط"
          s3="نصمّم"
          s4="نبرمج"
          s5="نطلق"
          s6="نطوّر"
          activateAt={[46, 94, 110, 127, 196, 215]}
          style={{translate: '0px 390px', scale: 1.0}}
        />
        <GoalCompare
          name="Our goal"
          from={1630}
          durationInFrames={192}
          before="مو بس نسلّمك مشروع"
          after="حل يخدم شغلك ويتطوّر"
          afterAt={73}
          style={{translate: '0px 475px', scale: 1.12}}
        />
        <AudienceSplit
          name="Who it is for"
          from={1824}
          durationInFrames={134}
          a="شركة تريد تطوّرها"
          b="فكرة ببدايتها"
          atA={15}
          atB={64}
          style={{translate: '0px 463px', scale: 1.08}}
        />
        <CtaChip
          name="CTA message"
          from={2038}
          durationInFrames={118}
          lead="راسلنا بكلمة"
          keyword="«فكرة»"
          sendAt={29}
        />
      </Track>
      <Track name="Brand">
        <Watermark
          name="Logo watermark"
          from={836}
          durationInFrames={516}
        />
      </Track>
      {showCaptions ? (
        <Track name="Captions">
        <KineticCaptions
          name="Hook captions"
          from={0}
          durationInFrames={153}
          trimBefore={20}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "مشروع…", startMs: 830, endMs: 1450, timestampMs: 1140, confidence: null},
            {text: "بس", startMs: 1450, endMs: 1660, timestampMs: 1555, confidence: null},
            {text: "كل", startMs: 1660, endMs: 1860, timestampMs: 1760, confidence: null},
            {text: "ما", startMs: 1860, endMs: 2070, timestampMs: 1965, confidence: null},
            {text: "تريد", startMs: 2070, endMs: 2480, timestampMs: 2275, confidence: null},
            {text: "تنفذها،", startMs: 2480, endMs: 3090, timestampMs: 2785, confidence: null},
            {text: "تحتار", startMs: 3090, endMs: 3600, timestampMs: 3345, confidence: null},
            {text: "منين", startMs: 3600, endMs: 4020, timestampMs: 3810, confidence: null},
            {text: "تبدأ", startMs: 4020, endMs: 4430, timestampMs: 4225, confidence: null},
            {text: "وويا", startMs: 4430, endMs: 4740, timestampMs: 4585, confidence: null},
            {text: "منو", startMs: 4740, endMs: 4950, timestampMs: 4845, confidence: null},
            {text: "تشتغل؟", startMs: 4950, endMs: 5810, timestampMs: 5380, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Problem captions"
          from={153}
          durationInFrames={130}
          trimBefore={186}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "مصمّم،", startMs: 6440, endMs: 7050, timestampMs: 6745, confidence: null},
            {text: "شركات", startMs: 7050, endMs: 7790, timestampMs: 7420, confidence: null},
            {text: "متفرقة،", startMs: 7790, endMs: 8500, timestampMs: 8145, confidence: null},
            {text: "وكوست", startMs: 8500, endMs: 9020, timestampMs: 8760, confidence: null},
            {text: "أضعاف", startMs: 9020, endMs: 9540, timestampMs: 9280, confidence: null},
            {text: "الطبيعي.", startMs: 9540, endMs: 10520, timestampMs: 10030, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Question captions"
          from={283}
          durationInFrames={159}
          trimBefore={328}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "وقتك", startMs: 11330, endMs: 11780, timestampMs: 11555, confidence: null},
            {text: "بين", startMs: 11780, endMs: 12130, timestampMs: 11955, confidence: null},
            {text: "أكثر", startMs: 12130, endMs: 12590, timestampMs: 12360, confidence: null},
            {text: "من", startMs: 12590, endMs: 12830, timestampMs: 12710, confidence: null},
            {text: "جهة،", startMs: 12830, endMs: 13170, timestampMs: 13000, confidence: null},
            {text: "إذا", startMs: 13170, endMs: 13510, timestampMs: 13340, confidence: null},
            {text: "تگدر", startMs: 13510, endMs: 13970, timestampMs: 13740, confidence: null},
            {text: "تحصل", startMs: 13970, endMs: 14430, timestampMs: 14200, confidence: null},
            {text: "الحل", startMs: 14430, endMs: 14890, timestampMs: 14660, confidence: null},
            {text: "بمكان", startMs: 14890, endMs: 15470, timestampMs: 15180, confidence: null},
            {text: "واحد؟", startMs: 15470, endMs: 16140, timestampMs: 15805, confidence: null},
            {text: "مهما", startMs: 16140, endMs: 16540, timestampMs: 16340, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Solution captions"
          from={442}
          durationInFrames={229}
          trimBefore={499}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "فكرتك", startMs: 16950, endMs: 17440, timestampMs: 17195, confidence: null},
            {text: "أو", startMs: 17440, endMs: 17650, timestampMs: 17545, confidence: null},
            {text: "احتياجات", startMs: 17650, endMs: 18450, timestampMs: 18050, confidence: null},
            {text: "مشروعك", startMs: 18450, endMs: 19040, timestampMs: 18745, confidence: null},
            {text: "التقنية،", startMs: 19040, endMs: 19880, timestampMs: 19460, confidence: null},
            {text: "المنفذون", startMs: 19880, endMs: 20640, timestampMs: 20260, confidence: null},
            {text: "تيك", startMs: 20640, endMs: 20940, timestampMs: 20790, confidence: null},
            {text: "تقدر", startMs: 20940, endMs: 21360, timestampMs: 21150, confidence: null},
            {text: "توفرلك", startMs: 21360, endMs: 21940, timestampMs: 21650, confidence: null},
            {text: "الحل…", startMs: 21940, endMs: 22410, timestampMs: 22175, confidence: null},
            {text: "من", startMs: 22410, endMs: 22540, timestampMs: 22475, confidence: null},
            {text: "الفكرة", startMs: 22540, endMs: 23140, timestampMs: 22840, confidence: null},
            {text: "إلى", startMs: 23140, endMs: 23440, timestampMs: 23290, confidence: null},
            {text: "التنفيذ.", startMs: 23440, endMs: 24280, timestampMs: 23860, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Partnership captions"
          from={671}
          durationInFrames={165}
          trimBefore={748}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "بس", startMs: 24880, endMs: 25120, timestampMs: 25000, confidence: null},
            {text: "ننفّذ", startMs: 25120, endMs: 25480, timestampMs: 25300, confidence: null},
            {text: "طلبك…", startMs: 25480, endMs: 26080, timestampMs: 25780, confidence: null},
            {text: "إحنا", startMs: 26080, endMs: 26440, timestampMs: 26260, confidence: null},
            {text: "نشتغل", startMs: 26440, endMs: 27040, timestampMs: 26740, confidence: null},
            {text: "وياك", startMs: 27040, endMs: 27520, timestampMs: 27280, confidence: null},
            {text: "حتى", startMs: 27520, endMs: 27880, timestampMs: 27700, confidence: null},
            {text: "نوصل", startMs: 27880, endMs: 28360, timestampMs: 28120, confidence: null},
            {text: "للحل", startMs: 28360, endMs: 28840, timestampMs: 28600, confidence: null},
            {text: "الأنسب", startMs: 28840, endMs: 29560, timestampMs: 29200, confidence: null},
            {text: "لمشروعك.", startMs: 29560, endMs: 30500, timestampMs: 30030, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Services captions"
          from={836}
          durationInFrames={413}
          trimBefore={923}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "إلكترونية،", startMs: 30950, endMs: 32030, timestampMs: 31490, confidence: null},
            {text: "تطبيقات", startMs: 32030, endMs: 32660, timestampMs: 32345, confidence: null},
            {text: "موبايل،", startMs: 32660, endMs: 33290, timestampMs: 32975, confidence: null},
            {text: "متاجر", startMs: 33290, endMs: 33740, timestampMs: 33515, confidence: null},
            {text: "إلكترونية،", startMs: 33740, endMs: 34820, timestampMs: 34280, confidence: null},
            {text: "أنظمة", startMs: 34820, endMs: 35270, timestampMs: 35045, confidence: null},
            {text: "متكاملة…", startMs: 35270, endMs: 36140, timestampMs: 35705, confidence: null},
            {text: "ذكاء", startMs: 36140, endMs: 36750, timestampMs: 36445, confidence: null},
            {text: "اصطناعي", startMs: 36750, endMs: 37380, timestampMs: 37065, confidence: null},
            {text: "وأتمتة،", startMs: 37380, endMs: 38040, timestampMs: 37710, confidence: null},
            {text: "وحلول", startMs: 38040, endMs: 38560, timestampMs: 38300, confidence: null},
            {text: "برمجية", startMs: 38560, endMs: 39220, timestampMs: 38890, confidence: null},
            {text: "خاصة", startMs: 39220, endMs: 39620, timestampMs: 39420, confidence: null},
            {text: "حسب", startMs: 39620, endMs: 40150, timestampMs: 39885, confidence: null},
            {text: "شغلك.", startMs: 40150, endMs: 40880, timestampMs: 40515, confidence: null},
            {text: "وحتى", startMs: 40880, endMs: 41250, timestampMs: 41065, confidence: null},
            {text: "التصاميم", startMs: 41250, endMs: 42040, timestampMs: 41645, confidence: null},
            {text: "الاحترافية", startMs: 42040, endMs: 42960, timestampMs: 42500, confidence: null},
            {text: "والهويات", startMs: 42960, endMs: 43720, timestampMs: 43340, confidence: null},
            {text: "البصرية…", startMs: 43720, endMs: 44620, timestampMs: 44170, confidence: null},
          ]}
        />
        <KineticCaptions
          name="All in one place captions"
          from={1249}
          durationInFrames={103}
          trimBefore={1349}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "مشروعك", startMs: 45930, endMs: 46570, timestampMs: 46250, confidence: null},
            {text: "التقنية", startMs: 46570, endMs: 47360, timestampMs: 46965, confidence: null},
            {text: "بمكان", startMs: 47360, endMs: 47910, timestampMs: 47635, confidence: null},
            {text: "واحد.", startMs: 47910, endMs: 48400, timestampMs: 48155, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Differentiator captions"
          from={1352}
          durationInFrames={39}
          trimBefore={1462}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "اللي", startMs: 49210, endMs: 49560, timestampMs: 49385, confidence: null},
            {text: "يميّزنا؟", startMs: 49560, endMs: 50430, timestampMs: 49995, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Process captions"
          from={1391}
          durationInFrames={240}
          trimBefore={1513}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "إحنا", startMs: 50430, endMs: 50850, timestampMs: 50640, confidence: null},
            {text: "نسمع", startMs: 50850, endMs: 51300, timestampMs: 51075, confidence: null},
            {text: "فكرتك،", startMs: 51300, endMs: 51970, timestampMs: 51635, confidence: null},
            {text: "نفهم", startMs: 51970, endMs: 52420, timestampMs: 52195, confidence: null},
            {text: "احتياجاتك،", startMs: 52420, endMs: 53560, timestampMs: 52990, confidence: null},
            {text: "نخطّط،", startMs: 53560, endMs: 54090, timestampMs: 53825, confidence: null},
            {text: "نصمّم،", startMs: 54090, endMs: 54680, timestampMs: 54385, confidence: null},
            {text: "نبرمج،", startMs: 54680, endMs: 55460, timestampMs: 55070, confidence: null},
            {text: "ونوصل", startMs: 55460, endMs: 55970, timestampMs: 55715, confidence: null},
            {text: "وياك", startMs: 55970, endMs: 56460, timestampMs: 56215, confidence: null},
            {text: "لمرحلة", startMs: 56460, endMs: 56960, timestampMs: 56710, confidence: null},
            {text: "الإطلاق", startMs: 56960, endMs: 57600, timestampMs: 57280, confidence: null},
            {text: "والتطوير.", startMs: 57600, endMs: 58400, timestampMs: 58000, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Goal A captions"
          from={1631}
          durationInFrames={69}
          trimBefore={1766}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "مو", startMs: 59360, endMs: 59600, timestampMs: 59480, confidence: null},
            {text: "بس", startMs: 59600, endMs: 59840, timestampMs: 59720, confidence: null},
            {text: "نسلّمك", startMs: 59840, endMs: 60430, timestampMs: 60135, confidence: null},
            {text: "مشروع…", startMs: 60430, endMs: 61160, timestampMs: 60795, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Goal B captions"
          from={1700}
          durationInFrames={126}
          trimBefore={1836}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "نقدّملك", startMs: 61760, endMs: 62480, timestampMs: 62120, confidence: null},
            {text: "حل", startMs: 62480, endMs: 62720, timestampMs: 62600, confidence: null},
            {text: "يخدم", startMs: 62720, endMs: 63200, timestampMs: 62960, confidence: null},
            {text: "شغلك", startMs: 63200, endMs: 63680, timestampMs: 63440, confidence: null},
            {text: "ويساعده", startMs: 63680, endMs: 64640, timestampMs: 64160, confidence: null},
            {text: "يتطوّر.", startMs: 64640, endMs: 65300, timestampMs: 64970, confidence: null},
            {text: "سواء", startMs: 65320, endMs: 65710, timestampMs: 65515, confidence: null},
          ]}
        />
        <KineticCaptions
          name="Audience captions"
          from={1826}
          durationInFrames={133}
          trimBefore={1971}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "عندك", startMs: 65710, endMs: 66120, timestampMs: 65915, confidence: null},
            {text: "شركة", startMs: 66120, endMs: 66540, timestampMs: 66330, confidence: null},
            {text: "تريد", startMs: 66540, endMs: 66960, timestampMs: 66750, confidence: null},
            {text: "تطوّرها،", startMs: 66960, endMs: 67570, timestampMs: 67265, confidence: null},
            {text: "أو", startMs: 67570, endMs: 67770, timestampMs: 67670, confidence: null},
            {text: "فكرة", startMs: 67770, endMs: 68180, timestampMs: 67975, confidence: null},
            {text: "مشروع", startMs: 68180, endMs: 68700, timestampMs: 68440, confidence: null},
            {text: "بعدها", startMs: 68700, endMs: 69220, timestampMs: 68960, confidence: null},
            {text: "ببدايتها…", startMs: 69220, endMs: 70160, timestampMs: 69690, confidence: null},
          ]}
        />
        <KineticCaptions
          name="CTA captions"
          from={2038}
          durationInFrames={119}
          trimBefore={2324}
          width={860}
          maxWords={4}
          highlights={["عندك فكرة مشروع", "الحل بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي", "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "راسلنا هسه بكلمة «فكرة»"]}
          style={{position: 'absolute', top: 1320, translate: '110px 0px'}}
          captions={[
            {text: "هسه", startMs: 77670, endMs: 77890, timestampMs: 77780, confidence: null},
            {text: "بكلمة", startMs: 77890, endMs: 78440, timestampMs: 78165, confidence: null},
            {text: "«فكرة»،", startMs: 78440, endMs: 78930, timestampMs: 78685, confidence: null},
            {text: "وخلّينا", startMs: 78930, endMs: 79550, timestampMs: 79240, confidence: null},
            {text: "نبدأ", startMs: 79550, endMs: 79980, timestampMs: 79765, confidence: null},
            {text: "أول", startMs: 79980, endMs: 80310, timestampMs: 80145, confidence: null},
            {text: "خطوة", startMs: 80310, endMs: 80750, timestampMs: 80530, confidence: null},
            {text: "بمشروعك.", startMs: 80750, endMs: 81680, timestampMs: 81215, confidence: null},
          ]}
        />
        </Track>
      ) : null}
      <Track name="SFX accents">
        <Audio name="Hook accent" src={staticFile('sfx/hook.wav')} from={0} volume={0.55} />
        <Audio name="Merge tick" src={staticFile('sfx/tick.wav')} from={408} volume={0.4} />
        <Audio name="Logo shimmer" src={staticFile('sfx/shimmer.wav')} from={537} volume={0.5} />
        <Audio name="All-in-one tick" src={staticFile('sfx/tick.wav')} from={1283} volume={0.4} />
        <Audio name="Slogan riser" src={staticFile('sfx/impact.wav')} from={1959} volume={0.55} />
        <Audio name="CTA send" src={staticFile('sfx/pop.wav')} from={2067} volume={0.45} />
      </Track>
      <Track name="SFX transitions">
        <Audio name="Whoosh problem" src={staticFile('sfx/whoosh.wav')} from={151} volume={0.35} />
        <Audio name="Whoosh websites" src={staticFile('sfx/whoosh.wav')} from={835} volume={0.32} />
        <Audio name="Whoosh apps" src={staticFile('sfx/swish.wav')} from={871} volume={0.28} />
        <Audio name="Whoosh stores" src={staticFile('sfx/whoosh.wav')} from={909} volume={0.28} />
        <Audio name="Whoosh systems" src={staticFile('sfx/swish.wav')} from={955} volume={0.28} />
        <Audio name="Whoosh AI" src={staticFile('sfx/whoosh.wav')} from={995} volume={0.28} />
        <Audio name="Whoosh automation" src={staticFile('sfx/swish.wav')} from={1032} volume={0.26} />
        <Audio name="Swish custom" src={staticFile('sfx/swish.wav')} from={1067} volume={0.24} />
        <Audio name="Swish identity" src={staticFile('sfx/swish.wav')} from={1137} volume={0.26} />
        <Audio name="End chime" src={staticFile('sfx/shimmer.wav')} from={2157} volume={0.45} />
      </Track>
      <Track name="Music">
        <Audio name="Music bed" src={staticFile('music/main_music.wav')} volume={0.45} />
      </Track>
    </AbsoluteFill>
  );
};
