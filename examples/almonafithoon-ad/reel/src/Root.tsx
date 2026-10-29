import {Composition, Folder, Still} from 'remotion';
import {MainReel} from './MainReel';
import {ShortReel} from './ShortReel';
import {LogoSting} from './components/Brand';
import {Cover} from './Cover';
import './theme';
import {Animatic} from './v2/Animatic';
import {V2Short} from './v2/Short';
import {CatalogSheet} from './catalog/Catalog';
import {DesignSystem, Frame1MatchCut, Frame2Problem, Frame3LogoBuild, Frame4Services, Frame5Process, Frame6Slogan} from './v2/Styleframes';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainReel"
        component={MainReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={2232}
        defaultProps={{showCaptions: true, background: 'studio'}}
      />
      <Composition
        id="ShortReel"
        component={ShortReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1032}
        defaultProps={{showCaptions: true, background: 'studio'}}
      />
      <Folder name="Deliverables">
        <Composition
          id="CleanReel"
          component={MainReel}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={2232}
          defaultProps={{showCaptions: false, background: 'studio'}}
        />
        <Composition id="LogoAnimation" component={LogoSting} width={1080} height={1920} fps={30} durationInFrames={75} />
        <Still id="Cover" component={Cover} width={1080} height={1920} />
      </Folder>
      <Folder name="Phase4-Sketch">
        <Composition id="V3-Sketch" component={Animatic} width={1080} height={1920} fps={30} durationInFrames={2232} defaultProps={{final: true, sketch: true}} />
      </Folder>
      <Folder name="Catalog">
        <Still id="Catalog-1" component={CatalogSheet} width={1330} height={1460} defaultProps={{page: 0}} />
        <Still id="Catalog-2" component={CatalogSheet} width={1330} height={1460} defaultProps={{page: 1}} />
        <Still id="Catalog-3" component={CatalogSheet} width={1330} height={1460} defaultProps={{page: 2}} />
      </Folder>
      <Folder name="Phase3-Final">
        <Composition id="V2-Main" component={Animatic} width={1080} height={1920} fps={30} durationInFrames={2232} defaultProps={{final: true}} />
        <Composition id="V2-Short" component={V2Short} width={1080} height={1920} fps={30} durationInFrames={1080} />
        <Composition id="V2-Clean" component={Animatic} width={1080} height={1920} fps={30} durationInFrames={2232} defaultProps={{final: true, faceCaptions: false}} />
      </Folder>
      <Folder name="Phase2-Animatic">
        <Composition id="V2-Animatic" component={Animatic} width={1080} height={1920} fps={30} durationInFrames={2232} />
      </Folder>
      <Folder name="Phase1-Styleframes">
        <Still id="SF0-DesignSystem" component={DesignSystem} width={1080} height={1920} />
        <Still id="SF1-MatchCut" component={Frame1MatchCut} width={1080} height={1920} />
        <Still id="SF2-Problem" component={Frame2Problem} width={1080} height={1920} />
        <Still id="SF3-LogoBuild" component={Frame3LogoBuild} width={1080} height={1920} />
        <Still id="SF4-Services" component={Frame4Services} width={1080} height={1920} />
        <Still id="SF5-Process" component={Frame5Process} width={1080} height={1920} />
        <Still id="SF6-Slogan" component={Frame6Slogan} width={1080} height={1920} />
      </Folder>
    </>
  );
};
