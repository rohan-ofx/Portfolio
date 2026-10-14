import { useEffect } from "react";
import api from "../services/api";
import { useState } from "react";

const Projects = () => {

  const [projects ,setproject] = useState([]);
  const [loading, setLoading]= useState(true);
  const [error , setError] =useState("");
  useEffect(() => {
    const getProjects = async () => {
      try{
      const response = await api.get("/projects");
      console.log(response.data);

      setproject(response.data.data);
      } catch(error){
        console.log(error);
        setError("Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  

  if(loading){
    return <p>Loading Project....</p>
  }

  if(error){
    return <p>{error}</p>
  }

  return (
    <section>
      <h2>My Projects</h2>

      {projects.length === 0 ? (
        <p>NO Project Found</p>
      ):(
        <div>
      {projects.map((project) =>(
        <div key={project._id}>

          {project.image &&(
            <img 
            src={project.image} 
            alt={project.title} 
            />
          )}

          <h3>{project.title}</h3>

          <p>{project.description}</p>

          {/* Technologies */}
          <div>
            {project.technologies?.map((technology , index)=>(
              <span key={index}>
                {technology}
              </span>
              ))}
            </div>

              {project.featured && (
                <p>Featured Project</p>
              )}

              {/* Github Link */}

              {project.github && (
                <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                >
                  Github
                </a>
              )}

              {/* Live Project Link */}
              {project.liveUrl && (
                <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                >
                  Live Demo
                </a>
              )}

        </div>
      ))}
    </div>
      )}
      </section>
  );
};

export default Projects;