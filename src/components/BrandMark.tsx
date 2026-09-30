import { Link } from 'react-router-dom';
import { clubConfig } from '../data/club';
import { localizePath, useLocale } from '../i18n/locale';

/** Shared club identity; the grid is decorative beside its accessible name. */
export default function BrandMark({ dark = false }: { dark?: boolean }) {
  const locale = useLocale();
  return (
    <Link
      to={localizePath('/', locale)}
      aria-label={clubConfig.name}
      className={`inline-flex min-w-0 max-w-full items-center gap-3 rounded ${dark ? 'text-on-brand' : 'text-ink'}`}
    >
      <img
        src="/assets/brand/goban-mark.svg"
        alt=""
        width={48}
        height={48}
        className={`h-[44px] w-[44px] shrink-0 ${dark ? 'invert' : ''}`}
      />
      <span className="min-w-0 max-w-32 break-words font-serif text-xl font-medium leading-tight">
        {clubConfig.name}
      </span>
    </Link>
  );
}
