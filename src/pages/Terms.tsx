import { PRICING, SITE } from '../config';
import { PAGES } from '../lib/links';

export function Terms() {
  return (
    <>
      <p>
        These terms apply when you use {SITE.product} ("SATORI", "we", "us"), a free hackathon prototype made by team{' '}
        {SITE.team}, {SITE.legalStatus} in {SITE.country}. By using the site you agree to them.
      </p>

      <h2>What SATORI is</h2>
      <p>
        SATORI turns your answers into a list of matching universities, an action plan and a checklist for bachelor's
        admission in Mainland China, Hong Kong SAR, South Korea and Japan. It is an information tool.
      </p>

      <h2>No guarantee of admission and no professional advice</h2>
      <ul>
        <li>
          The fit score is a forecast of how well your profile matches published requirements. It is not a probability of
          admission, and no one can promise you a place.
        </li>
        <li>SATORI is not an education agent, and we do not apply to universities on your behalf.</li>
        <li>Nothing on the site is legal, immigration or financial advice.</li>
        <li>We are not affiliated with, endorsed by or paid by any university or government listed on the site.</li>
      </ul>

      <h2>Accuracy of information</h2>
      <p>
        We collected university facts from official websites on {SITE.dataCheckedOn} and link to each source. Fees,
        requirements and dates change, sometimes without notice. The official university or government page always wins over
        SATORI. If you find a mistake, tell us at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and we will
        fix it.
      </p>

      <h2>Using the site fairly</h2>
      <p>Please do not try to break, overload or copy the site in bulk, and do not use it to mislead other people.</p>

      <h2>Plans and prices</h2>
      <ul>
        <li>The Free plan costs nothing.</li>
        <li>
          Pro is planned at ${PRICING.monthly} per month or ${PRICING.yearly} per year. Payments are not enabled: we do not
          accept, request or store payment details, and you will not be charged.
        </li>
        <li>
          During the competition, Pro can be unlocked on a single device with a developer access code given to the SATORI team
          and competition judges. The code is personal to them and may be changed or withdrawn at any time.
        </li>
        <li>
          If paid plans launch later, we will publish updated terms first, including renewal, cancellation and refund rules.
          People under 18 will need a parent or guardian to buy a paid plan.
        </li>
      </ul>

      <h2>Content and trademarks</h2>
      <p>
        The site's text, design and code belong to team {SITE.team}. University names belong to their owners and are used only
        to identify them. Photos are used under their open licences and credited on the{' '}
        <a href={PAGES.credits}>credits page</a>.
      </p>

      <h2>Liability</h2>
      <p>
        The site is provided free of charge and "as is". To the extent allowed by the law of the Republic of Kazakhstan, we are
        not responsible for decisions you make based on it, such as missing a deadline that changed on an official website.
        Nothing in these terms limits rights that the law does not allow to be limited.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the law of the Republic of Kazakhstan. If you have a problem, please contact us first so we
        can try to solve it together.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms and will change the date at the top when we do. Questions:{' '}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. See also our <a href={PAGES.privacy}>privacy policy</a>{' '}
        and <a href={PAGES.refund}>refund policy</a>.
      </p>
    </>
  );
}
