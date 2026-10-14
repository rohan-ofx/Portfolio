import useFetch from "../hooks/useFetch.js";

const Experience = () =>{
    const {
        data : experiences,
        loading,
        error,
    } = useFetch("/experiences");

    if(loading){
        return <p>Loading Experiences...</p>
    }
    if(error){
        return <p>{error}</p>
    }

    return (
        <section>
            <h2>My Experience</h2>

            {experiences.length === 0 ? (
                <p>No Experience Found</p>
            ):(
                <div>
                    {experiences.map((experience)=>(
                        <div key={experience._id}>
                            <h3>{experience.position}</h3>

                            <p>Company: {experience.company}</p>

                            {experience.location &&(
                                <p>Location: {experience.location}</p>
                            )}

                            <p>
                                Start Date: {experience.startDate}
                            </p>

                            {experience.endDate &&(
                                <p>End Date : {experience.endDate}</p>
                            )}

                            <p>{experience.description}</p>

                            {experience.technologies.length > 0 && (
                                <div>
                                    <p>Technologies:</p>
                                    {experience.technologies.map((technology, index)=>(
                                        <span key = {technology}>
                                            {technology}
                                            {index < experience.technologies.length -1 && ", "}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Experience;