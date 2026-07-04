// Adapted from ReactBits Folder by David Haz, MIT License.
import Image from "next/image";
import { TransitionLink } from "@/components/site/TransitionLink";
import type { PhotoEntry } from "@/lib/content/photos";

type FolderProps = {
  photos: PhotoEntry[];
  className?: string;
  labelClassName?: string;
  onNavigate?: () => void;
};

export function Folder({ photos, className = "", labelClassName = "text-soot", onNavigate }: FolderProps) {
  const papers = photos.slice(0, 3);
  const paperClasses = [
    "-translate-x-1/2 translate-y-2 rotate-[-7deg] group-hover:-translate-x-[120%] group-hover:-translate-y-20 group-hover:rotate-[-15deg]",
    "-translate-x-1/2 translate-y-3 rotate-[7deg] group-hover:translate-x-[10%] group-hover:-translate-y-20 group-hover:rotate-[15deg]",
    "-translate-x-1/2 translate-y-4 rotate-[2deg] group-hover:-translate-x-1/2 group-hover:-translate-y-28 group-hover:rotate-[5deg]",
  ];

  return (
    <TransitionLink
      href="/photos"
      aria-label="Open photo gallery"
      onClick={onNavigate}
      className={`group inline-flex flex-col items-start gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone ${className}`}
    >
      <span className="relative block h-40 w-52 transition-transform duration-300 group-hover:-translate-y-2">
        <span className="absolute bottom-0 left-0 h-32 w-52 rounded-[0.35rem] rounded-tl-none border border-faint bg-faint">
          <span className="absolute bottom-full left-0 h-5 w-20 rounded-t-[0.35rem] border border-b-0 border-faint bg-faint" />
          {papers.map((photo, index) => (
            <span
              key={photo.src}
              className={`absolute bottom-7 left-1/2 z-10 block h-28 w-28 overflow-hidden border border-soot/20 bg-paper shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-transform duration-300 ${paperClasses[index]}`}
            >
              <Image src={photo.src} alt="" aria-hidden="true" width={photo.width} height={photo.height} className="h-full w-full object-cover" />
            </span>
          ))}
          <span className="absolute bottom-0 left-0 z-20 h-24 w-full origin-bottom rounded-[0.35rem] border border-bone/60 bg-bone transition-transform duration-300 group-hover:skew-x-[12deg] group-hover:scale-y-75" />
          <span className="absolute bottom-0 right-0 z-20 h-24 w-1/2 origin-bottom rounded-r-[0.35rem] bg-bone transition-transform duration-300 group-hover:-skew-x-[12deg] group-hover:scale-y-75" />
        </span>
      </span>
      <span className={`font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4 ${labelClassName}`}>
        photos -&gt;
      </span>
    </TransitionLink>
  );
}
