import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  XIcon,
} from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/site";

/**
 * The social accounts, as links.
 *
 * Only the ones with a URL in siteConfig.social are shown. The footer and
 * the contact page used to draw all five icons as plain spans whatever the
 * truth was — an icon that cannot be clicked reads as a broken link, and an
 * icon for an account that does not exist is worse.
 */
const PLATFORMS = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "x", label: "X", Icon: XIcon },
] as const;

export function SocialLinks({
  className = "",
  itemClassName,
  iconClassName = "h-4 w-4",
}: {
  className?: string;
  itemClassName: string;
  iconClassName?: string;
}) {
  const accounts = PLATFORMS.filter(({ key }) => siteConfig.social[key]?.trim());
  if (accounts.length === 0) return null;

  return (
    <div className={`flex gap-3 ${className}`}>
      {accounts.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={siteConfig.social[key]}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={`Hunarsaaz on ${label}`}
          title={`Hunarsaaz on ${label}`}
          className={itemClassName}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
