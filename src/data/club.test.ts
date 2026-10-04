import { describe, it, expect } from 'vitest';
import { clubConfig, meetingInfo, socialLinks } from './club';
import { navItems } from './site';
import { people } from './people';

describe('club data — single source of truth', () => {
  it('records the verified meeting facts from the old site and rebuild plan', () => {
    expect(meetingInfo.venueName).toBe('Młodzieżowy Dom Kultury nr 2');
    expect(meetingInfo.venueUrl).toBe(
      'https://mdk2.lublin.eu/szczegoly-galerii/klub-gier-planszowych-lubelski-klub-go-7915',
    );
    expect(meetingInfo.addressLine).toBe('ul. Bernardyńska 14a');
    expect(meetingInfo.roomNumber).toBe('sala 14');
    expect(meetingInfo.postalCode).toBe('20-950');
    expect(meetingInfo.city).toBe('Lublin');
    expect(meetingInfo.startTime).toBe('17:00');
    expect(meetingInfo.endTime).toBe('20:00');
    expect(clubConfig.isFreeEntry).toBe(true);
  });

  it('does not hardcode a weekday in club data (it is localized via i18n)', () => {
    expect('dayOfWeek' in meetingInfo).toBe(false);
  });

  it('uses the provided public email and does not expose a personal phone', () => {
    const config = clubConfig as typeof clubConfig & { phone?: unknown };
    expect(config.phone).toBeUndefined();
    expect(clubConfig.email).toBe('jaroslaw.jusiak@gmail.com');
  });

  it('uses the rebuild-plan canonical domain, not the old placeholder', () => {
    expect(clubConfig.canonicalDomain).toBe('lubelski-klub-go.pl');
    expect(clubConfig.canonicalDomain).not.toBe('lubelskigoklub.pl');
  });

  it('only exposes real social destinations (no invented Instagram/YouTube)', () => {
    expect(socialLinks.facebook).toMatch(/^https:\/\//);
    expect(socialLinks.discord).toMatch(/^https:\/\/discord\.gg\//);
    const links = socialLinks as Record<string, string | undefined>;
    expect(links.instagram).toBeUndefined();
    expect(links.youtube).toBeUndefined();
  });

  it('provides working map and directions links', () => {
    expect(meetingInfo.mapUrl).toMatch(/^https:\/\/www\.openstreetmap\.org\//);
    expect(meetingInfo.directionsUrl).toMatch(/^https:\/\//);
  });

  it('keeps every navigation label key-based rather than literal', () => {
    for (const item of navItems) {
      expect(item.path).toMatch(/^\//);
      expect(item.labelKey).toMatch(/^[a-z]+:[a-z.]+$/);
    }
  });

  it('stores organizer OGS handles without personal email/phone', () => {
    expect(people.length).toBeGreaterThan(0);
    for (const person of people) {
      expect(person.ogsHandle).toBeTruthy();
      const p = person as typeof person & { email?: unknown; phone?: unknown };
      expect(p.email).toBeUndefined();
      expect(p.phone).toBeUndefined();
    }
  });
});
