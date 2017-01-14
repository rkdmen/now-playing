import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { getNowPlayingList } from '../actions/movieActions';
import NowPlayingDetailContainer from './NowPlayingDetailContainer';

class NowPlayingContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          nowPlayingList:[],
          page:1,
          disableBtn:true
        };
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }
    componentDidMount() {
      this.props.getNowPlayingList(1);
    }
    componentWillReceiveProps(nextProps) {
      console.log(nextProps, ' next prop updated' );
      this.setState({nowPlayingList:nextProps.nowPlayingList})
    }

    nextPage(){
  window.scrollTo(0, 0)
      this.setState({page:this.state.page+1})
      this.props.getNowPlayingList(this.state.page+1);
      this.setState({disableBtn:false})

    }

    prevPage(){
  window.scrollTo(0, 0)
      if(this.state.page === 1){
        this.setState({disableBtn:true})
        return;
      } else {
        this.setState({page:this.state.page-1})
        this.props.getNowPlayingList(this.state.page-1)
        .then(()=>{
          if(this.state.page === 1){
          console.log('disabled BTN!!')
          this.setState({disableBtn:true})
          }
        })
      }
    }

    render() {
      console.log(this.state, ' this state, nowPlaying')
      return (
        <div className="nowPlayingContainer">

            {!this.state.nowPlayingList ? 'Loading...':
            this.state.nowPlayingList.map((movie, i)=>{
              if(movie.poster_path === null){
                /*For beauty purpose of my app, if poster data is not available
                I decided not to include onto my app.
                  */
                return ;
              } else return (
                <NowPlayingDetailContainer
                  key={i}
                  id={movie.id}
                  title={movie.original_title}
                  overview={movie.overview}
                  poster={movie.poster_path}
                  backPoster={movie.backdrop_path}
                />
              )
            })
          }
          <div className="emptySpace"></div>
          <div className="btnGroup">
            <Button className='btn btn-default btn-lg next' disabled={this.state.disableBtn} onClick={this.prevPage}>Prev</Button>
            <Button className='btn btn-default btn-lg next' onClick={this.nextPage}>Next</Button>
          </div>

        </div>
        )
    }

}

NowPlayingContainer.propTypes = {
    getNowPlayingList: React.PropTypes.func
}

function mapStateToProps(state) {
  console.log(state, ' state movieContainer')
    return {
      nowPlayingList: state.reducer.movie.movieList
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getNowPlayingList }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingContainer);
