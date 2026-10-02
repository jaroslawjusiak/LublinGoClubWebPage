import React from 'react';
import { meetingInfo } from '../data/club';

const VenueLink: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <a
    href={meetingInfo.venueUrl}
    target="_blank"
    rel="noreferrer noopener"
    className="rounded underline underline-offset-4 decoration-current/40 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
  >
    {children ?? meetingInfo.venueName}
  </a>
);

export default VenueLink;
