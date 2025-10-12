import React from "react";
import "../pages/CSS/returnrefund.css";

const RefundPolicy = () => {
  return (
    <div className="refund-container">
      <h1 className="refund-title">Refund and Replacement Policy</h1>
      <h2 className="refund-subtitle">
        Healthy Horizons Pvt. Ltd. (Yog Saathi)
      </h2>

      <p className="refund-text">
        At <strong>Healthy Horizons Pvt. Ltd.</strong>, (brand name{" "}
        <strong>Yog Saathi</strong>), we are committed to deliver high-quality
        wellness yoga services. Please read our Refund and Replacement Policy
        carefully before subscribing or purchasing any of our services.
      </p>
      <hr />

      <h3 className="refund-section-title">1. General Policy</h3>
      <p className="refund-text">
        All services provided by Yog Saathi, including but not limited to yoga
        classes (online/offline), workshops, events, and subscription-based
        offerings, are <strong>non-refundable</strong> once the payment is made.
      </p>
      <hr />

      <h3 className="refund-section-title">
        2. Service Deficiency or Inaccessibility
      </h3>
      <p className="refund-text">
        If a user faces any deficiency in services—such as inability to access a
        session, poor quality, or disruption in delivery not at the Customer
        end—such issues must be{" "}
        <strong>reported within 3 (three) calendar days</strong> of occurrence
        via email at{" "}
        <b>
          {" "}
          <em>healthy.horizons111@gmail.com</em>{" "}
        </b>
        or through our official customer support channels.
      </p>
      <p className="refund-text">
        Upon review, the Company may, at its sole discretion:
      </p>
      <ul className="refund-list">
        <li>Extend the duration of the subscription or affected service.</li>
        <li>Offer access to additional sessions as compensation.</li>
      </ul>
      <p className="refund-text">
        The decision of <strong>Healthy Horizons Pvt. Ltd.</strong> in this
        matter shall be <strong>final and binding</strong>, and no further
        claims will be entertained.
      </p>
      <hr />

      <h3 className="refund-section-title">3. No Cash Refunds</h3>
      <p className="refund-text">
        No cash or credit card refunds shall be processed under any
        circumstances, including:
      </p>
      <ul className="refund-list">
        <li>User’s change of mind after purchase.</li>
        <li>Failure to use the service within the stipulated time.</li>
        <li>
          Any personal inconvenience, unless it falls under the deficiency
          clause mentioned above.
        </li>
      </ul>
      <hr />

      <h3 className="refund-section-title">
        4. Exception in Special Circumstances
      </h3>
      <p className="refund-text">
        In rare and exceptional cases, such as technical failure in payment
        processing or duplicate transactions, a refund may be considered after
        proper verification. Such refunds shall be effected with in 10 working days from the date of receipt of written request. All such requests must be made in writing within{" "}
        <strong>5 (five) calendar days</strong> from the date of transaction.
      </p>

      <h3 className="refund-section-title">Contact Information</h3>
      <p>For any further queries or clarifications, please contact:</p>
      <ul className="refund-list-nobullet">
        <li>
          📧 <strong>Email:</strong> healthy.horizons111@gmail.com
        </li>
        <li>
          📞 <strong>Phone:</strong> [9910433340]
        </li>
      </ul>

      <p className="refund-footer">
        <em>
          This policy is subject to change at the discretion of the Company.
          Users are advised to check the latest version available on our
          official website.
        </em>
      </p>
    </div>
  );
};

export default RefundPolicy;
