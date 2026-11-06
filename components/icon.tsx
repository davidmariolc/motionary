import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowCounterClockwise";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { CopyIcon } from "@phosphor-icons/react/dist/ssr/Copy";
import { GridFourIcon } from "@phosphor-icons/react/dist/ssr/GridFour";
import { InfoIcon } from "@phosphor-icons/react/dist/ssr/Info";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { PauseIcon } from "@phosphor-icons/react/dist/ssr/Pause";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr/Play";
import { ShapesIcon } from "@phosphor-icons/react/dist/ssr/Shapes";
import { SignInIcon } from "@phosphor-icons/react/dist/ssr/SignIn";
import { TextTIcon } from "@phosphor-icons/react/dist/ssr/TextT";
import { TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";
import { WaveformIcon } from "@phosphor-icons/react/dist/ssr/Waveform";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";

const icons = {
  arrow: ArrowRightIcon,
  back: ArrowLeftIcon,
  check: CheckIcon,
  close: XIcon,
  copy: CopyIcon,
  diagonal: ArrowUpRightIcon,
  enter: SignInIcon,
  grid: GridFourIcon,
  info: InfoIcon,
  pause: PauseIcon,
  play: PlayIcon,
  replay: ArrowCounterClockwiseIcon,
  search: MagnifyingGlassIcon,
  shapes: ShapesIcon,
  text: TextTIcon,
  translate: TranslateIcon,
  wave: WaveformIcon,
} as const;
export type IconName = keyof typeof icons;
export const Icon = ({
  name,
  size = 18,
}: {
  readonly name: IconName;
  readonly size?: number;
}) => {
  const PhosphorIcon = icons[name];

  return (
    <PhosphorIcon
      size={size}
      weight="regular"
      aria-hidden="true"
      focusable="false"
    />
  );
};
