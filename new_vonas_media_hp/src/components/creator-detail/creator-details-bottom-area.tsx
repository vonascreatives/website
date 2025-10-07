import React from "react";
import CreatorDetailsDescription from "./creator-details-description";
import CreatorDetailsWork from "./creator-details-work";
import CreatorDetailsReview from "./creator-details-review";

interface CreatorDetailsBottomAreaProps {
  creator: any;
}

export default function CreatorDetailsBottomArea({ creator }: CreatorDetailsBottomAreaProps) {
  const activeRef = React.useRef<HTMLButtonElement | null>(null);
  const marker = React.useRef<HTMLSpanElement | null>(null);

  // handleActive
  const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    if (target.classList.contains('active') && marker.current) {
      marker.current.style.left = target.offsetLeft + "px";
      marker.current.style.width = target.offsetWidth + "px";
    }
  };

  React.useEffect(() => {
    if (activeRef.current?.classList.contains('active') && marker.current) {
      marker.current.style.left = activeRef.current.offsetLeft + 'px';
      marker.current.style.width = activeRef.current.offsetWidth + 'px';
    }
  }, []);

  return (
    <section className="tp-product-details-area">
      <div className="tp-product-details-bottom pt-120 pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-product-details-tab-nav tp-tab">
                <nav>
                  <div
                    className="nav nav-tabs justify-content-center p-relative tp-product-tab"
                    id="navPresentationTab"
                    role="tablist"
                  >
                    <button
                      className="nav-link active"
                      id="nav-description-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-description"
                      type="button"
                      role="tab"
                      aria-controls="nav-description"
                      aria-selected="true"
                      ref={activeRef}
                      onClick={(e) => handleActive(e)}
                    >
                      About Creator
                    </button>
                    <button
                      className="nav-link"
                      id="nav-addInfo-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-addInfo"
                      type="button"
                      role="tab"
                      aria-controls="nav-addInfo"
                      aria-selected="false"
                      onClick={e => handleActive(e)}
                    >
                      Portfolio & Work
                    </button>
                    <button
                      className="nav-link"
                      id="nav-review-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-review"
                      type="button"
                      role="tab"
                      aria-controls="nav-review"
                      aria-selected="false"
                      onClick={e => handleActive(e)}
                    >
                      Reviews (5)
                    </button>

                    <span
                      id="productTabMarker"
                      className="tp-product-details-tab-line"
                      ref={marker}
                    ></span>
                  </div>
                </nav>
                <div className="tab-content" id="navPresentationTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-description"
                    role="tabpanel"
                    aria-labelledby="nav-description-tab"
                  >
                    {/* description */}
                    <CreatorDetailsDescription creator={creator} />
                    {/* description */}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-addInfo"
                    role="tabpanel"
                    aria-labelledby="nav-addInfo-tab"
                  >
                    {/* work/portfolio */}
                    <CreatorDetailsWork creator={creator} />
                    {/* work/portfolio */}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-review"
                    role="tabpanel"
                    aria-labelledby="nav-review-tab"
                  >
                    {/* review */}
                    <CreatorDetailsReview creator={creator} />
                    {/* review */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}