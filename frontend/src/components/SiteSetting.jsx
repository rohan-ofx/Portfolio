import useFetch from "../hooks/useFetch.js";

const SiteSetting = () =>{
    const{
        data : sitesettings,
        loading,
        error,
    } = useFetch("/site-settings");

    if(loading){
        return <p>Loading Site Setting...</p>
    }

    if(error){
        return<p>{error}</p>
    }

    return(
        <section>
            <h2>{sitesettings.name}</h2>

            <h3>{sitesettings.title}</h3>

            {sitesettings.profileImage && (
                <img
                src = {sitesettings.profileImage}
                alt = {sitesettings.name}
                />
            )}
            <p>{sitesettings.bio}</p>

            {sitesettings.location &&(
                <p>Location{sitesettings.location}</p>
            )}

            {sitesettings.resumeUrl &&(
                <a
                href={sitesettings.resume}
                target="_blank"
                rel="noopener noreferrer"
                >
                    view Resume
                </a>
            )}
        </section>
    );
};

export default SiteSetting;