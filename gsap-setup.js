import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";
import { CustomEase } from "gsap/CustomEase";
import { EasePack } from "gsap/EasePack";
import { CustomWiggle } from "gsap/CustomWiggle";
import { CustomBounce } from "gsap/CustomBounce";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GSDevTools } from "gsap/GSDevTools";

gsap.registerPlugin(
  ScrollToPlugin,
  ScrollTrigger,
  ScrollSmoother,
  CSSRulePlugin,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  SplitText,
  TextPlugin,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  MotionPathHelper,
  CustomEase,
  EasePack,
  CustomWiggle,
  CustomBounce,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  EaselPlugin,
  PixiPlugin,
  GSDevTools,
);

gsap.defaults({
  duration: 0.6,
  ease: "power2.out",
});

export default gsap;
