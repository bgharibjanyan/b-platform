import { useState } from "react";
import { fieldText } from "../../field-values";
import { parseVideo } from "../../safe";
import { BlockImage, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

export function VideoBlock({ content, options }: BlockProps) {
  const video = parseVideo(content.url);
  const [playingUrl, setPlayingUrl] = useState<string>();
  if (!video) return null;

  const title = fieldText(content.title);
  const clickToPlay = options.clickToPlay !== false;
  const url = clickToPlay ? video.embed : video.embed.replace("?autoplay=1", "");

  return (
    <div>
      <h2>{title}</h2>
      <div className="co-video" style={{ aspectRatio: fieldText(options.aspect) }}>
        {playingUrl === url || !clickToPlay ? (
          <iframe src={url} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
        ) : (
          <button type="button" onClick={() => setPlayingUrl(url)}>
            <BlockImage source={content.poster} alt={content.alt} />
            <span>Play {title}</span>
          </button>
        )}
      </div>
      <BlockLink to={content.transcript}>Captions or transcript</BlockLink>
    </div>
  );
}
