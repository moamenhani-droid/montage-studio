// Generated first cut (short). Safe to edit here or in Remotion Studio.
import {Audio, Video} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, Track, useCurrentFrame} from 'remotion';
import {StudioBackground} from './components/StudioBackground';
import {KineticCaptions} from './components/KineticCaptions';
import {CtaChip, HookTitle, IdeaToLaunch, LogoReveal, OnePlace, Watermark} from './components/Overlays';
import {AiBroll, AppsBroll, AutomationBroll, GraphicsBackdrop, StoresBroll, SystemsBroll, WebsitesBroll} from './components/Broll';
import {EndScreen, SloganReveal} from './components/Brand';

export const ShortReel: React.FC<{showCaptions: boolean; background: 'studio' | 'original'}> = ({showCaptions, background}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#08131F'}}>
      {background === 'studio' ? (
        <StudioBackground
          name="Studio background"
          durationInFrames={1032}
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
          name="Services"
          trimBefore={923}
          durationInFrames={218}
        >
        
          <Audio name="Services voice" src={staticFile('footage/voice_clean.wav')} />
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
        <GraphicsBackdrop name="Graphics backdrop" from={153} durationInFrames={685} fadeIn={true} fadeOut={true} />
      </Track>
      <Track name="Voice tail">
        <Audio name="Last word tail" src={staticFile('footage/voice_clean.wav')} from={957} trimBefore={2443} durationInFrames={4} />
      </Track>
      <Track name="B-roll">
        <WebsitesBroll
          name="Websites"
          from={541}
          durationInFrames={38}
          title="مواقع إلكترونية"
          front="projects/venda-desktop.webp"
          back="projects/mandi-menu-desktop.webp"
          fadeIn={true}
          fadeOut={false}
        />
        <AppsBroll
          name="Mobile apps"
          from={579}
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
          from={617}
          durationInFrames={46}
          title="متاجر إلكترونية"
          desktop="projects/alsaad-desktop.webp"
          mobile="projects/mrayco-mobile.webp"
          fadeIn={false}
          fadeOut={false}
        />
        <SystemsBroll
          name="Management systems"
          from={663}
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
          from={702}
          durationInFrames={37}
          title="ذكاء اصطناعي"
          screen="projects/hr-ai.svg"
          fadeIn={false}
          fadeOut={false}
        />
        <AutomationBroll
          name="Automation"
          from={739}
          durationInFrames={20}
          title="أتمتة"
          screen="projects/whatsapp-bot.svg"
          n1="رسالة"
          n2="رد آلي"
          n3="تم"
          fadeIn={false}
          fadeOut={true}
        />
        <SloganReveal
          name="Slogan reveal"
          from={759}
          durationInFrames={79}
          first="فكرتك،"
          second="تنفيذنا"
          sloganAt={25}
        />
        <EndScreen
          name="End screen"
          from={957}
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
          from={153}
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
          from={309}
          durationInFrames={96}
          line="مهما كانت فكرتك"
          accent="فكرتك"
          style={{translate: '0px 681px', scale: 1.4}}
        />
        <LogoReveal
          name="First logo reveal"
          from={407}
          durationInFrames={74}
          logo="brand/horizontal.png"
          logoWidth={680}
          style={{translate: '0px 520px', scale: 1.25}}
        />
        <IdeaToLaunch
          name="Idea to launch"
          from={482}
          durationInFrames={59}
          s1="فكرة"
          s2="تصميم"
          s3="تطوير"
          s4="إطلاق"
          activateAt={[7, 16, 25, 36]}
          style={{translate: '0px 365px', scale: 1.0}}
        />
        <CtaChip
          name="CTA message"
          from={838}
          durationInFrames={118}
          lead="راسلنا بكلمة"
          keyword="«فكرة»"
          sendAt={29}
        />
      </Track>
      <Track name="Brand">
        <Watermark
          name="Logo watermark"
          from={541}
          durationInFrames={218}
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
          name="Question captions"
          from={153}
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
          from={312}
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
          name="Services captions"
          from={541}
          durationInFrames={218}
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
          ]}
        />
        <KineticCaptions
          name="CTA captions"
          from={838}
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
        <Audio name="Merge tick" src={staticFile('sfx/tick.wav')} from={278} volume={0.4} />
        <Audio name="Logo shimmer" src={staticFile('sfx/shimmer.wav')} from={407} volume={0.5} />
        <Audio name="Slogan riser" src={staticFile('sfx/impact.wav')} from={759} volume={0.55} />
        <Audio name="CTA send" src={staticFile('sfx/pop.wav')} from={867} volume={0.45} />
      </Track>
      <Track name="SFX transitions">
        <Audio name="Whoosh websites" src={staticFile('sfx/whoosh.wav')} from={541} volume={0.32} />
        <Audio name="Whoosh apps" src={staticFile('sfx/swish.wav')} from={576} volume={0.28} />
        <Audio name="Whoosh stores" src={staticFile('sfx/whoosh.wav')} from={614} volume={0.28} />
        <Audio name="Whoosh systems" src={staticFile('sfx/swish.wav')} from={660} volume={0.28} />
        <Audio name="Whoosh AI" src={staticFile('sfx/whoosh.wav')} from={700} volume={0.28} />
        <Audio name="Whoosh automation" src={staticFile('sfx/swish.wav')} from={737} volume={0.26} />
        <Audio name="End chime" src={staticFile('sfx/shimmer.wav')} from={957} volume={0.45} />
      </Track>
      <Track name="Music">
        <Audio name="Music bed" src={staticFile('music/short_music.wav')} volume={0.45} />
      </Track>
    </AbsoluteFill>
  );
};
