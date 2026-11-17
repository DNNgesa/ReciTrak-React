function Footer() {
  return (
    <footer className="bg-dark text-light border-top py-4 mt-auto">
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-md-4 text-center text-md-start">
            <span className="fw-bold h5 mb-0 me-2 text-warning">ReciTrak</span>
            <span className="small text-secondary d-none d-lg-inline">
              | Production & Supply Chain Management
            </span>
          </div>

          <div className="col-md-4 text-center">
            <span className="small mx-2">
              <i className="bi bi-envelope-fill text-warning me-1"></i>
              support@recitrak.com
            </span>
            <span className="small mx-2 d-none d-sm-inline">
              <i className="bi bi-telephone-fill text-warning me-1"></i>
              +254 (0) 700 700 700
            </span>
          </div>

          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="#facebook" className="text-light fs-5" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#twitter" className="text-light fs-5" aria-label="X (Twitter)">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#linkedin" className="text-light fs-5" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#instagram" className="text-light fs-5" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
