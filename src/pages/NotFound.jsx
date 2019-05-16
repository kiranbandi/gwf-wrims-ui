import React, { Component } from 'react';

export default class NotFound extends Component {
	render() {
		return (
			<div className='not-found container m-t'>
				<div className="alert alert-danger text-center" role="alert">
					<h3><strong>Error 404 ! Page not found or is under construction ... </strong></h3>
				</div>
			</div>
		)
	}
};
