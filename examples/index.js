import React from 'react';
import ReactDOM from 'react-dom';

import EasyBytes from '../src/js/EasyBytes';

ReactDOM.render(<EasyBytes id="easybytes" />, document.getElementById('mount1'));

ReactDOM.render(<EasyBytes id="easybytes-with-default" defaultValue="3072" />, document.getElementById('mount2'));

ReactDOM.render(<EasyBytes id="easybytes-with-default" defaultValue="3072" inputClass="form-control" selectClass="form-control" />, document.getElementById('mount3'));
