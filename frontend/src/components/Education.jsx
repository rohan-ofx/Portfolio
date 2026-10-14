import useFetch from "../hooks/useFetch.js";

const Education =() =>{
    const {
        data : educations,
        loading,
        error,
    } = useFetch("/educations");
   

    if(loading){
        return<p>Loading Education...</p>
    }
    if(error){
        return<p>{error}</p>
    }

    return(
        <section>
            <h2>My Education</h2>

            {educations.length === 0 ? (
                <p>No Education Found</p>
            ):(
                <div>
                    {educations.map((education)=>(
                        <div key={education._id}>
                            <h3>education.institution</h3>

                            <p>Degree: {education.degree}</p>

                            <p>Field of Study: {education.fieldofStudy}</p>

                            <p>Start Date: {education.startDate}</p>

                            {education.endDate && (
                                <p>End Date: {education.endDate}</p>
                            )}

                            {education.grade && (
                                <p>Grade: {education.grade}</p>
                            )}

                            {education.description && (
                                <p>{education.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Education;