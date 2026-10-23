import ReviewForm from '../../components/ReviewForm';

export const metadata = {
  title: 'Leave a Review',
  description: 'Worked with Shakir Hussain on a website, online store or web app? Share your experience in two minutes.',
  alternates: { canonical: '/leave-review' },
  robots: { index: false, follow: true },
};

export default function LeaveReview() {
  return (
    <>
      <section className="hero rv-hero" style={{ padding: 0 }}>
        <div className="wrap rv-head">
          <span className="status"><i />Takes about 2 minutes</span>
          <h1>How was working <span className="em">together?</span></h1>
          <p className="lede">Your words help other business owners decide with confidence. Share a few honest lines about your project, and add your photo or logo if you like.</p>
        </div>
      </section>
      <div className="wrap rv-wrap">
        <ReviewForm />
      </div>
    </>
  );
}
