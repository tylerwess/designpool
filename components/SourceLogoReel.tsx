import {
  SOURCE_LOGOS,
  SOURCE_REEL_CAPTION,
  SOURCE_REEL_LOGO_HEIGHT_PX,
  SOURCE_REEL_REPEAT,
} from "@/lib/source-logos";
import { Container } from "@/components/ui/Container";

function SourceReelGroup({ prefix }: { prefix: string }) {
  const marks = Array.from({ length: SOURCE_REEL_REPEAT }, () => SOURCE_LOGOS).flat();
  return (
    <div className="source-reel-group">
      {marks.map((logo, index) => {
        const displayWidth = Math.round((logo.width / logo.height) * SOURCE_REEL_LOGO_HEIGHT_PX);
        return (
          <img
            key={`${prefix}-${logo.name}-${index}`}
            className="source-reel-logo"
            src={logo.src}
            alt=""
            width={displayWidth}
            height={SOURCE_REEL_LOGO_HEIGHT_PX}
            decoding="async"
          />
        );
      })}
    </div>
  );
}

export function SourceLogoReel() {
  return (
    <section className="source-board" aria-label={SOURCE_REEL_CAPTION}>
      <Container>
        <p className="source-board-caption max-w-2xl text-base leading-7 text-muted">{SOURCE_REEL_CAPTION}</p>
      </Container>
      <div className="source-reel" aria-hidden="true">
        <div className="source-reel-track">
          <SourceReelGroup prefix="a" />
          <SourceReelGroup prefix="b" />
        </div>
      </div>
    </section>
  );
}
