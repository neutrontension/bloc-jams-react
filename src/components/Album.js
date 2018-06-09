import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      isHovered: false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handleHover(song, index) {
    const playButton = <span className="ion-play"></span>;
    const pauseButton = <span className="ion-pause"></span>;
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying === false && this.state.isHovered === index ) {
      return playButton;
    } else if (this.state.isPlaying === true && this.state.isHovered === index && isSameSong ) {
      return pauseButton;
    } else {
      return (index + 1);
    }
  }

  handlePrevClick() {
    {/* find the index of the current song */}
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    {/* calculate new index by subtractiong one, but not allowing
    index to fall below zero using Math.max */}
    const newIndex = Math.max(0, currentIndex - 1);
    {/* container for previous song in the index */}
    const newSong = this.state.album.songs[newIndex];
    {/* using setSong function for new song */}
    this.setSong(newSong);
    {/* play! */}
    this.play();
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
           {this.state.album.songs.map( (song, index) =>
              <tr className="song" key={index}
              onClick={() => this.handleSongClick(song)}
              onMouseEnter={() => this.setState({ isHovered: index })}
              onMouseLeave={() => this.setState({ isHovered: false })}>
                <td className="song-number">{this.handleHover(song, index)}</td>
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{song.duration}</td>
              </tr>
            )}
          </tbody>
          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
          />
        </table>
      </section>
    );
  }
}

export default Album;
