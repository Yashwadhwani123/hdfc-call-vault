import React from "react";
import '../../stylesheets/common/loader.css'

const Loader = () => {

  // const [loading, setLoading] = useState(false)



  return (
    <div className="loader">
      <div className="text-center">
        <div className="spinner-border text-primary " role="status">
          <span className="sr-only">
            <div class="d-flex justify-content-center  ">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
               
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
