import React, { Component } from 'react';

export default class CityInfo extends Component {
  render() {
    const { info } = this.props;
    const displayName = `${info.name}`;

    return (
      <div>
        <div>
          <span className='popup-label'>{displayName}</span> |{' '}
          <a target="_new" href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}>
           Wikipedia
          </a>
        </div>
        <img width={240} src={info.image} />
      </div>
    );
  }
}