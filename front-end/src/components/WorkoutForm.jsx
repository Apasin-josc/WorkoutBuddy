import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext();
    const {user} = useAuthContext();
 
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);
    const[emptyFields, setEmptyFields] = useState([]);

    //getting into the api
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!user){
            setError('You must be logged in');
            return
        }

        const workout = {title, load, reps}

        //making a post to the api
        const response = await fetch('/api/workouts', {
            method: 'POST',
            //turning the workout object into JSON to pass it into the API
            body: JSON.stringify(workout),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json();

        //checking if response was okay
        if(!response.ok){
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if(response.ok){
            //reseting everything after posting a workout
            setTitle('');
            setLoad('');
            setReps('');
            setError(null);
            setEmptyFields([]);
            console.log('new workout added', json);
            dispatch({type: 'CREATE_WORKOUT', payload: json});
        }
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3> Add a New workout 🔊</h3>
            <label> Exercise Title: </label>
            <input 
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label> Load (in Kg): </label>
            <input 
            type="number"
            onChange={(e) => setLoad(e.target.value)}
            value={load}
            className={emptyFields.includes('load') ? 'error' : ''}
            />

            <label> Reps (#): </label>
            <input 
            type="number"
            onChange={(e) => setReps(e.target.value)}
            value={reps}
            className={emptyFields.includes('reps') ? 'error' : ''}
            />

            <button> Add workout ✅ </button>
            {/* checking if there's an error */}
            {error && <div className = "error">{error}</div>}
        </form>
    )
}

export default WorkoutForm;