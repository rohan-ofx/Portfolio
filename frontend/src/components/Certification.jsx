import useFetch from "../hooks/useFetch.js";

const Certification =() =>{
    const {
        data: certifications,
        loading,
        error,
    } = useFetch("/certificates");
    if(loading){
        return<p>Loading Certificates....</p>
    }
    if(error){
        return<p>{error}</p>
    }

    return(
        <section>
            <h2>My Certifications</h2>

            {certifications.length === 0?(
                <p>No Certification Found</p>
            ):(
                <div>
                    {certifications.map((certification)=>(
                        <div key={certification._id}>
                            <h3>{certification.title}</h3>

                            <P>Issuer: {certification.issuer}</P>

                            <p>Issuer Date: {certification.issueDate}</p>

                            {certification.credentialId && (
                                <p>
                                    credential Id:{certification.credentialId}
                                </p>
                            )}

                            {certification.credentialUrl && (
                                <a
                                href={certification.credentialUrl}
                                target="_blank"
                                rel = "noopener noreferrer"
                                >
                                    View Credential
                                </a>
                            )}

                            {certification.certificateUrl && (
                                 <a
                                  href={certification.certificateUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" >
                                     View Certificate 
                                 </a>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Certification;