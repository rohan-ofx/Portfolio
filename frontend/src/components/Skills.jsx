import useFetch from "../hooks/useFetch.js";
const Skills = () =>{
    const {
        data: skills,
        loading,
        error,
    } = useFetch("/skills");

    if(loading){
        return <p>Loading Skills...</p>
    }
    if(error){
        return<p>{error}</p>;
    }

    return(
        <section>
            <h2>My Skills</h2>

            {skills.length ===0 ? (
                <p>No Skills Found</p>
            ):(
                <div>
                    {skills.map((skill)=>(
                        <div key={skill._id}>
                            <h3>{skill.name}</h3>

                            <p>Category: {skill.category}</p>

                            {skill.level && (
                                <p>Level: {skill.level}</p>
                            )}

                            {skill.icon && (
                                <p>Icon: {skill.icon}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Skills;