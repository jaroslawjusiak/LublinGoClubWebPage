import { Link } from 'react-router-dom';
import { clubConfig } from '../data/club';
import { localizePath, useLocale } from '../i18n/locale';

/** Shared club identity; the logo is decorative beside its accessible name. */
export default function BrandMark({ dark = false }: { dark?: boolean }) {
  const locale = useLocale();
  return (
    <Link
      to={localizePath('/', locale)}
      aria-label={clubConfig.name}
      className={`inline-flex min-w-0 max-w-full items-center gap-3 rounded ${dark ? 'text-on-brand' : 'text-ink'}`}
    >
      <img
        src="/assets/brand/club-logo.svg"
        alt=""
        width={591}
        height={802}
        className={`h-[60px] w-[44px] shrink-0 object-contain ${dark ? 'rounded-sm bg-paper p-1' : ''}`}
      />
      <span className="min-w-0 max-w-32 break-words font-serif text-xl font-medium leading-tight">
        {clubConfig.name}
      </span>
    </Link>
  );
}
