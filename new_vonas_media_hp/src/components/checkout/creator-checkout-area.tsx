"use client";
import React from "react";
import Image from "next/image";
import { useShortlist } from "@/hooks/use-shortlist";
import { formatFollowers } from "@/utils/formatFollowers";
import { AccessibleInput } from "@/components/ui/accessibility-utils";

export default function CreatorCheckoutArea() {
  const { shortlist, sessionId } = useShortlist();
  const [formData, setFormData] = React.useState({
    brandName: '',
    contactEmail: '',
    contactName: '',
    message: '',
    budget: '',
    timeline: '',
  });
  const [files, setFiles] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // Max 10 files
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId || !shortlist?.creators?.length) {
      alert('Please add creators to your shortlist before submitting.');
      return;
    }

    if (!formData.brandName || !formData.contactEmail || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('sessionId', sessionId);
      formDataToSend.append('brandName', formData.brandName);
      formDataToSend.append('contactEmail', formData.contactEmail);
      formDataToSend.append('contactName', formData.contactName);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('budget', formData.budget);
      formDataToSend.append('timeline', formData.timeline);
      
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitted(true);
        console.log('Submission successful:', result);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="tp-checkout-area pt-200 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="tp-checkout-verify text-center">
                <div className="tp-checkout-success p-5">
                  <h2 className="mb-4">🎉 Collaboration Brief Submitted!</h2>
                  <p className="mb-4">Thank you for your submission. We&apos;ll review your requirements and connect you with your selected creators within 24 hours with a custom quote.</p>
                  <div className="d-flex gap-3 justify-content-center">
                    <button 
                      className="tp-btn-cart" 
                      onClick={() => window.location.href = '/creators'}
                    >
                      Browse More Creators
                    </button>
                    <button 
                      className="tp-btn-cart-border" 
                      onClick={() => window.location.href = '/'}
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tp-checkout-area pt-200 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-7">
            <div className="tp-checkout-verify">
              <div className="tp-checkout-verify-item mb-4">
                <h3>Creator Collaboration Brief</h3>
                <p>Tell us about your brand collaboration goals and project requirements.</p>
              </div>
            </div>

            <div className="tp-checkout-bill-area">
              <form onSubmit={handleSubmit}>
                <div className="tp-checkout-bill-form">
                  <div className="tp-checkout-bill-inner">
                    <div className="row">
                      <div className="col-md-12">
                        <AccessibleInput
                          id="brand-name"
                          name="brandName"
                          label="Brand Name"
                          type="text"
                          value={formData.brandName}
                          onChange={handleInputChange}
                          placeholder="Your Brand or Company Name"
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <AccessibleInput
                          id="contact-name"
                          name="contactName"
                          label="Contact Name"
                          type="text"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Your Full Name"
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <AccessibleInput
                          id="contact-email"
                          name="contactEmail"
                          label="Email Address"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          placeholder="your.email@company.com"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <div className="tp-checkout-input">
                          <label htmlFor="budget-range">Budget Range</label>
                          <select 
                            id="budget-range"
                            name="budget"
                            className="form-control"
                            value={formData.budget}
                            onChange={handleInputChange}
                            aria-label="Select budget range"
                          >
                            <option value="">Select Budget Range</option>
                            <option value="under-5k">Under $5,000</option>
                            <option value="5k-10k">$5,000 - $10,000</option>
                            <option value="10k-25k">$10,000 - $25,000</option>
                            <option value="25k-50k">$25,000 - $50,000</option>
                            <option value="over-50k">$50,000+</option>
                            <option value="discuss">Prefer to discuss</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="tp-checkout-input">
                          <label>Timeline</label>
                          <select 
                            name="timeline"
                            className="form-control"
                            value={formData.timeline}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Timeline</option>
                            <option value="asap">ASAP (Rush)</option>
                            <option value="1-month">Within 1 month</option>
                            <option value="1-3-months">1-3 months</option>
                            <option value="3-6-months">3-6 months</option>
                            <option value="over-6-months">6+ months</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="tp-checkout-input">
                          <label>
                            Project Description <span>*</span>
                          </label>
                          <textarea 
                            name="message"
                            placeholder="Describe your brand collaboration goals, target audience, desired content type, deliverables, campaign objectives, and any specific requirements for your influencer partnership..."
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            maxLength={2000}
                            required
                          />
                          <small className="text-muted">
                            {formData.message.length}/2000 characters
                          </small>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="tp-checkout-input">
                          <label>Supporting Files (Optional)</label>
                          <input 
                            type="file" 
                            multiple
                            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                          <small className="text-muted">
                            Upload briefs, references, or brand assets. Max 10 files, 10MB each. (PNG, JPG, PDF, DOC, DOCX)
                          </small>
                          
                          {files.length > 0 && (
                            <div className="mt-3">
                              <h6>Selected Files:</h6>
                              <ul className="list-unstyled">
                                {files.map((file, index) => (
                                  <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                                    <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => removeFile(index)}
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tp-checkout-btn-wrapper">
                  <button 
                    type="submit" 
                    className="tp-btn-cart w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Collaboration Brief'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Shortlist Summary */}
          <div className="col-lg-5">
            <div className="tp-checkout-bill-area">
              <h3 className="tp-checkout-bill-title">Selected Creators</h3>
              
              {!shortlist?.creators?.length ? (
                <div className="text-center p-4">
                  <p>No creators selected yet.</p>
                  <a href="/creators" className="tp-btn-cart">
                    Browse Creators
                  </a>
                </div>
              ) : (
                <div className="tp-checkout-order-details">
                  <div className="tp-order-info-list">
                    <ul>
                      {shortlist.creators.map((creator) => (
                        <li key={creator._id} className="tp-order-info-list-item d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            {creator.image && (
                              <div className="me-3">
                                <Image
                                  src={creator.image}
                                  alt={creator.imageAlt || creator.name}
                                  width={60}
                                  height={60}
                                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                              </div>
                            )}
                            <div>
                              <h6 className="mb-0">{creator.name}</h6>
                              <small className="text-muted">
                                {creator.followers ? formatFollowers(creator.followers) : 'Featured'} Followers
                              </small>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="tp-order-info-total mt-4 pt-3 border-top">
                    <div className="tp-order-info-total-text d-flex align-items-center justify-content-between">
                      <span>Total Creators:</span>
                      <span>{shortlist.creators.length}</span>
                    </div>
                  </div>

                  <div className="tp-checkout-payment mt-4">
                    <div className="tp-checkout-payment-item paypal-payment">
                      <input id="paypal_payment" name="payment" type="radio" defaultChecked />
                      <label htmlFor="paypal_payment" data-bs-toggle="collapse" data-bs-target="#paypal_payment_info">
                        Custom Quote
                      </label>
                      <div className="tp-checkout-payment-desc paypal-payment-desc">
                        <div id="paypal_payment_info" className="collapse show" data-bs-parent="#accordionExample">
                          <div className="tp-checkout-payment-desc-content">
                            <p>We&apos;ll prepare a custom quote based on your selected creators and project requirements. Pricing varies by creator, project scope, and timeline.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
