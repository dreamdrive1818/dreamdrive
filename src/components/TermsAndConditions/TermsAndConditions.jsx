import React from "react";
import "./TermsAndConditions.css"; // You can style it separately

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Dream Drive - Terms & Conditions</h1>

      <section>
        <h2>1. General Terms</h2>
        <p>
          In this Rental Agreement, the First Party refers to Amarjeet Kumar Singh, proprietor of Dream Drive (hereinafter referred to as "the Company"), and the Second Party refers to the Customer renting the vehicle.
        </p>
        <ul>
          <li>These Terms and Conditions regulate the rental and use of the vehicle.</li>
          <li>The Customer agrees to all terms upon signing this Agreement.</li>
        </ul>
      </section>

      <section>
        <h2>2. Conditions of Vehicle Use</h2>
        <ul>
          <li>Only authorized drivers verified by the company may drive the vehicle.</li>
          <li>Driver must hold a valid driving license acceptable in the High Court of Jharkhand.</li>
          <li>No driving under intoxication, fatigue, or unfit health condition.</li>
          <li>Customer is responsible for prudent use; any misuse may lead to termination of the agreement.</li>
          <li>
            <strong>Damages:</strong> Up to ₹10,000 borne by customer; large damages handled via insurance (claim fees borne by customer). In drink & drive cases, customer is fully liable.
          </li>
          <li>
            GPS tracking is installed and must not be removed. Tampering will be considered theft.
          </li>
        </ul>
        <h3>2.5 Prohibited Uses</h3>
        <ul>
          <li>Overloading passengers or goods</li>
          <li>Off-road driving, towing, or race participation</li>
          <li>Carpooling, ride-sharing, or subleasing</li>
          <li>Transporting animals, illegal goods, or in smoking/drinking condition</li>
        </ul>
        <p>
          The vehicle is allowed only within Jharkhand unless explicitly permitted. Violation of state boundary terms makes the customer fully liable.
        </p>
      </section>

      <section>
        <h2>3. Transfer & Return of Vehicle</h2>
        <p>Vehicle must be returned in good condition. Disputes valid for 2 days post return (T+2).</p>
      </section>

      <section>
        <h2>4. Payment Terms</h2>
        <p>All rental charges must be paid in full before the vehicle is delivered.</p>
      </section>

      <section>
        <h2>5. Fuel & Mileage</h2>
        <p>Fuel level must match the level at the time of delivery.</p>
      </section>

      <section>
        <h2>6. Damage & Insurance</h2>
        <p>
          Customer bears minor damages. In major accidents or theft, insurance will be used, but the customer must pay settlement fees.
        </p>
      </section>

      <section>
        <h2>7. Company Liability</h2>
        <p>Dream Drive ensures sanitized, well-maintained, and private vehicles.</p>
      </section>

      <section>
        <h2>8. Traffic Fines</h2>
        <p>All traffic or parking violations are the responsibility of the customer. Disputes valid for T+7 days post return.</p>
      </section>

      <section>
        <h2>9. Illegal Activities</h2>
        <p>Any illegal use of the vehicle will be attributed to the customer during the rental period.</p>
      </section>

      <section>
        <h2>10. Rental Extension</h2>
        <p>
          For extensions, a new agreement and advance payment are required. Non-compliance leads to legal action.
        </p>
      </section>

      <section>
        <h2>11. Jurisdiction & Dispute Resolution</h2>
        <p>
          All terms are governed under the jurisdiction of the High Court of Jharkhand (Ranchi). Disputes are first attempted via negotiation, failing which, legal proceedings will follow.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
