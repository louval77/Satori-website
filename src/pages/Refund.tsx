import { SITE } from '../config';
import { PAGES } from '../lib/links';

export function Refund() {
  return (
    <>
      <h2>There is nothing to refund today</h2>
      <p>
        {SITE.product} is a free hackathon prototype. Payments are switched off, we never ask for card or bank details, and no
        one can be charged through this site. The Pro prices shown on the site are planned prices only.
      </p>

      <h2>Watch out for scams</h2>
      <p>
        We will never ask you to pay by message, bank transfer or any other way. If someone asks you to pay for SATORI or for
        a place at a university "through SATORI", it is not us. Please tell us at{' '}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>

      <h2>If paid plans launch later</h2>
      <p>
        Before we accept any payment, we will publish the full refund and cancellation rules on this page. Your statutory
        rights as a consumer, including those under the Law of the Republic of Kazakhstan "On Consumer Protection", will not
        be limited by those rules.
      </p>

      <p>
        Related: <a href={PAGES.terms}>terms and conditions</a> and <a href={PAGES.privacy}>privacy policy</a>.
      </p>
    </>
  );
}
