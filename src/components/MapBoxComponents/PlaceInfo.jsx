import React, { Component } from 'react';


export default class CityInfo extends Component {



  render() {
    const { info } = this.props;
    const { iconButton } = this.props;
    const displayName = `${info.name}`;

    return (
      <div className='pop-up-inside-content'>
        <div>
          <span className='popup-label'>{displayName}</span> |{' '}

          <button className="icon icon-location" onClick={iconButton}/>
          <a className="icon icon-info-with-circle" target="_new" href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`} />

        </div>
        <img width={240} src={info.image} />
      </div>
    );
  }
}