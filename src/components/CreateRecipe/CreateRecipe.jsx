import React, { useEffect } from 'react';
import { createRecipe, getDiets, removeRecipeDetail, getAllRecipes } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../NavBar/NavBar';
import { useHistory } from 'react-router-dom';
import Footer from '../Footer/Footer';

const FormRecipe = () => {
   const history = useHistory();

   let [input, setInput] = React.useState({
      title: '',
      image: '',
      summary: '',
      score: 50,
      healthScore: 50,
      steps: [],
      dietTypes: [],
   })

   const src = "https://images.food52.com/wulM9ARxwbCaQEeW0R6fmjisGZY=/fit-in/1200x1200/2d6bdab3-4206-4c3d-ac52-e428177251bc--default-recipe.jpg";
   const allDiets = useSelector(state => state.diets)
   const allRecipes = useSelector(state => state.allRecipes)
   const allTitles = allRecipes.map(e => e.title.toLowerCase());

   function validate() {
      let error = { title: null, summary: null, step: null, repeat: null };
      input.title !== "" ? error.title = null : error.title = 'The Recipe Must Have a Title';
      input.summary ? error.summary = null : error.summary = 'The Recipe Must Have a Description';
      input.steps.length && input.steps[0] !== "" ? error.step = null : error.step = 'The Recipe Must Have Steps';
      allTitles.includes(input.title.toLowerCase()) ? error.repeat = 'Sorry, That Title Already Exists' : error.repeat = null;
      return error;
   }

   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(getAllRecipes())
      dispatch(getDiets())
      dispatch(removeRecipeDetail())
   }, [dispatch]);

   const handlerChooseDiet = (e, i) => {
      let { id } = e.target;

      let returnDiets = input.dietTypes.includes(id) ? input.dietTypes.filter(e => e !== id) : [...input.dietTypes, id];
      let diet = document.getElementById(id);
      diet.className === 'dietPressed'
         ? diet.classList.remove('dietPressed')
         : diet.classList.add('dietPressed');
      setInput({
         ...input,
         dietTypes: returnDiets,
      })
   }
   const handleChange = (e) => {
      e.preventDefault();
      var { name, value } = e.target;
      if (name === "step") {
         setInput({
            ...input,
            steps: value.split("."),
         })

      } else {
         // /[`~,.<>;':"/[\]|{}()=_+-?¡!¿*{}´´¨´&%$#°]/.test(activity.name)
         setInput({
            ...input,
            [name]: e.target.value
         })

      }
      //Errors
      errorsStyles(name)
      function errorsStyles(prop) {
         let errors = validate(e.target);
         for (const key in errors) {
            errors[prop] ? e.target.classList.add('error') : e.target.classList.remove('error')

         }
      }
   }

   function handleSubmit(e) {
      e.preventDefault();
      let errors = validate();
      if (errors.title || errors.summary || errors.diets || errors.step) {
         let sendErrors = [];
         for (const key in errors) {
            sendErrors.push(errors[key])
         }
         alert(sendErrors.join(" \n"))
      } else {

         dispatch(getAllRecipes());
         alert("Recipe Created Succesfully!")
         dispatch(createRecipe(input))
         setInput({
            title: '',
            image: '',
            summary: '',
            score: 0,
            healthScore: 0,
            steps: [],
            dietTypes: [],
         })
         history.push("/home");
      }
   }
   return (
      <div>
         <NavBar></NavBar>
         <div className='createRecipe'>
            <form onSubmit={handleSubmit}>
               <div className='form'>
                  <div>
                     <h1>Create Your Own Recipe</h1>

                     <div className='formInputs'>
                        <div>
                           <div className='labels'>
                              <label>Title: </label>
                              <input type="text" name="title" maxLength="60" onChange={(e) => handleChange(e)} />
                              <label>Taste Score: </label>
                              <input type="range" max="100" min="1" name="score" onChange={(e) => handleChange(e)} />
                              <label>Health Score: </label>
                              <input type="range" max="100" min="1" name="healthScore" onChange={(e) => handleChange(e)} />
                              <label>URL Image: </label>
                              <input name="image" onChange={(e) => handleChange(e)} />
                           </div>
                           <div>
                              <h4 className='inputDiets'>Diets of Your Recipe</h4>
                              <div className='chooseDiets'>
                                 {allDiets?.map((diet, i) => {
                                    return (
                                       <div key={diet.id} className={`diet${i} diet`}>
                                          <p id={diet.name} onClick={(e) => handlerChooseDiet(e, i)}>{diet.name}</p>
                                       </div>)
                                 })}
                              </div>
                           </div>
                        </div>

                        <div className="inputDescription">
                           <h4>Description: </h4>
                           <textarea type="text" maxLength="500" placeholder='Tell us About Your Recipe...' name="summary" className='summary' onChange={(e) => handleChange(e)} />
                           <h4>Steps: </h4>
                           <textarea name='step' maxLength="500" placeholder='Tell us How to make it...' className='step' onChange={(e) => handleChange(e)} />

                        </div>





                     </div>

                  </div>
                  {/* Form Info */}
                  <div className='formRecipe'>
                     <div className='cardForm cardRow'> {/* Card Recipe */}
                        <h1>See how It's Going</h1>

                        <div className='recipeDetail detailPresentation'>
                           <div className=' detailCard detailColumn'>
                              {input.title && <h3>{input.title}</h3>}

                              <div className=' presentation ' >
                                 <div className='scores'>
                                    <h4>General Score: <span> {`${Math.floor((Number(input.healthScore) + Number(input.score)) / 2)}`} </span></h4>
                                    <div className='others'>
                                       <h5>Health: {input.healthScore}</h5>
                                       <h5>Taste: {input.score}</h5>
                                    </div>
                                 </div>
                                 <img id="img" src={input.image} onError={function handleError(e) {
                                    e.preventDefault();
                                    let img = document.getElementById('img');
                                    img.src = src;
                                    setInput({
                                       ...input,
                                       image: src,
                                    })
                                 }} alt={input.title} />
                                 <div className={`${input.dietTypes?.length >= 3 ? "muchDiets" : null} dietsDetail `}>
                                    <h5>Diets: </h5>
                                    <p>{input.dietTypes && input.dietTypes?.join(", ").toUpperCase()}</p>
                                 </div>

                              </div>
                           </div>
                        </div>
                     </div>

                     <div className='cardRow'>{/* Description Recipe */}
                        <div className='recipeDetail detailDescription'>
                           <div className='detailCard detailColumn'>
                              <div className='description '>
                                 <h3>About this recipe:</h3>
                                 {input.summary && <p>{input.summary}</p>}
                              </div>
                           </div>
                        </div>
                        <div className='recipeDetail '>
                           <div className='stepsDetail detailDescription'>
                              <h3>How to Make This Recipe: </h3>
                              <div className='list'>
                                 {input.steps && input.steps.map((e, i) => (<div key={i} className='step'><p>{e}</p></div>))}
                              </div>
                           </div>
                        </div>
                     </div>


                  </div>
                  <button className='submit' type="submit">Create Recipe</button>
               </div>
            </form>
         </div>
         <Footer />

      </div>

   );

};

export default FormRecipe;
