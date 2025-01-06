import React from 'react'
import '../stylesheets/profile.css'

const Profile = props => {
    return (
        <>
            <div className="profileContainer">
                <div className="detailsContainer">
                    <div className="photoContainer">
                        <img src="" alt="" srcset="" className="profileImage" />
                    </div>
                    <div className="details">
                        {/* <Entry
                            styleClass="profileName"
                            labelText="Name"
                            value="Dr. Ritika Arora"
                        /> */}
                    </div>
                </div>
                <div className="summaryContainer"></div>
            </div>
        </>
    )
}

Profile.propTypes = {

}

export default Profile
