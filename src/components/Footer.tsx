'use client';

import {
  WARPCAST_LINK,
} from 'src/links';

export default function Footer() {
  return (
    <section className="mt-auto mb-2 flex w-full flex-col items-center justify-center gap-2 md:mt-8 md:mb-6">
      <aside className="flex items-center pt-2 md:pt-0">
        <h3 className="text-center text-m">
          Provided to you with love from{' '}<br/>
          <a
            href={WARPCAST_LINK}
            target="_blank"
            rel="noreferrer"
            title="@Tyga"
            className="font-semibold hover:text-indigo-600"
          >
            @Tyga
          </a>
          {' × '}
          <a
            href="https://warpcast.com/~/channel/basecolors"
            target="_blank"
            rel="noreferrer"
            title="/basecolors"
            className="font-semibold hover:text-indigo-600"
          >
            /basecolors
          </a>
        </h3>
      </aside>
    </section>
  );
}
