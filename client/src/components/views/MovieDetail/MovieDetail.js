import React,{useEffect, useState} from 'react';
import {API_KEY,API_URL,IMAGE_BASE_URL} from '../../Config';
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import GridCards from '../commons/GridCards';
import {Row} from 'antd';
import Favorite from './Sections/Favorite';

function MovieDetail(props) {
    let movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [ActorToggle, setActorToggle] = useState(false)

    //클릭시 useEffect로 api에 아이디를 넘겨서 
    //데이터들 받아와 MovieDetail을 만든단
    useEffect(() => {
        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}&language=en-US&page=1`;
        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US&page=1`;

        fetch(endpointInfo)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            setMovie(response);
        })

        fetch(endpointCrew)
        .then(response => response.json())
        .then(response => {
            setCasts(response.cast)
        })
    },[])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    return (
        <div>
            {/*Header*/}
            <MainImage  
                    image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
            />
            {/*Body*/}
            <div style={{width:'85%', margin:'1rem auto'}}>  
                {/*Favorite Button*/}
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')}/>
                </div> 
                {/*Movie Info*/}
                <MovieInfo movie={Movie}/>
            </div>    
            <br/>
            {/*Actor Grid*/}
            <div style={{display:'flex', justifyContent:'center', margin:'2rem'}}>
                <button onClick={toggleActorView}>Toggle Actor View</button>
            </div>

            {ActorToggle &&
            <div style={{width:'85%', margin:'1rem auto'}}>
                <Row gutter={[16,16]}>
                    {Casts && Casts.map((cast, index) => (
                        <React.Fragment key={index}>
                            <GridCards image={cast.profile_path ? 
                                        `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                        characterName={cast.name}
                            />
                        </React.Fragment>
                    ))}
                </Row>
            </div>
            }
        </div>
    )
}

export default MovieDetail

